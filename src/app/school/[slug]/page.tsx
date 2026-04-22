'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(0)}`
}

function formatDuration(minutes: number) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }
  return `${minutes}m`
}

export default function SchoolPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <SchoolContent />
    </Suspense>
  )
}

function SchoolContent() {
  const params = useSearchParams()
  const slug = params.get('slug') ?? params.get('school')
  const [school, setSchool] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    async function load() {
      try {
        const res = await fetch(`/api/schools/${slug}`)
        if (!res.ok) throw new Error('School not found')
        const data = await res.json()
        setSchool(data)
      } catch (err: any) {
        setError(err.message)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (!slug) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏎️</div>
          <h1 className="text-2xl font-bold text-white mb-2">School not found</h1>
          <p className="text-gray-400">No school with that URL exists.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">School not found</h1>
          <p className="text-gray-400">This school doesn't exist or their page is not set up yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">DC</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{school.school.name}</h1>
          {school.profile?.tagline && (
            <p className="text-gray-400 mb-1">{school.profile.tagline}</p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-3">
            {school.profile?.city && (
              <span>📍 {school.profile.city}, {school.school.state}</span>
            )}
            {school.school.phone && (
              <a href={`tel:${school.school.phone}`} className="text-cyan-400 hover:text-cyan-300">
                📞 {school.school.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        {/* About */}
        {school.profile?.about && (
          <section>
            <h2 className="text-xl font-bold text-white mb-3">About Us</h2>
            <p className="text-gray-400 leading-relaxed">{school.profile.about}</p>
          </section>
        )}

        {/* Lesson Types */}
        {school.session_types && school.session_types.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Lessons & Services</h2>
            <div className="grid gap-4">
              {school.session_types.map((type: any) => (
                <div
                  key={type.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color ?? '#06b6d4' }} />
                      <span className="font-semibold text-white">{type.name}</span>
                      {type.tca_hours_credit && (
                        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                          {type.tca_hours_credit}h TCA credit
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="font-bold text-white text-lg">{formatPrice(type.price_cents)}</div>
                      {type.deposit_cents > 0 && (
                        <div className="text-xs text-gray-500">{formatPrice(type.deposit_cents)} deposit</div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{type.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">⏱ {formatDuration(type.duration_minutes)}</span>
                    <Link
                      href={`/book?school=${slug}&type=${type.id}`}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Book Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            {school.profile?.address && (
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>📍</span>
                <span>{school.profile.address}, {school.profile.city} {school.profile.zip}</span>
              </div>
            )}
            {school.school.phone && (
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>📞</span>
                <a href={`tel:${school.school.phone}`} className="text-cyan-400 hover:text-cyan-300">
                  {school.school.phone}
                </a>
              </div>
            )}
            {school.profile?.email && (
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>✉️</span>
                <a href={`mailto:${school.profile.email}`} className="text-cyan-400 hover:text-cyan-300">
                  {school.profile.email}
                </a>
              </div>
            )}
            {school.profile?.facebook && (
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>📘</span>
                <a href={school.profile.facebook} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                  Facebook
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Book CTA */}
        <section className="text-center py-4">
          <div className="text-3xl mb-3">🚗</div>
          <h2 className="text-xl font-bold text-white mb-2">Ready to book?</h2>
          <p className="text-gray-400 text-sm mb-5">Schedule your lesson online in minutes.</p>
          <Link
            href={`/book?school=${slug}`}
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
          >
            Book a Lesson →
          </Link>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-600 pt-4 border-t border-white/5">
          Powered by <span className="text-gray-500">The Driving Center SaaS</span>
        </footer>
      </div>
    </div>
  )
}
