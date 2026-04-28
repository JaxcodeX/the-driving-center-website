'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, School, Users, Calendar, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  { num: 1, label: 'School Info', icon: School },
  { num: 2, label: 'Instructor', icon: Users },
  { num: 3, label: 'Session Type', icon: Calendar },
  { num: 4, label: 'Done', icon: Check },
]

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-10">
      {/* Progress bar */}
      <div className="flex gap-1.5 mb-4">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: i < current ? '100%' : i === current ? '60%' : '0%',
                background: 'linear-gradient(90deg, #7ED4FD, #707BFF)',
              }}
            />
          </div>
        ))}
      </div>
      {/* Step pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map(({ num, label, icon: Icon }) => {
          const done = current > num
          const active = current === num
          return (
            <div key={num} className="flex items-center gap-1.5">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
                style={{
                  background: done ? 'rgba(74,222,128,0.15)' : active ? 'rgba(126,212,253,0.15)' : 'rgba(255,255,255,0.04)',
                  color: done ? 'var(--success)' : active ? '#7ED4FD' : 'var(--text-muted)',
                  border: `1px solid ${done ? 'rgba(74,222,128,0.3)' : active ? 'rgba(126,212,253,0.3)' : 'var(--card-border)'}`,
                }}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{label}</span>
              </div>
              {num < 4 && <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Pill Input helper ──────────────────────────────────────────────────────
const pillInput = {
  background: 'var(--card-bg)',
  border: '1px solid var(--card-border)',
  color: 'var(--text-primary)',
  outline: 'none' as const,
  borderRadius: '999px',
  padding: '12px 20px',
  fontSize: '14px',
  width: '100%' as const,
}

// ─── Page Card ───────────────────────────────────────────────────────────────
function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  )
}

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [schoolSlug, setSchoolSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [schoolData, setSchoolData] = useState<any>(null)
  const [slugLoaded, setSlugLoaded] = useState(false)

  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [instructorName, setInstructorName] = useState('')
  const [instructorEmail, setInstructorEmail] = useState('')
  const [sessionName, setSessionName] = useState('')
  const [sessionPrice, setSessionPrice] = useState('')
  const [sessionDuration, setSessionDuration] = useState('60')

  useEffect(() => {
    const slug = searchParams.get('school')
    setSchoolSlug(slug || null)
    setSlugLoaded(true)
  }, [searchParams])

  useEffect(() => {
    if (!slugLoaded || !schoolSlug) return
    loadSchool()
  }, [slugLoaded, schoolSlug])

  useEffect(() => {
    if (slugLoaded && !schoolSlug && !schoolData) {
      router.replace('/')
    }
  }, [slugLoaded, schoolSlug, schoolData])

  async function loadSchool() {
    if (!schoolSlug) return
    const supabase = createClient()
    const { data } = await supabase.from('schools').select('*').eq('slug', schoolSlug).single()
    setSchoolData(data)
  }

  async function saveSchoolProfile(updates: any) {
    const supabase = createClient()
    await supabase.from('schools').update(updates).eq('slug', schoolSlug)
  }

  async function handleStep1() {
    setLoading(true)
    await saveSchoolProfile({ phone, address })
    setStep(2)
    setLoading(false)
  }

  async function handleStep2() {
    if (!instructorName || !instructorEmail) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('instructors').insert({
      school_id: schoolData?.id,
      name: instructorName,
      email: instructorEmail,
      status: 'active',
    })
    setStep(3)
    setLoading(false)
  }

  async function handleStep3() {
    if (!sessionName) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('session_types').insert({
      school_id: schoolData?.id,
      name: sessionName,
      price: parseFloat(sessionPrice) || 0,
      duration_minutes: parseInt(sessionDuration) || 60,
      active: true,
    })
    setStep(4)
    setLoading(false)
  }

  function handleDone() { router.push('/school-admin') }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={{ background: 'var(--bg-base)' }}>
      {/* decorative circles */}
      <div className="bg-circle w-[500px] h-[500px] -top-48 -left-48" style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.2) 0%, transparent 70%)' }} />
      <div className="bg-circle w-[400px] h-[400px] bottom-20 -right-32" style={{ background: 'radial-gradient(circle, rgba(112,123,255,0.15) 0%, transparent 70%)' }} />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-12 relative z-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)' }}>DC</div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>The Driving Center</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Step Indicator */}
        <StepIndicator current={step} />

        {/* Card */}
        <div className="glass-card" style={{ padding: '32px 28px' }}>

          {/* Step 1 — School Info */}
          {step === 1 && (
            <>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Step 1 of 4</div>
              <h2 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>School information</h2>
              <p className="text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>
                Setting up <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{!schoolData && schoolSlug ? 'Loading...' : schoolData?.name || schoolSlug || '—'}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Phone number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(615) 555-0100"
                    className="input-pill" style={pillInput} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Oneida, TN 37841"
                    className="input-pill" style={{ ...pillInput, borderRadius: '12px' }} />
                </div>
                <button onClick={handleStep1} disabled={loading}
                  className="btn-glow w-full justify-center mt-2"
                  style={{ padding: '14px 24px' }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setStep(4)} className="w-full text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  Skip for now →
                </button>
              </div>
            </>
          )}

          {/* Step 2 — Instructor */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep(1)} className="p-1.5 rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Step 2 of 4</div>
              </div>
              <h2 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Add an instructor</h2>
              <p className="text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>You can add more instructors later from your dashboard.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Instructor name</label>
                  <input type="text" value={instructorName} onChange={e => setInstructorName(e.target.value)} placeholder="Matt Reedy"
                    className="input-pill" style={pillInput} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Instructor email</label>
                  <input type="email" value={instructorEmail} onChange={e => setInstructorEmail(e.target.value)} placeholder="matt@yourdrivingschool.com"
                    className="input-pill" style={pillInput} />
                </div>
                <button onClick={handleStep2} disabled={loading || !instructorName || !instructorEmail}
                  className="btn-glow w-full justify-center mt-2 disabled:opacity-50"
                  style={{ padding: '14px 24px' }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setStep(4)} className="w-full text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  Skip for now →
                </button>
              </div>
            </>
          )}

          {/* Step 3 — Session Type */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep(2)} className="p-1.5 rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Step 3 of 4</div>
              </div>
              <h2 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Add a session type</h2>
              <p className="text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>This is what students will book and pay for.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Session name</label>
                  <input type="text" value={sessionName} onChange={e => setSessionName(e.target.value)} placeholder="Behind-the-Wheel Lesson"
                    className="input-pill" style={pillInput} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Price ($)</label>
                    <input type="number" value={sessionPrice} onChange={e => setSessionPrice(e.target.value)} placeholder="50"
                      className="input-pill" style={{ ...pillInput, borderRadius: '12px' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Duration (min)</label>
                    <input type="number" value={sessionDuration} onChange={e => setSessionDuration(e.target.value)} placeholder="60"
                      className="input-pill" style={{ ...pillInput, borderRadius: '12px' }} />
                  </div>
                </div>
                <button onClick={handleStep3} disabled={loading || !sessionName}
                  className="btn-glow w-full justify-center mt-2 disabled:opacity-50"
                  style={{ padding: '14px 24px' }}>
                  Finish setup <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Step 4 — Done */}
          {step === 4 && (
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}>
                <Check className="w-8 h-8" style={{ color: 'var(--success)' }} />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2.5" style={{ color: 'var(--text-primary)' }}>You're all set!</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                Your school is ready. Head to your dashboard to start managing students and sessions.
              </p>
              <button onClick={handleDone}
                className="btn-glow w-full justify-center"
                style={{ padding: '14px 24px' }}>
                Go to dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Need motion from framer-motion
// (already imported at top of file)

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg-base)' }} />}>
      <OnboardingContent />
    </Suspense>
  )
}
