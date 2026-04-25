'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Student = {
  id: string
  legal_name: string
  dob: string
  permit_number: string
  parent_email: string
  emergency_contact_name: string
  emergency_contact_phone: string
  driving_hours: number
  classroom_hours: number
  certificate_issued_at: string | null
  enrollment_date: string
}

const REQUIRED_CLASSROOM = 30
const REQUIRED_DRIVING = 6

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Student | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [addForm, setAddForm] = useState({ legal_name: '', dob: '', permit_number: '', parent_email: '', emergency_contact_name: '', emergency_contact_phone: '' })

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => {
        if (data?.school_id) setSchoolId(data.school_id)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!schoolId) return
    fetch(`/api/students?school_id=${schoolId}`)
      .then(r => r.json())
      .then(data => { setStudents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [schoolId])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!schoolId) return
    setSaving(true)
    setError('')
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
      body: JSON.stringify(addForm),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed'); setSaving(false); return }
    // Reload
    const list = await fetch(`/api/students?school_id=${schoolId}`).then(r => r.json())
    setStudents(list)
    setShowAdd(false)
    setAddForm({ legal_name: '', dob: '', permit_number: '', parent_email: '', emergency_contact_name: '', emergency_contact_phone: '' })
    setSaving(false)
  }

  async function handleSave(updated: Partial<Student>) {
    if (!selected || !schoolId) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/students/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
      body: JSON.stringify(updated),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Save failed'); setSaving(false); return }
    // Reload selected + list
    const full = await fetch(`/api/students/${selected.id}`, {
      headers: { 'x-school-id': schoolId }
    }).then(r => r.json())
    const list = await fetch(`/api/students?school_id=${schoolId}`).then(r => r.json())
    setStudents(list)
    setSelected(full)
    setSaving(false)
  }

  function tcaProgress(s: Student) {
    const classroom = Math.min(100, Math.round((s.classroom_hours / REQUIRED_CLASSROOM) * 100))
    const driving = Math.min(100, Math.round((s.driving_hours / REQUIRED_DRIVING) * 100))
    return { classroom, driving }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold">Students</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/school-admin/import" className="text-sm text-gray-400 hover:text-white">Import CSV</Link>
            <Link href="/school-admin" className="text-sm text-gray-400 hover:text-white">← Back</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Students ({students.length})</h1>
          <button onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90">
            + Add Student
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="bg-white/5 border border-white/10 rounded-xl h-20 animate-pulse" />)}</div>
        ) : students.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-4xl mb-3">🎓</div>
            <p>No students yet</p>
            <button onClick={() => setShowAdd(true)} className="mt-3 text-cyan-400 text-sm hover:underline">Add your first student</button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-500">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Permit</th>
                  <th className="px-4 py-3">Classroom</th>
                  <th className="px-4 py-3">Driving</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map(s => {
                  const { classroom, driving } = tcaProgress(s)
                  const canCert = s.classroom_hours >= REQUIRED_CLASSROOM && s.driving_hours >= REQUIRED_DRIVING && !s.certificate_issued_at
                  return (
                    <tr key={s.id} onClick={() => setSelected(s)} className="text-sm cursor-pointer hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{s.legal_name}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{s.permit_number || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${classroom}%`, background: classroom >= 100 ? '#10b981' : '#06b6d4' }} />
                          </div>
                          <span className="text-xs text-gray-400">{s.classroom_hours}h</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${driving}%`, background: driving >= 100 ? '#10b981' : '#06b6d4' }} />
                          </div>
                          <span className="text-xs text-gray-400">{s.driving_hours}h</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {s.certificate_issued_at
                          ? <span className="text-green-400 text-xs">✅ Certified</span>
                          : canCert
                            ? <span className="text-cyan-400 text-xs">Eligible</span>
                            : <span className="text-yellow-400 text-xs">In progress</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <StudentModal student={null} onClose={() => setShowAdd(false)} onSave={async (data) => {
          const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId! },
            body: JSON.stringify(data),
          })
          if (res.ok) {
            const list = await fetch(`/api/students?school_id=${schoolId}`).then(r => r.json())
            setStudents(list)
            setShowAdd(false)
          }
        }} saving={saving} error={error} schoolId={schoolId} />
      )}

      {/* Edit Student Slide-Over */}
      {selected && (
        <StudentSlideOver student={selected} onClose={() => setSelected(null)} onSave={handleSave} saving={saving} error={error} schoolId={schoolId} />
      )}
    </div>
  )
}

// ── Student Edit Slide-Over ────────────────────────────────────────────

function StudentSlideOver({ student, onClose, onSave, saving, error, schoolId }: {
  student: Student
  onClose: () => void
  onSave: (d: Partial<Student>) => void
  saving: boolean
  error: string
  schoolId: string | null
}) {
  const [form, setForm] = useState({
    legal_name: student.legal_name,
    dob: student.dob,
    permit_number: student.permit_number,
    parent_email: student.parent_email,
    emergency_contact_name: student.emergency_contact_name,
    emergency_contact_phone: student.emergency_contact_phone,
    driving_hours: student.driving_hours,
    classroom_hours: student.classroom_hours,
  })
  const [issueError, setIssueError] = useState('')

  const canCert = form.classroom_hours >= REQUIRED_CLASSROOM && form.driving_hours >= REQUIRED_DRIVING && !student.certificate_issued_at

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
  }

  async function handleIssue() {
    if (!schoolId) return
    setIssueError('')
    const res = await fetch(`/api/students/${student.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
      body: JSON.stringify({ issue_certificate: true }),
    })
    const data = await res.json()
    if (!res.ok) { setIssueError(data.error ?? 'Failed'); return }
    // Notify parent and return
    onSave({})
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-slate-900 border-l border-white/10 overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Student</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-sm">{error}</div>}

          <Field label="Legal Name" value={form.legal_name} onChange={v => setForm({ ...form, legal_name: v })} />
          <Field label="Date of Birth" value={form.dob} onChange={v => setForm({ ...form, dob: v })} type="date" />
          <Field label="Permit Number" value={form.permit_number} onChange={v => setForm({ ...form, permit_number: v })} />
          <Field label="Parent Email" value={form.parent_email} onChange={v => setForm({ ...form, parent_email: v })} type="email" />
          <Field label="Emergency Contact Name" value={form.emergency_contact_name} onChange={v => setForm({ ...form, emergency_contact_name: v })} />
          <Field label="Emergency Contact Phone" value={form.emergency_contact_phone} onChange={v => setForm({ ...form, emergency_contact_phone: v })} type="tel" />

          {/* TCA Hours */}
          <div className="border-t border-white/10 pt-4">
            <div className="text-sm font-medium text-gray-400 mb-3">TCA Hours</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Classroom (min {REQUIRED_CLASSROOM}h)</label>
                <input type="number" min="0" value={form.classroom_hours} onChange={e => setForm({ ...form, classroom_hours: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (form.classroom_hours / REQUIRED_CLASSROOM) * 100)}%`, background: form.classroom_hours >= REQUIRED_CLASSROOM ? '#10b981' : '#06b6d4' }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Driving (min {REQUIRED_DRIVING}h)</label>
                <input type="number" min="0" value={form.driving_hours} onChange={e => setForm({ ...form, driving_hours: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
                <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (form.driving_hours / REQUIRED_DRIVING) * 100)}%`, background: form.driving_hours >= REQUIRED_DRIVING ? '#10b981' : '#06b6d4' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div className="border-t border-white/10 pt-4">
            {student.certificate_issued_at ? (
              <div className="text-center py-3">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-green-400 font-medium">Certificate Issued</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(student.certificate_issued_at).toLocaleDateString()}</div>
              </div>
            ) : canCert ? (
              <div>
                <div className="text-xs text-cyan-400 mb-2 text-center">✓ Eligible — all TCA minimums met</div>
                {issueError && <div className="text-red-400 text-xs mb-2">{issueError}</div>}
                <button type="button" onClick={handleIssue} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 text-sm">
                  🏆 Issue Certificate
                </button>
              </div>
            ) : (
              <div className="text-center py-3 text-xs text-gray-500">
                Not eligible — need {REQUIRED_CLASSROOM - form.classroom_hours}h more classroom, {REQUIRED_DRIVING - form.driving_hours}h more driving
              </div>
            )}
          </div>

          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Add Student Modal ────────────────────────────────────────────────────

function StudentModal({ student, onClose, onSave, saving, error, schoolId }: {
  student: Student | null
  onClose: () => void
  onSave: (d: any) => void
  saving: boolean
  error: string
  schoolId: string | null
}) {
  const [form, setForm] = useState({
    legal_name: '', dob: '', permit_number: '', parent_email: '',
    emergency_contact_name: '', emergency_contact_phone: '',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h2 className="text-lg font-semibold">Add Student</h2>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-5 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-sm">{error}</div>}
          <Field label="Legal Name *" value={form.legal_name} onChange={v => setForm({ ...form, legal_name: v })} />
          <Field label="Date of Birth *" value={form.dob} onChange={v => setForm({ ...form, dob: v })} type="date" />
          <Field label="Permit Number" value={form.permit_number} onChange={v => setForm({ ...form, permit_number: v })} />
          <Field label="Parent Email" value={form.parent_email} onChange={v => setForm({ ...form, parent_email: v })} type="email" />
          <Field label="Emergency Contact Name" value={form.emergency_contact_name} onChange={v => setForm({ ...form, emergency_contact_name: v })} />
          <Field label="Emergency Contact Phone" value={form.emergency_contact_phone} onChange={v => setForm({ ...form, emergency_contact_phone: v })} type="tel" />
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Shared Field Component ──────────────────────────────────────────────

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
      />
    </div>
  )
}