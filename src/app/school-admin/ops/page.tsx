'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function OpsPage() {
  const [tab, setTab] = useState<'vercel' | 'db' | 'stripe'>('vercel')
  const [vercelData, setVercelData] = useState<any>(null)
  const [dbData, setDbData] = useState<any>(null)
  const [stripeData, setStripeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setMessage('')
    try {
      if (tab === 'vercel') {
        const res = await fetch('/api/ops/deploy')
        const data = await res.json()
        setVercelData(data)
      } else if (tab === 'db') {
        const res = await fetch('/api/ops/db')
        const data = await res.json()
        setDbData(data)
      } else if (tab === 'stripe') {
        const res = await fetch('/api/ops/stripe')
        const data = await res.json()
        setStripeData(data)
      }
    } catch (e: any) {
      setMessage(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function dbAction(action: string) {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/ops/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage(`Done: deleted ${data.deleted} records`)
      } else {
        setMessage(`Error: ${data.error}`)
      }
      await loadData()
    } catch (e: any) {
      setMessage(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">⚡ Ops Panel</h1>
            <p className="text-gray-500 text-sm">Control Supabase, Stripe, and Vercel from one place</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Vercel deploy status</div>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-400">Live</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['vercel', 'db', 'stripe'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); if (!vercelData || !dbData || !stripeData) loadData() }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {t === 'vercel' ? '▲ Vercel' : t === 'db' ? '⚡ Supabase' : '💳 Stripe'}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
            {message}
          </div>
        )}

        {/* Vercel Tab */}
        {tab === 'vercel' && (
          <div className="space-y-4">
            {vercelData?.deployments?.length > 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <h2 className="text-sm font-semibold text-gray-300">Recent Deployments</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-left">
                      <th className="px-4 py-2 font-medium">Status</th>
                      <th className="px-4 py-2 font-medium">When</th>
                      <th className="px-4 py-2 font-medium">Commit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vercelData.deployments.map((d: any) => (
                      <tr key={d.uid} className="border-t border-white/5">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                            d.state === 'READY' ? 'bg-green-500/10 text-green-400' :
                            d.state === 'ERROR' ? 'bg-red-500/10 text-red-400' :
                            'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              d.state === 'READY' ? 'bg-green-400' :
                              d.state === 'ERROR' ? 'bg-red-400' : 'bg-yellow-400'
                            }`} />
                            {d.state}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {new Date(d.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                          {d.meta?.githubCommitSha?.slice(0, 7) ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-gray-500">
                {vercelData ? 'No deployments found' : 'Loading...'}
              </div>
            )}

            {vercelData?.envVars?.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <h2 className="text-sm font-semibold text-gray-300">Environment Variables (Production)</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-left">
                      <th className="px-4 py-2 font-medium">Key</th>
                      <th className="px-4 py-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vercelData.envVars.map((e: any) => (
                      <tr key={e.key} className="border-t border-white/5">
                        <td className="px-4 py-2 font-mono text-cyan-400 text-xs">{e.key}</td>
                        <td className="px-4 py-2 font-mono text-xs text-gray-400">{e.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Supabase Tab */}
        {tab === 'db' && (
          <div className="space-y-4">
            {/* Status bar */}
            <div className="grid grid-cols-5 gap-3">
              {dbData?.counts ? (
                [
                  { label: 'Schools', count: dbData.counts.schools, color: 'from-cyan-500 to-blue-600' },
                  { label: 'Students', count: dbData.counts.students, color: 'from-purple-500 to-pink-600' },
                  { label: 'Sessions', count: dbData.counts.sessions, color: 'from-orange-500 to-red-600' },
                  { label: 'Bookings', count: dbData.counts.bookings, color: 'from-green-500 to-emerald-600' },
                  { label: 'Instructors', count: dbData.counts.instructors, color: 'from-yellow-500 to-orange-600' },
                ].map((c) => (
                  <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>
                      {c.count ?? '?'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{c.label}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-5 bg-white/5 border border-white/10 rounded-xl p-6 text-center text-gray-500">
                  {dbData ? 'No counts available' : 'Loading...'}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h2>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => dbAction('clear_test_bookings')}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                >
                  🗑️ Clear test bookings
                </button>
                <button
                  onClick={() => dbAction('clear_test_schools')}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                >
                  🗑️ Clear test schools (keep Oak Ridge)
                </button>
                <button
                  onClick={loadData}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm hover:text-white transition-colors"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {/* Recent users */}
            {dbData?.recentUsers?.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <h2 className="text-sm font-semibold text-gray-300">Recent Auth Users</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-left">
                      <th className="px-4 py-2 font-medium">Email</th>
                      <th className="px-4 py-2 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbData.recentUsers.map((u: any) => (
                      <tr key={u.id} className="border-t border-white/5">
                        <td className="px-4 py-2 text-gray-300 font-mono text-xs">{u.email}</td>
                        <td className="px-4 py-2 text-gray-400 text-xs">{new Date(u.created).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Stripe Tab */}
        {tab === 'stripe' && (
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stripeData?.isTestMode ? 'bg-yellow-400' : 'bg-green-400'}`} />
                <span className="text-sm text-gray-400">
                  {stripeData?.isTestMode ? '🧪 Test Mode' : '💰 Live Mode'}
                </span>
              </div>
              <a
                href="https://dashboard.stripe.com/test/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyan-400 hover:text-cyan-300 underline"
              >
                Open Stripe Dashboard →
              </a>
            </div>

            {/* Recent events */}
            {stripeData?.events?.length > 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <h2 className="text-sm font-semibold text-gray-300">Recent Stripe Events</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-left">
                      <th className="px-4 py-2 font-medium">Event</th>
                      <th className="px-4 py-2 font-medium">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stripeData.events.map((e: any) => (
                      <tr key={e.id} className="border-t border-white/5">
                        <td className="px-4 py-2">
                          <span className="text-gray-300 font-mono text-xs">{e.type}</span>
                        </td>
                        <td className="px-4 py-2 text-gray-400 text-xs">
                          {new Date(e.created * 1000).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-gray-500">
                {stripeData ? 'No recent events' : 'Loading...'}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
