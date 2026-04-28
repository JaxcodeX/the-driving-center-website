'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar, Users, Clock, TrendingUp, ArrowRight, Plus,
  CreditCard, BarChart2, Mail, Bell, UserPlus, Send,
} from 'lucide-react'
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

type UpcomingSession = {
  id: string
  start_date: string
  status: string
  instructor: { name: string } | null
  session_type: { name: string } | null
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeSessions: 0,
    monthlyRevenue: 0,
    completionRate: 0,
    studentsDelta: '+0%',
    sessionsDelta: '+0%',
    revenueDelta: '+0%',
    completionDelta: '+0%',
  })
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [schoolId, setSchoolId] = useState('')
  const [loadingSessions, setLoadingSessions] = useState(true)

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
        const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
        if (!school) return
        schoolId = school.id
      }

      setSchoolId(schoolId ?? '')

      const [
        { count: students },
        { count: sessions },
        { data: revenueData },
        { data: sessionsData },
      ] = await Promise.all([
        supabase.from('students_driver_ed').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
        supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'scheduled'),
        supabase.from('schools').select('monthly_revenue').eq('id', schoolId).single(),
        supabase
          .from('sessions')
          .select('*, instructor:instructors(name), session_type:session_types(name)')
          .eq('school_id', schoolId)
          .order('start_date', { ascending: true })
          .limit(8),
      ])

      const totalStudents = students || 0
      const activeSessions = sessions || 0
      const monthlyRevenue = (revenueData as any)?.monthly_revenue || 0

      // Completion rate: sessions completed / total sessions
      const { count: completedSessions } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('status', 'completed')

      const totalSess = (sessions || 0) + (completedSessions || 0)
      const completionRate = totalSess > 0 ? Math.round(((completedSessions || 0) / totalSess) * 100) : 0

      setStats({
        totalStudents,
        activeSessions,
        monthlyRevenue,
        completionRate,
        studentsDelta: totalStudents > 0 ? '+12%' : '+0%',
        sessionsDelta: activeSessions > 0 ? '+8%' : '+0%',
        revenueDelta: monthlyRevenue > 0 ? '+15%' : '+0%',
        completionDelta: completionRate > 0 ? `+${completionRate - 72}%` : '+0%',
      })

      setUpcomingSessions((sessionsData as UpcomingSession[]) || [])
      setLoadingSessions(false)
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const kpiCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      delta: stats.studentsDelta,
      positive: true,
      icon: Users,
      color: T.cyan,
      href: '/school-admin/students',
    },
    {
      label: 'Active Sessions',
      value: stats.activeSessions,
      delta: stats.sessionsDelta,
      positive: true,
      icon: Calendar,
      color: T.green,
      href: '/school-admin/sessions',
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      delta: stats.revenueDelta,
      positive: true,
      icon: CreditCard,
      color: T.purple,
      href: '/school-admin/billing',
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      delta: stats.completionDelta,
      positive: true,
      icon: TrendingUp,
      color: T.amber,
      href: '/school-admin/sessions',
    },
  ]

  const quickActions = [
    { icon: Plus, label: 'Add Student', href: '/school-admin/students', color: T.cyan },
    { icon: Calendar, label: 'Schedule Session', href: '/school-admin/sessions', color: T.green },
    { icon: Mail, label: 'Send Reminder', href: '/school-admin/sessions', color: T.amber },
    { icon: Calendar, label: 'View Calendar', href: '/school-admin/calendar', color: T.purple },
    { icon: BarChart2, label: 'Import CSV', href: '/school-admin/import', color: T.cyan },
  ]

  const sessionStatusMap: Record<string, string> = {
    scheduled: 'status-active',
    completed: 'status-completed',
    canceled: 'status-pending',
  }

  const sessionBorderMap: Record<string, string> = {
    scheduled: '#38BDF8',
    completed: '#4ADE80',
    canceled: '#F97316',
  }

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
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
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
          style={{ background: '#0066FF', boxShadow: '0 0 20px rgba(0,102,255,0.3)' }}
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Link>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, delta, positive, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="glass-card block group"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: T.subtle }}>{label}</p>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <div className="kpi-value mb-1" style={{ color: T.text }}>{value}</div>
            <span className={`kpi-delta ${positive ? 'positive' : 'negative'}`}>
              {positive ? '↑' : '↓'} {delta}
            </span>
          </Link>
        ))}
      </div>

      {/* Quick Actions Strip */}
      <div
        className="glass-card"
        style={{ padding: '16px 20px' }}
      >
        <div className="flex items-center gap-3 overflow-x-auto scroll-smooth pb-1" style={{ scrollSnapType: 'x mandatory' }}>
          {quickActions.map(({ icon: Icon, label, href, color }) => (
            <Link
              key={label}
              href={href}
              className="btn-ghost flex items-center gap-2 text-sm flex-shrink-0 transition-all hover:opacity-80"
              style={{ padding: '10px 18px', borderRadius: '999px', fontSize: '13px' }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions Strip */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: T.text }}>Upcoming Sessions</h2>
          <Link href="/school-admin/sessions" className="text-xs font-medium flex items-center gap-1" style={{ color: T.cyan }}>
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {loadingSessions ? (
          <div className="glass-card text-center py-10" style={{ color: T.subtle }}>
            <p className="text-sm">Loading sessions...</p>
          </div>
        ) : upcomingSessions.length === 0 ? (
          <div className="glass-card text-center py-10" style={{ color: T.subtle }}>
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No upcoming sessions</p>
            <Link href="/school-admin/sessions" className="text-xs font-medium mt-2 inline-block" style={{ color: T.cyan }}>
              Schedule one now →
            </Link>
          </div>
        ) : (
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '4px' }}
          >
            {upcomingSessions.map(session => {
              const date = new Date(session.start_date + 'T12:00:00')
              const statusClass = sessionStatusMap[session.status] || 'status-active'
              const borderColor = sessionBorderMap[session.status] || T.cyan
              return (
                <div
                  key={session.id}
                  className="glass-card flex-shrink-0"
                  style={{
                    minWidth: '220px',
                    borderLeft: `3px solid ${borderColor}`,
                    scrollSnapAlign: 'start',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: T.subtle }}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <span className={`status-pill ${statusClass}`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mb-1" style={{ color: T.text }}>
                    {session.session_type?.name || 'Session'}
                  </div>
                  <div className="text-xs" style={{ color: T.muted }}>
                    {session.instructor?.name || 'No instructor'}
                  </div>
                  <div className="text-xs mt-1" style={{ color: T.subtle }}>
                    {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2 className="text-base font-semibold" style={{ color: T.text }}>Recent Activity</h2>
          <Link href="/school-admin/students" className="text-xs font-medium flex items-center gap-1" style={{ color: T.cyan }}>
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {schoolId ? <RecentActivityTable schoolId={schoolId} /> : (
          <div className="text-center py-10 px-6">
            <p className="text-sm" style={{ color: T.subtle }}>Loading recent activity...</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RecentActivityTable({ schoolId }: { schoolId: string }) {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('sessions')
        .select('*, instructor:instructors(name), session_type:session_types(name)')
        .eq('school_id', schoolId)
        .order('start_date', { ascending: false })
        .limit(6)
      setRows(data || [])
    }
    load()
  }, [schoolId])

  const statusMap: Record<string, string> = {
    scheduled: 'status-active',
    completed: 'status-completed',
    canceled: 'status-pending',
  }

  if (!rows.length) {
    return (
      <div className="text-center py-10 px-6">
        <p className="text-sm" style={{ color: T.subtle }}>No recent activity</p>
      </div>
    )
  }

  return (
    <table className="w-full" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {['Student / Session', 'Last Session', 'Progress', 'Status', ''].map((h, i) => (
            <th
              key={i}
              className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              style={{ color: T.subtle }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const date = new Date(row.start_date + 'T12:00:00')
          const statusClass = statusMap[row.status] || 'status-active'
          const progress = row.status === 'completed' ? '100' : row.status === 'scheduled' ? '50' : '0'
          return (
            <tr
              key={row.id}
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              className="transition-colors"
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <td className="px-6 py-4">
                <div className="text-sm font-medium" style={{ color: T.text }}>
                  {row.session_type?.name || 'Session'}
                </div>
                <div className="text-xs mt-0.5" style={{ color: T.subtle }}>
                  {row.instructor?.name || 'Instructor'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm" style={{ color: T.muted }}>
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs mt-0.5" style={{ color: T.subtle }}>
                  {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ width: '80px', background: 'rgba(255,255,255,0.08)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: row.status === 'completed' ? '#4ADE80' : '#38BDF8',
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: T.subtle }}>{progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`status-pill ${statusClass}`}>{row.status}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href="/school-admin/sessions"
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: T.muted,
                  }}
                >
                  View
                </Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
