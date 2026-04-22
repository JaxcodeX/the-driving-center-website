import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateDOB, validatePhone, auditLog } from '@/lib/security'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: student, error } = await supabase
    .from('students_driver_ed')
    .select('id, legal_name, created_at, driving_hours, classroom_hours, certificate_issued_at, parent_email')
    .eq('id', id)
    .single()

  if (error || !student) {
    return new NextResponse('Student not found', { status: 404 })
  }

  // DOB and permit_number are NEVER returned — only used internally
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
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  // Validate inputs
  if (body.dob) {
    const check = validateDOB(body.dob)
    if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 })
  }

  if (body.emergency_contact_phone) {
    const check = validatePhone(body.emergency_contact_phone)
    if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}
  if (body.driving_hours !== undefined) updates.driving_hours = body.driving_hours
  if (body.classroom_hours !== undefined) updates.classroom_hours = body.classroom_hours
  if (body.emergency_contact_name !== undefined) updates.emergency_contact_name = body.emergency_contact_name
  if (body.emergency_contact_phone !== undefined) updates.emergency_contact_phone = body.emergency_contact_phone
  if (body.certificate_issued_at !== undefined) updates.certificate_issued_at = body.certificate_issued_at
  if (body.permit_expiration !== undefined) updates.permit_expiration = body.permit_expiration

  const supabaseAdmin = await createClient()
  const { data: updated, error } = await supabaseAdmin
    .from('students_driver_ed')
    .update(updates)
    .eq('id', id)
    .eq('school_id', schoolId) // Ownership check
    .select('id')
    .single()

  if (error || !updated) {
    return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 })
  }

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('STUDENT_UPDATED', user.id, {
      student_id: id,
      school_id: schoolId,
      updated_fields: Object.keys(updates),
    })
  )

  return NextResponse.json({ id: updated.id })
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
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  const supabaseAdmin = await createClient()

  // Soft delete — sets deleted_at (retention compliance)
  const { error } = await supabaseAdmin
    .from('students_driver_ed')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('STUDENT_SOFT_DELETED', user.id, { student_id: id, school_id: schoolId })
  )

  return new NextResponse('OK')
}
