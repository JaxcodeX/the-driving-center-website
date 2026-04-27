'use client'

import { Inter } from 'next/font/google'
import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar, Bell, Shield, Users, CreditCard, BarChart3,
  CheckCircle, ArrowRight, Menu, X, ChevronDown, Star,
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

// ── Icons (inline SVG to avoid extra dependencies) ────────────────────────────
function GradientBarChart() {
  return (
    <div className="flex items-end gap-2 h-24">
      {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${h}%`,
            background: `linear-gradient(180deg, #818CF8 0%, #006FFF 100%)`,
            opacity: 0.7 + (i / 12) * 0.3,
          }}
        />
      ))}
    </div>
  )
}

function GrowthLineChart() {
  const points = [
    [0, 60], [1, 55], [2, 65], [3, 58], [4, 70],
    [5, 68], [6, 75], [7, 72], [8, 80], [9, 78], [10, 88],
  ]
  const maxX = points.length - 1
  const maxY = 100
  const w = 220
  const h = 40
  const pathData = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${(x / maxX) * w} ${h - (y / maxY) * h}`)
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Glow fill */}
      <path
        d={`${pathData} L ${w} ${h} L 0 ${h} Z`}
        fill="url(#lineGrad)"
      />
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 6px #10B981)' }}
      />
      {/* Dot */}
      <circle
        cx={(points[points.length - 1][0] / maxX) * w}
        cy={h - (points[points.length - 1][1] / maxY) * h}
        r="3"
        fill="#10B981"
        style={{ filter: 'drop-shadow(0 0 6px #10B981)' }}
      />
    </svg>
  )
}

// ── Dashboard Mockup ──────────────────────────────────────────────────────────
function DashboardMockup() {
  const sessions = [
    { name: 'Emma Thompson', initials: 'ET', time: '9:00 AM', status: 'Confirmed', statusColor: '#10B981' },
    { name: 'Lucas Rivera', initials: 'LR', time: '10:30 AM', status: 'In Progress', statusColor: '#f59e0b' },
    { name: 'Aisha Patel', initials: 'AP', time: '1:00 PM', status: 'Pending TCA', statusColor: '#818CF8' },
  ]
  const navItems = ['Dashboard', 'Students', 'Sessions', 'Certificates', 'Payments', 'Settings']
  const activeIdx = 0

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="relative mx-auto max-w-5xl px-4" style={{ perspective: '1200px' }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,111,255,0.18) 0%, transparent 70%)',
          transform: 'translateY(20px)',
          filter: 'blur(20px)',
        }}
      />

      {/* Browser chrome */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: '#111113',
          transform: 'rotateY(-5deg) rotateX(2deg)',
          border: '1px solid #27272a',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ background: '#0D0D0D', borderBottom: '1px solid #1A1A1A' }}
        >
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
          <div
            className="flex-1 mx-4 flex items-center justify-center h-6 rounded text-xs"
            style={{ background: '#18181b', color: '#52525b' }}
          >
            app.thedrivingcenter.com
          </div>
        </div>

        {/* Dashboard body */}
        <div className="flex" style={{ background: '#0D0D0D', minHeight: '360px' }}>
          {/* Sidebar */}
          <div
            className="w-44 flex-shrink-0 py-4 flex flex-col"
            style={{ background: '#0D0D0D', borderRight: '1px solid #1A1A1A' }}
          >
            {/* Logo */}
            <div className="px-4 mb-4 flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              >
                DC
              </div>
              <span className="text-xs text-white font-semibold">Driving Center</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 space-y-0.5">
              {navItems.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-2 py-2 rounded-md text-xs relative"
                  style={{
                    color: i === activeIdx ? '#ffffff' : '#52525b',
                    background: i === activeIdx ? '#18181b' : 'transparent',
                  }}
                >
                  {i === activeIdx && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                  {item}
                </div>
              ))}
            </nav>

            {/* Profile */}
            <div className="px-4 pt-3 mt-auto flex items-center gap-2" style={{ borderTop: '1px solid #1A1A1A' }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #818CF8, #006FFF)' }}
              >
                MK
              </div>
              <div>
                <div className="text-xs text-white font-medium">Mark</div>
                <div className="text-xs" style={{ color: '#52525b' }}>Instructor</div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 overflow-hidden">
            {/* Greeting */}
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white">Good morning, Mark</h2>
              <p className="text-xs" style={{ color: '#52525b' }}>{today}</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Active Students', value: '24', color: 'var(--accent)' },
                { label: 'Sessions Today', value: '6', color: '#10B981' },
                { label: 'Pending TCA', value: '3', color: '#f59e0b' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-3 rounded-lg"
                  style={{ background: '#18181b', border: '1px solid #1A1A1A' }}
                >
                  <div className="text-xs mb-1" style={{ color: '#52525b' }}>{label}</div>
                  <div className="text-xl font-bold" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Sessions list */}
            <div className="mb-4">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#52525b' }}>
                Today&apos;s Sessions
              </div>
              <div className="space-y-2">
                {sessions.map(s => (
                  <div
                    key={s.name}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg"
                    style={{ background: '#18181b', border: '1px solid #1A1A1A' }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #818CF8, #006FFF)' }}
                    >
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white font-medium">{s.name}</div>
                      <div className="text-xs" style={{ color: '#52525b' }}>{s.time}</div>
                    </div>
                    <div
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: `${s.statusColor}20`, color: s.statusColor }}
                    >
                      {s.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Bar chart */}
              <div className="p-3 rounded-lg" style={{ background: '#18181b', border: '1px solid #1A1A1A' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#52525b' }}>
                  Weekly Sessions
                </div>
                <GradientBarChart />
              </div>

              {/* Line chart */}
              <div className="p-3 rounded-lg" style={{ background: '#18181b', border: '1px solid #1A1A1A' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#52525b' }}>
                  Growth Trend
                </div>
                <GrowthLineChart />
              </div>
            </div>
          </div>
        </div>

        {/* Floating certificate badge */}
        <div
          className="absolute -top-3 -right-6 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium"
          style={{
            background: '#0D0D0D',
            border: '1px solid #10B981',
            color: '#10B981',
            boxShadow: '0 0 20px rgba(16,185,129,0.3)',
          }}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Jordan K. — just now
        </div>
      </div>
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: '#0D0D0D', borderBottom: '1px solid #1A1A1A' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--accent)' }}
          >
            DC
          </div>
          <span className="text-sm font-semibold text-white">
            The Driving Center
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing', 'FAQ'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm font-medium transition-colors"
              style={{ color: '#94A3B8' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#ffffff')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#94A3B8')}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium" style={{ color: '#94A3B8' }}>
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-sm"
          >
            Start free trial
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          style={{ color: '#94A3B8' }}
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className="md:hidden border-t py-4 px-6 space-y-1"
          style={{ background: '#0D0D0D', borderColor: '#1A1A1A' }}
        >
          {['Features', 'How it works', 'Pricing', 'FAQ'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, '-')}`}
              className="block text-sm font-medium py-2"
              style={{ color: '#94A3B8' }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3">
            <Link href="/login" className="text-center text-sm font-medium py-2" style={{ color: '#94A3B8' }} onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <Link href="/signup" className="block text-center text-sm font-semibold text-white py-3 rounded-full" style={{ background: 'var(--accent)', boxShadow: '0 0 30px rgba(0,111,255,0.4)' }} onClick={() => setMobileOpen(false)}>
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="starfield-bg py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        {/* Eyebrow pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{
            background: 'rgba(0,111,255,0.15)',
            color: '#006FFF',
            border: '1px solid rgba(0,111,255,0.3)',
          }}
        >
          Built for Tennessee driving schools
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
        >
          Run your driving school{' '}
          <span className="gradient-text">without the chaos.</span>
        </h1>

        {/* Subline */}
        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ color: '#94A3B8', maxWidth: '540px', margin: '0 auto 2.5rem' }}
        >
          Online booking. Automated reminders. Student tracking. TCA compliance.
          One flat price — no per-seat fees, no phone tag.
        </p>

        {/* CTA */}
        <Link
          href="/signup"
          className="btn-primary text-base px-10 py-4"
        >
          Start free trial
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
          {['No credit card required', 'Setup in under an hour', 'Cancel anytime'].map(b => (
            <div key={b} className="flex items-center gap-1.5 text-sm" style={{ color: '#94A3B8' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
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
    <section className="py-12" style={{ background: '#0D0D0D', borderTop: '1px solid #1A1A1A', borderBottom: '1px solid #1A1A1A' }}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: '#52525b' }}
        >
          Trusted by driving schools across Tennessee
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {['Oneida', 'Knoxville', 'Crossville', 'Jamestown', 'Huntsville', 'Cookeville'].map(city => (
            <span
              key={city}
              className="text-sm font-medium tracking-wide"
              style={{ color: '#52525b' }}
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
    { icon: Calendar, color: '#006FFF', title: 'Online Booking & Scheduling', description: 'Students book 24/7 from your custom page. Instructors set their own availability — no back-and-forth texts.' },
    { icon: Bell, color: '#f59e0b', title: 'Automated Reminders', description: '48h and 4h SMS + email reminders fire automatically. No-shows drop to near zero.' },
    { icon: Shield, color: '#10B981', title: 'TCA Compliance', description: 'Classroom and driving hours tracked in real time. Certificates issue when Tennessee requirements are met.' },
    { icon: Users, color: '#818CF8', title: 'Student Management', description: 'Import your entire roster in one CSV. Track every student from enrollment to certification.' },
    { icon: CreditCard, color: '#6366f1', title: 'Stripe Payments', description: 'Students pay when they book. Funds go direct to your bank — we never hold money.' },
    { icon: BarChart3, color: '#38BDF8', title: 'Progress Dashboard', description: 'Real-time view of every student. Hours, status, and upcoming sessions — all in one place.' },
  ]

  return (
    <section id="features" className="py-20" style={{ background: '#050505' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
          >
            Everything you need. Nothing you don&apos;t.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, color, title, description }) => (
            <div
              key={title}
              className="card-dark p-8 rounded-2xl cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: '#ffffff' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{description}</p>
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
    { num: '01', title: 'Import your students', description: 'Upload a CSV or add them manually. Name, email, phone — all in under a minute.' },
    { num: '02', title: 'Set instructor availability', description: 'Each instructor logs in and blocks out their times. Students see only open slots.' },
    { num: '03', title: 'Get paid automatically', description: 'Students book and pay in advance. Sessions confirmed instantly. You focus on teaching.' },
  ]

  return (
    <section id="how-it-works" className="py-20" style={{ background: '#0D0D0D' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
          >
            Up and running in an hour.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div
            className="hidden md:block absolute top-6 left-1/2 w-full h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #1A1A1A 20%, #1A1A1A 80%, transparent 100%)' }}
          />

          {steps.map(({ num, title, description }) => (
            <div key={num} className="text-center md:text-left relative">
              <div
                className="text-6xl font-bold leading-none mb-4 select-none w-full"
                style={{ color: '#18181b' }}
              >
                {num}
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: '#ffffff' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{description}</p>
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
      name: 'Starter', price: '99', description: 'Up to 3 instructors, 50 students',
      features: ['Unlimited bookings', 'SMS + email reminders', 'TCA compliance tracking', 'Certificate issuance', 'CSV student import', 'Stripe payments', 'Email support'],
      cta: 'Start free trial', popular: false,
    },
    {
      name: 'Growth', price: '199', description: 'Up to 8 instructors, 200 students',
      features: ['Everything in Starter', 'White-label booking page', 'Parent/guardian portal', 'Custom session types', 'Priority support', 'API access'],
      cta: 'Start free trial', popular: true,
    },
    {
      name: 'Enterprise', price: '399', description: 'Unlimited, multi-location',
      features: ['Everything in Growth', 'Multi-location management', 'Advanced reporting', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'],
      cta: 'Contact sales', popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20" style={{ background: '#050505' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#ffffff', letterSpacing: '-0.02em' }}
          >
            Simple, transparent pricing.
          </h2>
          <p className="text-base" style={{ color: '#94A3B8' }}>
            No hidden fees. No per-seat charges. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map(({ name, price, description, features, cta, popular }) => (
            <div
              key={name}
              className="card-dark p-8 rounded-2xl"
              style={{
                border: popular ? '2px solid var(--accent)' : '1px solid #1A1A1A',
                boxShadow: popular ? '0 0 0 4px rgba(0,111,255,0.15), 0 4px 14px rgba(0,111,255,0.2)' : 'none',
              }}
            >
              {popular && (
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-5"
                  style={{ background: 'rgba(0,111,255,0.15)', color: '#006FFF' }}
                >
                  <Star className="w-3 h-3 fill-current" />
                  Most popular
                </div>
              )}

              <div className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: popular ? '#006FFF' : '#94A3B8' }}>
                {name}
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-5xl font-bold tracking-tight" style={{ color: '#ffffff' }}>${price}</span>
                <span className="text-sm mb-2" style={{ color: '#94A3B8' }}>/mo</span>
              </div>
              <p className="text-sm mb-8" style={{ color: '#94A3B8' }}>{description}</p>

              <div className="border-t mb-8 pt-6 space-y-3" style={{ borderColor: '#1A1A1A' }}>
                {features.map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#10B981' }} />
                    <span style={{ color: '#94A3B8' }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/signup"
                className="block w-full text-center text-sm font-semibold py-3 rounded-full transition-all"
                style={
                  popular
                    ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 0 30px rgba(0,111,255,0.4)' }
                    : { background: '#18181b', color: '#94A3B8', border: '1px solid #27272a' }
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
    { q: 'How long does it take to set up?', a: "Most schools are fully operational within an hour. Import your student roster, set instructor availability, and you're ready to accept bookings." },
    { q: 'Do students need to install anything?', a: 'No. Students access your booking page through a link you share — it works on any device with a browser. No app download required.' },
    { q: 'How does TCA compliance work?', a: "You log each student's classroom and driving hours as they complete them. When Tennessee requirements are met, the system automatically issues a compliance certificate." },
    { q: 'What if I already use another scheduling tool?', a: 'You can migrate existing student data via CSV import. Our team can help with larger data migrations — contact us to discuss your situation.' },
    { q: 'Can instructors manage their own availability?', a: "Yes. Each instructor gets their own login and can block out times they're unavailable. Students only see open slots." },
    { q: 'Is there a free trial?', a: 'Yes — 14 days free, no credit card required. You can explore every feature before deciding whether to subscribe.' },
  ]

  return (
    <section id="faq" className="py-20" style={{ background: '#0D0D0D' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {items.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl"
              style={{ background: '#18181b', border: '1px solid #1A1A1A' }}
            >
              <summary
                className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none"
              >
                <span className="text-sm font-medium" style={{ color: '#ffffff' }}>{q}</span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                  style={{ color: '#52525b' }}
                />
              </summary>
              <div className="px-6 pb-5">
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{a}</p>
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
    <section className="py-20 starfield-bg">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
          Ready to run your school better?
        </h2>
        <p className="text-base mb-10" style={{ color: '#94A3B8' }}>
          Start your free trial today. No credit card required.
        </p>
        <Link href="/signup" className="btn-primary text-base px-10 py-4">
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
    <footer className="py-8" style={{ borderTop: '1px solid #1A1A1A' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--accent)' }}
          >
            DC
          </div>
          <span className="text-sm" style={{ color: '#52525b' }}>© 2026 The Driving Center</span>
        </div>
        <div className="flex gap-6">
          <a href="/legal/privacy" className="text-sm transition-colors" style={{ color: '#52525b' }}>Privacy</a>
          <a href="/legal/terms" className="text-sm transition-colors" style={{ color: '#52525b' }}>Terms</a>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className={inter.className} style={{ background: '#050505', color: '#ffffff' }}>
      <Nav />
      <Hero />
      <DashboardMockup />
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
