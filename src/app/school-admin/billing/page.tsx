'use client'

import { useState, useEffect } from 'react'
import { CreditCard, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const BG = '#0D0D12'
const BG_GRADIENT = 'radial-gradient(ellipse at 50% 0%, rgba(255,140,66,0.06) 0%, transparent 60%)'
const GLASS_BG = 'rgba(255,255,255,0.03)'
const GLASS_BORDER = 'rgba(255,255,255,0.06)'
const GLASS_BLUR = 'blur(24px)'
const TEXT_SECONDARY = '#9CA3AF'
const ACCENT_ORANGE = '#FF8C42'
const ACCENT_CYAN = '#67E8F9'
const ACCENT_GREEN = '#4ADE80'
const CARD_SHADOW = '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let schoolId: string | null = null

      const demoCookie = document.cookie.split('; ').find(c => c.startsWith('demo_user='))
      if (demoCookie) {
        try {
          const payload = JSON.parse(atob(decodeURIComponent(demoCookie.split('=')[1])))
          schoolId = payload.schoolId
        } catch {}
      }

      if (!schoolId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = '/login'; return }
        const { data: school } = await supabase.from('schools').select('id').eq('owner_user_id', user.id).single()
        if (!school) { setLoading(false); return }
        schoolId = school.id
      }

      const { data } = await supabase
        .from('schools')
        .select('id, name, subscription_status, stripe_customer_id')
        .eq('id', schoolId)
      setSubscription(data)
      setLoading(false)
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
      <div style={{
        minHeight: '100vh',
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>Loading...</p>
      </div>
    )
  }

  const status = subscription?.subscription_status || 'trial'

  const statusBg = status === 'active'
    ? 'rgba(74,222,128,0.15)'
    : status === 'past_due'
    ? 'rgba(249,115,22,0.15)'
    : 'rgba(103,232,249,0.15)'

  const statusColor = status === 'active'
    ? ACCENT_GREEN
    : status === 'past_due'
    ? '#F97316'
    : ACCENT_CYAN

  const statusIcon = status === 'active'
    ? <CheckCircle className="w-5 h-5" style={{ color: ACCENT_GREEN }} />
    : status === 'past_due'
    ? <AlertCircle className="w-5 h-5" style={{ color: '#F97316' }} />
    : <CreditCard className="w-5 h-5" style={{ color: ACCENT_CYAN }} />

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
            Billing
          </h1>
          <p style={{ fontSize: '14px', color: TEXT_SECONDARY }}>
            Manage your subscription and payment settings.
          </p>
        </div>

        {/* Status banner */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          padding: '20px',
          background: GLASS_BG,
          backdropFilter: GLASS_BLUR,
          WebkitBackdropFilter: GLASS_BLUR,
          border: `1px solid ${GLASS_BORDER}`,
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: CARD_SHADOW,
        }}>
          <div style={{ marginTop: '2px', flexShrink: 0 }}>
            {statusIcon}
          </div>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: statusColor,
              marginBottom: '2px',
            }}>
              {status === 'active' ? 'Subscription active' : status === 'past_due' ? 'Payment past due' : 'Free trial'}
            </div>
            <div style={{ fontSize: '12px', color: TEXT_SECONDARY }}>
              {status === 'active'
                ? 'Your subscription is active and billing is up to date.'
                : status === 'past_due'
                ? 'Please update your payment method to avoid service interruption.'
                : 'Free plan — upgrade anytime to unlock all features.'}
            </div>
          </div>
        </div>

        {/* Plan card */}
        <div style={{
          background: GLASS_BG,
          backdropFilter: GLASS_BLUR,
          WebkitBackdropFilter: GLASS_BLUR,
          border: `1px solid ${GLASS_BORDER}`,
          borderRadius: '16px',
          padding: '28px',
          boxShadow: CARD_SHADOW,
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: TEXT_SECONDARY, marginBottom: '4px' }}>
                Current Plan
              </div>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '28px',
                fontWeight: '800',
                color: ACCENT_GREEN,
              }}>
                Starter
              </div>
              <div style={{ fontSize: '14px', color: TEXT_SECONDARY }}>$99/month</div>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '600',
              background: statusBg,
              color: statusColor,
            }}>
              {status}
            </span>
          </div>

          <div style={{
            paddingTop: '20px',
            borderTop: `1px solid ${GLASS_BORDER}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '24px',
          }}>
            {[
              'Unlimited bookings',
              'SMS + email reminders',
              'TCA compliance tracking',
              'Certificate issuance',
              'CSV student import',
              'Stripe payments',
            ].map(f => (
              <div key={f} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: TEXT_SECONDARY,
              }}>
                <CheckCircle className="w-4 h-4" style={{ color: ACCENT_GREEN, flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>

          <button
            onClick={openBillingPortal}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            Manage subscription
          </button>
        </div>

        {/* Payment method */}
        {subscription?.stripe_customer_id && (
          <div style={{
            background: GLASS_BG,
            backdropFilter: GLASS_BLUR,
            WebkitBackdropFilter: GLASS_BLUR,
            border: `1px solid ${GLASS_BORDER}`,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: CARD_SHADOW,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>
                Payment method
              </div>
              <CreditCard className="w-4 h-4" style={{ color: TEXT_SECONDARY }} />
            </div>
            <div style={{ fontSize: '13px', color: TEXT_SECONDARY }}>
              Visa ending 4242
              <span style={{ marginLeft: '8px' }}>Expires 12/26</span>
            </div>
            <button
              onClick={openBillingPortal}
              style={{
                marginTop: '16px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: ACCENT_GREEN,
                padding: 0,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              Update payment method <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}