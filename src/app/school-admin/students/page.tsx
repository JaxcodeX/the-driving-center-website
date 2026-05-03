'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Shield, Mail, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Student = {
  id: string
  legal_name: string
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

function getStudentStatus(s: Student): string {
  if (s.certificate_issued_at) return 'certified'
  if (s.classroom_hours > 0 || s.driving_hours > 0) return 'in_progress'
  return 'pending'
}

function getStatusPillClass(status: string): string {
  if (status === 'certified') return 'status-completed'
  if (status === 'in_progress') return 'status-active'
  return 'status-pending'
}

function getStatusLabel(status: string): string {
  if (status === 'certified') return 'Certified'
  if (status === 'in_progress') return 'In Progress'
  return 'Pending'
}

// Gradient for avatar based on name
function avatarGradient(name: string): string {
  const gradients = [
    'linear-gradient(135deg, #38BDF8, #818CF8)',
    'linear-gradient(135deg, #4ADE80, #38BDF8)',
    'linear-gradient(135deg, #818CF8, #F97316)',
    'linear-gradient(135deg, #F97316, #FACC15)',
    'linear-gradient(135deg, #38BDF8, #4ADE80)',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return gradients[Math.abs(hash) % gradients.length]
}

function getInitials(name: string): string {
  const display = name.startsWith('eyJ') ? 'SR' : name
  const parts = display.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return display.slice(0, 2).toUpperCase()
}

function StatusBadge({ status }: { status: string }) {
  const cls = getStatusPillClass(status)
  return <span className={`status-pill ${cls}`}>{getStatusLabel(status)}</span>
}

function AddStudentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Partial<Student>) => void }) {
  const [form, setForm] = useState({
    legal_name: '', dob: '', parent_email: '',
    emergency_contact_name: '', emergency_contact_phone: '',
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

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
      .from('students_driver_ed')
      .insert({
        legal_name: form.legal_name,
        dob: form.dob,
        parent_email: form.parent_email || null,
        emergency_contact_name: form.emergency_contact_name || null,
        emergency_contact_phone: form.emergency_contact_phone || null,
        school_id: schoolId,
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

  const inputStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    outline: 'none' as const,
    borderRadius: '12px',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl p-8 glass-card">
        <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Add Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'legal_name', label: 'Full Legal Name', placeholder: 'Jordan Kim', type: 'text' },
            { key: 'dob', label: 'Date of Birth (YYYY-MM-DD)', placeholder: '2010-03-15', type: 'date' },
            { key: 'parent_email', label: 'Parent Email', placeholder: 'parent@email.com', type: 'email' },
            { key: 'emergency_contact_name', label: 'Emergency Contact', placeholder: 'Full Name', type: 'text' },
            { key: 'emergency_contact_phone', label: 'Emergency Phone', placeholder: '(615) 555-0100', type: 'tel' },
          ].map(({ key, label, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                required
                className="w-full px-4 py-3 text-sm"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 text-center py-3 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-glow flex-1 text-center py-3 text-sm font-semibold disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Student →'}
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
      // Check for demo mode via cookie
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))

      if (demoCookie) {
        // Demo mode: use server-side demo endpoint (bypasses RLS)
        // The cookie is forwarded automatically; server reads it via cookies()
        try {
          const res = await fetch('/api/demo/students')
          if (res.ok) {
            const data = await res.json()
            setStudents(data || [])
            setLoading(false)
            return
          }
        } catch { /* fall through to error state */ }
        setStudents([])
        setLoading(false)
        return
      }

      // Normal mode: use Supabase auth
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('owner_user_id', user.id)
        .single()
      if (!school) { setLoading(false); return }

      const { data } = await supabase
        .from('students_driver_ed')
        .select('id, legal_name, parent_email, classroom_hours, driving_hours, certificate_issued_at, emergency_contact_phone, enrollment_date, created_at')
        .eq('school_id', school.id)

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Students</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{students.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-glow inline-flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Search bar - pill input */}
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-pill w-full pl-11 pr-4 py-2.5 text-sm"
          style={{ paddingLeft: '44px' }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass-card text-center py-16">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading students...</p>
        </div>
      ) : !filtered.length ? (
        <div className="glass-card text-center py-16">
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            {search ? 'No students match your search' : 'No students yet'}
          </p>
          {!search && (
            <button onClick={() => setShowModal(true)} className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              Add your first student →
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Table header */}
          <div
            className="grid px-6 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
              gap: '16px',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>Name</div>
            <div>Contact</div>
            <div>TCA Progress</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Rows */}
          {filtered.map(student => {
            const status = getStudentStatus(student)
            const displayName = student.legal_name.startsWith('eyJ') ? 'Student Record' : student.legal_name
            const initials = getInitials(displayName)
            const gradient = avatarGradient(displayName)

            // TCA progress: total hours vs 60 (6 class + 6 drive)
            const totalHours = student.classroom_hours + student.driving_hours
            const tcaPct = Math.min(100, Math.round((totalHours / 60) * 100))

            return (
              <div
                key={student.id}
                className="grid px-6 py-4 items-center text-sm transition-colors"
                style={{
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
                  gap: '16px',
                  borderBottom: `1px solid rgba(255,255,255,0.04)`,
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                {/* Name + avatar */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: gradient }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</div>
                    <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <Shield
                        className="w-3 h-3"
                        style={{
                          color: student.classroom_hours >= 6 && student.driving_hours >= 6 ? 'var(--success)' : 'var(--text-muted)',
                        }}
                      />
                      {student.classroom_hours}h class · {student.driving_hours}h drive
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-1.5">
                  {student.parent_email && (
                    <div className="flex items-center gap-1.5 text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      <Mail className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                      {student.parent_email}
                    </div>
                  )}
                  {student.emergency_contact_phone && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Phone className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                      {student.emergency_contact_phone}
                    </div>
                  )}
                </div>

                {/* TCA Progress Bar */}
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 rounded-full overflow-hidden flex-1"
                    style={{ background: 'rgba(255,255,255,0.08)', minWidth: '60px' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${tcaPct}%`,
                        background: 'linear-gradient(90deg, #38BDF8, #818CF8)',
                      }}
                    />
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {tcaPct}%
                  </span>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={status} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end">
                  <Link
                    href={`/school-admin/students/${student.id}`}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <AddStudentModal
          onClose={() => setShowModal(false)}
          onAdd={s => setStudents(prev => [s as Student, ...prev])}
        />
      )}
    </div>
  )
}
