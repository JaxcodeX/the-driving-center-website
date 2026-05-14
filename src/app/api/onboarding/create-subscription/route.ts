import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabase/server'

/**
 * POST /api/onboarding/create-subscription
 *
 * Creates a Stripe Checkout session for the $99/mo subscription.
 * In DEMO_MODE, skips Stripe and returns success with the demo school ID.
 *
 * Body: { school_id, school_name, owner_email, owner_name }
 *
 * Response: { url: string } (redirect to Stripe Checkout) or
 *           { success: true, school_id, demoMode: true } (demo mode bypass)
 */
export async function POST(request: Request) {
  const body = await request.json()
  const { school_id, school_name, owner_email, owner_name } = body

  if (!school_id) {
    return NextResponse.json({ error: 'school_id required' }, { status: 400 })
  }

  // ── DEMO MODE: skip Stripe, mark school as active ────────────────────
  if (process.env.DEMO_MODE === 'true') {
    const admin = getSupabaseAdmin()
    await (admin as any)
      .from('schools')
      .update({
        subscription_status: 'active',
        subscription_id: 'demo_skip',
      })
      .eq('id', school_id)

    return NextResponse.json({
      success: true,
      school_id,
      demoMode: true,
    })
  }

  // ── PRODUCTION MODE: create Stripe Checkout session ──────────────────
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not configured' }, { status: 500 })
  }

  if (!process.env.STRIPE_STARTER_PRICE_ID) {
    return NextResponse.json({ error: 'STRIPE_STARTER_PRICE_ID not configured' }, { status: 500 })
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: owner_email || undefined,
      line_items: [
        {
          price: process.env.STRIPE_STARTER_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        school_id,
        school_name: school_name ?? 'Driving School',
        source: 'onboarding',
      },
      success_url: `${origin}/school-admin?onboarding=complete`,
      cancel_url: `${origin}/school-admin/onboarding?step=4&cancelled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('[create-subscription] Stripe error:', err)
    return NextResponse.json({ error: err.message ?? 'Failed to create checkout session' }, { status: 500 })
  }
}
