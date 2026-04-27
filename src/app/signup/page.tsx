'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, AlertCircle, User, Mail, Lock } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col items-center justify-center starfield" style={{ background: '#000000' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-12 absolute top-8 left-1/2 -translate-x-1/2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)' }}>DC</div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: '#ffffff' }}>The Driving Center</span>
      </Link>

      {/* Card */}
      <div
        className="w-full max-w-[440px] mx-auto px-8 py-12"
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>Create your school account</h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Start your 14-day free trial. No credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <User className="w-4 h-4" style={{ color: '#64748B' }} />
            </div>
            <input
              type="text"
              value={form.ownerName}
              onChange={e => set('ownerName', e.target.value)}
              placeholder="Your full name"
              required
              className="w-full h-[52px] rounded-xl pl-11 pr-4 text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                outline: 'none',
              }}
              onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(0,102,255,0.6)')}
              onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Mail className="w-4 h-4" style={{ color: '#64748B' }} />
            </div>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="you@yourdrivingschool.com"
              required
              className="w-full h-[52px] rounded-xl pl-11 pr-4 text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                outline: 'none',
              }}
              onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(0,102,255,0.6)')}
              onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="w-4 h-4" style={{ color: '#64748B' }} />
            </div>
            <input
              type="password"
              placeholder="Create a password (optional)"
              className="w-full h-[52px] rounded-xl pl-11 pr-4 text-sm"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                outline: 'none',
              }}
              onFocus={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(0,102,255,0.6)')}
              onBlur={e => ((e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)')}
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
            className="w-full h-[52px] rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              background: '#0066FF',
              boxShadow: '0 0 30px rgba(0,102,255,0.3)',
            }}
          >
            {loading ? 'Creating school...' : 'Create school account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Sign in link */}
      <p className="text-sm mt-6" style={{ color: '#94A3B8' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold" style={{ color: '#7ED4FD' }}>Sign in</Link>
      </p>
    </div>
  )
}