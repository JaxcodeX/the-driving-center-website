'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Users, Shield, Bell, Clock, CheckCircle, ArrowRight } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const FEATURES = [
  {
    icon: Calendar,
    title: 'Online Booking',
    description: 'Students book and pay online 24/7. No phone tag. No manual scheduling.',
    color: '#06b6d4',
  },
  {
    icon: Users,
    title: 'Student Tracking',
    description: 'Classroom hours, driving hours, and TCA progress tracked automatically.',
    color: '#3b82f6',
  },
  {
    icon: Shield,
    title: 'TCA Compliance',
    description: 'Certificates issue automatically when Tennessee requirements are met.',
    color: '#10b981',
  },
  {
    icon: Bell,
    title: 'Automated Reminders',
    description: '48h and 4h SMS + email reminders so students never miss a lesson.',
    color: '#f59e0b',
  },
  {
    icon: Clock,
    title: 'Instructor Availability',
    description: 'Instructors set their own schedule. You manage, not micromanage.',
    color: '#8b5cf6',
  },
  {
    icon: CheckCircle,
    title: 'CSV Import',
    description: 'Bulk-import your existing student list in seconds.',
    color: '#06b6d4',
  },
]

const FAQS = [
  { q: 'How long does setup take?', a: 'Most schools are running in under an hour. Add your instructors, set your schedule, share the booking link.' },
  { q: 'Do I need a contract?', a: 'No. Month-to-month, cancel anytime. No long-term commitment.' },
  { q: 'Is this built for Tennessee?', a: 'Yes. TCA certificate issuance is built around Tennessee DMV requirements.' },
  { q: 'How do payments work?', a: 'Students pay via Stripe. Funds go directly to your bank account. We never hold money.' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export default function HomePage() {
  return (
    <div className="min-h-screen text-white" style={{ background: '#030308' }}>
      {/* ── NAV ───────────────────────────────────── */}
      <nav className="stick top-0 z-50 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(3,3,8,0.8)', backdropFilter: 'blur(24px)' }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}>DC</div>
            <span className="text-sm font-semibold tracking-tight">The Driving Center</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
            >
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Built for Tennessee driving schools
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
                The platform that runs<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(6,182,212,0.5)', WebkitTextFillColor: 'transparent' }}>
                  your driving school.
                </span>
              </h1>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
                Online booking. Automated reminders. Student progress tracking. TCA compliance.
                One flat price — no per-seat fees.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-7 py-3.5 rounded-xl transition-all"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 40px rgba(6,182,212,0.35)' }}
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 px-7 py-3.5 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                See how it works
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                'No contracts — cancel anytime',
                'Setup in under an hour',
                'Pause or cancel anytime',
              ].map(b => (
                <div key={b} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-500/60" />
                  {b}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────── */}
      <section id="features" className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80 mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need.{' '}
              <span className="text-gray-500">Nothing you don&apos;t.</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group relative p-6 rounded-2xl cursor-default transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                whileHover={{
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: `${color}30`,
                  y: -3,
                  transition: { duration: 0.2 },
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-opacity group-hover:opacity-100"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="py-24" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80 mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Up and running in an hour.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Create your school', desc: 'Sign up in 2 minutes. Add your instructors, session types, and availability.' },
              { n: '02', title: 'Share your booking link', desc: 'Students book and pay online. Sessions fill automatically based on your schedule.' },
              { n: '03', title: 'Track & certify', desc: 'Monitor progress in real time. TCA certificates issue automatically when requirements are met.' },
            ].map(({ n, title, desc }) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative pl-8"
              >
                <span className="absolute left-0 top-0 text-5xl font-bold text-white/5">{n}</span>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80 mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              One price. Everything included.
            </h2>
            <p className="text-gray-500 text-sm">$99/month. Unlimited students. No per-seat fees.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-sm mx-auto rounded-2xl p-8 relative overflow-hidden"
            style={{ border: '1px solid rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.03)', boxShadow: '0 0 60px rgba(6,182,212,0.08)' }}
          >
            {/* Badge */}
            <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium text-cyan-300" style={{ background: 'rgba(6,182,212,0.12)' }}>
              Most popular
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">Starter</h3>
            <div className="flex items-end gap-1.5 mb-1">
              <span className="text-5xl font-bold text-white">$99</span>
              <span className="text-gray-500 text-sm mb-2">/month</span>
            </div>
            <p className="text-xs text-gray-600 mb-8">Pause or cancel anytime.</p>

            <div className="space-y-2.5 mb-8">
              {[
                'Unlimited students & instructors',
                'Online booking & Stripe payments',
                'Automated SMS + email reminders',
                'TCA progress tracking',
                'Certificate issuance',
                'Instructor availability management',
                'CSV student import',
                'Dedicated onboarding support',
              ].map(item => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="block w-full text-center text-sm font-semibold text-white py-3.5 rounded-xl transition-all"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 30px rgba(6,182,212,0.3)' }}
            >
              Start free trial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────── */}
      <section id="faq" className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/80 mb-3">FAQ</p>
            <h2 className="text-3xl font-bold tracking-tight mb-8">Questions. Answered.</h2>

            <div className="space-y-2">
              {FAQS.map(({ q, a }) => (
                <details
                  key={q}
                  className="group p-4 rounded-xl cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <summary className="flex items-center justify-between text-sm font-medium text-white list-none gap-4">
                    {q}
                    <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────────────── */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center rounded-2xl p-14 relative overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to run your school better?</h2>
              <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">Start your free trial today. No credit card required.</p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-3.5 rounded-xl"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 30px rgba(6,182,212,0.3)' }}
              >
                Start free trial →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}>DC</div>
            <span className="text-xs text-gray-700">© 2026 The Driving Center</span>
          </div>
          <div className="flex gap-5">
            <a href="/legal/privacy" className="text-xs text-gray-700 hover:text-gray-400 transition-colors">Privacy</a>
            <a href="/legal/terms" className="text-xs text-gray-700 hover:text-gray-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
