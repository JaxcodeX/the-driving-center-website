'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Session = {
  id: string
  start_date: string
  start_time: string
  end_time: string
  max_seats: number
  seats_booked: number
  price_cents: number
  location: string
  instructor_id: string | null
  instructor?: { name: string }
  cancelled: boolean
}

type Instructor = {
  id: string
  name: string
}

type Popover = {
  type: 'create' | 'edit'
  date: string
  time?: string
  session?: Session
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7) // 7am–7pm
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates(offset: number = 0): string[] {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - now.getDay() + 1 + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

function formatDateShort(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const INSTRUCTOR_COLORS = [
  'bg-cyan-600',
  'bg-blue-600',
  'bg-purple-600',
  'bg-emerald-600',
  'bg-orange-600',
]

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#0a0a0f' }} />}>
      <CalendarContent />
    </Suspense>
  )
}

function CalendarContent() {
  const params = useSearchParams()
  const schoolId = params.get('school_id')
  const [sessions, setSessions] = useState<Session[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [weekOffset, setWeekOffset] = useState(0)
  const [popover, setPopover] = useState<Popover | null>(null)
  const [form, setForm] = useState({
    start_date: '', start_time: '', end_time: '',
    instructor_id: '', max_seats: '10', price_cents: '5000', location: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const weekDates = getWeekDates(weekOffset)

  async function loadData() {
    if (!schoolId) return
    const [sessionsRes, instructorsRes] = await Promise.all([
      fetch(`/api/sessions?school_id=${schoolId}`),
      fetch(`/api/instructors?school_id=${schoolId}`),
    ])
    const [sessionsData, instructorsData] = await Promise.all([sessionsRes.json(), instructorsRes.json()])
    setSessions(sessionsData)
    setInstructors(instructorsData)
  }

  useEffect(() => { loadData() }, [schoolId])

  function getSessionsForDay(date: string) {
    return sessions.filter(s => s.start_date === date && !s.cancelled)
  }

  function handleCellClick(date: string, hour: number) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`
    setForm({ ...form, start_date: date, start_time: timeStr, end_time: `${(hour + 1).toString().padStart(2, '0')}:00` })
    setPopover({ type: 'create', date, time: timeStr })
    setError('')
  }

  function handleSessionClick(session: Session) {
    setForm({
      start_date: session.start_date,
      start_time: session.start_time,
      end_time: session.end_time,
      instructor_id: session.instructor_id ?? '',
      max_seats: String(session.max_seats),
      price_cents: String(session.price_cents),
      location: session.location,
    })
    setPopover({ type: 'edit', date: session.start_date, session })
    setError('')
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      start_date: form.start_date,
      start_time: form.start_time,
      end_time: form.end_time,
      instructor_id: form.instructor_id || null,
      max_seats: parseInt(form.max_seats),
      price_cents: parseInt(form.price_cents),
      location: form.location,
    }

    const res = popover?.type === 'create'
      ? await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId! },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/sessions/${popover!.session!.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId! },
          body: JSON.stringify(payload),
        })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Failed')
    } else {
      setPopover(null)
      loadData()
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!popover?.session) return
    setDeleting(true)
    await fetch(`/api/sessions/${popover.session.id}`, {
      method: 'DELETE',
      headers: { 'x-school-id': schoolId! },
    })
    setPopover(null)
    loadData()
    setDeleting(false)
  }

  function getInstructorColor(id: string | null): string {
    if (!id) return 'bg-slate-600'
    const idx = instructors.findIndex(i => i.id === id)
    return INSTRUCTOR_COLORS[idx % INSTRUCTOR_COLORS.length]
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Header */}
      <div className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold text-white">Session Calendar</span>
          </div>
          <Link href="/school-admin" className="text-sm text-gray-400 hover:text-white">← Back</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Week nav */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWeekOffset(w => w - 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-sm"
            >
              ← Prev
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Today
            </button>
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-sm"
            >
              Next →
            </button>
          </div>
          <div className="text-sm text-gray-400">
            {new Date(`${weekDates[0]}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            {' — '}
            {new Date(`${weekDates[6]}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="glass rounded-xl overflow-hidden border border-white/[0.06]">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b border-white/[0.06]">
            <div className="p-2 text-xs text-gray-600" />
            {DAYS.map((day, i) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-gray-400 border-l border-white/[0.04]">
                <div>{day}</div>
                <div className="text-white text-sm mt-0.5">{new Date(`${weekDates[i]}T12:00:00`).getDate()}</div>
              </div>
            ))}
          </div>

          {/* Time rows */}
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-white/[0.04] min-h-[60px]">
              <div className="p-2 text-xs text-gray-600 text-right pr-3 pt-1">
                {hour > 12 ? `${hour - 12}pm` : hour === 12 ? '12pm' : `${hour}am`}
              </div>
              {weekDates.map(date => {
                const daySessions = getSessionsForDay(date).filter(s => {
                  const startHour = parseInt(s.start_time.split(':')[0])
                  return startHour === hour
                })
                return (
                  <div
                    key={date}
                    onClick={() => handleCellClick(date, hour)}
                    className="border-l border-white/[0.04] p-0.5 cursor-pointer hover:bg-white/[0.04] transition-colors relative"
                  >
                    {daySessions.map(session => (
                      <div
                        key={session.id}
                        onClick={(e) => { e.stopPropagation(); handleSessionClick(session) }}
                        className={`${getInstructorColor(session.instructor_id)} rounded px-1.5 py-0.5 mb-0.5 text-white text-xs cursor-pointer hover:opacity-80`}
                      >
                        <div className="font-medium truncate">{session.start_time}</div>
                        <div className="opacity-80 truncate">
                          {session.instructor?.name ?? 'No instructor'} · {session.seats_booked}/{session.max_seats}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        {instructors.length > 0 && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {instructors.map((inst, i) => (
              <div key={inst.id} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${INSTRUCTOR_COLORS[i % INSTRUCTOR_COLORS.length]}`} />
                <span className="text-xs text-gray-500">{inst.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popover */}
      {popover && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-xl w-full max-w-md border border-white/[0.08]" style={{ background: '#13131a' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">
                {popover.type === 'create' ? 'New Session' : 'Edit Session'}
              </h2>
              <button onClick={() => setPopover(null)} className="text-gray-500 hover:text-white text-lg">×</button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Date</label>
                  <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Oak Ridge, TN" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Start Time</label>
                  <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">End Time</label>
                  <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Instructor</label>
                  <select value={form.instructor_id} onChange={e => setForm({ ...form, instructor_id: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500">
                    <option value="">No instructor</option>
                    {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Max Seats</label>
                  <input type="number" value={form.max_seats} onChange={e => setForm({ ...form, max_seats: e.target.value })} min="1" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Price (cents)</label>
                  <input type="number" value={form.price_cents} onChange={e => setForm({ ...form, price_cents: e.target.value })} min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 text-sm disabled:opacity-50">
                  {saving ? 'Saving...' : popover.type === 'create' ? 'Create Session' : 'Save Changes'}
                </button>
                {popover.type === 'edit' && (
                  <button type="button" onClick={handleDelete} disabled={deleting} className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 text-sm disabled:opacity-50">
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}