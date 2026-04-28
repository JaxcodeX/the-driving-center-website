'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, Users, Pencil, Play, Pause } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Session = {
  id: string
  start_date: string
  end_date: string
  max_seats: number
  seats_booked: number
  instructor_id: string | null
  session_type_id: string | null
  status: 'scheduled' | 'canceled' | 'completed'
  location: string | null
  instructor: { id: string; name: string } | null
  session_type: { id: string; name: string; duration_minutes: number; color: string } | null
}

type FilterTab = 'all' | 'scheduled' | 'completed' | 'canceled'

function statusPillClass(status: string): string {
  if (status === 'completed') return 'status-completed'
  if (status === 'canceled') return 'status-pending'
  return 'status-active'
}

function borderColor(status: string): string {
  if (status === 'completed') return 'var(--success)'
  if (status === 'canceled') return '#F97316'
  return 'var(--accent)'
}

function AddSessionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Session) => void }) {
  const [form, setForm] = useState({
    start_date: '', instructor_id: '', session_type_id: '', location: '', max_seats: 10,
  })
  const [instructors, setInstructors] = useState<any[]>([])
  const [sessionTypes, setSessionTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))

      if (demoCookie) {
        // Demo mode: use server-side endpoint
        try {
          const res = await fetch('/api/demo/sessions')
          if (res.ok) {
            const data = await res.json()
            setInstructors(data.instructors || [])
            setSessionTypes(data.sessionTypes || [])
            setLoading(false)
            return
          }
        } catch { /* fall through */ }
        setLoading(false)
        return
      }

      // Normal mode
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
      if (!school) { setLoading(false); return }
      const schoolId = school.id

      const [i, st] = await Promise.all([
        supabase.from('instructors').select('id, name').eq('school_id', schoolId).eq('active', true),
        supabase.from('session_types').select('id, name, duration_minutes').eq('school_id', schoolId).eq('active', true),
      ])
      setInstructors(i.data || [])
      setSessionTypes(st.data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    let schoolId: string | null = null
    const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
    if (demoCookie) {
      try {
        const payload = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1])))
        schoolId = payload.schoolId
      } catch {}
    }
    if (!schoolId) {
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user!.id).single()
      if (!school) { setLoading(false); return }
      schoolId = school.id
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        school_id: schoolId,
        start_date: form.start_date,
        end_date: form.start_date,
        instructor_id: form.instructor_id || null,
        session_type_id: form.session_type_id || null,
        location: form.location || '',
        max_seats: Math.max(1, parseInt(String(form.max_seats)) || 10),
        seats_booked: 0,
        status: 'scheduled',
      })
      .select()
      .single()

    if (!error && data) { onAdd(data as Session); onClose() }
    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--bg-elevated)',
    border: `1px solid rgba(255,255,255,0.08)`,
    color: 'var(--text-primary)',
    outline: 'none' as const,
    borderRadius: '12px',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: 'var(--bg-surface)', border: `1px solid rgba(255,255,255,0.08)` }}>
        <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Schedule Session</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              required
              className="w-full px-4 py-3 text-sm"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = `rgba(56,189,248,0.6)`)}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Instructor</label>
            <select
              value={form.instructor_id}
              onChange={e => setForm(f => ({ ...f, instructor_id: e.target.value }))}
              className="w-full px-4 py-3 text-sm"
              style={inputStyle}
            >
              <option value="">Select instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Session Type</label>
            <select
              value={form.session_type_id}
              onChange={e => setForm(f => ({ ...f, session_type_id: e.target.value }))}
              className="w-full px-4 py-3 text-sm"
              style={inputStyle}
            >
              <option value="">Select type</option>
              {sessionTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="e.g. 123 Main St"
              className="w-full px-4 py-3 text-sm"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = `rgba(56,189,248,0.6)`)}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Max Seats</label>
            <input
              type="number"
              value={form.max_seats}
              onChange={e => setForm(f => ({ ...f, max_seats: parseInt(e.target.value) || 10 }))}
              min="1" max="100"
              className="w-full px-4 py-3 text-sm"
              style={inputStyle}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: `1px solid rgba(255,255,255,0.08)` }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #38BDF8, #818CF8)' }}>
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))

      if (demoCookie) {
        // Demo mode: use server-side endpoint (service role)
        try {
          const res = await fetch('/api/demo/sessions')
          if (res.ok) {
            const data = await res.json()
            setSessions(data.sessions || [])
            setLoading(false)
            return
          }
        } catch { /* fall through */ }
        setSessions([])
        setLoading(false)
        return
      }

      // Normal mode: use Supabase auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
      if (!school) { setLoading(false); return }
      const schoolId = school.id

      const { data } = await supabase
        .from('sessions')
        .select('*, instructor:instructors(id, name), session_type:session_types(id, name, duration_minutes, color)')
        .eq('school_id', schoolId)
        .order('start_date', { ascending: true })
      setSessions((data as Session[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleStatusToggle(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'scheduled' ? 'canceled' : 'scheduled'
    await supabase.from('sessions').update({ status: newStatus }).eq('id', id)
    setSessions(prev =>
      prev.map(s => s.id === id ? { ...s, status: newStatus as Session['status'] } : s)
    )
  }

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'scheduled', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'canceled', label: 'Cancelled' },
  ]

  const filteredSessions = activeFilter === 'all'
    ? sessions
    : sessions.filter(s => s.status === activeFilter)

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Sessions</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{sessions.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #38BDF8, #818CF8)', boxShadow: '0 0 20px rgba(56,189,248,0.2)' }}
        >
          <Plus className="w-4 h-4" />
          New Session
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {filterTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className="text-sm font-semibold px-4 py-2 rounded-full transition-all"
            style={
              activeFilter === key
                ? {
                    background: 'rgba(26,86,255,0.15)',
                    color: '#60A5FA',
                  }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    color: 'var(--text-muted)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Calendar / Session List */}
      {loading ? (
        <div className="glass-card text-center py-16">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading sessions...</p>
        </div>
      ) : !filteredSessions.length ? (
        <div className="glass-card text-center py-16">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            {activeFilter === 'all' ? 'No sessions yet' : `No ${activeFilter} sessions`}
          </p>
          {activeFilter === 'all' && (
            <button onClick={() => setShowModal(true)} className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              Schedule your first session →
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Calendar header row */}
          <div
            className="grid px-6 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{
              gridTemplateColumns: '80px 1fr 120px 100px 80px',
              gap: '16px',
              color: 'var(--text-muted)',
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
            }}
          >
            <div>Date</div>
            <div>Session</div>
            <div>Details</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Session rows */}
          <div className="divide-y" style={{ borderTop: 'none' }}>
            {filteredSessions.map(session => {
              const date = new Date(session.start_date + 'T12:00:00')
              const pillClass = statusPillClass(session.status)
              const leftColor = borderColor(session.status)

              return (
                <div
                  key={session.id}
                  className="grid px-6 py-4 items-center text-sm transition-colors"
                  style={{
                    gridTemplateColumns: '80px 1fr 120px 100px 80px',
                    gap: '16px',
                    borderLeft: `3px solid ${leftColor}`,
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  {/* Date */}
                  <div className="text-center flex-shrink-0">
                    <div className="text-xs font-semibold uppercase" style={{ color: leftColor }}>
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{date.getDate()}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>

                  {/* Session info */}
                  <div>
                    <div className="font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
                      {session.session_type?.name || 'Session'}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {session.instructor?.name && (
                        <span>{session.instructor.name}</span>
                      )}
                      {session.location && (
                        <>
                          <span>·</span>
                          <span>{session.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      {session.session_type?.duration_minutes || 60} min
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Users className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      {session.seats_booked}/{session.max_seats} seats
                    </div>
                  </div>

                  {/* Status pill */}
                  <div>
                    <span className={`status-pill ${pillClass}`}>{session.status}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleStatusToggle(session.id, session.status)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                      title={session.status === 'scheduled' ? 'Cancel session' : 'Reactivate session'}
                    >
                      {session.status === 'scheduled'
                        ? <Pause className="w-4 h-4" />
                        : <Play className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showModal && (
        <AddSessionModal onClose={() => setShowModal(false)} onAdd={s => setSessions(prev => [s, ...prev])} />
      )}
    </div>
  )
}
