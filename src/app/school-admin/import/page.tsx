'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const BG = '#0D0D12'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.06) 0%, transparent 60%)'
const GLASS_BG = 'rgba(255,255,255,0.03)'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_BLUR = 'blur(24px)'
const TEXT_SECONDARY = '#9CA3AF'
const ACCENT_CYAN = '#67E8F9'
const ACCENT_ORANGE = '#FF8C42'
const ACCENT_GREEN = '#4ADE80'
const CARD_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'

export default function ImportStudentsPage() {
  const [csvText, setCsvText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [schoolId, setSchoolId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => {
        if (data?.school_id) setSchoolId(data.school_id)
      })
      .catch(console.error)
  }, [])

  async function handleImport(e: React.FormEvent) {
    e.preventDefault()
    if (!csvText.trim()) {
      setError('Please paste your CSV data first')
      return
    }
    if (!schoolId) {
      setError('School not found — are you logged in?')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/import/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-school-id': schoolId,
      },
      body: JSON.stringify({ csv_content: csvText }),
    })

    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const rowCount = csvText.trim() ? csvText.trim().split('\n').length - 1 : 0

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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '24px',
          borderBottom: `1px solid ${GLASS_BORDER}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${ACCENT_CYAN}, #818CF8)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '700',
              color: '#000',
            }}>
              DC
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>Import Students</div>
              <div style={{ fontSize: '11px', color: TEXT_SECONDARY }}>School Admin</div>
            </div>
          </div>
          <Link href="/school-admin/students" style={{
            fontSize: '13px',
            color: TEXT_SECONDARY,
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#FFFFFF')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = TEXT_SECONDARY)}
          >
            ← Back
          </Link>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '24px',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '8px',
          }}>
            Import from CSV
          </h1>
          <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>
            Upload your existing student list from Excel or Google Sheets.
            All student data is encrypted before storage.
          </p>
        </div>

        {/* Instructions */}
        <div style={{
          padding: '16px 20px',
          background: GLASS_BG,
          backdropFilter: GLASS_BLUR,
          WebkitBackdropFilter: GLASS_BLUR,
          border: `1px solid rgba(103,232,249,0.2)`,
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: CARD_SHADOW,
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: ACCENT_CYAN,
            marginBottom: '8px',
          }}>
            Accepted CSV columns:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 24px', marginBottom: '8px' }}>
            {[
              ['legal_name', '(required)'],
              ['dob', '(required — YYYY-MM-DD)'],
              ['permit_number', ''],
              ['parent_email', ''],
              ['emergency_contact_phone', ''],
              ['driving_hours', ''],
            ].map(([col, note]) => (
              <div key={col} style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                <span style={{ color: '#FFFFFF' }}>{col}</span>
                <span style={{ color: TEXT_SECONDARY }}> {note}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>
            Export from Excel/Google Sheets as CSV. Headers must be in the first row.
          </div>
        </div>

        <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: TEXT_SECONDARY,
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Paste CSV content
            </label>
            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="legal_name,dob,permit_number,parent_email,driving_hours
Jane Smith,2010-03-15,LM-123456,jane@parent.com,8
John Doe,2009-11-22,LM-789012,john@parent.com,12"
              rows={12}
              style={{
                width: '100%',
                background: GLASS_BG,
                backdropFilter: GLASS_BLUR,
                WebkitBackdropFilter: GLASS_BLUR,
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: '16px',
                padding: '16px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'vertical',
                boxShadow: CARD_SHADOW,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(103,232,249,0.4)')}
              onBlur={e => (e.target.style.borderColor = GLASS_BORDER)}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(239,68,68,0.1)',
              border: `1px solid rgba(239,68,68,0.2)`,
              color: '#EF4444',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{
              padding: '16px',
              borderRadius: '16px',
              background: result.failed === 0 ? 'rgba(74,222,128,0.1)' : 'rgba(250,204,21,0.1)',
              border: `1px solid ${result.failed === 0 ? 'rgba(74,222,128,0.2)' : 'rgba(250,204,21,0.2)'}`,
              boxShadow: CARD_SHADOW,
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: result.failed === 0 ? ACCENT_GREEN : '#FACC15', marginBottom: '4px' }}>
                {result.failed === 0
                  ? `✅ All ${result.imported} students imported`
                  : `Imported ${result.imported} of ${result.total} rows`}
                {result.failed > 0 && ` — ${result.failed} failed`}
              </div>
              {result.errors && result.errors.length > 0 && (
                <div style={{
                  fontSize: '12px',
                  color: TEXT_SECONDARY,
                  fontFamily: 'monospace',
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  {result.errors.slice(0, 5).map((err: string, i: number) => (
                    <div key={i}>{err}</div>
                  ))}
                  {result.errors.length > 5 && (
                    <div style={{ color: TEXT_SECONDARY }}>...and {result.errors.length - 5} more errors</div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !csvText.trim()}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? 'rgba(74,222,128,0.5)' : ACCENT_GREEN,
              border: 'none',
              borderRadius: '12px',
              color: '#000000',
              fontSize: '14px',
              fontWeight: '700',
              cursor: (loading || !csvText.trim()) ? 'not-allowed' : 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => {
              if (!loading && csvText.trim()) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)'
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            {loading ? 'Importing...' : `Import ${rowCount} Student${rowCount !== 1 ? 's' : ''}`}
          </button>
        </form>
      </div>
    </div>
  )
}