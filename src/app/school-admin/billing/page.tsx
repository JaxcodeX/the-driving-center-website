'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, CheckCircle, ExternalLink, AlertCircle, LayoutDashboard, GraduationCap, Calendar, Car, Settings, Clock, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/school-admin' },
  { icon: GraduationCap, label: 'Students', href: '/school-admin/students' },
  { icon: Calendar, label: 'Sessions', href: '/school-admin/sessions' },
  { icon: Car, label: 'Instructors', href: '/school-admin/instructors' },
  { icon: Clock, label: 'Calendar', href: '/school-admin/calendar' },
  { icon: DollarSign, label: 'Billing', href: '/school-admin/billing', active: true },
  { icon: Settings, label: 'Settings', href: '/school-admin/settings' },
]

const BG = 'var(--bg-base)'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)'
const GLASS_BG = 'var(--glass-bg)'
const GLASS_BORDER = 'var(--glass-border)'
const GLASS_BLUR = 'var(--glass-blur)'
const TEXT_SECONDARY = 'var(--text-secondary)'
const TEXT_MUTED = 'var(--text-muted)'
const ACCENT_CYAN = 'var(--accent-secondary)'
const ACCENT_GREEN = 'var(--accent)'
const CARD_SHADOW = 'var(--glass-shadow)'
const CARD_SHADOW_HOVER = '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let schoolId: string | null = null
      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) { try { schoolId = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1]))).schoolId } catch {} }
      if (!schoolId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = '/login'; return }
        const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
        if (!school) { setLoading(false); return }
        schoolId = school.id
      }
      const { data } = await supabase.from('schools').select('id, name, subscription_status, stripe_customer_id').eq('id', schoolId)
      setSubscription(data); setLoading(false)
    }
    load()
  }, [])

  async function openBillingPortal() {
    const res = await fetch('/api/schools/billing-portal')
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: BG, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>Loading...</p>
      </div>
    )
  }

  const status = subscription?.subscription_status || 'trial'
  const statusBg = status === 'active' ? 'rgba(74,222,128,0.15)' : status === 'past_due' ? 'rgba(249,115,22,0.15)' : 'rgba(103,232,249,0.15)'
  const statusColor = status === 'active' ? 'var(--accent)' : status === 'past_due' ? 'var(--accent-secondary)' : 'var(--accent-secondary)'
  const statusIcon = status === 'active' ? <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} /> : status === 'past_due' ? <AlertCircle className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} /> : <CreditCard className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, background: BG_GRADIENT, pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, borderRight: `1px solid ${GLASS_BORDER}`, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto', zIndex: 10 }}>
        <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${GLASS_BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, var(--accent), var(--accent-secondary))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car className="w-4 h-4" style={{ color: '#000' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>Driving Center</div>
              <div style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>School Admin</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
              <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', textDecoration: 'none', background: active ? 'rgba(255,255,255,0.06)' : 'transparent', borderLeft: active ? `3px solid var(--accent)` : '3px solid transparent', boxShadow: active ? `0 0 12px rgba(74,222,128,0.3)` : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <NavIcon className="w-4 h-4" style={{ color: active ? 'var(--accent)' : TEXT_SECONDARY, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: active ? '600' : '500', color: active ? 'var(--text-primary)' : TEXT_SECONDARY }}>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${GLASS_BORDER}` }}><p style={{ fontSize: '10px', color: TEXT_SECONDARY, fontWeight: '500' }}>Your Driving School</p></div>
      </aside>

      {/* Mobile nav */}
      <nav style={{ display: 'none', padding: '12px 16px', gap: '8px', overflowX: 'auto', borderBottom: `1px solid ${GLASS_BORDER}`, background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, position: 'sticky', top: 0, zIndex: 20 }} className="admin-nav-pills">
        {NAV_ITEMS.map(({ icon: NavIcon, label, href, active }) => (
          <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px', textDecoration: 'none', background: active ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'var(--accent)' : GLASS_BORDER}`, transition: 'background 0.15s', flexShrink: 0 }}>
            <NavIcon className="w-3.5 h-3.5" style={{ color: active ? 'var(--accent)' : TEXT_SECONDARY }} />
            <span style={{ fontSize: '12px', fontWeight: active ? '600' : '500', color: active ? 'var(--accent)' : TEXT_SECONDARY }}>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '220px', padding: '40px 48px', maxWidth: '720px', position: 'relative', zIndex: 1 }} className="admin-main">

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.01em' }}>Billing</h1>
          <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>Manage your subscription and payment settings.</p>
        </div>

        {/* Status banner */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px', background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', marginBottom: '24px', boxShadow: CARD_SHADOW }}>
          <div style={{ marginTop: '2px', flexShrink: 0 }}>{statusIcon}</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: statusColor, marginBottom: '2px' }}>{status === 'active' ? 'Subscription active' : status === 'past_due' ? 'Payment past due' : 'Free trial'}</div>
            <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>{status === 'active' ? 'Your subscription is active and billing is up to date.' : status === 'past_due' ? 'Please update your payment method to avoid service interruption.' : 'Free plan — upgrade anytime to unlock all features.'}</div>
          </div>
        </div>

        {/* Plan card */}
        <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', padding: '28px', boxShadow: CARD_SHADOW, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: TEXT_SECONDARY, marginBottom: '4px' }}>Current Plan</div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: '800', color: 'var(--accent)' }}>Starter</div>
              <div style={{ fontSize: '14px', color: TEXT_SECONDARY }}>$99/month</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: statusBg, color: statusColor }}>{status}</span>
          </div>
          <div style={{ paddingTop: '20px', borderTop: `1px solid ${GLASS_BORDER}`, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {['Unlimited bookings', 'SMS + email reminders', 'TCA compliance tracking', 'Certificate issuance', 'CSV student import', 'Stripe payments'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: TEXT_SECONDARY }}>
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--accent)', flexShrink: 0 }} />{f}
              </div>
            ))}
          </div>
          <button onClick={openBillingPortal} style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid ${GLASS_BORDER}`, borderRadius: '12px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>Manage subscription</button>
        </div>

        {/* Payment method */}
        {subscription?.stripe_customer_id && (
          <div style={{ background: GLASS_BG, backdropFilter: GLASS_BLUR, WebkitBackdropFilter: GLASS_BLUR, border: `1px solid ${GLASS_BORDER}`, borderRadius: '16px', padding: '24px', boxShadow: CARD_SHADOW }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Payment method</div>
              <CreditCard className="w-4 h-4" style={{ color: TEXT_SECONDARY }} />
            </div>
            <div style={{ fontSize: '13px', color: TEXT_SECONDARY }}>Visa ending 4242<span style={{ marginLeft: '8px' }}>Expires 12/26</span></div>
            <button onClick={openBillingPortal} style={{ marginTop: '16px', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, transition: 'opacity 0.15s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>Update payment method <ExternalLink className="w-3 h-3" /></button>
          </div>
        )}
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
