'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, AlertCircle, User, Mail, Lock } from 'lucide-react'

const STEPS = ['Account', 'School', 'Ready']

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ schoolName: '', ownerName: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      router.push(`/onboarding?school=${data.slug}`)
    } catch {
      setError('Network error — try again')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050505', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glows — swapped sides from login */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(45,27,78,0.6) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(26,26,59,0.6) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <Link href='/' style={{
        position: 'fixed', top: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
            <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
          </svg>
        </div>
        <span style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>The Driving Center</span>
      </Link>

      {/* Main card */}
      <div style={{
        width: '100%', maxWidth: '440px', margin: '0 24px',
        background: '#0F1117', border: '1px solid #1A1A1A',
        borderRadius: '20px', padding: '40px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div
                  style={{
                    width: '40px', height: '1px', margin: '0 8px',
                    background: i <= 0 ? '#1A1A1A' : '#4ADE80',
                  }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700',
                    background: i === 0 ? '#4ADE80' : '#0D0D0D',
                    color: i === 0 ? '#000000' : '#6B7280',
                    border: i === 0 ? 'none' : '1px solid #1A1A1A',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {i + 1}
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: '600', textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: i === 0 ? '#9CA3AF' : '#6B7280',
                }}>
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '28px', fontFamily: "'Outfit', sans-serif", fontWeight: '700',
            color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '8px',
          }}>
            Create your school account
          </h1>
          <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: '1.5' }}>
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Full name */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: '#6B7280',
            }}>
              <User size={16} />
            </div>
            <input
              type='text'
              value={form.ownerName}
              onChange={e => set('ownerName', e.target.value)}
              placeholder='Your full name'
              required
              style={{
                width: '100%', height: '50px', borderRadius: '12px',
                background: '#0D0D0D', border: '1px solid #1A1A1A',
                color: '#FFFFFF', fontSize: '15px', fontFamily: "'Inter', sans-serif",
                paddingLeft: '44px', paddingRight: '16px', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
            />
          </div>

          {/* School name */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: '#6B7280', display: 'flex', alignItems: 'center',
            }}>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='currentColor' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='currentColor' fillOpacity='0.7' />
              </svg>
            </div>
            <input
              type='text'
              value={form.schoolName}
              onChange={e => set('schoolName', e.target.value)}
              placeholder='Driving school name'
              required
              style={{
                width: '100%', height: '50px', borderRadius: '12px',
                background: '#0D0D0D', border: '1px solid #1A1A1A',
                color: '#FFFFFF', fontSize: '15px', fontFamily: "'Inter', sans-serif",
                paddingLeft: '44px', paddingRight: '16px', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
            />
          </div>

          {/* Email */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: '#6B7280',
            }}>
              <Mail size={16} />
            </div>
            <input
              type='email'
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder='you@yourdrivingschool.com'
              required
              style={{
                width: '100%', height: '50px', borderRadius: '12px',
                background: '#0D0D0D', border: '1px solid #1A1A1A',
                color: '#FFFFFF', fontSize: '15px', fontFamily: "'Inter', sans-serif",
                paddingLeft: '44px', paddingRight: '16px', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
            />
          </div>

          {/* Password (optional) */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: '#6B7280',
            }}>
              <Lock size={16} />
            </div>
            <input
              type='password'
              placeholder='Create a password (optional)'
              style={{
                width: '100%', height: '50px', borderRadius: '12px',
                background: '#0D0D0D', border: '1px solid #1A1A1A',
                color: '#FFFFFF', fontSize: '15px', fontFamily: "'Inter', sans-serif",
                paddingLeft: '44px', paddingRight: '16px', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
            />
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              padding: '12px', borderRadius: '10px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <AlertCircle size={16} style={{ color: '#EF4444', marginTop: '1px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#EF4444', lineHeight: '1.5' }}>{error}</span>
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            style={{
              width: '100%', height: '50px', borderRadius: '12px',
              background: '#FFFFFF', color: '#000000',
              fontSize: '14px', fontWeight: '700', fontFamily: "'Inter', sans-serif",
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
          >
            {loading ? 'Creating school...' : 'Create school account'}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>
      </div>

      {/* Sign in link */}
      <p style={{
        position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        fontSize: '14px', color: '#6B7280',
      }}>
        Already have an account?{' '}
        <Link href='/login' style={{ color: '#4ADE80', fontWeight: '600', textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
