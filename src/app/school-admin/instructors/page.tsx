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
        maxWidth: '420px',
        background: '#0F1117',
        border: '1px solid #1A1A1A',
        borderRadius: '16px',
        padding: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '18px',
            fontWeight: '600',
            color: '#FFFFFF',
          }}>
            Invite Instructor
          </h2>
          <button onClick={onClose} style={{
            padding: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              marginBottom: '6px',
            }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Matt Reedy"
              required
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#9CA3AF',
              marginBottom: '6px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="matt@school.com"
              required
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
            />
          </div>
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
              }}
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
              {loading ? 'Sending...' : 'Send Invite →'}
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

      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const payload = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1])))
          schoolId = payload.schoolId
        } catch {}
      }

      if (!schoolId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = '/login'; return }
        const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
        if (!school) { setLoading(false); return }
        schoolId = school.id
      }

      const { data } = await supabase
        .from('instructors')
        .select('id, name, email, phone, active, status')
        .eq('school_id', schoolId)
      setInstructors((data as any[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleInvite(name: string, email: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
    if (!school) return

    const { data: instructor } = await supabase
      .from('instructors')
      .insert({ school_id: school.id, name, email, status: 'pending', active: false })
      .select()
      .single()

    if (instructor) {
      setInstructors(prev => [instructor, ...prev])
      setShowModal(false)
    }
  }

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
            Instructors
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>
            {instructors.length} total
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
          Invite Instructor
        </button>
      </div>

      {loading ? (
        <div style={{
          background: '#0F1117',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          textAlign: 'center',
          padding: '64px',
          color: '#6B7280',
        }}>
          <p style={{ fontSize: '14px' }}>Loading...</p>
        </div>
      ) : !instructors.length ? (
        <div style={{
          background: '#0F1117',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          textAlign: 'center',
          padding: '64px',
        }}>
          <User className="w-10 h-10 mx-auto mb-3" style={{ color: '#6B7280', opacity: 0.3 }} />
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>No instructors yet</p>
          <button onClick={() => setShowModal(true)} style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#4ADE80',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}>
            Invite your first instructor →
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {instructors.map(instructor => (
            <div
              key={instructor.id}
              style={{
                background: '#0F1117',
                border: '1px solid #1A1A1A',
                borderRadius: '16px',
                padding: '24px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0F1117')}
            >
              {/* Avatar + status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(74,222,128,0.15)',
                  color: '#4ADE80',
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Outfit, sans-serif',
                }}>
                  {instructor.name?.[0]?.toUpperCase() || 'I'}
                </div>
                <span style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontWeight: '600',
                  background: instructor.active ? 'rgba(74,222,128,0.15)' : 'rgba(249,115,22,0.15)',
                  color: instructor.active ? '#4ADE80' : '#F97316',
                }}>
                  {instructor.active ? 'Active' : instructor.status === 'pending' ? 'Pending' : 'Inactive'}
                </span>
              </div>

              {/* Name + email */}
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF',
                marginBottom: '8px',
              }}>
                {instructor.name}
              </h3>
              <div style={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#6B7280',
                marginBottom: '16px',
              }}>
                <Mail className="w-3.5 h-3.5" />
                {instructor.email}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {instructor.status === 'pending' && (
                  <div style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(74,222,128,0.15)',
                    color: '#4ADE80',
                    fontWeight: '500',
                  }}>
                    Awaiting response
                  </div>
                )}
                <Link
                  href={`/school-admin/instructors/${instructor.id}/schedule`}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#0A0A0B',
                    color: '#9CA3AF',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                    border: '1px solid #1A1A1A',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0A0A0B')}
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
