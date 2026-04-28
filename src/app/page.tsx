'use client'
import Link from 'next/link'

// ─── Dark mode tokens ───────────────────────────────────────────────
const DARK = {
  bg: '#0B0C0E',
  surface: '#131316',
  elevated: '#1C1D21',
  border: 'rgba(255,255,255,0.07)',
  borderLight: 'rgba(255,255,255,0.04)',
  textPrimary: '#FFFFFF',
  textSecondary: '#8A8F98',
  textMuted: '#555660',
  accent: '#3B82F6',
  accentDim: 'rgba(59,130,246,0.18)',
}

// ─── Nav ─────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: '64px', display: 'flex', alignItems: 'center',
      background: DARK.bg, borderBottom: `1px solid ${DARK.border}`,
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: DARK.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
              <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: DARK.textPrimary }}>The Driving Center</span>
        </div>
        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href='#features' style={{ fontSize: '14px', color: DARK.textSecondary, textDecoration: 'none', fontWeight: '500' }}>Features</Link>
          <Link href='#pricing' style={{ fontSize: '14px', color: DARK.textSecondary, textDecoration: 'none', fontWeight: '500' }}>Pricing</Link>
          <Link href='#faq' style={{ fontSize: '14px', color: DARK.textSecondary, textDecoration: 'none', fontWeight: '500' }}>FAQ</Link>
        </div>
        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href='/login' style={{ fontSize: '14px', color: DARK.textSecondary, textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
          <Link href='/signup' style={{
            background: DARK.textPrimary, color: '#000',
            padding: '8px 16px', borderRadius: '100px',
            fontSize: '13px', fontWeight: '600', textDecoration: 'none',
          }}>Start free trial</Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Dashboard Mockup (inside hero) ─────────────────────────────────
function DashboardMockup() {
  const labelStyle = { fontSize: '12px', color: DARK.textSecondary, fontWeight: '500' }
  const valueStyle = { fontSize: '12px', color: DARK.textPrimary, fontWeight: '600' }
  const mutedStyle = { fontSize: '11px', color: DARK.textMuted }
  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${DARK.borderLight}` as string }

  return (
    <div style={{
      background: DARK.surface,
      borderRadius: '12px',
      border: `1px solid ${DARK.border}`,
      overflow: 'hidden',
    }}>
      {/* Window chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '11px 16px', borderBottom: `1px solid ${DARK.borderLight}` }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA41' }} />
        <span style={{ fontSize: '11px', color: DARK.textMuted, marginLeft: '8px' }}>app.the-driving-center.com</span>
      </div>
      {/* App layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr' }}>
        {/* Sidebar */}
        <div style={{ borderRight: `1px solid ${DARK.borderLight}`, padding: '14px 0' }}>
          {[
            { icon: '◈', label: 'Dashboard', active: true },
            { icon: '◉', label: 'Students' },
            { icon: '◎', label: 'Sessions' },
            { icon: '◌', label: 'Billing' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px',
              background: item.active ? DARK.accentDim : 'transparent',
              borderLeft: item.active ? `2px solid ${DARK.accent}` : '2px solid transparent',
            }}>
              <span style={{ fontSize: '13px', color: item.active ? DARK.accent : DARK.textMuted }}>{item.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: item.active ? '600' : '500', color: item.active ? DARK.textPrimary : DARK.textSecondary }}>{item.label}</span>
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
              <div key={kpi.label} style={{ background: DARK.elevated, borderRadius: '8px', padding: '10px 12px' }}>
                <p style={{ ...labelStyle, marginBottom: '3px' }}>{kpi.label}</p>
                <p style={{ ...valueStyle, fontSize: '17px', letterSpacing: '-0.02em', lineHeight: '1' }}>{kpi.value}</p>
                <p style={{ fontSize: '10px', color: '#12B76A', fontWeight: '600' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>
          {/* Sparkline chart */}
          <div style={{ background: DARK.elevated, borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
            <p style={{ ...labelStyle, marginBottom: '8px' }}>Weekly Sessions</p>
            <svg width='100%' height='36' viewBox='0 0 200 36' preserveAspectRatio='none' style={{ display: 'block' }}>
              <defs>
                <linearGradient id='sg' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#3B82F6' stopOpacity='0.25' />
                  <stop offset='100%' stopColor='#3B82F6' stopOpacity='0' />
                </linearGradient>
              </defs>
              <path d='M0,30 L28,24 L56,26 L84,12 L112,19 L140,8 L168,16 L196,6 L200,6 L200,36 L0,36 Z' fill='url(#sg)' />
              <path d='M0,30 L28,24 L56,26 L84,12 L112,19 L140,8 L168,16 L196,6' stroke='#3B82F6' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <span key={d} style={{ fontSize: '9px', color: DARK.textMuted }}>{d}</span>)}
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
                    background: DARK.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', fontWeight: '700', color: DARK.accent, flexShrink: 0,
                  }}>
                    {r.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '600', color: DARK.textPrimary }}>{r.name}</p>
                    <p style={{ fontSize: '10px', color: DARK.textSecondary }}>{r.action}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '3px', background: DARK.borderLight, borderRadius: '2px' }}>
                    <div style={{ width: r.pct, height: '100%', background: DARK.accent, borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: DARK.textMuted, minWidth: '40px', textAlign: 'right' }}>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Feature Item ─────────────────────────────────────────────────────
function FeatureItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ fontSize: '11px', fontWeight: '700', color: DARK.textMuted, letterSpacing: '0.08em' }}>{num}</p>
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0B0C0E', letterSpacing: '-0.01em', lineHeight: '1.3', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '13px', color: '#667085', lineHeight: '1.65', margin: 0 }}>{desc}</p>
    </div>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────
function PricingCard({ name, price, desc, features, highlighted, cta }: {
  name: string; price: string; desc: string;
  features: string[]; highlighted?: boolean; cta: string;
}) {
  return (
    <div style={{
      background: highlighted ? '#0B0C0E' : '#FFFFFF',
      borderRadius: '20px',
      padding: '28px',
      border: highlighted ? 'none' : '1px solid #E4E7EC',
      display: 'flex', flexDirection: 'column',
    }}>
      <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667085', marginBottom: '12px' }}>
        {name}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
        <span style={{ fontSize: '40px', fontWeight: '800', color: highlighted ? '#FFFFFF' : '#0B0C0E', lineHeight: '1', letterSpacing: '-0.02em' }}>{price}</span>
        <span style={{ fontSize: '13px', color: '#9B9FA5' }}>/mo</span>
      </div>
      <p style={{ fontSize: '13px', color: '#667085', marginBottom: '24px', lineHeight: '1.5' }}>{desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: highlighted ? '#8A8F98' : '#344054' }}>
            <svg width='14' height='14' viewBox='0 0 16 16' fill='none' style={{ flexShrink: 0 }}>
              <path d='M3 8l3.5 3.5 6.5-7' stroke={highlighted ? '#3B82F6' : '#12B76A'} strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link href='/signup' style={{
        display: 'flex', justifyContent: 'center',
        padding: '11px 20px', borderRadius: '10px',
        fontSize: '13px', fontWeight: '600', textDecoration: 'none',
        background: highlighted ? '#FFFFFF' : '#0B0C0E',
        color: highlighted ? '#0B0C0E' : '#FFFFFF',
      }}>
        {cta}
      </Link>
    </div>
  )
}

// ─── FAQ Item ──────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details style={{ borderBottom: '1px solid #F2F4F7', padding: '18px 0', cursor: 'pointer' }}>
      <summary style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#101828' }}>{question}</span>
        <svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='#667085' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'
          style={{ flexShrink: 0, transition: 'transform 0.2s' }} className='faq-chevron'>
          <path d='M4 6l4 4 4-4'/>
        </svg>
      </summary>
      <p style={{ fontSize: '13px', color: '#667085', lineHeight: '1.7', marginTop: '10px' }}>{answer}</p>
      <style>{`details[open] .faq-chevron { transform: rotate(180deg); }`}</style>
    </details>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────
const FEATURES = [
  { num: '01', title: 'Students book online — no phone tag', desc: 'Students pick a time, pay upfront, get confirmed. Instructors see their schedule in one place.' },
  { num: '02', title: 'TCA tracking that actually works', desc: 'Every session counts toward Tennessee Certificate of Completion. Certificates generate automatically when requirements are met.' },
  { num: '03', title: 'Stripe handles the money', desc: 'Accept payments online. No chasing checks. Students pay when they book. Funds go directly to your bank.' },
  { num: '04', title: 'Instructor management', desc: 'Invite instructors, set availability, assign students. Each instructor sees only their own schedule.' },
  { num: '05', title: 'Automated reminders', desc: 'SMS and email go out 48 hours and 4 hours before each session. Fewer no-shows, less rescheduling.' },
  { num: '06', title: 'Multi-tenant from day one', desc: 'Row-Level Security at the database level. Your students never see another school\'s data — ever.' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Create your school profile', desc: 'Set your school name, add instructors, configure session types and pricing.' },
  { step: '2', title: 'Students book and pay', desc: 'Share your link. Students sign up, pick a session, and pay online.' },
  { step: '3', title: 'Instructors teach — the rest is automatic', desc: 'Instructors log in to see their schedule. Sessions track. Reminders send. Certificates generate.' },
]

const PRICING_TIERS = [
  { name: 'Starter', price: '$99', desc: 'For small schools getting started.', features: ['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking'], highlighted: false, cta: 'Start free trial' },
  { name: 'Growth', price: '$199', desc: 'For schools ready to scale.', features: ['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support'], highlighted: true, cta: 'Start free trial' },
  { name: 'Enterprise', price: '$399', desc: 'For multi-location schools.', features: ['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager'], highlighted: false, cta: 'Contact sales' },
]

const FAQ_ITEMS = [
  { question: 'Do I need a credit card to start?', answer: 'No. Start with a 14-day free trial — no payment info required. At the end of the trial, you choose a plan or your account pauses.' },
  { question: 'Is my school data isolated from other schools?', answer: 'Yes. Multi-tenant Row-Level Security (RLS) is enforced at the database level. Your students never see another school\'s data — ever.' },
  { question: 'How does TCA tracking work?', answer: 'Every session you log counts toward Tennessee Certificate of Completion (TCC) requirements. When a student completes their required hours, the certificate generates automatically.' },
  { question: 'What happens after the free trial?', answer: 'You choose a plan: Starter ($99/mo), Growth ($199/mo), or Enterprise ($399/mo). All plans include a 14-day free trial.' },
  { question: 'Can I invite my existing instructor team?', answer: 'Yes. Invite unlimited instructors to your school. Set their availability, assign students, and track their session logs from the instructor dashboard.' },
]

// ─── Main Page ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main style={{ background: '#F2F4F7', color: '#101828', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── DARK NAV ───────────────────────────────────────── */}
      <div style={{ background: DARK.bg }}><Nav /></div>

      {/* ── HERO (Linear dark mode) ─────────────────────────── */}
      <section style={{ background: DARK.bg, position: 'relative', overflow: 'hidden' }}>
        {/* Top atmospheric glow */}
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 24px 88px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

            {/* Left: headline */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: DARK.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '18px' }}>
                Scheduling and payment software
              </p>
              <h1 style={{
                fontSize: 'clamp(38px, 5vw, 60px)',
                fontWeight: '700',
                lineHeight: '1.04',
                letterSpacing: '-0.03em',
                color: DARK.textPrimary,
                marginBottom: '18px',
              }}>
                The easier way<br />to run your<br />driving school.
              </h1>
              <p style={{
                fontSize: '16px',
                color: DARK.textSecondary,
                lineHeight: '1.65',
                maxWidth: '390px',
                marginBottom: '32px',
              }}>
                Automate bookings, track student progress, get paid online. Built for driving schools in Tennessee.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href='/signup' style={{
                  background: DARK.textPrimary, color: '#000',
                  padding: '11px 22px', borderRadius: '100px',
                  fontSize: '14px', fontWeight: '600', textDecoration: 'none',
                }}>
                  Start free trial
                </Link>
                <Link href='#features' style={{
                  color: DARK.textSecondary,
                  fontSize: '14px', fontWeight: '500', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  See how it works
                  <svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M3 8h10M9 4l4 4-4 4'/>
                  </svg>
                </Link>
              </div>
              <p style={{ fontSize: '12px', color: DARK.textMuted, marginTop: '14px' }}>No credit card required · 14-day free trial</p>
              {/* State badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px', padding: '10px 14px', border: `1px solid ${DARK.border}`, borderRadius: '8px', width: 'fit-content' }}>
                <svg width='14' height='14' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 1L2 4.5H14L8 1Z' fill={DARK.accent} />
                  <path d='M2 4.5V8.5L8 12V7.5H14V4.5H2Z' fill={DARK.accent} fillOpacity='0.6' />
                </svg>
                <span style={{ fontSize: '12px', fontWeight: '600', color: DARK.textSecondary }}>Built for Tennessee</span>
                <span style={{ fontSize: '11px', color: DARK.textMuted }}>Knoxville · Nashville · Chattanooga</span>
              </div>
            </div>

            {/* Right: mockup with glow */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: '-50px',
                background: 'radial-gradient(ellipse at 50% 45%, rgba(59,130,246,0.14) 0%, transparent 65%)',
                pointerEvents: 'none',
              }} />
              <DashboardMockup />
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id='features' style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9FA5', marginBottom: '12px' }}>Platform</p>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0B0C0E', letterSpacing: '-0.02em', lineHeight: '1.15', margin: 0 }}>What you get</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {FEATURES.map(f => <FeatureItem key={f.num} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F2F4F7' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9FA5', marginBottom: '12px' }}>Setup</p>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0B0C0E', letterSpacing: '-0.02em', lineHeight: '1.15', margin: 0 }}>Up and running in an afternoon</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E4E7EC' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{ padding: '36px 28px', borderRight: i < 2 ? '1px solid #E4E7EC' : 'none', background: '#FFFFFF' }}>
                <p style={{ fontSize: '44px', fontWeight: '800', color: '#E4E7EC', lineHeight: '1', marginBottom: '16px', letterSpacing: '-0.03em' }}>{step.step}</p>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0B0C0E', marginBottom: '10px', lineHeight: '1.3' }}>{step.title}</h3>
                <p style={{ fontSize: '13px', color: '#667085', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section id='pricing' style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9FA5', marginBottom: '12px' }}>Pricing</p>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0B0C0E', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '10px' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: '14px', color: '#667085' }}>No setup fees. No per-seat surprises. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'start' }}>
            {PRICING_TIERS.map(t => <PricingCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id='faq' style={{ padding: '80px 24px', background: '#F2F4F7' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9FA5', marginBottom: '12px' }}>FAQ</p>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0B0C0E', letterSpacing: '-0.02em', lineHeight: '1.15' }}>Common questions</h2>
          </div>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '4px 24px' }}>
            {FAQ_ITEMS.map(item => <FaqItem key={item.question} {...item} />)}
          </div>
        </div>
      </section>

      {/* ── DARK CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#0B0C0E' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '14px' }}>Ready to set up your school?</h2>
          <p style={{ fontSize: '15px', color: '#555660', marginBottom: '36px' }}>14-day free trial. No credit card required.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href='/signup' style={{
              background: '#FFFFFF', color: '#0B0C0E',
              padding: '12px 24px', borderRadius: '100px',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none',
            }}>Start free trial</Link>
            <Link href='/book' style={{
              border: `1px solid ${DARK.border}`, color: '#8A8F98',
              padding: '12px 24px', borderRadius: '100px',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none',
            }}>See a demo</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #E4E7EC', background: '#FFFFFF', padding: '24px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#0B0C0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span style={{ fontSize: '13px', color: '#667085' }}>The Driving Center</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href='/legal/privacy' style={{ fontSize: '13px', color: '#667085', textDecoration: 'none' }}>Privacy</Link>
            <Link href='/legal/terms' style={{ fontSize: '13px', color: '#667085', textDecoration: 'none' }}>Terms</Link>
            <Link href='/login' style={{ fontSize: '13px', color: '#667085', textDecoration: 'none' }}>Sign in</Link>
          </div>
          <span style={{ fontSize: '13px', color: '#9B9FA5' }}>© 2026 The Driving Center</span>
        </div>
      </footer>

    </main>
  )
}