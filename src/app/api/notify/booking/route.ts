import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { sendBookingConfirmationEmail } from '@/lib/email'

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY required')
  return createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { studentEmail, studentName, sessionId, schoolId } = body

  if (!studentEmail || !sessionId) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Get session + school info
  const { data: session } = await supabaseAdmin
    .from('sessions')
    .select('start_date, start_time, location, school_id, session_type_id, max_seats, seats_booked')
    .eq('id', sessionId)
    .single()

  if (!session) return new NextResponse('Session not found', { status: 404 })

  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('name, phone, slug')
    .eq('id', session.school_id)
    .single()

  // Get session type name
  const { data: sessionType } = await supabaseAdmin
    .from('session_types')
    .select('name')
    .eq('id', session.session_type_id)
    .single()

  // Get booking to find reschedule/cancel token
  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('id, reschedule_token, cancel_token')
    .eq('session_id', sessionId)
    .eq('student_email', studentEmail)
    .single()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const schoolSlug = school?.slug ?? ''

  const rescheduleUrl = booking?.reschedule_token
    ? `${appUrl}/book/reschedule/${booking.reschedule_token}`
    : `${appUrl}/school/${schoolSlug}`
  const cancelUrl = booking?.cancel_token
    ? `${appUrl}/book/cancel/${booking.cancel_token}`
    : `${appUrl}/school/${schoolSlug}`

  const formattedDate = new Date(`${session.start_date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  try {
    await sendBookingConfirmationEmail(
      studentEmail,
      studentName ?? 'Student',
      sessionType?.name ?? 'Driving Lesson',
      school?.name ?? 'The Driving Center',
      school?.phone ?? '',
      formattedDate,
      session.start_time ?? '',
      session.location ?? 'Contact your instructor',
      rescheduleUrl,
      cancelUrl
    )
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Booking email send failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}