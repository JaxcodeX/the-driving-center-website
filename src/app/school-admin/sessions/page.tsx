'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Module-level helpers
function formatDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function formatPrice(cents: number) {
  return cents ? `$${(cents / 100).toFixed(0)}` : 'Free'
}

type Session = {
  id: string
  start_date: string
  start_time: string
  end_time: string
  max_seats: number
  seats_booked: number
  price_cents: number
  location: string
  cancelled: boolean
  instructor?: { id: string; name: string }
  session_type_id?: string
}

type Instructor = { id: string; name: string }

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState<Session | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Create form state
  const [createForm, setCreateForm] = useState<CreateForm>({
    start_date: '', start_time: '', end_time: '',
    max_seats: '10', price_cents: '5000', location: '',
    instructor_id: '',
  })

  // Duplicate modal state
  const [showDuplicate, setShowDuplicate] = useState(false)
  const [dupWeeks, setDupWeeks] = useState(4)
  const [duping, setDupying] = useState(false)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => { if (data?.school_id) setSchoolId(data.school_id) })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!schoolId) return
    Promise.all([
      fetch(`/api/sessions?school_id=${schoolId}`).then(r => r.json()),
      fetch(`/api/instructors?school_id=${schoolId}`).then(r => r.json()),
    ]).then(([sess, inst]) => {
      setSessions(Array.isArray(sess) ? sess : [])
      setInstructors(Array.isArray(inst) ? inst : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [schoolId])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!schoolId) return
    setSaving(true)
    setError('')
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
      body: JSON.stringify({
        start_date: createForm.start_date,
        start_time: createForm.start_time,
        end_time: createForm.end_time,
        max_seats: parseInt(createForm.max_seats),
        price_cents: parseInt(createForm.price_cents),
        location: createForm.location,
        instructor_id: createForm.instructor_id || null,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed'); setSaving(false); return }
    const updated = await fetch(`/api/sessions?school_id=${schoolId}`).then(r => r.json())
    setSessions(Array.isArray(updated) ? updated : sessions)
    setShowCreate(false)
    setCreateForm({ start_date: '', start_time: '', end_time: '', max_seats: '10', price_cents: '5000', location: '', instructor_id: '' })
    setSaving(false)
  }

  async function handleSave(updated: Partial<Session>) {
    if (!selected || !schoolId) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/sessions/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
      body: JSON.stringify(updated),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Save failed'); setSaving(false); return }
    const updatedSessions = await fetch(`/api/sessions?school_id=${schoolId}`).then(r => r.json())
    setSessions(Array.isArray(updatedSessions) ? updatedSessions : sessions)
    setSelected(null)
    setSaving(false)
  }

  async function handleDuplicate() {
    if (!selected || !schoolId) return
    setDupying(true)
    const res = await fetch(`/api/sessions/duplicate/${selected.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
      body: JSON.stringify({ weeks: dupWeeks }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed'); setDupying(false); return }
    const updatedSessions = await fetch(`/api/sessions?school_id=${schoolId}`).then(r => r.json())
    setSessions(Array.isArray(updatedSessions) ? updatedSessions : sessions)
    setShowDuplicate(false)
    setDupying(false)
  }

  function formatPrice(cents: number) {
    return `$${(cents / 100).toFixed(0)}`
  }

  const now = new Date()
  const upcoming = sessions.filter(s => !s.cancelled && new Date(`${s.start_date}T${s.start_time}`) >= now)
  const past = sessions.filter(s => s.cancelled || new Date(`${s.start_date}T${s.start_time}`) < now)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold">Sessions</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{sessions.length} total</span>
            <Link href="/school-admin" className="text-sm text-gray-400 hover:text-white">← Back</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Sessions</h1>
          <button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90">
            + New Session
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="bg-white/5 border border-white/10 rounded-xl h-20 animate-pulse" />)}</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-3">📅</div>
            <p>No sessions yet</p>
            <button onClick={() => setShowCreate(true)} className="mt-3 text-cyan-400 text-sm hover:underline">Create your first session</button>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-8">
                <div className="text-sm font-medium text-gray-500 mb-3">Upcoming</div>
                <div className="space-y-2">
                  {upcoming.map(s => (
                    <SessionCard key={s.id} session={s} onEdit={() => setSelected(s)} />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-3">Past / Cancelled</div>
                <div className="space-y-2 opacity-60">
                  {past.map(s => (
                    <SessionCard key={s.id} session={s} onEdit={() => setSelected(s)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreate && (
        <SessionModal
          title="New Session"
          form={createForm}
          instructors={instructors}
          onClose={() => setShowCreate(false)}
          onChange={setCreateForm}
          onSubmit={handleCreate}
          saving={saving}
          error={error}
        />
      )}

      {/* Edit Session Slide-Over */}
      {selected && (
        <SessionSlideOver
          session={selected}
          instructors={instructors}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onDuplicate={() => setShowDuplicate(true)}
          saving={saving}
          error={error}
          schoolId={schoolId}
        />
      )}

      {/* Duplicate Modal */}
      {showDuplicate && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowDuplicate(false)} />
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Duplicate Session</h3>
            <p className="text-sm text-gray-400 mb-4">
              Create copies of this session every week for how many weeks?
            </p>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">Number of weeks (1-12)</label>
              <input
                type="number" min="1" max="12" value={dupWeeks}
                onChange={e => setDupWeeks(Math.max(1, Math.min(12, Number(e.target.value))))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div className="text-xs text-gray-500 mb-4">
              Will create {dupWeeks} new session{dupWeeks !== 1 ? 's' : ''} — same day, time, instructor
            </div>
            {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setShowDuplicate(false)} className="flex-1 py-2 rounded-lg text-gray-400 text-sm">Cancel</button>
              <button onClick={handleDuplicate} disabled={duping} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50">
                {duping ? 'Duplicating...' : `Create ${dupWeeks} Session${dupWeeks !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Session Card ───────────────────────────────────────────────────────

function SessionCard({ session, onEdit }: { session: Session; onEdit: () => void }) {
  const now = new Date()
  const sessionDate = new Date(`${session.start_date}T${session.start_time}`)
  const isPast = sessionDate < now || session.cancelled
  const fillPct = session.max_seats > 0 ? (session.seats_booked / session.max_seats) * 100 : 0

  return (
    <div
      onClick={onEdit}
      className={`bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors ${session.cancelled ? 'opacity-50' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="font-medium text-white">{formatDate(session.start_date)}</div>
          <div className="text-gray-400 text-sm">{session.start_time} – {session.end_time}</div>
          {session.cancelled && <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">Cancelled</span>}
          {isPast && !session.cancelled && <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">Past</span>}
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          {session.location && <span>{session.location}</span>}
          {session.instructor?.name && <span>👤 {session.instructor.name}</span>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Seats badge */}
        <div className="text-right">
          <div className={`text-sm font-medium ${fillPct >= 90 ? 'text-yellow-400' : 'text-gray-300'}`}>
            {session.seats_booked}/{session.max_seats}
          </div>
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.min(100, fillPct)}%`, background: fillPct >= 90 ? '#eab308' : '#06b6d4' }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-0.5">seats</div>
        </div>
        <div className="text-sm font-medium text-gray-300">{session.price_cents ? `$${session.price_cents / 100}` : 'Free'}</div>
        <div className="text-gray-600">→</div>
      </div>
    </div>
  )
}

// ── Edit Slide-Over ───────────────────────────────────────────────────

function SessionSlideOver({ session, instructors, onClose, onSave, onDuplicate, saving, error, schoolId }: {
  session: Session; instructors: Instructor[]; onClose: () => void; onSave: (d: Partial<Session>) => void
  onDuplicate: () => void; saving: boolean; error: string; schoolId: string | null
}) {
  const now = new Date()
  const sessionDate = new Date(`${session.start_date}T${session.start_time}`)
  const isPast = sessionDate < now

  const [form, setForm] = useState({
    start_date: session.start_date,
    start_time: session.start_time,
    end_time: session.end_time,
    max_seats: String(session.max_seats),
    price_cents: String(session.price_cents),
    location: session.location ?? '',
    instructor_id: session.instructor?.id ?? '',
  })

  async function handleCancel() {
    if (!schoolId || !confirm('Cancel this session? Enrolled students will be notified (stub).')) return
    await onSave({ cancelled: true } as Partial<Session>)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-slate-900 border-l border-white/10 overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isPast ? 'View Session' : 'Edit Session'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form as unknown as Partial<Session>) }} className="p-6 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-sm">{error}</div>}

          <Field label="Date" type="date" value={form.start_date} onChange={v => setForm({ ...form, start_date: v })} disabled={isPast} />
          <Field label="Start Time" type="time" value={form.start_time} onChange={v => setForm({ ...form, start_time: v })} disabled={isPast} />
          <Field label="End Time" type="time" value={form.end_time} onChange={v => setForm({ ...form, end_time: v })} disabled={isPast} />
          <Field label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="Oak Ridge, TN" />

          <div>
            <label className="block text-xs text-gray-500 mb-1">Instructor</label>
            <select
              value={form.instructor_id}
              onChange={e => setForm({ ...form, instructor_id: e.target.value })}
              disabled={isPast}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm disabled:opacity-50"
            >
              <option value="">No instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Max Seats" type="number" value={form.max_seats} onChange={v => setForm({ ...form, max_seats: v })} disabled={isPast} />
            <Field label="Price ($)" type="number" value={form.price_cents} onChange={v => setForm({ ...form, price_cents: v })} disabled={isPast} />
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="text-sm text-gray-400 mb-2">
              {session.seats_booked}/{session.max_seats} seats filled
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${session.max_seats > 0 ? (session.seats_booked / session.max_seats) * 100 : 0}%` }} />
            </div>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex gap-3">
            {!isPast && (
              <>
                <button type="button" onClick={handleCancel} className="flex-1 py-2.5 rounded-xl text-red-400 border border-red-400/30 text-sm hover:bg-red-400/10">
                  Cancel Session
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            )}
            {isPast && (
              <button type="button" onClick={onClose} className="w-full py-2.5 rounded-xl text-gray-400 text-sm">Close</button>
            )}
          </div>

          {!isPast && !session.cancelled && (
            <button type="button" onClick={onDuplicate} className="w-full py-2 rounded-xl text-cyan-400 border border-cyan-400/30 text-sm hover:bg-cyan-400/10">
              📋 Duplicate Series
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

// ── Create Session Modal ───────────────────────────────────────────────

type CreateForm = {
  start_date: string; start_time: string; end_time: string
  max_seats: string; price_cents: string; location: string; instructor_id: string
}

function SessionModal({ title, form, instructors, onClose, onChange, onSubmit, saving, error }: {
  title: string; form: CreateForm; instructors: Instructor[]
  onClose: () => void; onChange: (f: CreateForm) => void; onSubmit: (e: React.FormEvent) => void
  saving: boolean; error: string
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date *" type="date" value={form.start_date} onChange={v => onChange({ ...form, start_date: v })} />
            <Field label="Location" value={form.location} onChange={v => onChange({ ...form, location: v })} placeholder="Oak Ridge, TN" />
            <Field label="Start Time *" type="time" value={form.start_time} onChange={v => onChange({ ...form, start_time: v })} />
            <Field label="End Time *" type="time" value={form.end_time} onChange={v => onChange({ ...form, end_time: v })} />
            <Field label="Max Seats" type="number" value={form.max_seats} onChange={v => onChange({ ...form, max_seats: v })} />
            <Field label="Price (cents)" type="number" value={form.price_cents} onChange={v => onChange({ ...form, price_cents: v })} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Instructor</label>
            <select
              value={form.instructor_id}
              onChange={e => onChange({ ...form, instructor_id: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">No instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Session'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Shared Field Component ─────────────────────────────────────────────

function Field({ label, value, onChange, type = 'text', disabled = false, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
      />
    </div>
  )
}