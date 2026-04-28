import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { decryptField } from '@/lib/security'

/**
 * Demo-mode students endpoint.
 * Reads school_id from the demo_user cookie (via Next.js cookies()),
 * then queries with service role key to bypass RLS.
 *
 * DEMO_MODE only. Real auth users use GET /api/students instead.
 */
export async function GET() {
  if (process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ error: 'Demo only' }, { status: 403 })
  }

  // Read demo_user cookie from request
  const cookieStore = await cookies()
  const demoUserCookie = cookieStore.get('demo_user')
  if (!demoUserCookie?.value) {
    return NextResponse.json({ error: 'No demo session' }, { status: 401 })
  }

  let payload: { schoolId?: string }
  try {
    payload = JSON.parse(Buffer.from(demoUserCookie.value, 'base64').toString('utf8'))
  } catch {
    return NextResponse.json({ error: 'Invalid demo session' }, { status: 401 })
  }

  const schoolId = payload?.schoolId
  if (!schoolId) {
    return NextResponse.json({ error: 'No school in demo session' }, { status: 400 })
  }

  // Use service role — bypasses RLS entirely
  const admin = getSupabaseAdmin()

  const { data: students, error } = await admin
    .from('students_driver_ed')
    .select('id, legal_name, parent_email, classroom_hours, driving_hours, certificate_issued_at, enrollment_date, created_at')
    .eq('school_id', schoolId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false }) as { data: any[] | null; error: any }

  if (error) {
    console.error('Demo students query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Decrypt names
  const decrypted = await Promise.all(
    (students ?? []).map(async (s) => ({
      id: s.id,
      legal_name: s.legal_name ? await decryptField(s.legal_name) : '[unknown]',
      parent_email: s.parent_email,
      classroom_hours: s.classroom_hours ?? 0,
      driving_hours: s.driving_hours ?? 0,
      certificate_issued_at: s.certificate_issued_at,
      enrollment_date: s.enrollment_date,
      created_at: s.created_at,
    }))
  )

  return NextResponse.json(decrypted)
}
