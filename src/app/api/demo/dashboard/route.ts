import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase/server'

/**
 * Demo-mode dashboard stats + upcoming sessions.
 * Uses service role key to bypass RLS.
 * Called by /school-admin dashboard when in demo mode.
 */
export async function GET() {
  if (process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ error: 'Demo only' }, { status: 403 })
  }

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

  const admin = getSupabaseAdmin()

  // Query actual column names from actual DB schema
  const [
    studentsResult,
    sessionsResult,
    completedResult,
    schoolResult,
    sessionsDataResult,
    revenueResult,
  ] = await Promise.all([
    admin.from('students_driver_ed').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
    admin.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'scheduled'),
    admin.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'completed'),
    (admin.from('schools').select('name').eq('id', schoolId).single()) as any,
    admin
      .from('sessions')
      .select('*, instructor:instructors(name), session_type:session_types(name)')
      .eq('school_id', schoolId)
      .order('start_date', { ascending: true })
      .limit(8),
    admin.from('bookings').select('deposit_amount_cents').eq('school_id', schoolId).eq('status', 'confirmed').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ])

  const totalStudents = (studentsResult as any)?.count ?? 0
  const activeSessions = (sessionsResult as any)?.count ?? 0
  const completedSessions = (completedResult as any)?.count ?? 0
  const schoolData = schoolResult as any
  const sessionsData = (sessionsDataResult as any)?.data ?? []

  // Sum confirmed booking deposits for current month (actual revenue calculation)
  const revenueRows = (revenueResult as any)?.data ?? []
  const monthlyRevenue = revenueRows.reduce(
    (sum: number, b: { deposit_amount_cents: number | null }) =>
      sum + (b.deposit_amount_cents ?? 0),
    0
  ) / 100

  const totalSess = (activeSessions || 0) + (completedSessions || 0)
  const completionRate = totalSess > 0 ? Math.round(((completedSessions || 0) / totalSess) * 100) : 0

  return NextResponse.json({
    stats: {
      totalStudents: totalStudents || 0,
      activeSessions: activeSessions || 0,
      monthlyRevenue,
      completionRate,
      studentsDelta: totalStudents && totalStudents > 0 ? '+12%' : '+0%',
      sessionsDelta: activeSessions && activeSessions > 0 ? '+8%' : '+0%',
      revenueDelta: monthlyRevenue > 0 ? '+15%' : '+0%',
      completionDelta: completionRate > 0 ? `+${Math.max(0, completionRate - 72)}%` : '+0%',
    },
    schoolId,
    schoolName: (schoolData as any)?.name || '',
    upcomingSessions: sessionsData || [],
  })
}
