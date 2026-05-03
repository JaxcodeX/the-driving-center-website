'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
      background: 'var(--bg-elevated)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
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
              <div key={kpi.label} style={{ background: 'var(--bg-elevated)', borderRadius: '8px', padding: '10px 12px' }}>
                <p style={{ ...labelStyle, marginBottom: '3px' }}>{kpi.label}</p>
                <p style={{ ...valueStyle, fontSize: '17px', letterSpacing: '-0.02em', lineHeight: '1' }}>{kpi.value}</p>
                <p style={{ fontSize: '10px', color: 'var(--success)', fontWeight: '600' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>
          {/* Sparkline chart */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
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

// ─── Feature Item (bento card content) ────────────────────────────────
function FeatureItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)', letterSpacing: '0.08em' }}>{num}</p>
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em', lineHeight: '1.3', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.65', margin: 0 }}>{desc}</p>
    </div>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────
function PricingCard({ name, price, desc, features, highlighted, cta }: {
  name: string; price: string; desc: string;
  features: string[]; highlighted?: boolean; cta: string;
}) {
  return (
    <div className={`glass-card ${highlighted ? 'pricing-highlight' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
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
      <Link href='/signup' className={highlighted ? 'btn-glow' : 'btn-ghost'} style={{ justifyContent: 'center' }}>
        {cta} <ArrowRight size={14} />
      </Link>
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
const FEATURES = [
  { num: '01', title: 'Online Booking', desc: 'Students pick a time, pay upfront, get confirmed. Instructors see their schedule in one place.' },
  { num: '02', title: 'Automated Reminders', desc: 'SMS and email go out 48 hours and 4 hours before each session. Fewer no-shows, less rescheduling.' },
  { num: '03', title: 'Student Tracking', desc: 'Every session counts toward Tennessee Certificate of Completion. Certificates generate automatically when requirements are met.' },
  { num: '04', title: 'Stripe Billing', desc: 'Accept payments online. No chasing checks. Students pay when they book. Funds go directly to your bank.' },
  { num: '05', title: 'Instructor Management', desc: 'Invite instructors, set availability, assign students. Each instructor sees only their own schedule.' },
  { num: '06', title: 'Multi-tenant Security', desc: 'Row-Level Security at the database level. Your students never see another school\'s data — ever.' },
]

const HOW_IT_WORKS = [
  { step: '1', label: 'Step 1 of 3', title: 'Create your school', desc: 'Set your school name, add instructors, configure session types and pricing.' },
  { step: '2', label: 'Step 2 of 3', title: 'Add instructors & students', desc: 'Invite your team. Students sign up through your booking link.' },
  { step: '3', label: 'Step 3 of 3', title: 'Start accepting bookings', desc: 'Share your link. Students book, pay, and confirm automatically.' },
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

const TESTIMONIALS = [
  { initials: 'MR', name: 'Mike R.', school: 'Eastside Driving Academy', quote: 'Finally, software that actually understands how driving schools work. Our booking chaos cleared up overnight.' },
  { initials: 'JL', name: 'Jenny L.', school: 'JL Driving School', quote: 'TCA tracking used to be a nightmare. Now it just happens. My instructors love it.' },
  { initials: 'TW', name: 'Tony W.', school: 'Metro Driving Academy', quote: 'The multi-tenant security sold me. I needed to trust that my student data was truly isolated.' },
]

// ─── Main Page ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

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
          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href='#features' style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Features</Link>
            <Link href='#pricing' style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Pricing</Link>
            <Link href='#faq' style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>FAQ</Link>
          </div>
          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href='/login' className="btn-ghost">Sign in</Link>
            <Link href='/signup' className="btn-glow">Start free trial <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-base)', position: 'relative', overflow: 'hidden', padding: '72px 0 88px' }}>
        {/* Gradient orb */}
        <div className="bg-circle" style={{
          top: '-20%', right: '-10%', width: '600px', height: '600px',
          background: 'var(--accent)', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

            {/* Left: headline */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '18px' }}>
                Scheduling and payment software
              </p>
              <h1 style={{
                fontSize: 'clamp(38px, 5vw, 60px)',
                fontWeight: '700',
                lineHeight: '1.04',
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                marginBottom: '18px',
              }}>
                Scheduling Software for Driving Schools
              </h1>
              <p style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: '1.65',
                maxWidth: '390px',
                marginBottom: '32px',
              }}>
                Online booking, automated reminders, student tracking, and billing — all in one place.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href='/signup' className="btn-pill">Try Demo</Link>
                <Link href='/signup' className="btn-glow">Start free trial <ArrowRight size={14} /></Link>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '14px' }}>No credit card required · 14-day free trial</p>
              {/* State badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px',
                padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', width: 'fit-content',
              }}>
                <svg width='14' height='14' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 1L2 4.5H14L8 1Z' fill='var(--accent)' />
                  <path d='M2 4.5V8.5L8 12V7.5H14V4.5H2Z' fill='var(--accent)' fillOpacity='0.6' />
                </svg>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Built for Tennessee</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Knoxville · Nashville · Chattanooga</span>
              </div>
            </div>

            {/* Right: mockup */}
            <div style={{ position: 'relative' }}>
              <div className="glass-card">
                <DashboardMockup />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES (BENTO GRID) ────────────────────────────── */}
      <section id='features' style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-eyebrow">Features</p>
          <h2 style={{
            fontSize: '32px', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '40px',
          }}>
            Everything your school needs to grow
          </h2>

          <div className="bento-grid">
            <div className="glass-card bento-large">
              <FeatureItem num="01" title="Online Booking" desc="Students pick a time, pay upfront, get confirmed. Instructors see their schedule in one place." />
            </div>
            <div className="glass-card">
              <FeatureItem num="02" title="Automated Reminders" desc="SMS and email go out 48 hours and 4 hours before each session. Fewer no-shows, less rescheduling." />
            </div>
            <div className="glass-card">
              <FeatureItem num="03" title="Student Tracking" desc="Every session counts toward Tennessee Certificate of Completion. Certificates generate automatically." />
            </div>
          </div>

          {/* Metrics row */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div className="glass-card metric-card">
              <span className="metric-value" style={{ color: 'var(--accent)' }}>2.4h</span>
              <span className="metric-sub">saved / week</span>
            </div>
            <div className="glass-card metric-card">
              <span className="metric-value" style={{ color: 'var(--accent)' }}>40%</span>
              <span className="metric-sub">more bookings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-eyebrow">How It Works</p>
          <h2 style={{
            fontSize: '32px', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '40px',
          }}>
            Up and running in an afternoon
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{step.label}</span>
                <p style={{
                  fontSize: '44px', fontWeight: '800', color: 'var(--accent)',
                  lineHeight: '1', letterSpacing: '-0.03em',
                }}>{step.step}</p>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3' }}>{step.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-eyebrow">Testimonials</p>
          <h2 style={{
            fontSize: '32px', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '40px',
          }}>
            Schools that made the switch
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card">
                {/* Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width='14' height='14' viewBox='0 0 16 16' fill='var(--accent)'>
                      <path d='M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 9.3l-3.6 1.9.7-4L2.2 5.2l4-.6L8 1z'/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '20px' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="avatar-circle">{t.initials}</div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section id='pricing' style={{ padding: '80px 24px', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-eyebrow">Pricing</p>
          <h2 style={{
            fontSize: '32px', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '10px',
          }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '40px' }}>No setup fees. No per-seat surprises. Cancel anytime.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {PRICING_TIERS.map(t => <PricingCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id='faq' style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p className="section-eyebrow">FAQ</p>
          <h2 style={{
            fontSize: '32px', fontWeight: '700',
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

      {/* ── CTA (dark surface) ──────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '32px', fontWeight: '700',
            color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '14px',
          }}>
            Ready to set up your school?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '36px' }}>14-day free trial. No credit card required.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href='/signup' className="btn-glow">Start free trial <ArrowRight size={14} /></Link>
            <Link href='/book' className="btn-ghost">See a demo</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-base)', padding: '24px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
              </svg>
            </div>
            <span className="footer-link">The Driving Center</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href='/legal/privacy' className="footer-link">Privacy</Link>
            <Link href='/legal/terms' className="footer-link">Terms</Link>
            <Link href='/login' className="footer-link">Sign in</Link>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>© 2026 The Driving Center</span>
        </div>
      </footer>

    </main>
  )
}
