import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuickStatsRow from '@/components/dashboard/QuickStatsRow'
import Link from 'next/link'

export default async function SchoolAdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const schoolId = user.user_metadata?.school_id ?? user.id

  // Fetch recent students + upcoming sessions
  const [{ data: students }, { data: sessions }] = await Promise.all([
    supabase
      .from('students_driver_ed')
      .select('id, legal_name, created_at, driving_hours, certificate_issued_at')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('sessions')
      .select('id, start_date, start_time, seats_booked, max_seats')
      .eq('school_id', schoolId)
      .eq('cancelled', false)
      .gte('start_date', new Date().toISOString().split('T')[0])
      .order('start_date', { ascending: true })
      .limit(5),
  ])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <span className="font-semibold">School Admin</span>
          </div>
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <QuickStatsRow schoolId={schoolId} />

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/school-admin/sessions"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
          >
            <div className="text-2xl mb-1">📅</div>
            <div className="text-sm font-medium">Sessions</div>
          </Link>
          <Link
            href="/school-admin/students"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
          >
            <div className="text-2xl mb-1">🎓</div>
            <div className="text-sm font-medium">Students</div>
          </Link>
          <Link
            href="/school-admin/instructors"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
          >
            <div className="text-2xl mb-1">👨‍🏫</div>
            <div className="text-sm font-medium">Instructors</div>
          </Link>
        </div>

        {/* Recent students */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Students</h2>
            <Link
              href="/school-admin/students"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              View all →
            </Link>
          </div>
          {(students ?? []).length === 0 ? (
            <p className="text-gray-500 text-sm">No students yet.</p>
          ) : (
            <div className="space-y-3">
              {students!.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">Student</div>
                    <div className="text-xs text-gray-500">
                      {s.driving_hours}h driven ·{' '}
                      {s.certificate_issued_at ? '✅ Certified' : 'In progress'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming sessions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming Sessions</h2>
            <Link
              href="/school-admin/sessions"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Manage →
            </Link>
          </div>
          {(sessions ?? []).length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming sessions.</p>
          ) : (
            <div className="space-y-3">
              {sessions!.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {new Date(`${s.start_date}T12:00:00`).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at {s.start_time}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s.seats_booked}/{s.max_seats} seats booked
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
