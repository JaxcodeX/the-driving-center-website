'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

function ConfirmationContent() {
  const params = useSearchParams()
  const token = params.get('token')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('No booking token provided.')
      setLoading(false)
      return
    }
    fetch(`/api/bookings/${token}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || data.status === 'pending') {
          setError('Your booking is still pending payment. Complete payment to confirm.')
        } else {
          setBooking(data)
        }
      })
      .catch(() => setError('Could not load booking details.'))
      .finally(() => setLoading(false))
  }, [token])

  function handleAddToCalendar() {
    if (!booking?.session) return
    const start_date = booking.session?.start_date ?? booking.session_date
    const start_time = booking.session_time
    const start = new Date(`${start_date}T${start_time}:00`)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:${booking.session.session_type?.name ?? 'Driving Lesson'} — ${booking.session.school?.name ?? ''}`,
      `DESCRIPTION:Your driving lesson. Booked via The Driving Center.`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'driving-lesson.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-gray-400">Loading booking...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-white mb-3">Pending Payment</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const { session, student_name, student_email, session_time } = booking
  const { session_type, instructor, school, start_date, location } = session
  const start_time = session_time

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-white mb-2">Lesson Booked!</h1>
        <p className="text-gray-400 mb-6">
          Hi {student_name.split(' ')[0]} — you're all set for your lesson.
        </p>

        {/* Booking details card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: session_type?.color ?? '#06b6d4' }}
            />
            <span className="font-bold text-white text-lg">{session_type?.name ?? 'Driving Lesson'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 text-sm">
            <span>📅</span>
            <span>{formatDate(start_date)}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 text-sm">
            <span>🕐</span>
            <span>{formatTime(start_time)}</span>
          </div>
          {location && (
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <span>📍</span>
              <span>{location}</span>
            </div>
          )}
          {instructor?.name && (
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <span>👤</span>
              <span>with {instructor.name}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-gray-300 text-sm">
            <span>🏫</span>
            <span>{school?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300 text-sm">
            <span>✉️</span>
            <span>{student_email}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-8">
          You'll get an SMS reminder 72 hours before your lesson.
          Reply C to confirm or R to reschedule.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleAddToCalendar}
            className="w-full bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-lg hover:bg-white/15 transition-colors"
          >
            📅 Add to Calendar
          </button>
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-center"
          >
            Back to Home →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <ConfirmationContent />
    </Suspense>
  )
}
