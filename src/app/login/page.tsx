'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, ArrowRight } from 'lucide-react'

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
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: T.bg }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
          style={{ background: T.grad }}
        >
          DC
        </div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: T.text }}>
          The Driving Center
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm">
        {!sent ? (
          <div
            className="rounded-2xl p-8"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <h1 className="text-xl font-semibold mb-1" style={{ color: T.text }}>
              Sign in to your school
            </h1>
            <p className="text-sm mb-6" style={{ color: T.secondary }}>
              Enter your email for a passwordless magic link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                  style={{ color: T.muted }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@yourdrivingschool.com"
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm transition-all"
                  style={{
                    background: T.elevated,
                    border: `1px solid ${T.borderLt}`,
                    color: T.text,
                    outline: 'none',
                  }}
                  onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}60`)}
                  onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.borderLt)}
                />
              </div>

              {error && (
                <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: T.grad,
                  boxShadow: `0 0 20px rgba(56,189,248,0.2)`,
                }}
              >
                {loading ? 'Sending...' : 'Send magic link'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        ) : (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: `${T.cyan}18`, border: `1px solid ${T.cyan}30` }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: T.cyan }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: T.text }}>
              Check your inbox
            </h2>
            <p className="text-sm mb-1" style={{ color: T.secondary }}>
              Magic link sent to{' '}
              <span className="font-medium" style={{ color: T.text }}>{email}</span>
            </p>
            <p className="text-xs" style={{ color: T.muted }}>
              Click the link in the email to sign in. Check your spam folder too.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs mt-5" style={{ color: T.muted }}>
        No account?{' '}
        <Link href="/signup" className="font-medium" style={{ color: T.cyan }}>
          Start a free trial
        </Link>
      </p>
    </div>
  )
}
