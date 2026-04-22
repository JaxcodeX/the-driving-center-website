import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: session, error } = await supabase
    .from('sessions')
    .select('*, instructor:instructors(name)')
    .eq('id', id)
    .single()

  if (error || !session) {
    return new NextResponse('Session not found', { status: 404 })
  }

  return NextResponse.json(session)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const body = await request.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  const supabaseAdmin = await createClient()

  const { data: updated, error } = await supabaseAdmin
    .from('sessions')
    .update({
      start_date: body.start_date,
      start_time: body.start_time,
      end_time: body.end_time,
      instructor_id: body.instructor_id,
      max_seats: body.max_seats,
      price_cents: body.price_cents,
      location: body.location,
      cancelled: body.cancelled ?? false,
    })
    .eq('id', id)
    .eq('school_id', schoolId) // Ownership check
    .select()
    .single()

  if (error || !updated) {
    return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 })
  }

  await supabaseAdmin.from('audit_logs').insert(
    auditLog(body.cancelled ? 'SESSION_CANCELLED' : 'SESSION_UPDATED', user.id, {
      session_id: id,
      school_id: schoolId,
    })
  )

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = _request.headers.get('x-school-id')
  const supabaseAdmin = await createClient()

  // Soft cancel — don't hard delete (retention)
  const { error } = await supabaseAdmin
    .from('sessions')
    .update({ cancelled: true })
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) {
    return NextResponse.json({ error: error?.message ?? String(error) }, { status: 500 })
  }

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('SESSION_CANCELLED', user.id, { session_id: id, school_id: schoolId })
  )

  return new NextResponse('OK')
}
