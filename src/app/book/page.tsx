'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car, Clock, BookOpen, CheckCircle, Calendar as CalendarIcon,
  ChevronLeft, User, Mail, Phone, Hash, AlertCircle, GraduationCap, Route,
  Star, Shield, ArrowRight
} from 'lucide-react'

type SessionType = {
  id: string; name: string; description: string; duration_minutes: number
  price_cents: number; deposit_cents: number; color: string; tca_hours_credit: number | null
}
type Slot = {
  session_date: string; start_time: string; end_time: string
  instructor_id: string; instructor_name: string; seats_available: number
}

const STEPS = ['type', 'slot', 'details', 'confirmation']
const STEP_LABELS = ['Service', 'Date & Time', 'Your Info', 'Confirm']

function fp(cents: number) { return `$${(cents / 100).toFixed(0)}` }
function ft(time: string) {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}
function ffd(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
function fd(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
function iconFor(name: string) {
  if (name.toLowerCase().includes('traffic')) return <Car className="w-5 h-5" />
  if (name.toLowerCase().includes('road test')) return <Route className="w-5 h-5" />
  return <GraduationCap className="w-5 h-5" />
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Step {current + 1} of {STEPS.length} — <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{STEP_LABELS[current]}</span>
        </span>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: i <= current ? '100%' : '0%',
                background: 'linear-gradient(90deg, #7ED4FD, #707BFF)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── STEP 1: Service Selection ─────────────────────────────────────────────
function ServiceSelection({ sessionTypes, selectedType, onSelect, loading }: {
  sessionTypes: SessionType[]; selectedType: SessionType | null
  onSelect: (t: SessionType) => void; loading: boolean
}) {
  return (
    <motion.div key="step-type" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Book a Lesson</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Choose the service that fits your needs.</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }} />
          ))}
        </div>
      ) : sessionTypes.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <CalendarIcon className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No services available right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessionTypes.map(type => {
            const sel = selectedType?.id === type.id
            return (
              <button key={type.id} onClick={() => onSelect(type)}
                className="glass-card w-full text-left relative group cursor-pointer"
                style={{
                  background: sel ? 'var(--accent-dim)' : 'var(--card-bg)',
                  border: `1px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                {sel && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--accent)' }}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ background: sel ? 'var(--accent-dim)' : 'var(--card-bg)', color: sel ? 'var(--accent)' : 'var(--text-secondary)' }}>
                    {iconFor(type.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{type.name}</span>
                      {type.tca_hours_credit && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(126,212,253,0.2)' }}>
                          {type.tca_hours_credit}h TCA Credit
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{type.description}</p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock className="w-3.5 h-3.5" />{type.duration_minutes} min
                      {type.deposit_cents > 0 && <span>· {fp(type.deposit_cents)} deposit</span>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right ml-2">
                    <div className="font-bold text-xl" style={{ color: sel ? 'var(--accent)' : 'var(--text-primary)' }}>{fp(type.price_cents)}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>per session</div>
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
function DateAndTime({ selectedType, slots, selectedSlot, onSelectSlot, loadingSlots, onBack }: {
  selectedType: SessionType; slots: Slot[]; selectedSlot: Slot | null
  onSelectSlot: (s: Slot) => void; loadingSlots: boolean; onBack: () => void
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return { dateStr: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short' }), dayNum: d.getDate(), month: d.toLocaleDateString('en-US', { month: 'short' }), isToday: i === 0 }
  })
  const slotsByDate: Record<string, Slot[]> = {}
  for (const slot of slots) { if (!slotsByDate[slot.session_date]) slotsByDate[slot.session_date] = []; slotsByDate[slot.session_date].push(slot) }
  const selectedDateSlots = selectedDate ? slotsByDate[selectedDate] ?? [] : Object.values(slotsByDate).flat()
  function sectionOf(slot: Slot) { const h = parseInt(slot.start_time.split(':')[0]); return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening' }
  const sections = ['Morning', 'Afternoon', 'Evening']

  return (
    <motion.div key="step-slot" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
      <button onClick={onBack} className="text-sm mb-4 flex items-center gap-1 transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{selectedType.name}</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{selectedType.duration_minutes} min · {fp(selectedType.price_cents)}</p>

      {/* Calendar strip */}
      <div className="glass-card mb-5" style={{ padding: '16px' }}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map(({ dateStr, label, dayNum, month, isToday }) => {
            const hasSlots = !!slotsByDate[dateStr]; const sel = selectedDate === dateStr
            return (
              <button key={dateStr} onClick={() => setSelectedDate(sel ? null : dateStr)}
                className="flex-shrink-0 flex flex-col items-center rounded-2xl px-3 py-3 min-w-[64px] transition-all duration-200 cursor-pointer"
                style={{
                  background: sel ? 'var(--accent-dim)' : hasSlots ? 'var(--card-bg)' : 'var(--card-bg)',
                  border: `1px solid ${sel ? 'var(--accent)' : hasSlots ? 'var(--border)' : 'var(--border)'}`,
                  color: hasSlots ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>
                <span className="text-xs" style={{ color: isToday ? 'var(--accent)' : undefined }}>{label}</span>
                <span className="text-lg font-bold mt-0.5">{dayNum}</span>
                <span className="text-xs" style={{ opacity: 0.6 }}>{month}</span>
                {hasSlots && !sel && <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: 'var(--accent)' }} />}
              </button>
            )
          })}
        </div>
      </div>

      {loadingSlots ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }} />
          ))}
        </div>
      ) : selectedDateSlots.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <CalendarIcon className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No available times{selectedDate ? ' on this day' : ''}.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sections.map(sec => {
            const ss = selectedDateSlots.filter(s => sectionOf(s) === sec)
            if (!ss.length) return null
            return (
              <div key={sec}>
                <div className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{sec}</div>
                <div className="grid grid-cols-2 gap-2">
                  {ss.map((slot, i) => {
                    const sel = selectedSlot?.session_date === slot.session_date && selectedSlot?.start_time === slot.start_time && selectedSlot?.instructor_id === slot.instructor_id
                    return (
                      <button key={i} onClick={() => onSelectSlot(slot)}
                        className="glass-card py-3 px-4 text-left cursor-pointer"
                        style={{
                          background: sel ? 'var(--accent-dim)' : 'var(--card-bg)',
                          border: `1px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                        }}>
                        <div className="font-semibold text-sm" style={{ color: sel ? 'var(--accent)' : 'var(--text-primary)' }}>{ft(slot.start_time)}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{slot.instructor_name} · {slot.seats_available} seat{slot.seats_available !== 1 ? 's' : ''}</div>
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
function StudentDetails({ selectedType, selectedSlot, studentName, setStudentName, studentEmail, setStudentEmail, studentPhone, setStudentPhone, permitNumber, setPermitNumber, formError, submitting, onSubmit, onBack }: {
  selectedType: SessionType; selectedSlot: Slot
  studentName: string; setStudentName: (v: string) => void
  studentEmail: string; setStudentEmail: (v: string) => void
  studentPhone: string; setStudentPhone: (v: string) => void
  permitNumber: string; setPermitNumber: (v: string) => void
  formError: string; submitting: boolean; onSubmit: (e: React.FormEvent) => void; onBack: () => void
}) {
  return (
    <motion.div key="step-details" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
      <button onClick={onBack} className="text-sm mb-4 flex items-center gap-1 transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Session summary */}
      <div className="glass-card mb-6" style={{ padding: '16px 20px' }}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{selectedType.name}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{selectedSlot && ffd(selectedSlot.session_date)} at {selectedSlot && ft(selectedSlot.start_time)}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>with {selectedSlot.instructor_name}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-lg" style={{ color: 'var(--accent)' }}>{fp(selectedType.price_cents)}</div>
            {selectedType.deposit_cents > 0 && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{fp(selectedType.deposit_cents)} deposit</div>}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Your Information</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            <User className="w-3.5 h-3.5 inline mr-1.5" />Full Name *
          </label>
          <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Jane Smith"
            required className="input-pill" style={{ height: '52px', width: '100%' }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            <Mail className="w-3.5 h-3.5 inline mr-1.5" />Email *
          </label>
          <input type="email" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} placeholder="jane@example.com"
            required className="input-pill" style={{ height: '52px', width: '100%' }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            <Phone className="w-3.5 h-3.5 inline mr-1.5" />Phone
          </label>
          <input type="tel" value={studentPhone} onChange={e => setStudentPhone(e.target.value)} placeholder="(555) 867-5309"
            className="input-pill" style={{ height: '52px', width: '100%' }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            <Hash className="w-3.5 h-3.5 inline mr-1.5" />Permit / License Number
          </label>
          <input type="text" value={permitNumber} onChange={e => setPermitNumber(e.target.value)} placeholder="Optional"
            className="input-pill" style={{ height: '52px', width: '100%' }} />
        </div>

        {formError && (
          <div className="rounded-2xl px-4 py-3 text-sm flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--accent-secondary)' }}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{formError}
          </div>
        )}

        <button type="submit" disabled={submitting}
          className="btn-glow w-full justify-center text-base py-4 mt-2 disabled:opacity-50"
          style={{ padding: '16px 28px' }}>
          {submitting ? 'Processing...' : selectedType.deposit_cents > 0 ? `Pay ${fp(selectedType.deposit_cents)} Deposit` : 'Confirm Booking'}
        </button>

        <p className="text-center text-xs px-2" style={{ color: 'var(--text-muted)' }}>
          By booking, you agree to our cancellation policy.
          {selectedType.deposit_cents > 0 ? ` Your ${fp(selectedType.deposit_cents)} deposit is credited toward your total.` : ' You will receive a confirmation email.'}
        </p>
      </form>
    </motion.div>
  )
}

// ─── STEP 4: Confirmation ────────────────────────────────────────────────────
function Confirmation({ selectedType, selectedSlot, studentName, studentEmail, bookingId, checkoutUrl }: {
  selectedType: SessionType; selectedSlot: Slot; studentName: string; studentEmail: string
  bookingId: string | null; checkoutUrl: string | null
}) {
  if (checkoutUrl) {
    return (
      <motion.div key="step-payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-dim)' }}>
          <BookOpen className="w-8 h-8" style={{ color: 'var(--accent)' }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Secure Checkout</h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Complete your payment to confirm your booking.</p>
        <a href={checkoutUrl}
          className="btn-glow inline-flex items-center gap-2 px-8 py-4">
          Pay Now <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    )
  }
  return (
    <motion.div key="step-confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }} className="text-center">
      <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: 'rgba(74,222,128,0.12)' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}>
        <CheckCircle className="w-10 h-10" style={{ color: 'var(--success)' }} />
      </motion.div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Booking Confirmed!</h1>
      <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>You're all set for <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{selectedType.name}</span>.</p>
      {selectedSlot && <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>{ffd(selectedSlot.session_date)} at {ft(selectedSlot.start_time)}</p>}
      <p className="mb-8" style={{ color: 'var(--text-muted)' }}>with {selectedSlot.instructor_name}</p>

      <div className="glass-card text-left mb-5" style={{ maxWidth: '360px', margin: '0 auto 20px' }}>
        <div className="text-xs mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Booking Summary</div>
        <div className="space-y-2.5 text-sm">
          {[
            ['Service', selectedType.name],
            ['Date', selectedSlot && fd(selectedSlot.session_date)],
            ['Time', selectedSlot && ft(selectedSlot.start_time)],
            ['Instructor', selectedSlot.instructor_name],
            ['Student', studentName],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
              <span style={{ color: 'var(--text-primary)' }}>{v}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2.5" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total</span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>{fp(selectedType.price_cents)}</span>
          </div>
        </div>
      </div>

      <div className="glass-card text-left" style={{ maxWidth: '360px', margin: '0 auto', padding: '16px 20px' }}>
        <div className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>What happens next?</div>
        <ul className="space-y-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--success)' }} />Confirmation email to <span style={{ color: 'var(--text-primary)' }}>{studentEmail}</span></li>
          <li className="flex items-center gap-2.5"><Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />SMS reminder 48 hours before</li>
          <li className="flex items-center gap-2.5"><Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />Final reminder 4 hours before</li>
        </ul>
      </div>

      <p className="text-xs mt-6" style={{ color: 'var(--text-muted)' }}>Confirmation #{bookingId?.slice(0, 8).toUpperCase() ?? '—'}</p>
    </motion.div>
  )
}

// ─── Confirmation Sidebar ───────────────────────────────────────────────────
function BookingSidebar({ selectedType, selectedSlot, studentName, step }: {
  selectedType: SessionType | null; selectedSlot: Slot | null; studentName: string; step: number
}) {
  return (
    <div className="hidden lg:block">
      <div className="glass-card sticky top-24">
        <div className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Booking Summary</div>

        {selectedType ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-dim)' }}>
                {iconFor(selectedType.name)}
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{selectedType.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{selectedType.duration_minutes} min session</div>
              </div>
              <div className="ml-auto font-bold" style={{ color: 'var(--accent)' }}>{fp(selectedType.price_cents)}</div>
            </div>

            {selectedSlot && (
              <div className="rounded-xl p-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <div className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Date & Time</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ffd(selectedSlot.session_date)}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ft(selectedSlot.start_time)}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>with {selectedSlot.instructor_name}</div>
              </div>
            )}

            {studentName && step >= 2 && (
              <div className="rounded-xl p-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                <div className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Student</div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{studentName}</div>
              </div>
            )}

            {selectedType.deposit_cents > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <Shield className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-secondary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{fp(selectedType.deposit_cents)} deposit secures your spot</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a service to see your booking summary</p>
          </div>
        )}

        <div className="mt-5 pt-4 flex items-center gap-2" style={{ borderTop: '1px solid var(--border)' }}>
          <Star className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-secondary)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Trusted by 2,400+ student drivers</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--bg-base)' }} />}>
      <BookContent />
    </Suspense>
  )
}

function BookContent() {
  const params = useSearchParams()
  const schoolId = params.get('school')
  const [step, setStep] = useState(0)
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedType, setSelectedType] = useState<SessionType | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [permitNumber, setPermitNumber] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
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
    setSelectedType(type); setDirection(1); setLoadingSlots(true); setStep(1)
    const startDate = new Date().toISOString().split('T')[0]
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const res = await fetch(`/api/slots?school_id=${schoolId}&session_type_id=${type.id}&start_date=${startDate}&end_date=${endDate}`)
    const data = await res.json()
    setSlots(data.slots ?? []); setLoadingSlots(false)
  }
  function handleSelectSlot(slot: Slot) { setSelectedSlot(slot); setDirection(1); setStep(2) }
  function handleBack() { setDirection(-1); setStep(s => s - 1) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studentName || !studentEmail) { setFormError('Name and email are required'); return }
    if (!studentEmail.includes('@')) { setFormError('Please enter a valid email'); return }
    setFormError(''); setSubmitting(true)
    const sessionRes = await fetch(`/api/sessions?school_id=${schoolId}`)
    const sessions = await sessionRes.json()
    const matched = sessions.find((s: any) =>
      s.start_date === selectedSlot!.session_date &&
      s.instructor_id === selectedSlot!.instructor_id
    )
    if (!matched) { setFormError('This slot is no longer available. Please go back and select another time.'); setSubmitting(false); return }
    const bookRes = await fetch('/api/bookings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: matched.id, student_name: studentName, student_email: studentEmail, student_phone: studentPhone || undefined, permit_number: permitNumber || undefined }),
    })
    const bookData = await bookRes.json()
    if (!bookRes.ok) { setFormError(bookData.error ?? 'Booking failed'); setSubmitting(false); return }
    setBookingId(bookData.booking_id)
    if (bookData.status === 'pending_payment' && selectedType!.deposit_cents > 0) {
      const cr = await fetch(`/api/bookings/${bookData.booking_id}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ booking_id: bookData.booking_id }) })
      const cd = await cr.json()
      if (cd.url) { setCheckoutUrl(cd.url); setStep(3) } else setStep(3)
    } else setStep(3)
    setSubmitting(false)
  }

  if (!schoolId) {
    return (
      <div className="min-h-screen flex items-center justify-center starfield relative" style={{ background: 'var(--bg-base)' }}>
        {/* decorative circles */}
        <div className="bg-circle w-96 h-96 -top-20 -left-20" style={{ background: 'var(--accent)' }} />
        <div className="bg-circle w-64 h-64 top-40 -right-10" style={{ background: 'var(--accent-secondary)' }} />
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-dim)', border: '1px solid rgba(126,212,253,0.3)' }}>
            <Car className="w-8 h-8" style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No school selected</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ask your school for their booking link.</p>
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
    <div className="min-h-screen starfield relative" style={{ background: 'var(--bg-base)' }}>
      {/* decorative background circles */}
      <div className="bg-circle w-[500px] h-[500px] -top-40 -left-40" style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.3) 0%, transparent 70%)' }} />
      <div className="bg-circle w-[400px] h-[400px] bottom-20 -right-40" style={{ background: 'radial-gradient(circle, rgba(112,123,255,0.2) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="border-b relative z-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)' }}>DC</div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>The Driving Center</span>
          </Link>
        </div>
      </div>

      {/* Content: 2-column on desktop */}
      <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        <div className="flex gap-8 items-start">
          {/* Left: form */}
          <div className="flex-1 min-w-0">
            {step < 3 && <StepIndicator current={step} />}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={step} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}>
                {step === 0 && <ServiceSelection sessionTypes={sessionTypes} selectedType={selectedType} onSelect={handleSelectType} loading={loadingTypes} />}
                {step === 1 && selectedType && <DateAndTime selectedType={selectedType} slots={slots} selectedSlot={selectedSlot} onSelectSlot={handleSelectSlot} loadingSlots={loadingSlots} onBack={handleBack} />}
                {step === 2 && selectedType && selectedSlot && <StudentDetails selectedType={selectedType} selectedSlot={selectedSlot} studentName={studentName} setStudentName={setStudentName} studentEmail={studentEmail} setStudentEmail={setStudentEmail} studentPhone={studentPhone} setStudentPhone={setStudentPhone} permitNumber={permitNumber} setPermitNumber={setPermitNumber} formError={formError} submitting={submitting} onSubmit={handleSubmit} onBack={handleBack} />}
                {step === 3 && selectedType && selectedSlot && <Confirmation selectedType={selectedType} selectedSlot={selectedSlot} studentName={studentName} studentEmail={studentEmail} bookingId={bookingId} checkoutUrl={checkoutUrl} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: confirmation sidebar */}
          <BookingSidebar selectedType={selectedType} selectedSlot={selectedSlot} studentName={studentName} step={step} />
        </div>
      </div>
    </div>
  )
}