'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, AlertCircle, User, Mail, Lock, ArrowLeft } from 'lucide-react'

const STEPS = ['Account', 'School', 'Ready']

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ schoolName: '', ownerName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: form.schoolName,
          ownerName: form.ownerName,
          email: form.email,
          password: form.password || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return }

      if (data.demoMode) {
        // DEMO_MODE: redirect to login demo tab so user gets session cookies
        router.push('/login?demo=true')
      } else if (form.password) {
        // Production + password: sign in directly, then go to onboarding
        const supabase = (await import('@/lib/supabase/client')).createClient()
        await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
        router.push('/school-admin/onboarding')
      } else {
        // Production + no password: redirect to login with success message
        router.push(`/login?signup=success&email=${encodeURIComponent(form.email)}`)
      }
    } catch { setError('Network error — try again'); setLoading(false) }
  }

  return (
    <div className='signup-page' style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', padding: '24px', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--success), transparent 94%) 0%, transparent 60%)', pointerEvents: 'none' }} />
      {/* Split container */}
      <div className='signup-split' style={{ display: 'flex', width: '100%', maxWidth: '1100px', minHeight: '620px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 25px 80px color-mix(in srgb, var(--bg-base), transparent 50%)', animation: 'fadeIn 0.5s ease-out', position: 'relative', zIndex: 1 }}>

        {/* LEFT SIDE — dark glass, form */}
        <div className='signup-left' style={{ flex: 1, background: 'color-mix(in srgb, var(--text-primary), transparent 97%)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--border)', padding: '48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Logo */}
          <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '40px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width='18' height='18' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>The Driving Center</span>
          </Link>

          {/* Back link */}
          <Link href='/login' style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '24px', fontFamily: 'Inter, sans-serif', transition: 'color 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}>
            <ArrowLeft className="w-4 h-4" />Back to login
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontFamily: 'Outfit, sans-serif', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>Create your school account</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Start your 14-day free trial. No credit card required.</p>
          </div>

          {/* Step indicator */}
          <div className='signup-step-indicator' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '28px', position: 'relative' }}>
            <div className='signup-step-track' style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div className='signup-step-connector' style={{ width: '40px', height: '2px', margin: '0 8px', background: i <= 0 ? 'var(--border)' : 'var(--success)' }} />}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700',
                    background: i === 0 ? 'var(--success)' : i < 0 ? 'var(--success)' : 'var(--border)',
                    color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: i === 0 ? 'none' : '1px solid color-mix(in srgb, var(--text-primary), transparent 90%)',
                    fontFamily: 'Inter, sans-serif',
                  }}>{i + 1}</div>
                  <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: i === 0 ? 'var(--text-secondary)' : 'color-mix(in srgb, var(--text-primary), transparent 70%)' }}>{step}</span>
                </div>
              </div>
            ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Full name */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'color-mix(in srgb, var(--text-primary), transparent 70%)' }}><User size={16} /></div>
              <input className='mobile-input-52' type='text' value={form.ownerName} onChange={e => set('ownerName', e.target.value)} placeholder='Your full name' required style={{
                width: '100%', height: '50px', borderRadius: '12px', background: 'var(--bg-elevated)',
                border: '1px solid color-mix(in srgb, var(--text-primary), transparent 90%)', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                paddingLeft: '44px', paddingRight: '16px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--success)')}
              onBlur={e => (e.target.style.borderColor = 'color-mix(in srgb, var(--text-primary), transparent 90%)')} />
            </div>

            {/* School name */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'color-mix(in srgb, var(--text-primary), transparent 70%)', display: 'flex', alignItems: 'center' }}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 2L13 5.5H3L8 2Z' fill='currentColor' />
                  <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='currentColor' fillOpacity='0.7' />
                </svg>
              </div>
              <input className='mobile-input-52' type='text' value={form.schoolName} onChange={e => set('schoolName', e.target.value)} placeholder='Driving school name' required style={{
                width: '100%', height: '50px', borderRadius: '12px', background: 'var(--bg-elevated)',
                border: '1px solid color-mix(in srgb, var(--text-primary), transparent 90%)', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                paddingLeft: '44px', paddingRight: '16px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--success)')}
              onBlur={e => (e.target.style.borderColor = 'color-mix(in srgb, var(--text-primary), transparent 90%)')} />
            </div>

            {/* Email */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'color-mix(in srgb, var(--text-primary), transparent 70%)' }}><Mail size={16} /></div>
              <input className='mobile-input-52' type='email' value={form.email} onChange={e => set('email', e.target.value)} placeholder='you@yourdrivingschool.com' required style={{
                width: '100%', height: '50px', borderRadius: '12px', background: 'var(--bg-elevated)',
                border: '1px solid color-mix(in srgb, var(--text-primary), transparent 90%)', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                paddingLeft: '44px', paddingRight: '16px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--success)')}
              onBlur={e => (e.target.style.borderColor = 'color-mix(in srgb, var(--text-primary), transparent 90%)')} />
            </div>

            {/* Password (optional) */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'color-mix(in srgb, var(--text-primary), transparent 70%)' }}><Lock size={16} /></div>
              <input className='mobile-input-52' type='password' value={form.password} onChange={e => set('password', e.target.value)} placeholder='Create a password (optional)' style={{
                width: '100%', height: '50px', borderRadius: '12px', background: 'var(--bg-elevated)',
                border: '1px solid color-mix(in srgb, var(--text-primary), transparent 90%)', color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                paddingLeft: '44px', paddingRight: '16px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--success)')}
              onBlur={e => (e.target.style.borderColor = 'color-mix(in srgb, var(--text-primary), transparent 90%)')} />
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', borderRadius: '10px', background: 'color-mix(in srgb, var(--danger), transparent 90%)', border: '1px solid color-mix(in srgb, var(--danger), transparent 80%)' }}>
                <AlertCircle size={16} style={{ color: 'var(--danger)', marginTop: '1px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--danger)', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' }}>{error}</span>
              </div>
            )}

            <button className='mobile-button-52' type='submit' disabled={loading} style={{
              width: '100%', height: '50px', borderRadius: '12px', background: 'var(--success)', color: 'var(--text-primary)',
              fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.6 : 1,
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { if (!loading) { (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.target as HTMLButtonElement).style.boxShadow = '0 4px 16px color-mix(in srgb, var(--success), transparent 65%)' } }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; (e.target as HTMLButtonElement).style.boxShadow = 'none' }}>
              {loading ? 'Creating school...' : 'Create school account'}{!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Sign in link */}
          <div style={{ marginTop: '28px', padding: '14px 16px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
              Already have an account?{' '}
              <Link href='/login' style={{ color: 'var(--success)', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — blue bg, dashboard preview */}
        <div className='signup-right' style={{ flex: 1, background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent) 100%)', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
          {/* LIVE DEMO badge */}
          <div style={{ position: 'absolute', top: '50%', right: '24px', transform: 'translateY(-50%)', padding: '6px 12px', borderRadius: '20px', background: 'color-mix(in srgb, var(--text-primary), transparent 85%)', border: '1px solid color-mix(in srgb, var(--text-primary), transparent 75%)', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>SCHOOL ADMIN</span>
          </div>

          {/* KPI Cards Row */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            {[
              { label: 'Active Students', value: '8', icon: '🎓' },
              { label: 'Monthly Revenue', value: '$1,240', icon: '💰' },
              { label: 'Sessions Today', value: '6', icon: '📅' },
            ].map((kpi) => (
              <div key={kpi.label} style={{ flex: 1, background: 'color-mix(in srgb, var(--text-primary), transparent 88%)', border: '1px solid color-mix(in srgb, var(--text-primary), transparent 80%)', borderRadius: '20px', padding: '18px 14px', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{kpi.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', marginBottom: '2px' }}>{kpi.value}</div>
                <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 35%)', fontFamily: 'Inter, sans-serif' }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming Sessions Card */}
          <div style={{ background: 'color-mix(in srgb, var(--text-primary), transparent 88%)', border: '1px solid color-mix(in srgb, var(--text-primary), transparent 80%)', borderRadius: '20px', padding: '22px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', marginBottom: '14px' }}>Upcoming Sessions</h3>
            {[
              { time: '9:00 AM', student: 'Alex Johnson', type: 'Road Test Prep' },
              { time: '11:30 AM', student: 'Maria Garcia', type: 'Parallel Parking' },
              { time: '2:00 PM', student: 'James Wilson', type: 'Highway Driving' },
            ].map((session, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid color-mix(in srgb, var(--text-primary), transparent 90%)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'color-mix(in srgb, var(--text-primary), transparent 85%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{session.student.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>{session.student}</div>
                    <div style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 45%)', fontFamily: 'Inter, sans-serif' }}>{session.type}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: 'color-mix(in srgb, var(--text-primary), transparent 30%)', fontFamily: 'Inter, sans-serif' }}>{session.time}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ background: 'color-mix(in srgb, var(--text-primary), transparent 88%)', border: '1px solid color-mix(in srgb, var(--text-primary), transparent 80%)', borderRadius: '20px', padding: '22px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', marginBottom: '14px' }}>Recent Activity</h3>
            {[
              { text: 'New booking from Sarah Miller', time: '2 min ago' },
              { text: 'Payment received — $120', time: '15 min ago' },
              { text: 'Session completed with Tom Lee', time: '1 hour ago' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 2 ? '1px solid color-mix(in srgb, var(--text-primary), transparent 90%)' : 'none' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--text-primary), transparent 20%)', fontFamily: 'Inter, sans-serif' }}>{item.text}</span>
                <span style={{ fontSize: '11px', color: 'color-mix(in srgb, var(--text-primary), transparent 60%)', fontFamily: 'Inter, sans-serif', marginLeft: 'auto' }}>{item.time}</span>
              </div>
            ))}
          </div>

          {/* Bottom branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'color-mix(in srgb, var(--text-primary), transparent 80%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'color-mix(in srgb, var(--text-primary), transparent 30%)', fontFamily: 'Outfit, sans-serif' }}>The Driving Center</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
