'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Shield, Mail, Phone, Calendar, Users, CreditCard, Settings, LayoutDashboard, GraduationCap, Car, Clock, X } from 'lucide-react'
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

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students', active: true },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions' },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors' },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar' },
  { icon: CreditCard, label: 'Billing', href: '/school-admin/billing' },
  { icon: Settings, label: 'Settings', href: '/school-admin/settings' },
]

const BG = 'var(--admin-bg)'
const BG_GRADIENT = 'var(--mesh-subtle)'
const GLASS_BG = 'var(--glass-bg)'
const GLASS_BORDER = 'var(--glass-border)'
const GLASS_BLUR = 'var(--glass-blur)'
const TEXT_SECONDARY = 'var(--admin-text-secondary)'
const ACCENT_GREEN = 'var(--admin-accent)'
const ACCENT_CYAN = 'var(--status-blue)'
const CARD_SHADOW = 'var(--glass-shadow)'
const CARD_SHADOW_HOVER = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--admin-accent), inset 0 1px 0 rgba(255,255,255,0.08)'

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px',
      fontSize: '12px', fontWeight: '600',
      background: status === 'certified' ? 'rgba(59,130,246,0.15)' : status === 'in_progress' ? 'rgba(74,222,128,0.15)' : 'rgba(249,115,22,0.15)',
      color: status === 'certified' ? 'var(--status-blue)' : status === 'in_progress' ? 'var(--admin-accent)' : 'var(--accent-secondary)',
    }}>
      {getStatusLabel(status)}
    </span>
  )
}

function AddStudentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Partial<Student>) => void }) {
  const [form, setForm] = useState({ legal_name: '', dob: '', parent_email: '', emergency_contact_name: '', emergency_contact_phone: '' })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // In demo mode, use the API route (bypasses RLS with service role key)
    const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
    const isDemo = !!demoCookie

    if (isDemo) {
      try {
        const res = await fetch('/api/demo/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            legal_name: form.legal_name,
            dob: form.dob,
            parent_email: form.parent_email || null,
            emergency_contact_name: form.emergency_contact_name || null,
            emergency_contact_phone: form.emergency_contact_phone || null,
          }),
        })
        const data = await res.json()
        if (res.ok && data) { onAdd(data); onClose() }
      } catch {}
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    let schoolId: string | null = null
    if (demoCookie) { try { schoolId = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1]))).schoolId } catch {} }
    if (!schoolId) {
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user!.id).single()
      if (!school) { setLoading(false); return }
      schoolId = school.id
    }
    const { data, error } = await supabase.from('students_driver_ed').insert({
      legal_name: form.legal_name, dob: form.dob, parent_email: form.parent_email || null,
      emergency_contact_name: form.emergency_contact_name || null, emergency_contact_phone: form.emergency_contact_phone || null,
      school_id: schoolId, enrollment_date: new Date().toISOString().split('T')[0], classroom_hours: 0, driving_hours: 0,
    }).select().single()
    if (!error && data) { onAdd(data); onClose() }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFFFFF',
    outline: 'none', borderRadius: '12px', width: '100%', padding: '12px 16px', fontSize: '14px',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(15,17,23,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '600', color: '#FFFFFF', marginBottom: '24px' }}>Add Student</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[{ key: 'legal_name', label: 'Full Legal Name', placeholder: 'Jordan Kim', type: 'text' }, { key: 'dob', label: 'Date of Birth', placeholder: '2010-03-15', type: 'date' }, { key: 'parent_email', label: 'Parent Email', placeholder: 'parent@email.com', type: 'email' }, { key: 'emergency_contact_name', label: 'Emergency Contact', placeholder: 'Full Name', type: 'text' }, { key: 'emergency_contact_phone', label: 'Emergency Phone', placeholder: '(615) 555-0100', type: 'tel' }].map(({ key, label, placeholder, type = 'text' }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '6px' }}>{label}</label>
              <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} required style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: '#4ADE80', border: 'none', borderRadius: '12px', color: '#000000', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Adding...' : 'Add Student →'}</button>
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const res = await fetch('/api/demo/students')
          if (res.ok) { setStudents(await res.json()); setLoading(false); return }
        } catch {}
        setStudents([]); setLoading(false); return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
      if (!school) { setLoading(false); return }
      const { data } = await supabase.from('students_driver_ed').select('id, legal_name, parent_email, classroom_hours, driving_hours, certificate_issued_at, emergency_contact_phone, enrollment_date, created_at').eq('school_id', school.id)
      setStudents((data as any[]) || []); setLoading(false)
    }
    load()
  }, [])

  const filtered = students.filter(s => s.legal_name.toLowerCase().includes(search.toLowerCase()) || (s.parent_email || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      {/* Background gradient */}
      <div style={{ position: 'fixed', inset: 0, background: BG_GRADIENT, pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{
        width: '220px', flexShrink: 0, background: GLASS_BG, backdropFilter: GLASS_BLUR,
        WebkitBackdropFilter: GLASS_BLUR, borderRight: `1px solid ${GLASS_BORDER}`,
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT_GREEN}, ${ACCENT_CYAN})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car className="w-4 h-4" style={{ color: '#000' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>Driving Center</div>
              <div style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>School Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
              <Link key={label} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px',
                textDecoration: 'none', background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                borderLeft: active ? `3px solid ${ACCENT_GREEN}` : '3px solid transparent',
                boxShadow: active ? `0 0 12px rgba(74,222,128,0.3)` : 'none', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <NavIcon className="w-4 h-4" style={{ color: active ? ACCENT_GREEN : TEXT_SECONDARY, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: active ? '600' : '500', color: active ? '#FFFFFF' : TEXT_SECONDARY }}>{label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* School name */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${GLASS_BORDER}` }}>
          <p style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Your Driving School</p>
        </div>
      </aside>

      {/* Mobile nav pills */}
      <nav style={{ display: 'none', padding: '12px 16px', gap: '8px', overflowX: 'auto', borderBottom: `1px solid ${GLASS_BORDER}`, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, position: 'sticky', top: 0, zIndex: 20 }} className="admin-nav-pills">
        {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
          <Link key={label} href={href} style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px',
            textDecoration: 'none', background: active ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${active ? ACCENT_GREEN : GLASS_BORDER}`, transition: 'background 0.15s', flexShrink: 0,
          }}>
            <NavIcon className="w-3.5 h-3.5" style={{ color: active ? ACCENT_GREEN : TEXT_SECONDARY }} />
            <span style={{ fontSize: '12px', fontWeight: active ? '600' : '500', color: active ? ACCENT_GREEN : TEXT_SECONDARY }}>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '220px', padding: '40px 48px', maxWidth: '1100px', position: 'relative', zIndex: 1 }} className="admin-main">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.01em' }}>Students</h1>
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>{students.length} total</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            background: '#4ADE80', border: 'none', borderRadius: '12px', color: '#000000',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 0 16px rgba(74,222,128,0.3)', transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(74,222,128,0.4)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)' }}>
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>

        {/* Search bar - glass */}
        <div style={{
          position: 'relative', marginBottom: '24px',
          background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR,
          border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px',
          boxShadow: CARD_SHADOW,
        }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: TEXT_SECONDARY, pointerEvents: 'none', zIndex: 1 }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{
            width: '100%', padding: '14px 16px 14px 44px', background: 'transparent', border: 'none',
            borderRadius: '16px', color: '#FFFFFF', fontSize: '14px', outline: 'none',
          }}
          onFocus={e => (e.target.parentElement!.style.borderColor = 'rgba(74,222,128,0.3)')}
          onBlur={e => (e.target.parentElement!.style.borderColor = GLASS_BORDER)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', overflow: 'hidden', boxShadow: CARD_SHADOW }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 60px', gap: '16px', padding: '12px 24px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
              {['Name', 'Contact', 'TCA Progress', 'Status', ''].map((_, i) => (
                <div key={i} style={{ height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 60px', gap: '16px', padding: '16px 24px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '6px', marginBottom: '6px' }} />
                    <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: '6px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px' }}>
                  <div className="skeleton" style={{ height: '12px', width: '80%', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ height: '12px', width: '60%', borderRadius: '6px' }} />
                </div>
                <div style={{ paddingTop: '8px' }}><div className="skeleton" style={{ height: '6px', width: '100%', borderRadius: '999px' }} /></div>
                <div style={{ paddingTop: '8px' }}><div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '999px' }} /></div>
                <div style={{ paddingTop: '8px', display: 'flex', justifyContent: 'flex-end' }}><div className="skeleton" style={{ width: '28px', height: '28px', borderRadius: '8px' }} /></div>
              </div>
            ))}
          </div>
        ) : !filtered.length ? (
          <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', textAlign: 'center', padding: '64px', boxShadow: CARD_SHADOW }}>
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY, marginBottom: '12px' }}>{search ? 'No students match your search' : 'No students yet'}</p>
            {!search && <button onClick={() => setShowModal(true)} style={{ fontSize: '14px', fontWeight: '500', color: '#4ADE80', background: 'transparent', border: 'none', cursor: 'pointer' }}>Add your first student →</button>}
          </div>
        ) : (
          <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', overflow: 'hidden', boxShadow: CARD_SHADOW }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 60px', gap: '16px', padding: '12px 24px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
              {['Name', 'Contact', 'TCA Progress', 'Status', ''].map((h, i) => (
                <div key={i} style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: TEXT_SECONDARY }}>{h}</div>
              ))}
            </div>
            {filtered.map(student => {
              const status = getStudentStatus(student)
              const displayName = student.legal_name.startsWith('eyJ') ? 'Student Record' : student.legal_name
              const initials = getInitials(displayName)
              const gradient = avatarGradient(displayName)
              const totalHours = student.classroom_hours + student.driving_hours
              const tcaPct = Math.min(100, Math.round((totalHours / 60) * 100))
              return (
                <div key={student.id} onClick={() => setSelectedStudent(student)} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 60px', gap: '16px', padding: '16px 24px', alignItems: 'center', borderBottom: `1px solid ${GLASS_BORDER}`, transition: 'background 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#FFFFFF', flexShrink: 0 }}>{initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                      <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', color: TEXT_SECONDARY }}>
                        <Shield className="w-3 h-3" style={{ color: student.classroom_hours >= 6 && student.driving_hours >= 6 ? '#4ADE80' : TEXT_SECONDARY }} />
                        {student.classroom_hours}h class · {student.driving_hours}h drive
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {student.parent_email && <div style={{ fontSize: '12px', color: TEXT_SECONDARY, display: 'flex', alignItems: 'center', gap: '6px' }}><Mail className="w-3 h-3" style={{ color: TEXT_SECONDARY, flexShrink: 0 }} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.parent_email}</span></div>}
                    {student.emergency_contact_phone && <div style={{ fontSize: '12px', color: TEXT_SECONDARY, display: 'flex', alignItems: 'center', gap: '6px' }}><Phone className="w-3 h-3" style={{ color: TEXT_SECONDARY, flexShrink: 0 }} />{student.emergency_contact_phone}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', flex: 1, minWidth: '60px', overflow: 'hidden' }}>
                      <div style={{ width: `${tcaPct}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #38BDF8, #818CF8)' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: TEXT_SECONDARY, flexShrink: 0 }}>{tcaPct}%</span>
                  </div>
                  <div><StatusBadge status={status} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Link href={`/school-admin/students/${student.id}`} style={{ padding: '8px', borderRadius: '8px', transition: 'background 0.15s, box-shadow 0.15s', color: TEXT_SECONDARY, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(74,222,128,0.15)'; el.style.boxShadow = '0 0 12px rgba(74,222,128,0.35)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.boxShadow = 'none' }}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onAdd={s => setStudents(prev => [s as Student, ...prev])} />}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          onClick={() => setSelectedStudent(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '520px',
              background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
              padding: '32px', position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedStudent(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Student avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: avatarGradient(selectedStudent.legal_name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: '700', color: '#FFFFFF',
              }}>
                {getInitials(selectedStudent.legal_name)}
              </div>
              <div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' }}>
                  {selectedStudent.legal_name.startsWith('eyJ') ? 'Student Record' : selectedStudent.legal_name}
                </h2>
                <p style={{ fontSize: '13px', color: TEXT_SECONDARY }}>{selectedStudent.parent_email || 'No email on file'}</p>
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Email', value: selectedStudent.parent_email || '—' },
                { label: 'Phone', value: selectedStudent.emergency_contact_phone || '—' },
                { label: 'Permit #', value: selectedStudent.permit_number || 'PENDING' },
                { label: 'DOB', value: selectedStudent.dob ? new Date(selectedStudent.dob + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                { label: 'Enrolled', value: selectedStudent.enrollment_date ? new Date(selectedStudent.enrollment_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                { label: 'Emergency Contact', value: selectedStudent.emergency_contact_name || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px 14px' }}>
                  <p style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: TEXT_SECONDARY, marginBottom: '4px' }}>{label}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: TEXT_SECONDARY }}>Classroom Hours</span>
                  <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: '600' }}>{selectedStudent.classroom_hours}h / 6h</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (selectedStudent.classroom_hours / 6) * 100)}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #38BDF8, #818CF8)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: TEXT_SECONDARY }}>Driving Hours</span>
                  <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: '600' }}>{selectedStudent.driving_hours}h / 6h</span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (selectedStudent.driving_hours / 6) * 100)}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #4ADE80, #38BDF8)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; padding: 24px 16px !important; }
          .admin-nav-pills { display: flex !important; }
        }
        @media (min-width: 769px) { .admin-nav-pills { display: none !important; } }
      `}</style>
    </div>
  )
}