import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const now = new Date()
  const in72h = new Date(now.getTime() + 72 * 60 * 60 * 1000)

  // Find sessions needing reminders
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

    const { data: students } = await supabase
      .from('students_driver_ed')
      .select('id, parent_email, emergency_contact_phone, reminder_sent_72h, reminder_sent_24h')
      .eq('class_session_id', session.id)

    for (const student of students ?? []) {
      const phone = student.emergency_contact_phone ?? student.parent_email
      if (!phone) continue

      if (hoursUntil <= 72 && hoursUntil > 24 && !student.reminder_sent_72h) {
        // Would send via Twilio in real implementation
        sent72h++
        // await supabase.from('students_driver_ed').update({ reminder_sent_72h: true }).eq('id', student.id)
      } else if (hoursUntil <= 24 && hoursUntil > 0 && !student.reminder_sent_24h) {
        sent24h++
        // await supabase.from('students_driver_ed').update({ reminder_sent_24h: true }).eq('id', student.id)
      }
    }
  }

  return NextResponse.json({
    checked: (sessions ?? []).length,
    to_send_72h: sent72h,
    to_send_24h: sent24h,
  })
}