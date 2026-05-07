import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import type { McTasksRow } from '@/lib/supabase/database.types'

// GET /api/mc/tasks — list all tasks
export async function GET() {
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('mc_tasks')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ tasks: (data as McTasksRow[]) ?? [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/mc/tasks — create a task
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, project = 'personal', assigned_to = 'everest', status = 'todo', last_activity = null } = body

    if (!title) {
      return NextResponse.json({ error: 'title required' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    const payload = { title, project, assigned_to, status, last_activity } as Partial<McTasksRow>
    const { data, error } = await admin
      .from('mc_tasks')
      .insert(payload as any)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ task: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
