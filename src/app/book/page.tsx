'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

type Session = {
  id: string
  start_date: string
  start_time: string
  end_time: string
  max_seats: number
  seats_booked: number
  price_cents: number
  location: string
  instructor?: { name: string }
  available: number
  cancelled?: boolean
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
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingSession, setBookingSession] = useState<Session | null>(null)
  const [studentEmail, setStudentEmail] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!schoolId) return
    async function loadSessions() {
      const res = await fetch(`/api/sessions?school_id=${schoolId}`)
      const data = await res.json()
      const upcoming = (data ?? []).filter(
        (s: Session) =>
          s.seats_booked < s.max_seats &&
          !s.cancelled &&
          new Date(`${s.start_date}T${s.start_time}`) > new Date()
      )
      setSessions(upcoming)
      setLoading(false)
    }
    loadSessions()
  }, [schoolId])

  async function handleBook(session: Session) {
    if (!studentEmail || !studentName) {
      setError('Please fill in your name and email to book.')
      return
    }
    setBooking(true)
    setError('')

    const url = new URL('/api/stripe/checkout', window.location.origin)
    url.searchParams.set('session_id', session.id)
    url.searchParams.set('school_id', schoolId!)
    url.searchParams.set('student_email', studentEmail)
    url.searchParams.set('student_name', studentName)
    if (studentPhone) url.searchParams.set('student_phone', studentPhone)

    try {
      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Checkout failed')
      const { url: checkoutUrl } = await res.json()
      window.location.href = checkoutUrl
    } catch (err: any) {
      setError(err.message)
      setBooking(false)
    }
  }

  if (!schoolId) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">No school selected</h1>
          <p className="text-gray-400">Ask your school for their booking link.</p>
        </div>
      </div>
    )
  }

  function formatDate(dateStr: string) {
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  function formatPrice(cents: number) {
    return `$${(cents / 100).toFixed(0)}`
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DC</span>
          </div>
          <span className="font-semibold">The Driving Center</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Book a Lesson</h1>
        <p className="text-gray-400 mb-8">Select an available time below.</p>

        {/* Student info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="font-semibold mb-4">Your Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="(555) 867-5309"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Sessions */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-24 mb-3" />
                <div className="h-6 bg-white/10 rounded w-32 mb-2" />
                <div className="h-4 bg-white/10 rounded w-20" />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-xl font-semibold mb-2">No available sessions</h2>
            <p className="text-gray-400">Check back soon — new sessions are added weekly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors"
              >
                <div className="text-2xl mb-2">🚗</div>
                <div className="text-sm text-cyan-400 mb-1">{formatDate(session.start_date)}</div>
                <div className="text-xl font-bold text-white mb-1">
                  {session.start_time} – {session.end_time}
                </div>
                {session.instructor?.name && (
                  <div className="text-gray-400 text-sm mb-2">with {session.instructor.name}</div>
                )}
                <div className="text-gray-500 text-sm mb-4">
                  {session.location && `${session.location} · `}
                  {session.available} seats left
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-white">
                    {formatPrice(session.price_cents)}
                  </div>
                  <button
                    onClick={() => handleBook(session)}
                    disabled={booking || !studentEmail || !studentName}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {booking ? 'Redirecting...' : 'Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  )
}
