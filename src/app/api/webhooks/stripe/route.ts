import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { auditLog } from '@/lib/security'

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY required')
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-03-25.dahlia' as const })
}

function verifyWebhook(body: string, signature: string): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET required')
  return getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
}

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Replay protection
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
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 401 })
  }

  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, note: 'already processed' })
  }
  processedEvents.add(event.id)

  const supabaseAdmin = getSupabaseAdmin()

  // ── School subscription checkout completed ─────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { metadata } = session
    const bookingId = metadata?.booking_id

    if (bookingId) {
      // ── Booking deposit payment ─────────────────────────────────────
      const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select('id, status, session_id')
        .eq('id', bookingId)
        .eq('status', 'pending')
        .single()

      if (booking) {
        await supabaseAdmin
          .from('bookings')
          .update({
            status: 'confirmed',
            deposit_paid_at: new Date().toISOString(),
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('id', bookingId)

        if (booking.session_id) {
          const { data: sess } = await supabaseAdmin
            .from('sessions')
            .select('seats_booked')
            .eq('id', booking.session_id)
            .single()
          if (sess) {
            await supabaseAdmin
              .from('sessions')
              .update({ seats_booked: (sess.seats_booked ?? 0) + 1 })
              .eq('id', booking.session_id)
          }
        }
      }

      await supabaseAdmin.from('audit_logs').insert(
        auditLog('BOOKING_DEPOSIT_PAID', metadata?.student_email ?? 'unknown', {
          booking_id: bookingId,
          amount_cents: session.amount_total,
          stripe_session_id: session.id,
        })
      )

    } else if (metadata?.school_id) {
      // ── School subscription checkout completed ─────────────────────
      const schoolId = metadata.school_id
      const customerId = session.customer as string

      await supabaseAdmin
        .from('schools')
        .update({
          subscription_status: 'active',
          stripe_customer_id: customerId,
        })
        .eq('id', schoolId)

      await supabaseAdmin.from('audit_logs').insert(
        auditLog('SUBSCRIPTION_ACTIVATED', 'stripe-webhook', {
          school_id: schoolId,
          stripe_customer_id: customerId,
        })
      )
    }

    // Legacy: payment without school_id
    if (!bookingId && !metadata?.school_id) {
      await supabaseAdmin.from('payments').insert({
        student_email: session.customer_details?.email ?? 'unknown',
        stripe_session_id: session.id,
        amount: session.amount_total ?? 0,
        status: 'paid',
      })
    }
  }

  // ── Checkout session expired (booking was not confirmed) ────────────
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.booking_id

    if (bookingId) {
      const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select('id, status, session_id')
        .eq('id', bookingId)
        .eq('status', 'pending')
        .single()

      if (booking) {
        await supabaseAdmin
          .from('bookings')
          .update({ status: 'expired' })
          .eq('id', bookingId)

        if (booking.session_id) {
          const { data: sess } = await supabaseAdmin
            .from('sessions')
            .select('seats_booked')
            .eq('id', booking.session_id)
            .single()
          if (sess && sess.seats_booked > 0) {
            await supabaseAdmin
              .from('sessions')
              .update({ seats_booked: sess.seats_booked - 1 })
              .eq('id', booking.session_id)
          }
        }
      }
    }
  }

  // ── Subscription updated ─────────────────────────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const customerId = sub.customer as string
    const status = sub.status // active, trialing, past_due, canceled, incomplete

    // Map Stripe status to our status
    const statusMap: Record<string, string> = {
      active: 'active',
      trialing: 'trial',
      past_due: 'past_due',
      canceled: 'cancelled',
      incomplete: 'trial',
      unpaid: 'past_due',
    }
    const ourStatus = statusMap[status] ?? 'trial'

    await supabaseAdmin
      .from('schools')
      .update({
        subscription_status: ourStatus,
        subscription_id: sub.id,
      })
      .eq('stripe_customer_id', customerId)

    await supabaseAdmin.from('audit_logs').insert(
      auditLog('SUBSCRIPTION_UPDATED', 'stripe-webhook', {
        stripe_subscription_id: sub.id,
        stripe_status: status,
        our_status: ourStatus,
      })
    )
  }

  // ── Subscription deleted (cancelled) ─────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const customerId = sub.customer as string

    await supabaseAdmin
      .from('schools')
      .update({ subscription_status: 'cancelled' })
      .eq('stripe_customer_id', customerId)

    await supabaseAdmin.from('audit_logs').insert(
      auditLog('SUBSCRIPTION_CANCELLED', 'stripe-webline', {
        stripe_subscription_id: sub.id,
      })
    )
  }

  // ── Invoice payment failed ─────────────────────────────────────────────
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = invoice.customer as string

    await supabaseAdmin
      .from('schools')
      .update({ subscription_status: 'past_due' })
      .eq('stripe_customer_id', customerId)

    await supabaseAdmin.from('audit_logs').insert(
      auditLog('SUBSCRIPTION_PAST_DUE', 'stripe-webhook', {
        stripe_customer_id: customerId,
        invoice_id: invoice.id,
      })
    )
  }

  return NextResponse.json({ received: true })
}