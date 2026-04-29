import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/slots — get available session slots for a school + session type.
 *
 * NOTE: The SQL function get_available_slots() references non-existent columns
 * (sessions.cancelled, sessions.start_time). Replaced with direct query using
 * actual schema: sessions.status TEXT, sessions.start_date DATE.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')
  const sessionTypeId = searchParams.get('session_type_id')
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const instructorId = searchParams.get('instructor_id')

  if (!schoolId || !sessionTypeId) {
    return NextResponse.json(
      { error: 'school_id and session_type_id are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const admin = getSupabaseAdmin()

  const start = startDate ?? new Date().toISOString().split('T')[0]
  const end = endDate ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Get session type details
  const { data: sessionType } = await (supabase as any)
    .from('session_types')
    .select('*')
    .eq('id', sessionTypeId)
    .eq('school_id', schoolId)
    .single()

  if (!sessionType) {
    return NextResponse.json({ error: 'Session type not found' }, { status: 404 })
  }

  // Direct query using actual schema: sessions has status TEXT, start_date DATE
  // NO cancelled column, NO start_time column
  let sessionQuery: any = admin
    .from('sessions')
    .select('*, instructor:instructors(id, name), session_type:session_types(name, deposit_cents)')
    .eq('school_id', schoolId)
    .eq('session_type_id', sessionTypeId)
    .eq('status', 'scheduled')
    .gte('start_date', start)
    .lte('start_date', end)
    .order('start_date', { ascending: true })

  if (instructorId) {
    sessionQuery = sessionQuery.eq('instructor_id', instructorId)
  }

  const { data: sessions, error } = await sessionQuery

  if (error) {
    console.error('Slots query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get existing bookings to calculate available seats
  const sessionIds = (sessions ?? []).map((s: any) => s.id)
  let bookingsBySession: Record<string, number> = {}

  if (sessionIds.length > 0) {
    const { data: bookings } = await admin
      .from('bookings')
      .select('session_id')
      .in('session_id', sessionIds)
      .in('status', ['pending', 'confirmed'])

    bookingsBySession = (bookings ?? []).reduce((acc: Record<string, number>, b: any) => {
      acc[b.session_id] = (acc[b.session_id] ?? 0) + 1
      return acc
    }, {})
  }

  const slots = (sessions ?? []).map((session: any) => ({
    id: session.id,
    start_date: session.start_date,
    end_date: session.end_date,
    start_time: session.session_time ?? '09:00', // fallback since no start_time col
    location: session.location,
    instructor: session.instructor,
    max_seats: session.max_seats,
    seats_booked: bookingsBySession[session.id] ?? 0,
    available: (session.max_seats ?? 0) - (bookingsBySession[session.id] ?? 0) > 0,
    deposit_cents: session.session_type?.deposit_cents ?? 0,
    price_cents: session.session_type?.price_cents ?? 0,
  }))

  return NextResponse.json({
    session_type: {
      id: sessionType.id,
      name: sessionType.name,
      duration_minutes: sessionType.duration_minutes,
      price_cents: sessionType.price_cents,
      deposit_cents: sessionType.deposit_cents,
      description: sessionType.description,
    },
    slots,
  })
}
