'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Users, Clock, TrendingUp, ArrowRight, Plus, CreditCard, BarChart2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const T = {
  text:      '#ffffff',
  muted:     '#94A3B8',
  subtle:    '#64748B',
  green:     '#4ADE80',
  cyan:      '#38BDF8',
  purple:    '#818CF8',
  amber:     '#F59E0B',
  bg:        '#050505',
}

function StatCard({
  label, value, change, icon: Icon, color, href
}: {
  label: string; value: string | number; change?: string; icon: any; color: string; href: string
}) {
  return (
    <Link
      href={href}
      className="glass-card p-6 block transition-all group"
      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl font-bold" style={{ color: T.text }}>{value}</div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: T.subtle }}>{label}</div>
      {change && (
        <div className="flex items-center gap-1 text-xs" style={{ color: T.green }}>
          <TrendingUp className="w-3 h-3" />
          {change}
        </div>
      )}
    </Link>
  )
}

function QuickAction({ icon: Icon, label, href, color }: { icon: any; label: string; href: string; color: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-5 py-4 rounded-xl transition-all group"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <span className="text-sm font-medium" style={{ color: T.text }}>{label}</span>
      <ArrowRight className="w-4 h-4 ml-auto" style={{ color: T.subtle }} />
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
      <div className="text-center py-10" style={{ color: T.subtle }}>
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No sessions yet</p>
        <Link href="/school-admin/sessions" className="text-xs font-medium mt-2 inline-block" style={{ color: T.cyan }}>
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
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(126,212,253,0.12)' }}
            >
              <Calendar className="w-4 h-4" style={{ color: '#7ED4FD' }} />
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: T.text }}>
                {session.session_type?.name || 'Session'}
              </div>
              <div className="text-xs" style={{ color: T.subtle }}>
                {session.instructor?.name || 'Instructor'} ·{' '}
                {new Date(session.start_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: session.status === 'confirmed' ? 'rgba(74,222,128,0.12)' : 'rgba(245,158,11,0.12)',
              color: session.status === 'confirmed' ? '#4ADE80' : '#F59E0B',
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
  const [stats, setStats] = useState({ students: 0, sessions: 0, pending: 0, instructors: 0, revenue: 0 })
  const [schoolId, setSchoolId] = useState('')
  const [schoolName, setSchoolName] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let schoolId: string | null = null

      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const payload = JSON.parse(atob(demoCookie.split('=')[1]))
          schoolId = payload.schoolId
        } catch {}
      }

      if (!schoolId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: school } = await supabase.from('schools').select('id,name').eq('owner_user_id', user.id).single()
        if (!school) return
        schoolId = school.id
        setSchoolName(school.name || '')
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
        revenue: 0,
      })
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: T.text }}>
            {greeting}
          </h1>
          <p className="text-sm" style={{ color: T.subtle }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/school-admin/students"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
          style={{
            background: '#0066FF',
            boxShadow: '0 0 20px rgba(0,102,255,0.3)',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Students" value={stats.students} icon={Users} color="#7ED4FD" href="/school-admin/students" />
        <StatCard label="Sessions This Week" value={stats.sessions} icon={Calendar} color="#4ADE80" href="/school-admin/sessions" />
        <StatCard label="Pending TCA" value={stats.pending} icon={Clock} color="#F59E0B" href="/school-admin/students" />
        <StatCard label="Revenue" value={`$${stats.revenue}`} icon={CreditCard} color="#818CF8" href="/school-admin/billing" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <QuickAction icon={Plus} label="Add Student" href="/school-admin/students" color="#7ED4FD" />
        <QuickAction icon={Calendar} label="Schedule Session" href="/school-admin/sessions" color="#4ADE80" />
        <QuickAction icon={BarChart2} label="View Reports" href="/school-admin/billing" color="#818CF8" />
      </div>

      {/* Recent sessions */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
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
          <div className="text-center py-10" style={{ color: T.subtle }}>
            <p className="text-sm">Loading sessions...</p>
          </div>
        )}
      </div>
    </div>
  )
}