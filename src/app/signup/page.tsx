'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, AlertCircle } from 'lucide-react'

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
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

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

      // Redirect to onboarding with school slug
      router.push(`/onboarding?school=${data.slug}`)
    } catch {
      setError('Network error — try again')
      setLoading(false)
    }
  }

  const inputStyle = {
    background: T.elevated,
    border: `1px solid ${T.borderLt}`,
    color: T.text,
    outline: 'none' as const,
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
        <div
          className="rounded-2xl p-8"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
          <h1 className="text-xl font-semibold mb-1" style={{ color: T.text }}>
            Start your free trial
          </h1>
          <p className="text-sm mb-6" style={{ color: T.secondary }}>
            No credit card required. Set up in under an hour.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: T.muted }}
              >
                School name
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={e => set('schoolName', e.target.value)}
                placeholder="Oneida Driving Academy"
                required
                className="w-full rounded-xl px-4 py-3 text-sm transition-all"
                style={inputStyle}
                onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}60`)}
                onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.borderLt)}
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: T.muted }}
              >
                Your name
              </label>
              <input
                type="text"
                value={form.ownerName}
                onChange={e => set('ownerName', e.target.value)}
                placeholder="Mark Reedy"
                required
                className="w-full rounded-xl px-4 py-3 text-sm transition-all"
                style={inputStyle}
                onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}60`)}
                onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.borderLt)}
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: T.muted }}
              >
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="mark@yourdrivingschool.com"
                required
                className="w-full rounded-xl px-4 py-3 text-sm transition-all"
                style={inputStyle}
                onFocus={e => ((e.target as HTMLInputElement).style.borderColor = `${T.cyan}60`)}
                onBlur={e => ((e.target as HTMLInputElement).style.borderColor = T.borderLt)}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs" style={{ color: '#ef4444' }}>
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
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
              {loading ? 'Creating school...' : 'Create school'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <p className="text-xs text-center mt-4" style={{ color: T.muted }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: T.cyan }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
