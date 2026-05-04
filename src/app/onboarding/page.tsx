'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, School, Users, Calendar, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const GLASS_BG = 'rgba(255,255,255,0.03)'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
const ACCENT = '#4ADE80'
const ACCENT_DIM = 'rgba(255,140,66,0.12)'
const SUCCESS = '#4ADE80'

function injectFonts() {
  if (typeof document === 'undefined') return
  const id = 'everest-fonts'
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap'
  document.head.appendChild(link)
}

const glassCard = {
  background: GLASS_BG,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${GLASS_BORDER}`,
  borderRadius: '24px',
  boxShadow: GLASS_SHADOW,
}

const glassInput = {
  background: GLASS_BG,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${GLASS_BORDER}`,
  color: '#ffffff',
  outline: 'none',
  borderRadius: '999px',
  padding: '12px 20px',
  fontSize: '14px',
  width: '100%' as const,
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s',
}

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
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: i < current ? '100%' : i === current ? '60%' : '0%',
                background: `linear-gradient(90deg, ${ACCENT}, #FF6B1E)`,
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
                  background: done ? 'rgba(74,222,128,0.12)' : active ? ACCENT_DIM : 'rgba(255,255,255,0.03)',
                  color: done ? SUCCESS : active ? ACCENT : 'rgba(255,255,255,0.3)',
                  border: `1px solid ${done ? 'rgba(74,222,128,0.25)' : active ? `${ACCENT}33` : GLASS_BORDER}`,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{label}</span>
              </div>
              {num < 4 && <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />}
            </div>
          )
        })}
      </div>
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

  useEffect(() => { injectFonts() }, [])

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

  const cardStyle = { ...glassCard, padding: '32px 28px' }
  const labelStyle = { fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative" style={{ background: '#0D0D12', backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.06) 0%, transparent 60%)' }}>
      {/* decorative circles */}
      <div className="bg-circle w-[500px] h-[500px] -top-48 -left-48" style={{ background: `radial-gradient(circle, ${ACCENT_DIM} 0%, transparent 70%)` }} />
      <div className="bg-circle w-[400px] h-[400px] bottom-20 -right-32" style={{ background: 'radial-gradient(circle, rgba(112,123,255,0.1) 0%, transparent 70%)' }} />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-12 relative z-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${ACCENT}, #FF6B1E)` }}>DC</div>
        <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>The Driving Center</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Step Indicator */}
        <StepIndicator current={step} />

        {/* Card */}
        <div style={cardStyle}>

          {/* Step 1 — School Info */}
          {step === 1 && (
            <>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.35)' }}>Step 1 of 4</div>
              <h2 className="text-2xl font-bold mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>School information</h2>
              <p className="text-sm mb-7" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>
                Setting up <span className="font-medium" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{!schoolData && schoolSlug ? 'Loading...' : schoolData?.name || schoolSlug || '—'}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block" style={labelStyle}>Phone number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(615) 555-0100"
                    style={glassInput} />
                </div>
                <div>
                  <label className="block" style={{ ...labelStyle, borderRadius: '12px' }}>Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Oneida, TN 37841"
                    style={{ ...glassInput, borderRadius: '12px' }} />
                </div>
                <button onClick={handleStep1} disabled={loading}
                  style={{ background: SUCCESS, color: '#000', padding: '14px 24px', borderRadius: '100px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontFamily: 'Outfit, sans-serif', opacity: loading ? 0.5 : 1 }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setStep(4)} className="w-full text-center text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Skip for now →
                </button>
              </div>
            </>
          )}

          {/* Step 2 — Instructor */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep(1)} className="p-1.5 rounded-full transition-colors hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.35)' }}>Step 2 of 4</div>
              </div>
              <h2 className="text-2xl font-bold mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Add an instructor</h2>
              <p className="text-sm mb-7" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>You can add more instructors later from your dashboard.</p>
              <div className="space-y-4">
                <div>
                  <label className="block" style={labelStyle}>Instructor name</label>
                  <input type="text" value={instructorName} onChange={e => setInstructorName(e.target.value)} placeholder="Matt Reedy"
                    style={glassInput} />
                </div>
                <div>
                  <label className="block" style={labelStyle}>Instructor email</label>
                  <input type="email" value={instructorEmail} onChange={e => setInstructorEmail(e.target.value)} placeholder="matt@yourdrivingschool.com"
                    style={glassInput} />
                </div>
                <button onClick={handleStep2} disabled={loading || !instructorName || !instructorEmail}
                  style={{ background: SUCCESS, color: '#000', padding: '14px 24px', borderRadius: '100px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontFamily: 'Outfit, sans-serif', opacity: (loading || !instructorName || !instructorEmail) ? 0.5 : 1 }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setStep(4)} className="w-full text-center text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Skip for now →
                </button>
              </div>
            </>
          )}

          {/* Step 3 — Session Type */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep(2)} className="p-1.5 rounded-full transition-colors hover:bg-white/5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.35)' }}>Step 3 of 4</div>
              </div>
              <h2 className="text-2xl font-bold mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Add a session type</h2>
              <p className="text-sm mb-7" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>This is what students will book and pay for.</p>
              <div className="space-y-4">
                <div>
                  <label className="block" style={labelStyle}>Session name</label>
                  <input type="text" value={sessionName} onChange={e => setSessionName(e.target.value)} placeholder="Behind-the-Wheel Lesson"
                    style={glassInput} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block" style={labelStyle}>Price ($)</label>
                    <input type="number" value={sessionPrice} onChange={e => setSessionPrice(e.target.value)} placeholder="50"
                      style={{ ...glassInput, borderRadius: '12px' }} />
                  </div>
                  <div>
                    <label className="block" style={labelStyle}>Duration (min)</label>
                    <input type="number" value={sessionDuration} onChange={e => setSessionDuration(e.target.value)} placeholder="60"
                      style={{ ...glassInput, borderRadius: '12px' }} />
                  </div>
                </div>
                <button onClick={handleStep3} disabled={loading || !sessionName}
                  style={{ background: SUCCESS, color: '#000', padding: '14px 24px', borderRadius: '100px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontFamily: 'Outfit, sans-serif', opacity: (loading || !sessionName) ? 0.5 : 1 }}>
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
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
                <Check className="w-8 h-8" style={{ color: SUCCESS }} />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2.5" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>You're all set!</h2>
              <p className="text-sm mb-8" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>
                Your school is ready. Head to your dashboard to start managing students and sessions.
              </p>
              <button onClick={handleDone}
                style={{ background: SUCCESS, color: '#000', padding: '14px 24px', borderRadius: '100px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontFamily: 'Outfit, sans-serif' }}>
                Go to dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#0D0D12' }} />}>
      <OnboardingContent />
    </Suspense>
  )
}
