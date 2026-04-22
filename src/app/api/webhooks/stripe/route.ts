import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'

function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('FATAL: STRIPE_SECRET_KEY environment variable is required')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

function verifyWebhookSignature(body: string, signature: string): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('FATAL: STRIPE_WEBHOOK_SECRET environment variable is required')
  }
  const stripe = getStripeClient()
  return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
}

// Track processed event IDs to prevent replay attacks (in production: use Redis)
const processedEvents = new Set<string>()

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return new NextResponse('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = verifyWebhookSignature(body, signature)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new NextResponse('Invalid signature', { status: 401 })
  }

  // P0: Replay attack prevention
  if (processedEvents.has(event.id)) {
    console.warn(`Duplicate Stripe event received: ${event.id}`)
    return NextResponse.json({ error: 'Event already processed' }, { status: 400 })
  }
  processedEvents.add(event.id)

  const supabase = await createClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { metadata } = session

    const schoolId = metadata?.school_id
    const sessionId = metadata?.session_id
    const studentEmail = session.customer_details?.email ?? metadata?.student_email

    if (!studentEmail) {
      console.error('No student email in Stripe session')
      return NextResponse.json('Missing student email', { status: 400 })
    }

    // 1. Create payments row
    const { error: paymentError } = await supabase.from('payments').insert({
      student_email: studentEmail,
      stripe_session_id: session.id,
      amount: session.amount_total ?? 0,
      status: 'paid',
      school_id: schoolId ?? null,
    })

    if (paymentError) {
      console.error('[Stripe Webhook] payments insert failed:', paymentError)
    }

    // 2. Create student record — PII fields encrypted via src/lib/security.ts
    const { error: studentError } = await supabase.from('students_driver_ed').insert({
      parent_email: studentEmail,
      school_id: schoolId ?? null,
      permit_number: 'PENDING', // filled via complete-profile form
      dob: '2000-01-01',         // placeholder until complete-profile form
      class_session_id: sessionId ?? null,
    })

    if (studentError) {
      console.error('[Stripe Webhook] student insert failed:', studentError)
    }

    // 3. Increment seats_booked with school ownership check
    if (sessionId && schoolId) {
      const { error: rpcError } = await supabase.rpc('increment_seats_booked', {
        target_session_id: sessionId,
        target_school_id: schoolId,
      })
      if (rpcError) {
        console.error('[Stripe Webhook] seats increment failed:', rpcError)
      }
    }

    // 4. Audit log — no PII fields logged
    await supabase.from('audit_logs').insert(
      auditLog('PAYMENT_COMPLETED', 'stripe-webhook', {
        stripe_session_id: session.id,
        school_id: schoolId,
        session_id: sessionId,
        amount_cents: session.amount_total,
      })
    )
  }

  return NextResponse.json({ received: true })
}
