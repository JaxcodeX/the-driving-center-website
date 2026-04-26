'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle, ArrowRight, Menu, X } from 'lucide-react'

const FEATURES = [
  {
    title: 'Automated SMS Reminders',
    description: 'Students get 48h and 4h reminders so they never miss a lesson. No-shows drop to zero.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    iconBg: 'bg-cyan-100',
    icon: '📱',
  },
  {
    title: 'Online Booking & Scheduling',
    description: 'Students book 24/7 from your custom page. Instructors set their own availability.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    icon: '📅',
  },
  {
    title: 'TCA Compliance Tracking',
    description: 'Classroom and driving hours tracked automatically. Certificates issue when requirements are met.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    icon: '🛡️',
  },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Import your students',
    description: 'Upload your existing list in one CSV. Name, email, phone — all in.',
  },
  {
    step: '2',
    title: 'Set your schedule',
    description: 'Instructors add their availability. Students pick a time that works for them.',
  },
  {
    step: '3',
    title: 'Get paid automatically',
    description: 'Students pay via Stripe when they book. Funds go straight to your bank.',
  },
]

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '99',
    description: 'Up to 3 instructors, 50 students',
    features: [
      'Unlimited bookings',
      'Automated SMS + email reminders',
      'TCA compliance tracking',
      'Certificate issuance',
      'CSV student import',
      'Stripe payments',
      'Email support',
    ],
    cta: 'Start free trial',
    highlight: false,
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
    highlight: true,
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
    highlight: false,
  },
]

const FAQS = [
  { q: 'What happens if a student is a no-show?', a: 'Students are reminded twice (48h and 4h) before their lesson. You can mark a session as no-show and optionally configure a no-show policy. The reminder system dramatically reduces no-shows.' },
  { q: 'Does this handle Tennessee TCA compliance?', a: 'Yes. The TCA (Traffic Safety Education) compliance module tracks classroom hours and behind-the-wheel hours. Certificates issue automatically when Tennessee state requirements are met.' },
  { q: 'Are SMS reminders included? What do they cost?', a: 'SMS reminders are included in all plans. Standard messaging rates from Twilio apply (about 1–2 cents per message). We pass through actual costs with no markup.' },
  { q: 'Is our student data secure?', a: 'Yes. All student data is encrypted at rest. We use row-level security in Supabase so each school only sees their own data. We are SOC 2 compliant.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Month-to-month, no contracts. Cancel from your dashboard in two clicks. No fees, no questions.' },
]

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ── NAV ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 border-b border-gray-100 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}>DC</div>
            <span className="text-sm font-semibold text-gray-900 tracking-tight">The Driving Center</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">FAQ</a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all shadow-sm"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}
            >
              Start free trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-500" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600 py-1" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm text-gray-600 py-1" onClick={() => setMobileOpen(false)}>How it works</a>
            <a href="#pricing" className="block text-sm text-gray-600 py-1" onClick={() => setMobileOpen(false)}>Pricing</a>
            <a href="#faq" className="block text-sm text-gray-600 py-1" onClick={() => setMobileOpen(false)}>FAQ</a>
            <Link href="/signup" className="block text-sm font-semibold text-white text-center py-2.5 rounded-xl mt-2" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }} onClick={() => setMobileOpen(false)}>
              Start free trial
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Subtle top gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Built for Tennessee driving schools
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-6" style={{ letterSpacing: '-0.025em' }}>
            Run your driving school<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(6,182,212,0.6)', WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg,#06b6d4,#2563eb)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
              without the chaos.
            </span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Online booking. Automated reminders. Student progress tracking. TCA compliance.
            One flat price — no per-seat fees.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-3.5 rounded-xl transition-all shadow-md"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}
            >
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 px-8 py-3.5 rounded-xl transition-all bg-gray-50 border border-gray-200 hover:bg-gray-100"
            >
              See how it works
            </a>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-1.5 text-sm text-gray-400">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>No credit card required</span>
            <span className="text-gray-200">·</span>
            <span>Setup in under an hour</span>
            <span className="text-gray-200">·</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600 mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Everything you need. Nothing you don&apos;t.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ title, description, bg, border, iconBg, icon, color }) => (
              <div
                key={title}
                className={`${bg} ${border} border rounded-2xl p-7`}
              >
                <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center text-2xl mb-5`}>
                  {icon}
                </div>
                <h3 className={`text-base font-semibold ${color} mb-2`}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          {/* Additional features row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {[
              { icon: '👨‍🏫', title: 'Instructor Management', desc: 'Invite instructors, let them set their own availability. You manage — not micromanage.', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', iconBg: 'bg-violet-100' },
              { icon: '📊', title: 'Progress Dashboard', desc: 'Real-time view of every student. Classroom hours, driving hours, and TCA status at a glance.', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100' },
              { icon: '💳', title: 'Stripe Payments', desc: 'Students pay when they book. Funds go directly to your bank account. We never hold money.', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', iconBg: 'bg-indigo-100' },
            ].map(({ icon, title, desc, color, bg, border, iconBg }) => (
              <div key={title} className={`${bg} ${border} border rounded-2xl p-7`}>
                <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center text-2xl mb-5`}>{icon}</div>
                <h3 className={`text-base font-semibold ${color} mb-2`}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600 mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Up and running in an hour.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector lines (desktop only) */}
            <div className="hidden md:block absolute top-10 left-1/3 w-[calc(33.333%-3rem)] h-px bg-gradient-to-r from-cyan-200 via-cyan-300 to-cyan-200" />
            <div className="hidden md:block absolute top-10 right-1/3 w-[calc(33.333%-3rem)] h-px bg-gradient-to-r from-cyan-200 via-cyan-300 to-cyan-200" style={{ right: 'auto', left: 'calc(66.666% + 1.5rem)' }} />

            {HOW_IT_WORKS.map(({ step, title, description }) => (
              <div key={step} className="text-center relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)', boxShadow: '0 4px 16px rgba(6,182,212,0.25)' }}
                >
                  {step}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────────── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">Trusted by driving schools across Tennessee</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {['Oneida', 'Knoxville', 'Crossville', 'Jamestown', 'Huntsville', 'Cookeville'].map(city => (
              <span key={city} className="text-sm font-semibold text-gray-500 tracking-wide">{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600 mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Simple, transparent pricing.
            </h2>
            <p className="text-gray-500 text-sm">No hidden fees. No per-seat charges. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PRICING_TIERS.map(({ name, price, description, features, cta, highlight }) => (
              <div
                key={name}
                className={`rounded-2xl p-8 ${highlight ? 'bg-gray-900 text-white shadow-xl' : 'bg-white border border-gray-200 shadow-sm'}`}
                style={highlight ? {} : {}}
              >
                {highlight && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 mb-5">
                    Most popular
                  </div>
                )}
                <h3 className={`text-lg font-semibold mb-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className={`text-5xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>${price}</span>
                  <span className={`text-sm mb-2 ${highlight ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
                </div>
                <p className={`text-sm mb-6 ${highlight ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>

                <div className={`space-y-2.5 mb-8 ${highlight ? 'border-t border-white/10 pt-6' : 'border-t border-gray-100 pt-6'}`}>
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${highlight ? 'text-cyan-400' : 'text-emerald-500'}`} />
                      <span className={highlight ? 'text-gray-300' : 'text-gray-600'}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={cta === 'Contact sales' ? '/signup' : '/signup'}
                  className={`block w-full text-center text-sm font-semibold py-3 rounded-xl transition-all ${
                    highlight
                      ? 'text-gray-900 bg-white hover:bg-gray-100'
                      : 'text-white'
                  }`}
                  style={!highlight ? { background: 'linear-gradient(135deg,#06b6d4,#2563eb)' } : {}}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────── */}
      <section id="faq" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600 mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Questions. Answered.</h2>

            <div className="space-y-2">
              {FAQS.map(({ q, a }, i) => (
                <div
                  key={q}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between text-left px-5 py-4 text-sm font-medium text-gray-900 gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {q}
                    <svg
                      className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                      {a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ─────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="rounded-3xl p-14 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}
          >
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Ready to run your school better?</h2>
              <p className="text-cyan-100 text-sm mb-8 max-w-sm mx-auto">Start your free trial today. No credit card required.</p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-xl text-cyan-700 bg-white hover:bg-cyan-50 transition-all shadow-lg"
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#06b6d4,#2563eb)' }}>DC</div>
            <span className="text-xs text-gray-400">© 2026 The Driving Center</span>
          </div>
          <div className="flex gap-5">
            <a href="/legal/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
            <a href="/legal/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
