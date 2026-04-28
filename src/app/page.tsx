'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScrollToTop from '@/components/ScrollToTop'

// ─── Theme Toggle ───────────────────────────────────────────────────
function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

// ─── Dashboard Mockup ──────────────────────────────────────────────
function DashboardMockup() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark')
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const isDark = theme === 'dark'
  const sidebarBg = isDark ? '#0F172A' : '#F5F4F0'
  const sidebarText = isDark ? '#64748B' : '#9B9B9B'
  const sidebarActive = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
  const sidebarActiveBorder = '2px solid #1A56FF'
  const bodyBg = isDark ? '#080809' : '#F5F4F0'
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const textPrimary = isDark ? '#fff' : '#0A0A0A'
  const textMuted = isDark ? '#64748B' : '#9B9B9B'
  const chartColor = isDark ? '#4ADE80' : '#1A56FF'

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '56px', padding: '0 24px' }}>
      <div style={{
        filter: isDark ? 'drop-shadow(0 0 80px rgba(26,86,255,0.2))' : 'drop-shadow(0 12px 48px rgba(0,0,0,0.12))',
        width: '100%', maxWidth: '920px',
      }}>
        <div style={{
          background: isDark ? '#0F172A' : '#FFFFFF',
          border: `1px solid ${cardBorder}`,
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: isDark
            ? '0 0 80px rgba(26,86,255,0.12), 0 32px 64px rgba(0,0,0,0.5)'
            : '0 12px 48px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            height: '44px', background: isDark ? '#0F172A' : '#F5F4F0',
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px',
            borderBottom: `1px solid ${cardBorder}`,
          }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => (
              <div key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c, flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', minHeight: '400px', background: bodyBg }}>
            <div style={{ background: sidebarBg, borderRight: `1px solid ${cardBorder}`, padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {['Dashboard', 'Students', 'Sessions', 'Billing', 'Reports'].map((label, i) => (
                <div key={label} style={{
                  padding: '8px 14px', fontSize: '12px',
                  color: i === 0 ? textPrimary : sidebarText,
                  fontWeight: i === 0 ? '600' : '400',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: i === 0 ? sidebarActive : 'transparent',
                  borderLeft: i === 0 ? sidebarActiveBorder : '2px solid transparent',
                }}>{label}</div>
              ))}
            </div>
            <div style={{ padding: '24px 24px 24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: textPrimary, marginBottom: '2px' }}>Good morning, Mark</p>
                <p style={{ fontSize: '12px', color: textMuted }}>Monday, April 26, 2026</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[['STUDENTS', '24', '+3 this week'], ['HOURS LOGGED', '6.4h', '+1.2h today'], ['REVENUE', '$840', '+ $120']].map(([l, v, c]) => (
                  <div key={l} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '12px 14px' }}>
                    <p style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: textMuted, textTransform: 'uppercase', marginBottom: '5px' }}>{l}</p>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: textPrimary, lineHeight: '1', marginBottom: '5px' }}>{v}</p>
                    <p style={{ fontSize: '10px', color: '#4ADE80', fontWeight: '500' }}>▲ {c}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '12px 14px' }}>
                  <p style={{ fontSize: '10px', color: textMuted, marginBottom: '10px', fontWeight: '500' }}>Weekly Sessions</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '50px' }}>
                    {[0.4, 0.65, 0.45, 0.8, 0.55, 0.7, 0.9].map((h, i) => (
                      <div key={i} style={{
                        flex: 1,
                        background: isDark ? 'linear-gradient(180deg, #1A56FF 0%, rgba(26,86,255,0.3) 100%)' : 'linear-gradient(180deg, #1A56FF 0%, rgba(26,86,255,0.2) 100%)',
                        borderRadius: '3px 3px 0 0', height: `${h * 100}%`, minHeight: '6px', opacity: 0.7 + i * 0.04,
                      }} />
                    ))}
                  </div>
                </div>
                <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '12px 14px' }}>
                  <p style={{ fontSize: '10px', color: textMuted, marginBottom: '10px', fontWeight: '500' }}>Revenue Trend</p>
                  <svg viewBox="0 0 200 50" width="100%" height="50" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id={`lg-${theme}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,40 L25,32 L60,36 L90,20 L130,26 L170,12 L200,8 L200,50 L0,50 Z" fill={`url(#lg-${theme})`} />
                    <path d="M0,40 L25,32 L60,36 L90,20 L130,26 L170,12 L200,8" fill="none" stroke={chartColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="200" cy="8" r="3" fill={chartColor} />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Booking Calendar ───────────────────────────────────────────────
const CAL_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const CAL_CELLS: {d: string}[] = [
  {d:''},{d:''},{d:''},{d:''},{d:''},{d:'1'},{d:'2'},
  {d:'3'},{d:'4'},{d:'5'},{d:'6'},{d:'7'},{d:'8'},{d:'9'},
  {d:'10'},{d:'11'},{d:'12'},{d:'13'},{d:'14'},{d:'15'},{d:'16'},
  {d:'17'},{d:'18'},{d:'19'},{d:'20'},{d:'21'},{d:'22'},{d:'23'},
  {d:'24'},{d:'25'},{d:'26'},{d:'27'},{d:'28'},{d:'29'},{d:'30'},
]

function BookingCalendar() {
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  const [selectedDay, setSelectedDay] = useState(14)
  const [selectedTime, setSelectedTime] = useState('10:00 AM')

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94A3B8', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', lineHeight: '1' }}>‹</button>
        <p style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>May 2026</p>
        <button style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94A3B8', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', lineHeight: '1' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
        {CAL_DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: '#64748B', fontWeight: '600', padding: '4px 0' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '20px' }}>
        {CAL_CELLS.map((cell, i) => {
          const isSelected = selectedDay === parseInt(cell.d)
          const isEmpty = cell.d === ''
          const bg = isSelected ? '#1A56FF' : 'transparent'
          const fg = isEmpty ? 'transparent' : isSelected ? '#fff' : '#94A3B8'
          return (
            <div
              key={i}
              onClick={() => !isEmpty && setSelectedDay(parseInt(cell.d))}
              style={{
                textAlign: 'center', fontSize: '13px', color: fg,
                padding: '8px 4px', borderRadius: '8px',
                cursor: isEmpty ? 'default' : 'pointer',
                background: bg, fontWeight: isSelected ? '600' : '400',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {cell.d}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {times.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTime(t)}
            style={{
              padding: '8px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
              border: selectedTime === t ? '1.5px solid #1A56FF' : '1px solid rgba(255,255,255,0.1)',
              background: selectedTime === t ? 'rgba(26,86,255,0.15)' : 'transparent',
              color: selectedTime === t ? '#4A8FFF' : '#94A3B8',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <button className="btn-glow" style={{ width: '100%', marginTop: '16px', fontSize: '15px' }}>
        Confirm booking
      </button>
    </div>
  )
}

// ─── Decorative Circles ────────────────────────────────────────────
function DecorativeCircles({ className = '' }: { className?: string }) {
  const circles = [
    { size: 80, x: 0, y: 20, color: '#4ADE80' },
    { size: 60, x: 90, y: 0, color: '#F472B6' },
    { size: 50, x: 120, y: 60, color: '#FB923C' },
    { size: 40, x: 60, y: 90, color: '#60A5FA' },
    { size: 36, x: 140, y: 110, color: '#FBBF24' },
    { size: 28, x: 20, y: 120, color: '#A78BFA' },
  ]
  return (
    <div style={{ position: 'relative', width: '200px', height: '160px', flexShrink: 0 }} className={className}>
      {circles.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', left: c.x, top: c.y,
          width: c.size, height: c.size, borderRadius: '50%',
          background: c.color, opacity: 0.85 - i * 0.05,
          boxShadow: `0 8px 32px ${c.color}40`,
        }} />
      ))}
    </div>
  )
}

// ─── Testimonial Card ───────────────────────────────────────────────
function TestimonialCard({ quote, name, role, initials, bg }: { quote: string; name: string; role: string; initials: string; bg: string }) {
  return (
    <div className="glass-card" style={{ borderRadius: '16px' }}>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px', fontStyle: 'italic' as const }}>{quote}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '700', color: 'white', flexShrink: 0,
        }}>{initials}</div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{name}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{role}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Pricing Card ───────────────────────────────────────────────────
function PricingCard({ name, price, desc, features, highlighted, cta }: {
  name: string; price: string; desc: string;
  features: string[]; highlighted?: boolean; cta: string;
}) {
  return (
    <div className="glass-card" style={highlighted ? { border: '1.5px solid var(--accent)', boxShadow: '0 0 60px var(--accent-glow)', position: 'relative' as const } : { position: 'relative' as const }}>
      {highlighted && (
        <div style={{
          position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
          padding: '5px 14px', borderRadius: '999px',
          background: 'var(--accent)', color: 'white',
          fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' as const, letterSpacing: '0.05em',
        }}>
          Most popular
        </div>
      )}
      <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '12px' }}>
        {name}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
        <span style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1', letterSpacing: '-0.02em' }}>{price}</span>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mo</span>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: '1.6' }}>{desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 8l3.5 3.5 6.5-7" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={highlighted ? 'btn-glow' : 'btn-ghost'}
        style={{ display: 'flex', justifyContent: 'center', fontSize: '15px', textDecoration: 'none', borderRadius: '999px' }}
      >
        {cta}
      </Link>
    </div>
  )
}

// ─── Feature Cards Data ─────────────────────────────────────────────
const FEATURE_CARDS = [
  { gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', title: 'Track every student', desc: 'Log sessions, TCA hours, and progress. Auto-generate certificates when requirements are met.' },
  { gradient: 'linear-gradient(135deg, #8B5CF6, #EC4899)', title: 'Schedule without friction', desc: 'Students book online. Parents pay upfront. No more phone tag — just show up.' },
  { gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)', title: 'Get paid and stay compliant', desc: 'Stripe handles payments. TCA tracking is automatic. Tennessee state compliance built in.' },
  { gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)', title: 'Multi-tenant by design', desc: 'Each school gets their own isolated space. Data never leaks between schools.' },
  { gradient: 'linear-gradient(135deg, #10B981, #3B82F6)', title: 'Automated reminders', desc: 'SMS and email reminders go out automatically. Fewer no-shows, less admin work.' },
  { gradient: 'linear-gradient(135deg, #F97316, #8B5CF6)', title: 'Instructor management', desc: 'Invite instructors, set availability, track their schedules — all from one dashboard.' },
]

// ─── Testimonials Data ───────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: 'This platform cut my administrative work in half. I spend less time on the phone and more time teaching.', name: 'Matt Reedy', role: 'Driving Instructor, East Tennessee', initials: 'MR', bg: 'linear-gradient(135deg, #7ED4FD, #707BFF)' },
  { quote: 'Finally, a tool that actually understands how a driving school works. TCA tracking alone is worth the price.', name: 'Mark Martin', role: 'CS Teacher & Mentor', initials: 'MM', bg: 'linear-gradient(135deg, #F97316, #EC4899)' },
]

// ─── Pricing Tiers ───────────────────────────────────────────────────
const PRICING_TIERS = [
  { name: 'Starter', price: '$99', desc: 'For small schools getting started.', features: ['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking'], highlighted: false, cta: 'Get started' },
  { name: 'Growth', price: '$199', desc: 'For growing schools that need more power.', features: ['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support'], highlighted: true, cta: 'Start free trial' },
  { name: 'Enterprise', price: '$399', desc: 'For multi-location schools.', features: ['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager'], highlighted: false, cta: 'Contact sales' },
]

// ─── Main Page ──────────────────────────────────────────────────────
export default function HomePage() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('visible')
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav className="navbar">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>DC</div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>The Driving Center</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/login" style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '400' }}>Sign in</Link>
            <Link href="/signup" className="btn-ghost" style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '600', textDecoration: 'none', borderRadius: '999px' }}>See pricing</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ────────────────────────────── */}
      <section style={{ padding: '100px 24px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,86,255,0.12) 0%, transparent 70%)',
        }} />
        <div className="bg-circle" style={{ width: '400px', height: '400px', left: '5%', top: '20%', background: '#1A56FF', filter: 'blur(120px)', opacity: 0.08 }} />
        <div className="bg-circle" style={{ width: '300px', height: '300px', right: '10%', top: '40%', background: '#8B5CF6', filter: 'blur(100px)', opacity: 0.08 }} />
        <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="fade-up" style={{ marginBottom: '32px' }}>
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Trusted by driving schools in Tennessee
            </span>
          </div>
          <div className="fade-up">
            <h1 style={{
              fontSize: 'clamp(2.5rem, 7vw, 64px)',
              fontWeight: '800', lineHeight: '1.0', letterSpacing: '-0.03em',
              color: 'var(--text-primary)', marginBottom: '24px',
            }}>
              The simplest way to run<br />your driving school.
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.65', maxWidth: '480px', marginBottom: '40px', fontWeight: '400' }}>
              Automate bookings, track student progress, manage instructors, and get paid — all in one place.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
              <Link href="/signup" className="btn-glow" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', borderRadius: '999px' }}>Get Started</Link>
              <Link href="/signup" className="btn-ghost" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', borderRadius: '999px' }}>Start free trial</Link>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No credit card required · 14-day free trial · Cancel anytime</p>
          </div>
          <DashboardMockup />
        </div>
      </section>

      {/* ── SECTION 3: SOCIAL PROOF ─────────────────────── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px', fontWeight: '600' }}>
            Trusted by driving schools in Tennessee
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '32px' }}>
            {['Knoxville', 'Nashville', 'Chattanooga', 'Memphis', 'Oneida', 'Cumberland'].map(city => (
              <span key={city} style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>{city}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: FEATURES ─────────────────────────── */}
      <section style={{ padding: '120px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>The tool</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 48px)', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
          </div>
          <div className="bento-grid fade-up">
            {FEATURE_CARDS.map((f, i) => (
              <div key={f.title} className={`glass-card ${i === 0 ? 'bento-large' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  width: i === 0 ? '64px' : '48px',
                  height: i === 0 ? '64px' : '48px',
                  borderRadius: i === 0 ? '16px' : '12px',
                  background: f.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)', flexShrink: 0,
                }}>
                  <svg width={i === 0 ? 32 : 24} height={i === 0 ? 32 : 24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.01em' }}>{f.title}</h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PRICING ──────────────────────────── */}
      <section style={{ padding: '120px 24px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 48px)', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-secondary)' }}>No setup fees. No per-seat charges. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {PRICING_TIERS.map(t => (
              <div key={t.name} className="fade-up">
                <PricingCard name={t.name} price={t.price} desc={t.desc} features={t.features} highlighted={t.highlighted} cta={t.cta} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: TESTIMONIALS ─────────────────────── */}
      <section style={{ padding: '120px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>What instructors say</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 48px)', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Real feedback from<br />real schools.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {TESTIMONIALS.map(t => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: BOOKING WIDGET (always dark) ──────── */}
      <section style={{ padding: '120px 24px', background: '#0D1117', position: 'relative', overflow: 'hidden' }}>
        <div className="bg-circle" style={{ width: '300px', height: '300px', left: '-5%', top: '10%', background: '#4ADE80', filter: 'blur(120px)', opacity: 0.1 }} />
        <div className="bg-circle" style={{ width: '250px', height: '250px', right: '5%', bottom: '10%', background: '#8B5CF6', filter: 'blur(100px)', opacity: 0.1 }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 45%) 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Left */}
            <div className="fade-up">
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 48px)', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.1', marginBottom: '16px' }}>
                Let&apos;s talk.
              </h2>
              <p style={{ fontSize: '17px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '32px' }}>
                30 minutes. No pitch. Just a real walkthrough.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['See the platform live', 'Ask anything about your school', 'Get a custom setup plan'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#94A3B8' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M3 8l3.5 3.5 6.5-7" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <DecorativeCircles />
            </div>
            {/* Right */}
            <div className="fade-up">
              <BookingCalendar />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CTA ──────────────────────────────── */}
      <section style={{ padding: '120px 24px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div className="fade-up">
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 48px)', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Ready to grow your school?
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
              14-day free trial. No credit card required.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/signup" className="btn-glow" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', borderRadius: '999px' }}>Start free trial</Link>
              <Link href="/signup" className="btn-ghost" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', borderRadius: '999px' }}>Book a call</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: FOOTER ───────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-base)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700' }}>DC</div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>The Driving Center</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/legal/privacy" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/legal/terms" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</Link>
            <Link href="/login" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Login</Link>
            <Link href="/signup" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>Sign up</Link>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>© 2026 The Driving Center</span>
        </div>
      </footer>

      <ScrollToTop />
    </main>
  )
}