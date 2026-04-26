import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { isEmailConfigured } from '@/lib/email'
import { reminder48hEmail } from '@/lib/email-templates/reminder-48h'
import { reminder4hEmail } from '@/lib/email-templates/reminder-4h'

// ── GET /api/reminders ─────────────────────────────────────────────────
// Cron hits this every hour. Fires 48h + 4h email reminders.
// Uses service role (getSupabaseAdmin) — bypasses RLS.
export async function GET(request: Request) {
  const supabase = getSupabaseAdmin() as any
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  // Fetch confirmed bookings with session_time set (denormalized field)
  const { data: confirmedBookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, student_name, student_email, student_phone, reminder_48h_sent, reminder_4h_sent, status, session_time')
    .eq('status', 'confirmed')
    .not('session_time', 'is', null)

  if (bookingsError) return NextResponse.json({ error: bookingsError.message }, { status: 500 })

  const bookings = confirmedBookings ?? []
  if (bookings.length === 0) {
    return NextResponse.json({
      checked: 0, sent_48h: { sms: 0, email: 0 }, sent_4h: { sms: 0, email: 0 },
      skipped: 0, strategy: '48h + 4h email (DEMO_MODE)',
    })
  }

  // Fetch today's sessions for location lookup
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, start_date, location, school_id, max_seats')
    .in('start_date', [today])

  const sessionsByStartDate: Record<string, any> = {}
  sessions?.forEach((s: any) => { sessionsByStartDate[s.start_date] = s })

  let sent48hEmail = 0, sent48hSMS = 0
  let sent4hEmail = 0, sent4hSMS = 0
  let skipped = 0

  for (const booking of bookings) {
    // Derive session date from session_time (format: 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm')
    const sessionDateStr = (booking.session_time || '').split('T')[0]
    const session = sessionsByStartDate[sessionDateStr]

    if (!session) { skipped++; continue }

    // Calculate hours until session
    const sessionDateTime = new Date(sessionDateStr + 'T12:00:00')
    const hoursUntil = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    // Skip if in the past or more than 72h away
    if (hoursUntil < 0 || hoursUntil > 72) { skipped++; continue }

    // ── 48h reminder ─────────────────────────────────────────────────
    if (hoursUntil <= 48 && hoursUntil > 4 && !booking.reminder_48h_sent) {
      const didSMS = await sendReminder(booking, session, 'Driving Lesson', 'sms', '48h')
      if (didSMS) sent48hSMS++
      const didEmail = await sendReminder(booking, session, 'Driving Lesson', 'email', '48h')
      if (didEmail) sent48hEmail++
      if (didSMS || didEmail) {
        await supabase.from('bookings').update({ reminder_48h_sent: true }).eq('id', booking.id)
      } else { skipped++ }

    // ── 4h reminder ──────────────────────────────────────────────────
    } else if (hoursUntil <= 4 && hoursUntil > 0 && !booking.reminder_4h_sent) {
      const didSMS = await sendReminder(booking, session, 'Driving Lesson', 'sms', '4h')
      if (didSMS) sent4hSMS++
      const didEmail = await sendReminder(booking, session, 'Driving Lesson', 'email', '4h')
      if (didEmail) sent4hEmail++
      if (didSMS || didEmail) {
        await supabase.from('bookings').update({ reminder_4h_sent: true }).eq('id', booking.id)
      } else { skipped++ }
    } else {
      skipped++
    }
  }

  return NextResponse.json({
    checked: bookings.length,
    sent_48h: { sms: sent48hSMS, email: sent48hEmail },
    sent_4h: { sms: sent4hSMS, email: sent4hEmail },
    skipped,
    email_configured: isEmailConfigured(),
    strategy: '48h + 4h two-touch SMS + email (DEMO_MODE)',
  })
}

// ── POST /api/reminders ───────────────────────────────────────────────
export async function POST() {
  return GET(new Request('https://the-driving-center-website.vercel.app/api/reminders', {
    headers: { 'Content-Type': 'application/json' },
  }))
}

// ── Reminder sender ───────────────────────────────────────────────────
async function sendReminder(
  booking: Record<string, unknown>,
  session: Record<string, unknown>,
  lessonType: string,
  channel: 'sms' | 'email',
  type: '48h' | '4h'
): Promise<boolean> {
  const studentPhone = String(booking.student_phone ?? '')
  const studentEmail = String(booking.student_email ?? '')
  const date = String(session.start_date ?? '')
  const location = String(session.location ?? '')

  if (channel === 'sms' && studentPhone) {
    console.log(`[Reminder SMS] ${type} → ${studentPhone} | ${lessonType} | ${date}`)
    return true
  }

  if (channel === 'email' && studentEmail && isEmailConfigured()) {
    const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    })
    const email = type === '48h'
      ? reminder48hEmail({
          studentName: String(booking.student_name ?? 'Student'),
          lessonType,
          schoolName: 'The Driving Center',
          date: formattedDate,
          time: '12:00 PM',
          location,
          confirmUrl: `https://the-driving-center-website.vercel.app/book/confirmation?token=${booking.id}`,
          rescheduleUrl: `https://the-driving-center-website.vercel.app/book?session=${session.id}`,
        })
      : reminder4hEmail({
          studentName: String(booking.student_name ?? 'Student'),
          lessonType,
          schoolName: 'The Driving Center',
          schoolPhone: '865-555-0100',
          date: formattedDate,
          time: '12:00 PM',
          location,
        })
    const { sendEmail } = await import('@/lib/email')
    await sendEmail({ to: studentEmail, subject: email.subject, html: email.html })
    return true
  }

  if (channel === 'email' && studentEmail && !isEmailConfigured()) {
    console.log(`[Reminder STUB] ${type} email → ${studentEmail} | ${lessonType} | ${date}`)
    return true
  }

  return false
}