'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarCheck,
  BellRing,
  Users,
  CreditCard,
  UserCog,
  ShieldCheck,
  Check,
} from 'lucide-react'

// ─── Mesh Gradient Helpers ───────────────────────────────────────────
const meshPinkPurpleBlue = {
  background: `
    radial-gradient(ellipse 80% 60% at 20% 20%, #EC4899 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 80%, #3B82F6 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 50% 50%, #8B5CF6 0%, transparent 70%),
    #18181B
  `,
}

const meshYellowOrange = {
  background: `
    radial-gradient(ellipse 70% 50% at 30% 30%, #FACC15 0%, transparent 55%),
    radial-gradient(ellipse 50% 70% at 70% 70%, #F97316 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 60% 40%, #EF4444 0%, transparent 50%),
    #18181B
  `,
}

const meshBlueCyan = {
  background: `
    radial-gradient(ellipse 60% 60% at 20% 80%, #06B6D4 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 80% 20%, #3B82F6 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 50% 50%, #8B5CF6 0%, transparent 65%),
    #18181B
  `,
}

const meshGreenBlue = {
  background: `
    radial-gradient(ellipse 60% 60% at 70% 30%, #10B981 0%, transparent 55%),
    radial-gradient(ellipse 60% 60% at 30% 70%, #3B82F6 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 50%, #06B6D4 0%, transparent 60%),
    #18181B
  `,
}

// ─── Eyebrow Label ───────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
      color: 'var(--accent-blue)', marginBottom: '12px',
    }}>
      <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--accent-blue)', borderRadius: '2px' }} />
      {children}
    </p>
  )
}

// ─── Section Wrapper ──────────────────────────────────────────────────
function Section({ id, style, children }: { id?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <section
      id={id}
      style={{
        padding: '120px 24px 100px',
        background: '#09090B',
        ...style,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </div>
    </section>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: '68px',
      background: scrolled ? 'rgba(9,9,11,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      transition: 'background 0.3s, backdrop-filter 0.3s',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--accent-blue)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
              <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.75' />
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>The Driving Center</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Features', 'Pricing', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} style={{
              fontSize: '14px', color: '#A1A1AA', textDecoration: 'none', fontWeight: '500',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A1A1AA')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href='/login' style={{ fontSize: '13px', color: '#A1A1AA', textDecoration: 'none', fontWeight: '500' }}>Log in</Link>
          <Link href='/signup' style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '10px 22px',
            background: '#FACC15', color: '#000', fontWeight: '700',
            fontSize: '13px', borderRadius: '100px', textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Start free trial
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Hero Dashboard Mockup ────────────────────────────────────────────
function HeroDashboard() {
  const labelStyle = { fontSize: '11px', color: '#A1A1AA', fontWeight: '500' }
  const valueStyle = { fontSize: '11px', color: '#FFFFFF', fontWeight: '600' }
  const rowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
  }

  return (
    <div style={{
      background: '#131316', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
      overflow: 'hidden', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    }}>
      {/* Window chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA41' }} />
        <span style={{ fontSize: '11px', color: '#71717A', marginLeft: '6px' }}>app.the-driving-center.com</span>
      </div>
      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
        {/* Sidebar */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
          {[
            { icon: '◈', label: 'Dashboard', active: true },
            { icon: '◉', label: 'Students' },
            { icon: '◎', label: 'Sessions' },
            { icon: '◌', label: 'Billing' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px',
              background: item.active ? 'rgba(37,99,235,0.12)' : 'transparent',
              borderLeft: item.active ? '2px solid #3B82F6' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '12px', color: item.active ? '#3B82F6' : '#71717A' }}>{item.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: item.active ? '600' : '500', color: item.active ? '#FFFFFF' : '#71717A' }}>{item.label}</span>
            </div>
          ))}
        </div>
        {/* Content */}
        <div style={{ padding: '12px 16px' }}>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {[
              { label: 'Total Students', value: '24', sub: '+3 this week' },
              { label: 'Hours Logged', value: '6.4h', sub: '+1.2h today' },
              { label: 'Monthly Rev', value: '$840', sub: '+$120' },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: '#1F1F23', borderRadius: '8px', padding: '8px 10px' }}>
                <p style={{ ...labelStyle, marginBottom: '2px' }}>{kpi.label}</p>
                <p style={{ ...valueStyle, fontSize: '15px', letterSpacing: '-0.02em', lineHeight: '1' }}>{kpi.value}</p>
                <p style={{ fontSize: '10px', color: '#4ADE80', fontWeight: '600' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>
          {/* Sparkline */}
          <div style={{ background: '#1F1F23', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
            <p style={{ ...labelStyle, marginBottom: '6px' }}>Weekly Sessions</p>
            <svg width='100%' height='32' viewBox='0 0 200 32' preserveAspectRatio='none' style={{ display: 'block' }}>
              <defs>
                <linearGradient id='hg' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#3B82F6' stopOpacity='0.2' />
                  <stop offset='100%' stopColor='#3B82F6' stopOpacity='0' />
                </linearGradient>
              </defs>
              <path d='M0,26 L28,20 L56,22 L84,8 L112,15 L140,5 L168,13 L196,3 L200,3 L200,32 L0,32 Z' fill='url(#hg)' />
              <path d='M0,26 L28,20 L56,22 L84,8 L112,15 L140,5 L168,13 L196,3' stroke='#3B82F6' strokeWidth='1.5' fill='none' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} style={{ fontSize: '8px', color: '#71717A' }}>{d}</span>
              ))}
            </div>
          </div>
          {/* Rows */}
          <div>
            {[
              { name: 'Jake Thompson', action: 'completed session', time: '2h ago', pct: '78%' },
              { name: 'Sarah Miller', action: 'booked May 12', time: '4h ago', pct: '45%' },
              { name: 'Marcus Lee', action: 'TCA certified ✓', time: 'Yesterday', pct: '100%' },
            ].map(r => (
              <div key={r.name} style={rowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '8px', fontWeight: '700', color: '#3B82F6', flexShrink: 0,
                  }}>
                    {r.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: '600', color: '#FFFFFF' }}>{r.name}</p>
                    <p style={{ fontSize: '10px', color: '#71717A' }}>{r.action}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                    <div style={{ width: r.pct, height: '100%', background: '#3B82F6', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '9px', color: '#52525B', minWidth: '35px', textAlign: 'right' }}>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Logo Strip ──────────────────────────────────────────────────────
function LogoStrip() {
  const logos = [
    { name: 'Nashville Driving', abbr: 'NDS' },
    { name: 'Memphis Auto School', abbr: 'MAS' },
    { name: 'Knoxville Drivers', abbr: 'KXD' },
    { name: 'Chattanooga Ed', abbr: 'CDE' },
    { name: 'Tri-Cities Transit', abbr: 'TCT' },
  ]

  return (
    <section style={{ padding: '48px 24px', background: '#18181B' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B', marginBottom: '28px' }}>
          Trusted by schools across Tennessee
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {logos.map(logo => (
            <div key={logo.name} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              opacity: 0.45, filter: 'grayscale(1)', transition: 'opacity 0.2s, filter 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.filter = 'none' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.45'; e.currentTarget.style.filter = 'grayscale(1)' }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: '800', color: '#71717A', letterSpacing: '-0.02em',
              }}>
                {logo.abbr}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#71717A' }}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Feature Bento ───────────────────────────────────────────────────
function FeatureLarge({ icon, title, desc, meshStyle }: {
  icon: React.ReactNode; title: string; desc: string; meshStyle: React.CSSProperties
}) {
  return (
    <div style={{
      gridColumn: 'span 2',
      background: '#18181B', borderRadius: '24px', overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      position: 'relative',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
    >
      {/* Mesh gradient strip */}
      <div style={{ height: '80px', ...meshStyle }} />
      {/* Content */}
      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(37,99,235,0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: '#3B82F6',
        }}>
          {icon}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3', letterSpacing: '-0.01em' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#A1A1AA', lineHeight: '1.75', maxWidth: '480px' }}>{desc}</p>
      </div>
      {/* Bottom accent bar */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)', borderRadius: '0 0 24px 24px' }} />
    </div>
  )
}

function FeatureSmall({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{
      background: '#18181B', borderRadius: '20px', padding: '24px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column', gap: '10px',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s, border-color 0.3s',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px)'
        el.style.background = '#1F1F23'
        el.style.borderColor = 'rgba(255,255,255,0.13)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.background = '#18181B'
        el.style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: 'rgba(37,99,235,0.12)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: '#3B82F6',
      }}>
        {icon}
      </div>
      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3', margin: 0 }}>{title}</h4>
      <p style={{ fontSize: '13px', color: '#71717A', lineHeight: '1.6', margin: 0 }}>{desc}</p>
    </div>
  )
}

// ─── How It Works Card ────────────────────────────────────────────────
function HowCard({ step, title, desc, meshStyle }: {
  step: string; title: string; desc: string; meshStyle: React.CSSProperties
}) {
  return (
    <div style={{
      background: '#18181B', borderRadius: '28px', overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      position: 'relative',
    }}>
      {/* Mesh gradient top */}
      <div style={{ height: '180px', ...meshStyle, borderRadius: '28px 28px 0 0' }} />
      {/* Bottom half */}
      <div style={{ padding: '28px', position: 'relative' }}>
        {/* Huge muted number behind */}
        <div style={{
          position: 'absolute', top: '8px', right: '20px',
          fontSize: '80px', fontWeight: '800', lineHeight: '1', color: 'rgba(255,255,255,0.04)',
          letterSpacing: '-0.04em', userSelect: 'none',
        }}>
          {step}
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3', marginBottom: '8px', position: 'relative', zIndex: 1 }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#71717A', lineHeight: '1.7', position: 'relative', zIndex: 1 }}>{desc}</p>
      </div>
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
      background: '#18181B', borderRadius: '24px', padding: '32px',
      boxShadow: highlighted ? '0 0 60px rgba(37,99,235,0.25)' : '0 8px 40px rgba(0,0,0,0.5)',
      border: highlighted ? '1.5px solid #2563EB' : '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column', gap: '0',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
    >
      {highlighted && (
        <span style={{
          display: 'inline-block', fontSize: '11px', fontWeight: '700',
          padding: '4px 12px', borderRadius: '999px',
          background: '#2563EB', color: '#FFFFFF',
          letterSpacing: '0.05em', marginBottom: '16px', alignSelf: 'flex-start',
        }}>
          Most Popular
        </span>
      )}

      <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B', marginBottom: '12px' }}>
        {name}
      </p>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
        <span style={{ fontSize: '48px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1', letterSpacing: '-0.03em' }}>{price}</span>
        <span style={{ fontSize: '13px', color: '#52525B' }}>/mo</span>
      </div>

      <p style={{ fontSize: '13px', color: '#71717A', marginBottom: '24px', lineHeight: '1.55' }}>{desc}</p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#A1A1AA' }}>
            <Check size={14} style={{ color: highlighted ? '#3B82F6' : '#4ADE80', flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>

      {highlighted ? (
        <Link href='/signup' style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '14px 28px', background: '#FACC15', color: '#000', fontWeight: '700',
          fontSize: '14px', borderRadius: '100px', border: 'none', cursor: 'pointer',
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          {cta}
        </Link>
      ) : (
        <Link href='/signup' style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '14px 28px', background: 'transparent', color: '#FFFFFF', fontWeight: '600',
          fontSize: '14px', borderRadius: '100px', border: '1.5px solid rgba(255,255,255,0.12)',
          cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap',
          transition: 'background 0.2s, border-color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        >
          {cta}
        </Link>
      )}
    </div>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <details style={{ padding: '0' }}>
        <summary style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0', cursor: 'pointer', listStyle: 'none',
          fontSize: '14px', fontWeight: '600', color: '#FFFFFF',
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#3B82F6'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#FFFFFF'}
        >
          {question}
          <svg width='14' height='14' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5'
            strokeLinecap='round' strokeLinejoin='round' style={{ flexShrink: 0, transition: 'transform 0.2s' }}
            className='faq-chevron'>
            <path d='M4 6l4 4 4-4' />
          </svg>
        </summary>
        <div style={{ padding: '0 0 20px', fontSize: '14px', color: '#71717A', lineHeight: '1.7' }}>
          {answer}
        </div>
      </details>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  {
    name: 'Starter', price: '$99', desc: 'For small schools getting started.',
    features: ['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking'],
    highlighted: false, cta: 'Start free trial',
  },
  {
    name: 'Growth', price: '$199', desc: 'For schools ready to scale.',
    features: ['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support'],
    highlighted: true, cta: 'Start free trial',
  },
  {
    name: 'Enterprise', price: '$499', desc: 'For multi-location schools.',
    features: ['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager'],
    highlighted: false, cta: 'Contact sales',
  },
]

const FAQ_ITEMS = [
  { question: 'Do I need a credit card to start?', answer: 'No. Start with a 14-day free trial — no payment info required. At the end of the trial, you choose a plan or your account pauses.' },
  { question: 'Is my school data isolated from other schools?', answer: 'Yes. Multi-tenant Row-Level Security (RLS) is enforced at the database level. Your students never see another school\'s data — ever.' },
  { question: 'How does TCA tracking work?', answer: 'Every session you log counts toward Tennessee Certificate of Completion (TCC) requirements. When a student completes their required hours, the certificate generates automatically.' },
  { question: 'What happens after the free trial?', answer: 'You choose a plan: Starter ($99/mo), Growth ($199/mo), or Enterprise ($499/mo). All plans include a 14-day free trial.' },
  { question: 'Can I invite my existing instructor team?', answer: 'Yes. Invite unlimited instructors to your school. Set their availability, assign students, and track their session logs from the instructor dashboard.' },
]

// ─── Page ─────────────────────────────────────────────────────────────
export default function HomePage() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  return (
    <main style={{ background: '#09090B', color: '#FFFFFF', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        padding: '140px 24px 100px', background: '#09090B', position: 'relative', overflow: 'hidden',
      }}>
        {/* Bottom yellow glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '400px',
          background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(250,204,21,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '64px', alignItems: 'center' }}>

            {/* Left */}
            <div>
              {/* Eyebrow */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '100px',
                background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.2)',
                fontSize: '11px', fontWeight: '600', color: '#FACC15',
                letterSpacing: '0.06em', marginBottom: '28px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
                SCHEDULING SOFTWARE FOR DRIVING SCHOOLS
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(52px, 7vw, 88px)', fontWeight: '800',
                lineHeight: '1.05', letterSpacing: '-0.03em',
                color: '#FFFFFF', margin: 0, marginBottom: '20px',
              }}>
                The simplest way<br />to run your school
              </h1>

              {/* Sub */}
              <p style={{
                fontSize: '18px', color: '#A1A1AA', lineHeight: '1.7',
                margin: '0 0 36px', maxWidth: '480px',
              }}>
                Online booking, automated reminders, student tracking, and billing — all in one place.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link href='/signup' style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 28px', background: '#FACC15', color: '#000', fontWeight: '700',
                  fontSize: '15px', borderRadius: '100px', textDecoration: 'none',
                  boxShadow: '0 0 40px rgba(250,204,21,0.2)',
                }}>
                  Start free trial <ArrowRight size={16} />
                </Link>
                <Link href='/demo' style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 28px', background: 'transparent', color: '#FFFFFF', fontWeight: '600',
                  fontSize: '15px', borderRadius: '100px', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                >
                  Book a demo
                </Link>
              </div>

              <p style={{ fontSize: '13px', color: '#52525B', marginTop: '24px' }}>
                Trusted by 50+ driving schools across Tennessee
              </p>
            </div>

            {/* Right — mesh gradient card with dashboard inside */}
            <div style={{ position: 'relative' }}>
              <div style={{
                ...meshPinkPurpleBlue,
                borderRadius: '32px',
                padding: '0',
                boxShadow: '0 0 80px rgba(250,204,21,0.12), 0 32px 64px rgba(0,0,0,0.6)',
                overflow: 'hidden',
              }}>
                {/* Card header */}
                <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>DC</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>The Driving Center</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Dashboard</p>
                  </div>
                </div>
                {/* Dashboard inside */}
                <div style={{ padding: '20px' }}>
                  <HeroDashboard />
                </div>
                {/* Card footer */}
                <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(236,72,153,0.4)', border: '2px solid #18181B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: '700', color: '#FFF' }}>M</div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(59,130,246,0.4)', border: '2px solid #18181B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: '700', color: '#FFF' }}>S</div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(168,85,247,0.4)', border: '2px solid #18181B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: '700', color: '#FFF' }}>J</div>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>+24 more</span>
                  </div>
                  <Link href='/signup' style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', background: '#FFFFFF', color: '#000', fontWeight: '700',
                    fontSize: '12px', borderRadius: '100px', textDecoration: 'none',
                  }}>
                    See pricing <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── LOGO STRIP ───────────────────────────────────────── */}
      <LogoStrip />

      {/* ── FEATURES BENTO GRID ─────────────────────────────── */}
      <Section id='features'>
        <Eyebrow>Features</Eyebrow>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: '700',
          color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15',
          marginBottom: '48px', maxWidth: '560px',
        }}>
          Everything your school needs to grow
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* Row 1 */}
          <FeatureLarge
            icon={<CalendarCheck size={24} />}
            title="Online Booking"
            desc="Students pick a time, pay upfront, get confirmed. Instructors see their schedule in one place. No back-and-forth texts."
            meshStyle={meshBlueCyan}
          />
          <FeatureSmall
            icon={<Users size={20} />}
            title="Student Tracking"
            desc="Every session counts toward Tennessee Certificate of Completion."
          />

          {/* Row 2 */}
          <FeatureSmall
            icon={<CreditCard size={20} />}
            title="Stripe Billing"
            desc="Accept payments online. No chasing checks."
          />
          <FeatureLarge
            icon={<BellRing size={24} />}
            title="Automated Reminders"
            desc="SMS and email go out 48 hours and 4 hours before each session. Fewer no-shows, less rescheduling."
            meshStyle={meshYellowOrange}
          />

          {/* Row 3 */}
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
      </Section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <Section>
        <Eyebrow>How It Works</Eyebrow>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: '700',
          color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15',
          marginBottom: '48px', textAlign: 'center',
        }}>
          Up and running in an afternoon
        </h2>

        <div style={{ position: 'relative' }}>
          {/* Dashed connector line */}
          <div style={{
            position: 'absolute', top: '90px', left: 'calc(16.67% + 28px)', right: 'calc(16.67% + 28px)',
            height: '2px',
            background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 8px, transparent 8px, transparent 16px)',
            pointerEvents: 'none', zIndex: 0,
          }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative', zIndex: 1 }}>
            {[
              { step: '01', title: 'Create your school profile', desc: 'Set your school name, add instructors, configure session types and pricing.', mesh: meshYellowOrange },
              { step: '02', title: 'Add instructors & students', desc: 'Invite your team. Students sign up through your booking link in seconds.', mesh: meshBlueCyan },
              { step: '03', title: 'Accept bookings online', desc: 'Share your link. Students book, pay, and confirm automatically. No manual work.', mesh: meshGreenBlue },
            ].map(s => (
              <HowCard key={s.step} step={s.step} title={s.title} desc={s.desc} meshStyle={s.mesh} />
            ))}
          </div>
        </div>
      </Section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', background: '#18181B' }}>
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
                padding: '20px 16px', position: 'relative',
              }}>
                {i > 0 && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '1px', background: 'rgba(255,255,255,0.07)',
                  }} />
                )}
                <span style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: '1' }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: '12px', color: '#52525B', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <Section id='pricing'>
        <Eyebrow>Pricing</Eyebrow>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: '700',
          color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15',
          marginBottom: '10px',
        }}>
          Simple, transparent pricing
        </h2>
        <p style={{ fontSize: '15px', color: '#71717A', marginBottom: '48px' }}>No setup fees. No per-seat surprises. Cancel anytime.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {PRICING_TIERS.map(t => <PricingCard key={t.name} {...t} />)}
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id='faq' style={{ padding: '80px 24px', background: '#18181B' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Eyebrow>FAQ</Eyebrow>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: '700',
            color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '40px',
          }}>
            Common questions
          </h2>
          <div>
            {FAQ_ITEMS.map(item => <FaqItem key={item.question} {...item} />)}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: '#09090B', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle yellow glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(250,204,21,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: '700',
            color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15',
            marginBottom: '16px',
          }}>
            Ready to simplify your school?
          </h2>
          <p style={{ fontSize: '17px', color: '#71717A', lineHeight: '1.7', marginBottom: '40px' }}>
            Join 50+ Tennessee driving schools already using The Driving Center.
            <br />14-day free trial. No credit card required.
          </p>
          <Link href='/signup' style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 36px', background: '#FACC15', color: '#000', fontWeight: '700',
            fontSize: '16px', borderRadius: '100px', textDecoration: 'none',
            boxShadow: '0 0 60px rgba(250,204,21,0.25)',
          }}>
            Start free trial <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'transparent', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
                <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.75' />
              </svg>
            </div>
            <span style={{ fontSize: '13px', color: '#52525B' }}>The Driving Center</span>
          </div>
          {/* Links */}
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Login'].map(label => (
              <a key={label} href={label === 'Privacy' ? '/legal/privacy' : label === 'Terms' ? '/legal/terms' : '/login'}
                style={{ fontSize: '13px', color: '#52525B', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#52525B')}
              >
                {label}
              </a>
            ))}
          </div>
          <span style={{ fontSize: '13px', color: '#52525B' }}>© 2026 The Driving Center</span>
        </div>
      </footer>

    </main>
  )
}