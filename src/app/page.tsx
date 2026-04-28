'use client'
import Link from 'next/link'

// ─── Bento Card ─────────────────────────────────────────────────────
function BentoCard({ title, subtitle, value, change, changeType, wide }: {
  title: string; subtitle?: string; value: string; change?: string; changeType?: 'up' | 'down'; wide?: boolean;
}) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '24px',
      padding: '32px',
      gridColumn: wide ? 'span 2' : undefined,
      boxShadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <p style={{ fontSize: '12px', fontWeight: '600', color: '#667085', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{title}</p>
      {subtitle && <p style={{ fontSize: '13px', color: '#667085', margin: 0 }}>{subtitle}</p>}
      <p style={{ fontSize: '40px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em', lineHeight: '1.1', margin: 0 }}>{value}</p>
      {change && (
        <p style={{
          fontSize: '12px', fontWeight: '600',
          color: changeType === 'up' ? '#12B76A' : '#F04438',
          background: changeType === 'up' ? '#F2F7E8' : '#FFF0ED',
          padding: '3px 8px', borderRadius: '6px', display: 'inline-block', width: 'fit-content', margin: 0,
        }}>
          {change}
        </p>
      )}
    </div>
  )
}

// ─── Feature Item ────────────────────────────────────────────────────
function FeatureItem({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ fontSize: '11px', fontWeight: '700', color: '#9A9FA5', letterSpacing: '0.08em' }}>{num}</p>
      <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#101828', letterSpacing: '-0.01em', lineHeight: '1.3', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#667085', lineHeight: '1.65', margin: 0 }}>{desc}</p>
    </div>
  )
}

// ─── Pricing Card ───────────────────────────────────────────────────
function PricingCard({ name, price, desc, features, highlighted, cta }: {
  name: string; price: string; desc: string;
  features: string[]; highlighted?: boolean; cta: string;
}) {
  return (
    <div style={{
      background: highlighted ? '#101828' : '#FFFFFF',
      borderRadius: '24px',
      padding: '32px',
      border: highlighted ? 'none' : '1px solid #E4E7EC',
      boxShadow: highlighted
        ? '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)'
        : 'none',
      display: 'flex', flexDirection: 'column',
    }}>
      <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: highlighted ? '#667085' : '#667085', marginBottom: '12px' }}>
        {name}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
        <span style={{ fontSize: '44px', fontWeight: '800', color: highlighted ? '#FFFFFF' : '#101828', lineHeight: '1', letterSpacing: '-0.02em' }}>{price}</span>
        <span style={{ fontSize: '14px', color: highlighted ? '#667085' : '#9A9FA5' }}>/mo</span>
      </div>
      <p style={{ fontSize: '14px', color: highlighted ? '#667085' : '#667085', marginBottom: '24px', lineHeight: '1.5' }}>{desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: highlighted ? '#FFFFFF' : '#344054' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 8l3.5 3.5 6.5-7" stroke={highlighted ? '#12B76A' : '#12B76A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/signup" style={{
        display: 'flex', justifyContent: 'center',
        padding: '12px 24px', borderRadius: '12px',
        fontSize: '14px', fontWeight: '600', textDecoration: 'none',
        background: highlighted ? '#FFFFFF' : '#101828',
        color: highlighted ? '#101828' : '#FFFFFF',
      }}>
        {cta}
      </Link>
    </div>
  )
}

// ─── FAQ Item ───────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details style={{ borderBottom: '1px solid #F2F4F7', padding: '20px 0', cursor: 'pointer' }}>
      <summary style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#101828' }}>{question}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'transform 0.2s' }} className="faq-chevron">
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </summary>
      <p style={{ fontSize: '14px', color: '#667085', lineHeight: '1.7', marginTop: '12px' }}>{answer}</p>
      <style>{`details[open] .faq-chevron { transform: rotate(180deg); }`}</style>
    </details>
  )
}

// ─── Data ───────────────────────────────────────────────────────────
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

// ─── Main Page ──────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main style={{ background: '#F2F4F7', color: '#101828', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#FFFFFF',
        borderBottom: '1px solid #E4E7EC',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#101828', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '12px', fontWeight: '700', flexShrink: 0,
            }}>DC</div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#101828' }}>The Driving Center</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="#features" style={{ fontSize: '14px', color: '#344054', textDecoration: 'none', fontWeight: '500' }}>Features</Link>
            <Link href="#pricing" style={{ fontSize: '14px', color: '#344054', textDecoration: 'none', fontWeight: '500' }}>Pricing</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/login" style={{ fontSize: '14px', color: '#344054', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
            <Link href="/signup" style={{
              background: '#101828', color: '#FFFFFF',
              padding: '10px 20px', borderRadius: '10px',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none',
            }}>Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 72px', background: '#F2F4F7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
            {/* Left: headline + CTA */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#667085', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
                Scheduling and payment software
              </p>
              <h1 style={{
                fontSize: '52px', fontWeight: '800', lineHeight: '1.05',
                letterSpacing: '-0.025em', color: '#101828', marginBottom: '20px',
              }}>
                The easier way<br />to run your<br />driving school.
              </h1>
              <p style={{
                fontSize: '17px', color: '#667085', lineHeight: '1.65',
                maxWidth: '420px', marginBottom: '36px',
              }}>
                Automate bookings, track student progress, get paid online. Built for driving schools in Tennessee.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/signup" style={{
                  background: '#101828', color: '#FFFFFF',
                  padding: '13px 24px', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '600', textDecoration: 'none',
                }}>
                  Start free trial
                </Link>
                <Link href="#features" style={{
                  border: '1px solid #E4E7EC', color: '#101828',
                  padding: '13px 24px', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '600', textDecoration: 'none',
                  background: '#FFFFFF',
                }}>
                  See how it works
                </Link>
              </div>
              <p style={{ fontSize: '13px', color: '#9A9FA5', marginTop: '16px' }}>No credit card required · 14-day free trial</p>
            </div>

            {/* Right: Dashboard bento grid */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
              display: 'flex', flexDirection: 'column', gap: '20px',
            }}>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Students</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em', lineHeight: '1' }}>24</p>
                  <p style={{ fontSize: '11px', color: '#12B76A', fontWeight: '600', background: '#F2F7E8', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>+3 this week</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em', lineHeight: '1' }}>6.4h</p>
                  <p style={{ fontSize: '11px', color: '#12B76A', fontWeight: '600', background: '#F2F7E8', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>+1.2h today</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em', lineHeight: '1' }}>$840</p>
                  <p style={{ fontSize: '11px', color: '#12B76A', fontWeight: '600', background: '#F2F7E8', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>+$120</p>
                </div>
              </div>
              {/* Weekly sessions bar chart */}
              <div style={{ background: '#F2F4F7', borderRadius: '16px', padding: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#667085', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Sessions</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
                  {[
                    { h: 0.5, label: 'Mon' },
                    { h: 0.75, label: 'Tue' },
                    { h: 0.55, label: 'Wed' },
                    { h: 0.9, label: 'Thu' },
                    { h: 0.65, label: 'Fri' },
                    { h: 0.8, label: 'Sat' },
                  ].map((bar) => (
                    <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: '100%',
                        height: `${bar.h * 100}%`,
                        background: 'linear-gradient(180deg, #2E90FA 0%, #D1E3F8 100%)',
                        borderRadius: '6px 6px 0 0',
                        minHeight: '8px',
                      }} />
                      <p style={{ fontSize: '10px', color: '#667085', fontWeight: '500' }}>{bar.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent activity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent</p>
                {[
                  { name: 'Jake Thompson', action: 'completed a session', time: '2h ago', type: 'up' },
                  { name: 'Sarah Miller', action: 'booked May 12', time: '4h ago', type: 'up' },
                  { name: 'Marcus Lee', action: 'TCA certificate issued', time: 'Yesterday', type: 'up' },
                ].map(item => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2E90FA 0%, #D1E3F8 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: '700', color: '#fff', flexShrink: 0,
                      }}>{item.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#101828' }}>{item.name}</p>
                        <p style={{ fontSize: '12px', color: '#667085' }}>{item.action}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: '#9A9FA5', fontWeight: '500' }}>{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────────────── */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #E4E7EC', borderBottom: '1px solid #E4E7EC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9A9FA5', marginBottom: '20px' }}>
            Built for Tennessee driving schools
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {['Knoxville', 'Nashville', 'Chattanooga', 'Oneida', 'Cumberland'].map((city, i) => (
              <span key={city} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#667085', fontWeight: '500' }}>{city}</span>
                {i < 4 && <span style={{ color: '#E4E7EC' }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────── */}
      <section id="features" style={{ padding: '80px 24px', background: '#F2F4F7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667085', marginBottom: '14px' }}>Platform</p>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em', lineHeight: '1.15', margin: 0 }}>
              What you get
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {FEATURES.map(f => (
              <FeatureItem key={f.num} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF', borderTop: '1px solid #E4E7EC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667085', marginBottom: '14px' }}>Setup</p>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em', lineHeight: '1.15', margin: 0 }}>
              Up and running in an afternoon
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid #E4E7EC' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{
                padding: '40px 32px',
                borderRight: i < 2 ? '1px solid #E4E7EC' : 'none',
                background: '#FFFFFF',
              }}>
                <p style={{ fontSize: '48px', fontWeight: '800', color: '#E4E7EC', lineHeight: '1', marginBottom: '20px', letterSpacing: '-0.03em' }}>{step.step}</p>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#101828', marginBottom: '10px', lineHeight: '1.3' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#667085', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────── */}
      <section id="pricing" style={{ padding: '80px 24px', background: '#F2F4F7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667085', marginBottom: '14px' }}>Pricing</p>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '12px' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '16px', color: '#667085' }}>No setup fees. No per-seat surprises. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {PRICING_TIERS.map(t => (
              <PricingCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px 24px', background: '#FFFFFF', borderTop: '1px solid #E4E7EC' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667085', marginBottom: '14px' }}>FAQ</p>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#101828', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
              Common questions
            </h2>
          </div>
          <div style={{ padding: '0 4px' }}>
            {FAQ_ITEMS.map(item => (
              <FaqItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK CTA ──────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#101828' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '16px' }}>
            Ready to set up your school?
          </h2>
          <p style={{ fontSize: '17px', color: '#667085', marginBottom: '40px' }}>
            14-day free trial. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              background: '#FFFFFF', color: '#101828',
              padding: '13px 28px', borderRadius: '12px',
              fontSize: '15px', fontWeight: '600', textDecoration: 'none',
            }}>
              Start free trial
            </Link>
            <Link href="/book" style={{
              border: '1px solid #344054', color: '#FFFFFF',
              padding: '13px 28px', borderRadius: '12px',
              fontSize: '15px', fontWeight: '600', textDecoration: 'none',
            }}>
              See a demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #E4E7EC', background: '#FFFFFF', padding: '28px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#101828', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700' }}>DC</div>
            <span style={{ fontSize: '13px', color: '#667085' }}>The Driving Center</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/legal/privacy" style={{ fontSize: '13px', color: '#667085', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/legal/terms" style={{ fontSize: '13px', color: '#667085', textDecoration: 'none' }}>Terms</Link>
            <Link href="/login" style={{ fontSize: '13px', color: '#667085', textDecoration: 'none' }}>Sign in</Link>
          </div>
          <span style={{ fontSize: '13px', color: '#9A9FA5' }}>© 2026 The Driving Center</span>
        </div>
      </footer>

    </main>
  )
}
