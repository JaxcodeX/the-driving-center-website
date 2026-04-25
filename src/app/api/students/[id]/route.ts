import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { encryptField, decryptField, validateDOB, validatePhone, validateEmail, auditLog } from '@/lib/security'

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabaseAdmin = getSupabaseAdmin()

  const { data: student, error } = await supabaseAdmin
    .from('students_driver_ed')
    .select('id, legal_name, dob, permit_number, parent_email, emergency_contact_name, emergency_contact_phone, driving_hours, classroom_hours, certificate_issued_at, enrollment_date, created_at, school_id')
    .eq('id', id)
    .single()

  if (error || !student) {
    return new NextResponse('Student not found', { status: 404 })
  }

  // Decrypt for admin view
  const decryptedName = student.legal_name ? await decryptField(student.legal_name) : '[unknown]'
  const decryptedPermit = student.permit_number && student.permit_number !== 'PENDING' ? await decryptField(student.permit_number) : ''
  const decryptedPhone = student.emergency_contact_phone ? await decryptField(student.emergency_contact_phone) : ''

  return NextResponse.json({
    ...student,
    legal_name: decryptedName,
    permit_number: decryptedPermit,
    emergency_contact_phone: decryptedPhone,
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabaseAdmin = getSupabaseAdmin()

  // Auth via Bearer token
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new NextResponse('Unauthorized', { status: 401 })
  const token = authHeader.slice(7)

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return new NextResponse('Invalid token', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  // Verify ownership
  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('id')
    .eq('id', schoolId)
    .eq('owner_email', user.email)
    .single()
  if (!school) return new NextResponse('Forbidden', { status: 403 })

  const body = await request.json()
  const updates: Record<string, unknown> = {}

  if (body.driving_hours !== undefined) updates.driving_hours = Math.max(0, body.driving_hours)
  if (body.classroom_hours !== undefined) updates.classroom_hours = Math.max(0, body.classroom_hours)
  if (body.emergency_contact_name !== undefined) updates.emergency_contact_name = body.emergency_contact_name
  if (body.parent_email !== undefined) {
    if (body.parent_email && !validateEmail(body.parent_email).valid) {
      return NextResponse.json({ error: 'Invalid parent email' }, { status: 400 })
    }
    updates.parent_email = body.parent_email
  }

  // Encrypt name and permit when updating
  if (body.legal_name !== undefined) {
    updates.legal_name = await encryptField(body.legal_name)
  }
  if (body.permit_number !== undefined) {
    updates.permit_number = body.permit_number ? await encryptField(body.permit_number) : 'PENDING'
  }
  if (body.emergency_contact_phone !== undefined) {
    if (body.emergency_contact_phone && !validatePhone(body.emergency_contact_phone).valid) {
      return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
    }
    updates.emergency_contact_phone = body.emergency_contact_phone ? await encryptField(body.emergency_contact_phone) : null
  }

  // Certificate issuance
  if (body.issue_certificate && body.issue_certificate === true) {
    const { data: current } = await supabaseAdmin
      .from('students_driver_ed')
      .select('driving_hours, classroom_hours, certificate_issued_at')
      .eq('id', id)
      .single()

    if (!current) return new NextResponse('Student not found', { status: 404 })
    if (current.certificate_issued_at) return NextResponse.json({ error: 'Certificate already issued' }, { status: 400 })
    if (current.driving_hours < 6 || current.classroom_hours < 30) {
      return NextResponse.json({ error: 'Not eligible — TCA minimums not met' }, { status: 400 })
    }
    updates.certificate_issued_at = new Date().toISOString()
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  const { data: updated, error } = await supabaseAdmin
    .from('students_driver_ed')
    .update(updates)
    .eq('id', id)
    .eq('school_id', schoolId)
    .select('id')
    .single()

  if (error || !updated) {
    return NextResponse.json({ error: error?.message ?? 'Update failed' }, { status: 500 })
  }

  await supabaseAdmin.from('audit_logs').insert(
    auditLog(
      updates.certificate_issued_at ? 'CERTIFICATE_ISSUED' : 'STUDENT_UPDATED',
      user.id,
      { student_id: id, school_id: schoolId, updated_fields: Object.keys(updates) }
    )
  )

  return NextResponse.json({ id: updated.id, success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabaseAdmin = getSupabaseAdmin()

  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return new NextResponse('Unauthorized', { status: 401 })
  const token = authHeader.slice(7)

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return new NextResponse('Invalid token', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  const { error } = await supabaseAdmin
    .from('students_driver_ed')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) return new NextResponse('Delete failed', { status: 500 })

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('STUDENT_SOFT_DELETED', user.id, { student_id: id, school_id: schoolId })
  )

  return new NextResponse('OK')
}