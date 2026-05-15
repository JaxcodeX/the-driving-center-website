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
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'magic' | 'password' | 'demo'>('magic')
  const [demoEmail, setDemoEmail] = useState('')
  const [demoPin, setDemoPin] = useState('0000')
  const [showPin, setShowPin] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoError, setDemoError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  // Input focus states
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
    // Check for signup success redirect
    const params = new URLSearchParams(window.location.search)
    if (params.get('signup') === 'success') {
      const signupEmail = params.get('email')
      setSignupSuccess(signupEmail || 'Account created!')
      if (signupEmail) setEmail(signupEmail)
    }
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

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setPasswordError(error.message)
    } else {
      window.location.href = '/school-admin'
    }
    setPasswordLoading(false)
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
    <div className="login-bg">
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 1,
      }} className="mobile-auth-shell">
        {/* Glassmorphic Modal */}
        <div className="login-modal login-modal-mobile mobile-auth-card" style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          animation: 'fadeInUp 0.5s ease-out',
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link href='/' style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              textDecoration: 'none',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width='20' height='20' viewBox='0 0 16 16' fill='none'>
                  <path d="M8 2L13 5.5H3L8 2Z" fill='white' />
                  <path d="M3 5.5V10.5L8 14V8.5H13V5.5H3Z" fill='white' fillOpacity='0.7' />
                </svg>
              </div>
              <span style={{
                fontSize: '17px', fontWeight: '700', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif',
              }}>
                The Driving Center
              </span>
            </Link>
          </div>

          {/* Signup success banner */}
          {signupSuccess && (
            <div style={{
              marginBottom: '20px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(74,222,128,0.10)',
              border: '1px solid rgba(74,222,128,0.25)',
              textAlign: 'center',
            }}>
              <CheckCircle size="20" style={{ color: '#4ADE80', marginBottom: '6px' }} />
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#4ADE80', marginBottom: '2px', fontFamily: 'Inter, sans-serif' }}>
                Account created successfully!
              </p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                {typeof signupSuccess === 'string' && signupSuccess.includes('@')
                  ? `Enter the magic link sent to ${signupSuccess}`
                  : 'Check your email for a sign-in link.'}
              </p>
            </div>
          )}

          {/* Headline */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{
              fontSize: '26px', fontFamily: 'Inter, sans-serif', fontWeight: '700',
              color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px',
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
              Sign in to your school dashboard
            </p>
          </div>

          {/* Tabs */}
          <div style={{
              display: 'flex', gap: '0', marginBottom: '24px',
              background: 'rgba(255,255,255,0.05)', borderRadius: '999px',
              padding: '4px',
              position: 'relative',
            }} className="mobile-auth-tabs" data-demo={isDemoMode ? 'true' : 'false'}>
              <div style={{
                position: 'absolute',
                top: '4px',
                left: activeTab === 'magic'
                  ? '4px'
                  : activeTab === 'password'
                    ? 'calc(33.33% + 2px)'
                    : 'calc(66.66% + 2px)',
                width: isDemoMode ? 'calc(33.33% - 4px)' : 'calc(50% - 4px)',
                height: 'calc(100% - 8px)',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.10)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
              {(isDemoMode ? ['magic', 'password', 'demo'] : ['magic', 'password']).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'magic' | 'password' | 'demo')}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: '999px', border: 'none',
                    fontSize: '13px', fontWeight: '600', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    background: 'transparent',
                    color: activeTab === tab ? '#FFFFFF' : '#9CA3AF',
                    transition: 'color 0.2s',
                    position: 'relative', zIndex: 1,
                  }}
                  className="mobile-auth-tab"
                >
                  {tab === 'magic' ? 'Magic Link' : tab === 'password' ? 'Password' : 'Demo Login'}
                </button>
              ))}
            </div>

          {/* Magic Link Form */}
          {activeTab === 'magic' && !sent && (
            <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email input — pill-shaped */}
              <div style={{ position: 'relative' }}>
                <Mail size='15' style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: emailFocused ? 'var(--accent)' : '#9CA3AF',
                  pointerEvents: 'none',
                  transition: 'color 0.2s',
                  zIndex: 1,
                }} />
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete='email'
                  placeholder="Email address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="admin-input"
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '16px',
                    height: '52px',
                    borderRadius: '999px',
                    border: emailFocused ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: emailFocused ? '0 0 0 3px var(--accent-glow)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontSize: '14px',
                  }}
                />
              </div>

              {error && (
                <p style={{ fontSize: '13px', color: '#EF4444', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>{error}</p>
              )}

              <button
                type='submit'
                disabled={loading}
                className="login-btn-primary"
                style={{
                  height: '52px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Sending link...' : 'Continue'}
                {!loading && <ArrowRight size='15' />}
              </button>
            </form>
          )}

          {/* Success State */}
          {activeTab === 'magic' && sent && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(74,222,128,0.10)',
                border: '1px solid rgba(74,222,128,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                position: 'relative',
              }}>
                <CheckCircle size='30' style={{ color: '#4ADE80' }} />
                <div style={{
                  position: 'absolute', inset: '-4px', borderRadius: '50%',
                  border: '1px solid rgba(74,222,128,0.20)',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                }} />
              </div>
              <h2 style={{
                fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: '600',
                color: '#FFFFFF', marginBottom: '10px',
              }}>
                Check your inbox
              </h2>
              <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>
                We sent a magic link to{' '}
                <span style={{ color: '#FFFFFF', fontWeight: '600' }}>{email}</span>
                <br />Click it to sign in.
              </p>
            </div>
          )}

          {/* Password Form */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email input */}
              <div style={{ position: 'relative' }}>
                <Mail size='15' style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: emailFocused ? 'var(--accent)' : '#9CA3AF',
                  pointerEvents: 'none',
                  transition: 'color 0.2s',
                  zIndex: 1,
                }} />
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete='email'
                  placeholder="Email address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="admin-input"
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '16px',
                    height: '52px',
                    borderRadius: '999px',
                    border: emailFocused ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: emailFocused ? '0 0 0 3px var(--accent-glow)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Password input */}
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete='current-password'
                  placeholder="Password"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="admin-input"
                  style={{
                    paddingLeft: '16px',
                    paddingRight: '48px',
                    height: '52px',
                    borderRadius: '999px',
                    border: passwordFocused ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: passwordFocused ? '0 0 0 3px var(--accent-glow)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontSize: '14px',
                  }}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '16px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer',
                    color: passwordFocused ? 'var(--accent)' : '#9CA3AF',
                    padding: '4px',
                    transition: 'color 0.2s',
                  }}
                >
                  {showPassword ? <EyeOff size='15' /> : <Eye size='15' />}
                </button>
              </div>

              {passwordError && (
                <p style={{ fontSize: '13px', color: '#EF4444', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>{passwordError}</p>
              )}

              <button
                type='submit'
                disabled={passwordLoading}
                className="login-btn-primary"
                style={{
                  height: '52px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: passwordLoading ? 0.6 : 1,
                }}
              >
                {passwordLoading ? 'Signing in...' : 'Sign In'}
                {!passwordLoading && <ArrowRight size='15' />}
              </button>
            </form>
          )}

          {/* Demo Login Form */}
          {isDemoMode && activeTab === 'demo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <form onSubmit={handleDemoLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Floating email label */}
                <div style={{ position: 'relative' }}>
                  <label style={{
                    position: 'absolute', left: '16px',
                    top: demoEmailFocused || demoEmail ? '10px' : '50%',
                    transform: demoEmailFocused || demoEmail ? 'none' : 'translateY(-50%)',
                    fontSize: demoEmailFocused || demoEmail ? '11px' : '14px',
                    fontWeight: demoEmailFocused || demoEmail ? '600' : '400',
                    color: demoEmailFocused ? 'var(--accent)' : '#9CA3AF',
                    fontFamily: 'Inter, sans-serif',
                    pointerEvents: 'none',
                    transition: 'all 0.2s',
                    background: demoEmailFocused || demoEmail ? 'var(--bg-surface)' : 'transparent',
                    padding: demoEmailFocused || demoEmail ? '0 4px' : '0',
                  }}>
                    School owner email
                  </label>
                  <Mail size='15' style={{
                    position: 'absolute', left: '16px', top: demoEmailFocused || demoEmail ? '14px' : '50%',
                    transform: demoEmailFocused || demoEmail ? 'none' : 'translateY(-50%)',
                    color: demoEmailFocused ? 'var(--accent)' : '#9CA3AF',
                    pointerEvents: 'none',
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
                      width: '100%', height: '52px', borderRadius: '999px',
                      background: 'var(--bg-elevated)',
                      border: `1px solid ${demoEmailFocused ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                      color: '#FFFFFF', fontSize: '14px', fontFamily: 'Inter, sans-serif',
                      paddingLeft: '44px', paddingRight: '16px', outline: 'none',
                      boxShadow: demoEmailFocused ? '0 0 0 3px var(--accent-glow)' : 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      paddingTop: demoEmailFocused || demoEmail ? '14px' : '0',
                    }}
                  />
                </div>

                {/* PIN field */}
                <div style={{ position: 'relative' }}>
                  <label style={{
                    position: 'absolute', left: '16px',
                    top: demoPin ? '10px' : '50%',
                    transform: demoPin ? 'none' : 'translateY(-50%)',
                    fontSize: '11px', fontWeight: '600',
                    color: '#9CA3AF', fontFamily: 'Inter, sans-serif',
                    pointerEvents: 'none',
                    transition: 'all 0.2s',
                    background: demoPin ? 'var(--bg-surface)' : 'transparent',
                    padding: demoPin ? '0 4px' : '0',
                  }}>
                    Demo PIN
                  </label>
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={demoPin}
                    maxLength={4}
                    onChange={e => setDemoPin(e.target.value)}
                    required
                    style={{
                      width: '100%', height: '52px', borderRadius: '999px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid rgba(255,255,255,0.06)',
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
                      position: 'absolute', right: '16px', top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer',
                      color: '#9CA3AF',
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
                  className="login-btn-primary"
                  style={{
                    height: '52px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    opacity: demoLoading ? 0.6 : 1,
                  }}
                >
                  {demoLoading ? 'Signing in...' : 'Demo Login'}
                  {!demoLoading && <ArrowRight size='15' />}
                </button>
              </form>
            </div>
          )}

          {/* Links */}
          <div style={{
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }} className="mobile-auth-links">
            <Link href='/forgot-password' style={{
              fontSize: '13px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF' }}>
              Forgot password?
            </Link>
            <span className="auth-divider" style={{ color: 'rgba(255,255,255,0.15)', fontSize: '13px' }}>•</span>
            <Link href='/signup' style={{
              fontSize: '13px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF' }}>
              Create account
            </Link>
          </div>

          {/* Sign up link */}
          <div style={{
            marginTop: '20px',
            padding: '14px 16px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '13px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif',
            }}>
              Don&apos;t have an account?{' '}
              <Link href='/signup' style={{ color: 'var(--success)', fontWeight: '600', textDecoration: 'none', transition: 'text-shadow 0.15s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.textShadow = '0 0 12px rgba(74,222,128,0.6)'; el.style.textDecorationLine = 'underline' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.textShadow = 'none'; el.style.textDecorationLine = 'none' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
