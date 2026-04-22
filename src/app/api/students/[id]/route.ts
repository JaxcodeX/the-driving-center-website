import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('students_driver_ed')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !student) {
    return new NextResponse('Student not found', { status: 404 })
  }

  return NextResponse.json({ ...student, legal_name: '[encrypted]' })
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

  const updates: Record<string, unknown> = {}
  if (body.driving_hours !== undefined) updates.driving_hours = body.driving_hours
  if (body.classroom_hours !== undefined) updates.classroom_hours = body.classroom_hours
  if (body.permit_expiration !== undefined) updates.permit_expiration = body.permit_expiration
  if (body.emergency_contact_name !== undefined) updates.emergency_contact_name = body.emergency_contact_name
  if (body.emergency_contact_phone !== undefined) updates.emergency_contact_phone = body.emergency_contact_phone
  if (body.certificate_issued_at !== undefined) updates.certificate_issued_at = body.certificate_issued_at

  const { data: updated, error } = await supabaseAdmin
    .from('students_driver_ed')
    .update(updates)
    .eq('id', id)
    .eq('school_id', schoolId)
    .select()
    .single()

  if (error || !updated) {
    return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 })
  }

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

  const { error } = await supabaseAdmin
    .from('students_driver_ed')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse('OK')
}
