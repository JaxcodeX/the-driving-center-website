'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DEFAULT_WINDOWS: Record<number, { start: string; end: string }> = {
  1: { start: '08:00', end: '17:00' },
  2: { start: '08:00', end: '17:00' },
  3: { start: '08:00', end: '17:00' },
  4: { start: '08:00', end: '17:00' },
  5: { start: '08:00', end: '17:00' },
}

export default function InstructorAvailabilityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <AvailabilityContent />
    </Suspense>
  )
}

function AvailabilityContent() {
  const params = useSearchParams()
  const schoolId = params.get('school_id')
  const [instructors, setInstructors] = useState<any[]>([])
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null)
  const [windows, setWindows] = useState<Record<number, { start: string; end: string; enabled: boolean }>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!schoolId) return
    async function load() {
      const res = await fetch(`/api/instructors?school_id=${schoolId}`)
      const data = await res.json()
      setInstructors(data)

      const availRes = await fetch(`/api/instructor-availability?instructor_id=${data[0]?.id}`)
      const availData = await availRes.json()

      // Index by day_of_week
      const byDay: Record<number, any> = {}
      for (const w of availData) {
        byDay[w.day_of_week] = { start: w.start_time.slice(0, 5), end: w.end_time.slice(0, 5), enabled: true }
      }
      setWindows(byDay)
      setSelectedInstructor(data[0])
    }
    load()
  }, [schoolId])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedInstructor) return
    setSaving(true)
    setSaved(false)

    const payload = Object.entries(windows)
      .filter(([, v]) => v.enabled)
      .map(([day, v]) => ({
        instructor_id: selectedInstructor.id,
        day_of_week: parseInt(day),
        start_time: v.start + ':00',
        end_time: v.end + ':00',
      }))

    await fetch('/api/instructor-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId! },
      body: JSON.stringify({ availability: payload }),
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold">Instructor Availability</span>
          </div>
          <Link href="/school-admin" className="text-sm text-gray-400 hover:text-white">← Back</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">Set Weekly Hours</h1>

        {instructors.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Instructor</label>
            <div className="flex gap-2 flex-wrap">
              {instructors.map(inst => (
                <button
                  key={inst.id}
                  onClick={() => {
                    setSelectedInstructor(inst)
                    setWindows({})
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedInstructor?.id === inst.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {inst.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3">
          {[1, 2, 3, 4, 5].map(day => (
            <div key={day} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={windows[day]?.enabled ?? false}
                    onChange={e => {
                      setWindows(prev => ({
                        ...prev,
                        [day]: {
                          start: prev[day]?.start ?? DEFAULT_WINDOWS[day].start,
                          end: prev[day]?.end ?? DEFAULT_WINDOWS[day].end,
                          enabled: e.target.checked,
                        },
                      }))
                    }}
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                  <span className="font-medium text-white">{DAYS[day]}</span>
                </label>
              </div>

              {(windows[day]?.enabled ?? false) && (
                <div className="flex items-center gap-3 ml-7">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">From</span>
                    <input
                      type="time"
                      value={windows[day]?.start ?? '08:00'}
                      onChange={e => {
                        setWindows(prev => ({
                          ...prev,
                          [day]: { ...prev[day], start: e.target.value, enabled: true },
                        }))
                      }}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">to</span>
                    <input
                      type="time"
                      value={windows[day]?.end ?? '17:00'}
                      onChange={e => {
                        setWindows(prev => ({
                          ...prev,
                          [day]: { ...prev[day], end: e.target.value, enabled: true },
                        }))
                      }}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-2">
            {saved && (
              <div className="text-center text-green-400 text-sm mb-3">✓ Availability saved</div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Availability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
