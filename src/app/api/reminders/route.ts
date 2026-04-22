import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendLessonReminderSMS } from '@/lib/twilio'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check sessions starting in the next 72 hours that haven't been reminded
  const now = new Date()
  const in72h = new Date(now.getTime() + 72 * 60 * 60 * 1000)

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('id, start_date, start_time, location, school_id')
    .eq('cancelled', false)
    .gte('start_date', now.toISOString().split('T')[0])
    .lte('start_date', in72h.toISOString().split('T')[0])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent72h = 0
  let sent24h = 0

  for (const session of sessions ?? []) {
    const sessionStart = new Date(`${session.start_date}T${session.start_time}`)
    const hoursUntil = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60)

    // Get students for this session who haven't received the reminder
    const { data: students } = await supabase
      .from('students_driver_ed')
      .select('id, parent_email, emergency_contact_phone')
      .eq('class_session_id', session.id)

    for (const student of students ?? []) {
      if (!student.parent_email) continue

      if (hoursUntil <= 72 && hoursUntil > 24) {
        // 72h reminder
        await sendLessonReminderSMS(
          student.emergency_contact_phone ?? student.parent_email,
          'Student',
          'The Driving Center',
          session.start_date,
          session.start_time
        )
        sent72h++
      } else if (hoursUntil <= 24 && hoursUntil > 0) {
        // 24h reminder
        await sendLessonReminderSMS(
          student.emergency_contact_phone ?? student.parent_email,
          'Student',
          'The Driving Center',
          session.start_date,
          session.start_time
        )
        sent24h++
      }
    }
  }

  return NextResponse.json({
    checked: (sessions ?? []).length,
    sent_72h: sent72h,
    sent_24h: sent24h,
  })
}
