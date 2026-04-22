import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')

  if (!schoolId) {
    return new NextResponse('Missing school_id', { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*, instructor:instructors(name)')
    .eq('school_id', schoolId)
    .eq('cancelled', false)
    .order('start_date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(sessions)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id header', { status: 400 })

  const body = await request.json()
  const { start_date, start_time, end_time, instructor_id, max_seats, price_cents, location } = body

  if (!start_date || !start_time || !end_time || !max_seats) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  // Validate session is in the future
  const sessionDateTime = new Date(`${start_date}T${start_time}`)
  if (sessionDateTime <= new Date()) {
    return NextResponse.json({ error: 'Session must be in the future' }, { status: 400 })
  }

  if (max_seats < 1 || max_seats > 100) {
    return NextResponse.json({ error: 'max_seats must be between 1 and 100' }, { status: 400 })
  }

  const supabaseAdmin = await createClient()
  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .insert({
      school_id: schoolId,
      start_date,
      start_time,
      end_time,
      instructor_id: instructor_id ?? null,
      max_seats,
      price_cents: price_cents ?? 0,
      location: location ?? '',
      seats_booked: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('SESSION_CREATED', user.id, {
      session_id: session.id,
      school_id: schoolId,
      instructor_id,
      start_date,
      start_time,
    })
  )

  return NextResponse.json(session, { status: 201 })
}
