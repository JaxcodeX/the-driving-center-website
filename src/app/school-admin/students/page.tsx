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
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600',
      background: status === 'certified' ? 'rgba(96,165,250,0.15)' : status === 'in_progress' ? 'rgba(74,222,128,0.15)' : 'rgba(249,115,22,0.15)',
      color: status === 'certified' ? '#60A5FA' : status === 'in_progress' ? '#4ADE80' : '#F97316',
    }}>
      {getStatusLabel(status)}
    </span>
  )
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
          Add Student
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { key: 'legal_name', label: 'Full Legal Name', placeholder: 'Jordan Kim', type: 'text' },
            { key: 'dob', label: 'Date of Birth', placeholder: '2010-03-15', type: 'date' },
            { key: 'parent_email', label: 'Parent Email', placeholder: 'parent@email.com', type: 'email' },
            { key: 'emergency_contact_name', label: 'Emergency Contact', placeholder: 'Full Name', type: 'text' },
            { key: 'emergency_contact_phone', label: 'Emergency Phone', placeholder: '(615) 555-0100', type: 'tel' },
          ].map(({ key, label, placeholder, type = 'text' }) => (
            <div key={key}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#9CA3AF',
                marginBottom: '6px',
              }}>
                {label}
              </label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
              />
            </div>
          ))}
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
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
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
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))

      if (demoCookie) {
        try {
          const res = await fetch('/api/demo/students')
          if (res.ok) {
            const data = await res.json()
            setStudents(data || [])
            setLoading(false)
            return
          }
        } catch { /* fall through */ }
        setStudents([])
        setLoading(false)
        return
      }

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
            Students
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            {students.length} total
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
          Add Student
        </button>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none' }}
        />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{
            width: '100%',
            padding: '12px 16px 12px 44px',
            background: '#0D0D0D',
            border: '1px solid #1A1A1A',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#4ADE80')}
          onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{
          background: '#0F1117',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          textAlign: 'center',
          padding: '64px',
          color: '#6B7280',
        }}>
          <p style={{ fontSize: '14px' }}>Loading students...</p>
        </div>
      ) : !filtered.length ? (
        <div style={{
          background: '#0F1117',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          textAlign: 'center',
          padding: '64px',
        }}>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>
            {search ? 'No students match your search' : 'No students yet'}
          </p>
          {!search && (
            <button onClick={() => setShowModal(true)} style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4ADE80',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}>
              Add your first student →
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
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr 60px',
              gap: '16px',
              padding: '12px 24px',
              borderBottom: '1px solid #1A1A1A',
            }}
          >
            {['Name', 'Contact', 'TCA Progress', 'Status', ''].map((h, i) => (
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

          {/* Rows */}
          {filtered.map(student => {
            const status = getStudentStatus(student)
            const displayName = student.legal_name.startsWith('eyJ') ? 'Student Record' : student.legal_name
            const initials = getInitials(displayName)
            const gradient = avatarGradient(displayName)
            const totalHours = student.classroom_hours + student.driving_hours
            const tcaPct = Math.min(100, Math.round((totalHours / 60) * 100))

            return (
              <div
                key={student.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 60px',
                  gap: '16px',
                  padding: '16px 24px',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                {/* Name + avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {displayName}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '2px',
                      color: '#6B7280',
                    }}>
                      <Shield
                        className="w-3 h-3"
                        style={{
                          color: student.classroom_hours >= 6 && student.driving_hours >= 6 ? '#4ADE80' : '#6B7280',
                        }}
                      />
                      {student.classroom_hours}h class · {student.driving_hours}h drive
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {student.parent_email && (
                    <div style={{
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#9CA3AF',
                    }}>
                      <Mail className="w-3 h-3" style={{ color: '#6B7280', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {student.parent_email}
                      </span>
                    </div>
                  )}
                  {student.emergency_contact_phone && (
                    <div style={{
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#9CA3AF',
                    }}>
                      <Phone className="w-3 h-3" style={{ color: '#6B7280', flexShrink: 0 }} />
                      {student.emergency_contact_phone}
                    </div>
                  )}
                </div>

                {/* TCA Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      height: '6px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.08)',
                      flex: 1,
                      minWidth: '60px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${tcaPct}%`,
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, #38BDF8, #818CF8)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#6B7280', flexShrink: 0 }}>
                    {tcaPct}%
                  </span>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={status} />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Link
                    href={`/school-admin/students/${student.id}`}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      transition: 'background 0.15s',
                      color: '#9CA3AF',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
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
