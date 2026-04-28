'use client'
import Link from 'next/link'

// ─── Clean Navbar ───────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: '56px', background: '#fff',
      borderBottom: '1px solid #E5E5E3',
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '0 24px',
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '7px',
            background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '12px', fontWeight: '700', flexShrink: 0,
          }}>DC</div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A0A0A' }}>The Driving Center</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="#features" style={{ fontSize: '14px', color: '#555', textDecoration: 'none', fontWeight: '500' }}>Features</Link>
          <Link href="#pricing" style={{ fontSize: '14px', color: '#555', textDecoration: 'none', fontWeight: '500' }}>Pricing</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/login" style={{ fontSize: '14px', color: '#555', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
          <Link href="/signup" style={{
            background: '#0A0A0A', color: '#fff',
            padding: '8px 18px', borderRadius: '8px',
            fontSize: '14px', fontWeight: '600', textDecoration: 'none',
          }}>Get started</Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Pricing Card ───────────────────────────────────────────────────
function PricingCard({ name, price, desc, features, highlighted, cta }: {
  name: string; price: string; desc: string;
  features: string[]; highlighted?: boolean; cta: string;
}) {
  return (
    <div style={{
      background: '#fff',
      border: highlighted ? '1.5px solid #0A0A0A' : '1px solid #E5E5E3',
      borderRadius: '12px', padding: '32px',
      display: 'flex', flexDirection: 'column', gap: '0',
    }}>
      <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '12px' }}>
        {name}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
        <span style={{ fontSize: '44px', fontWeight: '800', color: '#0A0A0A', lineHeight: '1', letterSpacing: '-0.02em' }}>{price}</span>
        <span style={{ fontSize: '14px', color: '#9B9B9B' }}>/mo</span>
      </div>
      <p style={{ fontSize: '14px', color: '#555', marginBottom: '24px', lineHeight: '1.5' }}>{desc}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#555' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M3 8l3.5 3.5 6.5-7" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/signup" style={{
        display: 'flex', justifyContent: 'center',
        padding: '12px 24px', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', textDecoration: 'none',
        background: highlighted ? '#0A0A0A' : 'transparent',
        color: highlighted ? '#fff' : '#0A0A0A',
        border: highlighted ? 'none' : '1px solid #E5E5E3',
      }}>
        {cta}
      </Link>
    </div>
  )
}

// ─── FAQ Item ───────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details style={{ borderBottom: '1px solid #E5E5E3', padding: '20px 0', cursor: 'pointer' }}>
      <summary style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A' }}>{question}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#9B9B9B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'transform 0.2s' }} className="faq-chevron">
          <path d="M4 6l4 4 4-4"/>
        </svg>
      </summary>
      <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginTop: '12px' }}>{answer}</p>
      <style>{`details[open] .faq-chevron { transform: rotate(180deg); }`}</style>
    </details>
  )
}

// ─── Data ───────────────────────────────────────────────────────────
const FEATURES = [
  {
    num: '01',
    title: 'Students book online, instructors stay in sync',
    desc: 'No more phone tag. Students pick a time that works, pay upfront, and get a confirmation. Instructors see their schedule in one place — no more double bookings.',
  },
  {
    num: '02',
    title: 'TCA tracking that actually works',
    desc: 'Every session automatically counts toward Tennessee Certificate of Completion requirements. When a student completes their hours, the certificate generates automatically.',
  },
  {
    num: '03',
    title: 'Stripe handles the money',
    desc: 'Accept payments online. No chasing checks. No cash in envelopes. Students pay when they book. You get paid directly to your bank.',
  },
  {
    num: '04',
    title: 'Instructor management',
    desc: 'Invite your instructors, set their availability, assign students to them. Each instructor sees only their own schedule and students.',
  },
  {
    num: '05',
    title: 'SMS and email reminders',
    desc: 'Automatic reminders go out 48 hours and 4 hours before each session. Fewer no-shows. Less time rescheduling on the phone.',
  },
  {
    num: '06',
    title: 'Multi-tenant from the ground up',
    desc: 'Your data is completely isolated. Row-Level Security enforced at the database level — not just a soft filter. Each school only sees their own students.',
  },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Create your school profile', desc: 'Set your school name, add your instructors, and configure your session types and pricing.' },
  { step: '2', title: 'Students sign up and book', desc: 'Share your school link. Students create an account, pick a session type, choose a time, and pay online.' },
  { step: '3', title: 'Instructors teach, the platform handles the rest', desc: 'Instructors log in to see their schedule. Sessions are tracked. Reminders go out. Certificates generate.' },
]

const PRICING_TIERS = [
  { name: 'Starter', price: '$99', desc: 'For small schools getting started.', features: ['Up to 25 students', 'Unlimited sessions', 'Email + SMS reminders', 'Stripe payments', 'TCA tracking'], highlighted: false, cta: 'Start free trial' },
  { name: 'Growth', price: '$199', desc: 'For schools ready to scale.', features: ['Up to 100 students', 'Everything in Starter', 'Instructor management', 'Parent portal', 'Priority support'], highlighted: true, cta: 'Start free trial' },
  { name: 'Enterprise', price: '$399', desc: 'For multi-location schools.', features: ['Unlimited students', 'Everything in Growth', 'Multi-location support', 'API access', 'Dedicated success manager'], highlighted: false, cta: 'Contact sales' },
]

const FAQ_ITEMS = [
  { question: 'Do I need a credit card to start?', answer: 'No. Start with a 14-day free trial — no payment info required. At the end of the trial, you choose a plan or your account pauses.' },
  { question: 'Is my school data isolated from other schools?', answer: 'Yes. Multi-tenant Row-Level Security (RLS) is enforced at the database level. Your students never see another school\'s data — ever.' },
  { question: 'How does TCA tracking work?', answer: 'Every session you log counts toward Tennessee Certificate of Completion (TCC) requirements. When a student completes their required hours, the certificate generates automatically.' },
  { question: 'What happens after the free trial?', answer: 'You choose a plan: Starter ($99/mo), Growth ($199/mo), or Enterprise ($399/mo). All plans include a 14-day free trial.' },
  { question: 'Can I invite my existing instructor team?', answer: 'Yes. Invite unlimited instructors to your school. Set their availability, assign students, and track their session logs from the instructor dashboard.' },
]

// ─── Main Page ──────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main style={{ background: '#fff', color: '#0A0A0A', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 72px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            {/* Left */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#9B9B9B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
                Scheduling and payment software
              </p>
              <h1 style={{
                fontSize: '52px', fontWeight: '800', lineHeight: '1.05',
                letterSpacing: '-0.025em', color: '#0A0A0A', marginBottom: '20px',
              }}>
                The easier way<br />to run your<br />driving school.
              </h1>
              <p style={{
                fontSize: '18px', color: '#555', lineHeight: '1.6',
                maxWidth: '440px', marginBottom: '36px',
              }}>
                Automate bookings, track student progress, get paid online. Built for driving schools in Tennessee.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/signup" style={{
                  background: '#0A0A0A', color: '#fff',
                  padding: '13px 24px', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600', textDecoration: 'none',
                }}>
                  Start free trial
                </Link>
                <Link href="#features" style={{
                  border: '1px solid #E5E5E3', color: '#0A0A0A',
                  padding: '13px 24px', borderRadius: '8px',
                  fontSize: '15px', fontWeight: '600', textDecoration: 'none',
                }}>
                  See how it works
                </Link>
              </div>
              <p style={{ fontSize: '13px', color: '#9B9B9B', marginTop: '16px' }}>No credit card required · 14-day free trial</p>
            </div>
            {/* Right — real UI screenshot, not fake browser chrome */}
            <div style={{ background: '#F5F5F3', borderRadius: '12px', border: '1px solid #E5E5E3', overflow: 'hidden' }}>
              <img
                src="/demo-booking.png"
                alt="Student booking flow — select session type, pick a date, pay online"
                style={{ width: '100%', display: 'block' }}
                onError={(e) => {
                  // Fallback to text placeholder if image doesn't exist
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.style.cssText += 'display:flex;align-items:center;justify-content:center;min-height:320px;'
                    parent.innerHTML = `
                      <div style="text-align:center;padding:48px 32px;">
                        <p style="font-size:14px;font-weight:600;color:#0A0A0A;margin-bottom:8px;">Student Booking Flow</p>
                        <p style="font-size:13px;color:#9B9B9B;line-height:1.6;">Session type → Date picker → Payment → Confirmation</p>
                        <div style="margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:left;">
                          <div style="background:#fff;border:1px solid #E5E5E3;border-radius:8px;padding:16px;">
                            <p style="font-size:11px;font-weight:700;color:#9B9B9B;margin-bottom:4px;">SESSION TYPE</p>
                            <p style="font-size:14px;font-weight:600;color:#0A0A0A;">1-Hour Lesson · $60</p>
                          </div>
                          <div style="background:#fff;border:1px solid #E5E5E3;border-radius:8px;padding:16px;">
                            <p style="font-size:11px;font-weight:700;color:#9B9B9B;margin-bottom:4px;">NEXT AVAILABLE</p>
                            <p style="font-size:14px;font-weight:600;color:#0A0A0A;">Thu, May 7 · 3pm</p>
                          </div>
                          <div style="background:#fff;border:1px solid #E5E5E3;border-radius:8px;padding:16px;">
                            <p style="font-size:11px;font-weight:700;color:#9B9B9B;margin-bottom:4px;">STUDENT</p>
                            <p style="font-size:14px;font-weight:600;color:#0A0A0A;">Jake Thompson</p>
                          </div>
                          <div style="background:#fff;border:1px solid #E5E5E3;border-radius:8px;padding:16px;">
                            <p style="font-size:11px;font-weight:700;color:#9B9B9B;margin-bottom:4px;">STATUS</p>
                            <p style="font-size:14px;font-weight:600;color:#16A34A;">Confirmed ✓</p>
                          </div>
                        </div>
                      </div>
                    `
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #E5E5E3', borderBottom: '1px solid #E5E5E3', background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '20px' }}>
            Built for Tennessee driving schools
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '32px', alignItems: 'center' }}>
            {['Knoxville', 'Nashville', 'Chattanooga', 'Oneida', 'Cumberland'].map((city) => (
              <span key={city} style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section id="features" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '14px' }}>Platform</p>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
              What you get
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 32px' }}>
            {FEATURES.map(f => (
              <div key={f.num}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#9B9B9B', letterSpacing: '0.08em', marginBottom: '10px' }}>{f.num}</p>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0A0A0A', marginBottom: '10px', lineHeight: '1.3', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.65' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#FAFAF8', borderTop: '1px solid #E5E5E3' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '14px' }}>Setup</p>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
              Up and running in an afternoon
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', border: '1px solid #E5E5E3', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{
                padding: '32px',
                borderRight: i < 2 ? '1px solid #E5E5E3' : 'none',
              }}>
                <p style={{ fontSize: '36px', fontWeight: '800', color: '#E5E5E3', lineHeight: '1', marginBottom: '16px', letterSpacing: '-0.02em' }}>{step.step}</p>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A', marginBottom: '10px', lineHeight: '1.3' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '14px' }}>Pricing</p>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '12px' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '16px', color: '#555' }}>No setup fees. No per-seat surprises. Cancel anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {PRICING_TIERS.map(t => (
              <PricingCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px 24px', background: '#FAFAF8', borderTop: '1px solid #E5E5E3' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B9B', marginBottom: '14px' }}>FAQ</p>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.02em', lineHeight: '1.15' }}>
              Common questions
            </h2>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E5E5E3', borderRadius: '12px', padding: '8px 28px' }}>
            {FAQ_ITEMS.map(item => (
              <FaqItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK CTA SECTION ─────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#0A0A0A' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '16px' }}>
            Ready to set up your school?
          </h2>
          <p style={{ fontSize: '17px', color: '#9B9B9B', marginBottom: '40px' }}>
            14-day free trial. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              background: '#fff', color: '#0A0A0A',
              padding: '13px 28px', borderRadius: '8px',
              fontSize: '15px', fontWeight: '600', textDecoration: 'none',
            }}>
              Start free trial
            </Link>
            <Link href="/book" style={{
              border: '1px solid #333', color: '#fff',
              padding: '13px 28px', borderRadius: '8px',
              fontSize: '15px', fontWeight: '600', textDecoration: 'none',
            }}>
              See a demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #E5E5E3', background: '#fff', padding: '28px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700' }}>DC</div>
            <span style={{ fontSize: '13px', color: '#555' }}>The Driving Center</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/legal/privacy" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/legal/terms" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Terms</Link>
            <Link href="/login" style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>Sign in</Link>
          </div>
          <span style={{ fontSize: '13px', color: '#9B9B9B' }}>© 2026 The Driving Center</span>
        </div>
      </footer>

    </main>
  )
}
