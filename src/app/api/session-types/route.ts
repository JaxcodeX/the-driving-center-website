import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: types, error } = await supabase
    .from('session_types')
    .select('id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit, requires_permit')
    .eq('school_id', schoolId)
    .eq('active', true)
    .order('price_cents', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(types ?? [])
}
