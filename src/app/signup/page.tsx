'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, AlertCircle, User, Mail, Lock, ArrowLeft } from 'lucide-react'

const STEPS = ['Account', 'School', 'Ready']

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ schoolName: '', ownerName: '', email: '' })
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
      const res = await fetch('/api/schools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return }
      router.push(`/onboarding?school=${data.slug}`)
    } catch { setError('Network error — try again'); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D12', padding: '24px', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
      {/* Split container */}
      <div style={{ display: 'flex', width: '100%', maxWidth: '1100px', minHeight: '620px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.5)', animation: 'fadeIn 0.5s ease-out', position: 'relative', zIndex: 1 }}>

        {/* LEFT SIDE — dark glass, form */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)', padding: '48px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Logo */}
          <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '40px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width='18' height='18' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>The Driving Center</span>
          </Link>

          {/* Back link */}
          <Link href='/login' style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', textDecoration: 'none', marginBottom: '24px', fontFamily: 'Inter, sans-serif', transition: 'color 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#111827')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#9CA3AF')}>
            <ArrowLeft className="w-4 h-4" />Back to login
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontFamily: 'Outfit, sans-serif', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '8px' }}>Create your school account</h1>
            <p style={{ fontSize: '14px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>Start your 14-day free trial. No credit card required.</p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '28px', position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ width: '40px', height: '2px', margin: '0 8px', background: i <= 0 ? 'rgba(255,255,255,0.06)' : '#4ADE80' }} />}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700',
                    background: i === 0 ? '#4ADE80' : i < 0 ? '#4ADE80' : 'rgba(255,255,255,0.06)',
                    color: i === 0 ? '#FFFFFF' : '#9CA3AF',
                    border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'Inter, sans-serif',
                  }}>{i + 1}</div>
                  <span style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: i === 0 ? '#9CA3AF' : 'rgba(255,255,255,0.3)' }}>{step}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Full name */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.3)' }}><User size={16} /></div>
              <input type='text' value={form.ownerName} onChange={e => set('ownerName', e.target.value)} placeholder='Your full name' required style={{
                width: '100%', height: '50px', borderRadius: '12px', background: '#FFFFFF',
                border: '1px solid #E5E7EB', color: '#111827', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                paddingLeft: '44px', paddingRight: '16px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>

            {/* School name */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center' }}>
                <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 2L13 5.5H3L8 2Z' fill='currentColor' />
                  <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='currentColor' fillOpacity='0.7' />
                </svg>
              </div>
              <input type='text' value={form.schoolName} onChange={e => set('schoolName', e.target.value)} placeholder='Driving school name' required style={{
                width: '100%', height: '50px', borderRadius: '12px', background: '#FFFFFF',
                border: '1px solid #E5E7EB', color: '#111827', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                paddingLeft: '44px', paddingRight: '16px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>

            {/* Email */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.3)' }}><Mail size={16} /></div>
              <input type='email' value={form.email} onChange={e => set('email', e.target.value)} placeholder='you@yourdrivingschool.com' required style={{
                width: '100%', height: '50px', borderRadius: '12px', background: '#FFFFFF',
                border: '1px solid #E5E7EB', color: '#111827', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                paddingLeft: '44px', paddingRight: '16px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>

            {/* Password (optional) */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.3)' }}><Lock size={16} /></div>
              <input type='password' placeholder='Create a password (optional)' style={{
                width: '100%', height: '50px', borderRadius: '12px', background: '#FFFFFF',
                border: '1px solid #E5E7EB', color: '#111827', fontSize: '15px', fontFamily: 'Inter, sans-serif',
                paddingLeft: '44px', paddingRight: '16px', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} style={{ color: '#EF4444', marginTop: '1px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#EF4444', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' }}>{error}</span>
              </div>
            )}

            <button type='submit' disabled={loading} style={{
              width: '100%', height: '50px', borderRadius: '12px', background: '#4ADE80', color: '#FFFFFF',
              fontSize: '14px', fontWeight: '700', fontFamily: 'Inter, sans-serif', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.6 : 1,
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { if (!loading) { (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.target as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(74,222,128,0.35)' } }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; (e.target as HTMLButtonElement).style.boxShadow = 'none' }}>
              {loading ? 'Creating school...' : 'Create school account'}{!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Sign in link */}
          <div style={{ marginTop: '28px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Already have an account?{' '}
              <Link href='/login' style={{ color: '#4ADE80', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE — blue bg, dashboard preview */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #4179E8 0%, #1E5BD6 100%)', padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
          {/* LIVE DEMO badge */}
          <div style={{ position: 'absolute', top: '50%', right: '24px', transform: 'translateY(-50%)', padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>SCHOOL ADMIN</span>
          </div>

          {/* KPI Cards Row */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            {[
              { label: 'Active Students', value: '8', icon: '🎓' },
              { label: 'Monthly Revenue', value: '$1,240', icon: '💰' },
              { label: 'Sessions Today', value: '6', icon: '📅' },
            ].map((kpi) => (
              <div key={kpi.label} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '18px 14px', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{kpi.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif', marginBottom: '2px' }}>{kpi.value}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming Sessions Card */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '22px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', marginBottom: '14px' }}>Upcoming Sessions</h3>
            {[
              { time: '9:00 AM', student: 'Alex Johnson', type: 'Road Test Prep' },
              { time: '11:30 AM', student: 'Maria Garcia', type: 'Parallel Parking' },
              { time: '2:00 PM', student: 'James Wilson', type: 'Highway Driving' },
            ].map((session, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{session.student.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>{session.student}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif' }}>{session.type}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>{session.time}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '22px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', marginBottom: '14px' }}>Recent Activity</h3>
            {[
              { text: 'New booking from Sarah Miller', time: '2 min ago' },
              { text: 'Payment received — $120', time: '15 min ago' },
              { text: 'Session completed with Tom Lee', time: '1 hour ago' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}>{item.text}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', marginLeft: 'auto' }}>{item.time}</span>
              </div>
            ))}
          </div>

          {/* Bottom branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif' }}>The Driving Center</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) { .split-container { flex-direction: column !important; } .right-side { display: none !important; } }
      `}</style>
    </div>
  )
}