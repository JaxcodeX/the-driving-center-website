'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, CheckCircle } from 'lucide-react'

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
]

function formatTime(time: string): string {
  if (!time) return '09:00'
  return time
}

export default function InstructorSchedulePage() {
  const [instructorId, setInstructorId] = useState<string>('')
  const [schoolId, setSchoolId] = useState<string>('')
  const [instructorName, setInstructorName] = useState<string>('')
  const [schoolName, setSchoolName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [availability, setAvailability] = useState<Record<number, {
    active: boolean
    start_time: string
    end_time: string
  }>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const iid = params.get('instructor_id')
    const sid = params.get('school')

    if (!iid || !sid) {
      setError('Invalid schedule link. Ask your school administrator for a new link.')
      setLoading(false)
      return
    }

    setInstructorId(iid)
    setSchoolId(sid)

    const supabase = createClient()

    async function load() {
      const [{ data: instructorData }, { data: availabilityData }, { data: schoolData }] = await Promise.all([
        supabase.from('instructors').select('name, school_id').eq('id', iid).single(),
        supabase.from('instructor_availability').select('*').eq('instructor_id', iid),
        supabase.from('schools').select('name').eq('id', sid).single(),
      ])

      setInstructorName(instructorData?.name ?? 'Instructor')
      setSchoolName(schoolData?.name ?? 'Your school')

      // Initialize availability map with defaults (all disabled)
      const initState: Record<number, { active: boolean; start_time: string; end_time: string }> = {}
      DAYS.forEach(d => {
        initState[d.value] = { active: false, start_time: '09:00', end_time: '17:00' }
      })

      // Override with existing availability
      ;(availabilityData ?? []).forEach((row: any) => {
        if (initState[row.day_of_week]) {
          initState[row.day_of_week] = {
            active: row.active,
            start_time: row.start_time ?? '09:00',
            end_time: row.end_time ?? '17:00',
          }
        }
      })

      setAvailability(initState)
      setLoading(false)
    }

    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)

    const payload = DAYS.map(day => ({
      day_of_week: day.value,
      active: availability[day.value]?.active ?? false,
      start_time: availability[day.value]?.start_time ?? '09:00',
      end_time: availability[day.value]?.end_time ?? '17:00',
    }))

    const res = await fetch('/api/instructor-availability', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-school-id': schoolId,
      },
      body: JSON.stringify({ instructor_id: instructorId, availability: payload }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to save')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setSaving(false)
  }

  function toggleDay(day: number) {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day]?.active },
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading your schedule...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-red-400 text-sm text-center">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-white/10 px-6 py-5">
        <div className="max-w-lg mx-auto">
          <div className="text-xs text-cyan-400 font-medium uppercase tracking-wider mb-1">Instructor Schedule</div>
          <h1 className="text-xl font-bold">{instructorName}</h1>
          <p className="text-sm text-gray-400">{schoolName}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-6">
        {/* Instructions */}
        <div className="text-sm text-gray-400 mb-5">
          Toggle the days you&apos;re available and set your hours for each day.
          Your schedule is visible to students booking lessons.
        </div>

        {/* Day grid */}
        <div className="space-y-3">
          {DAYS.map(day => {
            const dayAvail = availability[day.value] ?? { active: false, start_time: '09:00', end_time: '17:00' }
            return (
              <div
                key={day.value}
                className={`rounded-xl border transition-all ${
                  dayAvail.active
                    ? 'bg-slate-800 border-cyan-500/30'
                    : 'bg-slate-900 border-white/8'
                }`}
              >
                {/* Day header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleDay(day.value)}
                      className={`w-10 h-6 rounded-full transition-all relative ${
                        dayAvail.active ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                      style={{ width: 40, height: 24 }}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          dayAvail.active ? 'translate-x-[22px]' : 'translate-x-1'
                        }`}
                        style={{ width: 16, height: 16 }}
                      />
                    </button>
                    <span className="text-sm font-medium text-white">{day.label}</span>
                  </div>
                  {dayAvail.active && (
                    <span className="text-xs text-cyan-400">
                      {dayAvail.start_time} – {dayAvail.end_time}
                    </span>
                  )}
                </div>

                {/* Time pickers — only when active */}
                {dayAvail.active && (
                  <div className="flex gap-3 px-4 pb-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Start</label>
                      <input
                        type="time"
                        value={dayAvail.start_time}
                        onChange={e => setAvailability(prev => ({
                          ...prev,
                          [day.value]: { ...prev[day.value], start_time: e.target.value },
                        }))}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">End</label>
                      <input
                        type="time"
                        value={dayAvail.end_time}
                        onChange={e => setAvailability(prev => ({
                          ...prev,
                          [day.value]: { ...prev[day.value], end_time: e.target.value },
                        }))}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Save button */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            'Saving...'
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Schedule
            </>
          )}
        </button>
      </div>
    </div>
  )
}
