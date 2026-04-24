import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import Stripe from 'stripe'

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// POST /api/schools — create a new school and start Stripe checkout
// Used by the signup flow — user is not yet authenticated
export async function POST(request: Request) {
  const body = await request.json()
  const { schoolName, ownerName, email, phone, state } = body

  if (!schoolName || !email) {
    return NextResponse.json({ error: 'schoolName and email required' }, { status: 400 })
  }

  // Generate a URL-safe slug from school name
  const baseSlug = schoolName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

  const slug = `${baseSlug}-${Date.now().toString(36)}`

  const supabaseAdmin = getSupabaseAdmin()

  // Create school record
  const { data: school, error: schoolError } = await supabaseAdmin
    .from('schools')
    .insert({
      name: schoolName,
      slug,
      email,
      phone: phone ?? null,
      state: state ?? 'TN',
      plan_tier: 'starter',
      active: true,
    })
    .select('id, name, slug')
    .single()

  if (schoolError || !school) {
    return NextResponse.json({ error: schoolError?.message ?? 'Failed to create school' }, { status: 500 })
  }

  // Start Stripe checkout for $99/mo subscription
  const stripe = getStripe()
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_STARTER_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      school_id: school.id,
      school_name: schoolName,
      owner_name: ownerName ?? '',
      state: state ?? 'TN',
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://the-driving-center-website.vercel.app'}/onboarding?school_id=${school.id}&step=profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://the-driving-center-website.vercel.app'}/signup?error=checkout_cancelled`,
  })

  return NextResponse.json({
    schoolId: school.id,
    slug: school.slug,
    checkoutUrl: checkoutSession.url,
  })
}
