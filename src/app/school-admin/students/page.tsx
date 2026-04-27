'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Shield, Mail, Phone } from 'lucide-react'
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
  green:     '#10B981',
  amber:     '#f59e0b',
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

// Actual DB columns for students_driver_ed
type Student = {
  id: string
  legal_name: string           // encrypted — display [REDACTED] unless decrypt available
  permit_number: string | null
  dob: string
  parent_email: string | null
  classroom_hours: number
  driving_hours: number
  certificate_issued_at: string | null
  enrollment_date: string
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  created_at: string
}

// Derive status from TCA completion
function getStudentStatus(s: Student): string {
  if (s.certificate_issued_at) return 'certified'
  if (s.classroom_hours > 0 || s.driving_hours > 0) return 'in_progress'
  return 'pending'
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    in_progress: { color: T.cyan, bg: `${T.cyan}15` },
    pending:     { color: T.amber, bg: `${T.amber}15` },
    certified:   { color: T.green, bg: `${T.green}15` },
  }
  const s = map[status] || map.pending
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
      style={{ background: s.bg, color: s.color }}>
      {status === 'in_progress' ? 'In Progress' : status}
    </span>
  )
}

// Display name — legal_name is encrypted, show placeholder for demo
function StudentName({ name }: { name: string }) {
  // Encrypted names show as [REDACTED] — decrypt available via /api/students
  const display = name.startsWith('eyJ') ? 'Student Record' : name
  return <span style={{ color: T.text }}>{display}</span>
}

function AddStudentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Partial<Student>) => void }) {
  const [form, setForm] = useState({ legal_name: '', dob: '', parent_email: '', emergency_contact_name: '', emergency_contact_phone: '' })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user!.id).single()
    if (!school) { setLoading(false); return }

    const { data, error } = await supabase
      .from('students_driver_ed')
      .insert({
        legal_name: form.legal_name,   // will be encrypted by API — pass raw for now
        dob: form.dob,
        parent_email: form.parent_email || null,
        emergency_contact_name: form.emergency_contact_name || null,
        emergency_contact_phone: form.emergency_contact_phone || null,
        school_id: school.id,
        enrollment_date: new Date().toISOString().split('T')[0],
        classroom_hours: 0,
        driving_hours: 0,
      })
      .select()
      .single()

    if (!error && data) {
      onAdd(data)
      onClose()
    }
    setLoading(false)
  }

  const inputStyle = { background: T.elevated, border: `1px solid ${T.borderLt}`, color: T.text, outline: 'none' as const, borderRadius: '12px' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <h2 className="text-lg font-semibold mb-6" style={{ color: T.text }}>Add Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'legal_name', label: 'Full Legal Name', placeholder: 'Jordan Kim', type: 'text' },
            { key: 'dob', label: 'Date of Birth (YYYY-MM-DD)', placeholder: '2010-03-15', type: 'date' },
            { key: 'parent_email', label: 'Parent Email', placeholder: 'parent@email.com', type: 'email' },
            { key: 'emergency_contact_name', label: 'Emergency Contact', placeholder: 'Full Name', type: 'text' },
            { key: 'emergency_contact_phone', label: 'Emergency Phone', placeholder: '(615) 555-0100', type: 'tel' },
          ].map(({ key, label, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>{label}</label>
              <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder} required className="w-full px-4 py-3 text-sm" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
                onBlur={e => (e.target.style.borderColor = T.borderLt)} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: T.elevated, color: T.secondary, border: `1px solid ${T.border}` }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: T.grad }}>
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let schoolId: string | null = null

      // Try demo_user cookie first (DEMO_MODE)
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const payload = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1])))
          schoolId = payload.schoolId
        } catch {}
      }

      // Fall back to Supabase auth
      if (!schoolId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = '/login'; return }
        const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
        if (!school) { setLoading(false); return }
        schoolId = school.id
      }

      const { data } = await supabase
        .from('students_driver_ed')
        .select('id, legal_name, parent_email, classroom_hours, driving_hours, certificate_issued_at, emergency_contact_phone, enrollment_date, created_at')
        .eq('school_id', schoolId)
      setStudents((data as any[]) || [])
      setLoading(false)
    }
    load()
  }, [])


  const filtered = students.filter(s =>
    s.legal_name.toLowerCase().includes(search.toLowerCase()) ||
    (s.parent_email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: T.text }}>Students</h1>
          <p className="text-sm" style={{ color: T.muted }}>{students.length} total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
          style={{ background: T.grad }}>
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.muted }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
          style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text, outline: 'none' }}
          onFocus={e => (e.target.style.borderColor = `${T.cyan}50`)}
          onBlur={e => (e.target.style.borderColor = T.border)} />
      </div>

      {loading ? (
        <div className="text-center py-16"><p className="text-sm" style={{ color: T.muted }}>Loading students...</p></div>
      ) : !filtered.length ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <p className="text-sm mb-3" style={{ color: T.muted }}>{search ? 'No students match your search' : 'No students yet'}</p>
          {!search && (
            <button onClick={() => setShowModal(true)} className="text-sm font-medium" style={{ color: T.cyan }}>
              Add your first student →
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
            style={{ background: T.surface, color: T.muted, borderBottom: `1px solid ${T.border}` }}>
            <div className="col-span-2">Name</div>
            <div>Contact</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {filtered.map(student => {
            const status = getStudentStatus(student)
            const displayName = student.legal_name.startsWith('eyJ') ? 'Student Record' : student.legal_name
            return (
              <div key={student.id}
                className="grid grid-cols-5 gap-4 px-5 py-4 items-center text-sm"
                style={{ borderBottom: `1px solid ${T.border}` }}
                onMouseEnter={e => (e.currentTarget.style.background = `${T.elevated}50`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div className="col-span-2">
                  <div className="font-medium" style={{ color: T.text }}>{displayName}</div>
                  <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: T.muted }}>
                    <Shield className="w-3 h-3" style={{ color: student.classroom_hours >= 6 && student.driving_hours >= 6 ? T.green : T.muted }} />
                    {student.classroom_hours}h class · {student.driving_hours}h drive
                  </div>
                </div>
                <div className="space-y-1">
                  {student.parent_email && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: T.secondary }}>
                      <Mail className="w-3 h-3 flex-shrink-0" style={{ color: T.muted }} />
                      {student.parent_email}
                    </div>
                  )}
                  {student.emergency_contact_phone && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: T.secondary }}>
                      <Phone className="w-3 h-3 flex-shrink-0" style={{ color: T.muted }} />
                      {student.emergency_contact_phone}
                    </div>
                  )}
                </div>
                <div><StatusBadge status={status} /></div>
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/school-admin/students/${student.id}`}
                    className="p-2 rounded-lg" style={{ color: T.muted }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.elevated)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onAdd={s => setStudents(prev => [s as Student, ...prev])} />}
    </div>
  )
}