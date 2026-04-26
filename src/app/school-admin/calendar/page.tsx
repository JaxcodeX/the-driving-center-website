'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
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
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8am-7pm

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: school } = await supabase.from('schools').select('id').eq('owner_id', user.id).single()
      if (!school) return

      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59)

      const { data } = await supabase
        .from('sessions')
        .select('*, students(name), instructors(name)')
        .eq('school_id', school.id)
        .gte('starts_at', start.toISOString())
        .lte('starts_at', end.toISOString())
        .order('starts_at', { ascending: true })

      setSessions(data || [])
    }
    load()
  }, [currentDate])

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
        <h1 className="text-2xl font-bold" style={{ color: T.text }}>Calendar</h1>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl transition-colors" style={{ color: T.secondary, background: T.surface, border: `1px solid ${T.border}` }}
            onMouseEnter={e => (e.currentTarget.style.color = T.text)}
            onMouseLeave={e => (e.currentTarget.style.color = T.secondary)}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 py-1.5 rounded-xl" style={{ color: T.text }}>{monthName}</span>
          <button onClick={nextMonth} className="p-2 rounded-xl transition-colors" style={{ color: T.secondary, background: T.surface, border: `1px solid ${T.border}` }}
            onMouseEnter={e => (e.currentTarget.style.color = T.text)}
            onMouseLeave={e => (e.currentTarget.style.color = T.secondary)}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
        {/* Day headers */}
        <div className="grid grid-cols-7" style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wide" style={{ color: T.muted }}>
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
                  borderColor: T.border,
                  opacity: day ? 1 : 0.3,
                }}
              >
                {day && (
                  <>
                    <div
                      className="text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                      style={{
                        color: isToday ? '#050505' : T.secondary,
                        background: isToday ? T.cyan : 'transparent',
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
                            style={{ background: `${T.cyan}20`, color: T.cyan }}
                            title={`${s.student?.name || 'Student'} · ${time}`}
                          >
                            {time} {s.student?.name?.split(' ')[0] || ''}
                          </div>
                        )
                      })}
                      {daySessions.length > 3 && (
                        <div className="text-xs" style={{ color: T.muted }}>+{daySessions.length - 3} more</div>
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
        <h2 className="text-sm font-semibold mb-3" style={{ color: T.muted }}>{monthName} Sessions</h2>
        {sessions.length === 0 ? (
          <div className="text-center py-8" style={{ color: T.muted }}>
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No sessions this month</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map(s => (
              <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="text-sm font-bold w-16 text-center" style={{ color: T.cyan }}>
                  {new Date(s.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: T.text }}>{s.student?.name || 'Student'}</div>
                  <div className="text-xs" style={{ color: T.muted }}>
                    {new Date(s.starts_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {s.instructor?.name || 'Instructor'}
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                  style={{ background: `${T.green}15`, color: T.green }}>
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