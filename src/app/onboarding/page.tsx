'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Check, School, Users, Calendar, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const T = {
  bg:        '#050505',
  surface:   '#0D0D0D',
  elevated:  '#18181b',
  border:    '#1A1A1A',
  borderLt:  '#27272a',
  text:      '#ffffff',
  secondary: '#94A3B8',
  muted:     '#52525b',
  cyan:      '#38BDF8',
  purple:    '#818CF8',
  green:     '#10B981',
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

const STEPS = [
  { num: 1, label: 'School Info', icon: School },
  { num: 2, label: 'Instructor', icon: Users },
  { num: 3, label: 'Session Type', icon: Calendar },
  { num: 4, label: 'Done', icon: Check },
]

const inputStyle = {
  background: T.elevated,
  border: `1px solid ${T.borderLt}`,
  color: T.text,
  outline: 'none' as const,
}

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [schoolSlug, setSchoolSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [schoolData, setSchoolData] = useState<any>(null)

  // Step 1 data
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Step 2 data
  const [instructorName, setInstructorName] = useState('')
  const [instructorEmail, setInstructorEmail] = useState('')

  // Step 3 data
  const [sessionName, setSessionName] = useState('')
  const [sessionPrice, setSessionPrice] = useState('')
  const [sessionDuration, setSessionDuration] = useState('60')

  useEffect(() => {
    const slug = searchParams.get('school')
    if (slug) setSchoolSlug(slug)
  }, [searchParams])

  async function loadSchool() {
    if (!schoolSlug) return
    const supabase = createClient()
    const { data } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', schoolSlug)
      .single()
    setSchoolData(data)
  }

  useEffect(() => { loadSchool() }, [schoolSlug])

  async function saveSchoolProfile(updates: any) {
    const supabase = createClient()
    await supabase
      .from('schools')
      .update(updates)
      .eq('slug', schoolSlug)
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

  function handleDone() {
    router.push('/school-admin')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: T.bg }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-12">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: T.grad }}>DC</div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: T.text }}>The Driving Center</span>
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map(({ num, label, icon: Icon }) => {
          const done = step > num
          const active = step === num
          return (
            <div key={num} className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: done ? `${T.green}20` : active ? `${T.cyan}20` : T.elevated,
                  color: done ? T.green : active ? T.cyan : T.muted,
                  border: `1px solid ${done ? `${T.green}40` : active ? `${T.cyan}40` : T.border}`,
                }}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{label}</span>
              </div>
              {num < 4 && (
                <ChevronRight className="w-4 h-4" style={{ color: T.muted }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8" style={{ background: T.surface, border: `1px solid ${T.border}` }}>

          {/* Step 1 — School Info */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-1" style={{ color: T.text }}>School information</h2>
              <p className="text-sm mb-6" style={{ color: T.muted }}>
                Setting up <span style={{ color: T.secondary }}>{schoolData?.name || schoolSlug}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Phone number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(615) 555-0100"
                    className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
                    onBlur={e => (e.target.style.borderColor = T.borderLt)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Oneida, TN 37841"
                    className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
                    onBlur={e => (e.target.style.borderColor = T.borderLt)} />
                </div>
                <button onClick={handleStep1} disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: T.grad }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setStep(4)} className="w-full text-center text-xs" style={{ color: T.muted }}>
                  Skip for now →
                </button>
              </div>
            </>
          )}

          {/* Step 2 — Instructor */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-1" style={{ color: T.text }}>Add an instructor</h2>
              <p className="text-sm mb-6" style={{ color: T.muted }}>You can add more instructors later from your dashboard.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Instructor name</label>
                  <input type="text" value={instructorName} onChange={e => setInstructorName(e.target.value)} placeholder="Matt Reedy"
                    className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
                    onBlur={e => (e.target.style.borderColor = T.borderLt)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Instructor email</label>
                  <input type="email" value={instructorEmail} onChange={e => setInstructorEmail(e.target.value)} placeholder="matt@yourdrivingschool.com"
                    className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
                    onBlur={e => (e.target.style.borderColor = T.borderLt)} />
                </div>
                <button onClick={handleStep2} disabled={loading || !instructorName || !instructorEmail}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: T.grad }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => setStep(4)} className="w-full text-center text-xs" style={{ color: T.muted }}>
                  Skip for now →
                </button>
              </div>
            </>
          )}

          {/* Step 3 — Session Type */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-1" style={{ color: T.text }}>Add a session type</h2>
              <p className="text-sm mb-6" style={{ color: T.muted }}>This is what students will book and pay for.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Session name</label>
                  <input type="text" value={sessionName} onChange={e => setSessionName(e.target.value)} placeholder="Behind-the-Wheel Lesson"
                    className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
                    onBlur={e => (e.target.style.borderColor = T.borderLt)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Price ($)</label>
                    <input type="number" value={sessionPrice} onChange={e => setSessionPrice(e.target.value)} placeholder="50"
                      className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
                      onBlur={e => (e.target.style.borderColor = T.borderLt)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: T.muted }}>Duration (min)</label>
                    <input type="number" value={sessionDuration} onChange={e => setSessionDuration(e.target.value)} placeholder="60"
                      className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = `${T.cyan}60`)}
                      onBlur={e => (e.target.style.borderColor = T.borderLt)} />
                  </div>
                </div>
                <button onClick={handleStep3} disabled={loading || !sessionName}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: T.grad }}>
                  Finish setup <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Step 4 — Done */}
          {step === 4 && (
            <>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: `${T.green}20`, border: `1px solid ${T.green}40` }}>
                <Check className="w-7 h-7" style={{ color: T.green }} />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: T.text }}>You're all set!</h2>
              <p className="text-sm text-center mb-8" style={{ color: T.muted }}>
                Your school is ready. Head to your dashboard to start managing students and sessions.
              </p>
              <button onClick={handleDone}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: T.grad }}>
                Go to dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#050505' }} />}>
      <OnboardingContent />
    </Suspense>
  )
}