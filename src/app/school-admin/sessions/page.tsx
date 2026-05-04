'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Calendar, Clock, Users, Pencil, Play, Pause, LayoutDashboard, GraduationCap, Car, Settings, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Session = {
  id: string
  start_date: string
  end_date: string
  max_seats: number
  seats_booked: number
  instructor_id: string | null
  session_type_id: string | null
  status: 'scheduled' | 'canceled' | 'completed'
  location: string | null
  instructor: { id: string; name: string } | null
  session_type: { id: string; name: string; duration_minutes: number; color: string } | null
}

type FilterTab = 'all' | 'scheduled' | 'completed' | 'canceled'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students' },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions', active: true },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors' },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar' },
  { icon: DollarSign, label: 'Billing', href: '/school-admin/billing' },
  { icon: Settings, label: 'Settings', href: '/school-admin/settings' },
]

const BG = '#0D0D12'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)'
const GLASS_BG = 'rgba(255,255,255,0.03)'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_BLUR = 'blur(24px)'
const TEXT_SECONDARY = '#9CA3AF'
const ACCENT_GREEN = '#4ADE80'
const ACCENT_LAVENDER = '#A78BFA'
const CARD_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
const CARD_SHADOW_HOVER = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'

function borderColor(status: string): string {
  if (status === 'completed') return ACCENT_GREEN
  if (status === 'canceled') return '#F97316'
  return '#78E4FF'
}

function AddSessionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Session) => void }) {
  const [form, setForm] = useState({ start_date: '', instructor_id: '', session_type_id: '', location: '', max_seats: 10 })
  const [instructors, setInstructors] = useState<any[]>([])
  const [sessionTypes, setSessionTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try { const res = await fetch('/api/demo/sessions'); if (res.ok) { const data = await res.json(); setInstructors(data.instructors || []); setSessionTypes(data.sessionTypes || []); return } } catch {}
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
      if (!school) return
      const schoolId = school.id
      const [i, st] = await Promise.all([
        supabase.from('instructors').select('id, name').eq('school_id', schoolId).eq('active', true),
        supabase.from('session_types').select('id, name, duration_minutes').eq('school_id', schoolId).eq('active', true),
      ])
      setInstructors(i.data || []); setSessionTypes(st.data || [])
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    let schoolId: string | null = null
    const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
    if (demoCookie) { try { schoolId = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1]))).schoolId } catch {} }
    if (!schoolId) {
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user!.id).single()
      if (!school) { setLoading(false); return }
      schoolId = school.id
    }
    const { data, error } = await supabase.from('sessions').insert({
      school_id: schoolId, start_date: form.start_date, end_date: form.start_date,
      instructor_id: form.instructor_id || null, session_type_id: form.session_type_id || null,
      location: form.location || '', max_seats: Math.max(1, parseInt(String(form.max_seats)) || 10),
      seats_booked: 0, status: 'scheduled',
    }).select().single()
    if (!error && data) { onAdd(data as Session); onClose() }
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFFFFF',
    outline: 'none', borderRadius: '12px', width: '100%', padding: '12px 16px', fontSize: '14px',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(15,17,23,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '600', color: '#FFFFFF', marginBottom: '24px' }}>Schedule Session</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Date', key: 'start_date', type: 'date', placeholder: '' },
            { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. 123 Main St' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '6px' }}>{label}</label>
              <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} required={key === 'start_date'} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '6px' }}>Instructor</label>
            <select value={form.instructor_id} onChange={e => setForm(f => ({ ...f, instructor_id: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '6px' }}>Session Type</label>
            <select value={form.session_type_id} onChange={e => setForm(f => ({ ...f, session_type_id: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select type</option>
              {sessionTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '6px' }}>Max Seats</label>
            <input type="number" value={form.max_seats} onChange={e => setForm(f => ({ ...f, max_seats: parseInt(e.target.value) || 10 }))} min="1" max="100" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: '#4ADE80', border: 'none', borderRadius: '12px', color: '#000000', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Scheduling...' : 'Schedule Session →'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try { const res = await fetch('/api/demo/sessions'); if (res.ok) { setSessions((await res.json()).sessions || []); setLoading(false); return } } catch {}
        setSessions([]); setLoading(false); return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
      if (!school) { setLoading(false); return }
      const { data } = await supabase.from('sessions').select('*, instructor:instructors(id, name), session_type:session_types(id, name, duration_minutes, color)').eq('school_id', school.id).order('start_date', { ascending: true })
      setSessions((data as Session[]) || []); setLoading(false)
    }
    load()
  }, [])

  async function handleStatusToggle(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'scheduled' ? 'canceled' : 'scheduled'
    await supabase.from('sessions').update({ status: newStatus }).eq('id', id)
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as Session['status'] } : s))
  }

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'scheduled', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'canceled', label: 'Cancelled' },
  ]
  const filteredSessions = activeFilter === 'all' ? sessions : sessions.filter(s => s.status === activeFilter)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: BG_GRADIENT, pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, borderRight: `1px solid ${GLASS_BORDER}`, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto', zIndex: 10 }}>
        <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT_GREEN}, #67E8F9)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car className="w-4 h-4" style={{ color: '#000' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>Driving Center</div>
              <div style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>School Admin</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
              <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', textDecoration: 'none', background: active ? 'rgba(255,255,255,0.06)' : 'transparent', borderLeft: active ? `3px solid ${ACCENT_GREEN}` : '3px solid transparent', boxShadow: active ? `0 0 12px rgba(74,222,128,0.3)` : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <NavIcon className="w-4 h-4" style={{ color: active ? ACCENT_GREEN : TEXT_SECONDARY, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: active ? '600' : '500', color: active ? '#FFFFFF' : TEXT_SECONDARY }}>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${GLASS_BORDER}` }}><p style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>Your Driving School</p></div>
      </aside>

      {/* Mobile nav pills */}
      <nav style={{ display: 'none', padding: '12px 16px', gap: '8px', overflowX: 'auto', borderBottom: `1px solid ${GLASS_BORDER}`, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, position: 'sticky', top: 0, zIndex: 20 }} className="admin-nav-pills">
        {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
          <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px', textDecoration: 'none', background: active ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? ACCENT_GREEN : GLASS_BORDER}`, transition: 'background 0.15s', flexShrink: 0 }}>
            <NavIcon className="w-3.5 h-3.5" style={{ color: active ? ACCENT_GREEN : TEXT_SECONDARY }} />
            <span style={{ fontSize: '12px', fontWeight: active ? '600' : '500', color: active ? ACCENT_GREEN : TEXT_SECONDARY }}>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '220px', padding: '40px 48px', maxWidth: '1100px', position: 'relative', zIndex: 1 }} className="admin-main">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.01em' }}>Sessions</h1>
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>{sessions.length} total</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#4ADE80', border: 'none', borderRadius: '12px', color: '#000000', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 0 16px rgba(74,222,128,0.3)', transition: 'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(74,222,128,0.4)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)' }}>
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>

        {/* Filter Tabs - glass */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          {filterTabs.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveFilter(key)} style={activeFilter === key ? {
              padding: '8px 16px', background: 'rgba(74,222,128,0.15)', color: '#4ADE80',
              border: '1px solid #4ADE80', borderRadius: '999px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            } : {
              padding: '8px 16px', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR,
              color: TEXT_SECONDARY, border: `1px solid ${GLASS_BORDER}`, borderRadius: '999px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Sessions Table */}
        {loading ? (
          <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', overflow: 'hidden', boxShadow: CARD_SHADOW }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 80px', gap: '16px', padding: '12px 24px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
              {['Date', 'Session', 'Details', 'Status', ''].map((_, i) => (<div key={i} style={{ height: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }} />))}
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 80px', gap: '16px', padding: '16px 24px', alignItems: 'center', borderBottom: `1px solid ${GLASS_BORDER}` }}>
                <div><div style={{ height: '11px', width: '30px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', marginBottom: '4px' }} /><div style={{ height: '28px', width: '30px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', marginBottom: '4px' }} /><div style={{ height: '11px', width: '30px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }} /></div>
                <div><div style={{ height: '14px', width: '70%', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', marginBottom: '6px' }} /><div style={{ height: '12px', width: '50%', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}><div style={{ height: '12px', width: '80%', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }} /><div style={{ height: '12px', width: '60%', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }} /></div>
                <div><div style={{ height: '24px', width: '80px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)' }} /></div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} /></div>
              </div>
            ))}
          </div>
        ) : !filteredSessions.length ? (
          <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', textAlign: 'center', padding: '64px', boxShadow: CARD_SHADOW }}>
            <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: TEXT_SECONDARY, opacity: 0.4 }} />
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY, marginBottom: '12px' }}>{activeFilter === 'all' ? 'No sessions yet' : `No ${activeFilter} sessions`}</p>
            {activeFilter === 'all' && <button onClick={() => setShowModal(true)} style={{ fontSize: '14px', fontWeight: '500', color: '#4ADE80', background: 'transparent', border: 'none', cursor: 'pointer' }}>Schedule your first session →</button>}
          </div>
        ) : (
          <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', overflow: 'hidden', boxShadow: CARD_SHADOW }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 80px', gap: '16px', padding: '12px 24px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
              {['Date', 'Session', 'Details', 'Status', ''].map((h, i) => (<div key={i} style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: TEXT_SECONDARY }}>{h}</div>))}
            </div>
            {filteredSessions.map(session => {
              const date = new Date(session.start_date + 'T12:00:00')
              const leftColor = borderColor(session.status)
              return (
                <div key={session.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 80px', gap: '16px', padding: '16px 24px', alignItems: 'center', borderLeft: `3px solid ${leftColor}`, transition: 'background 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: leftColor }}>{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.2 }}>{date.getDate()}</div>
                    <div style={{ fontSize: '11px', color: TEXT_SECONDARY }}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', marginBottom: '2px' }}>{session.session_type?.name || 'Session'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: TEXT_SECONDARY }}>
                      {session.instructor?.name && <span>{session.instructor.name}</span>}
                      {session.location && <><span>·</span><span>{session.location}</span></>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: TEXT_SECONDARY }}><Clock className="w-3 h-3" style={{ color: TEXT_SECONDARY }} />{session.session_type?.duration_minutes || 60} min</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: TEXT_SECONDARY }}><Users className="w-3 h-3" style={{ color: TEXT_SECONDARY }} />{session.seats_booked}/{session.max_seats} seats</div>
                  </div>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: session.status === 'scheduled' ? 'rgba(74,222,128,0.15)' : session.status === 'completed' ? 'rgba(96,165,250,0.15)' : 'rgba(249,115,22,0.15)', color: session.status === 'scheduled' ? '#4ADE80' : session.status === 'completed' ? '#60A5FA' : '#F97316' }}>{session.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => handleStatusToggle(session.id, session.status)} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: TEXT_SECONDARY, display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')} title={session.status === 'scheduled' ? 'Cancel session' : 'Reactivate session'}>
                      {session.status === 'scheduled' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {showModal && <AddSessionModal onClose={() => setShowModal(false)} onAdd={s => setSessions(prev => [s, ...prev])} />}

      <style>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          .admin-main { margin-left: 0 !important; padding: 24px 16px !important; }
          .admin-nav-pills { display: flex !important; }
        }
        @media (min-width: 769px) { .admin-nav-pills { display: none !important; } }
      `}</style>
    </div>
  )
}