'use client'
import Link from 'next/link'
import './globals.css'

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg)', fontFamily: 'var(--font)', color: 'var(--text)' }}>

      {/* ─── NAVBAR ─────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: '0 24px',
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '700',
            }}>DC</div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text)' }}>
              The Driving Center
            </span>
          </div>
          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/login" style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link href="/signup" style={{
              padding: '10px 20px', borderRadius: '8px',
              background: 'var(--accent)', color: 'white',
              fontSize: 'var(--text-sm)', fontWeight: '600', textDecoration: 'none',
            }}>
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        paddingTop: 'var(--space-40)', paddingBottom: 'var(--space-40)',
      }}>
        {/* Starfield */}
        <div className="starfield" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

        <div style={{
          position: 'relative', maxWidth: 'var(--max-w-page)', margin: '0 auto',
          padding: '0 24px', textAlign: 'center',
        }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '999px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--space-8)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)' }} />
            Built for Tennessee driving schools
          </div>

          {/* Headline — THE most important element */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '800',
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: 'var(--space-8)',
          }}>
            Run your driving school
            <br />
            <span className="gradient-text">without the chaos.</span>
          </h1>

          {/* Sub — quiet, not competing */}
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--muted)',
            lineHeight: '1.7',
            maxWidth: 'var(--max-w-text)',
            margin: '0 auto var(--space-12)',
          }}>
            The all-in-one platform for managing students, scheduling sessions,
            tracking TCA compliance, and billing — built for driving schools in Tennessee.
          </p>

          {/* ONE CTA only */}
          <Link href="/signup" className="btn-primary">
            Start free trial
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Trust line */}
          <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--subtle)' }}>
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ─── LOGO BAR ───────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <div style={{
          maxWidth: 'var(--max-w-page)', margin: '0 auto', padding: 'var(--space-12) 24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 'var(--text-xs)', color: 'var(--subtle)',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 'var(--space-6)',
          }}>
            Trusted by driving schools across Tennessee
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--space-8)',
          }}>
            {['Knoxville', 'Nashville', 'Chattanooga', 'Memphis', 'Nolachuckey', 'Oneida', 'Cumberland'].map(city => (
              <span key={city} style={{ fontSize: 'var(--text-sm)', color: 'var(--subtle)' }}>{city}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FEATURES ───────────────────────────────────── */}
      <section style={{ padding: 'var(--space-40) 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--text)',
            textAlign: 'center', marginBottom: 'var(--space-4)',
          }}>
            Everything you need. Nothing you don't.
          </h2>
          <p style={{
            fontSize: 'var(--text-base)', color: 'var(--muted)', textAlign: 'center',
            marginBottom: 'var(--space-20)',
          }}>
            One platform. No spreadsheets. No chasing payments.
          </p>

          {/* 6-card grid — NO colored icon backgrounds, NO accent colors on cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {[
              {
                title: 'Student Management',
                desc: 'Contact info, permit status, session history, and TCA progress. One place.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
              {
                title: 'Smart Scheduling',
                desc: 'Students pick times that work. Instructors see their schedule. No phone tag.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
              },
              {
                title: 'TCA Compliance',
                desc: 'Track every student\'s 6-hour observation and 60-hour drive requirement. Auto-certificates.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
              },
              {
                title: 'Automated Reminders',
                desc: 'Email and SMS reminders 48 hours and 4 hours before each session. Less no-shows.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                ),
              },
              {
                title: 'Stripe Billing',
                desc: 'Parents pay before the session. No chasing checks. Your school gets paid first.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                ),
              },
              {
                title: 'CSV Import',
                desc: 'Move your existing student list in minutes. One upload. Zero re-entry.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                ),
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="card" style={{ padding: 'var(--space-8)' }}>
                {/* Icon — simple monochrome, no background circle */}
                <div style={{ color: 'var(--muted)', marginBottom: 'var(--space-6)' }}>{icon}</div>
                <h3 style={{
                  fontSize: 'var(--text-base)', fontWeight: '600', color: 'var(--text)',
                  marginBottom: 'var(--space-3)',
                }}>{title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: '1.65' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────── */}
      <section style={{ padding: 'var(--space-40) 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--text)',
            textAlign: 'center', marginBottom: 'var(--space-20)',
          }}>
            Up and running in minutes
          </h2>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-12)',
          }}>
            {[
              { num: '01', title: 'Create your school', desc: 'Sign up in 60 seconds. Add your school name and set your session types.' },
              { num: '02', title: 'Import your students', desc: 'Upload a CSV or add students one at a time. Import their history and TCA hours.' },
              { num: '03', title: 'Start booking', desc: 'Share your link. Students book, pay, and get reminded automatically.' },
            ].map(({ num, title, desc }) => (
              <div key={num}>
                <div style={{ fontSize: '72px', fontWeight: '800', lineHeight: '1', color: 'var(--border)', marginBottom: 'var(--space-6)' }}>
                  {num}
                </div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: 'var(--text)', marginBottom: 'var(--space-3)' }}>
                  {title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: '1.65' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-40) 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--text)',
            textAlign: 'center', marginBottom: 'var(--space-4)',
          }}>
            Simple, transparent pricing
          </h2>
          <p style={{
            fontSize: 'var(--text-base)', color: 'var(--muted)', textAlign: 'center',
            marginBottom: 'var(--space-20)',
          }}>
            No setup fees. No per-seat charges. Cancel anytime.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-6)', alignItems: 'start',
          }}>
            {/* Starter */}
            <div className="card" style={{ padding: 'var(--space-8)' }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)' }}>Starter</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: 'var(--text-5xl)', fontWeight: '800', color: 'var(--text)', lineHeight: '1' }}>$99</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginBottom: 'var(--space-8)', lineHeight: '1.6' }}>For small schools getting started.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3 3 7-7" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" style={{
                display: 'block', textAlign: 'center', padding: 'var(--space-3) var(--space-6)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--muted)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>Get started</Link>
            </div>

            {/* Growth — highlighted */}
            <div style={{
              padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--accent)',
              boxShadow: '0 0 60px var(--accent-glow)',
              background: 'var(--surface)', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                padding: '4px 12px', borderRadius: '999px', background: 'var(--accent)',
                fontSize: 'var(--text-xs)', fontWeight: '600', color: 'white', whiteSpace: 'nowrap',
              }}>Most popular</div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)' }}>Growth</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: 'var(--text-5xl)', fontWeight: '800', color: 'var(--text)', lineHeight: '1' }}>$199</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginBottom: 'var(--space-8)', lineHeight: '1.6' }}>For growing schools that need more power.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3 3 7-7" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-primary" style={{
                display: 'block', textAlign: 'center', textDecoration: 'none',
              }}>Start free trial</Link>
            </div>

            {/* Enterprise */}
            <div className="card" style={{ padding: 'var(--space-8)' }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 'var(--space-3)' }}>Enterprise</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: 'var(--space-4)' }}>
                <span style={{ fontSize: 'var(--text-5xl)', fontWeight: '800', color: 'var(--text)', lineHeight: '1' }}>$399</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginBottom: 'var(--space-8)', lineHeight: '1.6' }}>For multi-location schools.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3 3 7-7" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" style={{
                display: 'block', textAlign: 'center', padding: 'var(--space-3) var(--space-6)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--muted)',
                textDecoration: 'none',
              }}>Contact sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────── */}
      <section style={{ padding: 'var(--space-40) 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--text)',
            textAlign: 'center', marginBottom: 'var(--space-12)',
          }}>
            Common questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { q: 'Do I need a credit card to start?', a: 'No. Start your 14-day free trial with no credit card required. Only pay when you\'re ready.' },
              { q: 'Can I import my existing student list?', a: 'Yes. Upload a CSV with your student list and history in minutes. No manual re-entry.' },
              { q: 'How does TCA compliance work?', a: 'Track every student\'s 6-hour observation and 60-hour drive requirement. Certificates auto-generate when requirements are met.' },
              { q: 'Can parents pay online?', a: 'Yes. Stripe is built in. Parents pay when they book. Your school gets paid before the session.' },
              { q: 'What if I need to cancel?', a: 'Cancel anytime from your account settings. No questions asked.' },
            ].map(({ q, a }) => (
              <details key={q} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <summary style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-6)', cursor: 'pointer', listStyle: 'none',
                  fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--text)',
                }}>
                  <span>{q}</span>
                  <svg className="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--subtle)', transition: 'transform 0.2s' }}>
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div style={{ padding: '0 var(--space-6) var(--space-6)' }}>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: '1.7' }}>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─────────────────────────────────── */}
      <section style={{ padding: 'var(--space-40) 24px', background: 'var(--bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: 'var(--max-w-page)', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: 'var(--text)',
            lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: 'var(--space-6)',
          }}>
            Ready to run your school better?
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--muted)', marginBottom: 'var(--space-12)' }}>
            Start your free trial today. No credit card required.
          </p>
          <Link href="/signup" className="btn-primary">
            Start free trial
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)', background: 'var(--surface)',
        padding: 'var(--space-8) 24px',
      }}>
        <div style={{
          maxWidth: 'var(--max-w-page)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '6px',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700',
            }}>DC</div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--subtle)' }}>© 2026 The Driving Center</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            <Link href="/legal/privacy" style={{ fontSize: 'var(--text-xs)', color: 'var(--subtle)', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/legal/terms" style={{ fontSize: 'var(--text-xs)', color: 'var(--subtle)', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </footer>

      {/* FAQ accordion rotate script */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', function() {
          document.querySelectorAll('details').forEach(function(details) {
            details.querySelector('summary').addEventListener('click', function(e) {
              var chevron = e.currentTarget.querySelector('.faq-chevron');
              if (details.open && chevron) {
                chevron.style.transform = '';
              } else if (chevron) {
                chevron.style.transform = 'rotate(180deg)';
              }
            });
          });
        });
      `}} />
    </main>
  )
}
