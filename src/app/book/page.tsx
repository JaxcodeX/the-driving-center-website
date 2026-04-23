'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car, Clock, BookOpen, CheckCircle, Calendar as CalendarIcon,
  ChevronLeft, ChevronRight, User, Mail, Phone, Hash, AlertCircle, GraduationCap, Route, Star
} from 'lucide-react'

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

const STEPS = ['type', 'slot', 'details', 'confirmation']
const STEP_LABELS = ['Service', 'Date & Time', 'Your Info', 'Confirm']

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

function formatShort(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function formatFull(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function getServiceIcon(name: string) {
  if (name.toLowerCase().includes('traffic')) return <Car className="w-5 h-5" />
  if (name.toLowerCase().includes('road test')) return <Route className="w-5 h-5" />
  return <GraduationCap className="w-5 h-5" />
}

const SESSION_ICONS: Record<string, React.ReactNode> = {}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">
          Step {current + 1} of {STEPS.length} — <span className="text-white font-medium">{STEP_LABELS[current]}</span>
        </span>
        <span className="text-xs text-gray-600">{Math.round(((current + 1) / STEPS.length) * 100)}%</span>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: i <= current ? '100%' : '0%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── STEP 1: Service Selection ─────────────────────────────────────────────
function ServiceSelection({
  sessionTypes,
  selectedType,
  onSelect,
  loading,
}: {
  sessionTypes: SessionType[]
  selectedType: SessionType | null
  onSelect: (t: SessionType) => void
  loading: boolean
}) {
  return (
    <motion.div
      key="step-type"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <h1 className="text-2xl font-bold text-white mb-1">Book a Lesson</h1>
      <p className="text-gray-400 mb-6">Choose the service that fits your needs.</p>

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : sessionTypes.length === 0 ? (
        <div className="text-center py-16 glass rounded-xl border border-white/[0.06]">
          <CalendarIcon className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No services available right now.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sessionTypes.map(type => {
            const isSelected = selectedType?.id === type.id
            return (
              <button
                key={type.id}
                onClick={() => onSelect(type)}
                className={`
                  relative rounded-xl p-5 text-left transition-all duration-300 group
                  ${isSelected
                    ? 'glass-card border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'glass border-white/[0.06] hover:border-white/[0.15]'
                  }
                `}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-black" />
                  </motion.div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/[0.06] text-gray-400 group-hover:bg-white/[0.1]'
                    }`}
                  >
                    {getServiceIcon(type.name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-white">{type.name}</span>
                      {type.tca_hours_credit && (
                        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                          {type.tca_hours_credit}h TCA Credit
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{type.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{type.duration_minutes} min</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right ml-2">
                    <div className={`font-bold text-lg ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                      {formatPrice(type.price_cents)}
                    </div>
                    {type.deposit_cents > 0 && (
                      <div className="text-xs text-gray-500">{formatPrice(type.deposit_cents)} deposit</div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ─── STEP 2: Date & Time ─────────────────────────────────────────────────────
function DateAndTime({
  selectedType,
  slots,
  selectedSlot,
  onSelectSlot,
  loadingSlots,
  schoolId,
  onBack,
}: {
  selectedType: SessionType
  slots: Slot[]
  selectedSlot: Slot | null
  onSelectSlot: (s: Slot) => void
  loadingSlots: boolean
  schoolId: string
  onBack: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    return {
      dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
    }
  })

  // Group slots by date
  const slotsByDate: Record<string, Slot[]> = {}
  for (const slot of slots) {
    if (!slotsByDate[slot.session_date]) slotsByDate[slot.session_date] = []
    slotsByDate[slot.session_date].push(slot)
  }

  const selectedDateSlots = selectedDate ? slotsByDate[selectedDate] ?? [] : Object.values(slotsByDate).flat()

  // Group by time of day
  function getTimeSection(slot: Slot) {
    const h = parseInt(slot.start_time.split(':')[0])
    if (h < 12) return 'Morning'
    if (h < 17) return 'Afternoon'
    return 'Evening'
  }

  const sections = ['Morning', 'Afternoon', 'Evening']
  const slotsBySection: Record<string, Slot[]> = {}
  for (const slot of selectedDateSlots) {
    const sec = getTimeSection(slot)
    if (!slotsBySection[sec]) slotsBySection[sec] = []
    slotsBySection[sec].push(slot)
  }

  return (
    <motion.div
      key="step-slot"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <button onClick={onBack} className="text-sm text-gray-400 hover:text-white mb-4 flex items-center gap-1 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">{selectedType.name}</h1>
      <p className="text-gray-400 text-sm mb-6">
        {selectedType.duration_minutes} min
        {selectedType.deposit_cents > 0 ? ` · ${formatPrice(selectedType.deposit_cents)} deposit` : ''}
      </p>

      {/* 7-day calendar strip */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map(({ dateStr, label, dayNum, month, isToday }) => {
            const hasSlots = !!slotsByDate[dateStr]
            const isSelected = selectedDate === dateStr
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`
                  flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-3 min-w-[64px] transition-all duration-200
                  ${isSelected
                    ? 'bg-cyan-500/15 border border-cyan-400/40 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : hasSlots
                      ? 'glass border border-white/[0.08] text-white hover:border-white/[0.2]'
                      : 'bg-white/[0.03] border border-white/[0.04] text-gray-600'
                  }
                `}
              >
                <span className={`text-xs ${isToday ? 'text-cyan-400' : ''}`}>{label}</span>
                <span className="text-lg font-bold mt-0.5">{dayNum}</span>
                <span className="text-xs opacity-60">{month}</span>
                {hasSlots && !isSelected && (
                  <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {loadingSlots ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl h-14 animate-pulse" />
          ))}
        </div>
      ) : selectedDateSlots.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl border border-white/[0.06]">
          <CalendarIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No available times{selectedDate ? ' on this day' : ' in the next 30 days'}.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sections.map(section => {
            const sectionSlots = slotsBySection[section]
            if (!sectionSlots?.length) return null
            return (
              <div key={section}>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{section}</div>
                <div className="grid grid-cols-2 gap-2">
                  {sectionSlots.map((slot, i) => {
                    const isSelected = selectedSlot?.session_date === slot.session_date &&
                      selectedSlot?.start_time === slot.start_time &&
                      selectedSlot?.instructor_id === slot.instructor_id
                    return (
                      <button
                        key={i}
                        onClick={() => onSelectSlot(slot)}
                        className={`
                          rounded-xl py-3 px-4 text-left transition-all duration-200 border
                          ${isSelected
                            ? 'bg-cyan-500/15 border-cyan-400/50 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                            : 'glass border-white/[0.06] hover:border-white/[0.2] text-white'
                          }
                        `}
                      >
                        <div className={`font-semibold text-sm ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                          {formatTime(slot.start_time)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {slot.instructor_name} · {slot.seats_available} seat{slot.seats_available !== 1 ? 's' : ''} left
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ─── STEP 3: Student Details ─────────────────────────────────────────────────
function StudentDetails({
  selectedType,
  selectedSlot,
  studentName, setStudentName,
  studentEmail, setStudentEmail,
  studentPhone, setStudentPhone,
  permitNumber, setPermitNumber,
  formError,
  submitting,
  onSubmit,
  onBack,
}: {
  selectedType: SessionType
  selectedSlot: Slot
  studentName: string; setStudentName: (v: string) => void
  studentEmail: string; setStudentEmail: (v: string) => void
  studentPhone: string; setStudentPhone: (v: string) => void
  permitNumber: string; setPermitNumber: (v: string) => void
  formError: string
  submitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}) {
  return (
    <motion.div
      key="step-details"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <button onClick={onBack} className="text-sm text-gray-400 hover:text-white mb-4 flex items-center gap-1 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Summary */}
      <div className="glass rounded-xl p-4 mb-6 border-cyan-400/20">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-white">{selectedType.name}</div>
            <div className="text-gray-400 text-sm mt-0.5">
              {selectedSlot && formatFull(selectedSlot.session_date)} at {selectedSlot && formatTime(selectedSlot.start_time)}
            </div>
            <div className="text-gray-500 text-xs mt-0.5">with {selectedSlot.instructor_name}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-cyan-400">{formatPrice(selectedType.price_cents)}</div>
            {selectedType.deposit_cents > 0 && (
              <div className="text-xs text-gray-500">{formatPrice(selectedType.deposit_cents)} deposit</div>
            )}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">Your Information</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name *</span>
          </label>
          <input
            type="text"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            placeholder="Jane Smith"
            required
            className="dark-input"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email *</span>
          </label>
          <input
            type="email"
            value={studentEmail}
            onChange={e => setStudentEmail(e.target.value)}
            placeholder="jane@example.com"
            required
            className="dark-input"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone (optional)</span>
          </label>
          <input
            type="tel"
            value={studentPhone}
            onChange={e => setStudentPhone(e.target.value)}
            placeholder="(555) 867-5309"
            className="dark-input"
          />
        </div>

        {/* Permit # */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Permit / License Number</span>
          </label>
          <input
            type="text"
            value={permitNumber}
            onChange={e => setPermitNumber(e.target.value)}
            placeholder="Optional"
            className="dark-input"
          />
        </div>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-glow text-white font-semibold py-4 rounded-xl transition-opacity disabled:opacity-50 mt-2"
        >
          {submitting ? 'Processing...' : selectedType.deposit_cents > 0 ? `Pay ${formatPrice(selectedType.deposit_cents)} Deposit` : 'Confirm Booking'}
        </button>

        <p className="text-center text-xs text-gray-600 px-2">
          By booking, you agree to our cancellation policy. {selectedType.deposit_cents > 0
            ? `Your ${formatPrice(selectedType.deposit_cents)} deposit is credited toward your total.`
            : 'You will receive a confirmation email with your booking details.'}
        </p>
      </form>
    </motion.div>
  )
}

// ─── STEP 4: Confirmation ────────────────────────────────────────────────────
function Confirmation({
  selectedType,
  selectedSlot,
  studentName,
  studentEmail,
  bookingId,
  confirmationToken,
  checkoutUrl,
  step,
  setStep,
}: {
  selectedType: SessionType
  selectedSlot: Slot
  studentName: string
  studentEmail: string
  bookingId: string | null
  confirmationToken: string | null
  checkoutUrl: string | null
  step: string
  setStep: (s: string) => void
}) {
  if (step === 'payment' && checkoutUrl) {
    return (
      <motion.div
        key="step-payment"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Secure Checkout</h1>
        <p className="text-gray-400 mb-8">Complete your payment to confirm your booking.</p>
        <a
          href={checkoutUrl}
          className="inline-block btn-glow text-white font-semibold px-8 py-4 rounded-xl transition-opacity hover:opacity-90"
        >
          Pay Now →
        </a>
      </motion.div>
    )
  }

  return (
    <motion.div
      key="step-confirm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-center"
    >
      {/* Animated check */}
      <motion.div
        className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>
      </motion.div>

      <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
      <p className="text-gray-400 mb-1">
        You're all set for <span className="text-white font-medium">{selectedType.name}</span>.
      </p>
      {selectedSlot && (
        <p className="text-gray-400 mb-1">
          {formatFull(selectedSlot.session_date)} at {formatTime(selectedSlot.start_time)}
        </p>
      )}
      <p className="text-gray-500 text-sm mb-8">with {selectedSlot.instructor_name}</p>

      {/* Summary card */}
      <div className="glass rounded-xl p-5 text-left mb-6 border-white/[0.08] max-w-sm mx-auto">
        <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Booking Summary</div>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Service</span>
            <span className="text-white font-medium">{selectedType.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Date</span>
            <span className="text-white">{selectedSlot && formatShort(selectedSlot.session_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Time</span>
            <span className="text-white">{selectedSlot && formatTime(selectedSlot.start_time)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Instructor</span>
            <span className="text-white">{selectedSlot.instructor_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Student</span>
            <span className="text-white">{studentName}</span>
          </div>
          <div className="border-t border-white/[0.06] pt-2.5 flex justify-between">
            <span className="text-gray-400">Total</span>
            <span className="text-cyan-400 font-bold">{formatPrice(selectedType.price_cents)}</span>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="glass rounded-xl p-4 text-left mb-6 border-white/[0.08] max-w-sm mx-auto">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">What happens next?</div>
        <ul className="text-sm text-gray-300 space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            Confirmation email sent to <span className="text-white">{studentEmail}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            SMS reminder 48 hours before your lesson
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            Final reminder 4 hours before
          </li>
        </ul>
      </div>

      <p className="text-xs text-gray-600">
        Confirmation #{bookingId?.slice(0, 8).toUpperCase() ?? '—'}
      </p>
    </motion.div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#0a0a0f' }} />}>
      <BookContent />
    </Suspense>
  )
}

function BookContent() {
  const params = useSearchParams()
  const schoolId = params.get('school')

  const [step, setStep] = useState(0) // 0=type, 1=slot, 2=details, 3=confirmation
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedType, setSelectedType] = useState<SessionType | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [confirmationToken, setConfirmationToken] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [permitNumber, setPermitNumber] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Direction for animation
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (!schoolId) return
    async function load() {
      const res = await fetch(`/api/session-types?school_id=${schoolId}`)
      if (res.ok) setSessionTypes(await res.json())
      setLoadingTypes(false)
    }
    load()
  }, [schoolId])

  async function handleSelectType(type: SessionType) {
    setSelectedType(type)
    setDirection(1)
    setLoadingSlots(true)
    setStep(1)

    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const res = await fetch(`/api/slots?school_id=${schoolId}&session_type_id=${type.id}&start_date=${startDate}&end_date=${endDate}`)
    const data = await res.json()
    setSlots(data.slots ?? [])
    setLoadingSlots(false)
  }

  function handleSelectSlot(slot: Slot) {
    setSelectedSlot(slot)
    setDirection(1)
    setStep(2)
  }

  function handleBack() {
    setDirection(-1)
    setStep(s => s - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studentName || !studentEmail) { setFormError('Name and email are required'); return }
    if (!studentEmail.includes('@')) { setFormError('Please enter a valid email'); return }
    setFormError('')
    setSubmitting(true)

    const sessionRes = await fetch(`/api/sessions?school_id=${schoolId}`)
    const sessions = await sessionRes.json()
    const matchedSession = sessions.find(
      (s: any) => s.start_date === selectedSlot!.session_date &&
        s.start_time === selectedSlot!.start_time &&
        s.instructor_id === selectedSlot!.instructor_id
    )

    if (!matchedSession) {
      setFormError('This slot is no longer available. Please go back and select another time.')
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
        permit_number: permitNumber || undefined,
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
      const checkoutRes = await fetch(`/api/bookings/${bookData.booking_id}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookData.booking_id }),
      })
      const checkoutData = await checkoutRes.json()
      if (checkoutData.url) {
        setCheckoutUrl(checkoutData.url)
        setStep(3) // payment
      } else {
        setStep(3) // confirmation
      }
    } else {
      setStep(3)
    }

    setSubmitting(false)
  }

  if (!schoolId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">No school selected</h1>
          <p className="text-gray-400">Ask your school for their booking link.</p>
        </div>
      </div>
    )
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Header */}
      <div className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">The Driving Center</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6">
        {step < 3 && <StepIndicator current={step} />}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {step === 0 && (
              <ServiceSelection
                sessionTypes={sessionTypes}
                selectedType={selectedType}
                onSelect={handleSelectType}
                loading={loadingTypes}
              />
            )}
            {step === 1 && selectedType && (
              <DateAndTime
                selectedType={selectedType}
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={handleSelectSlot}
                loadingSlots={loadingSlots}
                schoolId={schoolId}
                onBack={handleBack}
              />
            )}
            {step === 2 && selectedType && selectedSlot && (
              <StudentDetails
                selectedType={selectedType}
                selectedSlot={selectedSlot}
                studentName={studentName} setStudentName={setStudentName}
                studentEmail={studentEmail} setStudentEmail={setStudentEmail}
                studentPhone={studentPhone} setStudentPhone={setStudentPhone}
                permitNumber={permitNumber} setPermitNumber={setPermitNumber}
                formError={formError}
                submitting={submitting}
                onSubmit={handleSubmit}
                onBack={handleBack}
              />
            )}
            {step === 3 && selectedType && selectedSlot && (
              <Confirmation
                selectedType={selectedType}
                selectedSlot={selectedSlot}
                studentName={studentName}
                studentEmail={studentEmail}
                bookingId={bookingId}
                confirmationToken={confirmationToken}
                checkoutUrl={checkoutUrl}
                step={checkoutUrl ? 'payment' : 'confirmation'}
                setStep={setStep as any}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
