import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'
import { validateEmail, validatePhone } from '@/lib/security'
import crypto from 'crypto'

export async function POST(request: Request) {
  const body = await request.json()
  const {
    session_id,
    student_name,
    student_email,
    student_phone,
  } = body

  if (!session_id || !student_name || !student_email) {
    return NextResponse.json(
      { error: 'session_id, student_name, and student_email are required' },
      { status: 400 }
    )
  }

  // Validate inputs
  const emailCheck = validateEmail(student_email)
  if (!emailCheck.valid) {
    return NextResponse.json({ error: emailCheck.error }, { status: 400 })
  }

  if (student_phone) {
    const phoneCheck = validatePhone(student_phone)
    if (!phoneCheck.valid) {
      return NextResponse.json({ error: phoneCheck.error }, { status: 400 })
    }
  }

  const supabase = await createClient()
  const supabaseAdmin = await createClient()

  // Get session details
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id, school_id, start_date, start_time, max_seats, seats_booked, session_type_id, instructor_id, location')
    .eq('id', session_id)
    .eq('cancelled', false)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found or cancelled' }, { status: 404 })
  }

  // Check capacity
  if (session.seats_booked >= session.max_seats) {
    return NextResponse.json({ error: 'This session is fully booked' }, { status: 409 })
  }

  // Check for duplicate booking (same session + email)
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('session_id', session_id)
    .eq('student_email', student_email)
    .in('status', ['pending', 'confirmed'])
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You have already booked this session' }, { status: 409 })
  }

  // Get session type for deposit amount
  const { data: sessionType } = await supabase
    .from('session_types')
    .select('name, deposit_cents, price_cents')
    .eq('id', session.session_type_id)
    .single()

  const depositCents = sessionType?.deposit_cents ?? 2500

  // Generate secure confirmation token
  const confirmationToken = crypto.randomBytes(32).toString('hex')

  // Create booking
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .insert({
      session_id,
      student_name,
      student_email,
      student_phone: student_phone ?? null,
      status: depositCents > 0 ? 'pending' : 'confirmed',
      deposit_amount_cents: depositCents,
      confirmation_token: confirmationToken,
    })
    .select()
    .single()

  if (bookingError) {
    console.error('Booking insert error:', bookingError)
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  // Increment seats_booked
  await supabaseAdmin
    .from('sessions')
    .update({ seats_booked: session.seats_booked + 1 })
    .eq('id', session_id)

  // Audit log
  await supabaseAdmin.from('audit_logs').insert(
    auditLog('BOOKING_CREATED', student_email, {
      booking_id: booking.id,
      session_id,
      school_id: session.school_id,
      deposit_cents: depositCents,
    })
  )

  return NextResponse.json({
    booking_id: booking.id,
    confirmation_token: confirmationToken,
    status: depositCents > 0 ? 'pending_payment' : 'confirmed',
    deposit_amount_cents: depositCents,
    next_steps: depositCents > 0
      ? 'Redirect to Stripe checkout to pay deposit'
      : 'Booking confirmed',
  }, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')
  const status = searchParams.get('status')

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id required' }, { status: 400 })
  }

  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(`
      id,
      student_name,
      student_email,
      student_phone,
      status,
      deposit_amount_cents,
      deposit_paid_at,
      created_at,
      cancellation_reason,
      cancelled_at,
      session:session_id (
        id,
        start_date,
        start_time,
        location,
        session_type:session_type_id (
          name,
          duration_minutes,
          color
        ),
        instructor:instructor_id (
          name
        )
      )
    `)
    .eq('session.school_id', schoolId)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: bookings, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(bookings ?? [])
}
