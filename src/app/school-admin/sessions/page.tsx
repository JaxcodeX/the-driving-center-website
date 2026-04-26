'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Calendar, Clock, Users, Pencil, Play, Pause } from 'lucide-react'
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
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

function AddSessionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: any) => void }) {
  const [form, setForm] = useState({ student_id: '', instructor_id: '', session_type_id: '', starts_at: '', duration_minutes: 60 })
  const [students, setStudents] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([])
  const [sessionTypes, setSessionTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data: school } = await supabase.from('schools').select('id').eq('owner_id', user!.id).single()
      if (!school) return

      const [s, i, st] = await Promise.all([
        supabase.from('students').select('id, name').eq('school_id', school.id).eq('status', 'active'),
        supabase.from('instructors').select('id, name').eq('school_id', school.id).eq('status', 'active'),
        supabase.from('session_types').select('id, name, duration_minutes').eq('school_id', school.id).eq('active', true),
      ])
      setStudents(s.data || [])
      setInstructors(i.data || [])
      setSessionTypes(st.data || [])
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: school } = await supabase.from('schools').select('id').eq('owner_id', user!.id).single()
    const { data, error } = await supabase
      .from('sessions')
      .insert({ ...form, school_id: school!.id, status: 'pending' })
      .select('*, students(name), instructors(name), session_types(name)')
      .single()
    if (!error && data) { onAdd(data); onClose() }
    setLoading(false)
  }

  const inputStyle = { background: T.elevated, border: `1px solid ${T.borderLt}`, color: T.text, outline: 'none' as const }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <h2 className="text-lg font-semibold mb-6" style={{ color: T.text }}>Schedule Session</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Student</label>
            <select value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} required
              className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}>
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Instructor</label>
            <select value={form.instructor_id} onChange={e => setForm(f => ({ ...f, instructor_id: e.target.value }))} required
              className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}>
              <option value="">Select instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Session Type</label>
            <select value={form.session_type_id} onChange={e => setForm(f => ({ ...f, session_type_id: e.target.value }))} required
              className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}>
              <option value="">Select type</option>
              {sessionTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Date & Time</label>
            <input type="datetime-local" value={form.starts_at} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value }))} required
              className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
              onBlur={e => (e.target.style.borderColor = T.borderLt)} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: T.elevated, color: T.secondary, border: `1px solid ${T.border}` }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: T.grad }}>
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: school } = await supabase.from('schools').select('id').eq('owner_id', user.id).single()
      if (!school) { setLoading(false); return }

      const { data } = await supabase
        .from('sessions')
        .select('*, students(name), instructors(name), session_types(name)')
        .eq('school_id', school.id)
        .order('starts_at', { ascending: true })
      setSessions(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleStatusToggle(id: string, currentStatus: string) {
    const supabase = createClient()
    const newStatus = currentStatus === 'confirmed' ? 'canceled' : 'confirmed'
    await supabase.from('sessions').update({ status: newStatus }).eq('id', id)
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: T.text }}>Sessions</h1>
          <p className="text-sm" style={{ color: T.muted }}>{sessions.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
          style={{ background: T.grad }}>
          <Plus className="w-4 h-4" /> New Session
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16"><p className="text-sm" style={{ color: T.muted }}>Loading...</p></div>
      ) : !sessions.length ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: T.muted }} />
          <p className="text-sm mb-3" style={{ color: T.muted }}>No sessions yet</p>
          <button onClick={() => setShowModal(true)} className="text-sm font-medium" style={{ color: T.cyan }}>
            Schedule your first session →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => {
            const date = new Date(session.starts_at)
            const isPast = date < new Date()
            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-2xl transition-all"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
              >
                <div className="flex items-center gap-4">
                  {/* Date block */}
                  <div className="text-center w-12 flex-shrink-0">
                    <div className="text-xs font-semibold" style={{ color: T.cyan }}>{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div className="text-2xl font-bold" style={{ color: T.text }}>{date.getDate()}</div>
                    <div className="text-xs" style={{ color: T.muted }}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  </div>
                  <div className="w-px h-10 rounded" style={{ background: T.border }} />
                  <div>
                    <div className="text-sm font-medium mb-0.5" style={{ color: T.text }}>
                      {session.student?.name || 'Student'} · {session.instructor?.name || 'Instructor'}
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: T.muted }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      <span>{session.session_type?.name || 'Session'}</span>
                      <span>{session.duration_minutes || 60} min</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                    style={{
                      background: session.status === 'confirmed' ? `${T.green}15` : session.status === 'canceled' ? '#ef444415' : `${T.amber}15`,
                      color: session.status === 'confirmed' ? T.green : session.status === 'canceled' ? '#ef4444' : T.amber,
                    }}>
                    {session.status}
                  </span>
                  <button
                    onClick={() => handleStatusToggle(session.id, session.status)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: T.muted }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.elevated)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {session.status === 'confirmed' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && <AddSessionModal onClose={() => setShowModal(false)} onAdd={s => setSessions(prev => [s, ...prev])} />}
    </div>
  )
}