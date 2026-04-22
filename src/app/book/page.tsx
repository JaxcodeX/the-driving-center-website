'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

type SessionType = {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  deposit_cents: number
  color: string
  tca_hours_credit: number | null
}

type Slot = {
  session_date: string
  start_time: string
  end_time: string
  instructor_id: string
  instructor_name: string
  seats_available: number
}

type Step = 'type' | 'slot' | 'details' | 'payment' | 'confirmation'

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function formatShort(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

const STEPS: Step[] = ['type', 'slot', 'details', 'payment', 'confirmation']
const STEP_LABELS = ['Lesson Type', 'Pick a Time', 'Your Details', 'Payment', 'All Set!']

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.indexOf(current)
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
            ${i <= currentIdx ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-500'}`}>
            {i < currentIdx ? '✓' : i + 1}
          </div>
          <span className={`text-xs hidden sm:block ${i <= currentIdx ? 'text-white' : 'text-gray-500'}`}>
            {STEP_LABELS[i]}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px ${i < currentIdx ? 'bg-cyan-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <BookContent />
    </Suspense>
  )
}

function BookContent() {
  const params = useSearchParams()
  const schoolId = params.get('school')
  const [step, setStep] = useState<Step>('type')
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedType, setSelectedType] = useState<SessionType | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null)

  // Form state
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  // Load session types
  useEffect(() => {
    if (!schoolId) return
    async function load() {
      const res = await fetch(`/api/session-types?school_id=${schoolId}`)
      if (res.ok) {
        const data = await res.json()
        setSessionTypes(data)
      }
      setLoadingTypes(false)
    }
    load()
  }, [schoolId])

  // Load slots when type selected
  async function selectType(type: SessionType) {
    setSelectedType(type)
    setLoadingSlots(true)
    setStep('slot')

    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const res = await fetch(
      `/api/slots?school_id=${schoolId}&session_type_id=${type.id}&start_date=${startDate}&end_date=${endDate}`
    )
    const data = await res.json()
    setSlots(data.slots ?? [])
    setLoadingSlots(false)
  }

  // Book slot
  async function selectSlot(slot: Slot) {
    setSelectedSlot(slot)
    setStep('details')
  }

  // Submit booking
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studentName || !studentEmail) {
      setFormError('Name and email are required')
      return
    }
    if (!studentEmail.includes('@')) {
      setFormError('Please enter a valid email')
      return
    }
    setFormError('')
    setSubmitting(true)

    // Find session ID for this slot (need to look it up via sessions API)
    const sessionRes = await fetch(`/api/sessions?school_id=${schoolId}`)
    const sessions = await sessionRes.json()
    const matchedSession = sessions.find(
      (s: any) => s.start_date === selectedSlot!.session_date &&
        s.start_time === selectedSlot!.start_time &&
        s.instructor_id === selectedSlot!.instructor_id
    )

    if (!matchedSession) {
      setFormError('Sorry, this slot is no longer available. Please go back and select another time.')
      setSubmitting(false)
      return
    }

    const bookRes = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: matchedSession.id,
        student_name: studentName,
        student_email: studentEmail,
        student_phone: studentPhone || undefined,
      }),
    })

    const bookData = await bookRes.json()

    if (!bookRes.ok) {
      setFormError(bookData.error ?? 'Booking failed')
      setSubmitting(false)
      return
    }

    setBookingId(bookData.booking_id)
    setConfirmationToken(bookData.confirmation_token)

    if (bookData.status === 'pending_payment' && selectedType!.deposit_cents > 0) {
      // Create Stripe checkout
      const checkoutRes = await fetch(`/api/bookings/${bookData.booking_id}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookData.booking_id }),
      })
      const checkoutData = await checkoutRes.json()

      if (checkoutData.url) {
        setCheckoutUrl(checkoutData.url)
        setStep('payment')
      } else {
        setStep('confirmation')
      }
    } else {
      setStep('confirmation')
    }

    setSubmitting(false)
  }

  if (!schoolId) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚗</div>
          <h1 className="text-2xl font-bold text-white mb-2">No school selected</h1>
          <p className="text-gray-400">Ask your school for their booking link.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DC</span>
          </div>
          <span className="font-semibold">The Driving Center</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6">
        {step !== 'confirmation' && <StepIndicator current={step} />}

        {/* STEP 1: Pick lesson type */}
        {step === 'type' && (
          <div>
            <h1 className="text-2xl font-bold mb-1">Book a Lesson</h1>
            <p className="text-gray-400 mb-6">Select the type of lesson you need.</p>

            {loadingTypes ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse h-20" />
                ))}
              </div>
            ) : sessionTypes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-gray-400">No lesson types available right now. Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessionTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => selectType(type)}
                    className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          <span className="font-semibold text-white">{type.name}</span>
                          {type.tca_hours_credit && (
                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                              {type.tca_hours_credit}h credit
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{type.description}</p>
                        <div className="text-gray-500 text-xs mt-1">
                          {type.duration_minutes} minutes
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="font-bold text-white">{formatPrice(type.price_cents)}</div>
                        {type.deposit_cents > 0 && (
                          <div className="text-xs text-gray-500">
                            {formatPrice(type.deposit_cents)} deposit
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Pick a time */}
        {step === 'slot' && (
          <div>
            <button onClick={() => setStep('type')} className="text-sm text-gray-400 hover:text-white mb-4 flex items-center gap-1">
              ← Back
            </button>
            <h1 className="text-2xl font-bold mb-1">{selectedType?.name}</h1>
            <p className="text-gray-400 mb-6">
              {selectedType?.duration_minutes} min
              {selectedType?.deposit_cents ? ` · ${formatPrice(selectedType.deposit_cents)} deposit` : ''}
            </p>

            {loadingSlots ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl h-14 animate-pulse" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🗓️</div>
                <p className="text-gray-400 mb-2">No available times in the next 30 days.</p>
                <p className="text-gray-500 text-sm">Check back soon — new slots are added regularly.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Group slots by date */}
                {Object.entries(
                  slots.reduce((acc: Record<string, Slot[]>, slot) => {
                    const date = slot.session_date
                    if (!acc[date]) acc[date] = []
                    acc[date].push(slot)
                    return acc
                  }, {})
                ).map(([date, daySlots]) => (
                  <div key={date}>
                    <div className="text-sm font-medium text-gray-400 mb-2 mt-4 first:mt-0">
                      {formatDate(date)}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {daySlots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => selectSlot(slot)}
                          className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm hover:border-cyan-500/30 transition-all text-left"
                        >
                          <div className="font-medium text-white">{formatTime(slot.start_time)}</div>
                          <div className="text-gray-500 text-xs">
                            {slot.instructor_name} · {slot.seats_available} left
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Student details */}
        {step === 'details' && (
          <div>
            <button onClick={() => setStep('slot')} className="text-sm text-gray-400 hover:text-white mb-4 flex items-center gap-1">
              ← Back
            </button>

            {/* Summary */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="font-semibold text-white">{selectedType?.name}</div>
              <div className="text-gray-400 text-sm mt-1">
                {selectedSlot && formatDate(selectedSlot.session_date)} at {selectedSlot && formatTime(selectedSlot.start_time)}
              </div>
              {selectedType?.deposit_cents ? (
                <div className="text-cyan-400 text-sm mt-1">
                  Deposit: {formatPrice(selectedType.deposit_cents)} (credited toward total)
                </div>
              ) : null}
            </div>

            <h1 className="text-2xl font-bold mb-6">Your Details</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email *</label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={e => setStudentPhone(e.target.value)}
                  placeholder="(555) 867-5309"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-xs text-gray-600 mt-1">Get SMS reminders 48h and 4h before your lesson</p>
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? 'Processing...' : selectedType?.deposit_cents ? `Pay ${formatPrice(selectedType.deposit_cents)} Deposit` : 'Confirm Booking'}
              </button>

              <p className="text-center text-xs text-gray-600">
                {selectedType?.deposit_cents
                  ? `Your ${formatPrice(selectedType.deposit_cents)} deposit is credited toward your total. Cancellation 24h+ in advance = full refund.`
                  : 'You will receive a confirmation email with your booking details.'}
              </p>
            </form>
          </div>
        )}

        {/* STEP 4: Redirect to Stripe */}
        {step === 'payment' && checkoutUrl && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-2">Secure Checkout</h1>
            <p className="text-gray-400 mb-6">Redirecting you to complete payment...</p>
            <a
              href={checkoutUrl}
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90"
            >
              Complete Payment →
            </a>
          </div>
        )}

        {/* STEP 5: Confirmation */}
        {step === 'confirmation' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-gray-400 mb-2">
              You're all set for your <span className="text-white font-medium">{selectedType?.name}</span>.
            </p>
            {selectedSlot && (
              <p className="text-gray-400 mb-1">
                {formatDate(selectedSlot.session_date)} at {formatTime(selectedSlot.start_time)}
              </p>
            )}
            {selectedSlot && (
              <p className="text-gray-500 text-sm mb-8">
                with {selectedSlot.instructor_name}
              </p>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
              <div className="text-sm text-gray-400 mb-2">What happens next?</div>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✅ Confirmation email sent to <span className="text-white">{studentEmail}</span></li>
                <li>⏰ You'll get an SMS reminder 48 hours before</li>
                <li>⏰ Final reminder 4 hours before</li>
                <li>🔗 Need to reschedule? Use your confirmation link in your email</li>
              </ul>
            </div>

            <div className="text-xs text-gray-600">
              A confirmation has been sent to {studentEmail}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
