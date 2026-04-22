'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  instructor?: { name: string }
  cancelled: boolean
}

export default function SessionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <SessionsContent />
    </Suspense>
  )
}

function SessionsContent() {
  const params = useSearchParams()
  const schoolId = params.get('school_id')
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    start_date: '',
    start_time: '',
    end_time: '',
    max_seats: '10',
    price_cents: '5000',
    location: '',
    instructor_id: '',
  })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function loadSessions() {
    if (!schoolId) return
    const res = await fetch(`/api/sessions?school_id=${schoolId}`)
    const data = await res.json()
    setSessions(data)
    setLoading(false)
  }

  useEffect(() => { loadSessions() }, [schoolId])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-school-id': schoolId!,
      },
      body: JSON.stringify({
        start_date: form.start_date,
        start_time: form.start_time,
        end_time: form.end_time,
        max_seats: parseInt(form.max_seats),
        price_cents: parseInt(form.price_cents),
        location: form.location,
        instructor_id: form.instructor_id || null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to create session')
      setCreating(false)
    } else {
      setShowForm(false)
      setForm({ start_date: '', start_time: '', end_time: '', max_seats: '10', price_cents: '5000', location: '', instructor_id: '' })
      loadSessions()
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Cancel this session?')) return
    await fetch(`/api/sessions/${id}`, {
      method: 'DELETE',
      headers: { 'x-school-id': schoolId! },
    })
    loadSessions()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold">Manage Sessions</span>
          </div>
          <Link href="/school-admin" className="text-sm text-gray-400 hover:text-white">← Back</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Sessions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90"
          >
            {showForm ? 'Cancel' : '+ New Session'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Oak Ridge, TN" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Time</label>
                <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Seats</label>
                <input type="number" value={form.max_seats} onChange={(e) => setForm({ ...form, max_seats: e.target.value })} min="1" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price (cents)</label>
                <input type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: e.target.value })} min="0" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={creating} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {creating ? 'Creating...' : 'Create Session'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="bg-white/5 border border-white/10 rounded-xl h-16 animate-pulse" />)}</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No sessions yet. Create your first one above.</div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">
                    {new Date(`${s.start_date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
                    at {s.start_time}
                  </div>
                  <div className="text-sm text-gray-500">
                    {s.location && `${s.location} · `}{s.seats_booked}/{s.max_seats} booked · ${(s.price_cents / 100).toFixed(0)}
                  </div>
                </div>
                <button onClick={() => handleDelete(s.id)} className="text-sm text-red-400 hover:text-red-300">
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
