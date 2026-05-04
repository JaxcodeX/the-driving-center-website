'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'magic' | 'demo'>('magic')
  const [demoEmail, setDemoEmail] = useState('')
  const [demoPin, setDemoPin] = useState('0000')
  const [showPin, setShowPin] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoError, setDemoError] = useState('')

  useEffect(() => {
    fetch('/api/schools').then(r => r.json()).then(d => {
      if (d.DEMO_MODE) setIsDemoMode(true)
    }).catch(() => {})
  }, [])

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  async function handleDemoLogin(e: React.FormEvent) {
    e.preventDefault()
    setDemoLoading(true)
    setDemoError('')
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, pin: demoPin }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDemoError(data.error || 'Login failed')
        setDemoLoading(false)
        return
      }
      window.location.href = '/school-admin'
    } catch {
      setDemoError('Network error — try again')
      setDemoLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050505', padding: '24px',
    }}>
      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#0F1117', border: '1px solid #1A1A1A',
        borderRadius: '20px', padding: '40px',
      }}>
        {/* Logo */}
        <Link href='/' style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          textDecoration: 'none', marginBottom: '36px',
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
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>
            The Driving Center
          </span>
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '24px', fontFamily: 'Outfit, sans-serif', fontWeight: '700',
            color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px',
          }}>
            Sign in
          </h1>
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
            to your school dashboard
          </p>
        </div>

        {/* Tabs */}
        {isDemoMode && (
          <div style={{
            display: 'flex', gap: '0', marginBottom: '24px',
            background: '#0D0D0D', borderRadius: '10px',
            padding: '4px', border: '1px solid #1A1A1A',
          }}>
            {(['magic', 'demo'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  background: activeTab === tab ? '#1A1A1A' : 'transparent',
                  color: activeTab === tab ? '#FFFFFF' : '#6B7280',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'magic' ? 'Magic Link' : 'Demo Login'}
              </button>
            ))}
          </div>
        )}

        {/* Magic Link */}
        {(!isDemoMode || activeTab === 'magic') && !sent && (
          <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: '500',
                color: '#9CA3AF', marginBottom: '8px',
              }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size='15' style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none',
                }} />
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='you@yourdrivingschool.com'
                  required
                  autoComplete='email'
                  style={{
                    width: '100%', height: '48px', borderRadius: '12px',
                    background: '#0D0D0D', border: '1px solid #1A1A1A',
                    color: '#FFFFFF', fontSize: '14px',
                    paddingLeft: '42px', paddingRight: '16px', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                  onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
                />
              </div>
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#EF4444', textAlign: 'center' }}>{error}</p>
            )}

            <button
              type='submit'
              disabled={loading}
              style={{
                width: '100%', height: '48px', borderRadius: '12px',
                background: '#FFFFFF', color: '#000000',
                fontSize: '14px', fontWeight: '700',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Sending link...' : 'Continue'}
              {!loading && <ArrowRight size='15' />}
            </button>
          </form>
        )}

        {/* Success */}
        {(!isDemoMode || activeTab === 'magic') && sent && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle size='28' style={{ color: '#4ADE80' }} />
            </div>
            <h2 style={{
              fontSize: '18px', fontFamily: 'Outfit, sans-serif', fontWeight: '600',
              color: '#FFFFFF', marginBottom: '8px',
            }}>
              Check your inbox
            </h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.6' }}>
              We sent a magic link to{' '}
              <span style={{ color: '#FFFFFF', fontWeight: '600' }}>{email}</span>
              <br />Click it to sign in.
            </p>
          </div>
        )}

        {/* Demo Login */}
        {isDemoMode && activeTab === 'demo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '8px',
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.15)',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#4ADE80',
              }} />
              <span style={{
                fontSize: '11px', fontWeight: '600', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: '#4ADE80',
              }}>
                Demo Mode — PIN is 0000
              </span>
            </div>

            <form onSubmit={handleDemoLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{
                  display: 'block', fontSize: '13px', fontWeight: '500',
                  color: '#9CA3AF', marginBottom: '8px',
                }}>
                  School owner email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size='15' style={{
                    position: 'absolute', left: '14px', top: '50%',
                    transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none',
                  }} />
                  <input
                    type='email'
                    value={demoEmail}
                    onChange={e => setDemoEmail(e.target.value)}
                    placeholder='any@email.com'
                    required
                    style={{
                      width: '100%', height: '48px', borderRadius: '12px',
                      background: '#0D0D0D', border: '1px solid #1A1A1A',
                      color: '#FFFFFF', fontSize: '14px',
                      paddingLeft: '42px', paddingRight: '16px', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                    onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: '13px', fontWeight: '500',
                  color: '#9CA3AF', marginBottom: '8px',
                }}>
                  Demo PIN
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={demoPin}
                    maxLength={4}
                    onChange={e => setDemoPin(e.target.value)}
                    placeholder='0000'
                    required
                    style={{
                      width: '100%', height: '48px', borderRadius: '12px',
                      background: '#0D0D0D', border: '1px solid #1A1A1A',
                      color: '#FFFFFF', fontSize: '16px', fontWeight: '600',
                      textAlign: 'center', letterSpacing: '0.3em',
                      paddingLeft: '16px', paddingRight: '44px', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                    onBlur={e => (e.target.style.borderColor = '#1A1A1A')}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPin(!showPin)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', color: '#6B7280',
                      fontSize: '11px', fontWeight: '600',
                    }}
                  >
                    {showPin ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              {demoError && (
                <p style={{ fontSize: '13px', color: '#EF4444', textAlign: 'center' }}>{demoError}</p>
              )}

              <button
                type='submit'
                disabled={demoLoading}
                style={{
                  width: '100%', height: '48px', borderRadius: '12px',
                  background: '#4ADE80', color: '#000000',
                  fontSize: '14px', fontWeight: '700',
                  border: 'none', cursor: demoLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: demoLoading ? 0.6 : 1, transition: 'opacity 0.2s',
                }}
              >
                {demoLoading ? 'Signing in...' : 'Demo Login'}
                {!demoLoading && <ArrowRight size='15' />}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Sign up link */}
      <p style={{
        position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
        fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap',
      }}>
        Don&apos;t have an account?{' '}
        <Link href='/signup' style={{ color: '#4ADE80', fontWeight: '600', textDecoration: 'none' }}>
          Sign up
        </Link>
      </p>
    </div>
  )
}
