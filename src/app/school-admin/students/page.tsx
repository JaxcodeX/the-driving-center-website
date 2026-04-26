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

type Student = {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  created_at: string
  classroom_hours: number
  driving_hours: number
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    active:   { color: T.green, bg: `${T.green}15` },
    pending:  { color: T.amber, bg: `${T.amber}15` },
    certified:{ color: T.cyan,  bg: `${T.cyan}15` },
    inactive: { color: T.muted, bg: `${T.muted}15` },
  }
  const s = map[status] || map.inactive
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  )
}

function AddStudentModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (s: Student) => void
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: school } = await supabase.from('schools').select('id').eq('owner_id', user!.id).single()

    if (!school) { setLoading(false); return }
    const { data, error } = await supabase
      .from('students')
      .insert({ ...form, school_id: school.id, status: 'pending' })
      .select()
      .single()

    if (!error && data) {
      onAdd(data)
      onClose()
    }
    setLoading(false)
  }

  const inputStyle = {
    background: T.elevated,
    border: `1px solid ${T.borderLt}`,
    color: T.text,
    outline: 'none' as const,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
      >
        <h2 className="text-lg font-semibold mb-6" style={{ color: T.text }}>Add Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name',  label: 'Full Name',  placeholder: 'Jordan Kim' },
            { key: 'email', label: 'Email',       placeholder: 'jordan@email.com', type: 'email' },
            { key: 'phone', label: 'Phone',       placeholder: '(615) 555-0100', type: 'tel' },
          ].map(({ key, label, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>
                {label}
              </label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                required
                className="w-full rounded-xl px-4 py-3 text-sm"
                style={inputStyle}
                onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}60`)}
                onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.borderLt)}
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: T.elevated, color: T.secondary, border: `1px solid ${T.border}` }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: T.grad }}
            >
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

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: school } = await supabase.from('schools').select('id').eq('owner_id', user.id).single()
      if (!school) { setLoading(false); return }

      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false })
      setStudents(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: T.text }}>Students</h1>
          <p className="text-sm" style={{ color: T.muted }}>{students.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
          style={{ background: T.grad }}
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.muted }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            color: T.text,
            outline: 'none',
          }}
          onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}50`)}
          onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.border)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16" style={{ color: T.muted }}>
          <p className="text-sm">Loading students...</p>
        </div>
      ) : !filtered.length ? (
        <div className="text-center py-16" style={{ color: T.muted }}>
          <p className="text-sm mb-3">{search ? 'No students match your search' : 'No students yet'}</p>
          {!search && (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm font-medium"
              style={{ color: T.cyan }}
            >
              Add your first student →
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          {/* Table header */}
          <div
            className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
            style={{ background: T.surface, color: T.muted, borderBottom: `1px solid ${T.border}` }}
          >
            <div className="col-span-2">Name</div>
            <div>Contact</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {/* Rows */}
          {filtered.map(student => (
            <div
              key={student.id}
              className="grid grid-cols-5 gap-4 px-5 py-4 items-center text-sm transition-colors"
              style={{ borderBottom: `1px solid ${T.border}`, background: 'transparent' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${T.elevated}50`)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              {/* Name */}
              <div className="col-span-2">
                <div className="font-medium" style={{ color: T.text }}>{student.name}</div>
                <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: T.muted }}>
                  <Shield className="w-3 h-3" style={{ color: student.classroom_hours >= 6 && student.driving_hours >= 6 ? T.green : T.muted }} />
                  {student.classroom_hours}h class · {student.driving_hours}h drive
                </div>
              </div>
              {/* Contact */}
              <div className="space-y-1">
                {student.email && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: T.secondary }}>
                    <Mail className="w-3 h-3 flex-shrink-0" style={{ color: T.muted }} />
                    {student.email}
                  </div>
                )}
                {student.phone && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: T.secondary }}>
                    <Phone className="w-3 h-3 flex-shrink-0" style={{ color: T.muted }} />
                    {student.phone}
                  </div>
                )}
              </div>
              {/* Status */}
              <div>
                <StatusBadge status={student.status} />
              </div>
              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/school-admin/students/${student.id}`}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: T.muted }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = T.elevated)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <Pencil className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddStudentModal
          onClose={() => setShowModal(false)}
          onAdd={s => setStudents(prev => [s, ...prev])}
        />
      )}
    </div>
  )
}
