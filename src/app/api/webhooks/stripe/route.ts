import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY required')
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

function verifyWebhook(body: string, signature: string): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET required')
  return getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
}

// In-memory replay protection — use Redis in production
const processedEvents = new Set<string>()

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) return new NextResponse('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = verifyWebhook(body, signature)
  } catch (err: any) {
    return new NextResponse('Invalid signature', { status: 401 })
  }

  // Replay protection
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ error: 'Already processed' }, { status: 400 })
  }
  processedEvents.add(event.id)

  const supabase = await createClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { metadata } = session
    const bookingId = metadata?.booking_id

    if (bookingId) {
      // This is a booking deposit payment
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          deposit_paid_at: new Date().toISOString(),
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', bookingId)
        .eq('status', 'pending')

      if (error) console.error('Booking payment update error:', error)

      await supabase.from('audit_logs').insert(
        auditLog('BOOKING_DEPOSIT_PAID', metadata?.student_email ?? 'unknown', {
          booking_id: bookingId,
          amount_cents: session.amount_total,
          stripe_session_id: session.id,
        })
      )
    } else {
      // Legacy: school signup payment (original Phase 1 flow)
      const schoolId = metadata?.school_id
      const sessionId = metadata?.session_id
      const studentEmail = session.customer_details?.email ?? metadata?.student_email ?? 'unknown'

      await supabase.from('payments').insert({
        student_email: studentEmail,
        stripe_session_id: session.id,
        amount: session.amount_total ?? 0,
        status: 'paid',
        school_id: schoolId ?? null,
      })

      if (sessionId && schoolId) {
        await supabase.rpc('increment_seats_booked', {
          target_session_id: sessionId,
          target_school_id: schoolId,
        })
      }

      await supabase.from('audit_logs').insert(
        auditLog('PAYMENT_COMPLETED', 'stripe-webhook', {
          stripe_session_id: session.id,
          school_id: schoolId,
          session_id: sessionId,
          amount_cents: session.amount_total,
        })
      )
    }
  }

  return NextResponse.json({ received: true })
}
