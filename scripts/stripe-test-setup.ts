/**
 * scripts/stripe-test-setup.ts
 * Sets up Stripe test data for end-to-end payment flow testing.
 *
 * What it does:
 * 1. Creates or finds a test customer in Stripe
 * 2. Creates a $99/mo subscription (hooking up the real product/price)
 * 3. Updates the demo school's stripe_customer_id in Supabase
 * 4. Outputs webhook test commands
 *
 * Run: npx tsx scripts/stripe-test-setup.ts
 */

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load env
try {
  const envFile = readFileSync(resolve('./.env.local'), 'utf8')
  for (const line of envFile.split('\n')) {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
  }
} catch { /* ignore */ }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const DEMO_SCHOOL_ID = '0daea68b-06ed-445b-bf52-91d4f16b9e01'

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2026-03-25.dahlia' as const })

async function getOrCreatePrice(): Promise<string> {
  // Look for an existing $99/mo recurring price
  const prices = await stripe.prices.list({ limit: 10, recurring: { interval: 'month' } })
  const existing = prices.data.find(p => p.unit_amount === 9900)
  if (existing) {
    console.log(`   Using existing $99/mo price: ${existing.id}`)
    return existing.id
  }

  // Create a new product + price
  const product = await stripe.products.create({
    name: 'Driving Center Starter Plan',
    description: '$99/month — all-in-one driving school management',
  })
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 9900,
    currency: 'usd',
    recurring: { interval: 'month' },
    nickname: 'Starter $99/mo',
  })
  console.log(`   Created new product + price: ${price.id}`)
  return price.id
}

async function getOrCreateCustomer(email: string, name: string) {
  const existing = await stripe.customers.list({ email, limit: 1 })
  if (existing.data.length > 0) {
    console.log(`   Using existing customer: ${existing.data[0].id}`)
    return existing.data[0]
  }
  const customer = await stripe.customers.create({ email, name })
  console.log(`   Created new customer: ${customer.id}`)
  return customer
}

async function main() {
  console.log('🧪 Stripe Test Setup\n')

  // ── 1. Get or create the Stripe price ────────────────────────────────────
  console.log('1. Setting up price...')
  const priceId = await getOrCreatePrice()

  // Save to .stripe_price_id.txt
  const { writeFileSync } = await import('fs')
  writeFileSync(resolve('./.stripe_price_id.txt'), priceId)
  console.log(`   → Price saved to .stripe_price_id.txt: ${priceId}`)
  console.log(`   ⚠️  Update VERCEL env var STRIPE_STARTER_PRICE_ID = ${priceId}`)

  // ── 2. Update Supabase school with valid stripe_customer_id ────────────────
  console.log('\n2. Updating demo school Stripe customer...')
  const testEmail = 'mark.martin@thedrivingcenter.org'
  const testName = 'Mark Martin'
  const customer = await getOrCreateCustomer(testEmail, testName)

  const { error } = await supabase
    .from('schools')
    .update({
      stripe_customer_id: customer.id,
      subscription_status: 'trial',
    })
    .eq('id', DEMO_SCHOOL_ID)

  if (error) {
    console.error(`   ❌ Failed to update school: ${error.message}`)
  } else {
    console.log(`   ✅ School updated with stripe_customer_id: ${customer.id}`)
  }

  // ── 3. Create a test subscription ────────────────────────────────────────
  console.log('\n3. Creating test subscription...')
  const sub = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    trial_period_days: 14,
    metadata: {
      school_id: DEMO_SCHOOL_ID,
      school_name: 'The Driving Center',
    },
  })
  console.log(`   ✅ Subscription created: ${sub.id}`)
  console.log(`   Status: ${sub.status} | Trial ends: ${new Date((sub as any).trial_end * 1000).toISOString()}`)

  // ── 4. Summary ─────────────────────────────────────────────────────────────
  console.log('\n── Setup Complete ───────────────────────────────────────')
  console.log(`  Stripe Price ID:    ${priceId}`)
  console.log(`  Stripe Customer:    ${customer.id}`)
  console.log(`  Subscription:      ${sub.id}`)
  console.log('')
  console.log('── Next Steps ────────────────────────────────────────────')
  console.log(`  1. Set in Vercel: STRIPE_STARTER_PRICE_ID=${priceId}`)
  console.log('  2. Go to Stripe Dashboard → Webhooks → add endpoint:')
  console.log(`     URL: https://the-driving-center-website.vercel.app/api/webhooks/stripe`)
  console.log('     Events: checkout.session.completed, customer.subscription.updated,')
  console.log('             customer.subscription.deleted, invoice.payment_failed,')
  console.log('             checkout.session.expired')
  console.log('  3. Copy the webhook signing secret → set as STRIPE_WEBHOOK_SECRET in Vercel')
  console.log('  4. Test the full booking flow in browser with demo login')
  console.log('')
  console.log('── Webhook Test Command (after setting up webhook) ─────────')
  console.log(`  stripe trigger checkout.session.completed \\`)
  console.log(`    --customer ${customer.id} \\`)
  console.log(`    --add-metadata school_id=${DEMO_SCHOOL_ID}`)
}

main().catch(e => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})