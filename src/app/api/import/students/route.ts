import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
    if (values.length !== headers.length) continue

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || '').trim().replace(/^["']|["']$/g, '')
    })

    if (row.legal_name || row.name || row.student_name) {
      rows.push({
        legal_name: row.legal_name || row.name || row.student_name || '',
        dob: row.dob || row.date_of_birth || row.date || '',
        permit_number: row.permit_number || row.permit || row.license || '',
        parent_email: row.parent_email || row.email || row.parent_email || row.student_email || '',
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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const schoolId = request.headers.get('x-school-id')
  if (!schoolId) return new NextResponse('Missing x-school-id', { status: 400 })

  const body = await request.json()
  const { csv_content } = body

  if (!csv_content || typeof csv_content !== 'string') {
    return NextResponse.json({ error: 'csv_content is required' }, { status: 400 })
  }

  const rows = parseCSV(csv_content)

  if (rows.length === 0) {
    return NextResponse.json({
      error: 'No valid student rows found. CSV must have headers: legal_name, dob',
      hint: 'Accepted column names: legal_name / name / student_name, dob / date_of_birth, permit_number / permit / license, parent_email / email, driving_hours, classroom_hours',
    }, { status: 400 })
  }

  const supabaseAdmin = await createClient()
  const results = {
    total: rows.length,
    imported: 0,
    failed: 0,
    errors: [] as string[],
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    // Validate required fields
    if (!row.legal_name) {
      results.errors.push(`Row ${i + 2}: Missing student name`)
      results.failed++
      continue
    }

    if (!row.dob) {
      results.errors.push(`Row ${i + 2}: Missing date of birth`)
      results.failed++
      continue
    }

    // Validate DOB format
    const dobDate = new Date(row.dob)
    if (isNaN(dobDate.getTime())) {
      results.errors.push(`Row ${i + 2}: Invalid date format for DOB: "${row.dob}"`)
      results.failed++
      continue
    }

    const dobCheck = validateDOB(row.dob)
    if (!dobCheck.valid) {
      results.errors.push(`Row ${i + 2}: ${dobCheck.error}`)
      results.failed++
      continue
    }

    if (row.permit_number) {
      const permitCheck = validatePermitNumber(row.permit_number)
      if (!permitCheck.valid) {
        results.errors.push(`Row ${i + 2}: ${permitCheck.error}`)
        results.failed++
        continue
      }
    }

    try {
      // Encrypt PII
      const encryptedName = await encryptField(row.legal_name)
      const encryptedPermit = row.permit_number ? await encryptField(row.permit_number) : 'PENDING'
      const encryptedPhone = row.emergency_contact_phone ? await encryptField(row.emergency_contact_phone) : null

      const { error: insertError } = await supabaseAdmin
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
        })

      if (insertError) {
        results.errors.push(`Row ${i + 2}: Database error — ${insertError.message}`)
        results.failed++
      } else {
        results.imported++
      }
    } catch (err: any) {
      results.errors.push(`Row ${i + 2}: ${err.message}`)
      results.failed++
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
