import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { sendBookingConfirmationEmail } from '@/lib/email'

export async function POST(request: Request) {
  const body = await request.json()
  const { studentEmail, studentName, sessionId, bookingId } = body

  if (!studentEmail || (!sessionId && !bookingId)) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Get booking details (uses session_date/session_time TEXT fields)
  let booking: Record<string, unknown> | null = null
  if (bookingId) {
    const { data } = await supabaseAdmin
      .from('bookings')
      .select('id, student_name, session_date, session_time, booking_token, school_id')
      .eq('id', bookingId)
      .single()
    booking = data
  } else {
    const { data } = await supabaseAdmin
      .from('bookings')
      .select('id, student_name, session_date, session_time, booking_token, school_id')
      .eq('session_id', sessionId)
      .eq('student_email', studentEmail)
      .single()
    booking = data
  }

  if (!booking) return new NextResponse('Booking not found', { status: 404 })

  const schoolId = booking.school_id as string

  // Get school info
  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('name, phone, slug')
    .eq('id', schoolId)
    .single()

  // Use session_date + session_time from booking (TEXT fields)
  const sessionDate = String(booking.session_date ?? '')
  const sessionTime = String(booking.session_time ?? '')
  const bookingToken = booking.booking_token as string

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const schoolSlug = school?.slug ?? ''

  const rescheduleUrl = bookingToken
    ? `${appUrl}/book/reschedule/${bookingToken}`
    : `${appUrl}/school/${schoolSlug}`
  const cancelUrl = bookingToken
    ? `${appUrl}/book/cancel/${bookingToken}`
    : `${appUrl}/school/${schoolSlug}`

  const formattedDate = sessionDate
    ? new Date(`${sessionDate}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      })
    : 'TBD'

  try {
    await sendBookingConfirmationEmail(
      studentEmail,
      studentName ?? (booking.student_name as string) ?? 'Student',
      'Driving Lesson',
      school?.name ?? 'The Driving Center',
      school?.phone ?? '',
      formattedDate,
      sessionTime,
      '',
      rescheduleUrl,
      cancelUrl
    )
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Booking email send failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}