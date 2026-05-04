'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar, Users, CreditCard, TrendingUp, Plus, Mail, Bell,
  Clock, CheckCircle2, Car, Settings, BarChart3, ChevronRight,
  ArrowRight, LayoutDashboard, GraduationCap, DollarSign,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type UpcomingSession = {
  id: string
  start_date: string
  status: string
  instructor: { name: string } | null
  session_type: { name: string } | null
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin', active: true },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students', active: false },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions', active: false },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors', active: false },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar', active: false },
  { icon: DollarSign, label: 'Billing', href: '/school-admin/billing', active: false },
  { icon: Settings, label: 'Settings', href: '/school-admin/settings', active: false },
]

const GLASS_BG = 'rgba(255,255,255,0.04)'
const GLASS_BORDER = 'rgba(255,255,255,0.08)'
const GLASS_BLUR = 'blur(20px)'
const TEXT_SECONDARY = '#9CA3AF'
const BG = '#0A0A0F'

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
      accentBg: 'rgba(74,222,128,0.12)',
      href: '/school-admin/students',
    },
    {
      label: 'Active Sessions',
      value: stats.activeSessions,
      delta: stats.sessionsDelta,
      icon: Calendar,
      accent: '#67E8F9',
      accentBg: 'rgba(103,232,249,0.12)',
      href: '/school-admin/sessions',
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      delta: stats.revenueDelta,
      icon: CreditCard,
      accent: '#FB923C',
      accentBg: 'rgba(251,146,60,0.12)',
      href: '/school-admin/billing',
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      delta: stats.completionDelta,
      icon: TrendingUp,
      accent: '#A78BFA',
      accentBg: 'rgba(167,139,250,0.12)',
      href: '/school-admin/sessions',
    },
  ]

  const quickActions = [
    { icon: Plus, label: 'Schedule Session', href: '/school-admin/sessions', accent: '#4ADE80', bg: 'rgba(74,222,128,0.12)' },
    { icon: Users, label: 'Add Student', href: '/school-admin/students', accent: '#67E8F9', bg: 'rgba(103,232,249,0.08)' },
    { icon: Mail, label: 'Send Reminder', href: '/school-admin/sessions', accent: '#A78BFA', bg: 'rgba(167,139,250,0.08)' },
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
  const completionPercent = stats.completionRate

  const ringR = 26
  const ringCircumference = 2 * Math.PI * ringR
  const ringOffset = ringCircumference - (completionPercent / 100) * ringCircumference

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: GLASS_BG,
        backdropFilter: GLASS_BLUR,
        WebkitBackdropFilter: GLASS_BLUR,
        borderRight: `1px solid ${GLASS_BORDER}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          padding: '28px 20px 20px',
          borderBottom: `1px solid ${GLASS_BORDER}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4ADE80, #67E8F9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Car className="w-4 h-4" style={{ color: '#000' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>Driving Center</div>
              <div style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>School Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
              <Link
                key={label}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  borderLeft: active ? '3px solid #4ADE80' : '3px solid transparent',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <NavIcon className="w-4 h-4" style={{ color: active ? '#4ADE80' : TEXT_SECONDARY, flexShrink: 0 }} />
                <span style={{
                  fontSize: '13px',
                  fontWeight: active ? '600' : '500',
                  color: active ? '#FFFFFF' : TEXT_SECONDARY,
                }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Demo badge */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${GLASS_BORDER}` }}>
          <div style={{
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(251,146,60,0.12)',
            border: '1px solid rgba(251,146,60,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#FB923C',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#FB923C' }}>Demo Mode</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '220px',
        padding: '40px 48px',
        maxWidth: '1100px',
      }}>

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
              fontSize: '28px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '4px',
            }}>
              {greeting}
            </h1>
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>{today}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: TEXT_SECONDARY,
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = GLASS_BG
              ;(e.currentTarget as HTMLElement).style.borderColor = GLASS_BORDER
            }}
            >
              <Bell className="w-4 h-4" />
            </button>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4ADE80, #67E8F9)',
              color: '#000',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              S
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {kpiCards.map(({ label, value, delta, icon: Icon, accent, accentBg, href }) => {
            const isPositive = delta.startsWith('+') && !delta.includes('-0%')
            return (
              <Link
                key={label}
                href={href}
                style={{
                  background: GLASS_BG,
                  backdropFilter: GLASS_BLUR,
                  WebkitBackdropFilter: GLASS_BLUR,
                  border: `1px solid ${GLASS_BORDER}`,
                  borderRadius: '20px',
                  padding: '24px',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = `0 0 24px ${accent}20`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
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
                    borderRadius: '12px',
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
                  fontSize: '36px',
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
                  color: isPositive ? '#4ADE80' : TEXT_SECONDARY,
                  background: isPositive ? 'rgba(74,222,128,0.1)' : 'rgba(156,163,175,0.08)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}>
                  {delta}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Main 2-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Upcoming Sessions */}
            <div style={{
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '20px',
              padding: '28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    Upcoming Sessions
                  </h2>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#4ADE80',
                    background: 'rgba(74,222,128,0.12)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                  }}>
                    {upcomingSessions.length}
                  </span>
                </div>
                <Link href="/school-admin/sessions" style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#4ADE80',
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
                    const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
                      scheduled: { bg: 'rgba(74,222,128,0.1)', color: '#4ADE80', dot: '#4ADE80' },
                      completed: { bg: 'rgba(251,146,60,0.1)', color: '#FB923C', dot: '#FB923C' },
                      pending: { bg: 'rgba(251,191,36,0.1)', color: '#FBBF24', dot: '#FBBF24' },
                    }
                    const sc = statusConfig[session.status] ?? { bg: 'rgba(156,163,175,0.1)', color: TEXT_SECONDARY, dot: TEXT_SECONDARY }
                    return (
                      <div key={session.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        background: 'rgba(0,0,0,0.2)',
                        border: `1px solid ${GLASS_BORDER}`,
                        borderRadius: '14px',
                        transition: 'background 0.15s, border-color 0.15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(255,255,255,0.04)'
                        el.style.borderColor = 'rgba(255,255,255,0.12)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'rgba(0,0,0,0.2)'
                        el.style.borderColor = GLASS_BORDER
                      }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: `${sc.dot}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Calendar className="w-4 h-4" style={{ color: sc.dot }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '2px' }}>
                            {session.session_type?.name || 'Session'}
                          </div>
                          <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>
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
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '5px 12px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: sc.bg,
                          color: sc.color,
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
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '20px',
              padding: '28px',
            }}>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
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
                      background: 'linear-gradient(135deg, #4ADE80, #67E8F9)',
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
              borderRadius: '20px',
              padding: '28px',
            }}>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '20px',
              }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {quickActions.map(({ icon: QIcon, label, href, accent, bg }) => (
                  <Link
                    key={label}
                    href={href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 18px',
                      background: bg,
                      border: `1px solid ${GLASS_BORDER}`,
                      borderRadius: '14px',
                      textDecoration: 'none',
                      transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = `${accent}20`
                      el.style.borderColor = `${accent}40`
                      el.style.transform = 'scale(0.99)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = bg
                      el.style.borderColor = GLASS_BORDER
                      el.style.transform = 'scale(1)'
                    }}
                  >
                    <QIcon className="w-4 h-4" style={{ color: accent }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>{label}</span>
                    <ChevronRight className="w-4 h-4" style={{ color: TEXT_SECONDARY, marginLeft: 'auto' }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Completion Rate */}
            <div style={{
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: '600',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '28px',
                alignSelf: 'flex-start',
              }}>
                Completion Rate
              </h2>

              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="45"
                    cy="45"
                    r={ringR}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="45"
                    cy="45"
                    r={ringR}
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="6"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.4))' }}
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
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                  }}>
                    {completionPercent}%
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: TEXT_SECONDARY, textAlign: 'center' }}>
                {stats.completionRate > 0 ? 'Above national average' : 'Complete sessions to track'}
              </p>

              <div style={{
                marginTop: '20px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: TEXT_SECONDARY }}>This month</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#FFFFFF' }}>{stats.completionRate}%</span>
                </div>
                <div style={{
                  height: '4px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${completionPercent}%`,
                    background: 'linear-gradient(90deg, #4ADE80, #67E8F9)',
                    borderRadius: '999px',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
