import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuickStatsRow from '@/components/dashboard/QuickStatsRow'
import Link from 'next/link'
import { BookOpen, TrendingUp, Calendar, Clock, CheckCircle, ArrowRight, Car, Star } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const schoolId = user.user_metadata?.school_id

  // Fetch upcoming sessions for this user
  const { data: upcomingSessions } = await supabase
    .from('sessions')
    .select('*, session_types(name, color), instructors(name)')
    .gte('start_date', new Date().toISOString().split('T')[0])
    .order('start_date')
    .limit(3)

  // Mock progress data (in production, pull from enrollments/progress)
  const tcaProgress = 68 // percent

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base, #080809)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>My Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>{user.email}</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)', color: '#ffffff' }}>
            {user.email?.[0]?.toUpperCase() ?? '?'}
          </div>
        </div>

        {/* TCA Progress Card */}
        <div className="glass-card mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>Driver Education Progress</div>
              <div className="text-3xl font-bold" style={{ color: '#ffffff' }}>{tcaProgress}%</div>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(126,212,253,0.12)' }}>
              <Car className="w-7 h-7" style={{ color: '#7ED4FD' }} />
            </div>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${tcaProgress}%`,
                background: 'linear-gradient(90deg, #7ED4FD, #707BFF)',
              }}
            />
          </div>
          <p className="text-xs mt-2.5" style={{ color: '#64748B' }}>6 of 8 sessions completed · 14h / 20h TCA hours</p>
        </div>

        {/* Upcoming Sessions */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold" style={{ color: '#ffffff' }}>Upcoming Lessons</h2>
            <Link href="/book" className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(26,86,255,0.12)', color: '#60A5FA' }}>
              Book new →
            </Link>
          </div>

          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((session: any) => (
                <div key={session.id} className="glass-card" style={{ padding: '16px 20px' }}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(126,212,253,0.1)' }}>
                      <BookOpen className="w-5 h-5" style={{ color: '#7ED4FD' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: '#ffffff' }}>{session.session_types?.name ?? 'Lesson'}</div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: '#94A3B8' }}>
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(`${session.start_date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        <span>·</span>
                        <Clock className="w-3.5 h-3.5" />
                        {session.start_time?.slice(0, 5)}
                      </div>
                      {session.instructors && (
                        <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>with {session.instructors.name}</div>
                      )}
                    </div>
                    <span className="status-pill status-active shrink-0">Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3" style={{ color: '#64748B' }} />
              <p className="text-sm font-medium mb-3" style={{ color: '#ffffff' }}>No upcoming lessons</p>
              <Link href="/book" className="btn-pill inline-flex items-center gap-2 text-sm font-semibold"
                style={{ background: '#1A56FF', color: '#fff', padding: '10px 20px' }}>
                Book your first lesson <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-5">
          <h2 className="text-base font-semibold mb-3" style={{ color: '#ffffff' }}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/book" className="glass-card flex items-center gap-3 p-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ background: 'rgba(26,86,255,0.15)' }}>
                <Calendar className="w-5 h-5" style={{ color: '#60A5FA' }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: '#ffffff' }}>Book Lesson</div>
                <div className="text-xs" style={{ color: '#64748B' }}>Schedule a session</div>
              </div>
            </a>
            <a href="/complete-profile" className="glass-card flex items-center gap-3 p-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ background: 'rgba(74,222,128,0.12)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: '#4ADE80' }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: '#ffffff' }}>Profile</div>
                <div className="text-xs" style={{ color: '#64748B' }}>Update your info</div>
              </div>
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card text-center p-4">
            <div className="text-2xl font-bold mb-0.5" style={{ color: '#ffffff' }}>6</div>
            <div className="text-xs" style={{ color: '#64748B' }}>Sessions Done</div>
          </div>
          <div className="glass-card text-center p-4">
            <div className="text-2xl font-bold mb-0.5" style={{ color: '#ffffff' }}>14h</div>
            <div className="text-xs" style={{ color: '#64748B' }}>TCA Hours</div>
          </div>
          <div className="glass-card text-center p-4">
            <div className="text-2xl font-bold mb-0.5 flex items-center justify-center gap-1" style={{ color: '#F97316' }}>
              <Star className="w-4 h-4" style={{ color: '#F97316' }} />4.8
            </div>
            <div className="text-xs" style={{ color: '#64748B' }}>Instructor Rating</div>
          </div>
        </div>

      </div>
    </div>
  )
}