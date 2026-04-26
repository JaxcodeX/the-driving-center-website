import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { auditLog } from '@/lib/security'

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── GET /api/sessions?school_id=X ──────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')
  if (!schoolId) return new NextResponse('Missing school_id', { status: 400 })

  const supabase = createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    const cookieAuth = await import('@/lib/supabase/server').then(m => m.createClient())
    const { data: { user } } = await cookieAuth.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })
  }

  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('id', schoolId)
    .single()
  if (!school) return new NextResponse('Forbidden', { status: 403 })

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*, instructor:instructors(id, name)')
    .eq('school_id', schoolId)
    .order('start_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(sessions ?? [])
}

// ── POST /api/sessions ─────────────────────────────────────────────────
export async function POST(request: Request) {
  const supabase = getSupabaseAdmin()
  const body = await request.json()
  const { start_date, start_time, end_time, instructor_id, max_seats, price_cents, location, session_type_id } = body

  if (!start_date || !start_time || !end_time || !max_seats) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })
  const authHeader = request.headers.get('Authorization')

  if (process.env.DEMO_MODE === 'true') {
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        school_id: schoolId,
        start_date: body.start_date,
        start_time: body.start_time,
        end_time: body.end_time,
        instructor_id: body.instructor_id ?? null,
        max_seats: Math.max(1, Math.min(100, body.max_seats ?? 1)),
        price_cents: body.price_cents ?? 0,
        location: body.location ?? '',
        session_type_id: body.session_type_id ?? null,
        seats_booked: 0,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(session, { status: 201 })
  }

  // Non-demo: full auth
  if (!authHeader?.startsWith('Bearer ')) return new NextResponse('Unauthorized', { status: 401 })
  const token = authHeader.slice(7)
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return new NextResponse('Invalid token', { status: 401 })

  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('id', schoolId)
    .eq('owner_email', user.email)
    .single()
  if (!school) return new NextResponse('Forbidden', { status: 403 })

  const sessionDateTime = new Date(`${start_date}T${start_time}`)
  if (sessionDateTime <= new Date()) {
    return NextResponse.json({ error: 'Session must be in the future' }, { status: 400 })
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      school_id: schoolId,
      start_date,
      start_time,
      end_time,
      instructor_id: instructor_id ?? null,
      max_seats: Math.max(1, Math.min(100, max_seats)),
      price_cents: price_cents ?? 0,
      location: location ?? '',
      session_type_id: session_type_id ?? null,
      seats_booked: 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('audit_logs').insert(
    auditLog('SESSION_CREATED', user.id, { session_id: session.id, school_id: schoolId, instructor_id })
  )

  return NextResponse.json(session, { status: 201 })
}