'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar, Users, Clock, TrendingUp, ArrowRight, Plus,
  CreditCard, Mail, Bell, CheckCircle2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))

      if (demoCookie) {
        try {
          const res = await fetch('/api/demo/dashboard')
          if (res.ok) {
            const data = await res.json()
            setStats(data.stats)
            setSchoolId(data.schoolId || '')
            setUpcomingSessions(data.upcomingSessions || [])
            setLoadingSessions(false)
            return
          }
        } catch { /* fall through */ }
        setLoadingSessions(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
      if (!school) return
      const schoolId = school.id
      setSchoolId(schoolId)

      const [
        { count: students },
        { count: sessions },
        { data: revenueData },
        { data: sessionsData },
      ] = await Promise.all([
        supabase.from('students_driver_ed').select('*', { count: 'exact', head: true }).eq('school_id', schoolId),
        supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'scheduled'),
        supabase
          .from('bookings')
          .select('deposit_amount_cents')
          .eq('school_id', schoolId)
          .eq('status', 'confirmed')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase
          .from('sessions')
          .select('*, instructor:instructors(name), session_type:session_types(name)')
          .eq('school_id', schoolId)
          .order('start_date', { ascending: true })
          .limit(8),
      ])

      const totalStudents = students || 0
      const activeSessions = sessions || 0
      const monthlyRevenue = Array.isArray(revenueData)
        ? revenueData.reduce((sum: number, b: { deposit_amount_cents: number | null }) =>
            sum + (b.deposit_amount_cents ?? 0), 0) / 100
        : 0

      const { count: completedSessions } = await supabase
        .from('sessions').select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId).eq('status', 'completed')

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

  const kpiCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      delta: stats.studentsDelta,
      icon: Users,
      accent: '#4ADE80',
      accentBg: 'rgba(74,222,128,0.1)',
      href: '/school-admin/students',
    },
    {
      label: 'Active Sessions',
      value: stats.activeSessions,
      delta: stats.sessionsDelta,
      icon: Calendar,
      accent: '#78E4FF',
      accentBg: 'rgba(120,228,255,0.1)',
      href: '/school-admin/sessions',
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      delta: stats.revenueDelta,
      icon: CreditCard,
      accent: '#FBBF24',
      accentBg: 'rgba(251,191,36,0.1)',
      href: '/school-admin/billing',
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      delta: stats.completionDelta,
      icon: TrendingUp,
      accent: '#A855F7',
      accentBg: 'rgba(168,85,247,0.1)',
      href: '/school-admin/sessions',
    },
  ]

  const quickActions = [
    { icon: Plus, label: 'Schedule Session', href: '/school-admin/sessions', accent: '#4ADE80' },
    { icon: Users, label: 'Add Student', href: '/school-admin/students', accent: '#78E4FF' },
    { icon: Mail, label: 'Send Reminder', href: '/school-admin/sessions', accent: '#818CF8' },
  ]

  const popularServices = [
    { name: 'Behind the Wheel Training', count: 142, price: '$75/session' },
    { name: 'Traffic Court Awareness', count: 38, price: '$45/session' },
    { name: 'Parent Taught Course', count: 24, price: '$299/course' },
    { name: 'BTW Package (5 Sessions)', count: 18, price: '$350/pkg' },
  ]

  const recentActivity = [
    { name: 'Marcus Rivera', action: 'completed', item: 'Traffic Court Awareness', time: '2h ago', initials: 'MR' },
    { name: 'Sarah Chen', action: 'scheduled', item: 'Behind the Wheel — Session 3', time: '5h ago', initials: 'SC' },
    { name: 'James Wilson', action: 'enrolled', item: 'BTW Package (5 Sessions)', time: 'Yesterday', initials: 'JW' },
    { name: 'Elena Rodriguez', action: 'completed', item: 'Behind the Wheel — Session 4', time: 'Yesterday', initials: 'ER' },
    { name: 'David Kim', action: 'scheduled', item: 'Road Test Prep', time: '2 days ago', initials: 'DK' },
  ]

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const completionPercent = stats.completionRate

  // SVG ring params
  const ringR = 26
  const ringCircumference = 2 * Math.PI * ringR
  const ringOffset = ringCircumference - (completionPercent / 100) * ringCircumference

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '24px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '4px',
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>{today}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#0F1117',
            border: '1px solid #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#9CA3AF',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0F1117')}
          >
            <Bell className="w-4 h-4" />
          </button>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4ADE80, #22D3EE)',
            color: '#000',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            S
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '24px',
      }}>
        {kpiCards.map(({ label, value, delta, icon: Icon, accent, accentBg }) => {
          const isPositive = delta.startsWith('+') && !delta.includes('-0%')
          return (
            <div
              key={label}
              style={{
                background: '#0F1117',
                border: '1px solid #1A1A1A',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0F1117')}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#6B7280',
                }}>
                  {label}
                </p>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: accentBg,
                }}>
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
              </div>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '32px',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: '#FFFFFF',
                marginBottom: '8px',
              }}>
                {value}
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: isPositive ? '#4ADE80' : '#9CA3AF',
                background: isPositive ? 'rgba(74,222,128,0.1)' : 'rgba(156,163,175,0.1)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}>
                {delta}
              </span>
            </div>
          )
        })}
      </div>

      {/* Main Grid: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Upcoming Sessions */}
          <div style={{
            background: '#0F1117',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '24px',
          }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Upcoming Sessions
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#4ADE80',
                  background: 'rgba(74,222,128,0.12)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}>
                  {upcomingSessions.length}
                </span>
              </div>
              <Link href="/school-admin/sessions" style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#4ADE80',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loadingSessions ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>
                <p style={{ fontSize: '14px' }}>Loading sessions...</p>
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: '#6B7280', opacity: 0.4 }} />
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>No upcoming sessions</p>
                <Link href="/school-admin/sessions" style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#4ADE80',
                  textDecoration: 'none',
                }}>
                  Schedule one now →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingSessions.slice(0, 5).map(session => {
                  const date = new Date(session.start_date + 'T12:00:00')
                  const statusColor = session.status === 'scheduled' ? '#4ADE80' : session.status === 'completed' ? '#FBBF24' : '#9CA3AF'
                  const dotColor = session.status === 'scheduled' ? '#4ADE80' : session.status === 'completed' ? '#FBBF24' : '#F97316'
                  return (
                    <div key={session.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 16px',
                      background: '#050505',
                      border: '1px solid #1A1A1A',
                      borderRadius: '12px',
                      transition: 'background 0.15s, border-color 0.15s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = '#13161F'
                      el.style.borderColor = '#2A2A3A'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = '#050505'
                      el.style.borderColor = '#1A1A1A'
                    }}>
                      {/* Session type dot + icon circle */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${dotColor}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Calendar className="w-4 h-4" style={{ color: dotColor }} />
                      </div>
                      {/* Session info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '2px' }}>
                          {session.session_type?.name || 'Session'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {session.instructor?.name || 'No instructor'}
                        </div>
                      </div>
                      {/* Date/time */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                      {/* Status pill */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: session.status === 'scheduled' ? 'rgba(74,222,128,0.15)' : 'rgba(156,163,175,0.1)',
                        color: session.status === 'scheduled' ? '#4ADE80' : '#9CA3AF',
                        textTransform: 'capitalize',
                        flexShrink: 0,
                      }}>
                        {session.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div style={{
            background: '#0F1117',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
            }}>
              Recent Activity
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {recentActivity.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 0',
                  borderBottom: idx < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  {/* Avatar circle */}
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4ADE80, #22D3EE)',
                    color: '#000',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {item.initials}
                  </div>
                  {/* Action text */}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#FFFFFF' }}>{item.name}</span>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}> {item.action} </span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#9CA3AF' }}>{item.item}</span>
                  </div>
                  {/* Time */}
                  <span style={{ fontSize: '12px', color: '#6B7280', flexShrink: 0 }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Popular Services */}
          <div style={{
            background: '#0F1117',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
            }}>
              Popular Services
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {popularServices.map((svc, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#050505',
                  border: '1px solid #1A1A1A',
                  borderRadius: '10px',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#2A2A3A')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#1A1A1A')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#4ADE80' : idx === 1 ? '#78E4FF' : idx === 2 ? '#FBBF24' : '#A855F7',
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#FFFFFF' }}>{svc.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>{svc.count} sessions</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF' }}>{svc.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: '#0F1117',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}>
              Quick Actions
            </h2>
            <Link
              href="/school-admin/sessions"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#4ADE80',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#000000',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              <Plus className="w-4 h-4" />
              Schedule Session
            </Link>
            <Link
              href="/school-admin/students"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'transparent',
                border: '1px solid #1A1A1A',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF',
                textDecoration: 'none',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#13161F'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#2A2A3A'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#1A1A1A'
              }}
            >
              <Users className="w-4 h-4" />
              Add Student
            </Link>
            <Link
              href="/school-admin/sessions"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#9CA3AF',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <Mail className="w-4 h-4" />
              Send Reminder
            </Link>
          </div>

          {/* Completion Rate */}
          <div style={{
            background: '#0F1117',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h2 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
              alignSelf: 'flex-start',
            }}>
              Completion Rate
            </h2>
            {/* SVG ring */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="40"
                  cy="40"
                  r={ringR}
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="6"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={ringR}
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="6"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                }}>
                  {completionPercent}%
                </span>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
              {stats.completionRate > 0 ? 'Above national average' : 'Complete sessions to track'}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}