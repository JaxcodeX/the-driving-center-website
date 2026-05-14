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

// Glassmorphism design standard
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

const glassInputBase = {
  background: GLASS_BG,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: `1px solid ${GLASS_BORDER}`,
  color: '#ffffff',
  outline: 'none',
  borderRadius: '999px',
  padding: '0 20px',
  fontSize: '14px',
  width: '100%' as const,
  transition: 'border-color 0.2s',
}

type SessionType = {
  id: string; name: string; description: string; duration_minutes: number
  price_cents: number; deposit_cents: number; color: string; tca_hours_credit: number | null
}
type Slot = {
  id?: string;
  session_date: string; start_time: string; end_time: string | null
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
        <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>
          Step {current + 1} of {STEPS.length} — <span className="font-semibold" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{STEP_LABELS[current]}</span>
        </span>
      </div>
      <div style={{ ...glassCard, padding: '14px 16px' }}>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: i <= current ? '100%' : '0%',
                  background: `linear-gradient(90deg, ${ACCENT}, #FF6B1E)`,
                }}
              />
            </div>
          ))}
        </div>
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
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Book a Lesson</h1>
      <p className="text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>Choose the service that fits your needs.</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={glassCard} />
          ))}
        </div>
      ) : sessionTypes.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={glassCard}>
          <CalendarIcon className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.25)' }} />
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>No services available right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessionTypes.map(type => {
            const sel = selectedType?.id === type.id
            return (
              <button key={type.id} onClick={() => onSelect(type)}
                style={{
                  ...glassCard,
                  background: sel ? ACCENT_DIM : GLASS_BG,
                  border: `1px solid ${sel ? ACCENT : GLASS_BORDER}`,
                  borderRadius: '16px',
                  padding: '20px',
                  width: '100%',
                  textAlign: 'left' as const,
                  position: 'relative' as const,
                  cursor: 'pointer',
                }}>
                {sel && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: ACCENT }}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ background: sel ? ACCENT_DIM : GLASS_BG, color: sel ? ACCENT : 'rgba(255,255,255,0.5)', border: `1px solid ${GLASS_BORDER}` }}>
                    {iconFor(type.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{type.name}</span>
                      {type.tca_hours_credit && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: ACCENT_DIM, color: ACCENT, border: `1px solid ${ACCENT}33` }}>
                          {type.tca_hours_credit}h TCA Credit
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-3" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>{type.description}</p>
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      <Clock className="w-3.5 h-3.5" />{type.duration_minutes} min
                      {type.deposit_cents > 0 && <span>· {fp(type.deposit_cents)} deposit</span>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right ml-2">
                    <div className="font-bold text-xl" style={{ fontFamily: 'Outfit, sans-serif', color: sel ? ACCENT : '#ffffff' }}>{fp(type.price_cents)}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>per session</div>
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
      <button onClick={onBack} className="text-sm mb-4 flex items-center gap-1 transition-colors hover:text-white" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{selectedType.name}</h1>
      <p className="text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>{selectedType.duration_minutes} min · {fp(selectedType.price_cents)}</p>

      {/* Calendar strip */}
      <div style={{ ...glassCard, padding: '16px', marginBottom: '20px' }}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map(({ dateStr, label, dayNum, month, isToday }) => {
            const hasSlots = !!slotsByDate[dateStr]; const sel = selectedDate === dateStr
            return (
              <button key={dateStr} onClick={() => setSelectedDate(sel ? null : dateStr)}
                className="flex-shrink-0 flex flex-col items-center rounded-2xl px-3 py-3 min-w-[64px] transition-all duration-200 cursor-pointer"
                style={{
                  background: sel ? ACCENT_DIM : GLASS_BG,
                  border: `1px solid ${sel ? ACCENT : GLASS_BORDER}`,
                  color: hasSlots ? '#ffffff' : 'rgba(255,255,255,0.3)',
                }}>
                <span className="text-xs" style={{ color: isToday ? ACCENT : undefined }}>{label}</span>
                <span className="text-lg font-bold mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{dayNum}</span>
                <span className="text-xs" style={{ opacity: 0.6 }}>{month}</span>
                {hasSlots && !sel && <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: ACCENT }} />}
              </button>
            )
          })}
        </div>
      </div>

      {loadingSlots ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 rounded-2xl animate-pulse" style={glassCard} />
          ))}
        </div>
      ) : selectedDateSlots.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={glassCard}>
          <CalendarIcon className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.25)' }} />
          <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>No available times{selectedDate ? ' on this day' : ''}.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sections.map(sec => {
            const ss = selectedDateSlots.filter(s => sectionOf(s) === sec)
            if (!ss.length) return null
            return (
              <div key={sec}>
                <div className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>{sec}</div>
                <div className="grid grid-cols-2 gap-2">
                  {ss.map((slot, i) => {
                    const sel = selectedSlot?.session_date === slot.session_date && selectedSlot?.start_time === slot.start_time && selectedSlot?.instructor_id === slot.instructor_id
                    return (
                      <button key={i} onClick={() => onSelectSlot(slot)}
                        style={{
                          ...glassCard,
                          background: sel ? ACCENT_DIM : GLASS_BG,
                          border: `1px solid ${sel ? ACCENT : GLASS_BORDER}`,
                          borderRadius: '16px',
                          padding: '12px 16px',
                          textAlign: 'left' as const,
                          cursor: 'pointer',
                          width: '100%',
                        }}>
                        <div className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: sel ? ACCENT : '#ffffff' }}>{ft(slot.start_time)}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{slot.instructor_name} · {slot.seats_available} seat{slot.seats_available !== 1 ? 's' : ''}</div>
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
  const inputBase = { ...glassInputBase, height: '52px' }
  return (
    <motion.div key="step-details" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
      <button onClick={onBack} className="text-sm mb-4 flex items-center gap-1 transition-colors hover:text-white" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Session summary */}
      <div style={{ ...glassCard, padding: '16px 20px', marginBottom: '24px' }}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{selectedType.name}</div>
            <div className="text-xs mt-0.5" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>{selectedSlot && ffd(selectedSlot.session_date)} at {selectedSlot && ft(selectedSlot.start_time)}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>with {selectedSlot.instructor_name}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif', color: ACCENT }}>{fp(selectedType.price_cents)}</div>
            {selectedType.deposit_cents > 0 && <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{fp(selectedType.deposit_cents)} deposit</div>}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Your Information</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
            <User className="w-3.5 h-3.5 inline mr-1.5" />Full Name *
          </label>
          <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Jane Smith"
            required style={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
            <Mail className="w-3.5 h-3.5 inline mr-1.5" />Email *
          </label>
          <input type="email" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} placeholder="jane@example.com"
            required style={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
            <Phone className="w-3.5 h-3.5 inline mr-1.5" />Phone
          </label>
          <input type="tel" value={studentPhone} onChange={e => setStudentPhone(e.target.value)} placeholder="(555) 867-5309"
            style={inputBase} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>
            <Hash className="w-3.5 h-3.5 inline mr-1.5" />Permit / License Number
          </label>
          <input type="text" value={permitNumber} onChange={e => setPermitNumber(e.target.value)} placeholder="Optional"
            style={inputBase} />
        </div>

        {formError && (
          <div className="rounded-2xl px-4 py-3 text-sm flex items-start gap-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{formError}
          </div>
        )}

        <button type="submit" disabled={submitting}
          style={{ background: submitting ? 'rgba(74,222,128,0.5)' : SUCCESS, color: '#000', padding: '16px 28px', borderRadius: '100px', fontWeight: '600', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '16px', marginTop: '8px', fontFamily: 'Outfit, sans-serif' }}
          className="disabled:opacity-50">
          {submitting ? '⏳ Processing...' : selectedType.deposit_cents > 0 ? `Pay ${fp(selectedType.deposit_cents)} Deposit` : 'Confirm Booking'}
        </button>

        <p className="text-center text-xs px-2" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif' }}>
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
  // Auto-redirect countdown when checkoutUrl is present
  useEffect(() => {
    if (!checkoutUrl) return
    if (!document.getElementById('checkout-redirect-style')) {
      const s = document.createElement('style')
      s.id = 'checkout-redirect-style'
      s.textContent = `@keyframes shrinkBar { from { width: 100% } to { width: 0% } }`
      document.head.appendChild(s)
    }
    const timer = setTimeout(() => { window.location.href = checkoutUrl }, 2000)
    return () => clearTimeout(timer)
  }, [checkoutUrl])

  if (checkoutUrl) {
    return (
      <motion.div key="step-payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: ACCENT_DIM }}>
          <BookOpen className="w-8 h-8" style={{ color: ACCENT }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Redirecting to secure checkout...</h1>
        <p className="mb-8" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>Complete your payment to confirm your booking.</p>
        {/* Countdown bar */}
        <div className="w-full max-w-xs mx-auto h-1 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, #FF6B1E)`, animation: 'shrinkBar 2s linear forwards' }} />
        </div>
        <a href={checkoutUrl}
          style={{ background: SUCCESS, color: '#000', padding: '16px 32px', borderRadius: '100px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}
          className="hover:opacity-90 transition-opacity">
          Pay Now <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>Or <a href={checkoutUrl} className="underline hover:text-white" style={{ color: ACCENT }}>click here if not redirected</a></p>
      </motion.div>
    )
  }
  return (
    <motion.div key="step-confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }} className="text-center">
      <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}>
        <CheckCircle className="w-10 h-10" style={{ color: SUCCESS }} />
      </motion.div>
      <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>Booking Confirmed!</h1>
      <p className="mb-1" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>You're all set for <span className="font-medium" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{selectedType.name}</span>.</p>
      {selectedSlot && <p className="mb-1" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>{ffd(selectedSlot.session_date)} at {ft(selectedSlot.start_time)}</p>}
      <p className="mb-8" style={{ color: 'rgba(255,255,255,0.3)' }}>with {selectedSlot.instructor_name}</p>

      <div style={{ ...glassCard, padding: '20px', textAlign: 'left' as const, maxWidth: '360px', margin: '0 auto 20px' }}>
        <div className="text-xs mb-3 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>Booking Summary</div>
        <div className="space-y-2.5 text-sm">
          {[
            ['Service', selectedType.name],
            ['Date', selectedSlot && fd(selectedSlot.session_date)],
            ['Time', selectedSlot && ft(selectedSlot.start_time)],
            ['Instructor', selectedSlot.instructor_name],
            ['Student', studentName],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>{k}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', color: '#ffffff' }}>{v}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2.5" style={{ borderColor: GLASS_BORDER }}>
            <span style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>Total</span>
            <span className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: ACCENT }}>{fp(selectedType.price_cents)}</span>
          </div>
        </div>
      </div>

      <div style={{ ...glassCard, padding: '16px 20px', textAlign: 'left' as const, maxWidth: '360px', margin: '0 auto' }}>
        <div className="text-xs mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>What happens next?</div>
        <ul className="space-y-2.5 text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>
          <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 shrink-0" style={{ color: SUCCESS }} />Confirmation email to <span style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{studentEmail}</span></li>
          <li className="flex items-center gap-2.5"><Clock className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />SMS reminder 48 hours before</li>
          <li className="flex items-center gap-2.5"><Clock className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />Final reminder 4 hours before</li>
        </ul>
      </div>

      <p className="text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>Confirmation #{bookingId?.slice(0, 8).toUpperCase() ?? '—'}</p>
    </motion.div>
  )
}

// ─── Confirmation Sidebar ───────────────────────────────────────────────────
function BookingSidebar({ selectedType, selectedSlot, studentName, step }: {
  selectedType: SessionType | null; selectedSlot: Slot | null; studentName: string; step: number
}) {
  return (
    <div className="hidden lg:block">
      <div style={{ ...glassCard, position: 'sticky', top: '96px', maxWidth: '340px' }}>
        <div className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.3)' }}>Booking Summary</div>

        {selectedType ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}33` }}>
                {iconFor(selectedType.name)}
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{selectedType.name}</div>
                <div className="text-xs mt-0.5" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>{selectedType.duration_minutes} min session</div>
              </div>
              <div className="ml-auto font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: ACCENT }}>{fp(selectedType.price_cents)}</div>
            </div>

            {selectedSlot && (
              <div className="rounded-xl p-3.5" style={glassCard}>
                <div className="text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Date & Time</div>
                <div className="text-sm font-medium" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{ffd(selectedSlot.session_date)}</div>
                <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>{ft(selectedSlot.start_time)}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>with {selectedSlot.instructor_name}</div>
              </div>
            )}

            {studentName && step >= 2 && (
              <div className="rounded-xl p-3.5" style={glassCard}>
                <div className="text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Student</div>
                <div className="text-sm font-medium" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>{studentName}</div>
              </div>
            )}

            {selectedType.deposit_cents > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)', border: `1px solid rgba(249,115,22,0.15)` }}>
                <Shield className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />
                <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>{fp(selectedType.deposit_cents)} deposit secures your spot</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl p-6 text-center" style={glassCard}>
            <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.3)' }}>Select a service to see your booking summary</p>
          </div>
        )}

        <div className="mt-5 pt-4 flex items-center gap-2" style={{ borderTop: `1px solid ${GLASS_BORDER}` }}>
          <Star className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />
          <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.3)' }}>Trusted by 2,400+ student drivers</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#0D0D12' }} />}>
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

  useEffect(() => { injectFonts() }, [])

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
    if (!matched) {
      // Fallback: use the session_id from the selected slot directly (skip lookup)
      const slotSessionId = selectedSlot!.id
      const bookRes = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: slotSessionId, session_date: selectedSlot!.session_date, session_time: selectedSlot!.start_time, student_name: studentName, student_email: studentEmail, student_phone: studentPhone || undefined, permit_number: permitNumber || undefined }),
      })
      const bookData = await bookRes.json()
      if (!bookRes.ok) { setFormError(bookData.error ?? 'Booking failed'); setSubmitting(false); return }
      setBookingId(bookData.booking_id)
      setStep(3)
      setSubmitting(false)
      return
    }
    const bookRes = await fetch('/api/bookings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: matched.id, student_name: studentName, student_email: studentEmail, student_phone: studentPhone || undefined, permit_number: permitNumber || undefined }),
    })
    const bookData = await bookRes.json()
    if (!bookRes.ok) { setFormError(bookData.error ?? 'Booking failed'); setSubmitting(false); return }
    setBookingId(bookData.booking_id)
    setStep(3)
    setSubmitting(false)
  }

  if (!schoolId) {
    return (
      <div className="min-h-screen flex items-center justify-center starfield relative" style={{ background: '#0D0D12', backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.06) 0%, transparent 60%)' }}>
        {/* decorative circles */}
        <div className="bg-circle w-96 h-96 -top-20 -left-20" style={{ background: `radial-gradient(circle, ${ACCENT_DIM} 0%, transparent 70%)` }} />
        <div className="bg-circle w-64 h-64 top-40 -right-10" style={{ background: 'radial-gradient(circle, rgba(112,123,255,0.1) 0%, transparent 70%)' }} />
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}33` }}>
            <Car className="w-8 h-8" style={{ color: ACCENT }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>No school selected</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)' }}>Ask your school for their booking link.</p>
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
    <div className="min-h-screen starfield relative" style={{ background: '#0D0D12', backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.06) 0%, transparent 60%)' }}>
      {/* decorative background circles */}
      <div className="bg-circle w-[500px] h-[500px] -top-40 -left-40" style={{ background: `radial-gradient(circle, ${ACCENT_DIM} 0%, transparent 70%)` }} />
      <div className="bg-circle w-[400px] h-[400px] bottom-20 -right-40" style={{ background: 'radial-gradient(circle, rgba(112,123,255,0.1) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="border-b relative z-10" style={{ borderColor: GLASS_BORDER }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${ACCENT}, #FF6B1E)` }}>DC</div>
            <span className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>The Driving Center</span>
          </Link>
        </div>
      </div>

      {/* Content: 2-column on desktop */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
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
