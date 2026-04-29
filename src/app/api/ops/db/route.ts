import { NextResponse } from 'next/server'
import { createClient, getSupabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Probe: count records in key tables
    const [schools, students, sessions, bookings, instructors] = await Promise.all([
      supabaseAdmin.from('schools').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('students_driver_ed').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('sessions').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('bookings').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('instructors').select('id', { count: 'exact', head: true }),
    ])

    // Recent auth users (via admin API)
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 5 })
    const users = usersData?.users ?? []

    return NextResponse.json({
      connected: true,
      counts: {
        schools: schools.count ?? 0,
        students: students.count ?? 0,
        sessions: sessions.count ?? 0,
        bookings: bookings.count ?? 0,
        instructors: instructors.count ?? 0,
      },
      recentUsers: (users ?? []).map((u: any) => ({
        id: u.id,
        email: u.email,
        created: u.created_at,
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, connected: false }, { status: 500 })
  }
}

// POST — trigger a database operation
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  if (action === 'clear_test_bookings') {
    const supabaseAdmin = getSupabaseAdmin()
    const { count } = await supabaseAdmin
      .from('bookings')
      .delete()
      .in('status', ['pending', 'expired'])
      .neq('id', '00000000-0000-0000-0000-000000000000')

    return NextResponse.json({ success: true, deleted: count })
  }

  if (action === 'clear_test_schools') {
    const supabaseAdmin = getSupabaseAdmin()
    // Don't delete the demo school
    const { count } = await supabaseAdmin
      .from('schools')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000001')

    return NextResponse.json({ success: true, deleted: count })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
