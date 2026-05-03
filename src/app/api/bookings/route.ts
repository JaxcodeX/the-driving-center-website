import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'
import { validateEmail, validatePhone } from '@/lib/security'
import { isLikelyValidEmail } from '@/lib/email'

// ── POST /api/bookings ─────────────────────────────────────────────────
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
  if (!emailCheck.valid) return new NextResponse(emailCheck.error, { status: 400 })

  // Bounce protection — reject fake/placeholder emails before they hit Resend
  if (!isLikelyValidEmail(student_email)) {
    return NextResponse.json({ error: 'Invalid or disallowed email address' }, { status: 400 })
  }

  if (student_phone) {
    const phoneCheck = validatePhone(student_phone)
    if (!phoneCheck.valid) return new NextResponse(phoneCheck.error, { status: 400 })
  }

  // Use any to bypass Supabase generated types that don't match actual DB schema
  // Actual DB: sessions has id, school_id, seats_booked, max_seats, session_type_id
  const admin: any = getSupabaseAdmin()
  let sessionSchoolId: string | null = null
  let sessionTypeId: string | null = null
  let sessionInstructorId: string | null = null
  let depositAmount = 2500

  if (session_id) {
    const { data: rawSession } = await admin
      .from('sessions')
      .select('id, school_id, seats_booked, max_seats, session_type_id')
      .eq('id', session_id)
      .eq('status', 'scheduled')
      .single()

    if (!rawSession) return NextResponse.json({ error: 'Session not found or not available' }, { status: 404 })
    if (rawSession.seats_booked >= rawSession.max_seats) {
      return NextResponse.json({ error: 'This session is fully booked' }, { status: 409 })
    }

    sessionSchoolId = rawSession.school_id
    sessionTypeId = rawSession.session_type_id
    sessionInstructorId = rawSession.instructor_id ?? null

    if (sessionTypeId) {
      const { data: st } = await admin
        .from('session_types')
        .select('deposit_cents')
        .eq('id', sessionTypeId)
        .maybeSingle()
      if (st?.deposit_cents) depositAmount = st.deposit_cents
    }
  }

  // Check for duplicate booking
  const { data: existing } = await admin
    .from('bookings')
    .select('id')
    .eq('session_date', session_date)
    .eq('session_time', session_time)
    .eq('student_email', student_email)
    .in('status', ['pending', 'confirmed'])
    .single()
  if (existing) return NextResponse.json({ error: 'You have already booked this session' }, { status: 409 })

  const bookingToken = crypto.randomUUID()

  const insertPayload: Record<string, unknown> = {
    student_name,
    student_email,
    student_phone: student_phone ?? null,
    session_date,
    session_time,
    status: depositAmount > 0 ? 'pending' : 'confirmed',
    booking_token: bookingToken,
    confirmation_token: bookingToken,  // FIX: was missing — confirmations looked up by confirmation_token
    payment_status: depositAmount > 0 ? 'pending' : 'paid',
  }
  if (session_id) insertPayload.session_id = session_id
  if (sessionSchoolId) insertPayload.school_id = sessionSchoolId
  if (sessionTypeId) insertPayload.session_type_id = sessionTypeId
  if (sessionInstructorId) insertPayload.instructor_id = sessionInstructorId

  const { data: booking, error: bookingError } = await admin
    .from('bookings')
    .insert(insertPayload)
    .select()
    .single()

  if (bookingError) {
    console.error('Booking insert error:', bookingError)
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  if (sessionSchoolId) {
    await admin.from('audit_logs').insert(
      auditLog('BOOKING_CREATED', student_email, {
        booking_id: booking.id,
        session_id: session_id ?? null,
        school_id: sessionSchoolId,
        deposit_cents: depositAmount,
      })
    )
  }

  return NextResponse.json({
    booking_id: booking.id,
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