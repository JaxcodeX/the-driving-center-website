import { NextResponse } from 'next/server'
import { createClient, getSupabaseAdmin } from '@/lib/supabase/server'

/**
 * POST /api/schools/update-info
 *
 * Updates school profile info (name, phone).
 * Uses service role admin client for write operations.
 *
 * Body: { school_id, name?, phone? }
 */
export async function POST(request: Request) {
  const body = await request.json()
  const { school_id, name, phone } = body

  if (!school_id) {
    return NextResponse.json({ error: 'school_id required' }, { status: 400 })
  }

  const updates: Record<string, any> = {}
  if (name !== undefined) updates.name = name
  if (phone !== undefined) updates.phone = phone

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  const { error } = await (admin as any)
    .from('schools')
    .update(updates)
    .eq('id', school_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
