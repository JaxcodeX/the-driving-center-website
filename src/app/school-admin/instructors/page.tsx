'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Mail, Shield, Pencil, X, Check, User } from 'lucide-react'
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
  purple:    '#818CF8',
  green:     '#10B981',
  amber:     '#f59e0b',
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

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
    background: T.elevated, border: `1px solid ${T.borderLt}`,
    color: T.text, outline: 'none' as const,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: T.text }}>Invite Instructor</h2>
          <button onClick={onClose} className="p-1" style={{ color: T.muted }}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Matt Reedy" required
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
              onBlur={e => (e.target.style.borderColor = T.borderLt)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="matt@school.com" required
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
              onBlur={e => (e.target.style.borderColor = T.borderLt)} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: T.elevated, color: T.secondary, border: `1px solid ${T.border}` }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: T.grad }}>
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
          <h1 className="text-2xl font-bold mb-1" style={{ color: T.text }}>Instructors</h1>
          <p className="text-sm" style={{ color: T.muted }}>{instructors.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
          style={{ background: T.grad }}>
          <Plus className="w-4 h-4" />
          Invite Instructor
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: T.muted }}>
          <p className="text-sm">Loading...</p>
        </div>
      ) : !instructors.length ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <User className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: T.muted }} />
          <p className="text-sm mb-3" style={{ color: T.muted }}>No instructors yet</p>
          <button onClick={() => setShowModal(true)} className="text-sm font-medium" style={{ color: T.cyan }}>
            Invite your first instructor →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map(instructor => (
            <div
              key={instructor.id}
              className="rounded-2xl p-6"
              style={{ background: T.surface, border: `1px solid ${T.border}` }}
            >
              {/* Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ background: `${T.cyan}15`, color: T.cyan }}
                >
                  {instructor.name?.[0]?.toUpperCase() || 'I'}
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                  style={{
                    background: instructor.status === 'active' ? `${T.green}15` : `${T.amber}15`,
                    color: instructor.status === 'active' ? T.green : T.amber,
                  }}
                >
                  {instructor.status}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: T.text }}>{instructor.name}</h3>
              <div className="flex items-center gap-1.5 text-sm mb-4" style={{ color: T.muted }}>
                <Mail className="w-3.5 h-3.5" />
                {instructor.email}
              </div>
              <div className="flex gap-2">
                {instructor.status === 'pending' && (
                  <div className="text-xs py-1 px-2 rounded-lg" style={{ background: `${T.cyan}15`, color: T.cyan }}>
                    Awaiting response
                  </div>
                )}
                <Link
                  href={`/school-admin/instructors/${instructor.id}/schedule`}
                  className="text-xs py-1 px-2 rounded-lg flex items-center gap-1 transition-colors"
                  style={{ background: T.elevated, color: T.secondary }}
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