import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  // Get session type details
  const { data: sessionType } = await supabase
    .from('session_types')
    .select('*')
    .eq('id', sessionTypeId)
    .eq('school_id', schoolId)
    .single()

  if (!sessionType) {
    return NextResponse.json({ error: 'Session type not found' }, { status: 404 })
  }

  // Use the SQL function to get available slots
  const { data: slots, error } = await supabase
    .rpc('get_available_slots', {
      p_school_id: schoolId,
      p_instructor_id: instructorId ?? null,
      p_session_type_id: sessionTypeId,
      p_start_date: startDate ?? new Date().toISOString().split('T')[0],
      p_end_date: endDate ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    })

  if (error) {
    console.error('get_available_slots error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    session_type: {
      id: sessionType.id,
      name: sessionType.name,
      duration_minutes: sessionType.duration_minutes,
      price_cents: sessionType.price_cents,
      deposit_cents: sessionType.deposit_cents,
      description: sessionType.description,
    },
    slots: slots ?? [],
  })
}
