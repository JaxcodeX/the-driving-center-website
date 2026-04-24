import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    // Recent events
    const events = await stripe.events.list({
      limit: 10,
      types: ['checkout.session.completed', 'checkout.session.expired'],
    })

    const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')

    return NextResponse.json({
      connected: true,
      isTestMode,
      events: events.data.map((e: any) => ({
        id: e.id,
        type: e.type,
        created: e.created,
        state: e.data.object.status ?? 'unknown',
      })),
      dashboardUrl: 'https://dashboard.stripe.com/test/apikeys',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message, connected: false }, { status: 500 })
  }
}
