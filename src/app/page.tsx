'use client'

import { Inter } from 'next/font/google'
import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar, Bell, Shield, Users, CreditCard, BarChart3,
  CheckCircle, ArrowRight, Menu, X, ChevronDown, Star,
  FileCheck, ArrowUpRight, Clock, AlertCircle,
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

// ── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:           '#FFFFFF',
  surface:      '#FFFFFF',
  primary:      '#0F172A',
  secondary:    '#64748B',
  accent:       '#3B82F6',
  accentHover:  '#2563EB',
  border:       '#E2E8F0',
  borderDark:   '#CBD5E1',
  muted:        '#94A3B8',
  green:        '#10B981',
  amber:        '#f59e0b',
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: `1px solid ${T.border}` }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: T.accent }}
          >
            DC
          </div>
          <span className="text-sm font-semibold" style={{ color: T.primary }}>
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
              onMouseEnter={e => ((e.target as HTMLElement).style.color = T.primary)}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = T.secondary)}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium"
            style={{ color: T.secondary }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
            style={{
              background: T.accent,
              color: '#fff',
              boxShadow: '0 1px 2px rgba(59,130,246,0.3)',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.background = T.accentHover)}
            onMouseLeave={e => ((e.target as HTMLElement).style.background = T.accent)}
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
          style={{ background: T.bg, borderColor: T.border }}
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
          <div className="flex flex-col gap-2 pt-3">
            <Link href="/login" className="text-center text-sm font-medium py-2" style={{ color: T.secondary }} onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <Link
              href="/signup"
              className="block text-center text-sm font-semibold text-white py-2.5 rounded-lg"
              style={{ background: T.accent }}
              onClick={() => setMobileOpen(false)}
            >
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="py-24 md:py-32" style={{ background: T.bg }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Eyebrow pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{
            background: `${T.accent}10`,
            color: T.accent,
            border: `1px solid ${T.accent}20`,
          }}
        >
          Built for Tennessee driving schools
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ color: T.primary, letterSpacing: '-0.02em' }}
        >
          Run your driving school<br className="hidden md:block" /> without the chaos.
        </h1>

        {/* Subline */}
        <p
          className="text-base md:text-lg leading-relaxed mb-10"
          style={{ color: T.secondary, maxWidth: '540px', margin: '0 auto 2.5rem' }}
        >
          Online booking. Automated reminders. Student tracking. TCA compliance.
          One flat price — no per-seat fees, no phone tag.
        </p>

        {/* CTA */}
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-4 rounded-lg transition-all"
          style={{
            background: T.accent,
            color: '#fff',
            boxShadow: '0 1px 2px rgba(59,130,246,0.3), 0 4px 12px rgba(59,130,246,0.25)',
          }}
          onMouseEnter={e => {
            ;(e.target as HTMLElement).style.background = T.accentHover
            ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)'
          }}
          onMouseLeave={e => {
            ;(e.target as HTMLElement).style.background = T.accent
            ;(e.target as HTMLElement).style.boxShadow = '0 1px 2px rgba(59,130,246,0.3), 0 4px 12px rgba(59,130,246,0.25)'
          }}
        >
          Start free trial
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
          {['No credit card required', 'Setup in under an hour', 'Cancel anytime'].map(b => (
            <div key={b} className="flex items-center gap-1.5 text-sm" style={{ color: T.secondary }}>
              <CheckCircle className="w-4 h-4" style={{ color: T.green }} />
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Social Proof ─────────────────────────────────────────────────────────────
function LogoBar() {
  return (
    <section className="py-14 border-y" style={{ borderColor: T.border }}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-8"
          style={{ color: T.secondary }}
        >
          Trusted by driving schools across Tennessee
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {['Oneida', 'Knoxville', 'Crossville', 'Jamestown', 'Huntsville', 'Cookeville'].map(city => (
            <span
              key={city}
              className="text-sm font-medium tracking-wide"
              style={{ color: T.muted }}
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Calendar,
      title: 'Online Booking & Scheduling',
      description: 'Students book 24/7 from your custom page. Instructors set their own availability — no back-and-forth texts.',
    },
    {
      icon: Bell,
      title: 'Automated Reminders',
      description: '48h and 4h SMS + email reminders fire automatically. No-shows drop to near zero.',
    },
    {
      icon: Shield,
      title: 'TCA Compliance',
      description: 'Classroom and driving hours tracked in real time. Certificates issue when Tennessee requirements are met.',
    },
    {
      icon: Users,
      title: 'Student Management',
      description: 'Import your entire roster in one CSV. Track every student from enrollment to certification.',
    },
    {
      icon: CreditCard,
      title: 'Stripe Payments',
      description: 'Students pay when they book. Funds go direct to your bank — we never hold money.',
    },
    {
      icon: BarChart3,
      title: 'Progress Dashboard',
      description: 'Real-time view of every student. Hours, status, and upcoming sessions — all in one place.',
    },
  ]

  return (
    <section id="features" className="py-20" style={{ background: T.bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.accent }}>
            Features
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: T.primary, letterSpacing: '-0.02em' }}
          >
            Everything you need. Nothing you don&apos;t.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-8 rounded-xl card cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${T.accent}10` }}
              >
                <Icon className="w-5 h-5" style={{ color: T.accent }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: T.primary }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: T.secondary }}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ─────────────────────────────────────────────────────────────
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
    <section id="how-it-works" className="py-20" style={{ background: '#F8FAFC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.accent }}>
            How it works
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: T.primary, letterSpacing: '-0.02em' }}
          >
            Up and running in an hour.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ num, title, description }) => (
            <div key={num} className="text-center md:text-left">
              <div
                className="text-5xl font-bold leading-none mb-4 select-none w-full"
                style={{ color: '#F1F5F9' }}
              >
                {num}
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: T.primary }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: T.secondary }}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────────
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
    <section id="pricing" className="py-20" style={{ background: T.bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.accent }}>
            Pricing
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: T.primary, letterSpacing: '-0.02em' }}
          >
            Simple, transparent pricing.
          </h2>
          <p className="text-base" style={{ color: T.secondary }}>
            No hidden fees. No per-seat charges. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map(({ name, price, description, features, cta, popular }) => (
            <div
              key={name}
              className="p-8 rounded-xl"
              style={{
                background: T.surface,
                border: popular ? `2px solid ${T.accent}` : `1px solid ${T.border}`,
                borderRadius: '12px',
                boxShadow: popular ? `0 0 0 4px ${T.accent}15, 0 4px 14px rgba(59,130,246,0.12)` : 'none',
              }}
            >
              {popular && (
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-5"
                  style={{ background: `${T.accent}10`, color: T.accent }}
                >
                  <Star className="w-3 h-3 fill-current" />
                  Most popular
                </div>
              )}

              <div
                className="text-sm font-semibold uppercase tracking-wider mb-1"
                style={{ color: popular ? T.accent : T.secondary }}
              >
                {name}
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-bold tracking-tight" style={{ color: T.primary }}>
                  ${price}
                </span>
                <span className="text-sm mb-2" style={{ color: T.secondary }}>/mo</span>
              </div>
              <p className="text-sm mb-8" style={{ color: T.secondary }}>{description}</p>

              <div className="border-t pt-6 mb-8 space-y-3" style={{ borderColor: T.border }}>
                {features.map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: T.green }} />
                    <span style={{ color: T.secondary }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/signup"
                className="block w-full text-center text-sm font-semibold py-3 rounded-lg transition-all"
                style={
                  popular
                    ? { background: T.accent, color: '#fff', boxShadow: '0 1px 2px rgba(59,130,246,0.3)' }
                    : { background: '#F8FAFC', color: T.primary, border: `1px solid ${T.border}` }
                }
                onMouseEnter={e => popular
                  ? ((e.target as HTMLElement).style.background = T.accentHover)
                  : ((e.target as HTMLElement).style.borderColor = T.borderDark)
                }
                onMouseLeave={e => popular
                  ? ((e.target as HTMLElement).style.background = T.accent)
                  : ((e.target as HTMLElement).style.borderColor = T.border)
                }
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const items = [
    {
      q: 'How long does it take to set up?',
      a: 'Most schools are fully operational within an hour. Import your student roster, set instructor availability, and you\'re ready to accept bookings.',
    },
    {
      q: 'Do students need to install anything?',
      a: 'No. Students access your booking page through a link you share — it works on any device with a browser. No app download required.',
    },
    {
      q: 'How does TCA compliance work?',
      a: 'You log each student\'s classroom and driving hours as they complete them. When Tennessee requirements are met, the system automatically issues a compliance certificate.',
    },
    {
      q: 'What if I already use another scheduling tool?',
      a: 'You can migrate existing student data via CSV import. Our team can help with larger data migrations — contact us to discuss your situation.',
    },
    {
      q: 'Can instructors manage their own availability?',
      a: 'Yes. Each instructor gets their own login and can block out times they\'re unavailable. Students only see open slots.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes — 14 days free, no credit card required. You can explore every feature before deciding whether to subscribe.',
    },
  ]

  return (
    <section id="faq" className="py-20" style={{ background: '#F8FAFC' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: T.accent }}>
            FAQ
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: T.primary, letterSpacing: '-0.02em' }}
          >
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {items.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-lg border"
              style={{ borderColor: T.border, background: T.surface }}
            >
              <summary
                className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none"
              >
                <span className="text-sm font-medium" style={{ color: T.primary }}>{q}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                  style={{ color: T.secondary }}
                />
              </summary>
              <div className="px-6 pb-5">
                <p className="text-sm leading-relaxed" style={{ color: T.secondary }}>{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer CTA ────────────────────────────────────────────────────────────────
function FooterCTA() {
  return (
    <section className="py-20" style={{ background: T.bg }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: T.primary, letterSpacing: '-0.02em' }}
        >
          Ready to run your school better?
        </h2>
        <p className="text-base mb-10" style={{ color: T.secondary }}>
          Start your free trial today. No credit card required.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-4 rounded-lg transition-all"
          style={{
            background: T.accent,
            color: '#fff',
            boxShadow: '0 1px 2px rgba(59,130,246,0.3), 0 4px 12px rgba(59,130,246,0.25)',
          }}
          onMouseEnter={e => {
            ;(e.target as HTMLElement).style.background = T.accentHover
            ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)'
          }}
          onMouseLeave={e => {
            ;(e.target as HTMLElement).style.background = T.accent
            ;(e.target as HTMLElement).style.boxShadow = '0 1px 2px rgba(59,130,246,0.3), 0 4px 12px rgba(59,130,246,0.25)'
          }}
        >
          Start free trial
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 border-t" style={{ borderColor: T.border }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ background: T.accent }}
          >
            DC
          </div>
          <span className="text-sm" style={{ color: T.secondary }}>© 2026 The Driving Center</span>
        </div>
        <div className="flex gap-6">
          <a href="/legal/privacy" className="text-sm transition-colors" style={{ color: T.secondary }}>
            Privacy
          </a>
          <a href="/legal/terms" className="text-sm transition-colors" style={{ color: T.secondary }}>
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className={inter.className} style={{ background: T.bg, color: T.primary }}>
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