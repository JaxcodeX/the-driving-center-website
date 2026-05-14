import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'
import { validateRequired, validatePositiveInt } from '@/lib/validation'

// ── POST /api/bookings ─────────────────────────────────────────────────
export async function POST(request: Request) {
  const body = await request.json()
  const { session_id, session_date, session_time, student_name, student_email, student_phone } = body

  // Require session_id for new booking (must pick a specific session)
  if (!session_id) {
    return NextResponse.json({ error: 'session_id is required to book a slot' }, { status: 400 })
  }

  // ── Input validation ──
  try {
    validateRequired(body, ['session_date', 'session_time', 'student_name', 'student_email'])
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(student_email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Phone digits check
  if (student_phone) {
    const digits = student_phone.replace(/\D/g, '')
    if (digits.length < 10) {
      return NextResponse.json({ error: 'Phone number must have at least 10 digits' }, { status: 400 })
    }
  }

  const admin: any = getSupabaseAdmin()
  let depositAmount = 2500
  let sessionSchoolId: string | null = null

  // Resolve session metadata (deposit amount, school) before atomic booking
  if (session_id) {
    const { data: rawSession } = await admin
      .from('sessions')
      .select('id, school_id, seats_booked, max_seats, session_type_id')
      .eq('id', session_id)
      .eq('status', 'scheduled')
      .single()

    if (!rawSession) {
      return NextResponse.json({ error: 'Session not found or not available' }, { status: 404 })
    }

    sessionSchoolId = rawSession.school_id

    // Get deposit from session type
    if (rawSession.session_type_id) {
      const { data: st } = await admin
        .from('session_types')
        .select('deposit_cents')
        .eq('id', rawSession.session_type_id)
        .maybeSingle()
      if (st?.deposit_cents) depositAmount = st.deposit_cents
    }
  }

  // Check for duplicate booking (idempotency)
  const { data: existing } = await admin
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

  const bookingToken = crypto.randomUUID()
  const status = depositAmount > 0 ? 'pending' : 'confirmed'
  const paymentStatus = depositAmount > 0 ? 'pending' : 'paid'

  // ── Atomic seat booking via PostgreSQL function (race-condition safe) ──
  // book_seat() acquires a row lock on the session, checks seats, inserts booking,
  // and increments seats_booked — all in one atomic transaction.
  let bookingId: string
  try {
    const { data, error: rpcError } = await admin.rpc('book_seat', {
      p_session_id: session_id ?? null,
      p_student_name: student_name,
      p_student_email: student_email,
      p_student_phone: student_phone ?? null,
      p_session_date: session_date,
      p_session_time: session_time,
      p_status: status,
      p_payment_status: paymentStatus,
      p_deposit_cents: depositAmount,
      p_school_id: sessionSchoolId,
      p_session_type_id: null,
      p_instructor_id: null,
      p_booking_token: bookingToken,
    })

    if (rpcError) {
      // PostgreSQL raised an exception
      const msg = (rpcError as any).message ?? ''
      if (msg.includes('SESSION_FULL')) {
        return NextResponse.json({ error: 'This session is fully booked' }, { status: 409 })
      }
      if (msg.includes('SESSION_NOT_FOUND')) {
        return NextResponse.json({ error: 'Session not found or not available' }, { status: 404 })
      }
      console.error('book_seat RPC error:', rpcError)
      return NextResponse.json({ error: 'Booking failed — please try again' }, { status: 500 })
    }

    bookingId = data as string
  } catch (e) {
    console.error('book_seat exception:', e)
    return NextResponse.json({ error: 'Booking failed — please try again' }, { status: 500 })
  }

  // Audit log
  if (sessionSchoolId) {
    await admin.from('audit_logs').insert(
      auditLog('BOOKING_CREATED', student_email, {
        booking_id: bookingId,
        session_id: session_id ?? null,
        school_id: sessionSchoolId,
        deposit_cents: depositAmount,
      })
    )
  }

  return NextResponse.json({
    booking_id: bookingId,
    booking_token: bookingToken,
    status: depositAmount > 0 ? 'pending_payment' : 'confirmed',
    deposit_amount_cents: depositAmount,
    next_steps: depositAmount > 0 ? 'Redirect to Stripe checkout' : 'Booking confirmed',
  }, { status: 201 })
}

// ── GET /api/bookings?school_id=X ─────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')
  const status = searchParams.get('status')

  if (!schoolId) return NextResponse.json({ error: 'school_id required' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('id', schoolId)
    .eq('owner_email', user.email)
    .single()
  if (!school) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin: any = getSupabaseAdmin()
  let query: any = admin
    .from('bookings')
    .select('id, student_name, student_email, student_phone, status, payment_status, booking_token, session_date, session_time, created_at, reminder_48h_sent, reminder_4h_sent')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data: bookings, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(bookings ?? [])
}
