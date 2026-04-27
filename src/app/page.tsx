'use client'
import Link from 'next/link'
import './globals.css'

// ─── Dashboard Mockup (pure HTML/CSS) ────────────────────────────────
function DashboardMockup() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '64px',
      padding: '0 24px',
    }}>
      {/* Outer glow */}
      <div style={{
        filter: 'drop-shadow(0 0 80px rgba(0,102,255,0.18))',
        width: '100%',
        maxWidth: '860px',
      }}>
        {/* macOS Window */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 0 80px rgba(0,102,255,0.12), 0 32px 64px rgba(0,0,0,0.6)',
        }}>
          {/* Title bar */}
          <div style={{
            height: '48px',
            background: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '12px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Traffic lights */}
            {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => (
              <div key={i} style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: c, flexShrink: 0,
              }} />
            ))}
            {/* URL bar */}
            <div style={{
              flex: 1,
              maxWidth: '280px',
              margin: '0 auto',
              background: '#1E293B',
              borderRadius: '6px',
              padding: '5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#4ADE80', flexShrink: 0,
              }} />
              <span style={{
                fontSize: '11px', color: '#94A3B8',
                fontFamily: 'Inter, system-ui, sans-serif',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                app.thedrivingcenter.com
              </span>
            </div>
          </div>

          {/* Body: sidebar + main */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr',
            minHeight: '420px',
          }}>
            {/* Sidebar */}
            <div style={{
              background: '#0F172A',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              padding: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}>
              {[
                { label: 'Dashboard', active: true },
                { label: 'Students', active: false },
                { label: 'Sessions', active: false },
                { label: 'Billing', active: false },
                { label: 'Reports', active: false },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '9px 16px',
                  fontSize: '13px',
                  color: item.active ? '#ffffff' : '#64748B',
                  fontWeight: item.active ? '500' : '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: item.active ? 'rgba(0,102,255,0.12)' : 'transparent',
                  borderLeft: item.active ? '2px solid #0066FF' : '2px solid transparent',
                  cursor: 'default',
                }}>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div style={{
              background: '#050505',
              padding: '28px 28px 28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              {/* Greeting */}
              <div>
                <p style={{
                  fontSize: '18px', fontWeight: '600', color: '#fff',
                  marginBottom: '4px',
                }}>
                  Good morning, Mark
                </p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Monday, April 26, 2026
                </p>
              </div>

              {/* Stat cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}>
                {[
                  { label: 'STUDENTS', value: '24', change: '+3 this week' },
                  { label: 'HOURS LOGGED', value: '6.4h', change: '+1.2h today' },
                  { label: 'REVENUE', value: '$840', change: '+ $120' },
                ].map(card => (
                  <div key={card.label} style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTopColor: 'rgba(255,255,255,0.14)',
                    borderLeftColor: 'rgba(255,255,255,0.14)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                  }}>
                    <p style={{
                      fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em',
                      color: '#64748B', textTransform: 'uppercase', marginBottom: '6px',
                    }}>
                      {card.label}
                    </p>
                    <p style={{
                      fontSize: '28px', fontWeight: '700', color: '#fff',
                      lineHeight: '1', marginBottom: '6px',
                    }}>
                      {card.value}
                    </p>
                    <p style={{
                      fontSize: '11px', color: '#4ADE80', fontWeight: '500',
                    }}>
                      ▲ {card.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTopColor: 'rgba(255,255,255,0.14)',
                borderLeftColor: 'rgba(255,255,255,0.14)',
                borderRadius: '10px',
                padding: '14px 16px',
              }}>
                <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '12px', fontWeight: '500' }}>
                  Weekly Sessions
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
                  {[
                    { h: '40%' }, { h: '65%' }, { h: '45%' },
                    { h: '80%' }, { h: '55%' }, { h: '70%' }, { h: '90%' },
                  ].map((b, i) => (
                    <div key={i} style={{
                      flex: 1,
                      background: `linear-gradient(180deg, #0066FF 0%, rgba(0,102,255,0.3) 100%)`,
                      borderRadius: '4px 4px 0 0',
                      height: b.h,
                      minHeight: '8px',
                      opacity: 0.8 + (i * 0.03),
                    }} />
                  ))}
                </div>
              </div>

              {/* Line chart (SVG) */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTopColor: 'rgba(255,255,255,0.14)',
                borderLeftColor: 'rgba(255,255,255,0.14)',
                borderRadius: '10px',
                padding: '14px 16px',
              }}>
                <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '12px', fontWeight: '500' }}>
                  Revenue Trend
                </p>
                <svg viewBox="0 0 300 60" width="100%" height="60" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d="M0,50 L30,38 L70,42 L110,25 L150,30 L190,15 L230,20 L270,8 L300,5 L300,60 L0,60 Z"
                    fill="url(#lineGlow)"
                  />
                  {/* Line */}
                  <path
                    d="M0,50 L30,38 L70,42 L110,25 L150,30 L190,15 L230,20 L270,8 L300,5"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.6))' }}
                  />
                  {/* Dot at end */}
                  <circle cx="300" cy="5" r="3" fill="#4ADE80" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pricing Card ─────────────────────────────────────────────────────
function PricingCard({
  name, price, desc, features, highlighted, cta, ctaHref,
}: {
  name: string; price: string; desc: string;
  features: string[]; highlighted?: boolean; cta: string; ctaHref: string;
}) {
  return (
    <div style={{
      padding: '32px',
      borderRadius: '16px',
      border: highlighted ? '1.5px solid #0066FF' : '1px solid rgba(255,255,255,0.08)',
      background: highlighted ? '#0F172A' : '#0F172A',
      boxShadow: highlighted ? '0 0 60px rgba(0,102,255,0.15)' : 'none',
      position: 'relative',
    }}>
      {highlighted && (
        <div style={{
          position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
          padding: '5px 14px', borderRadius: '999px',
          background: '#0066FF',
          fontSize: '11px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
        }}>
          Most popular
        </div>
      )}
      <p style={{
        fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#94A3B8', marginBottom: '12px',
      }}>
        {name}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
        <span style={{
          fontSize: '48px', fontWeight: '800', color: '#fff',
          lineHeight: '1', letterSpacing: '-0.02em',
        }}>
          {price}
        </span>
        <span style={{ fontSize: '14px', color: '#94A3B8' }}>/mo</span>
      </div>
      <p style={{
        fontSize: '14px', color: '#94A3B8', marginBottom: '28px', lineHeight: '1.6',
      }}>
        {desc}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#94A3B8' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 8l3.5 3.5 6.5-7" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link href={ctaHref} className="btn-glow" style={{
        display: 'block', textAlign: 'center', fontSize: '15px',
      }}>
        {cta}
      </Link>
    </div>
  )
}

// ─── FAQ Item ──────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details style={{
      background: '#0F172A',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <summary style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px', cursor: 'pointer', listStyle: 'none',
        fontSize: '15px', fontWeight: '500', color: '#fff',
        userSelect: 'none',
      }}>
        <span>{q}</span>
        <svg className="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ flexShrink: 0, color: '#64748B', transition: 'transform 0.25s' }}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </summary>
      <div style={{ padding: '0 24px 20px' }}>
        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.7' }}>{a}</p>
      </div>
    </details>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main style={{ background: '#000', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(5,5,5,0.88)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#0066FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: '700',
              flexShrink: 0,
            }}>DC</div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>The Driving Center</span>
          </div>
          {/* Right nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/login" style={{ fontSize: '14px', color: '#94A3B8', textDecoration: 'none', fontWeight: '400' }}>
              Sign in
            </Link>
            <Link href="/signup" style={{
              padding: '10px 20px', borderRadius: '8px',
              background: '#0066FF', color: 'white',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none',
            }}>
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        paddingTop: '100px', paddingBottom: '40px',
        textAlign: 'center',
      }}>
        {/* Starfield */}
        <div className="starfield" style={{
          position: 'absolute', inset: 0,
          backgroundPosition: '0 0, 0 0, 0 0',
        }} />

        {/* Atmospheric glow */}
        <div style={{
          position: 'absolute',
          top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(126,212,253,0.08) 0%, rgba(112,123,255,0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', maxWidth: '1200px', margin: '0 auto',
          padding: '0 24px',
        }}>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '13px', color: '#94A3B8', marginBottom: '32px',
          }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#4ADE80',
              boxShadow: '0 0 8px #4ADE80',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            Live Demo — Try it free for 14 days
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 72px)',
            fontWeight: '800',
            lineHeight: '1.0',
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: '28px',
          }}>
            Run your driving school
            <br />
            <span className="gradient-text">without the chaos.</span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: '18px',
            color: '#94A3B8',
            lineHeight: '1.65',
            maxWidth: '620px',
            margin: '0 auto 48px',
            fontWeight: '400',
          }}>
            The all-in-one platform for managing students, scheduling sessions,
            tracking TCA compliance, and billing — built for driving schools in Tennessee.
          </p>

          {/* CTA */}
          <Link href="/signup" className="btn-glow" style={{ fontSize: '16px' }}>
            Book a Free 1-2-1 Call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {/* Trust line */}
          <p style={{ marginTop: '20px', fontSize: '13px', color: '#64748B' }}>
            No credit card required · 14-day free trial · Cancel anytime
          </p>

          {/* Dashboard */}
          <DashboardMockup />
        </div>
      </section>

      {/* ── LOGO BAR ────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0F172A',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '40px 24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '12px', color: '#64748B',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px',
            fontWeight: '600',
          }}>
            Trusted by driving schools across Tennessee
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '32px',
          }}>
            {['Knoxville', 'Nashville', 'Chattanooga', 'Memphis', 'Nolachuckey', 'Oneida', 'Cumberland'].map(city => (
              <span key={city} style={{
                fontSize: '14px', color: '#64748B', fontWeight: '500',
              }}>
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section style={{ padding: '120px 24px', background: '#000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px', fontWeight: '700', color: '#fff',
            textAlign: 'center', marginBottom: '80px', letterSpacing: '-0.02em',
          }}>
            How it works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '64px',
          }}>
            {[
              {
                num: '01',
                title: 'Create your school',
                desc: 'Sign up in 60 seconds. Add your school name, set your session types, and invite your instructors.',
              },
              {
                num: '02',
                title: 'Import your students',
                desc: 'Upload a CSV or add students one at a time. Import their history and TCA hours automatically.',
              },
              {
                num: '03',
                title: 'Start booking',
                desc: 'Share your link. Students book, parents pay online, and reminders go out automatically.',
              },
            ].map(({ num, title, desc }) => (
              <div key={num}>
                <div className="section-num" style={{ marginBottom: '20px' }}>{num}</div>
                <h3 style={{
                  fontSize: '24px', fontWeight: '600', color: '#fff',
                  marginBottom: '14px', letterSpacing: '-0.01em',
                }}>
                  {title}
                </h3>
                <p style={{
                  fontSize: '15px', color: '#94A3B8', lineHeight: '1.7',
                }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STATS ──────────────────────────── */}
      <section style={{
        padding: '80px 24px',
        background: '#0F172A',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          textAlign: 'center',
        }}>
          {[
            { value: '500+', label: 'students tracked', sub: 'across Tennessee' },
            { value: '$0', label: 'chasing checks', sub: 'parents pay online' },
            { value: '6hr + 60hr', label: 'TCA hours tracked', sub: 'auto-certificates issued' },
            { value: '100%', label: 'compliance', sub: 'automated TCA tracking' },
          ].map(({ value, label, sub }) => (
            <div key={label}>
              <p style={{
                fontSize: '48px', fontWeight: '800', color: '#fff',
                lineHeight: '1', marginBottom: '10px', letterSpacing: '-0.02em',
              }}>
                {value}
              </p>
              <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '4px', fontWeight: '500' }}>
                {label}
              </p>
              <p style={{ fontSize: '12px', color: '#64748B' }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section style={{ padding: '120px 24px', background: '#000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px', fontWeight: '700', color: '#fff',
            textAlign: 'center', marginBottom: '16px', letterSpacing: '-0.02em',
          }}>
            Simple, transparent pricing
          </h2>
          <p style={{
            fontSize: '17px', color: '#94A3B8', textAlign: 'center',
            marginBottom: '64px',
          }}>
            No setup fees. No per-seat charges. Cancel anytime.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px', alignItems: 'start',
          }}>
            <PricingCard
              name="Starter"
              price="$99"
              desc="For small schools getting started."
              features={['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking']}
              cta="Get started"
              ctaHref="/signup"
            />
            <PricingCard
              name="Growth"
              price="$199"
              desc="For growing schools that need more power."
              features={['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support']}
              highlighted
              cta="Start free trial"
              ctaHref="/signup"
            />
            <PricingCard
              name="Enterprise"
              price="$399"
              desc="For multi-location schools."
              features={['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager']}
              cta="Contact sales"
              ctaHref="/signup"
            />
          </div>
        </div>
      </section>

      {/* ── LEAD CAPTURE CTA ────────────────────────────── */}
      <section style={{
        padding: '120px 24px',
        background: '#0F172A',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px', fontWeight: '700', color: '#fff',
            marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.1',
          }}>
            Get started with The Driving Center
          </h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '40px', lineHeight: '1.6' }}>
            Join hundreds of driving schools across Tennessee already running better.
          </p>

          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Your name"
              style={{
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '15px', outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            />
            <input
              type="email"
              placeholder="Work email"
              style={{
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '15px', outline: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            />
            <button type="submit" className="btn-glow" style={{ fontSize: '15px', justifyContent: 'center' }}>
              Start free trial
            </button>
          </form>

          <p style={{ marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
            No credit card required · 14-day free trial
          </p>
        </div>
      </section>

      {/* ── BOOKING ──────────────────────────────────────── */}
      <section style={{ padding: '120px 24px', background: '#000', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px', fontWeight: '700', color: '#fff',
            marginBottom: '16px', letterSpacing: '-0.02em',
          }}>
            Prefer to talk first?
          </h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '40px' }}>
            Book a free 30-minute 1-on-1 with our team. We&apos;ll walk you through the platform.
          </p>
          <div style={{
            maxWidth: '640px', margin: '0 auto',
            background: '#0F172A',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '80px',
              background: '#1E293B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{ fontSize: '14px', color: '#94A3B8' }}>
                Cal.com booking embed — coming soon
              </p>
            </div>
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>
                In the meantime, reach us at{' '}
                <span style={{ color: '#0066FF' }}>hello@thedrivingcenter.com</span>
              </p>
              <Link href="/signup" className="btn-glow" style={{ fontSize: '14px' }}>
                Start free trial instead
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section style={{ padding: '120px 24px', background: '#0F172A' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '40px', fontWeight: '700', color: '#fff',
            textAlign: 'center', marginBottom: '48px', letterSpacing: '-0.02em',
          }}>
            Common questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { q: 'Do I need a credit card to start?', a: 'No. Start your 14-day free trial with no credit card required. Only pay when you\'re ready to subscribe.' },
              { q: 'Can I import my existing student list?', a: 'Yes. Upload a CSV with your student list and TCA history in minutes. No manual re-entry needed.' },
              { q: 'How does TCA compliance tracking work?', a: 'Track every student\'s 6-hour observation and 60-hour drive requirement. Certificates auto-generate when requirements are met.' },
              { q: 'Can parents pay online?', a: 'Yes. Stripe is built in. Parents pay when they book. Your school receives funds before the session.' },
              { q: 'What if I need to cancel?', a: 'Cancel anytime from your account settings. No questions, no penalties. We'll be sad but we\'ll let you go.' },
            ].map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#000',
        padding: '32px 24px',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '26px', height: '26px', borderRadius: '7px',
              background: '#0066FF', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700',
            }}>DC</div>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              © 2026 The Driving Center
            </span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/legal/privacy" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/legal/terms" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </footer>

      {/* FAQ accordion script */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', function() {
          document.querySelectorAll('details').forEach(function(details) {
            details.querySelector('summary').addEventListener('click', function(e) {
              var chevron = e.currentTarget.querySelector('.faq-chevron');
              if (!details.open && chevron) {
                chevron.style.transform = 'rotate(180deg)';
              } else if (details.open && chevron) {
                chevron.style.transform = '';
              }
            });
          });
        });
      `}} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        details[open] .faq-chevron {
          transform: rotate(180deg);
        }
        details summary::-webkit-details-marker {
          display: none;
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 3px; }
      `}}</style>
    </main>
  )
}
