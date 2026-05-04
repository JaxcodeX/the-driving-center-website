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
  GraduationCap,
  CreditCardIcon,
} from 'lucide-react'

// ─── Mesh Gradient Recipes ─────────────────────────────────────────

const meshPinkPurpleBlue = {
  background: `
    radial-gradient(ellipse 80% 60% at 20% 20%, rgba(236,72,153,0.55) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 80%, rgba(59,130,246,0.5) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 50% 50%, rgba(168,85,247,0.4) 0%, transparent 70%),
    #18181B
  `,
}

const meshYellowOrange = {
  background: `
    radial-gradient(ellipse 70% 50% at 30% 30%, rgba(250,204,21,0.55) 0%, transparent 55%),
    radial-gradient(ellipse 50% 70% at 70% 70%, rgba(249,115,22,0.45) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 60% 40%, rgba(239,68,68,0.3) 0%, transparent 50%),
    #18181B
  `,
}

const meshBlueCyan = {
  background: `
    radial-gradient(ellipse 60% 60% at 20% 80%, rgba(6,182,212,0.5) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 80% 20%, rgba(59,130,246,0.5) 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 50% 50%, rgba(168,85,247,0.4) 0%, transparent 65%),
    #18181B
  `,
}

const meshGreenBlue = {
  background: `
    radial-gradient(ellipse 60% 60% at 70% 30%, rgba(16,185,129,0.5) 0%, transparent 55%),
    radial-gradient(ellipse 60% 60% at 30% 70%, rgba(59,130,246,0.45) 0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 50%, rgba(6,182,212,0.35) 0%, transparent 60%),
    #18181B
  `,
}

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
  bg = '#09090B',
  pt = 120,
  pb = 100,
  children,
}: {
  id?: string
  bg?: string
  pt?: number
  pb?: number
  children: React.ReactNode
}) {
  return (
    <section id={id} style={{ background: bg, padding: `${pt}px 0 ${pb}px` }}>
      <Container>{children}</Container>
    </section>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
      color: '#3B82F6', marginBottom: '12px',
    }}>
      <span style={{ display: 'block', width: '20px', height: '2px', background: '#3B82F6', borderRadius: '2px' }} />
      {children}
    </p>
  )
}

function SectionHeadline({ children, mb = '48px', ta = 'left' }: { children: React.ReactNode; mb?: string; ta?: 'left' | 'center' }) {
  return (
    <h2 style={{
      fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: '700',
      color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15',
      marginBottom: mb, textAlign: ta,
    }}>
      {children}
    </h2>
  )
}

// ─── Navbar ─────────────────────────────────────────────────────────

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
      <Container style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: '#2563EB', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path d='M8 2L13 5.5H3L8 2Z' fill='white' />
              <path d='M3 5.5V10.5L8 14V8.5H13V5.5H3Z' fill='white' fillOpacity='0.75' />
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#FFFFFF' }}>The Driving Center</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Features', 'Pricing', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase()}`} style={{
              fontSize: '15px', color: '#A1A1AA', textDecoration: 'none', fontWeight: '500',
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
          <Link href='/login' style={{ fontSize: '15px', color: '#A1A1AA', textDecoration: 'none', fontWeight: '500' }}>Log in</Link>
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

      </Container>
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{
      padding: '140px 0 100px', background: '#09090B', position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle yellow glow at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '400px',
        background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(250,204,21,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '64px', alignItems: 'center' }}>

          {/* LEFT */}
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

            {/* Subheadline */}
            <p style={{
              fontSize: '17px', color: '#A1A1AA', lineHeight: '1.7',
              margin: '0 0 36px', maxWidth: '480px',
            }}>
              Everything you need to manage bookings, track students, and grow your school — all from one dashboard.
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

          {/* RIGHT — mesh gradient card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              ...meshPinkPurpleBlue,
              borderRadius: '32px',
              padding: '40px 32px',
              boxShadow: '0 0 80px rgba(250,204,21,0.12), 0 32px 64px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
              minHeight: '420px', justifyContent: 'center',
            }}>
              {/* Badge */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '100px',
                background: '#000', color: '#FFFFFF', fontWeight: '700',
                fontSize: '12px', opacity: 0.8,
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80' }} />
                Start today
              </span>

              {/* Headline */}
              <h2 style={{
                fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800',
                color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.2', textAlign: 'center',
                margin: 0,
              }}>
                The Driving Center
              </h2>

              {/* Button */}
              <Link href='/signup' style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', background: '#FFFFFF', color: '#000', fontWeight: '700',
                fontSize: '13px', borderRadius: '100px', textDecoration: 'none',
              }}>
                See pricing <ArrowRight size={12} />
              </Link>

              {/* Avatar row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                {['M', 'S', 'J', 'A'].map((initials, i) => (
                  <div key={initials} style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: ['rgba(236,72,153,0.6)', 'rgba(59,130,246,0.6)', 'rgba(168,85,247,0.6)', 'rgba(16,185,129,0.6)'][i],
                    border: '2px solid #18181B', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: '700', color: '#FFF',
                    marginLeft: i === 0 ? 0 : '-8px',
                  }}>
                    {initials}
                  </div>
                ))}
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>+24 more</span>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  )
}

// ─── Logo Strip ──────────────────────────────────────────────────────

function LogoStrip() {
  const schools = [
    'Smokey Mountain Drivers',
    'Volunteer Auto School',
    'River City Driving',
    'Delta Advanced Drivers',
    'Summit Traffic School',
  ]

  return (
    <section style={{ padding: '48px 0', background: '#18181B' }}>
      <Container>
        <p style={{
          textAlign: 'center', fontSize: '11px', fontWeight: '600',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#52525B', marginBottom: '28px',
        }}>
          Trusted by schools across Tennessee
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '48px', flexWrap: 'wrap',
        }}>
          {schools.map(name => (
            <span key={name} style={{
              fontSize: '14px', fontWeight: '600', color: '#71717A',
              opacity: 0.45, filter: 'grayscale(1)',
              transition: 'opacity 0.2s, filter 0.2s',
              cursor: 'default',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'none' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.45'; e.currentTarget.style.filter = 'grayscale(1)' }}
            >
              {name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}

// ─── Features ────────────────────────────────────────────────────────

function FeatureLarge({ icon, title, desc, meshStyle }: {
  icon: React.ReactNode; title: string; desc: string; meshStyle: React.CSSProperties
}) {
  return (
    <div style={{
      gridColumn: 'span 2',
      background: '#18181B', borderRadius: '24px', overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      position: 'relative',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
    >
      {/* Mesh gradient top strip */}
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
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3', letterSpacing: '-0.01em', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#A1A1AA', lineHeight: '1.75', maxWidth: '480px', margin: 0 }}>{desc}</p>
      </div>
      {/* Bottom accent bar — SOLID blue */}
      <div style={{ height: '3px', background: '#3B82F6', borderRadius: '0 0 24px 24px' }} />
    </div>
  )
}

function FeatureSmall({ icon, title, desc }: {
  icon: React.ReactNode; title: string; desc: string
}) {
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

function Features() {
  return (
    <Section id='features'>
      <Eyebrow>Features</Eyebrow>
      <SectionHeadline>Everything your school needs to grow</SectionHeadline>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>

        {/* Row 1 */}
        <FeatureLarge
          icon={<CalendarCheck size={24} />}
          title="Online Booking"
          desc="Students book 24/7, choose session types and instructors, and pay upfront — automatically."
          meshStyle={meshPinkPurpleBlue}
        />
        <FeatureSmall
          icon={<Users size={20} />}
          title="Student Tracking"
          desc="TCA progress, session history, and certification docs in one place."
        />

        {/* Row 2 */}
        <FeatureSmall
          icon={<CreditCard size={20} />}
          title="Stripe Billing"
          desc="Accept payments online. Instant receipts. Automatic dispute handling."
        />
        <FeatureLarge
          icon={<BellRing size={24} />}
          title="Automated Reminders"
          desc="SMS and email reminders cut no-shows by 60%. Custom timing rules per session type."
          meshStyle={meshYellowOrange}
        />

        {/* Row 3 */}
        <FeatureSmall
          icon={<UserCog size={20} />}
          title="Instructor Management"
          desc="Assign schedules, track hours, and manage instructor availability."
        />
        <FeatureSmall
          icon={<ShieldCheck size={20} />}
          title="Multi-tenant Security"
          desc="SOC 2 Type II infrastructure. AES-256 encryption. GDPR compliant."
        />

      </div>
    </Section>
  )
}

// ─── How It Works ────────────────────────────────────────────────────

function HowCard({ step, title, desc, meshStyle }: {
  step: string; title: string; desc: string; meshStyle: React.CSSProperties
}) {
  return (
    <div style={{
      background: '#18181B', borderRadius: '28px', overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      position: 'relative',
    }}>
      {/* Mesh gradient top half */}
      <div style={{ height: '180px', ...meshStyle, borderRadius: '28px 28px 0 0' }} />
      {/* Bottom half */}
      <div style={{ padding: '28px', position: 'relative' }}>
        {/* Large muted step number — VISIBLE */}
        <div style={{
          position: 'absolute', top: '4px', right: '20px',
          fontSize: '40px', fontWeight: '800', lineHeight: '1',
          color: 'rgba(255,255,255,0.08)',
          letterSpacing: '-0.04em', userSelect: 'none',
        }}>
          {step}
        </div>
        <h3 style={{
          fontSize: '18px', fontWeight: '700', color: '#FFFFFF',
          lineHeight: '1.3', marginBottom: '8px', position: 'relative', zIndex: 1,
        }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#71717A', lineHeight: '1.7', position: 'relative', zIndex: 1 }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

function HowItWorks() {
  return (
    <Section>
      <Eyebrow>How It Works</Eyebrow>
      <SectionHeadline mb='48px' ta='center'>Simple, transparent, effective</SectionHeadline>

      <div style={{ position: 'relative' }}>
        {/* Dashed connector line */}
        <div style={{
          position: 'absolute', top: '90px',
          left: 'calc(33.33% - 0px)', right: 'calc(33.33% - 0px)',
          height: '2px',
          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 8px, transparent 8px, transparent 16px)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative', zIndex: 1 }}>
          <HowCard
            step='01'
            title='Create your school profile'
            desc='Set up your school in under 5 minutes. Add your school name, logo, session types, and pricing.'
            meshStyle={meshYellowOrange}
          />
          <HowCard
            step='02'
            title='Add instructors and students'
            desc='Invite your instructors, add your student roster, and start accepting bookings immediately.'
            meshStyle={meshPinkPurpleBlue}
          />
          <HowCard
            step='03'
            title='Accept bookings online'
            desc='Students book and pay directly. You manage everything from your dashboard — no more phone tag.'
            meshStyle={meshBlueCyan}
          />
        </div>
      </div>
    </Section>
  )
}

// ─── Stats Bar ───────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { value: '50+', label: 'Schools' },
    { value: '10,000+', label: 'Sessions Booked' },
    { value: '$2M+', label: 'Processed' },
    { value: '99.9%', label: 'Uptime' },
  ]

  return (
    <section style={{ padding: '60px 0', background: '#18181B' }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {stats.map((stat, i) => (
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
              <span style={{
                fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: '800',
                color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: '1',
              }}>
                {stat.value}
              </span>
              <span style={{
                fontSize: '12px', color: '#52525B', fontWeight: '500',
                textTransform: 'uppercase', letterSpacing: '0.05em',
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

function PricingCard({ name, price, desc, features, highlighted, cta, href }: {
  name: string; price: string; desc: string
  features: string[]; highlighted?: boolean; cta: string; href: string
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
        <Link href={href} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '14px 28px', background: '#FACC15', color: '#000', fontWeight: '700',
          fontSize: '14px', borderRadius: '100px', border: 'none', cursor: 'pointer',
          textDecoration: 'none', whiteSpace: 'nowrap',
        }}>
          {cta}
        </Link>
      ) : (
        <Link href={href} style={{
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

function Pricing() {
  const tiers = [
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

  return (
    <Section id='pricing'>
      <Eyebrow>Pricing</Eyebrow>
      <SectionHeadline mb='10px'>Simple, transparent pricing</SectionHeadline>
      <p style={{ fontSize: '15px', color: '#71717A', marginBottom: '48px' }}>No setup fees. No per-seat surprises. Cancel anytime.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'start' }}>
        {tiers.map(t => <PricingCard key={t.name} {...t} />)}
      </div>
    </Section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────

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

function FAQ() {
  const items = [
    { question: 'How long does it take to set up?', answer: 'Most schools are up and running in under 5 minutes. Create your school profile, add your instructors, and you\'re ready to accept bookings.' },
    { question: 'Can I import my existing student data?', answer: 'Yes. Import CSV files or connect via our API. All student records, session history, and TCA progress transfers automatically.' },
    { question: 'What happens if a student doesn\'t show up?', answer: 'Automated reminders go out 24 hours and 2 hours before each session. You can set your own cancellation policy and the system enforces it.' },
    { question: 'Is my school\'s data secure?', answer: 'We use bank-level encryption (AES-256), SOC 2 Type II infrastructure, and never share your data with third parties. You\'re the only one who sees your student information.' },
    { question: 'Do you offer refunds?', answer: 'Yes. If you cancel within your first 30 days and you\'re not satisfied, we\'ll refund your first month — no questions asked.' },
  ]

  return (
    <Section id='faq' bg='#18181B' pt={80} pb={80}>
      <Eyebrow>FAQ</Eyebrow>
      <SectionHeadline mb='40px'>Common questions</SectionHeadline>

      <div style={{ maxWidth: '680px' }}>
        {items.map(item => <FaqItem key={item.question} {...item} />)}
      </div>
    </Section>
  )
}

// ─── CTA Section ─────────────────────────────────────────────────────

function CTASection() {
  return (
    <Section pt={100} pb={100}>
      {/* Yellow glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse at center, rgba(250,204,21,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: '700',
          color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1.15',
          marginBottom: '16px',
        }}>
          Ready to run your school better?
        </h2>
        <p style={{ fontSize: '17px', color: '#71717A', lineHeight: '1.7', marginBottom: '40px' }}>
          Join 50+ driving schools across Tennessee already using The Driving Center.
          <br />14-day free trial. No credit card required.
        </p>
        <Link href='/signup' style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '16px 36px', background: '#FACC15', color: '#000', fontWeight: '700',
          fontSize: '16px', borderRadius: '100px', textDecoration: 'none',
          boxShadow: '0 0 60px rgba(250,204,21,0.2)',
        }}>
          Start free trial <ArrowRight size={18} />
        </Link>
      </div>
    </Section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'transparent', padding: '32px 0' }}>
      <Container>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px',
        }}>
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
            {[
              { label: 'Privacy', href: '/legal/privacy' },
              { label: 'Terms', href: '/legal/terms' },
              { label: 'Login', href: '/login' },
            ].map(link => (
              <a key={link.label} href={link.href} style={{
                fontSize: '13px', color: '#52525B', textDecoration: 'none',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#52525B')}
              >
                {link.label}
              </a>
            ))}
          </div>

          <span style={{ fontSize: '13px', color: '#52525B' }}>© 2026 The Driving Center. All rights reserved.</span>
        </div>
      </Container>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────

export default function HomePage() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  return (
    <main style={{ background: '#09090B', color: '#FFFFFF', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <LogoStrip />
      <Features />
      <HowItWorks />
      <StatsBar />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}