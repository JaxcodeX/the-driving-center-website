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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Decorative gradient circles */}
      <div
        className="bg-circle"
        style={{
          width: 600,
          height: 600,
          top: -200,
          left: -150,
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
          right: -100,
          background: 'radial-gradient(circle, rgba(112,123,255,0.5) 0%, transparent 70%)',
          opacity: 0.1,
        }}
      />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-12 absolute top-8 left-1/2 -translate-x-1/2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)' }}>DC</div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>The Driving Center</span>
      </Link>

      {/* Glassmorphism card */}
      <div
        className="relative w-full max-w-[480px] mx-auto px-8 py-10"
        style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
        }}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center">
              {i > 0 && (
                <div
                  className="w-12 h-px mx-2"
                  style={{
                    background: i <= 0 ? 'rgba(255,255,255,0.15)' : 'rgba(26,86,255,0.5)',
                  }}
                />
              )}
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    background: i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                    color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: i === 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                >
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Create your school account</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Start your 14-day free trial. No credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
            <input
              type="text"
              value={form.ownerName}
              onChange={e => set('ownerName', e.target.value)}
              placeholder="Your full name"
              required
              className="w-full h-[50px] rounded-[999px] pl-11 pr-4 text-sm"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
              onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(26,86,255,0.6)')}
              onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'var(--card-border)')}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="you@yourdrivingschool.com"
              required
              className="w-full h-[50px] rounded-[999px] pl-11 pr-4 text-sm"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
              onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(26,86,255,0.6)')}
              onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'var(--card-border)')}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
            <input
              type="password"
              placeholder="Create a password (optional)"
              className="w-full h-[50px] rounded-[999px] pl-11 pr-4 text-sm"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
              onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(26,86,255,0.6)')}
              onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'var(--card-border)')}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm" style={{ color: '#ef4444' }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-glow w-full h-[50px] rounded-[999px] text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating school...' : 'Create school account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Sign in link */}
      <p className="text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold" style={{ color: '#7ED4FD' }}>Sign in</Link>
      </p>
    </div>
  )
}
