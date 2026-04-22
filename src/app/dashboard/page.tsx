import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuickStatsRow from '@/components/dashboard/QuickStatsRow'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const schoolId = user.user_metadata?.school_id

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
            DC
          </div>
        </div>

        {/* Live stats */}
        <QuickStatsRow schoolId={schoolId} />

        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <QuickActionCard icon="📅" label="Book Lesson" href="/book" />
          <QuickActionCard icon="📊" label="Students" href="/students" />
          <QuickActionCard icon="💳" label="Payments" href="/payments" />
          <QuickActionCard icon="⚠️" label="Log Incident" href="/dashboard" danger />
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  icon,
  label,
  href,
  danger = false,
}: {
  icon: string
  label: string
  href: string
  danger?: boolean
}) {
  return (
    <a
      href={href}
      className={`block bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors ${
        danger ? 'border-red-500/30 hover:border-red-500/50' : ''
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <span className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>
        {label}
      </span>
    </a>
  )
}
