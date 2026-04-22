'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Student = {
  id: string
  legal_name: string
  created_at: string
  driving_hours: number
  certificate_issued_at: string | null
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <StudentsContent />
    </Suspense>
  )
}

function StudentsContent() {
  const params = useSearchParams()
  const schoolId = params.get('school_id')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    legal_name: '', dob: '', permit_number: '', parent_email: '',
    emergency_contact_name: '', emergency_contact_phone: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    if (!schoolId) return
    const res = await fetch(`/api/students?school_id=${schoolId}`)
    const data = await res.json()
    setStudents(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [schoolId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId! },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Failed')
    } else {
      setShowForm(false)
      setForm({ legal_name: '', dob: '', permit_number: '', parent_email: '', emergency_contact_name: '', emergency_contact_phone: '' })
      load()
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold">Students</span>
          </div>
          <Link href="/school-admin" className="text-sm text-gray-400 hover:text-white">← Back</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Students ({students.length})</h1>
          <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90">
            {showForm ? 'Cancel' : '+ Add Student'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Legal Name</label>
                <input value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Permit Number</label>
                <input value={form.permit_number} onChange={(e) => setForm({ ...form, permit_number: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Parent Email</label>
                <input type="email" value={form.parent_email} onChange={(e) => setForm({ ...form, parent_email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Emergency Contact Name</label>
                <input value={form.emergency_contact_name} onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Emergency Contact Phone</label>
                <input type="tel" value={form.emergency_contact_phone} onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500" />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Student'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="bg-white/5 border border-white/10 rounded-xl h-16 animate-pulse" />)}</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No students yet. Add your first one above.</div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Name 🔒</th>
                  <th className="px-4 py-3">Permit</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((s) => (
                  <tr key={s.id} className="text-sm">
                    <td className="px-4 py-3 text-white">Student</td>
                    <td className="px-4 py-3 text-gray-500">—</td>
                    <td className="px-4 py-3 text-gray-500">{s.driving_hours ?? 0}h</td>
                    <td className="px-4 py-3">
                      {s.certificate_issued_at ? <span className="text-green-400">✅ Certified</span> : <span className="text-yellow-400">In progress</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
