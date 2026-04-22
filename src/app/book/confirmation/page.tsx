'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConfirmationContent() {
  const params = useSearchParams()
  const date = params.get('date')
  const time = params.get('time')
  const location = params.get('location') ?? 'the school'

  function handleAddToCalendar() {
    const start = new Date(`${date}T${time}:00`)
    const end = new Date(start.getTime() + 60 * 60 * 1000)

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:Driving Lesson`,
      `DESCRIPTION:Your driving lesson at ${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'driving-lesson.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-white mb-2">Lesson Booked!</h1>
        <p className="text-gray-400 mb-6">
          Your lesson is scheduled for{' '}
          <span className="text-cyan-400">
            {date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'your selected date'}
          </span>{' '}
          at <span className="text-cyan-400">{time}</span>.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          You&apos;ll receive a confirmation email with details.
          SMS reminders will be sent 72h and 24h before your lesson.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleAddToCalendar}
            className="w-full bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-lg hover:bg-white/15 transition-colors"
          >
            📅 Add to Calendar
          </button>
          <Link
            href="/dashboard"
            className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-center"
          >
            Go to Dashboard →
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
