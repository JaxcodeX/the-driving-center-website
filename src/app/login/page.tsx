'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#050507' }}>
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">Check your inbox</h1>
          <p className="text-sm text-gray-400 mb-1">
            Magic link sent to <span className="text-white font-medium">{email}</span>
          </p>
          <p className="text-xs text-gray-600">
            Click the link in the email to sign in. Check your spam folder too.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#050507' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}>
          DC
        </div>
        <span className="text-white font-semibold text-sm">The Driving Center</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm">
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 className="text-xl font-semibold text-white mb-1">Sign in to your school</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your email for a passwordless magic link.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@yourdrivingschool.com"
                required
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 20px rgba(6,182,212,0.25)' }}
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        </div>

        <p className="text-xs text-gray-600 text-center mt-4">
          No account?{' '}
          <Link href="/signup" className="text-cyan-500 hover:text-cyan-400 transition-colors">
            Start a free trial
          </Link>
        </p>
      </div>
    </div>
  )
}
