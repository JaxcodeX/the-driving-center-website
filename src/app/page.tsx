'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarCheck,
  Users,
  CreditCard,
  BellRing,
  UserCog,
  ShieldCheck,
  Check,
  BarChart3,
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
      background: scrolled ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
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
          <Link href='/signup' className='btn-pill btn-pill-primary' style={{ fontSize: '13px', padding: '10px 20px' }}>
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
          background: 'rgba(0,0,0,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
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
      padding: '140px 0 120px', position: 'relative', overflow: 'hidden',
      background: 'var(--bg-base)',
    }}>
      {/* Mesh gradient background */}
      <div className='hero-gradient' style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '55% 1fr',
          gap: '64px',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Left: text content */}
          <div>
            {/* Eyebrow badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)',
              letterSpacing: '0.06em', marginBottom: '32px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
              DRIVING SCHOOL MANAGEMENT SOFTWARE
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(48px, 7vw, 88px)', fontFamily: "'Inter', sans-serif", fontWeight: '800',
              lineHeight: '1.0', letterSpacing: '-0.03em',
              color: 'var(--text-primary)', margin: '0 0 28px',
            }}>
              Run Your Driving School{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Without</em>{' '}
              Running Yourself Ragged
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.7',
              margin: '0 0 40px', maxWidth: '480px',
            }}>
              The all-in-one platform for driving schools to manage bookings, students, instructors, and payments — without the chaos.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href='/signup' className='btn-pill btn-pill-primary' style={{ fontSize: '15px', padding: '14px 28px' }}>
                Start free trial <ArrowRight size={16} />
              </Link>
              <Link href='/demo' className='btn-pill btn-pill-secondary' style={{ fontSize: '15px', padding: '14px 28px' }}>
                Book a demo
              </Link>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '20px' }}>
              Built for driving school owners. Not another generic scheduling tool.
            </p>
          </div>

          {/* Right: floating glassmorphic dashboard preview card */}
          <div style={{ position: 'relative' }}>
            <div className='glass-card' style={{ padding: '0', overflow: 'hidden', borderRadius: '24px' }}>
              {/* Mesh gradient strip at top */}
              <div className='mesh-gradient' style={{ height: '6px' }} />

              {/* Admin dashboard preview */}
              <div style={{ padding: '24px', background: 'var(--bg-surface)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontFamily: "'Outfit', sans-serif", fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Good morning, Mark</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Here&apos;s what&apos;s happening today</div>
                  </div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width='14' height='14' viewBox='0 0 16 16' fill='none'>
                      <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
                      <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.7' />
                    </svg>
                  </div>
                </div>

                {/* KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  {[
                    { label: 'Active Students', value: '128', delta: '+12%', up: true },
                    { label: 'Sessions Today', value: '24', delta: '+3', up: true },
                    { label: 'Revenue (MTD)', value: '$8,420', delta: '-5%', up: false },
                    { label: 'No-show Rate', value: '4.2%', delta: '-2.1%', up: true },
                  ].map(kpi => (
                    <div key={kpi.label} style={{
                      background: 'var(--bg-elevated)', borderRadius: '12px', padding: '14px',
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
                      <div style={{ fontSize: '22px', fontFamily: "'Outfit', sans-serif", fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '2px' }}>{kpi.value}</div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: kpi.up ? 'var(--success)' : 'var(--danger)' }}>{kpi.delta}</div>
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)', marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontFamily: "'Outfit', sans-serif", fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>Weekly Bookings</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px' }}>
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} style={{
                        flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0',
                        background: i === 5 ? 'var(--accent)' : 'var(--border-hover)',
                        transition: 'background 0.2s',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                      <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>{d}</div>
                    ))}
                  </div>
                </div>

                {/* Upcoming sessions */}
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '12px', fontFamily: "'Outfit', sans-serif", fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' }}>Upcoming</div>
                  {[
                    { name: 'Jake Thompson', type: 'Behind Wheel', time: '9:00 AM', status: 'Confirmed' },
                    { name: 'Sarah Miller', type: 'Observation', time: '10:30 AM', status: 'Confirmed' },
                    { name: 'Mike Davis', type: 'Behind Wheel', time: '1:00 PM', status: 'Pending' },
                  ].map(s => (
                    <div key={s.name} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 0', borderBottom: '1px solid var(--border)',
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)' }}>{s.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.type} · {s.time}</div>
                      </div>
                      <span style={{
                        fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px',
                        background: s.status === 'Confirmed' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
                        color: s.status === 'Confirmed' ? 'var(--success)' : 'var(--warning)',
                      }}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating accent glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '400px', height: '400px',
              background: 'radial-gradient(ellipse at center, rgba(26,86,255,0.12) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: -1,
            }} />
          </div>
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
    <section style={{ padding: '80px 0', background: 'var(--bg-base)' }}>
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
              fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)',
              opacity: 0.4, filter: 'grayscale(1)',
              transition: 'opacity 0.2s, filter 0.2s',
              cursor: 'default', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.filter = 'none' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.filter = 'grayscale(1)' }}
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
  },
  {
    icon: <Users size={20} />,
    title: 'Student Tracking',
    desc: 'TCA progress, session history, and certification docs in one place.',
  },
  {
    icon: <CreditCard size={20} />,
    title: 'Stripe Payments',
    desc: 'Accept payments online. Instant receipts. Automatic dispute handling.',
  },
  {
    icon: <BellRing size={20} />,
    title: 'Automated Reminders',
    desc: 'SMS and email reminders cut no-shows by 60%. Custom timing rules per session type.',
  },
  {
    icon: <UserCog size={20} />,
    title: 'Instructor Management',
    desc: 'Assign schedules, track hours, and manage instructor availability.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Enterprise Security',
    desc: 'SOC 2 Type II infrastructure. AES-256 encryption. GDPR compliant.',
  },
]

function Features() {
  return (
    <Section id='features' pt={120} pb={120} style={{ background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Eyebrow>Features</Eyebrow>
        <SectionHeadline mb='8px'>Everything your school needs to grow</SectionHeadline>
        <SectionSub mb='0' ta='center'>From booking to billing — run your entire school from one dashboard.</SectionSub>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {features.map((f, i) => (
          <div key={f.title} data-animate style={{
            animationDelay: `${i * 100}ms`,
            background: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'transform 0.3s, border-color 0.3s',
            cursor: 'default',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(-4px)'
              el.style.borderColor = 'var(--border-hover)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(0)'
              el.style.borderColor = 'var(--border)'
            }}
          >
            {/* Mesh gradient strip at top */}
            <div className='mesh-subtle' style={{ height: '3px' }} />

            <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'rgba(26,86,255,0.10)',
                border: '1px solid rgba(26,86,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '17px', fontFamily: "'Outfit', sans-serif", fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.01em', margin: 0 }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Process: Subscribe / Request / Receive ─────────────────────────

const processSteps = [
  {
    num: '01',
    title: 'Subscribe',
    desc: 'Create your school profile, add your instructors, and set your session types in minutes.',
    icon: <CreditCard size={22} />,
  },
  {
    num: '02',
    title: 'Request',
    desc: 'Students pick a session, choose an instructor, and pay upfront — all from a single link.',
    icon: <BellRing size={22} />,
  },
  {
    num: '03',
    title: 'Receive',
    desc: 'Automated reminders go out. Sessions stay booked. You get paid without chasing anyone.',
    icon: <BarChart3 size={22} />,
  },
]

function Process() {
  return (
    <Section pt={120} pb={120} style={{ background: 'var(--bg-surface)' }}>
      <div style={{ textAlign: 'center', marginBottom: '72px' }}>
        <Eyebrow>How It Works</Eyebrow>
        <SectionHeadline mb='8px'>The automation that pays for itself</SectionHeadline>
        <SectionSub mb='0' ta='center'>Every feature built around the problems that actually cost you time and money.</SectionSub>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
        {processSteps.map((step, i) => (
          <div key={step.num} data-animate style={{
            animationDelay: `${i * 120}ms`,
            background: 'var(--bg-base)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            transition: 'transform 0.3s, border-color 0.3s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(-4px)'
              el.style.borderColor = 'var(--border-hover)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(0)'
              el.style.borderColor = 'var(--border)'
            }}
          >
            <span style={{
              fontSize: '56px', fontFamily: "'Inter', sans-serif", fontWeight: '800',
              color: 'rgba(255,255,255,0.04)', lineHeight: '1', letterSpacing: '-0.04em',
              position: 'absolute', top: '20px', right: '24px',
            }}>
              {step.num}
            </span>

            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'rgba(26,86,255,0.10)',
              border: '1px solid rgba(26,86,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              {step.icon}
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontFamily: "'Outfit', sans-serif", fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "This is exactly what I needed for my driving school. Setup was painless and my students love it. It's been a complete game changer for managing bookings.",
    name: 'Matt Reedy',
    role: 'Owner, The Driving Center',
    initials: 'MR',
  },
  {
    quote: "We cut our admin work in half. Parents love being able to book and pay online. It's been a complete game changer for our school.",
    name: 'Renee Holloway',
    role: 'Owner, Smokey Mountain Drivers',
    initials: 'RH',
  },
  {
    quote: "The automated reminders alone saved us thousands in rescheduling costs. This is exactly what every driving school needs.",
    name: 'Marcus Webb',
    role: 'Director, Volunteer Auto School',
    initials: 'MW',
  },
  {
    quote: "Student tracking and TCA compliance used to be a nightmare. Now it's just... seamless. Worth every penny.",
    name: 'David Park',
    role: 'Founder, Summit Traffic School',
    initials: 'DP',
  },
]

function Testimonials() {
  return (
    <Section pt={120} pb={120} id='testimonials' style={{ background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Eyebrow>Testimonials</Eyebrow>
        <SectionHeadline mb='8px'>Loved by driving schools</SectionHeadline>
        <SectionSub mb='0' ta='center'>Don&apos;t take our word for it. Here&apos;s what school owners have to say.</SectionSub>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {testimonials.map((t, i) => (
          <div key={t.name} data-animate style={{
            animationDelay: `${i * 100}ms`,
            background: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'transform 0.3s, border-color 0.3s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(-4px)'
              el.style.borderColor = 'var(--border-hover)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(0)'
              el.style.borderColor = 'var(--border)'
            }}
          >
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(5)].map((_, j) => <Star key={j} size={14} style={{ color: '#FACC15', fill: '#FACC15' }} />)}
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0, flex: 1 }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(26,86,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700', color: 'var(--accent)', flexShrink: 0,
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

// ─── Stats Bar ───────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { value: '50+', label: 'Schools Nationwide' },
    { value: '10,000+', label: 'Sessions Booked' },
    { value: '$2M+', label: 'Payments Processed' },
    { value: '99.9%', label: 'Uptime SLA' },
  ]

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
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
                  width: '1px', background: 'var(--border)',
                }} />
              )}
              <span style={{
                fontSize: 'clamp(36px, 4vw, 52px)', fontFamily: "'Inter', sans-serif", fontWeight: '800',
                color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: '1',
              }}>
                {stat.value}
              </span>
              <span style={{
                fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600',
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
    <Section id='pricing' pt={120} pb={120} style={{ background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Eyebrow>Pricing</Eyebrow>
        <SectionHeadline mb='8px'>Simple, transparent pricing</SectionHeadline>
        <SectionSub mb='0' ta='center'>No setup fees. No per-seat surprises. Cancel anytime.</SectionSub>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
        {plans.map((p, i) => (
          <div key={p.name} data-animate style={{
            animationDelay: `${i * 100}ms`,
            background: p.highlighted ? 'var(--bg-surface)' : 'var(--bg-surface)',
            borderRadius: '24px',
            padding: '32px',
            border: p.highlighted ? '1px solid rgba(26,86,255,0.3)' : '1px solid var(--border)',
            boxShadow: p.highlighted ? '0 0 60px rgba(26,86,255,0.08)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(-6px)'
              el.style.boxShadow = p.highlighted ? '0 20px 60px rgba(26,86,255,0.12)' : '0 12px 40px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = p.highlighted ? '0 0 60px rgba(26,86,255,0.08)' : 'none'
            }}
          >
            {p.highlighted && (
              <div style={{
                position: 'absolute', top: '-1px', left: '20px', right: '20px',
                height: '2px',
                background: 'var(--mesh-gradient)',
                borderRadius: '0 0 2px 2px',
              }} />
            )}

            {p.highlighted && (
              <span style={{
                display: 'inline-block', fontSize: '11px', fontWeight: '700',
                padding: '4px 12px', borderRadius: '999px',
                background: 'rgba(26,86,255,0.12)',
                color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: '16px', alignSelf: 'flex-start',
                border: '1px solid rgba(26,86,255,0.2)',
              }}>
                Most Popular
              </span>
            )}

            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {p.name}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
              <span style={{ fontSize: '48px', fontFamily: "'Inter', sans-serif", fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1', letterSpacing: '-0.03em' }}>{p.price}</span>
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
              <Link href={p.href} className='btn-pill btn-pill-primary' style={{ justifyContent: 'center', fontSize: '14px' }}>
                {p.cta} <ArrowRight size={14} />
              </Link>
            ) : (
              <Link href={p.href} className='btn-pill btn-pill-secondary' style={{ justifyContent: 'center', fontSize: '14px' }}>
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
    <div style={{ borderBottom: '1px solid var(--border)' }}>
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
    <Section pt={120} pb={120} style={{ background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
      {/* Mesh subtle bg */}
      <div className='mesh-subtle' style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: 'clamp(40px, 5vw, 72px)', fontFamily: "'Inter', sans-serif", fontWeight: '800',
          color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: '1.05',
          marginBottom: '16px',
        }}>
          Ready to run your school better?
        </h2>
        <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '40px' }}>
          Join 50+ driving schools across Tennessee already using The Driving Center.
          <br />14-day free trial. No credit card required.
        </p>
        <Link href='/signup' className='btn-pill btn-pill-primary' style={{ fontSize: '16px', padding: '16px 36px' }}>
          Start free trial <ArrowRight size={18} />
        </Link>
      </div>
    </Section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-base)', padding: '64px 0 32px' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
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

          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>Product</p>
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

          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>Company</p>
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

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>© 2026 The Driving Center. All rights reserved.</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Built with ▲ by Everest</span>
        </div>
      </Container>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────

export default function HomePage() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.body.style.background = '#000000'

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
        [data-animate] {
          opacity: 0;
        }
        [data-animate].visible {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Navbar />
      <Hero />
      <LogoStrip />
      <Features />
      <Process />
      <Testimonials />
      <StatsBar />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}
