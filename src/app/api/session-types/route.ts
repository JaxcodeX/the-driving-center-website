import { NextResponse } from 'next/server'
import { createClient, getSupabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/session-types
 *
 * In DEMO_MODE: uses service role key (admin) — bypasses RLS.
 * Otherwise: uses the authenticated user's client.
 * Public booking page needs this to work without full auth.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id required' }, { status: 400 })
  }

  const isDemoMode = process.env.DEMO_MODE === 'true'
  const client = isDemoMode ? getSupabaseAdmin() : await createClient()

  const { data: types, error } = await (client as any)
    .from('session_types')
    .select('id, name, description, duration_minutes, price_cents, deposit_cents, color, tca_hours_credit')
    .eq('school_id', schoolId)
    .eq('active', true)
    .order('price_cents', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(types ?? [])
}
