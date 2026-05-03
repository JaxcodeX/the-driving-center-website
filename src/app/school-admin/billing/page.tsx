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
      <div className="flex items-center justify-center py-20">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  const status = subscription?.subscription_status || 'trial'

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Billing</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your subscription and payment settings.</p>
      </div>

      {/* Status banner */}
      <div className="glass-card flex items-start gap-4 p-5 mb-6">
        <div className="mt-0.5">
          {status === 'active' ? (
            <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
          ) : status === 'past_due' ? (
            <AlertCircle className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
          ) : (
            <CreditCard className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          )}
        </div>
        <div>
          <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
            {status === 'active' ? 'Subscription active' : status === 'past_due' ? 'Payment past due' : 'Free trial'}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {status === 'active'
              ? 'Your subscription is active and billing is up to date.'
              : status === 'past_due'
              ? 'Please update your payment method to avoid service interruption.'
              : 'Free plan — upgrade anytime to unlock all features.'}
          </div>
        </div>
      </div>

      {/* Plan card */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Current Plan</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>Starter</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>$99/month</div>
          </div>
          <span className="status-pill status-active">{status}</span>
        </div>

        <div className="space-y-2 mb-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          {[
            'Unlimited bookings',
            'SMS + email reminders',
            'TCA compliance tracking',
            'Certificate issuance',
            'CSV student import',
            'Stripe payments',
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
              {f}
            </div>
          ))}
        </div>

        <button
          onClick={openBillingPortal}
          className="btn-ghost w-full text-center py-3 text-sm font-semibold"
        >
          Manage subscription
        </button>
      </div>

      {/* Payment method */}
      {subscription?.stripe_customer_id && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Payment method</div>
            <CreditCard className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Visa •••• 4242
            <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>Expires 12/26</span>
          </div>
          <button
            onClick={openBillingPortal}
            className="mt-4 text-xs font-medium flex items-center gap-1"
            style={{ color: 'var(--accent)' }}
          >
            Update payment method <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}