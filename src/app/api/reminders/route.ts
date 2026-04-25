import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendLessonReminderSMS, sendFinalReminderSMS } from '@/lib/twilio'
import { sendEmail, isEmailConfigured } from '@/lib/email'
import { reminder48hEmail } from '@/lib/email-templates/reminder-48h'
import { reminder4hEmail } from '@/lib/email-templates/reminder-4h'

// ── GET /api/reminders ─────────────────────────────────────────────────
// Cron hits this every hour. Fires 48h + 4h SMS + email reminders.
// Called with no school_id → runs for all schools (service role context).
export async function GET(request: Request) {
  const supabase = await createClient()
  const now = new Date()
  const in72h = new Date(now.getTime() + 72 * 60 * 60 * 1000)
  const schoolId = new URL(request.url).searchParams.get('school_id')

  // Build query: confirmed bookings for sessions in next 72h
  let query = supabase
    .from('bookings')
    .select(`
      id,
      student_name,
      student_email,
      student_phone,
      reminder_48h_sent,
      reminder_4h_sent,
      status,
      reschedule_token,
      session:session_id (
        id,
        start_date,
        start_time,
        location,
        school_id,
        session_type:session_type_id ( name )
      )
    `)
    .eq('status', 'confirmed')
    .gte('session.start_date', now.toISOString().split('T')[0])
    .lte('session.start_date', in72h.toISOString().split('T')[0])

  if (schoolId) {
    query = query.eq('session.school_id', schoolId)
  }

  const { data: bookings, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let sent48hEmail = 0, sent48hSMS = 0
  let sent4hEmail = 0, sent4hSMS = 0
  let skipped = 0

  for (const booking of bookings ?? []) {
    if (!booking.session) { skipped++; continue }

    const session = booking.session as any
    const sessionStart = new Date(`${session.start_date}T${session.start_time}`)
    const hoursUntil = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60)
    const lessonType = session.session_type?.name ?? 'Driving Lesson'

    // ── 48h reminder ─────────────────────────────────────────────────
    if (hoursUntil <= 48 && hoursUntil > 4 && !booking.reminder_48h_sent) {
      const didSMS = await send48hReminder(booking, session, lessonType, 'sms')
      if (didSMS) sent48hSMS++

      const didEmail = await send48hReminder(booking, session, lessonType, 'email')
      if (didEmail) sent48hEmail++

      if (didSMS || didEmail) {
        await supabase.from('bookings').update({ reminder_48h_sent: true }).eq('id', booking.id)
      } else { skipped++ }

    // ── 4h reminder ──────────────────────────────────────────────────
    } else if (hoursUntil <= 4 && hoursUntil > 0 && !booking.reminder_4h_sent) {
      const didSMS = await send4hReminder(booking, session, lessonType, 'sms')
      if (didSMS) sent4hSMS++

      const didEmail = await send4hReminder(booking, session, lessonType, 'email')
      if (didEmail) sent4hEmail++

      if (didSMS || didEmail) {
        await supabase.from('bookings').update({ reminder_4h_sent: true }).eq('id', booking.id)
      } else { skipped++ }

    } else {
      skipped++
    }
  }

  return NextResponse.json({
    checked: (bookings ?? []).length,
    sent_48h: { sms: sent48hSMS, email: sent48hEmail },
    sent_4h: { sms: sent4hSMS, email: sent4hEmail },
    skipped,
    email_configured: isEmailConfigured(),
    strategy: '48h + 4h two-touch SMS + email',
  })
}

// ── POST /api/reminders ───────────────────────────────────────────────
// Alias for cron (some cron systems POST instead of GET)
export async function POST() {
  // Cron calls POST — same logic, no school_id (runs all schools)
  return GET(new Request('https://the-driving-center-website.vercel.app/api/reminders', {
    headers: { 'Content-Type': 'application/json' },
  }))
}

// ── 48h reminder helpers ───────────────────────────────────────────────

async function send48hReminder(
  booking: Record<string, unknown>,
  session: Record<string, unknown>,
  lessonType: string,
  channel: 'sms' | 'email'
): Promise<boolean> {
  const studentName = String(booking.student_name ?? 'Student')
  const studentPhone = String(booking.student_phone ?? '')
  const studentEmail = String(booking.student_email ?? '')
  const date = String(session.start_date ?? '')
  const time = String(session.start_time ?? '')
  const location = String(session.location ?? '')
  const rescheduleToken = String(booking.reschedule_token ?? '')

  if (channel === 'sms' && studentPhone) {
    await sendLessonReminderSMS(studentPhone, studentName, lessonType, date, time, location)
    return true
  }

  if (channel === 'email' && studentEmail && isEmailConfigured()) {
    const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    })
    const rescheduleUrl = `https://the-driving-center-website.vercel.app/book?session=${session.id}&reschedule=${rescheduleToken}`
    const email = reminder48hEmail({
      studentName,
      lessonType,
      schoolName: 'The Driving Center',
      date: formattedDate,
      time,
      location,
      confirmUrl: `https://the-driving-center-website.vercel.app/book/confirmation?token=${booking.id}`,
      rescheduleUrl,
    })
    await sendEmail({ to: studentEmail, subject: email.subject, html: email.html })
    return true
  }

  if (channel === 'email' && studentEmail && !isEmailConfigured()) {
    // Stub mode: log what would be sent
    console.log(`[Reminder STUB] 48h email → ${studentEmail} | ${lessonType} | ${date} at ${time}`)
    return true // count as sent (stub)
  }

  return false
}

async function send4hReminder(
  booking: Record<string, unknown>,
  session: Record<string, unknown>,
  lessonType: string,
  channel: 'sms' | 'email'
): Promise<boolean> {
  const studentName = String(booking.student_name ?? 'Student')
  const studentPhone = String(booking.student_phone ?? '')
  const studentEmail = String(booking.student_email ?? '')
  const date = String(session.start_date ?? '')
  const time = String(session.start_time ?? '')
  const location = String(session.location ?? '')

  if (channel === 'sms' && studentPhone) {
    await sendFinalReminderSMS(studentPhone, studentName, lessonType, date, time, location)
    return true
  }

  if (channel === 'email' && studentEmail && isEmailConfigured()) {
    const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric',
    })
    const email = reminder4hEmail({
      studentName,
      lessonType,
      schoolName: 'The Driving Center',
      schoolPhone: '865-555-0100', // TODO: pull from schools table
      date: formattedDate,
      time,
      location,
    })
    await sendEmail({ to: studentEmail, subject: email.subject, html: email.html })
    return true
  }

  if (channel === 'email' && studentEmail && !isEmailConfigured()) {
    console.log(`[Reminder STUB] 4h email → ${studentEmail} | ${lessonType} | TODAY at ${time}`)
    return true
  }

  return false
}