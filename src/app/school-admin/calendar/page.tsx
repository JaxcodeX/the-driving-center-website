'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// NAV_ITEMS removed — layout provides the sidebar

const BG = 'var(--admin-bg)'
const BG_GRADIENT = 'var(--mesh-subtle)'
const GLASS_BG = 'var(--glass-bg)'
const GLASS_BORDER = 'var(--glass-border)'
const GLASS_BLUR = 'var(--glass-blur)'
const TEXT_SECONDARY = 'var(--admin-text-secondary)'
const ACCENT_GREEN = 'var(--admin-accent)'
const CARD_SHADOW = 'var(--glass-shadow)'
const CARD_SHADOW_HOVER = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--admin-accent), inset 0 1px 0 rgba(255,255,255,0.08)'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const res = await fetch('/api/demo/sessions')
          if (res.ok) { setSessions((await res.json()).sessions || []); setLoading(false); return }
        } catch {}
        setSessions([]); setLoading(false); return
      }
      // Non-demo: resolve school_id, use API
      const supabase = (await import('@/lib/supabase/client')).createClient()
      let schoolId: string | null = null
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: school } = await supabase.from('schools').select('id').eq('owner_email', user.email).single()
      if (!school) { setLoading(false); return }
      schoolId = school.id
      if (!schoolId) { setSessions([]); setLoading(false); return }
      try {
        const res = await fetch('/api/sessions?school_id=' + encodeURIComponent(schoolId), {
          headers: { 'x-school-id': schoolId },
        })
        if (res.ok) { setSessions(await res.json()); setLoading(false); return }
      } catch {}
      setSessions([]); setLoading(false)
    }
    load()
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  function prevMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function nextMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function getSessionsForDay(day: number) {
    return sessions.filter(s => {
      const d = new Date(s.start_date)
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
    })
  }

  const today = new Date()

  return (
    <>





      <div className="admin-main">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: '700', color: '#FFFFFF' }}>Calendar</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={prevMonth} style={{ padding: '8px', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '8px', color: TEXT_SECONDARY, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = GLASS_BG)}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span style={{ fontSize: '14px', fontWeight: '600', padding: '6px 12px', borderRadius: '8px', color: '#FFFFFF', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}` }}>{monthName}</span>
            <button onClick={nextMonth} style={{ padding: '8px', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '8px', color: TEXT_SECONDARY, cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = GLASS_BG)}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, boxShadow: CARD_SHADOW, marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'rgba(0,0,0,0.3)', borderBottom: `1px solid ${GLASS_BORDER}` }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: TEXT_SECONDARY }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {cells.map((day, idx) => {
              const daySessions = day ? getSessionsForDay(day) : []
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              return (
                <div key={idx} style={{ minHeight: '96px', padding: '8px', borderBottom: `1px solid ${GLASS_BORDER}`, borderRight: (idx + 1) % 7 !== 0 ? `1px solid ${GLASS_BORDER}` : 'none', opacity: day ? 1 : 0.3 }}>
                  {day && (
                    <>
                      <div style={{ fontSize: '12px', fontWeight: '600', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', background: isToday ? ACCENT_GREEN : 'transparent', color: isToday ? '#000' : TEXT_SECONDARY }}>{day}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {daySessions.slice(0, 3).map(s => {
                          const time = new Date(s.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                          return (
                            <div key={s.id} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: 'rgba(74,222,128,0.15)', color: ACCENT_GREEN }} title={time}>{time}</div>
                          )
                        })}
                        {daySessions.length > 3 && <div style={{ fontSize: '10px', color: TEXT_SECONDARY }}>+{daySessions.length - 3} more</div>}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sessions list */}
        <div>
          <h2 style={{ fontSize: '11px', fontWeight: '600', color: TEXT_SECONDARY, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{monthName} Sessions</h2>
          {!loading && sessions.length === 0 ? (
            <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', textAlign: 'center', padding: '32px', boxShadow: CARD_SHADOW }}>
              <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: TEXT_SECONDARY, opacity: 0.4 }} />
              <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>No sessions this month</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sessions.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '12px', boxShadow: CARD_SHADOW, transition: 'background 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = GLASS_BG)}>
                  <div style={{ fontSize: '13px', fontWeight: '700', width: '64px', textAlign: 'center', color: ACCENT_GREEN, flexShrink: 0 }}>{new Date(s.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#FFFFFF' }}>{s.session_type?.name || 'Session'}</div>
                    <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>{new Date(s.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {s.instructor?.name || 'Instructor'}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: 'rgba(74,222,128,0.15)', color: ACCENT_GREEN }}>{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </>
  )
}