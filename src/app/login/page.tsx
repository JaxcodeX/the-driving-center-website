'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import { CheckCircle, ArrowRight, Zap } from 'lucide-react'

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
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  // Demo login state
  const [demoEmail, setDemoEmail] = useState('')
  const [demoPin, setDemoPin] = useState('0000')
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoError, setDemoError] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Detect DEMO_MODE from env
  useEffect(() => {
    // Check if this looks like a demo deployment
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

      // Redirect to dashboard — middleware reads demo_session cookie
      router.push('/school-admin')
    } catch {
      setDemoError('Network error — try again')
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: T.bg }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: T.grad }}>DC</div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: T.text }}>The Driving Center</span>
      </Link>

      <div className="w-full max-w-sm space-y-6">

        {/* Magic Link Form */}
        {!sent ? (
          <div className="rounded-2xl p-8" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <h1 className="text-xl font-semibold mb-1" style={{ color: T.text }}>Sign in to your school</h1>
            <p className="text-sm mb-6" style={{ color: T.secondary }}>Enter your email for a passwordless magic link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@yourdrivingschool.com" required
                  className="w-full rounded-xl px-4 py-3 text-sm transition-all" style={{ background: T.elevated, border: `1px solid ${T.borderLt}`, color: T.text, outline: 'none' }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}60`)}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.borderLt)} />
              </div>
              {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: T.grad, boxShadow: `0 0 20px rgba(56,189,248,0.2)` }}>
                {loading ? 'Sending...' : 'Send magic link'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-2xl p-8 text-center" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${T.cyan}18`, border: `1px solid ${T.cyan}30` }}>
              <CheckCircle className="w-6 h-6" style={{ color: T.cyan }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: T.text }}>Check your inbox</h2>
            <p className="text-sm mb-1" style={{ color: T.secondary }}>Magic link sent to <span className="font-medium" style={{ color: T.text }}>{email}</span></p>
            <p className="text-xs" style={{ color: T.muted }}>Click the link in the email to sign in. Check your spam folder too.</p>
          </div>
        )}

        {/* DEMO_MODE Quick Login */}
        {isDemoMode && (
          <div className="rounded-2xl p-6" style={{ background: `${T.cyan}08`, border: `1px solid ${T.cyan}25` }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4" style={{ color: T.cyan }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: T.cyan }}>Demo Mode</span>
            </div>
            <p className="text-xs mb-4" style={{ color: T.muted }}>Skip email — instant demo login for testing.</p>

            <form onSubmit={handleDemoLogin} className="space-y-3">
              <div>
                <input type="email" value={demoEmail} onChange={e => setDemoEmail(e.target.value)}
                  placeholder="school owner email" required
                  className="w-full rounded-xl px-4 py-2.5 text-sm" style={{ background: T.elevated, border: `1px solid ${T.borderLt}`, color: T.text, outline: 'none' }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}60`)}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.borderLt)} />
              </div>
              <div className="flex gap-2">
                <input type="text" value={demoPin} maxLength={4} onChange={e => setDemoPin(e.target.value)}
                  placeholder="PIN" required pattern="\d{4}"
                  className="w-24 rounded-xl px-4 py-2.5 text-sm text-center font-mono" style={{ background: T.elevated, border: `1px solid ${T.borderLt}`, color: T.text, outline: 'none' }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}60`)}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.borderLt)} />
                <button type="submit" disabled={demoLoading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: T.cyan, color: '#000' }}>
                  {demoLoading ? 'Logging in...' : 'Demo Login'}
                </button>
              </div>
              {demoError && <p className="text-xs" style={{ color: '#ef4444' }}>{demoError}</p>}
            </form>
          </div>
        )}
      </div>

      <p className="text-xs mt-5" style={{ color: T.muted }}>
        No account?{' '}
        <Link href="/signup" className="font-medium" style={{ color: T.cyan }}>Start a free trial</Link>
      </p>
    </div>
  )
}
