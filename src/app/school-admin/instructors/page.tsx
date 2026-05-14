'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Mail, Shield, Pencil, X, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (name: string, email: string) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    onInvite(name, email)
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFFFFF', outline: 'none', borderRadius: '12px', width: '100%', padding: '12px 16px', fontSize: '14px' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(15,17,23,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: '600', color: '#FFFFFF' }}>Invite Instructor</h2>
          <button onClick={onClose} style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280', borderRadius: '6px', display: 'flex', alignItems: 'center' }}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '6px' }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Matt Reedy" required style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="matt@school.com" required style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: '#4ADE80', border: 'none', borderRadius: '12px', color: '#000000', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>{loading ? 'Sending...' : 'Send Invite →'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// NAV_ITEMS removed — layout provides the sidebar

const BG = 'var(--admin-bg)'
const BG_GRADIENT = 'var(--mesh-subtle)'
const GLASS_BG = 'var(--glass-bg)'
const GLASS_BORDER = 'var(--glass-border)'
const GLASS_BLUR = 'var(--glass-blur)'
const TEXT_SECONDARY = 'var(--admin-text-secondary)'
const ACCENT_GREEN = 'var(--admin-accent)'
const CARD_SHADOW = 'var(--glass-shadow)'
const CARD_SHADOW_HOVER = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--admin-accent), inset 0 1px 0 rgba(255,255,255,0.08)'

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [schoolId, setSchoolId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      let sid: string | null = null
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try { sid = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1]))).schoolId } catch {}
        if (sid) {
          setSchoolId(sid)
          try {
            const res = await fetch('/api/instructors?school_id=' + encodeURIComponent(sid))
            if (res.ok) { setInstructors(await res.json()); setLoading(false); return }
          } catch {}
        }
      }
      const supabase = (await import('@/lib/supabase/client')).createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: school } = await supabase.from('schools').select('id').eq('owner_email', user.email).single()
      if (!school) { setLoading(false); return }
      sid = school.id
      setSchoolId(sid)
      try {
        const res = await fetch('/api/instructors?school_id=' + encodeURIComponent(sid || ''), {
          headers: { 'x-school-id': sid || '' },
        })
        if (res.ok) { setInstructors(await res.json()); setLoading(false); return }
      } catch {}
      setInstructors([]); setLoading(false)
    }
    load()
  }, [])

  async function handleInvite(name: string, email: string) {
    if (!schoolId) return
    try {
      const res = await fetch('/api/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
        body: JSON.stringify({ name, email }),
      })
      const instructor = await res.json()
      if (res.ok && instructor) {
        await fetch('/api/instructors/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
          body: JSON.stringify({ instructorId: instructor.id }),
        })
        setInstructors(prev => [{ ...instructor, active: false, status: 'pending' }, ...prev])
        setShowModal(false)
      }
    } catch {}
  }

  return (
    <>
      <div className="admin-main">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.01em' }}>Instructors</h1>
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>{instructors.length} total</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#4ADE80', border: 'none', borderRadius: '12px', color: '#000000', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 0 16px rgba(74,222,128,0.3)', transition: 'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(74,222,128,0.4)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)' }}>
            <Plus className="w-4 h-4" />
            Invite Instructor
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', padding: '24px', boxShadow: CARD_SHADOW }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ height: '24px', width: '60px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)' }} />
                </div>
                <div style={{ height: '16px', width: '60%', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', marginBottom: '8px' }} />
                <div style={{ height: '13px', width: '80%', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', marginBottom: '16px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ height: '28px', width: '90px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ height: '28px', width: '80px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : !instructors.length ? (
          <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', textAlign: 'center', padding: '64px', boxShadow: CARD_SHADOW }}>
            <User className="w-10 h-10 mx-auto mb-3" style={{ color: TEXT_SECONDARY, opacity: 0.4 }} />
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY, marginBottom: '12px' }}>No instructors yet</p>
            <button onClick={() => setShowModal(true)} style={{ fontSize: '14px', fontWeight: '500', color: '#4ADE80', background: 'transparent', border: 'none', cursor: 'pointer' }}>Invite your first instructor →</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {instructors.map(instructor => (
              <div key={instructor.id} style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', padding: '24px', boxShadow: CARD_SHADOW, transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW_HOVER }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>{instructor.name?.[0]?.toUpperCase() || 'I'}</div>
                  <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '999px', fontWeight: '600', background: instructor.active ? 'rgba(74,222,128,0.15)' : 'rgba(249,115,22,0.15)', color: instructor.active ? '#4ADE80' : '#F97316' }}>{instructor.active ? 'Active' : instructor.status === 'pending' ? 'Pending' : 'Inactive'}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '8px' }}>{instructor.name}</h3>
                <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: TEXT_SECONDARY, marginBottom: '16px' }}>
                  <Mail className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />{instructor.email}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {instructor.status === 'pending' && (<div style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px', background: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontWeight: '500' }}>Awaiting response</div>)}
                  <Link href={`/school-admin/instructors/${instructor.id}/schedule`} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', background: GLASS_BG, backdropFilter: GLASS_BLUR, color: TEXT_SECONDARY, textDecoration: 'none', transition: 'background 0.15s', border: `1px solid ${GLASS_BORDER}` }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = GLASS_BG)}>
                    <Shield className="w-3 h-3" />Set schedule
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <InviteModal onClose={() => setShowModal(false)} onInvite={handleInvite} />}
    </>
  )
}