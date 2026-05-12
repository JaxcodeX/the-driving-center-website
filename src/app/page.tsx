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
  BarChart3,
  Clock,
  MessageSquare,
  Star,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'

// ─── Shared Layout Helpers ──────────────────────────────────────────

function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', ...style }}>
      {children}
    </div>
  )
}

function Section({
  id,
  pt = 140,
  pb = 140,
  children,
  style,
}: {
  id?: string
  pt?: number
  pb?: number
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <section id={id} style={{ padding: `${pt}px 0 ${pb}px`, ...style }}>
      <Container>{children}</Container>
    </section>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase',
      color: 'var(--accent)', marginBottom: '16px',
    }}>
      <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--accent)', borderRadius: '2px' }} />
      {children}
    </p>
  )
}

function SectionHeadline({ children, mb = '16px', ta = 'left' as const }: { children: React.ReactNode; mb?: string; ta?: 'left' | 'center' }) {
  return (
    <h2 style={{
      fontSize: 'clamp(36px, 4vw, 48px)', fontFamily: "'Outfit', sans-serif", fontWeight: '700',
      color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
      marginBottom: mb, textAlign: ta,
    }}>
      {children}
    </h2>
  )
}

function SectionSub({ children, ta = 'left' as const, mb = '48px' }: { children: React.ReactNode; ta?: 'left' | 'center'; mb?: string }) {
  return (
    <p style={{
      fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7',
      marginBottom: mb, textAlign: ta,
    }}>
      {children}
    </p>
  )
}

// ─── Navbar ─────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '72px',
      background: scrolled ? 'rgba(5,5,5,0.8)' : 'rgba(5,5,5,0)',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--gray-400)' : '1px solid transparent',
      transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
    }}>
      <Container style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
              <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em', fontFamily: "'Outfit', sans-serif" }}>The Driving Center</span>
        </Link>

        {/* Desktop Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className='desktop-nav'>
          {['Features', 'Pricing', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} style={{
              fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className='desktop-nav'>
          <Link href='/login' style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >Log in</Link>
          <Link href='/signup' style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '10px 20px',
            background: 'var(--text-primary)', color: '#000000', fontWeight: '600',
            fontSize: '13px', borderRadius: '12px', textDecoration: 'none',
            transition: 'transform 0.2s',
            fontFamily: "'Inter', sans-serif",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Start free trial
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px', display: 'none' }}
          className='mobile-menu-btn'
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(5,5,5,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--gray-400)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {['Features', 'Pricing', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setMobileOpen(false)} style={{
              fontSize: '15px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500',
            }}>
              {label}
            </a>
          ))}
          <Link href='/login' style={{ fontSize: '15px', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Log in</Link>
          <Link href='/signup' style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '12px', background: 'var(--text-primary)', color: '#000000', fontWeight: '600',
            fontSize: '14px', borderRadius: '12px', textDecoration: 'none',
          }}>
            Start free trial
          </Link>
        </div>
      )}
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{
      padding: '160px 0 120px', position: 'relative', overflow: 'hidden',
      background: 'var(--bg-base)',
    }}>
      {/* Purple radial glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(45,27,78,0.8) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Dot pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, var(--gray-400) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        {/* Centered content */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>

          {/* Eyebrow badge */}
          <div className='hero-content' style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'var(--bg-surface)', border: '1px solid var(--gray-400)',
            fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)',
            letterSpacing: '0.06em', marginBottom: '32px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
            DRIVING SCHOOL MANAGEMENT SOFTWARE
          </div>

          {/* Headline */}
          <h1 className='hero-content' style={{
            fontSize: 'clamp(52px, 7vw, 80px)', fontFamily: "'Outfit', sans-serif", fontWeight: '800',
            lineHeight: '1.05', letterSpacing: '-0.03em',
            color: 'var(--text-primary)', margin: '0 0 24px',
          }}>
            Run Your Driving School<br />Without Running Yourself Ragged
          </h1>

          {/* Subheadline */}
          <p className='hero-content' style={{
            fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.7',
            margin: '0 0 40px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            The all-in-one platform for driving schools to manage bookings, students, instructors, and payments — without the chaos.
          </p>

          {/* CTAs */}
          <div className='hero-cta' style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href='/signup' style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, var(--accent), var(--green-600))',
              color: 'var(--text-primary)', fontWeight: '700',
              fontSize: '15px', borderRadius: '12px', textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(74,222,128,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(74,222,128,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(74,222,128,0.4)' }}
            >
              Start free trial <ArrowRight size={16} />
            </Link>
            <Link href='/demo' style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', background: 'transparent', color: 'var(--text-primary)', fontWeight: '600',
              fontSize: '15px', borderRadius: '12px', textDecoration: 'none',
              border: '1px solid var(--gray-400)',
              transition: 'background 0.2s, border-color 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--gray-600)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--gray-400)' }}
            >
              Book a demo
            </Link>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px' }}>
            Built for driving school owners. Not another generic scheduling tool.
          </p>
        </div>
      </Container>
    </section>
  )
}

// ─── Trusted By (Logo Strip) ─────────────────────────────────────────

function LogoStrip() {
  const schools = [
    'Smokey Mountain Drivers',
    'Volunteer Auto School',
    'River City Driving',
    'Delta Advanced Drivers',
    'Summit Traffic School',
  ]

  return (
    <section style={{ padding: '100px 0', background: 'var(--bg-base)' }}>
      <Container>
        <p style={{
          textAlign: 'center', fontSize: '11px', fontWeight: '600',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: '40px',
        }}>
          Trusted by schools across Tennessee
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '56px', flexWrap: 'wrap',
        }}>
          {schools.map(name => (
            <span key={name} style={{
              fontSize: '14px', fontWeight: '600', color: 'var(--gray-800)',
              opacity: 0.5, filter: 'grayscale(1)',
              transition: 'opacity 0.2s, filter 0.2s',
              cursor: 'default',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'none' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.filter = 'grayscale(1)' }}
            >
              {name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}

// ─── Features Grid ────────────────────────────────────────────────────

const features = [
  {
    icon: <CalendarCheck size={20} />,
    title: 'Online Booking',
    desc: 'Students book 24/7, choose session types and instructors, and pay upfront — automatically.',
    color: 'var(--accent)',
    bg: 'rgba(74,222,128,0.1)',
  },
  {
    icon: <Users size={20} />,
    title: 'Student Tracking',
    desc: 'TCA progress, session history, and certification docs in one place.',
    color: 'var(--accent)',
    bg: 'rgba(74,222,128,0.1)',
  },
  {
    icon: <CreditCard size={20} />,
    title: 'Stripe Payments',
    desc: 'Accept payments online. Instant receipts. Automatic dispute handling.',
    color: 'var(--accent)',
    bg: 'rgba(74,222,128,0.1)',
  },
  {
    icon: <BellRing size={20} />,
    title: 'Automated Reminders',
    desc: 'SMS and email reminders cut no-shows by 60%. Custom timing rules per session type.',
    color: 'var(--accent)',
    bg: 'rgba(74,222,128,0.1)',
  },
  {
    icon: <UserCog size={20} />,
    title: 'Instructor Management',
    desc: 'Assign schedules, track hours, and manage instructor availability.',
    color: 'var(--accent)',
    bg: 'rgba(74,222,128,0.1)',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Enterprise Security',
    desc: 'SOC 2 Type II infrastructure. AES-256 encryption. GDPR compliant.',
    color: 'var(--accent)',
    bg: 'rgba(74,222,128,0.1)',
  },
]

function Features() {
  return (
    <Section id='features' pt={140} pb={140} style={{ background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Eyebrow>Features</Eyebrow>
        <SectionHeadline mb='8px'>Everything your school needs to grow</SectionHeadline>
        <SectionSub mb='0' ta='center'>From booking to billing — run your entire school from one dashboard.</SectionSub>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {features.map((f, i) => (
          <div key={f.title} className='feature-card' data-animate style={{ animationDelay: `${i * 100}ms` }}>
            <div className='feature-icon'>
              {f.icon}
            </div>
            <h3 style={{ fontSize: '18px', fontFamily: "'Outfit', sans-serif", fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>{f.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── How It Works ──────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    icon: <CreditCard size={22} />,
    title: 'Students pay before the lesson',
    desc: 'Deposit collection happens automatically at booking. You stop chasing payments and students stop ghosting.',
  },
  {
    num: '02',
    icon: <BellRing size={22} />,
    title: 'AI handles the reminders',
    desc: '48-hour and 4-hour reminders go out automatically. No-shows drop. Your phone stops ringing the morning of.',
  },
  {
    num: '03',
    icon: <BarChart3 size={22} />,
    title: 'Your whole school in one dashboard',
    desc: 'Student progress, session schedules, payments, instructor availability — everything in one place. No more spreadsheets.',
  },
]

function HowItWorks() {
  return (
    <Section pt={140} pb={140} style={{ background: 'var(--gray-50)' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <Eyebrow>How It Works</Eyebrow>
        <SectionHeadline mb='8px'>The automation that pays for itself</SectionHeadline>
        <SectionSub mb='0' ta='center'>Every feature built around the problems that actually cost you time and money.</SectionSub>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', position: 'relative' }}>
        {steps.map((step, i) => (
          <div key={step.num} className='step-card' data-animate style={{ animationDelay: `${i * 150}ms`, background: 'var(--bg-surface)', borderRadius: '16px', padding: '40px 32px', border: '1px solid var(--gray-400)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', transition: 'transform 0.3s, border-color 0.3s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.borderColor = 'var(--gray-600)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'var(--gray-400)' }}
          >
            {/* Step number */}
            <span style={{
              fontSize: '64px', fontFamily: "'Outfit', sans-serif", fontWeight: '800',
              color: 'var(--gray-400)', lineHeight: '1', letterSpacing: '-0.04em',
              position: 'absolute', top: '24px', right: '24px',
            }}>
              {step.num}
            </span>

            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'var(--gray-500)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
            }}>
              {step.icon}
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontFamily: "'Outfit', sans-serif", fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>{step.title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Dashboard Preview ────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <Section pt={140} pb={140} style={{ background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Eyebrow>Dashboard</Eyebrow>
        <SectionHeadline mb='8px'>A dashboard that actually makes sense</SectionHeadline>
        <SectionSub mb='0' ta='center'>See your entire operation at a glance — no training required.</SectionSub>
      </div>

      {/* Mockup container */}
      <div style={{
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid var(--gray-400)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        background: 'var(--gray-100)',
      }}>
        {/* Top bar */}
        <div style={{
          height: '48px', background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--gray-400)',
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red-500)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--amber-500)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
          <div style={{ marginLeft: '12px', flex: 1, maxWidth: '320px', height: '24px', borderRadius: '6px', background: 'var(--gray-400)' }} />
        </div>

        {/* Body */}
        <div style={{ display: 'flex', height: '480px' }}>
          {/* Sidebar */}
          <div style={{
            width: '200px', background: 'var(--gray-200)',
            borderRight: '1px solid var(--gray-400)',
            padding: '20px 12px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {/* Logo area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 8px 16px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width='12' height='12' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                  <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
                </svg>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>TDC</span>
            </div>
            {['Dashboard', 'Bookings', 'Students', 'Instructors', 'Billing', 'Settings'].map((item, i) => (
              <div key={item} style={{
                padding: '8px 12px', borderRadius: '8px', fontSize: '13px',
                fontWeight: i === 0 ? '600' : '400', color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                background: i === 0 ? 'rgba(74,222,128,0.1)' : 'transparent',
                cursor: 'default',
              }}>
                {item}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, padding: '24px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '18px', fontFamily: "'Outfit', sans-serif", fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Good morning, Mark</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Here&apos;s what&apos;s happening today</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '80px', height: '32px', borderRadius: '8px', background: 'var(--gray-400)' }} />
                <div style={{ width: '80px', height: '32px', borderRadius: '8px', background: 'var(--accent)' }} />
              </div>
            </div>

            {/* KPI cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Active Students', value: '128', delta: '+12%', up: true },
                { label: 'Sessions Today', value: '24', delta: '+3', up: true },
                { label: 'Revenue (MTD)', value: '$8,420', delta: '-5%', up: false },
                { label: 'No-show Rate', value: '4.2%', delta: '-2.1%', up: true },
              ].map(kpi => (
                <div key={kpi.label} style={{
                  background: 'var(--bg-surface)', borderRadius: '12px', padding: '16px',
                  border: '1px solid var(--gray-400)',
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
                  <div style={{ fontSize: '24px', fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>{kpi.value}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: kpi.up ? 'var(--accent)' : 'var(--red-500)' }}>{kpi.delta}</div>
                </div>
              ))}
            </div>

            {/* Chart area + table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
              {/* Bar chart */}
              <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--gray-400)' }}>
                <div style={{ fontSize: '13px', fontFamily: "'Outfit', sans-serif", fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>Weekly Bookings</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0',
                      background: i === 5 ? 'var(--accent)' : 'var(--gray-400)',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>{d}</div>
                  ))}
                </div>
              </div>

              {/* Recent sessions */}
              <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--gray-400)' }}>
                <div style={{ fontSize: '13px', fontFamily: "'Outfit', sans-serif", fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>Upcoming</div>
                {[
                  { name: 'Jake Thompson', type: 'Behind Wheel', time: '9:00 AM', status: 'Confirmed' },
                  { name: 'Sarah Miller', type: 'Observation', time: '10:30 AM', status: 'Confirmed' },
                  { name: 'Mike Davis', type: 'Behind Wheel', time: '1:00 PM', status: 'Pending' },
                  { name: 'Emma Wilson', type: 'BTW Range', time: '2:30 PM', status: 'Confirmed' },
                ].map(s => (
                  <div key={s.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: '1px solid var(--gray-400)',
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{s.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.type} · {s.time}</div>
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px',
                      background: s.status === 'Confirmed' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
                      color: s.status === 'Confirmed' ? 'var(--accent)' : 'var(--yellow-600)',
                    }}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── For Schools CTA ─────────────────────────────────────────────────

function ForSchoolsCTA() {
  return (
    <section style={{ padding: '120px 0', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(74,222,128,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--gray-400)',
          borderRadius: '32px',
          padding: '64px 56px',
          display: 'flex',
          alignItems: 'center',
          gap: '48px',
        }}>
          <div style={{ flex: 1 }}>
            <p style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--accent)', marginBottom: '16px',
            }}>
              <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--accent)', borderRadius: '2px' }} />
              For School Owners
            </p>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)', fontFamily: "'Outfit', sans-serif", fontWeight: '700',
              color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
              marginBottom: '16px',
            }}>
              Already own a driving school?
            </h2>
            <p style={{
              fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7',
              marginBottom: '32px', maxWidth: '520px',
            }}>
              See how The Driving Center helps schools like yours fill sessions faster, cut admin time in half, and protect revenue with automatic deposits.
            </p>
            <Link href='/signup' style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, var(--accent), var(--green-600))',
              color: 'var(--text-primary)', fontWeight: '700',
              fontSize: '14px', borderRadius: '12px', textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(74,222,128,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(74,222,128,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(74,222,128,0.3)' }}
            >
              See how it works <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

// ─── Stats Bar ───────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { value: '50+', label: 'Schools Nationwide' },
    { value: '10,000+', label: 'Sessions Booked' },
    { value: '$2M+', label: 'Payments Processed' },
    { value: '99.9%', label: 'Uptime SLA' },
  ]

  return (
    <section style={{ padding: '100px 0', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-400)', borderBottom: '1px solid var(--gray-400)' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {stats.map((stat, i) => (
            <div key={stat.label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              padding: '20px 16px', position: 'relative',
            }}>
              {i > 0 && (
                <div style={{
                  position: 'absolute', left: 0, top: '15%', bottom: '15%',
                  width: '1px', background: 'var(--gray-400)',
                }} />
              )}
              <span style={{
                fontSize: 'clamp(36px, 4vw, 56px)', fontFamily: "'Outfit', sans-serif", fontWeight: '800',
                color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: '1',
              }}>
                {stat.value}
              </span>
              <span style={{
                fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "This is exactly what I needed for my driving school. Setup was painless and my students love it. It's been a complete game changer for managing bookings.",
    name: 'Matt Reedy',
    role: 'Owner, The Driving Center',
    initials: 'MR',
    color: 'var(--accent)',
  },
  {
    quote: "We cut our admin work in half. Parents love being able to book and pay online. It's been a complete game changer for our school.",
    name: 'Renee Holloway',
    role: 'Owner, Smokey Mountain Drivers',
    initials: 'RH',
    color: 'var(--accent)',
  },
  {
    quote: "The automated reminders alone saved us thousands in rescheduling costs. This is exactly what every driving school needs.",
    name: 'Marcus Webb',
    role: 'Director, Volunteer Auto School',
    initials: 'MW',
    color: 'var(--accent)',
  },
  {
    quote: "Student tracking and TCA compliance used to be a nightmare. Now it's just... seamless. Worth every penny.",
    name: 'David Park',
    role: 'Founder, Summit Traffic School',
    initials: 'DP',
    color: 'var(--accent)',
  },
]

function Testimonials() {
  return (
    <Section pt={140} pb={140} id='testimonials' style={{ background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Eyebrow>Testimonials</Eyebrow>
        <SectionHeadline mb='8px'>Loved by driving schools</SectionHeadline>
        <SectionSub mb='0' ta='center'>Don&apos;t take our word for it. Here&apos;s what school owners have to say.</SectionSub>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {testimonials.map((t, i) => (
          <div key={t.name} className='testimonial-card' data-animate style={{ animationDelay: `${i * 120}ms`, background: 'var(--bg-surface)', borderRadius: '16px', padding: '32px', border: '1px solid var(--gray-400)', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.3s, border-color 0.3s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.borderColor = 'var(--gray-600)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.borderColor = 'var(--gray-400)' }}
          >
            {/* Stars */}
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, j) => <Star key={j} size={14} style={{ color: 'var(--yellow-500)', fill: '#FACC15' }} />)}
            </div>

            {/* Quote */}
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0, flex: 1 }}>
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: `rgba(74,222,128,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700', color: 'var(--accent)',
                flexShrink: 0,
              }}>
                {t.initials}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{t.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────

const plans = [
  {
    name: 'Starter',
    price: '$99',
    desc: 'For small schools getting started.',
    features: ['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking'],
    highlighted: false,
    cta: 'Start free trial',
    href: '/signup',
  },
  {
    name: 'Growth',
    price: '$199',
    desc: 'For schools ready to scale.',
    features: ['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support'],
    highlighted: true,
    cta: 'Start free trial',
    href: '/signup',
  },
  {
    name: 'Enterprise',
    price: '$499',
    desc: 'For multi-location schools.',
    features: ['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager'],
    highlighted: false,
    cta: 'Contact sales',
    href: '/contact',
  },
]

function Pricing() {
  return (
    <Section id='pricing' pt={140} pb={140} style={{ background: 'var(--gray-50)' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Eyebrow>Pricing</Eyebrow>
        <SectionHeadline mb='8px'>Simple, transparent pricing</SectionHeadline>
        <SectionSub mb='0' ta='center'>No setup fees. No per-seat surprises. Cancel anytime.</SectionSub>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'start' }}>
        {plans.map((p, i) => (
          <div key={p.name} className='pricing-card' data-animate style={{ animationDelay: `${i * 100}ms`, background: p.highlighted ? 'var(--gray-300)' : 'var(--bg-surface)', borderRadius: '24px', padding: '32px', border: p.highlighted ? '1px solid rgba(74,222,128,0.3)' : '1px solid var(--gray-400)', boxShadow: p.highlighted ? '0 0 60px rgba(74,222,128,0.1)' : 'none', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'transform 0.3s, box-shadow 0.3s' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(-6px)'
              el.style.boxShadow = p.highlighted ? '0 20px 60px rgba(74,222,128,0.15)' : '0 12px 40px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = p.highlighted ? '0 0 60px rgba(74,222,128,0.1)' : 'none'
            }}
          >
            {p.highlighted && (
              <div style={{
                position: 'absolute', top: '-1px', left: '20px', right: '20px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                borderRadius: '0 0 2px 2px',
              }} />
            )}

            {p.highlighted && (
              <span style={{
                display: 'inline-block', fontSize: '11px', fontWeight: '700',
                padding: '4px 12px', borderRadius: '999px',
                background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,197,94,0.2))',
                color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: '16px', alignSelf: 'flex-start',
                border: '1px solid rgba(74,222,128,0.3)',
              }}>
                Most Popular
              </span>
            )}

            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {p.name}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
              <span style={{ fontSize: '48px', fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1', letterSpacing: '-0.03em' }}>{p.price}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/mo</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.55' }}>{p.desc}</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {p.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <Check size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>

            {p.highlighted ? (
              <Link href={p.href} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px 28px', background: 'var(--text-primary)', color: '#000000', fontWeight: '700',
                fontSize: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                textDecoration: 'none', whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif",
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {p.cta} <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href={p.href} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px 28px', background: 'transparent', color: 'var(--text-primary)', fontWeight: '600',
                fontSize: '14px', borderRadius: '12px', border: '1px solid var(--gray-400)',
                cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif",
                transition: 'background 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'var(--gray-600)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--gray-400)' }}
              >
                {p.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid var(--gray-400)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '20px 0', cursor: 'pointer', background: 'none', border: 'none',
          fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'left',
          fontFamily: "'Inter', sans-serif",
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
      >
        {question}
        <ChevronDown size={16} style={{
          flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          color: 'var(--text-muted)',
        }} />
      </button>
      {open && (
        <div style={{ padding: '0 0 20px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
          {answer}
        </div>
      )}
    </div>
  )
}

function FAQ() {
  const items = [
    { question: 'How long does it take to set up?', answer: 'Most schools are up and running in under 5 minutes. Create your school profile, add your instructors, and you\'re ready to accept bookings.' },
    { question: 'Can I import my existing student data?', answer: 'Yes. Import CSV files or connect via our API. All student records, session history, and TCA progress transfers automatically.' },
    { question: 'What happens if a student doesn\'t show up?', answer: 'Automated reminders go out 24 hours and 2 hours before each session. You can set your own cancellation policy and the system enforces it.' },
    { question: 'Is my school\'s data secure?', answer: 'We use bank-level encryption (AES-256), SOC 2 Type II infrastructure, and never share your data with third parties. You\'re the only one who sees your student information.' },
    { question: 'Do you offer refunds?', answer: 'Yes. If you cancel within your first 30 days and you\'re not satisfied, we\'ll refund your first month — no questions asked.' },
    { question: 'Can I use my own domain?', answer: 'Yes. All plans support custom domains. Point your CNAME record and we\'ll handle SSL automatically.' },
  ]

  return (
    <Section id='faq' pt={120} pb={120} style={{ background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Eyebrow>FAQ</Eyebrow>
          <SectionHeadline mb='0' ta='center'>Common questions</SectionHeadline>
        </div>
        {items.map(item => <FaqItem key={item.question} {...item} />)}
      </div>
    </Section>
  )
}

// ─── CTA Section ─────────────────────────────────────────────────────

function CTASection() {
  return (
    <Section pt={120} pb={120} style={{ background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Green glow behind */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(74,222,128,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 52px)', fontFamily: "'Outfit', sans-serif", fontWeight: '700',
          color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.15',
          marginBottom: '16px',
        }}>
          Ready to run your school better?
        </h2>
        <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '40px' }}>
          Join 50+ driving schools across Tennessee already using The Driving Center.
          <br />14-day free trial. No credit card required.
        </p>
        <Link href='/signup' style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '16px 36px', background: 'var(--text-primary)', color: '#000000', fontWeight: '700',
          fontSize: '16px', borderRadius: '12px', textDecoration: 'none',
          fontFamily: "'Inter', sans-serif",
          transition: 'transform 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Start free trial <ArrowRight size={18} />
        </Link>
      </div>
    </Section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--gray-400)', background: 'var(--bg-base)', padding: '64px 0 32px' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width='14' height='14' viewBox='0 0 16 16' fill='none'>
                  <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                  <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
                </svg>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>The Driving Center</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '260px' }}>
              Modern software for driving schools. Book more students, automate reminders, and grow your business.
            </p>
          </div>

          {/* Product links */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-800)', marginBottom: '16px' }}>Product</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Blog', href: '/blog' },
              ].map(link => (
                <a key={link.label} href={link.href} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-800)', marginBottom: '16px' }}>Company</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/legal/privacy' },
                { label: 'Terms of Service', href: '/legal/terms' },
              ].map(link => (
                <a key={link.label} href={link.href} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--gray-400)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>© 2026 The Driving Center. All rights reserved.</span>
          <span style={{ fontSize: '13px', color: 'var(--gray-700)' }}>Built with ▲ by Everest</span>
        </div>
      </Container>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────

export default function HomePage() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.body.style.background = '#050505'

    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    // Observe all [data-animate] elements
    const animatables = document.querySelectorAll('[data-animate]')
    animatables.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <main style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Default: hidden until viewport intersection */
        [data-animate] {
          opacity: 0;
        }
        [data-animate].visible {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        [data-animate].visible.scale {
          animation: fadeInScale 0.6s ease-out forwards;
        }
        [data-animate].visible.slide {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        /* Stagger siblings */
        [data-animate] ~ [data-animate] {
          /* handled via animation-delay inline */
        }

        .hero-content { animation: fadeInUp 0.8s ease-out forwards; }
        .hero-cta { animation: fadeInUp 0.8s ease-out 0.2s forwards; opacity: 0; }
        .hero-image { animation: fadeInUp 0.8s ease-out 0.35s forwards; opacity: 0; }

        .feature-card {
          background: var(--bg-surface); border-radius: 16px; padding: 32px;
          border: 1px solid var(--gray-400); display: flex; flex-direction: column; gap: 12px;
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
          cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: var(--gray-600);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(74,222,128,0.08);
        }
        .feature-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.15);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
        }

        .step-card {
          background: var(--bg-surface); border-radius: 16px; padding: 40px 32px;
          border: 1px solid var(--gray-400); display: flex; flex-direction: column; gap: 20px;
          position: relative;
          transition: transform 0.3s, border-color 0.3s;
        }
        .step-card:hover {
          transform: translateY(-4px);
          border-color: var(--gray-600);
        }

        .testimonial-card {
          background: var(--bg-surface); border-radius: 16px; padding: 32px;
          border: 1px solid var(--gray-400); display: flex; flex-direction: column; gap: 16px;
          transition: transform 0.3s, border-color 0.3s;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          border-color: var(--gray-600);
        }

        .pricing-card {
          background: var(--bg-surface); border-radius: 24px; padding: 32px;
          border: 1px solid var(--gray-400); display: flex; flex-direction: column;
          position: relative;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .pricing-card:hover {
          transform: translateY(-6px);
        }

        /* Warm bottom glow */
        .warm-glow {
          position: fixed;
          bottom: 0; left: 0; right: 0; height: 300px;
          background: radial-gradient(ellipse at 30% 100%, rgba(74,222,128,0.04) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }

        /* Green accent in hero */
        .hero-glow {
          background: radial-gradient(ellipse at center, rgba(74,222,128,0.12) 0%, transparent 65%) !important;
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
      <Navbar />
      <Hero />
      <LogoStrip />
      <Features />
      <HowItWorks />
      <DashboardMockup />
      <ForSchoolsCTA />
      <StatsBar />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
      <div className="warm-glow" />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </main>
  )
}
