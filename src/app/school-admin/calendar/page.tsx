'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let schoolId: string | null = null

      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const payload = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1])))
          schoolId = payload.schoolId
        } catch {}
      }

      if (!schoolId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = '/login'; return }
        const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
        if (!school) { setLoading(false); return }
        schoolId = school.id
      }

      const { data } = await supabase
        .from('sessions')
        .select('id, start_date, end_date, max_seats, instructor_id, session_type_id, status, location, instructor:instructors(name), session_type:session_types(name)')
        .eq('school_id', schoolId)
      setSessions((data as any[]) || [])
      setLoading(false)
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
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '28px',
          fontWeight: '700',
          color: '#FFFFFF',
        }}>
          Calendar
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={prevMonth}
            style={{
              padding: '8px',
              background: '#0F1117',
              border: '1px solid #1A1A1A',
              borderRadius: '8px',
              color: '#9CA3AF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0F1117')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            padding: '6px 12px',
            borderRadius: '8px',
            color: '#FFFFFF',
            background: '#0F1117',
            border: '1px solid #1A1A1A',
          }}>
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            style={{
              padding: '8px',
              background: '#0F1117',
              border: '1px solid #1A1A1A',
              borderRadius: '8px',
              color: '#9CA3AF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0F1117')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#0F1117',
        border: '1px solid #1A1A1A',
        marginBottom: '24px',
      }}>
        {/* Day headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          background: '#0A0A0B',
          borderBottom: '1px solid #1A1A1A',
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{
              padding: '12px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#6B7280',
            }}>
              {d}
            </div>
          ))}
        </div>
        {/* Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {cells.map((day, idx) => {
            const daySessions = day ? getSessionsForDay(day) : []
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            return (
              <div
                key={idx}
                style={{
                  minHeight: '96px',
                  padding: '8px',
                  borderBottom: '1px solid #1A1A1A',
                  borderRight: (idx + 1) % 7 !== 0 ? '1px solid #1A1A1A' : 'none',
                  opacity: day ? 1 : 0.3,
                }}
              >
                {day && (
                  <>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '4px',
                      background: isToday ? '#4ADE80' : 'transparent',
                      color: isToday ? '#000' : '#9CA3AF',
                    }}>
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {daySessions.slice(0, 3).map(s => {
                        const time = new Date(s.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                        return (
                          <div
                            key={s.id}
                            style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              background: 'rgba(74,222,128,0.15)',
                              color: '#4ADE80',
                            }}
                            title={time}
                          >
                            {time}
                          </div>
                        )
                      })}
                      {daySessions.length > 3 && (
                        <div style={{ fontSize: '10px', color: '#6B7280' }}>
                          +{daySessions.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sessions list for month */}
      <div>
        <h2 style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#6B7280',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {monthName} Sessions
        </h2>
        {!loading && sessions.length === 0 ? (
          <div style={{
            background: '#0F1117',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            textAlign: 'center',
            padding: '32px',
          }}>
            <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: '#6B7280', opacity: 0.3 }} />
            <p style={{ fontSize: '14px', color: '#6B7280' }}>No sessions this month</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.map(s => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  background: '#0F1117',
                  border: '1px solid #1A1A1A',
                  borderRadius: '12px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0F1117')}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  width: '64px',
                  textAlign: 'center',
                  color: '#4ADE80',
                  flexShrink: 0,
                }}>
                  {new Date(s.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#FFFFFF' }}>
                    {s.session_type?.name || 'Session'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {new Date(s.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {s.instructor?.name || 'Instructor'}
                  </div>
                </div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: 'rgba(74,222,128,0.15)',
                  color: '#4ADE80',
                }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
