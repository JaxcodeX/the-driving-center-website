import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { encryptField, auditLog, validateDOB, validatePermitNumber } from '@/lib/security'

interface StudentRow {
  legal_name: string
  dob: string
  permit_number?: string
  parent_email?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  driving_hours?: string
  classroom_hours?: string
  enrollment_date?: string
}

function parseCSV(csvText: string): StudentRow[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
  const rows: StudentRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === 0) continue

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || '').trim().replace(/^["']|["']$/g, '')
    })

    if (row.legal_name || row.name || row.student_name) {
      rows.push({
        legal_name: row.legal_name || row.name || row.student_name || '',
        dob: row.dob || row.date_of_birth || row.date || '',
        permit_number: row.permit_number || row.permit || row.license || '',
        parent_email: row.parent_email || row.email || row.student_email || '',
        emergency_contact_name: row.emergency_contact_name || row.emergency_name || row.contact || '',
        emergency_contact_phone: row.emergency_contact_phone || row.emergency_phone || row.phone || row.contact_phone || '',
        driving_hours: row.driving_hours || row.drivinghrs || row.drivinghours || '',
        classroom_hours: row.classroom_hours || row.classroomhrs || row.classroomhours || '',
        enrollment_date: row.enrollment_date || row.enrolled || row.enrollment || '',
      })
    }
  }

  return rows
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export async function POST(request: Request) {
  const schoolId = request.headers.get('x-school-id')
  const demoMode = process.env.DEMO_MODE === 'true'

  // ── DEMO_MODE: trust x-school-id from authorized dashboard context ──
  if (demoMode) {
    if (!schoolId) {
      return NextResponse.json({ error: 'Missing x-school-id' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await request.json()
    const { csv_content } = body

    if (!csv_content || typeof csv_content !== 'string') {
      return NextResponse.json({ error: 'csv_content is required' }, { status: 400 })
    }

    const rows = parseCSV(csv_content)
    if (rows.length === 0) {
      return NextResponse.json({
        error: 'No valid student rows found.',
        hint: 'Accepted: legal_name (or name/student_name), dob (YYYY-MM-DD)',
      }, { status: 400 })
    }

    const results = { total: rows.length, imported: 0, failed: 0, skipped: 0, errors: [] as string[] }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row.legal_name) { results.errors.push(`Row ${i + 2}: Missing name`); results.failed++; continue }
      if (!row.dob) { results.errors.push(`Row ${i + 2}: Missing DOB`); results.failed++; continue }
      const dobCheck = validateDOB(row.dob)
      if (!dobCheck.valid) { results.errors.push(`Row ${i + 2}: ${dobCheck.error}`); results.failed++; continue }

      try {
        const encryptedName = await encryptField(row.legal_name)
        const encryptedPermit = row.permit_number ? await encryptField(row.permit_number) : 'PENDING'
        const encryptedPhone = row.emergency_contact_phone ? await encryptField(row.emergency_contact_phone) : null

        // Dedupe: same dob + this school
        const { data: existing } = await supabaseAdmin
          .from('students_driver_ed')
          .select('id')
          .eq('school_id', schoolId)
          .eq('dob', row.dob)
          .limit(1)

        if (existing && existing.length > 0) {
          const { error } = await supabaseAdmin
            .from('students_driver_ed')
            .update({
              legal_name: encryptedName,
              permit_number: encryptedPermit,
              parent_email: row.parent_email || '',
              emergency_contact_name: row.emergency_contact_name || '',
              emergency_contact_phone: encryptedPhone,
              driving_hours: row.driving_hours ? parseInt(row.driving_hours) : 0,
              classroom_hours: row.classroom_hours ? parseInt(row.classroom_hours) : 0,
            })
            .eq('id', existing[0].id)
          if (error) { results.errors.push(`Row ${i + 2}: ${error.message}`); results.failed++ }
          else results.imported++
        } else {
          const { error } = await supabaseAdmin
            .from('students_driver_ed')
            .insert({
              school_id: schoolId,
              legal_name: encryptedName,
              dob: row.dob,
              permit_number: encryptedPermit,
              parent_email: row.parent_email || '',
              emergency_contact_name: row.emergency_contact_name || '',
              emergency_contact_phone: encryptedPhone,
              driving_hours: row.driving_hours ? parseInt(row.driving_hours) : 0,
              classroom_hours: row.classroom_hours ? parseInt(row.classroom_hours) : 0,
              enrollment_date: row.enrollment_date || new Date().toISOString().split('T')[0],
            })
          if (error) { results.errors.push(`Row ${i + 2}: ${error.message}`); results.failed++ }
          else results.imported++
        }
      } catch (err: any) {
        results.errors.push(`Row ${i + 2}: ${err.message}`); results.failed++
      }
    }

    return NextResponse.json(results)
  }

  // ── PROD MODE: full auth check ──
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const token = authHeader.slice(7)

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return new NextResponse('Invalid token', { status: 401 })

  if (!schoolId) return NextResponse.json({ error: 'Missing x-school-id' }, { status: 400 })

  // Verify school ownership
  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('id, owner_email')
    .eq('id', schoolId)
    .single()

  if (!school || school.owner_email !== user.email) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const body = await request.json()
  const { csv_content } = body

  if (!csv_content || typeof csv_content !== 'string') {
    return NextResponse.json({ error: 'csv_content is required' }, { status: 400 })
  }

  const rows = parseCSV(csv_content)
  if (rows.length === 0) {
    return NextResponse.json({
      error: 'No valid student rows found.',
      hint: 'Accepted: legal_name (or name/student_name), dob (YYYY-MM-DD)',
    }, { status: 400 })
  }

  const results = { total: rows.length, imported: 0, failed: 0, skipped: 0, errors: [] as string[] }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!row.legal_name) { results.errors.push(`Row ${i + 2}: Missing name`); results.failed++; continue }
    if (!row.dob) { results.errors.push(`Row ${i + 2}: Missing DOB`); results.failed++; continue }
    const dobCheck = validateDOB(row.dob)
    if (!dobCheck.valid) { results.errors.push(`Row ${i + 2}: ${dobCheck.error}`); results.failed++; continue }

    try {
      const encryptedName = await encryptField(row.legal_name)
      const encryptedPermit = row.permit_number ? await encryptField(row.permit_number) : 'PENDING'
      const encryptedPhone = row.emergency_contact_phone ? await encryptField(row.emergency_contact_phone) : null

      const { data: existing } = await supabaseAdmin
        .from('students_driver_ed')
        .select('id')
        .eq('school_id', schoolId)
        .eq('dob', row.dob)
        .limit(1)

      if (existing && existing.length > 0) {
        const { error } = await supabaseAdmin
          .from('students_driver_ed')
          .update({
            legal_name: encryptedName,
            permit_number: encryptedPermit,
            parent_email: row.parent_email || '',
            emergency_contact_name: row.emergency_contact_name || '',
            emergency_contact_phone: encryptedPhone,
            driving_hours: row.driving_hours ? parseInt(row.driving_hours) : 0,
            classroom_hours: row.classroom_hours ? parseInt(row.classroom_hours) : 0,
          })
          .eq('id', existing[0].id)
        if (error) { results.errors.push(`Row ${i + 2}: ${error.message}`); results.failed++ }
        else results.imported++
      } else {
        const { error } = await supabaseAdmin
          .from('students_driver_ed')
          .insert({
            school_id: schoolId,
            legal_name: encryptedName,
            dob: row.dob,
            permit_number: encryptedPermit,
            parent_email: row.parent_email || '',
            emergency_contact_name: row.emergency_contact_name || '',
            emergency_contact_phone: encryptedPhone,
            driving_hours: row.driving_hours ? parseInt(row.driving_hours) : 0,
            classroom_hours: row.classroom_hours ? parseInt(row.classroom_hours) : 0,
            enrollment_date: row.enrollment_date || new Date().toISOString().split('T')[0],
          })
        if (error) { results.errors.push(`Row ${i + 2}: ${error.message}`); results.failed++ }
        else results.imported++
      }
    } catch (err: any) {
      results.errors.push(`Row ${i + 2}: ${err.message}`); results.failed++
    }
  }

  if (results.imported > 0) {
    await supabaseAdmin.from('audit_logs').insert(
      auditLog('STUDENT_CSV_IMPORT', user.id, {
        school_id: schoolId,
        total_rows: results.total,
        imported: results.imported,
        failed: results.failed,
      })
    )
  }

  return NextResponse.json(results)
}
