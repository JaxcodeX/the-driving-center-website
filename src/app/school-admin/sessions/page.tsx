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
  if (status === 'completed') return 'completed'
  if (status === 'canceled') return 'pending'
  return 'active'
}

function borderColor(status: string): string {
  if (status === 'completed') return '#4ADE80'
  if (status === 'canceled') return '#F97316'
  return '#78E4FF'
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
        try {
          const res = await fetch('/api/demo/sessions')
          if (res.ok) {
            const data = await res.json()
            setInstructors(data.instructors || [])
            setSessionTypes(data.sessionTypes || [])
            return
          }
        } catch { /* fall through */ }
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
      if (!school) return
      const schoolId = school.id

      const [i, st] = await Promise.all([
        supabase.from('instructors').select('id, name').eq('school_id', schoolId).eq('active', true),
        supabase.from('session_types').select('id, name, duration_minutes').eq('school_id', schoolId).eq('active', true),
      ])
      setInstructors(i.data || [])
      setSessionTypes(st.data || [])
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

  const inputStyle: React.CSSProperties = {
    background: '#0D0D0D',
    border: '1px solid #1A1A1A',
    color: '#FFFFFF',
    outline: 'none',
    borderRadius: '12px',
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'rgba(0,0,0,0.7)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#0F1117',
        border: '1px solid #1A1A1A',
        borderRadius: '16px',
        padding: '32px',
      }}>
        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '18px',
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: '24px',
        }}>
          Schedule Session
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              marginBottom: '6px',
            }}>
              Date
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              required
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              marginBottom: '6px',
            }}>
              Instructor
            </label>
            <select
              value={form.instructor_id}
              onChange={e => setForm(f => ({ ...f, instructor_id: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">Select instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              marginBottom: '6px',
            }}>
              Session Type
            </label>
            <select
              value={form.session_type_id}
              onChange={e => setForm(f => ({ ...f, session_type_id: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">Select type</option>
              {sessionTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              marginBottom: '6px',
            }}>
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="e.g. 123 Main St"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              marginBottom: '6px',
            }}>
              Max Seats
            </label>
            <input
              type="number"
              value={form.max_seats}
              onChange={e => setForm(f => ({ ...f, max_seats: parseInt(e.target.value) || 10 }))}
              min="1" max="100"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'transparent',
                border: '1px solid #1A1A1A',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: '#4ADE80',
                border: 'none',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '14px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Scheduling...' : 'Schedule Session →'}
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
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '28px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '4px',
          }}>
            Sessions
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            {sessions.length} total
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#4ADE80',
            border: 'none',
            borderRadius: '12px',
            color: '#000000',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
          }}
        >
          <Plus className="w-4 h-4" />
          New Session
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        {filterTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            style={
              activeFilter === key
                ? {
                    padding: '8px 16px',
                    background: 'rgba(74,222,128,0.15)',
                    color: '#4ADE80',
                    border: '1px solid #4ADE80',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }
                : {
                    padding: '8px 16px',
                    background: '#0F1117',
                    color: '#9CA3AF',
                    border: '1px solid #1A1A1A',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                  }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sessions Table */}
      {loading ? (
        <div style={{
          background: '#0F1117',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          textAlign: 'center',
          padding: '64px',
          color: '#6B7280',
        }}>
          <p style={{ fontSize: '14px' }}>Loading sessions...</p>
        </div>
      ) : !filteredSessions.length ? (
        <div style={{
          background: '#0F1117',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          textAlign: 'center',
          padding: '64px',
        }}>
          <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: '#6B7280', opacity: 0.3 }} />
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>
            {activeFilter === 'all' ? 'No sessions yet' : `No ${activeFilter} sessions`}
          </p>
          {activeFilter === 'all' && (
            <button onClick={() => setShowModal(true)} style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4ADE80',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}>
              Schedule your first session →
            </button>
          )}
        </div>
      ) : (
        <div style={{
          background: '#0F1117',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 120px 100px 80px',
              gap: '16px',
              padding: '12px 24px',
              borderBottom: '1px solid #1A1A1A',
            }}
          >
            {['Date', 'Session', 'Details', 'Status', ''].map((h, i) => (
              <div key={i} style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#9CA3AF',
              }}>
                {h}
              </div>
            ))}
          </div>

          {/* Session rows */}
          <div>
            {filteredSessions.map(session => {
              const date = new Date(session.start_date + 'T12:00:00')
              const pillClass = statusPillClass(session.status)
              const leftColor = borderColor(session.status)

              return (
                <div
                  key={session.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 120px 100px 80px',
                    gap: '16px',
                    padding: '16px 24px',
                    alignItems: 'center',
                    borderLeft: `3px solid ${leftColor}`,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  {/* Date */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      color: leftColor,
                    }}>
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                    }}>
                      {date.getDate()}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>

                  {/* Session info */}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '2px' }}>
                      {session.session_type?.name || 'Session'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6B7280' }}>
                      {session.instructor?.name && <span>{session.instructor.name}</span>}
                      {session.location && (
                        <>
                          <span>·</span>
                          <span>{session.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9CA3AF' }}>
                      <Clock className="w-3 h-3" style={{ color: '#6B7280' }} />
                      {session.session_type?.duration_minutes || 60} min
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9CA3AF' }}>
                      <Users className="w-3 h-3" style={{ color: '#6B7280' }} />
                      {session.seats_booked}/{session.max_seats} seats
                    </div>
                  </div>

                  {/* Status pill */}
                  <div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: session.status === 'scheduled' ? 'rgba(74,222,128,0.15)' : session.status === 'completed' ? 'rgba(96,165,250,0.15)' : 'rgba(249,115,22,0.15)',
                      color: session.status === 'scheduled' ? '#4ADE80' : session.status === 'completed' ? '#60A5FA' : '#F97316',
                    }}>
                      {session.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => handleStatusToggle(session.id, session.status)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9CA3AF',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
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
