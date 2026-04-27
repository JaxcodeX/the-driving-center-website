import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encryptField, decryptField, validateDOB, validatePermitNumber, validateEmail, validatePhone, auditLog } from '@/lib/security'
import { isLikelyValidEmail } from '@/lib/email'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')

  if (!schoolId) {
    return new NextResponse('Missing school_id', { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  // Verify school ownership
  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('id', schoolId)
    .eq('owner_email', user.email)
    .single()
  if (!school) return new NextResponse('Forbidden', { status: 403 })

  const { data: students, error } = await supabase
    .from('students_driver_ed')
    .select('id, legal_name, created_at, driving_hours, classroom_hours, certificate_issued_at, parent_email')
    .eq('school_id', schoolId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Decrypt names server-side for admin view
  const decrypted = await Promise.all(
    (students ?? []).map(async (s) => ({
      id: s.id,
      legal_name: s.legal_name ? await decryptField(s.legal_name) : '[unknown]',
      created_at: s.created_at,
      driving_hours: s.driving_hours ?? 0,
      classroom_hours: s.classroom_hours ?? 0,
      certificate_issued_at: s.certificate_issued_at,
      parent_email: s.parent_email,
    }))
  )

  return NextResponse.json(decrypted)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  // Verify ownership
  const { data: school } = await supabase
    .from('schools')
    .select('id')
    .eq('id', schoolId)
    .eq('owner_email', user.email)
    .single()
  if (!school) return new NextResponse('Forbidden', { status: 403 })

  const { legal_name, dob, permit_number, parent_email, emergency_contact_name, emergency_contact_phone } = await request.json()

  if (!legal_name || !dob) {
    return NextResponse.json({ error: 'legal_name and dob are required' }, { status: 400 })
  }

  const dobCheck = validateDOB(dob)
  if (!dobCheck.valid) return NextResponse.json({ error: dobCheck.error }, { status: 400 })

  if (permit_number) {
    const p = validatePermitNumber(permit_number)
    if (!p.valid) return NextResponse.json({ error: p.error }, { status: 400 })
  }
  if (parent_email && !isLikelyValidEmail(parent_email)) {
    return NextResponse.json({ error: 'Invalid or disallowed email address' }, { status: 400 })
  }
  if (emergency_contact_phone) {
    const p = validatePhone(emergency_contact_phone)
    if (!p.valid) return NextResponse.json({ error: p.error }, { status: 400 })
  }

  const encryptedName = await encryptField(legal_name)
  const encryptedPermit = permit_number ? await encryptField(permit_number) : 'PENDING'
  const encryptedPhone = emergency_contact_phone ? await encryptField(emergency_contact_phone) : null

  const supabaseAdmin = await createClient()
  const { data: student, error } = await supabaseAdmin
    .from('students_driver_ed')
    .insert({
      school_id: schoolId,
      legal_name: encryptedName,
      dob,
      permit_number: encryptedPermit,
      parent_email: parent_email ?? '',
      emergency_contact_name: emergency_contact_name ?? '',
      emergency_contact_phone: encryptedPhone,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('STUDENT_CREATED', user.id, {
      student_id: student.id, school_id: schoolId, has_permit: Boolean(permit_number),
    })
  )

  return NextResponse.json({ id: student.id, legal_name }, { status: 201 })
}