import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import type { McActivityLogRow, McTasksRow, McCalendarEventsRow } from '@/lib/supabase/database.types'

// GET /api/mc/activity — list recent activity log entries
export async function GET() {
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('mc_activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) throw error
    return NextResponse.json({ entries: (data as McActivityLogRow[]) ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/mc/activity — log a new action
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, details = null, source = 'Everest', status = 'active' } = body

    if (!action) {
      return NextResponse.json({ error: 'action required' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    const payload = { action, details, source, status } as Omit<McActivityLogRow, 'id' | 'created_at'>
    const { data, error } = await admin
      .from('mc_activity_log')
      .insert(payload as any)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ entry: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
