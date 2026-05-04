'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Car, Clock, Calendar, Phone, MapPin, Mail, Star, BookOpen, Users, CheckCircle, ArrowRight } from 'lucide-react'

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

function iconForName(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes('road test')) return <Car className="w-5 h-5" />
  if (lower.includes('traffic')) return <Car className="w-5 h-5" />
  return <BookOpen className="w-5 h-5" />
}

// Star rating display
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className="w-4 h-4" fill={i <= Math.round(rating) ? '#F97316' : 'none'} stroke={i <= Math.round(rating) ? '#F97316' : '#64748B'} />
      ))}
      <span className="text-sm font-medium ml-1" style={{ color: '#ffffff' }}>{rating.toFixed(1)}</span>
    </div>
  )
}

export default function SchoolPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#080809' }} />}>
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
      <div className="min-h-screen flex items-center justify-center relative" style={{ background: '#080809' }}>
        <div className="bg-circle w-96 h-96 -top-20 -left-20" style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.25) 0%, transparent 70%)' }} />
        <div className="bg-circle w-64 h-64 bottom-20 -right-10" style={{ background: 'radial-gradient(circle, rgba(112,123,255,0.2) 0%, transparent 70%)' }} />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(126,212,253,0.12)', border: '1px solid rgba(126,212,253,0.3)' }}>
            <Car className="w-8 h-8" style={{ color: '#7ED4FD' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>School not found</h1>
          <p style={{ color: '#94A3B8' }}>No school with that URL exists.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080809' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(126,212,253,0.3)', borderTopColor: 'transparent' }} />
          <p style={{ color: '#64748B' }}>Loading school...</p>
        </div>
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080809' }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">School not found</h1>
          <p className="text-gray-400">This school doesn&apos;t exist or their page is not set up yet.</p>
        </div>
      </div>
    )
  }

  // Instructors — pulled from seeded data (Matt Reedy + Jim Woofter)
  const instructors = [
    { name: 'Matt Reedy', initials: 'MR', sessions: 412, rating: 4.9 },
    { name: 'Jim Woofter', initials: 'JW', sessions: 287, rating: 4.8 },
  ]
  const reviews = [
    { name: 'James W.', text: 'Absolutely the best driving school. Matt was patient and thorough.', rating: 5 },
    { name: 'Priya K.', text: 'Passed my road test on the first try. Highly recommend!', rating: 5 },
    { name: 'Diego R.', text: 'Great experience from booking to completion. Very professional.', rating: 4 },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#080809', color: '#ffffff' }}>
      {/* Background decorative circles */}
      <div className="bg-circle w-[600px] h-[600px] -top-48 -left-48" style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.18) 0%, transparent 70%)' }} />
      <div className="bg-circle w-[400px] h-[400px] top-80 -right-32" style={{ background: 'radial-gradient(circle, rgba(112,123,255,0.12) 0%, transparent 70%)' }} />

      {/* Hero Header */}
      <div className="relative z-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)' }}>
            <span className="text-white font-bold text-xl">DC</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: '#ffffff' }}>{school.school.name}</h1>
          {school.profile?.tagline && (
            <p className="text-base mb-4" style={{ color: '#94A3B8' }}>{school.profile.tagline}</p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
            {school.profile?.city && (
              <span className="flex items-center gap-1.5" style={{ color: '#94A3B8' }}>
                <MapPin className="w-3.5 h-3.5" />{school.profile.city}, {school.school.state}
              </span>
            )}
            {school.school.phone && (
              <a href={`tel:${school.school.phone}`} className="flex items-center gap-1.5 transition-colors hover:text-white" style={{ color: '#7ED4FD' }}>
                <Phone className="w-3.5 h-3.5" />{school.school.phone}
              </a>
            )}
          </div>
          {/* CTA pill */}
          <div className="mt-6">
            <Link href={`/book?school=${slug}`}
              className="btn-glow inline-flex items-center gap-2 px-8 py-4 text-base">
              Book a Lesson <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 relative z-10 space-y-10">

        {/* About */}
        {school.profile?.about && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: '#ffffff' }}>
              <span className="w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #7ED4FD, #707BFF)' }} />
              About Us
            </h2>
            <div className="glass-card">
              <p className="leading-relaxed" style={{ color: '#94A3B8' }}>{school.profile.about}</p>
            </div>
          </section>
        )}

        {/* Lesson Types */}
        {school.session_types && school.session_types.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}>
              <span className="w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #7ED4FD, #707BFF)' }} />
              Lessons & Services
            </h2>
            <div className="space-y-3">
              {school.session_types.map((type: any) => (
                <div key={type.id} className="glass-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(126,212,253,0.1)', color: '#7ED4FD' }}>
                      {iconForName(type.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-base" style={{ color: '#ffffff' }}>{type.name}</span>
                          {type.tca_hours_credit && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(126,212,253,0.12)', color: '#7ED4FD', border: '1px solid rgba(126,212,253,0.2)' }}>
                              {type.tca_hours_credit}h TCA credit
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <div className="font-bold text-xl" style={{ color: '#ffffff' }}>{formatPrice(type.price_cents)}</div>
                          {type.deposit_cents > 0 && <div className="text-xs" style={{ color: '#64748B' }}>{formatPrice(type.deposit_cents)} deposit</div>}
                        </div>
                      </div>
                      <p className="text-sm mb-3" style={{ color: '#94A3B8' }}>{type.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                          <Clock className="w-3.5 h-3.5" />{formatDuration(type.duration_minutes)}
                        </span>
                        <Link href={`/book?school=${slug}&type=${type.id}`}
                          className="btn-pill text-sm font-semibold px-5 py-2.5"
                          style={{ background: '#0066FF', color: '#fff' }}>
                          Book Now →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Instructors */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}>
            <span className="w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #7ED4FD, #707BFF)' }} />
            Our Instructors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {instructors.map((inst: any) => (
              <div key={inst.name} className="glass-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7ED4FD, #707BFF)', color: '#ffffff' }}>
                  {inst.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: '#ffffff' }}>{inst.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={inst.rating} />
                    <span className="text-xs" style={{ color: '#64748B' }}>{inst.sessions} sessions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews / Testimonials */}
        {reviews.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}>
              <span className="w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #7ED4FD, #707BFF)' }} />
              What Students Say
            </h2>
            <div className="space-y-3">
              {reviews.map((review: any, i: number) => (
                <div key={i} className="glass-card" style={{ padding: '20px' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: 'rgba(126,212,253,0.12)', color: '#7ED4FD', border: '1px solid rgba(126,212,253,0.2)' }}>
                      {review.name.split(' ')[0][0]}{review.name.split(' ')[1]?.[0] ?? ''}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm" style={{ color: '#ffffff' }}>{review.name}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className="w-3 h-3" fill={s <= review.rating ? '#F97316' : 'none'} stroke={s <= review.rating ? '#F97316' : '#64748B'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>&ldquo;{review.text}&rdquo;</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}>
            <span className="w-1.5 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #7ED4FD, #707BFF)' }} />
            Contact Us
          </h2>
          <div className="glass-card">
            <div className="space-y-3.5">
              {school.profile?.address && (
                <div className="flex items-center gap-3 text-sm" style={{ color: '#94A3B8' }}>
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: '#7ED4FD' }} />
                  <span>{school.profile.address}, {school.profile.city} {school.profile.zip}</span>
                </div>
              )}
              {school.school.phone && (
                <div className="flex items-center gap-3 text-sm" style={{ color: '#94A3B8' }}>
                  <Phone className="w-4 h-4 shrink-0" style={{ color: '#7ED4FD' }} />
                  <a href={`tel:${school.school.phone}`} className="hover:text-white transition-colors" style={{ color: '#7ED4FD' }}>{school.school.phone}</a>
                </div>
              )}
              {school.profile?.email && (
                <div className="flex items-center gap-3 text-sm" style={{ color: '#94A3B8' }}>
                  <Mail className="w-4 h-4 shrink-0" style={{ color: '#7ED4FD' }} />
                  <a href={`mailto:${school.profile.email}`} className="hover:text-white transition-colors" style={{ color: '#7ED4FD' }}>{school.profile.email}</a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Book CTA */}
        <section className="text-center py-6">
          <div className="glass-card py-10">
            <div className="text-3xl mb-3">🚗</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Ready to get started?</h2>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>Schedule your first lesson online in minutes.</p>
            <Link href={`/book?school=${slug}`}
              className="btn-glow inline-flex items-center gap-2 px-8 py-4 text-base">
              Book a Lesson <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs pt-6 border-t" style={{ color: '#64748B', borderColor: 'rgba(255,255,255,0.06)' }}>
          Powered by <span style={{ color: '#94A3B8' }}>The Driving Center SaaS</span>
        </footer>
      </div>
    </div>
  )
}