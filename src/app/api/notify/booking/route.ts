import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBookingConfirmationEmail } from '@/lib/email'

export async function POST(request: Request) {
  const body = await request.json()
  const { studentEmail, studentName, schoolId, sessionId } = body

  if (!studentEmail || !sessionId) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  const supabase = await createClient()
  const supabaseAdmin = await createClient()

  // Get session + school info
  const { data: session } = await supabaseAdmin
    .from('sessions')
    .select('start_date, start_time, location, school_id')
    .eq('id', sessionId)
    .single()

  if (!session) return new NextResponse('Session not found', { status: 404 })

  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('name')
    .eq('id', session.school_id)
    .single()

  try {
    await sendBookingConfirmationEmail(
      studentEmail,
      studentName ?? 'Student',
      school?.name ?? 'The Driving Center',
      session.start_date,
      session.start_time,
      session.location ?? 'the school'
    )
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}