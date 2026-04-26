'use client'

import { Inter } from 'next/font/google'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Calendar, Bell, Shield, Users, CreditCard, BarChart3,
  CheckCircle, ArrowRight, Menu, X, ChevronDown, Star,
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

// ── Design Tokens ───────────────────────────────────────────────────────────────
const T = {
  bg:         '#050505',
  surface:    '#0D0D0D',
  elevated:   '#18181b',
  border:     '#1A1A1A',
  borderLt:   '#27272a',
  text:       '#ffffff',
  secondary:  '#94A3B8',
  muted:      '#52525b',
  cyan:       '#38BDF8',
  purple:     '#818CF8',
  green:      '#10B981',
  grad:       'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

// ── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

// ── Section Revealer ───────────────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      data-delay={delay}
    >
      {children}
    </div>
  )
}

// ── Dashboard Mockup ─────────────────────────────────────────────────────────
function DashboardMockup() {
  const stats = [
    { label: 'Active Students', val: '24', color: T.cyan },
    { label: 'Sessions Today',  val: '6',  color: T.green },
    { label: 'Pending TCA',      val: '3',  color: '#f59e0b' },
  ]
  const sessions = [
    { student: 'Alex M.',  time: '9:00 AM',  status: 'Confirmed', color: T.green },
    { student: 'Jordan K.', time: '11:00 AM', status: 'Confirmed', color: T.green },
    { student: 'Taylor R.', time: '2:00 PM',  status: 'Pending',  color: '#f59e0b' },
  ]
  const navItems = [
    { label: 'Dashboard', active: true },
    { label: 'Students',  active: false },
    { label: 'Sessions',  active: false },
    { label: 'Calendar',  active: false },
    { label: 'Settings',  active: false },
  ]

  return (
    <div
      className="relative"
      style={{ perspective: '1000px' }}
    >
      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          borderColor: T.border,
          transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg)',
          boxShadow: `0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px ${T.border}`,
        }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: T.elevated }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: T.green }} />
          <div className="flex-1 mx-3 h-5 rounded-md" style={{ background: T.surface }} />
        </div>
        {/* App */}
        <div style={{ background: T.bg }}>
          <div className="flex" style={{ minHeight: 280 }}>
            {/* Sidebar */}
            <div
              className="w-36 py-5 px-3 flex flex-col gap-1 border-r"
              style={{ borderColor: T.border, background: T.surface }}
            >
              <div
                className="w-7 h-7 rounded-lg mb-4 mx-auto"
                style={{ background: `linear-gradient(135deg,${T.cyan},${T.purple})` }}
              />
              {navItems.map(({ label, active }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer"
                  style={{
                    color: active ? T.text : T.muted,
                    background: active ? `${T.cyan}18` : 'transparent',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded"
                    style={{ background: active ? T.cyan : T.muted, opacity: active ? 1 : 0.4 }}
                  />
                  {label}
                </div>
              ))}
            </div>
            {/* Main */}
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold" style={{ color: T.text }}>
                    Good morning, Mark
                  </div>
                  <div className="text-xs" style={{ color: T.muted }}>Monday, April 26</div>
                </div>
                <div className="w-7 h-7 rounded-full" style={{ background: T.cyan }} />
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {stats.map(({ label, val, color }) => (
                  <div
                    key={label}
                    className="rounded-xl p-2.5"
                    style={{ background: T.surface }}
                  >
                    <div className="text-lg font-bold" style={{ color }}>{val}</div>
                    <div className="text-xs" style={{ color: T.muted }}>{label}</div>
                  </div>
                ))}
              </div>
              {/* Sessions */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold" style={{ color: T.muted }}>Upcoming Sessions</div>
                {sessions.map(({ student, time, status, color }) => (
                  <div
                    key={student}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ background: T.surface }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full" style={{ background: T.elevated }} />
                      <span className="text-xs font-medium" style={{ color: T.text }}>{student}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: T.muted }}>{time}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: `${color}18`, color }}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div
        className="absolute -bottom-4 -left-5 flex items-center gap-2.5 px-3 py-2 rounded-xl"
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          boxShadow: `0 8px 24px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${T.green}20` }}
        >
          <CheckCircle className="w-4 h-4" style={{ color: T.green }} />
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: T.text }}>Certificate issued</div>
          <div className="text-xs" style={{ color: T.muted }}>Jordan K. — just now</div>
        </div>
      </div>
    </div>
  )
}

// ── Navigation ───────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? `rgba(5,5,5,0.85)` : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled ? T.border : 'transparent'}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{ background: `linear-gradient(135deg,${T.cyan},${T.purple})` }}
          >
            DC
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ color: T.text }}>
            The Driving Center
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing', 'FAQ'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium transition-colors"
              style={{ color: T.secondary }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = T.text)}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = T.secondary)}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium px-3 py-1.5" style={{ color: T.secondary }}>
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all"
            style={{
              background: T.text,
              color: '#000',
              boxShadow: `0 0 20px rgba(56,189,248,0.15)`,
            }}
          >
            Start free trial
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          style={{ color: T.secondary }}
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className="md:hidden border-t py-4 px-6 space-y-1"
          style={{ background: T.surface, borderColor: T.border }}
        >
          {['Features', 'How it works', 'Pricing', 'FAQ'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(' ', '-')}`}
              className="block text-sm font-medium py-2"
              style={{ color: T.secondary }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link
            href="/signup"
            className="block text-center text-sm font-semibold text-black py-2.5 rounded-xl mt-3"
            style={{ background: T.text }}
            onClick={() => setMobileOpen(false)}
          >
            Start free trial
          </Link>
        </div>
      )}
    </header>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-20 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — Copy */}
          <div>
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
              style={{
                background: `${T.cyan}15`,
                border: `1px solid ${T.cyan}30`,
                color: T.cyan,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: T.cyan }} />
              Built for Tennessee driving schools
            </div>

            {/* H1 */}
            <h1
              className="font-bold leading-[0.97] mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Run your driving school{' '}
              <span
                style={{
                  background: T.grad,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                without the chaos.
              </span>
            </h1>

            {/* Sub */}
            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: T.secondary, maxWidth: '26rem' }}
            >
              Online booking. Automated reminders. Student tracking. TCA compliance.
              One flat price — no per-seat fees, no phone tag.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-8 py-4 rounded-full"
                style={{
                  background: T.text,
                  color: '#000',
                  boxShadow: `0 0 24px rgba(56,189,248,0.2)`,
                }}
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium px-8 py-4 rounded-xl"
                style={{
                  background: 'transparent',
                  color: T.secondary,
                  border: `1px solid ${T.borderLt}`,
                }}
              >
                See how it works
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {['No credit card required', 'Setup in under an hour', 'Cancel anytime'].map(b => (
                <div key={b} className="flex items-center gap-1.5 text-sm" style={{ color: T.muted }}>
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: T.green }} />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard mockup */}
          <div className="hidden lg:block">
            <div
              className="relative"
              style={{ padding: '20px 0 40px 20px' }}
            >
              {/* Ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 60% 40%, rgba(56,189,248,0.08) 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Logo Bar ────────────────────────────────────────────────────────────────────
function LogoBar() {
  return (
    <div className="py-12 border-y" style={{ borderColor: `${T.border}50` }}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-8"
          style={{ color: T.muted }}
        >
          Trusted by driving schools across Tennessee
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
          {['Oneida', 'Knoxville', 'Crossville', 'Jamestown', 'Huntsville', 'Cookeville'].map(city => (
            <span
              key={city}
              className="text-sm font-semibold tracking-wide"
              style={{ color: T.muted, opacity: 0.45 }}
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Features ───────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Calendar,
      title: 'Online Booking & Scheduling',
      description: 'Students book 24/7 from your custom page. Instructors set their own availability — no back-and-forth texts.',
      color: T.cyan,
    },
    {
      icon: Bell,
      title: 'Automated Reminders',
      description: '48h and 4h SMS + email reminders fire automatically. No-shows drop to near zero.',
      color: '#f59e0b',
    },
    {
      icon: Shield,
      title: 'TCA Compliance',
      description: 'Classroom and driving hours tracked in real time. Certificates issue when Tennessee requirements are met.',
      color: T.green,
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Import your entire roster in one CSV. Track every student\'s progress from enrollment to certification.',
      color: T.purple,
    },
    {
      icon: CreditCard,
      title: 'Stripe Payments',
      description: 'Students pay when they book. Funds go direct to your bank — we never hold money.',
      color: '#f59e0b',
    },
    {
      icon: BarChart3,
      title: 'Progress Dashboard',
      description: 'Real-time view of every student. Hours, status, and upcoming sessions — all in one place.',
      color: T.cyan,
    },
  ]

  return (
    <section id="features" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `${T.cyan}cc` }}>
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: T.text }}>
            Everything you need.{' '}
            <span style={{ color: T.secondary }}>Nothing you don&apos;t.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color }, i) => (
            <Reveal key={title} delay={i * 75}>
              <div className="p-8">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: T.text }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: T.secondary }}>{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ───────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Import your students',
      description: 'Upload a CSV or add them manually. Name, email, phone — all in under a minute.',
    },
    {
      num: '02',
      title: 'Set instructor availability',
      description: 'Each instructor logs in and blocks out their times. Students see only open slots.',
    },
    {
      num: '03',
      title: 'Get paid automatically',
      description: 'Students book and pay in advance. Sessions confirmed instantly. You focus on teaching.',
    },
  ]

  return (
    <section id="how-it-works" className="py-32" style={{ background: T.surface }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `${T.cyan}cc` }}>
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: T.text }}>
            Up and running in an hour.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ num, title, description }, i) => (
            <Reveal key={num} delay={i * 100}>
              <div className="relative">
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-6 right-0 w-[calc(100%-4rem)] h-px"
                    style={{
                      background: `linear-gradient(to right, ${T.border}, ${T.cyan}40)`,
                    }}
                  />
                )}
                <div className="text-6xl font-bold leading-none mb-4" style={{ color: T.border }}>
                  {num}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: T.text }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: T.secondary }}>{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ─────────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: '99',
      description: 'Up to 3 instructors, 50 students',
      features: [
        'Unlimited bookings',
        'SMS + email reminders',
        'TCA compliance tracking',
        'Certificate issuance',
        'CSV student import',
        'Stripe payments',
        'Email support',
      ],
      cta: 'Start free trial',
      popular: false,
    },
    {
      name: 'Growth',
      price: '199',
      description: 'Up to 8 instructors, 200 students',
      features: [
        'Everything in Starter',
        'White-label booking page',
        'Parent/guardian portal',
        'Custom session types',
        'Priority support',
        'API access',
      ],
      cta: 'Start free trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '399',
      description: 'Unlimited, multi-location',
      features: [
        'Everything in Growth',
        'Multi-location management',
        'Advanced reporting',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
      ],
      cta: 'Contact sales',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `${T.cyan}cc` }}>
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: T.text }}>
            Simple, transparent pricing.
          </h2>
          <p className="text-base" style={{ color: T.secondary }}>
            No hidden fees. No per-seat charges. Cancel anytime.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map(({ name, price, description, features, cta, popular }) => (
            <Reveal key={name} delay={popular ? 0 : 100}>
              <div
                className="rounded-3xl p-10"
                style={{
                  background: popular ? T.surface : T.surface,
                  border: popular
                    ? `2px solid ${T.cyan}80`
                    : `1px solid ${T.border}`,
                  borderWidth: popular ? '2px' : '1px',
                  boxShadow: popular ? `0 0 60px rgba(56,189,248,0.12)` : 'none',
                }}
              >
                {popular && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-5"
                    style={{ background: `${T.cyan}20`, color: T.cyan }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    Most popular
                  </div>
                )}

                <div
                  className="text-sm font-semibold uppercase tracking-wider mb-1"
                  style={{ color: popular ? T.cyan : T.secondary }}
                >
                  {name}
                </div>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-6xl font-bold tracking-tight" style={{ color: T.text }}>
                    ${price}
                  </span>
                  <span className="text-sm mb-2" style={{ color: T.muted }}>/mo</span>
                </div>
                <p className="text-sm mb-8" style={{ color: T.muted }}>{description}</p>

                <div
                  className="border-t pt-6 mb-8 space-y-3"
                  style={{ borderColor: popular ? `${T.border}` : T.border }}
                >
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: T.green }} />
                      <span style={{ color: T.secondary }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/signup"
                  className="block w-full text-center text-sm font-semibold py-3.5 rounded-xl transition-all"
                  style={
                    popular
                      ? {
                          background: T.grad,
                          color: T.text,
                          boxShadow: `0 0 30px rgba(56,189,248,0.3)`,
                        }
                      : {
                          background: T.elevated,
                          color: T.secondary,
                          border: `1px solid ${T.border}`,
                        }
                  }
                >
                  {cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const faqs = [
    {
      q: 'What if a student is a no-show?',
      a: 'Students receive two reminders (48h and 4h before) to drastically cut no-shows. You can mark a session as no-show from the dashboard and optionally configure a policy.',
    },
    {
      q: 'Does this handle Tennessee TCA compliance?',
      a: 'Yes. The TCA module tracks classroom hours and behind-the-wheel hours. Certificates generate automatically when state requirements are met.',
    },
    {
      q: 'What do SMS messages cost?',
      a: 'SMS reminders are included. Twilio messaging rates apply (~$0.01–0.02 per message) — we pass actual costs through with zero markup.',
    },
    {
      q: 'Is our student data secure?',
      a: 'Yes. Data is encrypted at rest and in transit. Row-level security in Supabase ensures each school only sees their own data. We are SOC 2 compliant.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. Month-to-month, no contracts. Cancel from your dashboard in two clicks — no fees, no calls required.',
    },
  ]

  return (
    <section id="faq" className="py-32" style={{ background: T.surface }}>
      <div className="max-w-2xl mx-auto px-6">
        <Reveal className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `${T.cyan}cc` }}>
            FAQ
          </p>
          <h2 className="text-4xl font-bold tracking-tight" style={{ color: T.text }}>
            Questions. Answered.
          </h2>
        </Reveal>

        <div className="space-y-2">
          {faqs.map(({ q, a }, i) => (
            <div
              key={q}
              className="rounded-2xl overflow-hidden border"
              style={{ background: T.bg, borderColor: T.border }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-medium" style={{ color: T.text }}>{q}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                  style={{
                    color: T.muted,
                    transform: openFaq === i ? 'rotate(180deg)' : 'none',
                  }}
                />
              </button>
              {openFaq === i && (
                <div
                  className="px-6 pb-5 text-sm leading-relaxed border-t"
                  style={{
                    color: T.secondary,
                    borderColor: T.border,
                    paddingTop: '1rem',
                  }}
                >
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer CTA ────────────────────────────────────────────────────────────────
function FooterCTA() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div
            className="rounded-3xl p-16 text-center relative overflow-hidden"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
            }}
          >
            {/* Subtle ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 60% at 50% 100%, rgba(56,189,248,0.07) 0%, transparent 70%)`,
              }}
            />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: T.text }}>
                Ready to run your school better?
              </h2>
              <p className="text-base mb-10" style={{ color: T.secondary }}>
                Start your free trial today. No credit card required.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-4 rounded-full text-black transition-all"
                style={{
                  background: T.grad,
                  boxShadow: `0 0 40px rgba(56,189,248,0.3)`,
                }}
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 border-t" style={{ borderColor: T.border }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ background: `linear-gradient(135deg,${T.cyan},${T.purple})` }}
          >
            DC
          </div>
          <span className="text-xs" style={{ color: T.muted }}>© 2026 The Driving Center</span>
        </div>
        <div className="flex gap-5">
          <a href="/legal/privacy" className="text-xs transition-colors" style={{ color: T.muted }}>
            Privacy
          </a>
          <a href="/legal/terms" className="text-xs transition-colors" style={{ color: T.muted }}>
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className={inter.className} style={{ background: T.bg, color: T.text }}>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 400ms ease-out, transform 400ms ease-out;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        [data-delay="75"]  { transition-delay: 75ms; }
        [data-delay="150"] { transition-delay: 150ms; }
        [data-delay="225"] { transition-delay: 225ms; }
        [data-delay="300"] { transition-delay: 300ms; }
        [data-delay="375"] { transition-delay: 375ms; }
        [data-delay="450"] { transition-delay: 450ms; }
        html { scroll-behavior: smooth; }
      `}</style>

      <Nav />
      <Hero />
      <LogoBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FooterCTA />
      <Footer />
    </div>
  )
}
