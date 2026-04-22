import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendLessonReminderSMS } from '@/lib/twilio'

// 48h + 4h reminder strategy (proven optimal from research)
// No reminders >72h out (ignored) or <2h out (too late)

export async function GET() {
  const supabase = await createClient()
  const now = new Date()

  // Get all confirmed bookings for sessions coming up in the next 72h
  const in72h = new Date(now.getTime() + 72 * 60 * 60 * 1000)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      student_name,
      student_email,
      student_phone,
      reminder_48h_sent,
      reminder_4h_sent,
      status,
      session:session_id (
        id,
        start_date,
        start_time,
        location,
        school_id,
        session_type:session_type_id (
          name
        )
      )
    `)
    .eq('status', 'confirmed')
    .gte('session.start_date', now.toISOString().split('T')[0])
    .lte('session.start_date', in72h.toISOString().split('T')[0]) as any

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent48h = 0
  let sent4h = 0
  let skipped = 0

  for (const booking of bookings ?? []) {
    if (!booking.session || !booking.student_phone) {
      skipped++
      continue
    }

    const sessionStart = new Date(`${booking.session.start_date}T${booking.session.start_time}`)
    const hoursUntil = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntil <= 48 && hoursUntil > 4 && !booking.reminder_48h_sent) {
      // 48-hour reminder
      await sendLessonReminderSMS(
        booking.student_phone,
        booking.student_name,
        (booking.session as any).session_type?.name ?? 'Driving Lesson',
        booking.session.start_date,
        booking.session.start_time,
        (booking.session as any).location ?? ''
      )

      await supabase
        .from('bookings')
        .update({ reminder_48h_sent: true })
        .eq('id', booking.id)

      sent48h++
    } else if (hoursUntil <= 4 && hoursUntil > 0 && !booking.reminder_4h_sent) {
      // 4-hour reminder (final)
      await sendLessonReminderSMS(
        booking.student_phone,
        booking.student_name,
        (booking.session as any).session_type?.name ?? 'Driving Lesson',
        booking.session.start_date,
        booking.session.start_time,
        (booking.session as any).location ?? ''
      )

      await supabase
        .from('bookings')
        .update({ reminder_4h_sent: true })
        .eq('id', booking.id)

      sent4h++
    } else {
      skipped++
    }
  }

  return NextResponse.json({
    checked: (bookings ?? []).length,
    sent_48h: sent48h,
    sent_4h: sent4h,
    skipped,
    strategy: '48h + 4h two-touch SMS',
    target_no_show_rate: '3-7%',
  })
}

// Cron endpoint — called by OpenClaw every hour
export async function POST() {
  return GET()
}
