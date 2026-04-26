import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'
import { validateEmail, validatePhone } from '@/lib/security'

// ── POST /api/bookings ─────────────────────────────────────────────────
// DEMO_MODE: creates booking with session_date/session_time (TEXT fields)
// Real mode: same + Stripe deposit
export async function POST(request: Request) {
  const body = await request.json()
  const { session_id, session_date, session_time, student_name, student_email, student_phone } = body

  if (!session_date || !session_time || !student_name || !student_email) {
    return NextResponse.json(
      { error: 'session_date, session_time, student_name, and student_email are required' },
      { status: 400 }
    )
  }

  const emailCheck = validateEmail(student_email)
  if (!emailCheck.valid) {
    return new NextResponse(emailCheck.error, { status: 400 })
  }

  if (student_phone) {
    const phoneCheck = validatePhone(student_phone)
    if (!phoneCheck.valid) {
      return new NextResponse(phoneCheck.error, { status: 400 })
    }
  }

  const supabase = await createClient()
  const supabaseAdmin = getSupabaseAdmin()

  // Resolve session if session_id provided
  let session: Record<string, unknown> | null = null
  if (session_id) {
    const { data } = await supabaseAdmin
      .from('sessions')
      .select('id, school_id, start_date, max_seats, seats_booked, session_type_id, instructor_id, location, status')
      .eq('id', session_id)
      .eq('status', 'scheduled')
      .single()
    session = data
    if (!session) {
      return NextResponse.json({ error: 'Session not found or not available' }, { status: 404 })
    }
    if ((session.seats_booked as number) >= (session.max_seats as number)) {
      return NextResponse.json({ error: 'This session is fully booked' }, { status: 409 })
    }
  }

  // Check for duplicate booking
  const { data: existing } = await supabaseAdmin
    .from('bookings')
    .select('id')
    .eq('session_date', session_date)
    .eq('session_time', session_time)
    .eq('student_email', student_email)
    .in('status', ['pending', 'confirmed'])
    .single()

  if (existing) {
    return NextResponse.json({ error: 'You have already booked this session' }, { status: 409 })
  }

  // Deposit amount (from session_type or default $25)
  let depositAmount = 2500
  if (session?.session_type_id) {
    const { data: sessionType } = await supabaseAdmin
      .from('session_types')
      .select('deposit_cents')
      .eq('id', session.session_type_id as string)
      .maybeSingle()
    if (sessionType?.deposit_cents) depositAmount = sessionType.deposit_cents
  }

  const bookingToken = crypto.randomUUID()

  // Build insert payload — actual columns only
  const insertPayload: Record<string, unknown> = {
    student_name,
    student_email,
    student_phone: student_phone ?? null,
    session_date,
    session_time,
    status: depositAmount > 0 ? 'pending' : 'confirmed',
    booking_token: bookingToken,
    payment_status: depositAmount > 0 ? 'pending' : 'paid',
  }

  if (session_id) insertPayload.session_id = session_id
  if (session) {
    insertPayload.school_id = session.school_id
    insertPayload.session_type_id = session.session_type_id
    insertPayload.instructor_id = session.instructor_id
  }

  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .insert(insertPayload)
    .select()
    .single()

  if (bookingError) {
    console.error('Booking insert error:', bookingError)
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  if (session?.school_id) {
    await supabaseAdmin.from('audit_logs').insert(
      auditLog('BOOKING_CREATED', student_email, {
        booking_id: booking.id,
        session_id: session_id ?? null,
        school_id: session.school_id,
        deposit_cents: depositAmount,
      })
    )
  }

  const needsPayment = depositAmount > 0

  return NextResponse.json({
    booking_id: booking.id,
    booking_token: bookingToken,
    status: needsPayment ? 'pending_payment' : 'confirmed',
    deposit_amount_cents: depositAmount,
    next_steps: needsPayment
      ? 'Redirect to Stripe checkout to pay deposit'
      : 'Booking confirmed',
  }, { status: 201 })
}

// ── GET /api/bookings?school_id=X ─────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')
  const status = searchParams.get('status')

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Ownership check
  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('id', schoolId)
    .eq('owner_email', user.email)
    .single()
  if (!school) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let query = supabase
    .from('bookings')
    .select(`
      id,
      student_name,
      student_email,
      student_phone,
      status,
      payment_status,
      booking_token,
      session_date,
      session_time,
      created_at,
      reminder_48h_sent,
      reminder_4h_sent
    `)
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data: bookings, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(bookings ?? [])
}