'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8am-7pm

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let schoolId: string | null = null

      // Try demo_user cookie first (DEMO_MODE)
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const payload = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1])))
          schoolId = payload.schoolId
        } catch {}
      }

      // Fall back to Supabase auth
      if (!schoolId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = '/login'; return }
        const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
        if (!school) { setLoading(false); return }
        schoolId = school.id
      }

      const { data } = await supabase
        .from('sessions')
        .select('id, start_date, end_date, max_seats, instructor_id, session_type_id, status, location')
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

  // Calendar grid
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function getSessionsForDay(day: number) {
    return sessions.filter(s => {
      const d = new Date(s.starts_at)
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
    })
  }

  const today = new Date()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Calendar</h1>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl transition-colors" style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: `1px solid var(--card-border)` }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 py-1.5 rounded-xl" style={{ color: 'var(--text-primary)' }}>{monthName}</span>
          <button onClick={nextMonth} className="p-2 rounded-xl transition-colors" style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: `1px solid var(--card-border)` }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid var(--card-border)` }}>
        {/* Day headers */}
        <div className="grid grid-cols-7" style={{ background: 'var(--bg-surface)', borderBottom: `1px solid var(--card-border)` }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {d}
            </div>
          ))}
        </div>
        {/* Days */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const daySessions = day ? getSessionsForDay(day) : []
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            return (
              <div
                key={idx}
                className="min-h-24 p-2 border-b border-r"
                style={{
                  background: day ? 'transparent' : 'transparent',
                  borderColor: 'var(--card-border)',
                  opacity: day ? 1 : 0.3,
                }}
              >
                {day && (
                  <>
                    <div
                      className="text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                      style={{
                        color: isToday ? 'var(--bg-base)' : 'var(--text-secondary)',
                        background: isToday ? '#38BDF8' : 'transparent',
                      }}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {daySessions.slice(0, 3).map(s => {
                        const time = new Date(s.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                        return (
                          <div
                            key={s.id}
                            className="text-xs px-1.5 py-0.5 rounded truncate"
                            style={{ background: `rgba(56,189,248,0.2)`, color: '#38BDF8' }}
                            title={`${s.student?.name || 'Student'} · ${time}`}
                          >
                            {time} {s.student?.name?.split(' ')[0] || ''}
                          </div>
                        )
                      })}
                      {daySessions.length > 3 && (
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>+{daySessions.length - 3} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sessions list for selected month */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>{monthName} Sessions</h2>
        {sessions.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No sessions this month</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--bg-surface)', border: `1px solid var(--card-border)` }}>
                <div className="text-sm font-bold w-16 text-center" style={{ color: '#38BDF8' }}>
                  {new Date(s.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.student?.name || 'Student'}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(s.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {s.instructor?.name || 'Instructor'}
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                  style={{ background: `rgba(74,222,128,0.15)`, color: 'var(--success)' }}>
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
