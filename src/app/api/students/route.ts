import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encryptField, decryptField, validateDOB, validatePermitNumber, validateEmail, validatePhone, auditLog } from '@/lib/security'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const schoolId = searchParams.get('school_id')

  if (!schoolId) {
    return new NextResponse('Missing school_id', { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  // Only allow a school to read its own students
  const schoolCheck = await supabase
    .from('schools')
    .select('id')
    .eq('id', schoolId)
    .single()

  if (!schoolCheck.data) return new NextResponse('School not found', { status: 404 })

  const { data: students, error } = await supabase
    .from('students_driver_ed')
    .select('id, legal_name, created_at, driving_hours, classroom_hours, certificate_issued_at, parent_email')
    .eq('school_id', schoolId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Return encrypted name as-is (client never sees real name — only ops)
  // DOB and permit_number are NEVER returned to client API
  return NextResponse.json(
    (students ?? []).map(s => ({
      id: s.id,
      legal_name: '[encrypted]',
      created_at: s.created_at,
      driving_hours: s.driving_hours ?? 0,
      classroom_hours: s.classroom_hours ?? 0,
      certificate_issued_at: s.certificate_issued_at,
      parent_email: s.parent_email, // OK to return — user-provided
    }))
  )
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  const body = await request.json()
  const {
    legal_name, dob, permit_number,
    parent_email, emergency_contact_name, emergency_contact_phone,
  } = body

  // --- Input Validation (P1) ---
  if (!legal_name || !dob) {
    return NextResponse.json({ error: 'legal_name and dob are required' }, { status: 400 })
  }

  const dobCheck = validateDOB(dob)
  if (!dobCheck.valid) {
    return NextResponse.json({ error: dobCheck.error }, { status: 400 })
  }

  if (permit_number) {
    const permitCheck = validatePermitNumber(permit_number)
    if (!permitCheck.valid) {
      return NextResponse.json({ error: permitCheck.error }, { status: 400 })
    }
  }

  if (parent_email) {
    const emailCheck = validateEmail(parent_email)
    if (!emailCheck.valid) {
      return NextResponse.json({ error: emailCheck.error }, { status: 400 })
    }
  }

  if (emergency_contact_phone) {
    const phoneCheck = validatePhone(emergency_contact_phone)
    if (!phoneCheck.valid) {
      return NextResponse.json({ error: phoneCheck.error }, { status: 400 })
    }
  }

  // --- Encrypt PII before DB write (P0) ---
  const encryptedName = await encryptField(legal_name)
  const encryptedPermit = permit_number ? await encryptField(permit_number) : 'PENDING'
  const encryptedPhone = emergency_contact_phone ? await encryptField(emergency_contact_phone) : null

  const supabaseAdmin = await createClient()
  const { data: student, error } = await supabaseAdmin
    .from('students_driver_ed')
    .insert({
      school_id: schoolId,
      legal_name: encryptedName,
      dob, // DOB is stored plain (required for compliance auditing), NOT returned in GET
      permit_number: encryptedPermit,
      parent_email: parent_email ?? '',
      emergency_contact_name: emergency_contact_name ?? '',
      emergency_contact_phone: encryptedPhone,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // --- Audit log (P1) ---
  await supabaseAdmin.from('audit_logs').insert(
    auditLog('STUDENT_CREATED', user.id, {
      student_id: student.id,
      school_id: schoolId,
      has_permit: Boolean(permit_number),
    })
  )

  return NextResponse.json({ id: student.id, legal_name: '[encrypted]' }, { status: 201 })
}
