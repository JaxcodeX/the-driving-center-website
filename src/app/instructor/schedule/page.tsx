'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UpcomingSession {
  id: string
  session_date: string
  session_time: string
  status: string
  student_name: string | null
  session_type_name: { name: string; duration_minutes: number; color: string } | null
  location: string | null
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function groupByDate(sessions: UpcomingSession[]) {
  const groups: Record<string, UpcomingSession[]> = {}
  for (const s of sessions) {
    if (!groups[s.session_date]) groups[s.session_date] = []
    groups[s.session_date].push(s)
  }
  return groups
}

export default function InstructorSchedulePage() {
  const [sessions, setSessions] = useState<UpcomingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [instructorName, setInstructorName] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/instructor/schedule')
        if (!res.ok) throw new Error('Not authorized')
        const data = await res.json()
        setSessions(data.upcoming ?? [])
        setInstructorName(data.instructor_name ?? '')
      } catch (err: any) {
        setError(err.message)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-gray-400">Loading schedule...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-400 mb-6 text-sm">{error}</p>
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 text-sm">
            Sign in →
          </Link>
        </div>
      </div>
    )
  }

  const grouped = groupByDate(sessions)
  const dates = Object.keys(grouped).sort()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <div>
              <div className="text-white font-semibold text-sm">
                {instructorName ? `${instructorName}'s Schedule` : 'My Schedule'}
              </div>
              <div className="text-gray-500 text-xs">Instructor View</div>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Upcoming Lessons</h1>
          <span className="text-sm text-gray-500">{sessions.length} upcoming</span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-lg font-semibold text-white mb-2">No upcoming lessons</h2>
            <p className="text-gray-400 text-sm">When students book with you, they'll show up here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {dates.map(date => (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-semibold text-cyan-400">
                    {formatDate(date)}
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-gray-600">
                    {grouped[date].length} lesson{grouped[date].length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Sessions for this date */}
                <div className="space-y-2">
                  {grouped[date]
                    .sort((a, b) => a.session_time.localeCompare(b.session_time))
                    .map(session => (
                      <div
                        key={session.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4"
                      >
                        {/* Color dot */}
                        <div
                          className="w-2 h-10 rounded-full shrink-0"
                          style={{ backgroundColor: session.session_type_name?.color ?? '#06b6d4' }}
                        />

                        {/* Time */}
                        <div className="w-14 shrink-0">
                          <div className="text-sm font-semibold text-white">
                            {session.session_time.substring(0, 5)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.session_type_name?.duration_minutes ?? '--'}m
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-sm truncate">
                            {session.student_name ?? 'Student'}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {session.session_type_name?.name ?? 'Lesson'}
                            {session.location ? ` · ${session.location}` : ''}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="shrink-0">
                          <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            Confirmed
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
