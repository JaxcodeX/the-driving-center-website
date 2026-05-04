'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const BG = '#0D0D12'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.06) 0%, transparent 60%)'
const GLASS_BG = 'rgba(255,255,255,0.03)'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_BLUR = 'blur(24px)'
const TEXT_SECONDARY = '#9CA3AF'
const ACCENT_CYAN = '#67E8F9'
const ACCENT_ORANGE = '#4ADE80'
const ACCENT_GREEN = '#4ADE80'
const CARD_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'

type Tab = 'vercel' | 'db' | 'stripe'

export default function OpsPage() {
  const [tab, setTab] = useState<Tab>('vercel')
  const [vercelData, setVercelData] = useState<any>(null)
  const [dbData, setDbData] = useState<any>(null)
  const [stripeData, setStripeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { loadData() }, [tab])

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
      setMessage(data.success ? `Done: deleted ${data.deleted} records` : `Error: ${data.error}`)
      await loadData()
    } catch (e: any) {
      setMessage(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '4px',
            }}>
              ⚡ Ops Panel
            </h1>
            <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>
              Control Supabase, Stripe, and Vercel from one place
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: TEXT_SECONDARY, marginBottom: '4px' }}>Vercel deploy status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ACCENT_GREEN }} />
              <span style={{ fontSize: '14px', color: TEXT_SECONDARY }}>Live</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {([
            { key: 'vercel', label: '▲ Vercel' },
            { key: 'db', label: '⚡ Supabase' },
            { key: 'stripe', label: '💳 Stripe' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s',
                ...(tab === key
                  ? {
                      background: 'rgba(103,232,249,0.15)',
                      color: ACCENT_CYAN,
                      border: `1px solid ${ACCENT_CYAN}`,
                    }
                  : {
                      background: GLASS_BG,
                      backdropFilter: GLASS_BLUR,
                      WebkitBackdropFilter: GLASS_BLUR,
                      color: TEXT_SECONDARY,
                      border: `1px solid ${GLASS_BORDER}`,
                    }),
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(103,232,249,0.1)',
            border: `1px solid rgba(103,232,249,0.2)`,
            color: ACCENT_CYAN,
            fontSize: '14px',
            fontWeight: '500',
          }}>
            {message}
          </div>
        )}

        {/* Vercel Tab */}
        {tab === 'vercel' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {vercelData?.deployments?.length > 0 ? (
              <div style={{
                background: GLASS_BG,
                backdropFilter: GLASS_BLUR,
                WebkitBackdropFilter: GLASS_BLUR,
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: CARD_SHADOW,
              }}>
                <div style={{
                  padding: '12px 20px',
                  borderBottom: `1px solid ${GLASS_BORDER}`,
                }}>
                  <h2 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: TEXT_SECONDARY,
                  }}>
                    Recent Deployments
                  </h2>
                </div>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: TEXT_SECONDARY }}>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>Status</th>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>When</th>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>Commit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vercelData.deployments.map((d: any) => (
                      <tr key={d.uid} style={{ borderTop: `1px solid ${GLASS_BORDER}` }}>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: d.state === 'READY' ? 'rgba(74,222,128,0.15)' : d.state === 'ERROR' ? 'rgba(239,68,68,0.15)' : 'rgba(250,204,21,0.15)',
                            color: d.state === 'READY' ? ACCENT_GREEN : d.state === 'ERROR' ? '#EF4444' : '#FACC15',
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: d.state === 'READY' ? ACCENT_GREEN : d.state === 'ERROR' ? '#EF4444' : '#FACC15',
                            }} />
                            {d.state}
                          </span>
                        </td>
                        <td style={{ padding: '12px 20px', color: TEXT_SECONDARY }}>
                          {new Date(d.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 20px', color: TEXT_SECONDARY, fontFamily: 'monospace', fontSize: '12px' }}>
                          {d.meta?.githubCommitSha?.slice(0, 7) ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                background: GLASS_BG,
                backdropFilter: GLASS_BLUR,
                WebkitBackdropFilter: GLASS_BLUR,
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                color: TEXT_SECONDARY,
                fontSize: '14px',
                boxShadow: CARD_SHADOW,
              }}>
                {vercelData ? 'No deployments found' : 'Loading...'}
              </div>
            )}

            {vercelData?.envVars?.length > 0 && (
              <div style={{
                background: GLASS_BG,
                backdropFilter: GLASS_BLUR,
                WebkitBackdropFilter: GLASS_BLUR,
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: CARD_SHADOW,
              }}>
                <div style={{ padding: '12px 20px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
                  <h2 style={{ fontSize: '13px', fontWeight: '600', color: TEXT_SECONDARY }}>Environment Variables (Production)</h2>
                </div>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: TEXT_SECONDARY }}>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>Key</th>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vercelData.envVars.map((e: any) => (
                      <tr key={e.key} style={{ borderTop: `1px solid ${GLASS_BORDER}` }}>
                        <td style={{ padding: '10px 20px', fontFamily: 'monospace', fontSize: '12px', color: ACCENT_CYAN }}>{e.key}</td>
                        <td style={{ padding: '10px 20px', fontFamily: 'monospace', fontSize: '12px', color: TEXT_SECONDARY }}>{e.value}</td>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Status bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {dbData?.counts ? (
                [
                  { label: 'Schools', count: dbData.counts.schools, color: ACCENT_CYAN },
                  { label: 'Students', count: dbData.counts.students, color: '#A78BFA' },
                  { label: 'Sessions', count: dbData.counts.sessions, color: ACCENT_GREEN },
                  { label: 'Bookings', count: dbData.counts.bookings, color: ACCENT_GREEN },
                  { label: 'Instructors', count: dbData.counts.instructors, color: '#FBBF24' },
                ].map(c => (
                  <div key={c.label} style={{
                    background: GLASS_BG,
                    backdropFilter: GLASS_BLUR,
                    WebkitBackdropFilter: GLASS_BLUR,
                    border: `1px solid ${GLASS_BORDER}`,
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'center',
                    boxShadow: CARD_SHADOW,
                  }}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      fontFamily: 'Outfit, sans-serif',
                      color: c.color,
                      marginBottom: '4px',
                    }}>
                      {c.count ?? '?'}
                    </div>
                    <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>{c.label}</div>
                  </div>
                ))
              ) : (
                <div style={{
                  gridColumn: 'span 5',
                  background: GLASS_BG,
                  backdropFilter: GLASS_BLUR,
                  border: `1px solid ${GLASS_BORDER}`,
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  color: TEXT_SECONDARY,
                  fontSize: '14px',
                  boxShadow: CARD_SHADOW,
                }}>
                  {dbData ? 'No counts available' : 'Loading...'}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{
              background: GLASS_BG,
              backdropFilter: GLASS_BLUR,
              WebkitBackdropFilter: GLASS_BLUR,
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '16px',
              padding: '16px',
              boxShadow: CARD_SHADOW,
            }}>
              <h2 style={{ fontSize: '13px', fontWeight: '600', color: TEXT_SECONDARY, marginBottom: '12px' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => dbAction('clear_test_bookings')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#EF4444',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)')}
                >
                  🗑️ Clear test bookings
                </button>
                <button
                  onClick={() => dbAction('clear_test_schools')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#EF4444',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)')}
                >
                  🗑️ Clear test schools (keep Oak Ridge)
                </button>
                <button
                  onClick={loadData}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: GLASS_BG,
                    border: `1px solid ${GLASS_BORDER}`,
                    color: TEXT_SECONDARY,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLElement).style.color = '#FFFFFF'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = GLASS_BG
                    ;(e.currentTarget as HTMLElement).style.color = TEXT_SECONDARY
                  }}
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {/* Recent users */}
            {dbData?.recentUsers?.length > 0 && (
              <div style={{
                background: GLASS_BG,
                backdropFilter: GLASS_BLUR,
                WebkitBackdropFilter: GLASS_BLUR,
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: CARD_SHADOW,
              }}>
                <div style={{ padding: '12px 20px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
                  <h2 style={{ fontSize: '13px', fontWeight: '600', color: TEXT_SECONDARY }}>Recent Auth Users</h2>
                </div>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: TEXT_SECONDARY }}>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>Email</th>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbData.recentUsers.map((u: any) => (
                      <tr key={u.id} style={{ borderTop: `1px solid ${GLASS_BORDER}` }}>
                        <td style={{ padding: '10px 20px', color: TEXT_SECONDARY, fontFamily: 'monospace', fontSize: '12px' }}>{u.email}</td>
                        <td style={{ padding: '10px 20px', color: TEXT_SECONDARY, fontSize: '12px' }}>{new Date(u.created).toLocaleDateString()}</td>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: stripeData?.isTestMode ? '#FACC15' : ACCENT_GREEN,
                }} />
                <span style={{ fontSize: '14px', color: TEXT_SECONDARY }}>
                  {stripeData?.isTestMode ? '🧪 Test Mode' : '💰 Live Mode'}
                </span>
              </div>
              <a
                href="https://dashboard.stripe.com/test/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '14px',
                  color: ACCENT_CYAN,
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Open Stripe Dashboard →
              </a>
            </div>

            {/* Recent events */}
            {stripeData?.events?.length > 0 ? (
              <div style={{
                background: GLASS_BG,
                backdropFilter: GLASS_BLUR,
                WebkitBackdropFilter: GLASS_BLUR,
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: CARD_SHADOW,
              }}>
                <div style={{ padding: '12px 20px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
                  <h2 style={{ fontSize: '13px', fontWeight: '600', color: TEXT_SECONDARY }}>Recent Stripe Events</h2>
                </div>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: TEXT_SECONDARY }}>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>Event</th>
                      <th style={{ padding: '10px 20px', fontWeight: '600', fontSize: '12px' }}>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stripeData.events.map((e: any) => (
                      <tr key={e.id} style={{ borderTop: `1px solid ${GLASS_BORDER}` }}>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{ color: TEXT_SECONDARY, fontFamily: 'monospace', fontSize: '12px' }}>{e.type}</span>
                        </td>
                        <td style={{ padding: '12px 20px', color: TEXT_SECONDARY, fontSize: '12px' }}>
                          {new Date(e.created * 1000).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                background: GLASS_BG,
                backdropFilter: GLASS_BLUR,
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                color: TEXT_SECONDARY,
                fontSize: '14px',
                boxShadow: CARD_SHADOW,
              }}>
                {stripeData ? 'No recent events' : 'Loading...'}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '2px solid rgba(103,232,249,0.3)',
              borderTopColor: ACCENT_CYAN,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}