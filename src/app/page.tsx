'use client'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

function Section({ children, className = '', dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <section className={`${className}`} style={{ background: dark ? '#0a0a0a' : '#050505' }}>
      <div className="max-w-5xl mx-auto px-6">{children}</div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: '#050505', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(5,5,5,0.9)', borderColor: '#1a1a1a', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: '#0066FF' }}>DC</div>
            <span className="text-white font-semibold text-sm">The Driving Center</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-[#888888] hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ background: '#0066FF' }}>
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: '#050505', paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="absolute inset-0 starfield opacity-60" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8" style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#888888' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
            Built for Tennessee driving schools
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Run your driving school
            <br />
            <span className="gradient-text">without the chaos.</span>
          </h1>
          <p className="text-lg text-[#888888] max-w-xl mx-auto mb-12 leading-relaxed">
            The all-in-one platform for managing students, scheduling sessions, tracking TCA compliance, and billing — designed for driving schools in Tennessee.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all" style={{ background: '#0066FF', boxShadow: '0 0 40px rgba(0,102,255,0.3)' }}>
              Start free trial
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/school/nolachuckey" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium text-[#888888] border transition-all" style={{ borderColor: '#1a1a1a' }}>
              See a live demo
            </Link>
          </div>
          <p className="mt-8 text-xs text-[#666666]">No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      {/* ── LOGO BAR ── */}
      <div className="border-y" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-xs text-center text-[#666666] uppercase tracking-widest mb-8">Trusted by driving schools across Tennessee</p>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {['Knoxville', 'Nashville', 'Chattanooga', 'Memphis', 'Nolachuckey', 'Oneida', 'Cumberland', 'Oak Ridge'].map(city => (
              <span key={city} className="text-sm text-[#444444]">{city}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <Section dark>
        <div style={{ paddingTop: '100px', paddingBottom: '60px' }}>
          <h2 className="text-3xl font-bold text-white text-center mb-4">Everything you need. Nothing you don't.</h2>
          <p style={{ color: '#666666' }} className="text-center text-base mb-16">Replace spreadsheets, paper forms, and billing chaos with one platform.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Student Management',
                desc: 'Keep every student\'s contact info, permit status, session history, and TCA progress in one place. No more spreadsheets.',
                color: '#0066FF',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
              {
                title: 'Smart Scheduling',
                desc: 'Book sessions, assign instructors, and manage availability without the phone tag. Students pick times that work.',
                color: '#8B5CF6',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
              },
              {
                title: 'TCA Compliance',
                desc: 'Track every student\'s 6-hour observation and 60-hour behind-the-wheel requirement. Certificates auto-generate when complete.',
                color: '#22C55E',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
              },
              {
                title: 'Automated Reminders',
                desc: 'Students get email and SMS reminders 48 hours and 4 hours before each session. Less no-shows, less stress.',
                color: '#F59E0B',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                ),
              },
              {
                title: 'Stripe Billing',
                desc: 'Parents pay online before the session. No chasing checks. Your school gets paid before you hit the road.',
                color: '#6366F1',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                ),
              },
              {
                title: 'CSV Import',
                desc: 'Move your existing student list into the platform in minutes. One CSV file, zero data entry.',
                color: '#EC4899',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                ),
              },
            ].map(({ title, desc, color, icon }) => (
              <div key={title} className="p-6 rounded-2xl border" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                  <div style={{ color }}>{icon}</div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ── */}
      <Section>
        <div style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <h2 className="text-3xl font-bold text-white text-center mb-12">Up and running in minutes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Create your school', desc: 'Sign up in 60 seconds. Add your school name, logo, and set your session types and pricing.' },
              { num: '02', title: 'Import your students', desc: 'Upload a CSV or add students one by one. Import their session history and TCA hours.' },
              { num: '03', title: 'Start booking', desc: 'Share your booking link with students. They pick a time, pay online, and get a reminder automatically.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <div className="text-6xl font-bold text-[#1a1a1a] mb-4">{num}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── PRICING ── */}
      <Section dark>
        <div style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <h2 className="text-3xl font-bold text-white text-center mb-4">Simple, transparent pricing</h2>
          <p className="text-center text-base mb-12" style={{ color: '#666666' }}>No setup fees. No per-seat charges. Cancel anytime.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-8 rounded-2xl border" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
              <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wider mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-[#666666]">/month</span>
              </div>
              <p className="text-sm mb-6" style={{ color: '#666666' }}>For small driving schools just getting started.</p>
              <ul className="space-y-3 mb-8">
                {['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking', 'CSV import'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: '#888888' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center py-3 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: '#1a1a1a', color: '#888888' }}>
                Get started
              </Link>
            </div>
            {/* Growth - highlighted */}
            <div className="p-8 rounded-2xl border-2 relative" style={{ background: '#0a0a0a', borderColor: '#0066FF', boxShadow: '0 0 60px rgba(0,102,255,0.12)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#0066FF', color: 'white' }}>Most popular</div>
              <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wider mb-2">Growth</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$199</span>
                <span className="text-[#666666]">/month</span>
              </div>
              <p className="text-sm mb-6" style={{ color: '#666666' }}>For growing schools that need more power and flexibility.</p>
              <ul className="space-y-3 mb-8">
                {['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support', 'Custom branding'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: '#888888' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: '#0066FF' }}>
                Start free trial
              </Link>
            </div>
            {/* Enterprise */}
            <div className="p-8 rounded-2xl border" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
              <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wider mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$399</span>
                <span className="text-[#666666]">/month</span>
              </div>
              <p className="text-sm mb-6" style={{ color: '#666666' }}>For multi-location schools with advanced needs.</p>
              <ul className="space-y-3 mb-8">
                {['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager', 'Custom integrations'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: '#888888' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full text-center py-3 rounded-xl text-sm font-medium border transition-all" style={{ borderColor: '#1a1a1a', color: '#888888' }}>
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section>
        <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <h2 className="text-3xl font-bold text-white text-center mb-10">Common questions</h2>
          <div className="max-w-2xl mx-auto space-y-2">
            {[
              { q: 'Do I need a credit card to start?', a: 'No. Start your 14-day free trial with no credit card required. Only pay when you\'re ready.' },
              { q: 'Can I import my existing student list?', a: 'Yes. Upload a CSV with your student list and history in minutes. No manual re-entry required.' },
              { q: 'How does TCA compliance work?', a: 'The system tracks every student\'s 6-hour observation and 60-hour behind-the-wheel requirement. Certificates auto-generate when requirements are met.' },
              { q: 'Can parents pay online?', a: 'Yes. Stripe is built in. Parents pay when they book. Your school gets paid before the session happens.' },
              { q: 'What if I need to cancel?', a: 'Cancel anytime from your account settings. No questions asked, no penalties.' },
            ].map(({ q, a }) => (
              <details key={q} className="group rounded-xl border" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium text-white">{q}</span>
                  <svg className="group-open:rotate-180 transition-transform" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FOOTER CTA ── */}
      <Section dark>
        <div className="text-center" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to run your school better?</h2>
          <p className="text-base mb-10" style={{ color: '#666666' }}>Start your free trial today. No credit card required.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all" style={{ background: '#0066FF', boxShadow: '0 0 40px rgba(0,102,255,0.3)' }}>
            Start free trial
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="border-t" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#0066FF' }}>DC</div>
            <span className="text-sm text-[#444444]">© 2026 The Driving Center</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy" className="text-xs text-[#444444] hover:text-[#888888]">Privacy</Link>
            <Link href="/legal/terms" className="text-xs text-[#444444] hover:text-[#888888]">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}