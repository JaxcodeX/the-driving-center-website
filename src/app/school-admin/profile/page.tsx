'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Save, Globe, Mail, LayoutDashboard, GraduationCap, Calendar, Car, Settings, DollarSign, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students' },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions' },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors' },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar' },
  { icon: DollarSign, label: 'Billing', href: '/school-admin/billing' },
  { icon: Settings, label: 'Settings', href: '/school-admin/settings', active: true },
]

const BG = '#0D0D12'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)'
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
  const [form, setForm] = useState({ tagline: '', about: '', address: '', city: '', zip: '', email: '', website: '', facebook: '', instagram: '', state: '' })
  const [slug, setSlug] = useState('')

  function handleChange(field: string, value: string) { setForm(prev => ({ ...prev, [field]: value })); setSaved(false) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch(`/api/schools/${slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId! }, body: JSON.stringify(form) })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#FFFFFF', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: '600', color: TEXT_SECONDARY, marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: BG_GRADIENT, pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, borderRight: `1px solid ${GLASS_BORDER}`, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto', zIndex: 10 }}>
        <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT_GREEN}, #67E8F9)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car className="w-4 h-4" style={{ color: '#000' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.2 }}>Driving Center</div>
              <div style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>School Admin</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
              <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', textDecoration: 'none', background: active ? 'rgba(255,255,255,0.06)' : 'transparent', borderLeft: active ? `3px solid ${ACCENT_GREEN}` : '3px solid transparent', boxShadow: active ? `0 0 12px rgba(74,222,128,0.3)` : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <NavIcon className="w-4 h-4" style={{ color: active ? ACCENT_GREEN : TEXT_SECONDARY, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: active ? '600' : '500', color: active ? '#FFFFFF' : TEXT_SECONDARY }}>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${GLASS_BORDER}` }}><p style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>Your Driving School</p></div>
      </aside>

      {/* Mobile nav */}
      <nav style={{ display: 'none', padding: '12px 16px', gap: '8px', overflowX: 'auto', borderBottom: `1px solid ${GLASS_BORDER}`, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, position: 'sticky', top: 0, zIndex: 20 }} className="admin-nav-pills">
        {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
          <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px', textDecoration: 'none', background: active ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? ACCENT_GREEN : GLASS_BORDER}`, transition: 'background 0.15s', flexShrink: 0 }}>
            <NavIcon className="w-3.5 h-3.5" style={{ color: active ? ACCENT_GREEN : TEXT_SECONDARY }} />
            <span style={{ fontSize: '12px', fontWeight: active ? '600' : '500', color: active ? ACCENT_GREEN : TEXT_SECONDARY }}>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '220px', padding: '40px 48px', maxWidth: '720px', position: 'relative', zIndex: 1 }} className="admin-main">

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px', letterSpacing: '-0.01em' }}>School Profile</h1>
          <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>Customize your public booking page.</p>
        </div>

        {/* Public URL preview - glass */}
        <div style={{ padding: '16px 20px', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid rgba(74,222,128,0.2)`, borderRadius: '16px', marginBottom: '24px', boxShadow: CARD_SHADOW }}>
          <div style={{ fontSize: '11px', color: TEXT_SECONDARY, marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your booking URL</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <code style={{ fontSize: '13px', color: ACCENT_GREEN, flex: 1, fontFamily: 'monospace' }}>{typeof window !== 'undefined' ? window.location.origin : ''}/school/{slug || '[your-slug]'}</code>
            <input type="text" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="your-school-name" style={{ ...inputStyle, width: '160px' }} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Tagline</label>
            <input value={form.tagline} onChange={e => handleChange('tagline', e.target.value)} placeholder="Build confidence. Drive safe." style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
          </div>
          <div>
            <label style={labelStyle}>About Your School</label>
            <textarea value={form.about} onChange={e => handleChange('about', e.target.value)} placeholder="Tell students who you are, what makes your school different..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div><label style={labelStyle}>Street Address</label><input value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="123 Main St" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} /></div>
            <div><label style={labelStyle}>City</label><input value={form.city} onChange={e => handleChange('city', e.target.value)} placeholder="Oak Ridge" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={labelStyle}>State</label><input value={form.state} onChange={e => handleChange('state', e.target.value)} placeholder="TN" maxLength={2} style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} /></div>
            <div><label style={labelStyle}>ZIP</label><input value={form.zip} onChange={e => handleChange('zip', e.target.value)} placeholder="37830" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} /></div>
          </div>
          <div><label style={labelStyle}><Mail className="w-3 h-3" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Contact Email</label><input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="matt@thedrivingcenter.com" style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><label style={labelStyle}><Globe className="w-3 h-3" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Website</label><input value={form.website} onChange={e => handleChange('website', e.target.value)} placeholder="https://..." style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} /></div>
            <div><label style={labelStyle}>Facebook</label><input value={form.facebook} onChange={e => handleChange('facebook', e.target.value)} placeholder="https://facebook.com/..." style={inputStyle} onFocus={e => (e.target.style.borderColor = '#4ADE80')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')} /></div>
          </div>
          {saved && <div style={{ textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: ACCENT_GREEN, background: 'rgba(74,222,128,0.1)' }}>✓ Profile saved</div>}
          <button type="submit" disabled={saving} style={{ width: '100%', padding: '14px', background: ACCENT_GREEN, border: 'none', borderRadius: '12px', color: '#000000', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={e => { if (!saving) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)' } }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </main>

      <style>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          .admin-main { margin-left: 0 !important; padding: 24px 16px !important; }
          .admin-nav-pills { display: flex !important; }
        }
        @media (min-width: 769px) { .admin-nav-pills { display: none !important; } }
      `}</style>
    </div>
  )
}