'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const T = {
  bg:        '#050505',
  surface:   '#0D0D0D',
  elevated:  '#18181b',
  border:    '#1A1A1A',
  borderLt:  '#27272a',
  text:      '#ffffff',
  secondary: '#94A3B8',
  muted:     '#52525b',
  cyan:      '#38BDF8',
  purple:    '#818CF8',
  green:     '#10B981',
  amber:     '#f59e0b',
  grad:      'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: school } = await supabase.from('schools').select('id, name, subscription_status, stripe_customer_id').eq('owner_user_id', user.id).single()
      if (!school) { setLoading(false); return }
      setSubscription(school)
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
      <div className="flex items-center justify-center py-20">
        <p className="text-sm" style={{ color: T.muted }}>Loading...</p>
      </div>
    )
  }

  const status = subscription?.subscription_status || 'trial'

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: T.text }}>Billing</h1>
        <p className="text-sm" style={{ color: T.muted }}>Manage your subscription and payment settings.</p>
      </div>

      {/* Status banner */}
      <div
        className="flex items-start gap-4 p-5 rounded-2xl mb-6"
        style={{
          background: status === 'active' ? `${T.green}10` : status === 'past_due' ? `${T.amber}10` : `${T.cyan}10`,
          border: `1px solid ${status === 'active' ? `${T.green}30` : status === 'past_due' ? `${T.amber}30` : `${T.cyan}30`}`,
        }}
      >
        <div className="mt-0.5">
          {status === 'active' ? (
            <CheckCircle className="w-5 h-5" style={{ color: T.green }} />
          ) : status === 'past_due' ? (
            <AlertCircle className="w-5 h-5" style={{ color: T.amber }} />
          ) : (
            <CreditCard className="w-5 h-5" style={{ color: T.cyan }} />
          )}
        </div>
        <div>
          <div className="text-sm font-semibold mb-0.5" style={{ color: T.text }}>
            {status === 'active' ? 'Subscription active' : status === 'past_due' ? 'Payment past due' : 'Free trial'}
          </div>
          <div className="text-xs" style={{ color: T.secondary }}>
            {status === 'active'
              ? 'Your subscription is active and billing is up to date.'
              : status === 'past_due'
              ? 'Please update your payment method to avoid service interruption.'
              : 'DEMO_MODE: No Stripe subscription required.'}
          </div>
        </div>
      </div>

      {/* Plan card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold mb-1" style={{ color: T.text }}>Current Plan</div>
            <div className="text-2xl font-bold" style={{ color: T.cyan }}>Starter</div>
            <div className="text-sm" style={{ color: T.muted }}>$99/month</div>
          </div>
          <div
            className="text-xs px-3 py-1 rounded-full font-medium capitalize"
            style={{ background: `${T.green}15`, color: T.green }}
          >
            {status}
          </div>
        </div>

        <div className="space-y-2 mb-6 pt-4 border-t" style={{ borderColor: T.border }}>
          {[
            'Unlimited bookings',
            'SMS + email reminders',
            'TCA compliance tracking',
            'Certificate issuance',
            'CSV student import',
            'Stripe payments',
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm" style={{ color: T.secondary }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: T.green }} />
              {f}
            </div>
          ))}
        </div>

        <button
          onClick={openBillingPortal}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: T.elevated, border: `1px solid ${T.border}` }}
        >
          Manage subscription
        </button>
      </div>

      {/* Payment method */}
      {subscription?.stripe_customer_id && (
        <div
          className="rounded-2xl p-6"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold" style={{ color: T.text }}>Payment method</div>
            <CreditCard className="w-4 h-4" style={{ color: T.muted }} />
          </div>
          <div className="text-sm" style={{ color: T.muted }}>
            Visa •••• 4242
            <span className="ml-2" style={{ color: T.secondary }}>Expires 12/26</span>
          </div>
          <button
            onClick={openBillingPortal}
            className="mt-4 text-xs font-medium flex items-center gap-1"
            style={{ color: T.cyan }}
          >
            Update payment method <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}