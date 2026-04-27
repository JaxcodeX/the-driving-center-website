'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Users, Clock, TrendingUp, ArrowRight, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const T = {
  bg:        '#050505',
  surface:   '#0D0D0D',
  elevated:  '#18181b',
  border:    '#1A1A1A',
  borderLt:  '#27272a',
  text:      '#ffffff',
  secondary: '#94A3B8',
  muted:     '#52525b',
  cyan:      '#38BDF8',
  purple:    '#818CF8',
  green:     '#10B981',
  amber:     '#f59e0b',
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

function StatCard({
  label, value, icon: Icon, color, href
}: {
  label: string; value: string | number; icon: any; color: string; href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-6 rounded-2xl transition-all group"
      style={{ background: T.surface, border: `1px solid ${T.border}` }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = `${color}50`)}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = T.border)}
    >
      <div>
        <div className="text-3xl font-bold mb-1" style={{ color: T.text }}>{value}</div>
        <div className="text-sm" style={{ color: T.muted }}>{label}</div>
      </div>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </Link>
  )
}

function RecentSessions({ schoolId }: { schoolId: string }) {
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('sessions')
        .select('*, instructor:instructors(name), session_type:session_types(name)')
        .eq('school_id', schoolId)
        .order('start_date', { ascending: true })
        .limit(5)
      setSessions(data || [])
    }
    load()
  }, [schoolId])

  if (!sessions.length) {
    return (
      <div className="text-center py-10" style={{ color: T.muted }}>
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No sessions yet</p>
        <Link
          href="/school-admin/sessions"
          className="text-xs font-medium mt-2 inline-block"
          style={{ color: T.cyan }}
        >
          Create your first session →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sessions.map(session => (
        <div
          key={session.id}
          className="flex items-center justify-between p-4 rounded-xl"
          style={{ background: T.elevated }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${T.cyan}15` }}
            >
              <Calendar className="w-4 h-4" style={{ color: T.cyan }} />
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: T.text }}>
                {session.session_type?.name || 'Session'}
              </div>
              <div className="text-xs" style={{ color: T.muted }}>
                {session.instructor?.name || 'Instructor'} · {new Date(session.start_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              background: session.status === 'confirmed' ? `${T.green}15` : `${T.amber}15`,
              color: session.status === 'confirmed' ? T.green : T.amber,
            }}
          >
            {session.status}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ students: 0, sessions: 0, pending: 0, instructors: 0 })
  const [schoolId, setSchoolId] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let schoolId: string | null = null

      // Try demo_user cookie first (DEMO_MODE — no Supabase JWT needed)
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const payload = JSON.parse(atob(demoCookie.split('=')[1]))
          schoolId = payload.schoolId
        } catch {}
      }

      // Fall back to Supabase auth
      if (!schoolId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
        if (!school) return
        schoolId = school.id
      }
      setSchoolId(schoolId ?? '')

      const [{ count: students }, { count: sessions }, { count: instructors }] = await Promise.all([
        supabase.from('students_driver_ed').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
        supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
        supabase.from('instructors').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
      ])

      setStats({
        students: students || 0,
        sessions: sessions || 0,
        instructors: instructors || 0,
        pending: 0,
      })
    }
    load()
  }, [])

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: T.text }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: T.muted }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/school-admin/students"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
          style={{ background: T.grad }}
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Students" value={stats.students} icon={Users} color={T.cyan} href="/school-admin/students" />
        <StatCard label="Sessions" value={stats.sessions} icon={Calendar} color={T.green} href="/school-admin/sessions" />
        <StatCard label="Instructors" value={stats.instructors} icon={TrendingUp} color={T.purple} href="/school-admin/instructors" />
        <StatCard label="Pending TCA" value={stats.pending} icon={Clock} color={T.amber} href="/school-admin/students" />
      </div>

      {/* Recent sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: T.text }}>Upcoming Sessions</h2>
          <Link
            href="/school-admin/sessions"
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: T.cyan }}
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {schoolId ? (
          <RecentSessions schoolId={schoolId} />
        ) : (
          <div className="text-center py-10" style={{ color: T.muted }}>
            <p className="text-sm">Loading sessions...</p>
          </div>
        )}
      </div>
    </div>
  )
}
