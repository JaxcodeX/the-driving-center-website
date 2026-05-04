'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, GraduationCap, Calendar, Car, Settings, DollarSign, Clock, Users } from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students', active: true },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions' },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors' },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar' },
  { icon: DollarSign, label: 'Billing', href: '/school-admin/billing' },
  { icon: Settings, label: 'Settings', href: '/school-admin/settings' },
]

const BG = '#0D0D12'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)'
const GLASS_BG = 'rgba(255,255,255,0.03)'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_BLUR = 'blur(24px)'
const TEXT_SECONDARY = '#9CA3AF'
const ACCENT_CYAN = '#67E8F9'
const ACCENT_GREEN = '#4ADE80'
const CARD_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
const CARD_SHADOW_HOVER = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'

export default function ImportStudentsPage() {
  const [csvText, setCsvText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [schoolId, setSchoolId] = useState<string | null>(null)

  useEffect(() => { fetch('/api/auth/session').then(r => r.json()).then(data => { if (data?.school_id) setSchoolId(data.school_id) }).catch(console.error) }, [])

  async function handleImport(e: React.FormEvent) {
    e.preventDefault()
    if (!csvText.trim()) { setError('Please paste your CSV data first'); return }
    if (!schoolId) { setError('School not found — are you logged in?'); return }
    setLoading(true); setError(''); setResult(null)
    const res = await fetch('/api/import/students', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-school-id': schoolId }, body: JSON.stringify({ csv_content: csvText }) })
    const data = await res.json(); setResult(data); setLoading(false)
  }

  const rowCount = csvText.trim() ? csvText.trim().split('\n').length - 1 : 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: BG_GRADIENT, pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, borderRight: `1px solid ${GLASS_BORDER}`, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto', zIndex: 10 }}>
        <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT_CYAN}, #818CF8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#000' }}>DC</div>
            <div><div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>Import Students</div><div style={{ fontSize: '11px', color: TEXT_SECONDARY }}>School Admin</div></div>
          </div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ icon: NavIcon, label, href }) => (
              <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', textDecoration: 'none', background: 'transparent', transition: 'background 0.15s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                <NavIcon className="w-4 h-4" style={{ color: TEXT_SECONDARY, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: TEXT_SECONDARY }}>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${GLASS_BORDER}` }}><p style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>Your Driving School</p></div>
      </aside>

      {/* Mobile nav */}
      <nav style={{ display: 'none', padding: '12px 16px', gap: '8px', overflowX: 'auto', borderBottom: `1px solid ${GLASS_BORDER}`, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, position: 'sticky', top: 0, zIndex: 20 }} className="admin-nav-pills">
        {NAV_ITEMS.map(({ icon: NavIcon, label, href }) => (
          <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: `1px solid ${GLASS_BORDER}`, transition: 'background 0.15s', flexShrink: 0 }}>
            <NavIcon className="w-3.5 h-3.5" style={{ color: TEXT_SECONDARY }} />
            <span style={{ fontSize: '12px', fontWeight: '500', color: TEXT_SECONDARY }}>{label}</span>
          </Link>
        ))}
      </nav>

      <div style={{ flex: 1, marginLeft: '220px', padding: '40px 48px', maxWidth: '720px', position: 'relative', zIndex: 1 }} className="admin-main">

        {/* Back link */}
        <div style={{ marginBottom: '24px' }}>
          <Link href="/school-admin/students" style={{ fontSize: '13px', color: TEXT_SECONDARY, textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#FFFFFF')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = TEXT_SECONDARY)}>← Back</Link>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>Import from CSV</h1>
          <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>Upload your existing student list from Excel or Google Sheets.</p>
        </div>

        {/* Instructions - glass */}
        <div style={{ padding: '16px 20px', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid rgba(103,232,249,0.2)`, borderRadius: '16px', marginBottom: '24px', boxShadow: CARD_SHADOW }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: ACCENT_CYAN, marginBottom: '8px' }}>Accepted CSV columns:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 24px', marginBottom: '8px' }}>
            {[['legal_name', '(required)'], ['dob', '(required — YYYY-MM-DD)'], ['permit_number', ''], ['parent_email', ''], ['emergency_contact_phone', ''], ['driving_hours', '']].map(([col, note]) => (
              <div key={col} style={{ fontSize: '12px', fontFamily: 'monospace' }}><span style={{ color: '#FFFFFF' }}>{col}</span><span style={{ color: TEXT_SECONDARY }}> {note}</span></div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>Export from Excel/Google Sheets as CSV. Headers must be in the first row.</div>
        </div>

        <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: TEXT_SECONDARY, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paste CSV content</label>
            <textarea value={csvText} onChange={e => setCsvText(e.target.value)} placeholder="legal_name,dob,permit_number,parent_email,driving_hours&#10;Jane Smith,2010-03-15,LM-123456,jane@parent.com,8&#10;John Doe,2009-11-22,LM-789012,john@parent.com,12" rows={12} style={{
              width: '100%', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', padding: '16px', color: '#FFFFFF', fontSize: '14px', fontFamily: 'monospace',
              outline: 'none', resize: 'vertical', boxShadow: CARD_SHADOW, transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(103,232,249,0.4)')}
            onBlur={e => (e.target.style.borderColor = GLASS_BORDER)} />
          </div>

          {error && <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.2)`, color: '#EF4444', fontSize: '14px', fontWeight: '500' }}>{error}</div>}

          {result && (
            <div style={{ padding: '16px', borderRadius: '16px', background: result.failed === 0 ? 'rgba(74,222,128,0.1)' : 'rgba(250,204,21,0.1)', border: `1px solid ${result.failed === 0 ? 'rgba(74,222,128,0.2)' : 'rgba(250,204,21,0.2)'}`, boxShadow: CARD_SHADOW }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: result.failed === 0 ? ACCENT_GREEN : '#FACC15', marginBottom: '4px' }}>
                {result.failed === 0 ? `✅ All ${result.imported} students imported` : `Imported ${result.imported} of ${result.total} rows`}{result.failed > 0 && ` — ${result.failed} failed`}
              </div>
              {result.errors && result.errors.length > 0 && (
                <div style={{ fontSize: '12px', color: TEXT_SECONDARY, fontFamily: 'monospace', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {result.errors.slice(0, 5).map((err: string, i: number) => <div key={i}>{err}</div>)}
                  {result.errors.length > 5 && <div style={{ color: TEXT_SECONDARY }}>...and {result.errors.length - 5} more errors</div>}
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading || !csvText.trim()} style={{
            width: '100%', padding: '14px', background: loading ? 'rgba(74,222,128,0.5)' : ACCENT_GREEN, border: 'none', borderRadius: '12px',
            color: '#000000', fontSize: '14px', fontWeight: '700', cursor: (loading || !csvText.trim()) ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 16px rgba(74,222,128,0.3)', transition: 'transform 0.15s, box-shadow 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => { if (!loading && csvText.trim()) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(74,222,128,0.4)' } }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)' }}>
            {loading ? 'Importing...' : `Import ${rowCount} Student${rowCount !== 1 ? 's' : ''}`}
          </button>
        </form>
      </div>

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