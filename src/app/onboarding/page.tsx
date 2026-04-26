'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  { id: 1, label: 'Welcome', icon: '👋' },
  { id: 2, label: 'Your School', icon: '🏫' },
  { id: 3, label: 'Import Students', icon: '📁' },
  { id: 4, label: 'Availability', icon: '📅' },
  { id: 5, label: 'First Session', icon: '🚗' },
  { id: 6, label: "You're Live", icon: '🎉' },
]

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <OnboardingFlow />
    </Suspense>
  )
}

function OnboardingFlow() {
  const params = useSearchParams()
  const schoolIdFromUrl = params.get('school_id')
  const stepFromUrl = parseInt(params.get('step') ?? '1', 10)
  const [step, setStep] = useState(isNaN(stepFromUrl) ? 1 : stepFromUrl)
  const [schoolSlug, setSchoolSlug] = useState('')
  const [schoolId, setSchoolId] = useState<string | null>(schoolIdFromUrl)

  // ── FIX: Fall back to user metadata if school_id not in URL ──
  useEffect(() => {
    if (schoolIdFromUrl) {
      setSchoolId(schoolIdFromUrl)
    }
    // Also read slug from URL params (passed from signup redirect)
    const slugFromUrl = params.get('slug')
    if (slugFromUrl) {
      setSchoolSlug(slugFromUrl)
    }
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.school_id) {
        setSchoolId(user.user_metadata.school_id)
      }
    })
  }, [schoolIdFromUrl])
  // ── End FIX ──

  function advance() {
    setStep(s => Math.min(s + 1, 6))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">DC</div>
          <span className="text-white font-semibold text-sm">The Driving Center</span>
          <span className="text-gray-600 mx-1">·</span>
          <span className="text-gray-500 text-sm">Onboarding</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step > s.id
                      ? 'bg-cyan-500 text-white'
                      : step === s.id
                      ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400'
                      : 'bg-white/5 border border-white/10 text-gray-500'
                  }`}
                >
                  {step > s.id ? '✓' : s.icon}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${step === s.id ? 'text-cyan-400' : 'text-gray-600'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-16 h-px mx-1 ${step > s.id ? 'bg-cyan-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 1 && <StepWelcome onNext={advance} />}
        {step === 2 && <StepProfile onNext={advance} schoolId={schoolId} schoolSlug={schoolSlug} onSlug={setSchoolSlug} />}
        {step === 3 && <StepImport onNext={advance} schoolId={schoolId} />}
        {step === 4 && <StepAvailability onNext={advance} schoolId={schoolId} />}
        {step === 5 && <StepFirstSession onNext={advance} schoolId={schoolId} />}
        {step === 6 && <StepLive schoolSlug={schoolSlug} schoolId={schoolId} />}
      </div>
    </div>
  )
}

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-6">👋</div>
      <h1 className="text-2xl font-bold text-white mb-3">Welcome to The Driving Center</h1>
      <p className="text-gray-400 mb-2">
        Let's get your school set up and ready to take bookings.
      </p>
      <p className="text-gray-500 text-sm mb-10">
        Takes about 5 minutes. You'll have a live booking page when you're done.
      </p>
      <div className="space-y-3 text-left bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
        {[
          { n: '1', label: 'Set up your school profile' },
          { n: '2', label: 'Import your existing students (optional)' },
          { n: '3', label: 'Set instructor availability' },
          { n: '4', label: 'Create your first session' },
        ].map(item => (
          <div key={item.n} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
              {item.n}
            </div>
            <span className="text-gray-300 text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90">
        Let's Go →
      </button>
    </div>
  )
}

function StepProfile({ onNext, schoolId, schoolSlug, onSlug }: { onNext: () => void; schoolId: string | null; schoolSlug: string; onSlug: (s: string) => void }) {
  const [form, setForm] = useState({ name: '', tagline: '', phone: '', city: '', slug: '' })
  const [saved, setSaved] = useState(false)

  // Initialize slug with the full slug from parent (passed as prop, not state)
  useEffect(() => {
    if (schoolSlug) {
      setForm(prev => ({ ...prev, slug: schoolSlug }))
    }
  }, [schoolSlug])

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'name') {
      const generated = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setForm(prev => ({ ...prev, slug: generated }))
      onSlug(generated)
    }
    setSaved(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!schoolId) return
    const res = await fetch(`/api/schools/${schoolId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSaved(true)
      onSlug(schoolSlug || form.slug)
      setTimeout(onNext, 800)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Your School Profile</h2>
      <p className="text-gray-500 text-sm mb-6">This is what students see when they book with you.</p>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">School Name *</label>
          <input
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="Oak Ridge Driving School"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tagline</label>
          <input
            value={form.tagline}
            onChange={e => handleChange('tagline', e.target.value)}
            placeholder="Build confidence. Drive safe."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
          <input
            value={form.phone}
            onChange={e => handleChange('phone', e.target.value)}
            placeholder="(865) 555-0100"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">City</label>
          <input
            value={form.city}
            onChange={e => handleChange('city', e.target.value)}
            placeholder="Oak Ridge, TN"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Booking URL</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm shrink-0">thedrivingcentersaas.com/school/</span>
            <input
              value={form.slug}
              onChange={e => handleChange('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="oak-ridge-driving"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
        {saved && <div className="text-center text-green-400 text-sm py-2">✓ Saved — moving on...</div>}
        <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90">
          Save & Continue →
        </button>
      </form>
    </div>
  )
}

function StepImport({ onNext, schoolId }: { onNext: () => void; schoolId: string | null }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }

  async function processFile(f: File) {
    setFile(f)
    const formData = new FormData()
    formData.append('file', f)
    const res = await fetch('/api/import/students', {
      method: 'POST',
      headers: { 'x-school-id': schoolId ?? '' },
      body: formData,
    })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Import Your Students</h2>
      <p className="text-gray-500 text-sm mb-6">
        Drop your spreadsheet — we'll import it in seconds. You can skip this and add students manually later.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center mb-6 transition-colors ${
          dragging ? 'border-cyan-400 bg-cyan-500/5' : 'border-white/10'
        }`}
      >
        <div className="text-4xl mb-3">📁</div>
        <p className="text-gray-300 mb-1">Drag your CSV or Excel file here</p>
        <p className="text-gray-600 text-sm mb-4">or</p>
        <label className="inline-block bg-white/5 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-white/10">
          Browse Files
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]) }} />
        </label>
      </div>

      {result && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="text-sm font-semibold text-white mb-2">Import Results</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Imported', value: result.imported, color: 'text-green-400' },
              { label: 'Skipped', value: result.skipped, color: 'text-yellow-400' },
              { label: 'Errors', value: result.errors, color: 'text-red-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 rounded-lg p-3">
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onNext} className="flex-1 bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10">
          Skip for Now
        </button>
        <button onClick={onNext} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90">
          Continue →
        </button>
      </div>
    </div>
  )
}

function StepAvailability({ onNext, schoolId }: { onNext: () => void; schoolId: string | null }) {
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Instructor Availability</h2>
      <p className="text-gray-500 text-sm mb-6">
        Set your weekly schedule. Students will only see time slots when you're available.
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
          <div key={day} className="flex items-center gap-3">
            <span className="w-10 text-sm text-gray-400 shrink-0">{day.slice(0, 3)}</span>
            <input
              type="time"
              defaultValue="09:00"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <span className="text-gray-600">–</span>
            <input
              type="time"
              defaultValue="17:00"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <label className="flex items-center gap-2 ml-auto text-sm text-gray-500">
              <input type="checkbox" defaultChecked className="accent-cyan-500" />
              Active
            </label>
          </div>
        ))}
        <div className="pt-2 text-xs text-gray-600 text-center">
          Fine-tune this later in <span className="text-gray-500">School Admin → Availability</span>
        </div>
        {saving && <div className="text-center text-cyan-400 text-sm py-2">Saving...</div>}
        <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50">
          Save & Continue →
        </button>
      </form>
    </div>
  )
}

function StepFirstSession({ onNext, schoolId }: { onNext: () => void; schoolId: string | null }) {
  const [title, setTitle] = useState('Traffic School')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [creating, setCreating] = useState(false)
  const [done, setDone] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId ?? '' },
      body: JSON.stringify({
        title,
        session_date: date,
        session_time: time,
        duration_minutes: 60,
        max_seats: 1,
        price_cents: 12500,
        location: '',
      }),
    })
    setCreating(false)
    if (res.ok) {
      setDone(true)
      setTimeout(onNext, 1200)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Create Your First Session</h2>
      <p className="text-gray-500 text-sm mb-6">
        Set up one session so students can start booking right away. You can add more from the dashboard.
      </p>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Session Type</label>
          <select
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Traffic School">Traffic School (6hr)</option>
            <option value="Private Lesson">Private Lesson (1hr)</option>
            <option value="Driving Assessment">Driving Assessment</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm">
          <div className="text-gray-400 mb-1">Price</div>
          <div className="text-white font-semibold text-lg">$125.00</div>
          <div className="text-xs text-gray-600 mt-1">Deposit: $25.00 collected at booking</div>
        </div>
        {done && <div className="text-center text-green-400 text-sm py-2">✓ Session created!</div>}
        <button type="submit" disabled={creating} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50">
          {creating ? 'Creating...' : done ? 'Done!' : 'Create Session →'}
        </button>
      </form>
    </div>
  )
}

function StepLive({ schoolSlug, schoolId }: { schoolSlug: string; schoolId: string | null }) {
  const bookingUrl = schoolSlug ? `/school/${schoolSlug}` : '/dashboard'

  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-2xl font-bold text-white mb-3">You're Live!</h2>
      <p className="text-gray-400 mb-8">
        Your school is set up and ready to accept bookings. Share your link with students.
      </p>

      <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-5 mb-8 text-left">
        <div className="text-xs text-gray-500 mb-1">Your public booking page</div>
        <div className="text-cyan-400 font-mono text-sm mb-4">
          thedrrivingcentersaas.com{bookingUrl}
        </div>
        <div className="flex gap-2">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-cyan-500/20 text-cyan-400 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-cyan-500/30"
          >
            Preview →
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90"
        >
          Go to Your Dashboard →
        </Link>
        <p className="text-center text-gray-600 text-xs">
          Share this link with your students to start accepting bookings.
        </p>
      </div>
    </div>
  )
}
