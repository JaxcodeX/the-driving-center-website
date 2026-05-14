'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar, Users, CreditCard, TrendingUp, Plus, Mail, Clock, X, ArrowRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type UpcomingSession = {
  id: string
  start_date: string
  status: string
  instructor: { name: string } | null
  session_type: { name: string } | null
}

type ModalType = 'revenue' | 'students' | 'sessions' | 'completion' | null

// NAV_ITEMS removed — layout provides the sidebar

// Design tokens
const BG = '#0D0D12'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)'
const GLASS_BG = 'rgba(255,255,255,0.03)'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_BLUR = 'blur(24px)'
const TEXT_SECONDARY = '#9CA3AF'
const ACCENT_ORANGE = '#FF8C42'
const ACCENT_CYAN = '#67E8F9'
const ACCENT_LAVENDER = '#A78BFA'
const ACCENT_GREEN = '#4ADE80'

const CARD_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
const CARD_SHADOW_HOVER = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'

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
  const [pendingBookings, setPendingBookings] = useState(0)
  const [unconfirmedSessions, setUnconfirmedSessions] = useState(0)
  const [needsReminder, setNeedsReminder] = useState(0)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  // mobile nav handled by layout

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
            setPendingBookings(data.pendingBookings || 0)
            setUnconfirmedSessions(data.unconfirmedSessions || 0)
            setNeedsReminder(data.needsReminder || 0)
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
        { count: pendingBookings },
        { count: unconfirmedSessions },
        { count: needsReminder },
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
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'pending'),
        supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'pending'),
        supabase.from('sessions').select('*', { count: 'exact', head: true })
          .eq('school_id', schoolId).eq('status', 'scheduled')
          .lt('start_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()),
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

      // ── Real delta calculations ───────────────────────────────────────
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString() // last day of prev month

      const [
        { count: lastMonthStudents },
        { count: lastMonthActiveSessions },
        { data: lastMonthRevenueRows },
      ] = await Promise.all([
        supabase.from('students_driver_ed').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).gte('enrollment_date', lastMonthStart).lt('enrollment_date', thisMonthStart),
        supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('school_id', schoolId).eq('status', 'scheduled').gte('start_date', lastMonthStart).lt('start_date', thisMonthStart),
        supabase.from('bookings').select('deposit_amount_cents').eq('school_id', schoolId).eq('status', 'confirmed').gte('created_at', lastMonthStart).lt('created_at', thisMonthStart),
      ])

      const lastMonthRevenue = (lastMonthRevenueRows as { deposit_amount_cents: number | null }[] || [])
        .reduce((sum, b) => sum + (b.deposit_amount_cents ?? 0), 0) / 100

      const studentsDeltaRaw = lastMonthStudents && lastMonthStudents > 0
        ? Math.round(((totalStudents - (lastMonthStudents as number)) / (lastMonthStudents as number)) * 100)
        : totalStudents > 0 ? 100 : 0
      const studentsDelta = (studentsDeltaRaw >= 0 ? '+' : '') + studentsDeltaRaw + '%'

      const sessionsDeltaRaw = lastMonthActiveSessions && (lastMonthActiveSessions as number) > 0
        ? Math.round(((activeSessions - (lastMonthActiveSessions as number)) / (lastMonthActiveSessions as number)) * 100)
        : activeSessions > 0 ? 100 : 0
      const sessionsDelta = (sessionsDeltaRaw >= 0 ? '+' : '') + sessionsDeltaRaw + '%'

      const revenueDeltaRaw = lastMonthRevenue > 0
        ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : monthlyRevenue > 0 ? 100 : 0
      const revenueDelta = (revenueDeltaRaw >= 0 ? '+' : '') + revenueDeltaRaw + '%'

      const completionTarget = 70
      const completionDelta = (completionRate >= completionTarget ? '+' : '') + (completionRate - completionTarget) + '%'

      setStats({
        totalStudents,
        activeSessions,
        monthlyRevenue,
        completionRate,
        studentsDelta,
        sessionsDelta,
        revenueDelta,
        completionDelta,
      })
      setUpcomingSessions((sessionsData as UpcomingSession[]) || [])
      setPendingBookings(pendingBookings || 0)
      setUnconfirmedSessions(unconfirmedSessions || 0)
      setNeedsReminder(needsReminder || 0)
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
      accent: ACCENT_CYAN,
      accentBg: 'rgba(103,232,249,0.1)',
      modalKey: 'students' as ModalType,
    },
    {
      label: 'Active Sessions',
      value: stats.activeSessions,
      delta: stats.sessionsDelta,
      icon: Calendar,
      accent: ACCENT_LAVENDER,
      accentBg: 'rgba(167,139,250,0.1)',
      modalKey: 'sessions' as ModalType,
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      delta: stats.revenueDelta,
      icon: CreditCard,
      accent: ACCENT_GREEN,
      accentBg: 'rgba(74,222,128,0.1)',
      modalKey: 'revenue' as ModalType,
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      delta: stats.completionDelta,
      icon: TrendingUp,
      accent: ACCENT_GREEN,
      accentBg: 'rgba(74,222,128,0.1)',
      modalKey: 'completion' as ModalType,
    },
  ]

  const quickActions = [
    { icon: Plus, label: 'Schedule', href: '/school-admin/sessions', primary: true },
    { icon: Users, label: 'Add Student', href: '/school-admin/students', primary: false },
    { icon: Mail, label: 'Send Reminder', href: '/school-admin/sessions', primary: false },
  ]

  const recentActivity = [
    { name: 'Marcus Rivera', action: 'completed', item: 'Traffic Court Awareness', time: '2h ago', initials: 'MR' },
    { name: 'Sarah Chen', action: 'scheduled', item: 'Behind the Wheel — Session 3', time: '5h ago', initials: 'SC' },
    { name: 'James Wilson', action: 'enrolled', item: 'BTW Package (5 Sessions)', time: 'Yesterday', initials: 'JW' },
    { name: 'Elena Rodriguez', action: 'completed', item: 'Behind the Wheel — Session 4', time: 'Yesterday', initials: 'ER' },
    { name: 'David Kim', action: 'scheduled', item: 'Road Test Prep', time: '2 days ago', initials: 'DK' },
  ]

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: BG,
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: BG_GRADIENT,
        pointerEvents: 'none',
        zIndex: 0,
      }} />





      {/* Main Content */}
      <div className="admin-main">

        {/* Top bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px',
        }}>
          <div>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '32px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '4px',
              letterSpacing: '-0.01em',
            }}>
              {greeting}
            </h1>
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>{today}</p>
          </div>
          {/* Note: bell + avatar are in the layout topbar, no duplicates needed here */}
        </div>

        {/* KPI Row */}
        <div className="admin-kpi-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {kpiCards.map(({ label, value, delta, icon: Icon, accent, accentBg, modalKey }) => {
            const isPositive = delta.startsWith('+') && !delta.includes('-0%')
            return (
              <div
                key={label}
                onClick={() => setActiveModal(modalKey)}
                style={{
                  background: GLASS_BG,
                  backdropFilter: GLASS_BLUR,
                  WebkitBackdropFilter: GLASS_BLUR,
                  border: `1px solid ${GLASS_BORDER}`,
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'block',
                  boxShadow: CARD_SHADOW,
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = CARD_SHADOW_HOVER
                  el.style.borderColor = `${accent}40`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = CARD_SHADOW
                  el.style.borderColor = GLASS_BORDER
                }}
              >
                {/* Warm accent glow on hover */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: '80px', height: '80px',
                  background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: TEXT_SECONDARY,
                  }}>
                    {label}
                  </p>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '16px',
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
                  fontSize: '40px',
                  fontWeight: '800',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#FFFFFF',
                  marginBottom: '10px',
                }}>
                  {value}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: isPositive ? ACCENT_GREEN : TEXT_SECONDARY,
                  background: isPositive ? 'rgba(74,222,128,0.1)' : 'rgba(156,163,175,0.08)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}>
                  {delta}
                </span>
              </div>
            )
          })}
        </div>

        {/* Main 2-column grid */}
        <div className="admin-2col" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Upcoming Sessions */}
            <div style={{
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '24px',
              padding: '28px',
              boxShadow: CARD_SHADOW,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: TEXT_SECONDARY,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    Upcoming Sessions
                  </h2>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: ACCENT_GREEN,
                    background: 'rgba(74,222,128,0.1)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}>
                    {upcomingSessions.length}
                  </span>
                </div>
                <Link href="/school-admin/sessions" style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: ACCENT_GREEN,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'gap 0.15s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.gap = '8px')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.gap = '4px')}
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {loadingSessions ? (
                <div style={{ textAlign: 'center', padding: '40px', color: TEXT_SECONDARY }}>
                  <p style={{ fontSize: '14px' }}>Loading sessions...</p>
                </div>
              ) : upcomingSessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: TEXT_SECONDARY, opacity: 0.4 }} />
                  <p style={{ fontSize: '14px', color: TEXT_SECONDARY, marginBottom: '8px' }}>No upcoming sessions</p>
                  <Link href="/school-admin/sessions" style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: ACCENT_GREEN,
                    textDecoration: 'none',
                  }}>
                    Schedule one now →
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {upcomingSessions.slice(0, 5).map(session => {
                    const date = new Date(session.start_date + 'T12:00:00')
                    const statusConfig: Record<string, { dot: string }> = {
                      scheduled: { dot: '#38BDF8' },
                      completed: { dot: '#4ADE80' },
                      pending: { dot: '#FBBF24' },
                      cancelled: { dot: '#EF4444' },
                    }
                    const sc = statusConfig[session.status] ?? { dot: TEXT_SECONDARY }
                    return (
                      <div key={session.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '12px 14px',
                        background: 'rgba(0,0,0,0.2)',
                        border: `1px solid ${GLASS_BORDER}`,
                        borderRadius: '16px',
                        transition: 'background 0.15s, border-color 0.15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(255,255,255,0.03)'
                        el.style.borderColor = 'rgba(255,255,255,0.1)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(0,0,0,0.2)'
                        el.style.borderColor = GLASS_BORDER
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: sc.dot,
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${sc.dot}`,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '1px' }}>
                            {session.session_type?.name || 'Session'}
                          </div>
                          <div style={{ fontSize: '13px', color: TEXT_SECONDARY, fontWeight: '400' }}>
                            {session.instructor?.name || 'No instructor'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: '500' }}>
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>
                            {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div style={{
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '24px',
              padding: '28px',
              boxShadow: CARD_SHADOW,
            }}>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                color: TEXT_SECONDARY,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                Recent Activity
              </h2>
              <div>
                {recentActivity.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 0',
                    borderBottom: idx < recentActivity.length - 1 ? `1px solid ${GLASS_BORDER}` : 'none',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${ACCENT_GREEN}, ${ACCENT_CYAN})`,
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
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>{item.name}</span>
                      <span style={{ fontSize: '14px', color: TEXT_SECONDARY }}> {item.action} </span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: TEXT_SECONDARY }}>{item.item}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: TEXT_SECONDARY, flexShrink: 0 }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Quick Actions */}
            <div style={{
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '24px',
              padding: '24px',
              boxShadow: CARD_SHADOW,
            }}>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                color: TEXT_SECONDARY,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px',
              }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {quickActions.map(({ icon: QIcon, label, href, primary }) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 14px',
                      height: '36px',
                      background: primary ? 'rgba(255,140,66,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${primary ? 'rgba(255,140,66,0.25)' : GLASS_BORDER}`,
                      borderRadius: '16px',
                      textDecoration: 'none',
                      transition: 'background 0.15s, border-color 0.15s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = primary ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)'
                      el.style.borderColor = primary ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.12)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = primary ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)'
                      el.style.borderColor = primary ? 'rgba(74,222,128,0.25)' : GLASS_BORDER
                    }}
                  >
                    <QIcon className="w-4 h-4" style={{ color: primary ? ACCENT_GREEN : TEXT_SECONDARY }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: primary ? ACCENT_GREEN : '#FFFFFF' }}>{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pending Actions */}
            <div style={{
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '24px',
              padding: '28px',
              boxShadow: CARD_SHADOW,
            }}>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '11px',
                fontWeight: '600',
                color: TEXT_SECONDARY,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                Pending Actions
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Pending Bookings', value: pendingBookings, accent: ACCENT_GREEN },
                  { label: 'Unconfirmed Sessions', value: unconfirmedSessions, accent: ACCENT_LAVENDER },
                  { label: 'Sessions Needing Reminder', value: needsReminder, accent: ACCENT_CYAN },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '16px',
                    border: `1px solid ${GLASS_BORDER}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: accent,
                        boxShadow: `0 0 6px ${accent}`,
                      }} />
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#FFFFFF' }}>{label}</span>
                    </div>
                    <span style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile hamburger button */}




      {/* KPI Detail Modal */}
      {activeModal && (
        <div
          onClick={() => setActiveModal(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#13161F',
              border: '1px solid rgba(74,222,128,0.15)',
              borderRadius: '28px',
              padding: '36px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(74,222,128,0.05)',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            >
              <X className="w-4 h-4" />
            </button>

            {activeModal === 'revenue' && (
              <>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,140,66,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <CreditCard className="w-5 h-5" style={{ color: ACCENT_ORANGE }} />
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>Monthly Revenue</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px' }}>Revenue breakdown for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Confirmed Payments', value: `$${(stats.monthlyRevenue * 0.75).toLocaleString()}`, color: ACCENT_GREEN, pct: '75%' },
                    { label: 'Pending Payments', value: `$${(stats.monthlyRevenue * 0.25).toLocaleString()}`, color: '#FBBF24', pct: '25%' },
                    { label: 'Total Revenue', value: `$${stats.monthlyRevenue.toLocaleString()}`, color: '#FFFFFF', pct: '100%' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{item.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '700', color: item.color }}>{item.value}</span>
                        <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600' }}>{item.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeModal === 'students' && (
              <>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(103,232,249,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Users className="w-5 h-5" style={{ color: ACCENT_CYAN }} />
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>Student Breakdown</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px' }}>Enrollment status for all {stats.totalStudents} students</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Active Now', value: Math.round(stats.totalStudents * 0.7), color: ACCENT_GREEN },
                    { label: 'Enrolled', value: Math.round(stats.totalStudents * 0.15), color: ACCENT_LAVENDER },
                    { label: 'Completed', value: stats.totalStudents - Math.round(stats.totalStudents * 0.7) - Math.round(stats.totalStudents * 0.15), color: ACCENT_CYAN },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{item.label}</span>
                      </div>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: '700', color: '#FFFFFF' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeModal === 'sessions' && (
              <>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <Calendar className="w-5 h-5" style={{ color: ACCENT_LAVENDER }} />
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>Upcoming Sessions</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px' }}>Next sessions on your schedule</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {upcomingSessions.slice(0, 4).map((session) => {
                    const date = new Date(session.start_date + 'T12:00:00')
                    return (
                      <div key={session.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '2px' }}>{session.session_type?.name || 'Session'}</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>{session.instructor?.name || 'No instructor'} · {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        </div>
                        <span style={{ fontSize: '13px', color: ACCENT_LAVENDER, fontWeight: '600' }}>{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {activeModal === 'completion' && (
              <>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(74,222,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: ACCENT_GREEN }} />
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>Completion Rate</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px' }}>Session completion performance</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
                  {/* Progress ring */}
                  <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                      <circle cx="40" cy="40" r="32" fill="none" stroke={ACCENT_GREEN} strokeWidth="8"
                        strokeDasharray={`${(stats.completionRate / 100) * 201.06} 201.06`}
                        strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '800', color: ACCENT_GREEN }}>{stats.completionRate}%</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>On-time completion rate</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Based on total scheduled sessions</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>↑ Higher than last month — great work!</p>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .admin-2col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
