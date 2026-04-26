'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calendar, Users, Shield, Bell, Clock, CheckCircle, ArrowRight,
  Menu, X, CreditCard, TrendingUp, BarChart3, Star, ChevronDown, Zap
} from 'lucide-react'
import { useState } from 'react'

// ── Design Tokens (from PREMIUM_DESIGN_SYSTEM.md) ──────────────────────────────
const TOKEN = {
  bg:         '#09090b',
  surface:    '#18181b',
  surface2:   '#27272a',
  border:     '#3f3f46',
  text:       '#fafafa',
  muted:      '#a1a1aa',
  subtle:     '#52525b',
  accent:     '#3b82f6',
  accent2:    '#8b5cf6',
  success:    '#22c55e',
}

const FEATURES = [
  {
    icon: Calendar,
    title: 'Online Booking & Scheduling',
    description: 'Students book 24/7 from your custom page. Instructors set their own availability — no back-and-forth texts.',
    color: TOKEN.accent,
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
    description: 'Classroom and driving hours tracked in real time. Certificates issue the moment Tennessee requirements are met.',
    color: TOKEN.success,
  },
  {
    icon: Users,
    title: 'Student Management',
    description: 'Import your entire roster in one CSV. Track every student\'s progress from enrollment to certification.',
    color: TOKEN.accent2,
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
    color: TOKEN.accent,
  },
]

const HOW_STEPS = [
  {
    num: '01',
    title: 'Import your students',
    description: 'Upload a CSV or add them manually. Everything — name, email, phone — in under a minute.',
  },
  {
    num: '02',
    title: 'Set instructor availability',
    description: 'Each instructor logs in and blocks out the times they\'re available. Students see only open slots.',
  },
  {
    num: '03',
    title: 'Get paid automatically',
    description: 'Students book and pay in advance. Sessions are confirmed instantly. You focus on teaching.',
  },
]

const PRICING = [
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

const FAQS = [
  { q: 'What if a student is a no-show?', a: 'Students receive two reminders (48h and 4h before) to drastically cut no-shows. You can mark a session as no-show from the dashboard and optionally configure a policy.' },
  { q: 'Does this handle Tennessee TCA compliance?', a: 'Yes. The TCA module tracks classroom hours and behind-the-wheel hours. Certificates generate automatically when state requirements are met.' },
  { q: 'What do SMS messages cost?', a: 'SMS reminders are included. Twilio messaging rates apply (~$0.01–0.02 per message) — we pass actual costs through with zero markup.' },
  { q: 'Is our student data secure?', a: 'Yes. Data is encrypted at rest and in transit. Row-level security in Supabase ensures each school only sees their own data. We are SOC 2 compliant.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Month-to-month, no contracts. Cancel from your dashboard in two clicks — no fees, no calls required.' },
]

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
}
const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.075 } },
}

// ── Product Mockup (Right side of hero) ───────────────────────────────────────
function ProductMockup() {
  return (
    <div className="relative">
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          borderColor: TOKEN.border,
          boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px ${TOKEN.border}`,
          transform: 'perspective(1200px) rotateY(-6deg) rotateX(3deg)',
        }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: TOKEN.surface2 }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: TOKEN.success }} />
          <div className="flex-1 mx-3 h-5 rounded-md" style={{ background: TOKEN.surface }} />
        </div>
        {/* App UI */}
        <div style={{ background: TOKEN.bg }}>
          {/* Sidebar */}
          <div className="flex">
            <div className="w-40 py-5 px-3 border-r" style={{ borderColor: TOKEN.border, background: TOKEN.surface }}>
              <div className="w-7 h-7 rounded-lg mb-5" style={{ background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})` }} />
              {[
                { icon: '▣', label: 'Dashboard', active: true },
                { icon: '◉', label: 'Students' },
                { icon: '⊕', label: 'Sessions' },
                { icon: '◎', label: 'Calendar' },
                { icon: '⚙', label: 'Settings' },
              ].map(({ label, active }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-xs"
                  style={{
                    color: active ? TOKEN.text : TOKEN.subtle,
                    background: active ? `${TOKEN.accent}18` : 'transparent',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <div className="w-4 h-4 rounded" style={{ background: active ? TOKEN.accent : TOKEN.subtle, opacity: 0.5 }} />
                  {label}
                </div>
              ))}
            </div>
            {/* Main content */}
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold" style={{ color: TOKEN.text }}>Good morning, Mark</div>
                  <div className="text-xs" style={{ color: TOKEN.subtle }}>Monday, April 26</div>
                </div>
                <div className="w-7 h-7 rounded-full" style={{ background: TOKEN.accent }} />
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Active Students', val: '24', color: TOKEN.accent },
                  { label: 'Sessions Today', val: '6', color: TOKEN.success },
                  { label: 'Pending TCA', val: '3', color: '#f59e0b' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="rounded-xl p-2.5" style={{ background: TOKEN.surface }}>
                    <div className="text-lg font-bold" style={{ color }}>{val}</div>
                    <div className="text-xs" style={{ color: TOKEN.subtle }}>{label}</div>
                  </div>
                ))}
              </div>
              {/* Recent sessions */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold" style={{ color: TOKEN.muted }}>Upcoming Sessions</div>
                {[
                  { student: 'Alex M.', time: '9:00 AM', status: 'Confirmed', color: TOKEN.success },
                  { student: 'Jordan K.', time: '11:00 AM', status: 'Confirmed', color: TOKEN.success },
                  { student: 'Taylor R.', time: '2:00 PM', status: 'Pending', color: '#f59e0b' },
                ].map(({ student, time, status, color }) => (
                  <div key={student} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: TOKEN.surface }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ background: TOKEN.surface2 }} />
                      <span className="text-xs font-medium" style={{ color: TOKEN.text }}>{student}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: TOKEN.subtle }}>{time}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${color}18`, color }}>{status}</span>
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
        className="absolute -bottom-4 -left-6 flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: TOKEN.surface2, border: `1px solid ${TOKEN.border}`, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${TOKEN.success}20` }}>
          <CheckCircle className="w-4 h-4" style={{ color: TOKEN.success }} />
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: TOKEN.text }}>Certificate issued</div>
          <div className="text-xs" style={{ color: TOKEN.subtle }}>Jordan K. — just now</div>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen text-white font-sans" style={{ background: TOKEN.bg }}>
      {/* ── NAV ────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(9,9,11,0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: TOKEN.border,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              style={{ background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})` }}
            >
              DC
            </div>
            <span className="text-sm font-semibold tracking-tight">The Driving Center</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it works', href: '#how' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium transition-colors"
                style={{ color: TOKEN.muted }}
                onMouseEnter={e => (e.currentTarget.style.color = TOKEN.text)}
                onMouseLeave={e => (e.currentTarget.style.color = TOKEN.muted)}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-3 py-1.5 transition-colors"
              style={{ color: TOKEN.muted }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all"
              style={{
                background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})`,
                boxShadow: `0 0 24px rgba(59,130,246,0.3)`,
              }}
            >
              Start free trial
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            style={{ color: TOKEN.muted }}
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            className="md:hidden border-t py-4 px-6 space-y-1"
            style={{ background: TOKEN.surface, borderColor: TOKEN.border }}
          >
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it works', href: '#how' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="block text-sm font-medium py-2"
                style={{ color: TOKEN.muted }}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
            <Link
              href="/signup"
              className="block text-center text-sm font-semibold text-white py-2.5 rounded-xl mt-3"
              style={{ background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})` }}
              onClick={() => setMobileOpen(false)}
            >
              Start free trial
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-20 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT — Copy */}
            <motion.div variants={container} initial="hidden" animate="show">
              {/* Eyebrow */}
              <motion.div variants={fadeUp}>
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
                  style={{
                    background: `${TOKEN.accent}15`,
                    border: `1px solid ${TOKEN.accent}30`,
                    color: TOKEN.accent,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: TOKEN.accent }} />
                  Built for Tennessee driving schools
                </div>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeUp}>
                <h1
                  className="font-bold tracking-tight leading-[0.97] mb-6"
                  style={{ fontSize: 'clamp(2.75rem, 5vw, 4.5rem)', letterSpacing: '-0.025em' }}
                >
                  Run your driving school{' '}
                  <span
                    style={{
                      background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    without the chaos.
                  </span>
                </h1>
              </motion.div>

              {/* Sub */}
              <motion.div variants={fadeUp}>
                <p
                  className="text-lg leading-relaxed mb-10"
                  style={{ color: TOKEN.muted, maxWidth: '28rem' }}
                >
                  Online booking. Automated reminders. Student tracking. TCA compliance.
                  One flat price — no per-seat fees, no phone tag.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-8 py-4 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})`,
                    boxShadow: `0 0 40px rgba(59,130,246,0.35)`,
                  }}
                >
                  Start free trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium px-8 py-4 rounded-xl"
                  style={{
                    background: TOKEN.surface,
                    border: `1px solid ${TOKEN.border}`,
                    color: TOKEN.muted,
                  }}
                >
                  See how it works
                </a>
              </motion.div>

              {/* Trust */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {[
                  'No credit card required',
                  'Setup in under an hour',
                  'Cancel anytime',
                ].map(badge => (
                  <div key={badge} className="flex items-center gap-1.5 text-sm" style={{ color: TOKEN.subtle }}>
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: TOKEN.success }} />
                    {badge}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT — Product mockup */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:block"
            >
              <ProductMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LOGO BAR ────────────────────────────────────────────────── */}
      <div
        className="py-12 border-y"
        style={{ borderColor: `${TOKEN.border}50` }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ color: TOKEN.subtle }}
          >
            Trusted by driving schools across Tennessee
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
            {['Oneida', 'Knoxville', 'Crossville', 'Jamestown', 'Huntsville', 'Cookeville'].map(city => (
              <span key={city} className="text-sm font-semibold tracking-wide" style={{ color: TOKEN.subtle }}>
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section id="features" className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `${TOKEN.accent}cc` }}>
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: TOKEN.text }}>
              Everything you need.{' '}
              <span style={{ color: TOKEN.muted }}>Nothing you don&apos;t.</span>
            </h2>
          </motion.div>

          {/* Cards grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group rounded-2xl p-8 border transition-all duration-200 cursor-default"
                style={{
                  background: TOKEN.surface,
                  borderColor: TOKEN.border,
                }}
                whileHover={{
                  borderColor: `${color}60`,
                  y: -2,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
                  transition: { duration: 0.2 },
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: TOKEN.text }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TOKEN.muted }}>{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how" className="py-32" style={{ background: TOKEN.surface }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `${TOKEN.accent}cc` }}>
              How it works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: TOKEN.text }}>
              Up and running in an hour.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ num, title, description }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Connector line */}
                {i < 2 && (
                  <div
                    className="hidden md:block absolute top-6 right-0 w-[calc(100%-4rem)] h-px"
                    style={{
                      background: `linear-gradient(to right, ${TOKEN.border}, ${TOKEN.accent}40)`,
                    }}
                  />
                )}
                <div className="text-6xl font-bold leading-none mb-4" style={{ color: `${TOKEN.border}` }}>
                  {num}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: TOKEN.text }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TOKEN.muted }}>{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="pricing" className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `${TOKEN.accent}cc` }}>
              Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: TOKEN.text }}>
              Simple, transparent pricing.
            </h2>
            <p className="text-base" style={{ color: TOKEN.muted }}>
              No hidden fees. No per-seat charges. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PRICING.map(({ name, price, description, features, cta, popular }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl p-10 border"
                style={{
                  background: popular ? TOKEN.surface : TOKEN.surface,
                  borderColor: popular ? `${TOKEN.accent}50` : TOKEN.border,
                  borderWidth: popular ? '2px' : '1px',
                  boxShadow: popular ? `0 0 60px rgba(59,130,246,0.12)` : 'none',
                }}
              >
                {popular && (
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-5"
                    style={{ background: `${TOKEN.accent}20`, color: TOKEN.accent }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    Most popular
                  </div>
                )}

                <div className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: popular ? TOKEN.accent : TOKEN.muted }}>
                  {name}
                </div>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-6xl font-bold tracking-tight" style={{ color: TOKEN.text }}>${price}</span>
                  <span className="text-sm mb-2" style={{ color: TOKEN.subtle }}>/mo</span>
                </div>
                <p className="text-sm mb-8" style={{ color: TOKEN.subtle }}>{description}</p>

                <div className="border-t pt-6 mb-8 space-y-3" style={{ borderColor: popular ? `${TOKEN.border}` : TOKEN.border }}>
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: TOKEN.success }} />
                      <span style={{ color: popular ? TOKEN.muted : TOKEN.muted }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/signup"
                  className="block w-full text-center text-sm font-semibold py-3.5 rounded-xl transition-all"
                  style={
                    popular
                      ? { background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})`, color: TOKEN.text, boxShadow: `0 0 30px rgba(59,130,246,0.3)` }
                      : { background: TOKEN.surface2, color: TOKEN.muted, border: `1px solid ${TOKEN.border}` }
                  }
                >
                  {cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq" className="py-32" style={{ background: TOKEN.surface }}>
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: `${TOKEN.accent}cc` }}>
              FAQ
            </p>
            <h2 className="text-4xl font-bold tracking-tight" style={{ color: TOKEN.text }}>
              Questions. Answered.
            </h2>
          </motion.div>

          <div className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <div
                key={q}
                className="rounded-2xl overflow-hidden border"
                style={{ background: TOKEN.bg, borderColor: TOKEN.border }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium" style={{ color: TOKEN.text }}>{q}</span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{ color: TOKEN.subtle, transform: openFaq === i ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                {openFaq === i && (
                  <div
                    className="px-6 pb-5 text-sm leading-relaxed border-t"
                    style={{ color: TOKEN.muted, borderColor: TOKEN.border, paddingTop: '1rem' }}
                  >
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-16 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg,${TOKEN.accent}20,${TOKEN.accent2}15)`,
              border: `1px solid ${TOKEN.accent}30`,
            }}
          >
            {/* Background dot grid */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, ${TOKEN.text} 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              }}
            />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: TOKEN.text }}>
                Ready to run your school better?
              </h2>
              <p className="text-base mb-10" style={{ color: TOKEN.muted }}>
                Start your free trial today. No credit card required.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-4 rounded-xl text-white transition-all"
                style={{
                  background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})`,
                  boxShadow: `0 0 40px rgba(59,130,246,0.3)`,
                }}
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="py-8 border-t" style={{ borderColor: TOKEN.border }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ background: `linear-gradient(135deg,${TOKEN.accent},${TOKEN.accent2})` }}
            >
              DC
            </div>
            <span className="text-xs" style={{ color: TOKEN.subtle }}>© 2026 The Driving Center</span>
          </div>
          <div className="flex gap-5">
            <a href="/legal/privacy" className="text-xs transition-colors" style={{ color: TOKEN.subtle }}>Privacy</a>
            <a href="/legal/terms" className="text-xs transition-colors" style={{ color: TOKEN.subtle }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
