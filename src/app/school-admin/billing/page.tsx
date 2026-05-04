'use client'

import { useState, useEffect } from 'react'
import { CreditCard, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Loading...</p>
      </div>
    )
  }

  const status = subscription?.subscription_status || 'trial'

  const statusIcon = status === 'active'
    ? <CheckCircle className="w-5 h-5" style={{ color: '#4ADE80' }} />
    : status === 'past_due'
    ? <AlertCircle className="w-5 h-5" style={{ color: '#F97316' }} />
    : <CreditCard className="w-5 h-5" style={{ color: '#78E4FF' }} />

  const statusBg = status === 'active'
    ? 'rgba(74,222,128,0.15)'
    : status === 'past_due'
    ? 'rgba(249,115,22,0.15)'
    : 'rgba(120,228,255,0.15)'

  const statusColor = status === 'active'
    ? '#4ADE80'
    : status === 'past_due'
    ? '#F97316'
    : '#78E4FF'

  return (
    <div style={{ maxWidth: '720px' }}>
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
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          Manage your subscription and payment settings.
        </p>
      </div>

      {/* Status banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '20px',
        background: '#0F1117',
        border: '1px solid #1A1A1A',
        borderRadius: '16px',
        marginBottom: '24px',
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
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
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
        background: '#0F1117',
        border: '1px solid #1A1A1A',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#9CA3AF', marginBottom: '4px' }}>
              Current Plan
            </div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '28px',
              fontWeight: '800',
              color: '#4ADE80',
            }}>
              Starter
            </div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>$99/month</div>
          </div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            background: 'rgba(74,222,128,0.15)',
            color: '#4ADE80',
          }}>
            {status}
          </span>
        </div>

        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid #1A1A1A',
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
              color: '#9CA3AF',
            }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#4ADE80', flexShrink: 0 }} />
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
            border: '1px solid #1A1A1A',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#13161F')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
        >
          Manage subscription
        </button>
      </div>

      {/* Payment method */}
      {subscription?.stripe_customer_id && (
        <div style={{
          background: '#0F1117',
          border: '1px solid #1A1A1A',
          borderRadius: '16px',
          padding: '24px',
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
            <CreditCard className="w-4 h-4" style={{ color: '#6B7280' }} />
          </div>
          <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
            Visa •••• 4242
            <span style={{ marginLeft: '8px', color: '#6B7280' }}>Expires 12/26</span>
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
              color: '#4ADE80',
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
  )
}
