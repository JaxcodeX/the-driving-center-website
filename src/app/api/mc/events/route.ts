import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import type { McCalendarEventsRow } from '@/lib/supabase/database.types'

// GET /api/mc/events — list upcoming calendar events
export async function GET() {
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('mc_calendar_events')
      .select('*')
      .order('start_time', { ascending: true })

    if (error) throw error
    return NextResponse.json({ events: (data as McCalendarEventsRow[]) ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/mc/events — create a calendar event
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, start_time, end_time = null, event_type = 'scheduled', recurring = false, metadata = null } = body

    if (!title || !start_time) {
      return NextResponse.json({ error: 'title and start_time required' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    const payload = { title, start_time, end_time, event_type, recurring, metadata } as Partial<McCalendarEventsRow>
    const { data, error } = await admin
      .from('mc_calendar_events')
      .insert(payload as any)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ event: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
