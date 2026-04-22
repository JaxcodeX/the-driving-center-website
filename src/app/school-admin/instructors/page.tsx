'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Instructor = {
  id: string
  name: string
  email: string | null
  phone: string | null
  license_number: string | null
  license_expiry: string | null
  active: boolean
}

export default function InstructorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <InstructorsContent />
    </Suspense>
  )
}

function InstructorsContent() {
  const params = useSearchParams()
  const schoolId = params.get('school_id')
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', license_number: '', license_expiry: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!schoolId) return
    const res = await fetch(`/api/instructors?school_id=${schoolId}`)
    const data = await res.json()
    setInstructors(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [schoolId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/instructors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId! },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ name: '', email: '', phone: '', license_number: '', license_expiry: '' })
    load()
    setSaving(false)
  }

  async function handleDeactivate(id: string) {
    if (!confirm('Deactivate this instructor?')) return
    await fetch(`/api/instructors/${id}`, { method: 'DELETE', headers: { 'x-school-id': schoolId! } })
    load()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold">Instructors</span>
          </div>
          <Link href="/school-admin" className="text-sm text-gray-400 hover:text-white">← Back</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Instructors ({instructors.length})</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90">
            {showForm ? 'Cancel' : '+ Add Instructor'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">License Number</label>
                <input value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">License Expiry</label>
                <input type="date" value={form.license_expiry} onChange={(e) => setForm({ ...form, license_expiry: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {saving ? 'Adding...' : 'Add Instructor'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="bg-white/5 border border-white/10 rounded-xl h-20 animate-pulse" />)}</div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No instructors yet. Add your first one above.</div>
        ) : (
          <div className="space-y-3">
            {instructors.map((i) => (
              <div key={i.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{i.name}</div>
                  <div className="text-sm text-gray-500">
                    {i.email && `${i.email} · `}{i.phone && `${i.phone}`}
                  </div>
                  {i.license_number && (
                    <div className="text-xs text-gray-600 mt-1">
                      License: {i.license_number} · Exp: {i.license_expiry ?? '—'}
                    </div>
                  )}
                </div>
                <button onClick={() => handleDeactivate(i.id)} className="text-sm text-red-400 hover:text-red-300">
                  Deactivate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
