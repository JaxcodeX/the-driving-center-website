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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Calendar</h1>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn-ghost p-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 py-1.5 rounded-xl" style={{ color: 'var(--text-primary)' }}>{monthName}</span>
          <button onClick={nextMonth} className="btn-ghost p-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {/* Day headers */}
        <div className="grid grid-cols-7" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
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
                  borderColor: 'var(--border)',
                  opacity: day ? 1 : 0.3,
                }}
              >
                {day && (
                  <>
                    <div
                      className="text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                      style={{
                        color: isToday ? '#fff' : 'var(--text-secondary)',
                        background: isToday ? 'var(--accent)' : 'transparent',
                      }}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {daySessions.slice(0, 3).map(s => {
                        const time = new Date(s.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                        return (
                          <div
                            key={s.id}
                            className="text-xs px-1.5 py-0.5 rounded truncate"
                            style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                            title={time}
                          >
                            {time}
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

      {/* Sessions list for month */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>{monthName} Sessions</h2>
        {sessions.length === 0 ? (
          <div className="glass-card text-center py-8">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No sessions this month</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s.id} className="glass-card flex items-center gap-4 p-3">
                <div className="text-sm font-bold w-16 text-center" style={{ color: 'var(--accent)' }}>
                  {new Date(s.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.session_type?.name || 'Session'}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(s.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {s.instructor?.name || 'Instructor'}
                  </div>
                </div>
                <span className="status-pill status-active">{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}