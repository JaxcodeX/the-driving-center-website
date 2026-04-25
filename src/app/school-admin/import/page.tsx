'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ImportStudentsPage() {
  const [csvText, setCsvText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [schoolId, setSchoolId] = useState<string | null>(null)

  // Get school_id from session on mount
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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">DC</div>
            <span className="font-semibold">Import Students</span>
          </div>
          <Link href="/school-admin/students" className="text-sm text-gray-400 hover:text-white">← Back</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Import from CSV</h1>
          <p className="text-gray-400 text-sm">
            Upload your existing student list from Excel or Google Sheets.
            All student data is encrypted before storage.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 mb-6">
          <div className="text-sm font-medium text-cyan-400 mb-2">Accepted CSV columns:</div>
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-400 font-mono">
            <div><span className="text-white">legal_name</span> (required)</div>
            <div><span className="text-white">dob</span> (required — YYYY-MM-DD)</div>
            <div><span className="text-white">permit_number</span></div>
            <div><span className="text-white">parent_email</span></div>
            <div><span className="text-white">emergency_contact_phone</span></div>
            <div><span className="text-white">driving_hours</span></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Export from Excel/Google Sheets as CSV. Headers must be in the first row.
          </div>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Paste CSV content</label>
            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="legal_name,dob,permit_number,parent_email,driving_hours
Jane Smith,2010-03-15,LM-123456,jane@parent.com,8
John Doe,2009-11-22,LM-789012,john@parent.com,12"
              rows={12}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-y"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className={`rounded-xl p-4 border ${
              result.failed === 0
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-yellow-500/10 border-yellow-500/20'
            }`}>
              <div className="text-sm font-medium mb-1">
                {result.failed === 0
                  ? `✅ All ${result.imported} students imported`
                  : `Imported ${result.imported} of ${result.total} rows`}
                {result.failed > 0 && ` — ${result.failed} failed`}
              </div>
              {result.errors && result.errors.length > 0 && (
                <div className="text-xs text-gray-400 font-mono mt-2 space-y-1">
                  {result.errors.slice(0, 5).map((err: string, i: number) => (
                    <div key={i}>{err}</div>
                  ))}
                  {result.errors.length > 5 && (
                    <div className="text-gray-600">...and {result.errors.length - 5} more errors</div>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !csvText.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Importing...' : `Import ${rowCount} Student${rowCount !== 1 ? 's' : ''}`}
          </button>
        </form>
      </div>
    </div>
  )
}