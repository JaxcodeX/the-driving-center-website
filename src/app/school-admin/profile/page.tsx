'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SchoolProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <ProfileContent />
    </Suspense>
  )
}

function ProfileContent() {
  const params = useSearchParams()
  const schoolId = params.get('school_id')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    tagline: '',
    about: '',
    address: '',
    city: '',
    zip: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    state: '',
  })
  const [slug, setSlug] = useState('')

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/schools/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId! },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold">School Profile</span>
          </div>
          <Link href="/school-admin" className="text-sm text-gray-400 hover:text-white">← Back</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Your Public Page</h1>
          <p className="text-gray-400 text-sm mt-1">
            This is what students see when they visit your booking page.
          </p>
        </div>

        {/* Public URL preview */}
        <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-4 mb-6">
          <div className="text-xs text-gray-500 mb-1">Your booking URL</div>
          <div className="flex items-center gap-2">
            <code className="text-cyan-400 text-sm flex-1">
              {typeof window !== 'undefined' ? window.location.origin : ''}/school/{slug || '[your-slug]'}
            </code>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="your-school-name"
              className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-sm w-40 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tagline</label>
            <input
              value={form.tagline}
              onChange={e => handleChange('tagline', e.target.value)}
              placeholder="Build confidence. Drive safe."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">About Your School</label>
            <textarea
              value={form.about}
              onChange={e => handleChange('about', e.target.value)}
              placeholder="Tell students who you are, what makes your school different..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-y"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Street Address</label>
              <input
                value={form.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="123 Main St"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">City</label>
              <input
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
                placeholder="Oak Ridge"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">State</label>
              <input
                value={form.state}
                onChange={e => handleChange('state', e.target.value)}
                placeholder="TN"
                maxLength={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">ZIP</label>
              <input
                value={form.zip}
                onChange={e => handleChange('zip', e.target.value)}
                placeholder="37830"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="matt@thedrivingcenter.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Website</label>
              <input
                value={form.website}
                onChange={e => handleChange('website', e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Facebook</label>
              <input
                value={form.facebook}
                onChange={e => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {saved && (
            <div className="text-center text-green-400 text-sm py-2">✓ Profile saved</div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
