import Link from 'next/link'
import { CheckCircle, Calendar, Users, Clock, Shield, Bell } from 'lucide-react'

const FEATURES = [
  {
    icon: Calendar,
    title: 'Online Booking',
    description: 'Students book and pay online 24/7. No more phone tag.',
  },
  {
    icon: Users,
    title: 'Student Tracking',
    description: 'Track classroom hours, driving hours, and TCA progress automatically.',
  },
  {
    icon: Shield,
    title: 'TCA Compliance',
    description: 'Certificate issuance when Tennessee requirements are met.',
  },
  {
    icon: Bell,
    title: 'Automated Reminders',
    description: '48h and 4h SMS + email reminders — students never miss a lesson.',
  },
  {
    icon: Clock,
    title: 'Instructor Availability',
    description: 'Instructors set their own schedule. You manage, not micromanage.',
  },
]

const BENEFITS = [
  'No contracts — cancel anytime',
  'Set up in under an hour',
  'Dedicated onboarding support',
  'Works on phone, tablet, and desktop',
  'Built for Tennessee DMV requirements',
]

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#050507' }}>
      {/* ── Navigation ─────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(5,5,7,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}>
              DC
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">The Driving Center</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-all"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
            >
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.05]" style={{ left: '5%' }} />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-white/[0.05]" style={{ right: '5%' }} />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div>
              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-cyan-400 font-medium">Built for Tennessee driving schools</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-figtree)' }}>
                The platform that runs your driving school.{' '}
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(6,182,212,0.6)', WebkitTextFillColor: 'transparent' }}>
                  Automatically.
                </span>
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
                Online booking. Automated reminders. Student progress tracking. TCA compliance.
                One flat monthly price — no per-seat fees.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl transition-all"
                  style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 30px rgba(6,182,212,0.35)' }}
                >
                  Start free trial
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center text-sm font-medium text-gray-300 px-6 py-3 rounded-xl transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  See how it works
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {BENEFITS.map(b => (
                  <div key={b} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-500/70 flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: App mockup card */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(6,182,212,0.1)' }}>
                {/* Card header */}
                <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Upcoming Sessions</span>
                  </div>
                  <span className="text-xs text-gray-600">This week</span>
                </div>

                {/* Session rows */}
                {[
                  { time: 'Mon 9:00 AM', type: 'Traffic School', seats: '3/8', color: '#ef4444' },
                  { time: 'Tue 2:00 PM', type: 'Private Lesson', seats: '1/1', color: '#06b6d4' },
                  { time: 'Wed 9:00 AM', type: 'Traffic School', seats: '5/8', color: '#ef4444' },
                ].map((s, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <div>
                        <div className="text-sm text-white font-medium">{s.type}</div>
                        <div className="text-xs text-gray-500">{s.time}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{s.seats} seats</div>
                  </div>
                ))}

                {/* Stats row */}
                <div className="px-5 py-4 grid grid-cols-3 gap-3" style={{ background: 'rgba(6,182,212,0.04)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {[['14', 'Active Students'], ['3', 'Sessions This Week'], ['2', 'Instructors']].map(([val, label]) => (
                    <div key={label} className="text-center">
                      <div className="text-xl font-bold text-white">{val}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-medium text-white" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 4px 16px rgba(6,182,212,0.4)' }}>
                Live demo →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logos strip ─────────────────────────────────────── */}
      <div className="border-y border-white/[0.05] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-10 flex-wrap">
          <span className="text-xs text-gray-600 uppercase tracking-widest">Trusted by schools across Tennessee</span>
        </div>
      </div>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Features</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Everything you need.{' '}
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', WebkitTextFillColor: 'transparent' }}>
                Nothing you don&apos;t.
              </span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Built for the realities of running a driving school — not for enterprise features you&apos;ll never use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-2xl transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your school', desc: 'Sign up in 2 minutes. Add your instructors, session types, and availability.' },
              { step: '02', title: 'Share your booking link', desc: 'Students book and pay online. Sessions fill automatically based on your schedule.' },
              { step: '03', title: 'Track & certify', desc: 'Monitor progress in real time. TCA certificates issue automatically when requirements are met.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-5xl font-bold text-white/5 mb-4">{step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Pricing</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              One price.{' '}
              <span style={{ color: 'rgba(255,255,255,0.4)', WebkitTextStroke: '1px rgba(255,255,255,0.3)', WebkitTextFillColor: 'transparent' }}>
                Everything included.
              </span>
            </h2>
            <p className="text-gray-400">$99/month. Unlimited students. No per-seat fees.</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="rounded-2xl p-8 relative overflow-hidden" style={{ border: '1px solid rgba(6,182,212,0.35)', background: 'rgba(6,182,212,0.04)', boxShadow: '0 0 40px rgba(6,182,212,0.1)' }}>
              {/* Badge */}
              <div className="absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium text-cyan-300" style={{ background: 'rgba(6,182,212,0.15)' }}>
                Most popular
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-1">Starter</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$99</span>
                  <span className="text-gray-500 text-sm mb-1">/month</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Pause or cancel anytime.</p>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-8">
                {[
                  'Unlimited students & instructors',
                  'Online booking & payments',
                  'Automated SMS + email reminders',
                  'TCA progress tracking',
                  'Certificate issuance',
                  'Instructor availability management',
                  'CSV student import',
                  'Dedicated support',
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
                style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="py-24" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-block text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Questions.{' '}
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', WebkitTextFillColor: 'transparent' }}>
                Answered.
              </span>
            </h2>

            <div className="space-y-3">
              {[
                { q: 'Do I need to sign a contract?', a: 'No. Month-to-month, cancel anytime.' },
                { q: 'How long does it take to set up?', a: 'Most schools are running in under an hour. Add your instructors, set your schedule, and share the booking link.' },
                { q: 'Is this built for Tennessee?', a: 'Yes. TCA certificate issuance is built around Tennessee DMV requirements.' },
                { q: 'What about payments?', a: 'Students pay online via Stripe. Funds go directly to your account — we never hold money.' },
                { q: 'Can instructors manage their own availability?', a: 'Yes. Each instructor gets their own login to set their weekly schedule.' },
              ].map(({ q, a }) => (
                <details key={q} className="group p-4 rounded-xl cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                    {q}
                    <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl p-12 text-center relative overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <h2 className="text-3xl font-bold text-white mb-3">Ready to run your school better?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Start your free trial today. No credit card required.</p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center text-sm font-semibold text-white px-8 py-3.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 0 30px rgba(6,182,212,0.35)' }}
            >
              Start free trial →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}>DC</div>
            <span className="text-xs text-gray-600">© 2026 The Driving Center</span>
          </div>
          <div className="flex gap-6">
            <a href="/legal/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy</a>
            <a href="/legal/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
