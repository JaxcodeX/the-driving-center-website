import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/instructor/schedule
// Returns the authenticated instructor's upcoming booked sessions
export async function GET(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  // Get instructor record for this user
  const { data: instructor } = await supabase
    .from('instructors')
    .select('id, name, school_id')
    .eq('email', user.email)
    .single()

  if (!instructor) {
    return new NextResponse('Instructor not found', { status: 404 })
  }

  // Get upcoming bookings for this instructor
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      session_date,
      session_time,
      status,
      student_name,
      session_type_name:session_type_id(
        name,
        duration_minutes,
        color
      ),
      location
    `)
    .eq('instructor_id', instructor.id)
    .eq('status', 'confirmed')
    .gte('session_date', new Date().toISOString().split('T')[0])
    .order('session_date', { ascending: true })
    .order('session_time', { ascending: true })
    .limit(30)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Decrypt student name
  const { decryptField } = await import('@/lib/security')
  const decrypted = (data ?? []).map((b: any) => ({
    ...b,
    student_name: b.student_name ? decryptField(b.student_name) : null,
  }))

  return NextResponse.json({
    instructor_id: instructor.id,
    instructor_name: instructor.name,
    upcoming: decrypted,
  })
}
