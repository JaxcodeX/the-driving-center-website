'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  // Demo login state
  const [demoEmail, setDemoEmail] = useState('')
  const [demoPin, setDemoPin] = useState('0000')
  const [showPin, setShowPin] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoError, setDemoError] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    fetch('/api/schools').then(r => r.json()).then(d => {
      if (d.DEMO_MODE) setIsDemoMode(true)
    }).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#080809' }}>
      {/* Decorative gradient circles */}
      <div
        className="bg-circle"
        style={{
          width: 600,
          height: 600,
          top: -200,
          right: -150,
          background: 'radial-gradient(circle, rgba(26,86,255,0.5) 0%, transparent 70%)',
          opacity: 0.12,
        }}
      />
      <div
        className="bg-circle"
        style={{
          width: 500,
          height: 500,
          bottom: -150,
          left: -100,
          background: 'radial-gradient(circle, rgba(112,123,255,0.5) 0%, transparent 70%)',
          opacity: 0.1,
        }}
      />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-12 absolute top-8 left-1/2 -translate-x-1/2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)' }}>DC</div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: '#ffffff' }}>The Driving Center</span>
      </Link>

      {/* Glassmorphism card */}
      <div
        className="relative w-full max-w-[480px] mx-auto px-8 py-10"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>Sign in to your account</h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Enter your credentials to access your school dashboard</p>
        </div>

        {/* Magic Link Form */}
        {!sent ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {/* Email */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-4 h-4" style={{ color: '#64748B' }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@yourdrivingschool.com"
                  required
                  className="w-full h-[50px] rounded-[999px] pl-11 pr-4 text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(26,86,255,0.6)')}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>

              {error && (
                <p className="text-xs text-center" style={{ color: '#ef4444' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] rounded-[999px] text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: '#1A56FF',
                  boxShadow: '0 0 20px rgba(26,86,255,0.25)',
                }}
              >
                {loading ? 'Sending...' : 'Send login link'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs px-2" style={{ color: '#64748B' }}>or continue with</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
          </>
        ) : (
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <CheckCircle className="w-6 h-6" style={{ color: '#4ADE80' }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#ffffff' }}>Check your inbox</h2>
            <p className="text-sm mb-1" style={{ color: '#94A3B8' }}>Magic link sent to <span className="font-medium" style={{ color: '#ffffff' }}>{email}</span></p>
            <p className="text-xs" style={{ color: '#64748B' }}>Click the link in the email to sign in.</p>
          </div>
        )}

        {/* DEMO_MODE Quick Login — glassmorphism inner panel */}
        {isDemoMode && (
          <div
            className="rounded-[16px] p-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" style={{ color: '#F97316' }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#F97316' }}>Demo Mode</span>
            </div>
            <p className="text-xs mb-4" style={{ color: '#64748B' }}>Use PIN <span className="font-mono text-white">0000</span> after entering any email</p>

            <form onSubmit={handleDemoLogin} className="space-y-3">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-4 h-4" style={{ color: '#64748B' }} />
                </div>
                <input
                  type="email"
                  value={demoEmail}
                  onChange={e => setDemoEmail(e.target.value)}
                  placeholder="school owner email"
                  required
                  className="w-full h-[50px] rounded-[999px] pl-11 pr-4 text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(26,86,255,0.6)')}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4" style={{ color: '#64748B' }} />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={demoPin}
                  maxLength={4}
                  onChange={e => setDemoPin(e.target.value)}
                  placeholder="Demo PIN"
                  required
                  pattern="\d{4}"
                  className="w-full h-[50px] rounded-[999px] pl-11 pr-12 text-sm text-center font-mono"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(26,86,255,0.6)')}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#64748B' }}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {demoError && (
                <p className="text-xs" style={{ color: '#ef4444' }}>{demoError}</p>
              )}

              <button
                type="submit"
                disabled={demoLoading}
                className="w-full h-[50px] rounded-[999px] text-sm font-semibold text-white disabled:opacity-50"
                style={{
                  background: '#1A56FF',
                  boxShadow: '0 0 20px rgba(26,86,255,0.25)',
                }}
              >
                {demoLoading ? 'Logging in...' : 'Demo Login'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Sign up link */}
      <p className="text-sm mt-6" style={{ color: '#94A3B8' }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold" style={{ color: '#7ED4FD' }}>Sign up</Link>
      </p>
    </div>
  )
}
