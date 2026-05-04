'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Save, Globe, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const BG = '#0D0D12'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.06) 0%, transparent 60%)'
const GLASS_BG = 'rgba(255,255,255,0.03)'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_BLUR = 'blur(24px)'
const TEXT_SECONDARY = '#9CA3AF'
const ACCENT_GREEN = '#4ADE80'
const CARD_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'

export default function SchoolProfilePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>Loading...</p>
    </div>}>
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#FFFFFF',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: BG_GRADIENT,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 48px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '28px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '4px',
          }}>
            School Profile
          </h1>
          <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>
            Customize your public booking page.
          </p>
        </div>

        {/* Public URL preview */}
        <div style={{
          padding: '16px 20px',
          background: GLASS_BG,
          backdropFilter: GLASS_BLUR,
          WebkitBackdropFilter: GLASS_BLUR,
          border: `1px solid rgba(74,222,128,0.2)`,
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: CARD_SHADOW,
        }}>
          <div style={{
            fontSize: '11px',
            color: TEXT_SECONDARY,
            marginBottom: '6px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Your booking URL
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <code style={{
              fontSize: '13px',
              color: ACCENT_GREEN,
              flex: 1,
              fontFamily: 'monospace',
            }}>
              {typeof window !== 'undefined' ? window.location.origin : ''}/school/{slug || '[your-slug]'}
            </code>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="your-school-name"
              style={{ ...inputStyle, width: '160px' }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Tagline */}
          <div>
            <label style={labelStyle}>Tagline</label>
            <input
              value={form.tagline}
              onChange={e => handleChange('tagline', e.target.value)}
              placeholder="Build confidence. Drive safe."
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* About */}
          <div>
            <label style={labelStyle}>About Your School</label>
            <textarea
              value={form.about}
              onChange={e => handleChange('about', e.target.value)}
              placeholder="Tell students who you are, what makes your school different..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Address row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Street Address</label>
              <input
                value={form.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="123 Main St"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
                placeholder="Oak Ridge"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          </div>

          {/* State + ZIP row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>State</label>
              <input
                value={form.state}
                onChange={e => handleChange('state', e.target.value)}
                placeholder="TN"
                maxLength={2}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            <div>
              <label style={labelStyle}>ZIP</label>
              <input
                value={form.zip}
                onChange={e => handleChange('zip', e.target.value)}
                placeholder="37830"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label style={labelStyle}>
              <Mail className="w-3 h-3" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Contact Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="matt@thedrivingcenter.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#4ADE80')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Website + Facebook */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>
                <Globe className="w-3 h-3" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Website
              </label>
              <input
                value={form.website}
                onChange={e => handleChange('website', e.target.value)}
                placeholder="https://..."
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Facebook</label>
              <input
                value={form.facebook}
                onChange={e => handleChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#4ADE80')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          </div>

          {/* Saved message */}
          {saved && (
            <div style={{
              textAlign: 'center',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: ACCENT_GREEN,
              background: 'rgba(74,222,128,0.1)',
            }}>
              ✓ Profile saved
            </div>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%',
              padding: '14px',
              background: ACCENT_GREEN,
              border: 'none',
              borderRadius: '12px',
              color: '#000000',
              fontSize: '14px',
              fontWeight: '700',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              if (!saving) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)'
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}