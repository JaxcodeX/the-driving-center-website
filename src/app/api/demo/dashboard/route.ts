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

  // Run all queries in parallel with service role
  const [
    studentsResult,
    sessionsResult,
    completedResult,
    schoolDataRaw,
    sessionsDataRaw,
  ] = await Promise.all([
    admin.from('students_driver_ed').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
    admin.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'scheduled'),
    admin.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'completed'),
    (admin.from('schools').select('monthly_revenue, name').eq('id', schoolId).single()) as any,
    admin
      .from('sessions')
      .select('*, instructor:instructors(name), session_type:session_types(name)')
      .eq('school_id', schoolId)
      .order('start_date', { ascending: true })
      .limit(8),
  ])

  const totalStudents = (studentsResult as any)?.count ?? 0
  const activeSessions = (sessionsResult as any)?.count ?? 0
  const completedSessions = (completedResult as any)?.count ?? 0
  const schoolData = schoolDataRaw as any
  const sessionsData = (sessionsDataRaw as any)?.data ?? []

  const monthlyRevenue = (schoolData as any)?.monthly_revenue || 0
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
    schoolName: (schoolData as any)?.name || '',
    upcomingSessions: sessionsData || [],
  })
}
