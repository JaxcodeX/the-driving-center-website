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
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F3F4F6',
      padding: '24px',
    }}>
      {/* Split container */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1100px',
        minHeight: '620px',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.5s ease-out',
      }}>

        {/* LEFT SIDE — white, form */}
        <div style={{
          flex: 1,
          background: '#FFFFFF',
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Logo */}
          <Link href='/' style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none', marginBottom: '40px',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#FF8C42', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width='18' height='18' viewBox='0 0 16 16' fill='none'>
                <path d="M8 2L13 5.5H3L8 2Z" fill='white' />
                <path d="M3 5.5V10.5L8 14V8.5H13V5.5H3Z" fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span style={{
              fontSize: '16px', fontWeight: '700', color: '#1F2937', fontFamily: 'Outfit, sans-serif',
            }}>
              The Driving Center
            </span>
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '28px', fontFamily: 'Outfit, sans-serif', fontWeight: '700',
              color: '#111827', letterSpacing: '-0.02em', marginBottom: '8px',
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Sign in to your school dashboard
            </p>
          </div>

          {/* Tabs */}
          {isDemoMode && (
            <div style={{
              display: 'flex', gap: '0', marginBottom: '24px',
              background: '#F3F4F6', borderRadius: '10px',
              padding: '4px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '4px',
                left: activeTab === 'magic' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 4px)',
                height: 'calc(100% - 8px)',
                borderRadius: '8px',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
                    color: activeTab === tab ? '#111827' : '#6B7280',
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
                <label style={{
                  position: 'absolute', left: '14px',
                  top: emailFocused || email ? '10px' : '50%',
                  transform: emailFocused || email ? 'none' : 'translateY(-50%)',
                  fontSize: emailFocused || email ? '11px' : '14px',
                  fontWeight: emailFocused || email ? '600' : '400',
                  color: emailFocused ? '#FF8C42' : '#9CA3AF',
                  fontFamily: 'Inter, sans-serif',
                  pointerEvents: 'none',
                  transition: 'all 0.2s',
                  background: emailFocused || email ? '#FFFFFF' : 'transparent',
                  padding: emailFocused || email ? '0 4px' : '0',
                }}>
                  Email address
                </label>
                <Mail size='15' style={{
                  position: 'absolute', left: '14px', top: emailFocused || email ? '14px' : '50%',
                  transform: emailFocused || email ? 'none' : 'translateY(-50%)',
                  color: '#9CA3AF', pointerEvents: 'none',
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
                    background: '#FFFFFF',
                    border: `1px solid ${emailFocused ? '#FF8C42' : '#E5E7EB'}`,
                    color: '#111827', fontSize: '14px', fontFamily: 'Inter, sans-serif',
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
                <div style={{
                  position: 'absolute', inset: '-4px', borderRadius: '50%',
                  border: '1px solid rgba(74,222,128,0.2)',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                }} />
              </div>
              <h2 style={{
                fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: '600',
                color: '#111827', marginBottom: '10px',
              }}>
                Check your inbox
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>
                We sent a magic link to{' '}
                <span style={{ color: '#111827', fontWeight: '600' }}>{email}</span>
                <br />Click it to sign in.
              </p>
            </div>
          )}

          {/* Demo Login */}
          {isDemoMode && activeTab === 'demo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <form onSubmit={handleDemoLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Floating email label */}
                <div style={{ position: 'relative' }}>
                  <label style={{
                    position: 'absolute', left: '14px',
                    top: demoEmailFocused || demoEmail ? '10px' : '50%',
                    transform: demoEmailFocused || demoEmail ? 'none' : 'translateY(-50%)',
                    fontSize: demoEmailFocused || demoEmail ? '11px' : '14px',
                    fontWeight: demoEmailFocused || demoEmail ? '600' : '400',
                    color: demoEmailFocused ? '#FF8C42' : '#9CA3AF',
                    fontFamily: 'Inter, sans-serif',
                    pointerEvents: 'none',
                    transition: 'all 0.2s',
                    background: demoEmailFocused || demoEmail ? '#FFFFFF' : 'transparent',
                    padding: demoEmailFocused || demoEmail ? '0 4px' : '0',
                  }}>
                    School owner email
                  </label>
                  <Mail size='15' style={{
                    position: 'absolute', left: '14px', top: demoEmailFocused || demoEmail ? '14px' : '50%',
                    transform: demoEmailFocused || demoEmail ? 'none' : 'translateY(-50%)',
                    color: '#9CA3AF', pointerEvents: 'none',
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
                      background: '#FFFFFF',
                      border: `1px solid ${demoEmailFocused ? '#FF8C42' : '#E5E7EB'}`,
                      color: '#111827', fontSize: '14px', fontFamily: 'Inter, sans-serif',
                      paddingLeft: '42px', paddingRight: '16px', outline: 'none',
                      transition: 'border-color 0.2s',
                      paddingTop: demoEmailFocused || demoEmail ? '14px' : '0',
                    }}
                  />
                </div>

                {/* PIN field */}
                <div style={{ position: 'relative' }}>
                  <label style={{
                    position: 'absolute', left: '14px',
                    top: demoPin ? '10px' : '50%',
                    transform: demoPin ? 'none' : 'translateY(-50%)',
                    fontSize: '11px', fontWeight: '600',
                    color: '#9CA3AF', fontFamily: 'Inter, sans-serif',
                    pointerEvents: 'none',
                    transition: 'all 0.2s',
                    background: demoPin ? '#FFFFFF' : 'transparent',
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
                      width: '100%', height: '52px', borderRadius: '12px',
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      color: '#111827', fontSize: '16px', fontWeight: '600', fontFamily: 'Inter, sans-serif',
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
            padding: '14px 16px', borderRadius: '12px',
            background: '#F9FAFB',
            border: '1px solid #E5E7EB',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif',
            }}>
              Don&apos;t have an account?{' '}
              <Link href='/signup' style={{ color: '#FF8C42', fontWeight: '600', textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — blue bg, dashboard preview */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #4179E8 0%, #1E5BD6 100%)',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
        }}>
          {/* LIVE DEMO badge */}
          <div style={{
            position: 'absolute', top: '24px', right: '24px',
            padding: '6px 12px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{
              fontSize: '11px', fontWeight: '600', color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em',
            }}>
              LIVE DEMO
            </span>
          </div>

          {/* KPI Cards Row */}
          <div style={{
            display: 'flex', gap: '16px', marginTop: '20px',
          }}>
            {[
              { label: 'Active Students', value: '8', icon: '🎓' },
              { label: 'Monthly Revenue', value: '$1,240', icon: '💰' },
              { label: 'Sessions Today', value: '6', icon: '📅' },
            ].map((kpi) => (
              <div key={kpi.label} style={{
                flex: 1,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                padding: '18px 14px',
                backdropFilter: 'blur(12px)',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{kpi.icon}</div>
                <div style={{
                  fontSize: '22px', fontWeight: '700', color: '#FFFFFF',
                  fontFamily: 'Outfit, sans-serif', marginBottom: '2px',
                }}>
                  {kpi.value}
                </div>
                <div style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Sessions Card */}
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '22px',
            backdropFilter: 'blur(12px)',
          }}>
            <h3 style={{
              fontSize: '14px', fontWeight: '600', color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif', marginBottom: '14px',
            }}>
              Upcoming Sessions
            </h3>
            {[
              { time: '9:00 AM', student: 'Alex Johnson', type: 'Road Test Prep' },
              { time: '11:30 AM', student: 'Maria Garcia', type: 'Parallel Parking' },
              { time: '2:00 PM', student: 'James Wilson', type: 'Highway Driving' },
            ].map((session, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px',
                  }}>
                    {session.student.charAt(0)}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '13px', fontWeight: '600', color: '#FFFFFF',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {session.student}
                    </div>
                    <div style={{
                      fontSize: '11px', color: 'rgba(255,255,255,0.55)',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      {session.type}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {session.time}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '22px',
            backdropFilter: 'blur(12px)',
          }}>
            <h3 style={{
              fontSize: '14px', fontWeight: '600', color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif', marginBottom: '14px',
            }}>
              Recent Activity
            </h3>
            {[
              { text: 'New booking from Sarah Miller', time: '2 min ago' },
              { text: 'Payment received — $120', time: '15 min ago' },
              { text: 'Session completed with Tom Lee', time: '1 hour ago' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#4ADE80', flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '12px', color: 'rgba(255,255,255,0.8)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {item.text}
                </span>
                <span style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'Inter, sans-serif', marginLeft: 'auto',
                }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom branding */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginTop: 'auto', paddingTop: '8px',
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '7px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
                <path d="M8 2L13 5.5H3L8 2Z" fill='white' />
                <path d="M3 5.5V10.5L8 14V8.5H13V5.5H3Z" fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span style={{
              fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.7)',
              fontFamily: 'Outfit, sans-serif',
            }}>
              The Driving Center
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @media (max-width: 768px) {
          .split-container {
            flex-direction: column !important;
          }
          .right-side {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}