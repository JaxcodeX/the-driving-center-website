'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Mail, Shield, Pencil, X, Check, User } from 'lucide-react'
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

  const inputStyle = {
    background: 'var(--bg-elevated)', border: `1px solid var(--card-border)`,
    color: 'var(--text-primary)', outline: 'none' as const,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: 'var(--bg-surface)', border: `1px solid var(--card-border)` }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Invite Instructor</h2>
          <button onClick={onClose} className="p-1" style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Matt Reedy" required
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = `rgba(56,189,248,0.6)`)}
              onBlur={e => (e.target.style.borderColor = 'var(--card-border)')} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="matt@school.com" required
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = `rgba(56,189,248,0.6)`)}
              onBlur={e => (e.target.style.borderColor = 'var(--card-border)')} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: `1px solid var(--card-border)` }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)' }}>
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

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
        .from('instructors')
        .select('id, name, email, phone, active')
        .eq('school_id', schoolId)
      setInstructors((data as any[]) || [])
      setLoading(false)
    }
    load()
  }, [])


  async function handleInvite(name: string, email: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user!.id).single()

    const { data: instructor } = await supabase
      .from('instructors')
      .insert({ school_id: school!.id, name, email, status: 'pending' })
      .select()
      .single()

    if (instructor) {
      setInstructors(prev => [instructor, ...prev])
      setShowModal(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Instructors</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{instructors.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
          style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)' }}>
          <Plus className="w-4 h-4" />
          Invite Instructor
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm">Loading...</p>
        </div>
      ) : !instructors.length ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--bg-surface)', border: `1px solid var(--card-border)` }}>
          <User className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>No instructors yet</p>
          <button onClick={() => setShowModal(true)} className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            Invite your first instructor →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map(instructor => (
            <div
              key={instructor.id}
              className="rounded-2xl p-6"
              style={{ background: 'var(--bg-surface)', border: `1px solid var(--card-border)` }}
            >
              {/* Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ background: `rgba(56,189,248,0.15)`, color: '#38BDF8' }}
                >
                  {instructor.name?.[0]?.toUpperCase() || 'I'}
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                  style={{
                    background: instructor.status === 'active' ? `rgba(74,222,128,0.15)` : `rgba(245,158,11,0.15)`,
                    color: instructor.status === 'active' ? 'var(--success)' : '#f59e0b',
                  }}
                >
                  {instructor.status}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{instructor.name}</h3>
              <div className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                <Mail className="w-3.5 h-3.5" />
                {instructor.email}
              </div>
              <div className="flex gap-2">
                {instructor.status === 'pending' && (
                  <div className="text-xs py-1 px-2 rounded-lg" style={{ background: `rgba(56,189,248,0.15)`, color: '#38BDF8' }}>
                    Awaiting response
                  </div>
                )}
                <Link
                  href={`/school-admin/instructors/${instructor.id}/schedule`}
                  className="text-xs py-1 px-2 rounded-lg flex items-center gap-1 transition-colors"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                >
                  <Shield className="w-3 h-3" />
                  Set schedule
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <InviteModal onClose={() => setShowModal(false)} onInvite={handleInvite} />}
    </div>
  )
}
