'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react'

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

  // Floating label state
  const [emailFocused, setEmailFocused] = useState(false)
  const [demoEmailFocused, setDemoEmailFocused] = useState(false)

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

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
      background: '#0D0D12',
      backgroundImage: `radial-gradient(ellipse at 60% -10%, rgba(255,140,66,0.08) 0%, transparent 50%), radial-gradient(ellipse at 30% 110%, rgba(167,139,250,0.05) 0%, transparent 50%)`,
      padding: '24px',
    }}>
      {/* Card */}
      <div className="login-card" style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)',
        border: '1 solid rgba(255,255,255,0.06)',
        borderTop: '1px solid rgba(255,140,66,0.3)',
        borderRadius: '24px', padding: '40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
      }}>
        {/* Decorative circle behind logo */}
        <div style={{
          position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,66,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <Link href='/' style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          textDecoration: 'none', marginBottom: '40px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: '#FF8C42', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d="M8 2L13 5.5H3L8 2Z" fill='white' />
              <path d="M3 5.5V10.5L8 14V8.5H13V5.5H3Z" fill='white' fillOpacity='0.7' />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>
              The Driving Center
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif' }}>
              School management, simplified.
            </span>
          </div>
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '26px', fontFamily: 'Outfit, sans-serif', fontWeight: '700',
            color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px',
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>
            Sign in to your school dashboard
          </p>
        </div>

        {/* Tabs */}
        {isDemoMode && (
          <div style={{
            display: 'flex', gap: '0', marginBottom: '24px',
            background: 'rgba(255,255,255,0.03)', borderRadius: '10px',
            padding: '4px', border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
          }}>
            {/* Sliding indicator */}
            <div style={{
              position: 'absolute',
              top: '4px',
              left: activeTab === 'magic' ? '4px' : 'calc(50% + 2px)',
              width: 'calc(50% - 4px)',
              height: 'calc(100% - 8px)',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.08)',
              transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
            {(['magic', 'demo'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none',
                  fontSize: '13px', fontWeight: '600', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  background: 'transparent',
                  color: activeTab === tab ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                  transition: 'color 0.2s',
                  position: 'relative', zIndex: 1,
                }}
              >
                {tab === 'magic' ? 'Magic Link' : 'Demo Login'}
              </button>
            ))}
          </div>
        )}

        {/* Magic Link */}
        {(!isDemoMode || activeTab === 'magic') && !sent && (
          <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Floating email label */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '14px',
                top: emailFocused || email ? '12px' : '50%',
                transform: emailFocused || email ? 'none' : 'translateY(-50%)',
                fontSize: emailFocused || email ? '11px' : '14px',
                fontWeight: emailFocused || email ? '600' : '400',
                color: emailFocused ? '#FF8C42' : 'rgba(255,255,255,0.35)',
                fontFamily: 'Inter, sans-serif',
                pointerEvents: 'none',
                transition: 'all 0.2s',
                background: 'transparent',
                padding: '0 2px',
              }}>
                Email address
              </div>
              <Mail size='15' style={{
                position: 'absolute', left: '14px', top: emailFocused || email ? '14px' : '50%',
                transform: emailFocused || email ? 'none' : 'translateY(-50%)',
                color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
                transition: 'all 0.2s',
              }} />
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete='email'
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={{
                  width: '100%', height: '52px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${emailFocused ? '#FF8C42' : 'rgba(255,255,255,0.1)'}`,
                  color: '#FFFFFF', fontSize: '14px', fontFamily: 'Inter, sans-serif',
                  paddingLeft: '42px', paddingRight: '16px', outline: 'none',
                  transition: 'border-color 0.2s',
                  paddingTop: emailFocused || email ? '14px' : '0',
                }}
              />
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#EF4444', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>{error}</p>
            )}

            <button
              type='submit'
              disabled={loading}
              className='login-btn'
              style={{
                width: '100%', height: '52px', borderRadius: '12px',
                background: '#FF8C42', color: '#FFFFFF',
                fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.6 : 1, transition: 'box-shadow 0.2s, opacity 0.2s',
              }}
              onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(255,140,66,0.35)' } }
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.boxShadow = 'none' }}
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
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              position: 'relative',
            }}>
              <CheckCircle size='30' style={{ color: '#4ADE80' }} />
              {/* Animated ring */}
              <div style={{
                position: 'absolute', inset: '-4px', borderRadius: '50%',
                border: '1px solid rgba(74,222,128,0.2)',
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
              }} />
            </div>
            <h2 style={{
              fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: '600',
              color: '#FFFFFF', marginBottom: '10px',
            }}>
              Check your inbox
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>
              We sent a magic link to{' '}
              <span style={{ color: '#FFFFFF', fontWeight: '600' }}>{email}</span>
              <br />Click it to sign in.
            </p>
          </div>
        )}

        {/* Demo Login */}
        {isDemoMode && activeTab === 'demo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Subtle demo mode pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 10px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              width: 'fit-content',
            }}>
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: 'rgba(255,140,66,0.6)',
              }} />
              <span style={{
                fontSize: '11px', fontWeight: '500',
                color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif',
              }}>
                Demo mode
              </span>
            </div>

            <form onSubmit={handleDemoLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Floating email label */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px',
                  top: demoEmailFocused || demoEmail ? '12px' : '50%',
                  transform: demoEmailFocused || demoEmail ? 'none' : 'translateY(-50%)',
                  fontSize: demoEmailFocused || demoEmail ? '11px' : '14px',
                  fontWeight: demoEmailFocused || demoEmail ? '600' : '400',
                  color: demoEmailFocused ? '#FF8C42' : 'rgba(255,255,255,0.35)',
                  fontFamily: 'Inter, sans-serif',
                  pointerEvents: 'none',
                  transition: 'all 0.2s',
                  background: 'transparent',
                  padding: '0 2px',
                }}>
                  School owner email
                </div>
                <Mail size='15' style={{
                  position: 'absolute', left: '14px', top: demoEmailFocused || demoEmail ? '14px' : '50%',
                  transform: demoEmailFocused || demoEmail ? 'none' : 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
                  transition: 'all 0.2s',
                }} />
                <input
                  type='email'
                  value={demoEmail}
                  onChange={e => setDemoEmail(e.target.value)}
                  required
                  onFocus={() => setDemoEmailFocused(true)}
                  onBlur={() => setDemoEmailFocused(false)}
                  style={{
                    width: '100%', height: '52px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${demoEmailFocused ? '#FF8C42' : 'rgba(255,255,255,0.1)'}`,
                    color: '#FFFFFF', fontSize: '14px', fontFamily: 'Inter, sans-serif',
                    paddingLeft: '42px', paddingRight: '16px', outline: 'none',
                    transition: 'border-color 0.2s',
                    paddingTop: demoEmailFocused || demoEmail ? '14px' : '0',
                  }}
                />
              </div>

              {/* PIN field */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px',
                  top: demoPin ? '12px' : '50%',
                  transform: demoPin ? 'none' : 'translateY(-50%)',
                  fontSize: '11px', fontWeight: '600',
                  color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter, sans-serif',
                  pointerEvents: 'none',
                  transition: 'all 0.2s',
                  background: 'transparent',
                  padding: '0 2px',
                }}>
                  Demo PIN
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={demoPin}
                  maxLength={4}
                  onChange={e => setDemoPin(e.target.value)}
                  required
                  style={{
                    width: '100%', height: '52px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#FFFFFF', fontSize: '16px', fontWeight: '600', fontFamily: 'Inter, sans-serif',
                    textAlign: 'center', letterSpacing: '0.3em',
                    paddingLeft: '16px', paddingRight: '48px', outline: 'none',
                    transition: 'border-color 0.2s',
                    paddingTop: demoPin ? '14px' : '0',
                  }}
                />
                <button
                  type='button'
                  onClick={() => setShowPin(!showPin)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)',
                    padding: '4px',
                  }}
                >
                  {showPin ? <EyeOff size='15' /> : <Eye size='15' />}
                </button>
              </div>

              {demoError && (
                <p style={{ fontSize: '13px', color: '#EF4444', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>{demoError}</p>
              )}

              <button
                type='submit'
                disabled={demoLoading}
                className='login-btn'
                style={{
                  width: '100%', height: '52px', borderRadius: '12px',
                  background: '#FF8C42', color: '#FFFFFF',
                  fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif',
                  border: 'none', cursor: demoLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: demoLoading ? 0.6 : 1, transition: 'box-shadow 0.2s, opacity 0.2s',
                }}
                onMouseEnter={e => { if (!demoLoading) (e.target as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(255,140,66,0.35)' } }
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.boxShadow = 'none' }}
              >
                {demoLoading ? 'Signing in...' : 'Demo Login'}
                {!demoLoading && <ArrowRight size='15' />}
              </button>
            </form>
          </div>
        )}

        {/* Sign up link */}
        <div style={{
          marginTop: '28px',
          padding: '10px 16px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif',
          }}>
            Don&apos;t have an account?{' '}
            <Link href='/signup' style={{ color: '#FF8C42', fontWeight: '600', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .login-btn:not(:disabled):hover {
          box-shadow: 0 4px 16px rgba(255,140,66,0.35);
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 24px 16px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
