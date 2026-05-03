'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarCheck,
  BellRing,
  Users,
  CreditCard,
  UserCog,
  ShieldCheck,
} from 'lucide-react'

// ─── Dashboard Mockup (inside hero) ─────────────────────────────────
function DashboardMockup() {
  const labelStyle = { fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }
  const valueStyle = { fontSize: '12px', color: 'var(--text-primary)', fontWeight: '600' }
  const mutedStyle = { fontSize: '11px', color: 'var(--text-muted)' }
  const rowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  }

  return (
    <div style={{
      background: '#131316',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {/* Window chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '11px 16px', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA41' }} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>app.the-driving-center.com</span>
      </div>
      {/* App layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr' }}>
        {/* Sidebar */}
        <div style={{ borderRight: '1px solid var(--border)', padding: '14px 0' }}>
          {[
            { icon: '◈', label: 'Dashboard', active: true },
            { icon: '◉', label: 'Students' },
            { icon: '◎', label: 'Sessions' },
            { icon: '◌', label: 'Billing' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
              background: item.active ? 'var(--accent-glow)' : 'transparent',
              borderLeft: item.active ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '13px', color: item.active ? 'var(--accent)' : 'var(--text-muted)' }}>{item.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: item.active ? '600' : '500', color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>
        {/* Content */}
        <div style={{ padding: '14px 18px' }}>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            {[
              { label: 'Total Students', value: '24', sub: '+3 this week' },
              { label: 'Hours Logged', value: '6.4h', sub: '+1.2h today' },
              { label: 'Monthly Rev', value: '$840', sub: '+$120' },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '10px 12px' }}>
                <p style={{ ...labelStyle, marginBottom: '3px' }}>{kpi.label}</p>
                <p style={{ ...valueStyle, fontSize: '17px', letterSpacing: '-0.02em', lineHeight: '1' }}>{kpi.value}</p>
                <p style={{ fontSize: '10px', color: 'var(--success)', fontWeight: '600' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>
          {/* Sparkline chart */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
            <p style={{ ...labelStyle, marginBottom: '8px' }}>Weekly Sessions</p>
            <svg width='100%' height='36' viewBox='0 0 200 36' preserveAspectRatio='none' style={{ display: 'block' }}>
              <defs>
                <linearGradient id='sg' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='var(--accent)' stopOpacity='0.25' />
                  <stop offset='100%' stopColor='var(--accent)' stopOpacity='0' />
                </linearGradient>
              </defs>
              <path d='M0,30 L28,24 L56,26 L84,12 L112,19 L140,8 L168,16 L196,6 L200,6 L200,36 L0,36 Z' fill='url(#sg)' />
              <path d='M0,30 L28,24 L56,26 L84,12 L112,19 L140,8 L168,16 L196,6' stroke='var(--accent)' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <span key={d} style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{d}</span>)}
            </div>
          </div>
          {/* Recent rows */}
          <div>
            {[
              { name: 'Jake Thompson', action: 'completed session', time: '2h ago', pct: '78%' },
              { name: 'Sarah Miller', action: 'booked May 12', time: '4h ago', pct: '45%' },
              { name: 'Marcus Lee', action: 'TCA certified ✓', time: 'Yesterday', pct: '100%' },
            ].map(r => (
              <div key={r.name} style={rowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', fontWeight: '700', color: 'var(--accent)', flexShrink: 0,
                  }}>
                    {r.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)' }}>{r.name}</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{r.action}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '3px', background: 'var(--border)', borderRadius: '2px' }}>
                    <div style={{ width: r.pct, height: '100%', background: 'var(--accent)', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'right' }}>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Feature Cards ───────────────────────────────────────────────────

/** Large bento feature card (spans 2 cols) */
function FeatureLarge({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card bento-large" style={{
      display: 'flex', flexDirection: 'column', gap: '16px',
      padding: '28px',
      background: '#1C1D21',
      border: '1px solid rgba(255,255,255,0.08)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,82,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3', letterSpacing: '-0.01em', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0, maxWidth: '480px' }}>{desc}</p>
      {/* Accent bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'var(--accent)', borderRadius: '0 0 16px 16px', opacity: 0.6 }} />
    </div>
  )
}

/** Small compact feature card (1 col) */
function FeatureSmall({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card" style={{
      display: 'flex', flexDirection: 'column', gap: '8px',
      padding: '20px',
      background: '#1C1D21',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,82,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
        {icon}
      </div>
      <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3', letterSpacing: '-0.01em', margin: 0 }}>{title}</h4>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>{desc}</p>
    </div>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────
function PricingCard({ name, price, desc, features, highlighted, cta }: {
  name: string; price: string; desc: string;
  features: string[]; highlighted?: boolean; cta: string;
}) {
  return (
    <div className={`glass-card ${highlighted ? 'pricing-highlight' : ''}`} style={{
      display: 'flex', flexDirection: 'column',
      background: highlighted ? '#1C1D21' : undefined,
    }}>
      {highlighted && (
        <span className="pricing-badge" style={{ alignSelf: 'flex-start', marginBottom: '4px' }}>Most Popular</span>
      )}
      <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
        {name}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
        <span style={{ fontSize: '40px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1', letterSpacing: '-0.02em' }}>{price}</span>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/mo</span>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>{desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <svg width='14' height='14' viewBox='0 0 16 16' fill='none' style={{ flexShrink: 0 }}>
              <path d='M3 8l3.5 3.5 6.5-7' stroke={highlighted ? 'var(--accent)' : 'var(--success)'} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
      {highlighted ? (
        <Link href='/signup' style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
          padding: '12px 24px', background: '#FACC15', color: '#000', fontWeight: '700',
          fontSize: '14px', borderRadius: '999px', border: 'none', cursor: 'pointer',
          textDecoration: 'none', whiteSpace: 'nowrap', transition: 'transform 0.2s',
        }}>
          {cta} <ArrowRight size={14} />
        </Link>
      ) : (
        <Link href='/signup' className="btn-ghost" style={{ justifyContent: 'center' }}>
          {cta} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}

// ─── FAQ Item ──────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="accordion-item">
      <details>
        <summary className="accordion-trigger" style={{ listStyle: 'none' }}>
          <span>{question}</span>
          <svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'
            style={{ flexShrink: 0, transition: 'transform 0.2s' }} className='faq-chevron'>
            <path d='M4 6l4 4 4-4'/>
          </svg>
        </summary>
        <div className="accordion-content">
          <p>{answer}</p>
        </div>
      </details>
    </div>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  { name: 'Starter', price: '$99', desc: 'For small schools getting started.', features: ['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking'], highlighted: false, cta: 'Start free trial' },
  { name: 'Growth', price: '$199', desc: 'For schools ready to scale.', features: ['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support'], highlighted: true, cta: 'Start free trial' },
  { name: 'Enterprise', price: '$499', desc: 'For multi-location schools.', features: ['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager'], highlighted: false, cta: 'Contact sales' },
]

const FAQ_ITEMS = [
  { question: 'Do I need a credit card to start?', answer: 'No. Start with a 14-day free trial — no payment info required. At the end of the trial, you choose a plan or your account pauses.' },
  { question: 'Is my school data isolated from other schools?', answer: 'Yes. Multi-tenant Row-Level Security (RLS) is enforced at the database level. Your students never see another school\'s data — ever.' },
  { question: 'How does TCA tracking work?', answer: 'Every session you log counts toward Tennessee Certificate of Completion (TCC) requirements. When a student completes their required hours, the certificate generates automatically.' },
  { question: 'What happens after the free trial?', answer: 'You choose a plan: Starter ($99/mo), Growth ($199/mo), or Enterprise ($499/mo). All plans include a 14-day free trial.' },
  { question: 'Can I invite my existing instructor team?', answer: 'Yes. Invite unlimited instructors to your school. Set their availability, assign students, and track their session logs from the instructor dashboard.' },
]

// ─── Main Page ─────────────────────────────────────────────────────────
export default function HomePage() {
  // Force dark theme for this landing page
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  return (
    <main style={{ background: '#0B0B0E', color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <div className="navbar">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          {/* Logo */}
          <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>The Driving Center</span>
          </Link>
          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href='#features' style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</Link>
            <Link href='#pricing' style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Pricing</Link>
            <Link href='#faq' style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>FAQ</Link>
          </div>
          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href='/login' className="btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }}>Log in</Link>
            <Link href='/signup' style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: '#FACC15', color: '#000', fontWeight: '700',
              fontSize: '13px', borderRadius: '999px', border: 'none', cursor: 'pointer',
              textDecoration: 'none', whiteSpace: 'nowrap', transition: 'transform 0.2s',
            }}>
              Start free trial
            </Link>
          </div>
        </div>
      </div>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ background: '#0B0B0E', position: 'relative', overflow: 'hidden', padding: '120px 0 80px' }}>
        {/* Radial gradient backdrop */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,82,255,0.08) 0%, transparent 70%)',
        }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '64px', alignItems: 'center' }}>

            {/* Left: headline + CTAs */}
            <div>
              {/* Eyebrow badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)',
                letterSpacing: '0.04em', marginBottom: '28px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
                Scheduling Software for Driving Schools
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(56px, 6vw, 80px)',
                fontWeight: '800',
                lineHeight: '1.04',
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                margin: 0,
                marginBottom: '20px',
              }}>
                <span>The simplest way to</span><br />
                <span>run your driving school</span>
              </h1>

              {/* Subheadline */}
              <p style={{
                fontSize: '18px',
                color: 'var(--text-secondary)',
                lineHeight: '1.65',
                margin: '0 0 36px',
              }}>
                Online booking, automated reminders, student tracking, and billing — all in one place.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href='/signup' style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 28px', background: '#FACC15', color: '#000', fontWeight: '700',
                  fontSize: '15px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                  textDecoration: 'none', whiteSpace: 'nowrap', transition: 'transform 0.2s',
                }}>
                  Start free trial <ArrowRight size={16} />
                </Link>
                <Link href='/demo' className="btn-ghost" style={{ padding: '14px 28px', fontSize: '15px' }}>
                  See a demo
                </Link>
              </div>

              {/* Trust line */}
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px' }}>
                Trusted by 50+ driving schools across Tennessee
              </p>
            </div>

            {/* Right: Dashboard Mockup */}
            <div style={{ position: 'relative' }}>
              {/* Subtle glow behind mockup */}
              <div style={{
                position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%',
                background: 'radial-gradient(ellipse at center, rgba(0,82,255,0.15) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden', background: '#131316' }}>
                  <DashboardMockup />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES (BENTO GRID) ────────────────────────────── */}
      <section id='features' style={{ padding: '80px 24px', background: '#0B0B0E' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-eyebrow">Everything your school needs</p>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '48px', maxWidth: '560px',
          }}>
            Everything your school needs to grow
          </h2>

          <div className="bento-grid">
            {/* Row 1: Large (span 2) + Small */}
            <FeatureLarge
              icon={<CalendarCheck size={24} />}
              title="Online Booking"
              desc="Students pick a time, pay upfront, get confirmed. Instructors see their schedule in one place. No back-and-forth texts."
            />
            <FeatureSmall
              icon={<Users size={20} />}
              title="Student Tracking"
              desc="Every session counts toward Tennessee Certificate of Completion."
            />

            {/* Row 2: Small + Large (span 2) */}
            <FeatureSmall
              icon={<CreditCard size={20} />}
              title="Stripe Billing"
              desc="Accept payments online. No chasing checks."
            />
            <FeatureLarge
              icon={<BellRing size={24} />}
              title="Automated Reminders"
              desc="SMS and email go out 48 hours and 4 hours before each session. Fewer no-shows, less rescheduling."
            />

            {/* Row 3: Small + Small + Small */}
            <FeatureSmall
              icon={<UserCog size={20} />}
              title="Instructor Management"
              desc="Invite instructors, set availability, assign students."
            />
            <FeatureSmall
              icon={<ShieldCheck size={20} />}
              title="Multi-tenant Security"
              desc="Row-Level Security — your data stays yours."
            />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', background: '#131316' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
            {[
              { value: '50+', label: 'Schools' },
              { value: '10,000+', label: 'Sessions Booked' },
              { value: '$2M+', label: 'Processed' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '20px 16px',
                position: 'relative',
              }}>
                {i > 0 && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '1px', background: 'rgba(255,255,255,0.07)',
                  }} />
                )}
                <span style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: '1' }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#0B0B0E' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-eyebrow">How it works</p>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '48px',
          }}>
            Up and running in an afternoon
          </h2>

          {/* Steps with connecting line */}
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute', top: '48px', left: 'calc(16.67% + 24px)', right: 'calc(16.67% + 24px)',
              height: '2px',
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 6px, transparent 6px, transparent 12px)',
              pointerEvents: 'none', zIndex: 0,
            }} />

            {[
              { step: '01', title: 'Create your school', desc: 'Set your school name, add instructors, configure session types and pricing.' },
              { step: '02', title: 'Add instructors & students', desc: 'Invite your team. Students sign up through your booking link in seconds.' },
              { step: '03', title: 'Start accepting bookings', desc: 'Share your link. Students book, pay, and confirm automatically. No manual work.' },
            ].map((s, i) => (
              <div key={s.step} className="glass-card" style={{
                display: 'flex', flexDirection: 'column', gap: '12px',
                background: '#1C1D21', border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '28px', position: 'relative', zIndex: 1,
              }}>
                {/* Huge muted step number */}
                <div style={{
                  fontSize: '80px', fontWeight: '800', lineHeight: '0.7',
                  color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.04em',
                  userSelect: 'none', position: 'absolute', top: '12px', right: '16px',
                }}>
                  {s.step}
                </div>
                {/* Step dot */}
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: 'var(--accent)', boxShadow: '0 0 12px var(--accent-glow)',
                  marginBottom: '4px', position: 'relative', zIndex: 2,
                }} />
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3', margin: 0, position: 'relative', zIndex: 1 }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0, position: 'relative', zIndex: 1 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section id='pricing' style={{ padding: '80px 24px', background: '#0B0B0E' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-eyebrow">Pricing</p>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '10px',
          }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '48px' }}>No setup fees. No per-seat surprises. Cancel anytime.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            {PRICING_TIERS.map(t => <PricingCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id='faq' style={{ padding: '80px 24px', background: '#131316' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p className="section-eyebrow">FAQ</p>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '40px',
          }}>
            Common questions
          </h2>
          <div className="accordion-panel">
            {FAQ_ITEMS.map(item => <FaqItem key={item.question} {...item} />)}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#0B0B0E' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '16px',
          }}>
            Ready to simplify your school?
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '40px' }}>
            Join 50+ Tennessee driving schools already using The Driving Center.
            <br />14-day free trial. No credit card required.
          </p>
          <Link href='/signup' style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 32px', background: '#FACC15', color: '#000', fontWeight: '700',
            fontSize: '16px', borderRadius: '999px', border: 'none', cursor: 'pointer',
            textDecoration: 'none', whiteSpace: 'nowrap', transition: 'transform 0.2s',
          }}>
            Start free trial <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'transparent', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Logo + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span className="footer-link">The Driving Center</span>
          </div>
          {/* Links */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href='/legal/privacy' className="footer-link">Privacy</Link>
            <Link href='/legal/terms' className="footer-link">Terms</Link>
            <Link href='/login' className="footer-link">Sign in</Link>
          </div>
          {/* Copyright */}
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>© 2026 The Driving Center</span>
        </div>
      </footer>

    </main>
  )
}
