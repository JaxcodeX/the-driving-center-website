'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Upload, FileText, Download, ChevronLeft, Check, AlertCircle, X, Loader2, Eye, EyeOff, ArrowUp } from 'lucide-react'

// ── Design tokens ──────────────────────────────────────────────────────────
const BG = 'var(--admin-bg, #000000)'
const SURFACE = 'var(--bg-surface, #0F0F0F)'
const ELEVATED = 'var(--bg-elevated, #141414)'
const BORDER = 'var(--border)'
const TEXT_SECONDARY = 'var(--text-secondary, #9CA3AF)'
const TEXT_MUTED = 'var(--text-muted, #6B7280)'
const ACCENT = 'var(--accent, #1A56FF)'
const ACCENT_GREEN = '#4ADE80'
const DANGER = '#EF4444'
const WARNING = '#F59E0B'
const CARD_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'

// ── CSV Parsing (client-side) ──────────────────────────────────────────────

interface ParsedRow {
  student_name: string
  student_email: string
  student_phone: string
  permit_number: string
  dob: string
  parent_email: string
}

function parseCSVPreview(csvText: string): { headers: string[]; rows: Record<string, string>[]; errors: string[] } {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return { headers: [], rows: [], errors: ['CSV must have at least a header row and one data row'] }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
  const rows: Record<string, string>[] = []
  const errors: string[] = []

  const expected = ['student_name', 'student_email', 'student_phone', 'permit_number', 'dob', 'parent_email']

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === 0) continue

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || '').trim().replace(/^["']|["']$/g, '')
    })

    // Map common headers
    const mapped: Record<string, string> = {}
    let hasData = false

    const aliasMap: Record<string, string[]> = {
      student_name: ['student_name', 'name', 'full_name', 'legal_name', 'studentname', 'fullname'],
      student_email: ['student_email', 'email', 'studentemail'],
      student_phone: ['student_phone', 'phone', 'studentphone', 'contact_phone'],
      permit_number: ['permit_number', 'permit', 'permitnumber', 'license', 'license_number'],
      dob: ['dob', 'date_of_birth', 'birth_date', 'birthdate'],
      parent_email: ['parent_email', 'parentemail', 'parent email', 'guardian_email'],
    }

    for (const [canonical, aliases] of Object.entries(aliasMap)) {
      const key = Object.keys(row).find(k => aliases.includes(k))
      if (key && row[key]) {
        mapped[canonical] = row[key]
        hasData = true
      } else {
        mapped[canonical] = ''
      }
    }

    if (hasData) {
      rows.push(mapped)
    }

    // Per-row validation
    if (mapped.student_name && !mapped.dob) {
      errors.push(`Row ${i + 1}: Missing DOB — will be skipped`)
    }
    if (!mapped.student_name && !mapped.student_email) {
      errors.push(`Row ${i + 1}: No name or email — will be skipped`)
    }
  }

  return { headers, rows, errors }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// ── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', color: TEXT_SECONDARY, fontWeight: '500' }}>
          Importing... {current} of {total}
        </span>
        <span style={{ fontSize: '13px', fontWeight: '700', color: ACCENT_GREEN }}>{pct}%</span>
      </div>
      <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: '999px',
            background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_GREEN})`,
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>
    </div>
  )
}

// ── Import Page ────────────────────────────────────────────────────────────

export default function ImportStudentsPage() {
  const [mode, setMode] = useState<'select' | 'preview' | 'importing' | 'done'>('select')
  const [inputMethod, setInputMethod] = useState<'paste' | 'upload'>('upload')
  const [csvText, setCsvText] = useState('')
  const [parsed, setParsed] = useState<{ headers: string[]; rows: Record<string, string>[]; errors: string[] } | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please select a .csv file')
      return
    }
    setError('')
    const text = await readFileAsText(file)
    setCsvText(text)
    const p = parseCSVPreview(text)
    setParsed(p)
    if (p.rows.length > 0) {
      setMode('preview')
    } else {
      setError(p.errors[0] || 'No valid rows found in the CSV')
    }
  }, [])

  async function handlePasteSubmit() {
    if (!csvText.trim()) { setError('Please paste your CSV data'); return }
    setError('')
    const p = parseCSVPreview(csvText)
    setParsed(p)
    if (p.rows.length > 0) {
      setMode('preview')
    } else {
      setError(p.errors[0] || 'No valid rows found')
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }
  function onDragLeave() { setDragOver(false) }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleImport() {
    if (!parsed || parsed.rows.length === 0) return
    setLoading(true)
    setMode('importing')
    setProgress({ current: 0, total: parsed.rows.length })
    setError('')

    // Build CSV string from preview data
    const csvContent = ['student_name,student_email,student_phone,permit_number,dob,parent_email']
    for (const row of parsed.rows) {
      const vals = [row.student_name, row.student_email, row.student_phone, row.permit_number, row.dob, row.parent_email]
        .map(v => v.includes(',') ? `"${v}"` : v)
      csvContent.push(vals.join(','))
    }

    try {
      const res = await fetch('/api/import/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv_content: csvContent.join('\n') }),
      })
      const data = await res.json()

      setProgress({ current: data.imported + data.failed, total: data.total })
      setResult(data)
      setMode('done')
    } catch (err: any) {
      setError(err.message || 'Import failed')
      setMode('preview')
    }
    setLoading(false)
  }

  function reset() {
    setMode('select')
    setCsvText('')
    setParsed(null)
    setResult(null)
    setError('')
    setProgress({ current: 0, total: 0 })
  }

  const validCount = parsed?.rows.filter(r => r.student_name && r.dob).length ?? 0
  const warningCount = parsed?.rows.filter(r => !r.student_name || !r.dob).length ?? 0
  const rowCount = parsed?.rows.length ?? 0

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)',
    border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px',
    color: '#FFFFFF', fontSize: '14px', fontFamily: 'monospace',
    outline: 'none', resize: 'vertical', transition: 'border-color 0.2s',
    boxShadow: CARD_SHADOW,
  }

  return (
    <div className="admin-main-inner">
      {/* Back link */}
      <div style={{ marginBottom: '24px' }}>
        <Link href="/school-admin" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', color: TEXT_SECONDARY, textDecoration: 'none', fontWeight: '500',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#FFFFFF')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = TEXT_SECONDARY)}>
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Import from CSV
        </h1>
        <p style={{ fontSize: '14px', color: TEXT_SECONDARY, lineHeight: 1.6 }}>
          Upload a CSV file or paste data to import students into your school. We'll detect duplicates by date of birth.
        </p>
      </div>

      {/* Instructions card */}
      <div style={{
        background: SURFACE, border: `1px solid rgba(74,222,128,0.15)`, borderRadius: '16px',
        padding: '20px', marginBottom: '24px', boxShadow: CARD_SHADOW, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Download className="w-4 h-4" style={{ color: ACCENT_GREEN }} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>Expected CSV columns</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', marginBottom: '12px' }}>
          {[
            { col: 'student_name', note: '(required)', desc: 'Full name of student' },
            { col: 'student_email', note: '', desc: 'Student email' },
            { col: 'student_phone', note: '', desc: 'Student phone number' },
            { col: 'permit_number', note: '', desc: 'Learner permit #' },
            { col: 'dob', note: '(required — YYYY-MM-DD)', desc: 'Date of birth' },
            { col: 'parent_email', note: '', desc: 'Parent/guardian email' },
          ].map(({ col, note, desc }) => (
            <div key={col} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '10px 12px' }}>
              <div style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: '600', color: '#FFFFFF', marginBottom: '2px' }}>
                {col} <span style={{ color: TEXT_SECONDARY, fontWeight: '400', fontSize: '11px' }}>{note}</span>
              </div>
              <div style={{ fontSize: '11px', color: TEXT_MUTED }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>
          Headers can also use: <code style={{ fontFamily: 'monospace', color: TEXT_MUTED }}>name, email, phone, permit, date_of_birth</code>
        </div>
      </div>

      {/* ── SELECT MODE ── */}
      {mode === 'select' && (
        <>
          {/* Toggle: Upload vs Paste */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              onClick={() => setInputMethod('upload')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '999px', border: 'none',
                background: inputMethod === 'upload' ? ACCENT_GREEN : 'rgba(255,255,255,0.04)',
                color: inputMethod === 'upload' ? '#000' : TEXT_SECONDARY,
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <Upload className="w-4 h-4" /> Upload File
            </button>
            <button
              onClick={() => setInputMethod('paste')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '999px', border: 'none',
                background: inputMethod === 'paste' ? ACCENT_GREEN : 'rgba(255,255,255,0.04)',
                color: inputMethod === 'paste' ? '#000' : TEXT_SECONDARY,
                fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <FileText className="w-4 h-4" /> Paste Text
            </button>
          </div>

          {/* Upload zone */}
          {inputMethod === 'upload' && (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? ACCENT_GREEN : BORDER}`,
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {dragOver ? (
                  <ArrowUp className="w-6 h-6" style={{ color: ACCENT_GREEN }} />
                ) : (
                  <Upload className="w-6 h-6" style={{ color: ACCENT_GREEN }} />
                )}
              </div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                {dragOver ? 'Drop your CSV file here' : 'Upload a CSV file'}
              </p>
              <p style={{ fontSize: '13px', color: TEXT_SECONDARY }}>
                Drag and drop, or click to browse
              </p>
              <div style={{ marginTop: '16px', display: 'inline-flex', gap: '4px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: '11px', color: TEXT_MUTED, fontFamily: 'monospace' }}>.csv</span>
              </div>
            </div>
          )}

          {/* Paste text area */}
          {inputMethod === 'paste' && (
            <div>
              <textarea
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                placeholder={`student_name,student_email,student_phone,permit_number,dob,parent_email\nJane Smith,,,LM-123456,2010-03-15,jane@parent.com\nJohn Doe,john@student.com,,,2009-11-22,`}
                rows={10}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(74,222,128,0.4)')}
                onBlur={e => (e.target.style.borderColor = BORDER)}
              />

              {csvText.trim() && (
                <div style={{ marginTop: '12px', fontSize: '13px', color: TEXT_SECONDARY }}>
                  <span style={{ fontWeight: '600', color: '#FFFFFF' }}>{csvText.trim().split('\n').length - 1}</span> rows detected
                </div>
              )}

              <button
                onClick={handlePasteSubmit}
                disabled={!csvText.trim()}
                style={{
                  marginTop: '16px', width: '100%', padding: '14px', background: csvText.trim() ? ACCENT_GREEN : 'rgba(255,255,255,0.06)',
                  border: 'none', borderRadius: '12px', color: csvText.trim() ? '#000' : TEXT_MUTED,
                  fontSize: '14px', fontWeight: '700', cursor: csvText.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.15s',
                }}
              >
                <Eye className="w-4 h-4" /> Preview Data
              </button>
            </div>
          )}
        </>
      )}

      {/* ── PREVIEW MODE ── */}
      {mode === 'preview' && parsed && (
        <>
          {/* Summary bar */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: SURFACE, borderRadius: '12px', padding: '14px 18px', border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
              <div style={{ fontSize: '11px', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Rows</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>{parsed.rows.length}</div>
            </div>
            <div style={{ background: SURFACE, borderRadius: '12px', padding: '14px 18px', border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
              <div style={{ fontSize: '11px', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Valid (will import)</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: ACCENT_GREEN, fontFamily: 'Outfit, sans-serif' }}>{validCount}</div>
            </div>
            <div style={{ background: SURFACE, borderRadius: '12px', padding: '14px 18px', border: `1px solid ${BORDER}`, boxShadow: CARD_SHADOW }}>
              <div style={{ fontSize: '11px', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Missing Required</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: warningCount > 0 ? WARNING : TEXT_MUTED, fontFamily: 'Outfit, sans-serif' }}>{warningCount}</div>
            </div>
          </div>

          {/* Warnings */}
          {parsed.errors.length > 0 && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <AlertCircle className="w-4 h-4" style={{ color: WARNING }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: WARNING }}>Validation Warnings</span>
              </div>
              <div style={{ fontSize: '12px', color: TEXT_SECONDARY, fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {parsed.errors.slice(0, 10).map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
                {parsed.errors.length > 10 && (
                  <div style={{ color: TEXT_MUTED }}>...and {parsed.errors.length - 10} more warnings</div>
                )}
              </div>
            </div>
          )}

          {/* Preview table */}
          <div style={{
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '12px',
            overflow: 'hidden', marginBottom: '20px', boxShadow: CARD_SHADOW,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: TEXT_MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>#</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: TEXT_MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Name</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: TEXT_MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Email</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: TEXT_MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Phone</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: TEXT_MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Permit</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: TEXT_MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>DOB</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: TEXT_MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Parent Email</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: TEXT_MUTED, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.slice(0, 20).map((row, i) => {
                    const valid = row.student_name && row.dob
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${BORDER}`, opacity: valid ? 1 : 0.4 }}>
                        <td style={{ padding: '10px 16px', color: TEXT_MUTED, fontSize: '12px' }}>{i + 1}</td>
                        <td style={{ padding: '10px 16px', color: '#FFFFFF', fontWeight: '500' }}>{row.student_name || <span style={{ color: TEXT_MUTED, fontStyle: 'italic' }}>missing</span>}</td>
                        <td style={{ padding: '10px 16px', color: TEXT_SECONDARY }}>{row.student_email || '—'}</td>
                        <td style={{ padding: '10px 16px', color: TEXT_SECONDARY, fontFamily: 'monospace' }}>{row.student_phone || '—'}</td>
                        <td style={{ padding: '10px 16px', color: TEXT_SECONDARY, fontFamily: 'monospace' }}>{row.permit_number || '—'}</td>
                        <td style={{ padding: '10px 16px', color: '#FFFFFF', fontFamily: 'monospace' }}>{row.dob || <span style={{ color: DANGER }}>missing</span>}</td>
                        <td style={{ padding: '10px 16px', color: TEXT_SECONDARY }}>{row.parent_email || '—'}</td>
                        <td style={{ padding: '10px 16px' }}>
                          {valid ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: ACCENT_GREEN }}>
                              <Check className="w-3 h-3" /> OK
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: DANGER }}>
                              <X className="w-3 h-3" /> Skip
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {parsed.rows.length > 20 && (
              <div style={{ padding: '12px 16px', textAlign: 'center', borderTop: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: '12px', color: TEXT_SECONDARY }}>Showing first 20 of {parsed.rows.length} rows</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={reset}
              style={{
                padding: '14px 24px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`,
                borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleImport}
              style={{
                flex: 1, padding: '14px 24px', background: ACCENT_GREEN, border: 'none', borderRadius: '12px',
                color: '#000', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 0 16px rgba(74,222,128,0.3)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(74,222,128,0.4)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(74,222,128,0.3)' }}
            >
              Import {validCount} Student{validCount !== 1 ? 's' : ''} <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* ── IMPORTING MODE ── */}
      {mode === 'importing' && (
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '16px',
          padding: '40px', textAlign: 'center', boxShadow: CARD_SHADOW,
        }}>
          <Loader2 className="w-10 h-10" style={{ color: ACCENT_GREEN, margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <ProgressBar current={progress.current} total={progress.total} />
          <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>
            Processing student records... Please wait.
          </p>
        </div>
      )}

      {/* ── DONE MODE ── */}
      {mode === 'done' && result && (
        <div style={{
          background: SURFACE, border: `1px solid ${result.failed === 0 ? 'rgba(74,222,128,0.2)' : 'rgba(245,158,11,0.2)'}`,
          borderRadius: '16px', padding: '32px', boxShadow: CARD_SHADOW, textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: result.failed === 0 ? 'rgba(74,222,128,0.12)' : 'rgba(245,158,11,0.12)',
            border: `1px solid ${result.failed === 0 ? 'rgba(74,222,128,0.25)' : 'rgba(245,158,11,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          }}>
            {result.failed === 0 ? (
              <Check className="w-8 h-8" style={{ color: ACCENT_GREEN }} />
            ) : (
              <AlertCircle className="w-8 h-8" style={{ color: WARNING }} />
            )}
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
            {result.failed === 0 ? 'Import Complete' : 'Import Completed with Warnings'}
          </h2>
          <p style={{ fontSize: '14px', color: TEXT_SECONDARY, marginBottom: '24px' }}>
            Processed {result.total} rows
          </p>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: '11px', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Imported</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: ACCENT_GREEN, fontFamily: 'Outfit, sans-serif' }}>{result.imported}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: '11px', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{result.skipped > 0 ? 'Updated' : 'Skipped'}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: WARNING, fontFamily: 'Outfit, sans-serif' }}>{result.skipped || 0}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: '11px', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Failed</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: result.failed > 0 ? DANGER : ACCENT_GREEN, fontFamily: 'Outfit, sans-serif' }}>{result.failed}</div>
            </div>
          </div>

          {/* Error details */}
          {result.errors && result.errors.length > 0 && (
            <div style={{ marginBottom: '24px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: `1px solid rgba(239,68,68,0.15)`, textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: DANGER, marginBottom: '8px' }}>Import Errors</div>
              <div style={{ fontSize: '12px', color: TEXT_SECONDARY, fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {result.errors.slice(0, 10).map((err: string, i: number) => (
                  <div key={i}>{err}</div>
                ))}
                {result.errors.length > 10 && (
                  <div style={{ color: TEXT_MUTED }}>...and {result.errors.length - 10} more errors</div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={reset}
            style={{
              padding: '14px 24px', background: ACCENT_GREEN, border: 'none', borderRadius: '12px',
              color: '#000', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 0 16px rgba(74,222,128,0.3)', transition: 'all 0.15s',
            }}
          >
            Import Another File
          </button>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div style={{
          marginTop: '16px', padding: '12px 16px', borderRadius: '12px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <AlertCircle className="w-4 h-4" style={{ color: DANGER, flexShrink: 0 }} />
          <span style={{ fontSize: '14px', fontWeight: '500', color: DANGER }}>{error}</span>
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: DANGER, cursor: 'pointer' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
