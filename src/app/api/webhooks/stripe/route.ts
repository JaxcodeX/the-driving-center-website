import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { auditLog } from '@/lib/security'

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY required')
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

function verifyWebhook(body: string, signature: string): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET required')
  return getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
}

// Service role client — bypasses RLS for webhook operations
function getSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY required')
  }
  return createSupabaseAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY)
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

  const supabaseAdmin = getSupabaseAdmin()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { metadata } = session
    const bookingId = metadata?.booking_id

    if (bookingId) {
      // Booking deposit payment
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

        // Increment seats_booked on confirmed payment (Fix B)
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

      // Send booking confirmation email to student (Fix 7)
      if (booking?.session_id) {
        const { data: bookingFull } = await supabaseAdmin
          .from('bookings')
          .select('student_email, student_name, session:session_id(start_date, start_time, location, session_type:session_type_id(name), school:school_id(name))')
          .eq('id', bookingId)
          .single()

        if (bookingFull) {
          const s = bookingFull.session as any
          const sessionDate = new Date(`${s.start_date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
          fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notify/booking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentEmail: bookingFull.student_email,
              studentName: bookingFull.student_name,
              sessionId: booking.session_id,
              schoolId: s?.school?.id,
            }),
          }).catch(console.error)
        }
      }
    } else {
      // Legacy: school signup payment
      const schoolId = metadata?.school_id
      const sessionId = metadata?.session_id
      const studentEmail = session.customer_details?.email ?? metadata?.student_email ?? 'unknown'

      await supabaseAdmin.from('payments').insert({
        student_email: studentEmail,
        stripe_session_id: session.id,
        amount: session.amount_total ?? 0,
        status: 'paid',
        school_id: schoolId ?? null,
      })

      if (sessionId && schoolId) {
        const { data: sess } = await supabaseAdmin
          .from('sessions')
          .select('seats_booked')
          .eq('id', sessionId)
          .single()
        if (sess) {
          await supabaseAdmin
            .from('sessions')
            .update({ seats_booked: (sess.seats_booked ?? 0) + 1 })
            .eq('id', sessionId)
        }
      }

      await supabaseAdmin.from('audit_logs').insert(
        auditLog('PAYMENT_COMPLETED', 'stripe-webhook', {
          stripe_session_id: session.id,
          school_id: schoolId,
          session_id: sessionId,
          amount_cents: session.amount_total,
        })
      )
    }
  }

  // Handle abandoned checkout — decrement seats if they were reserved (Fix C)
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const { metadata } = session
    const bookingId = metadata?.booking_id

    if (bookingId) {
      const { data: booking } = await supabaseAdmin
        .from('bookings')
        .select('id, status, session_id')
        .eq('id', bookingId)
        .eq('status', 'pending')
        .single()

      if (booking) {
        // Set booking to expired (not confirmed)
        await supabaseAdmin
          .from('bookings')
          .update({ status: 'expired' })
          .eq('id', bookingId)

        // Decrement seats_booked since this booking never consumed the seat
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

        await supabaseAdmin.from('audit_logs').insert(
          auditLog('BOOKING_EXPIRED', metadata?.student_email ?? 'unknown', {
            booking_id: bookingId,
          })
        )
      }
    }
  }

  return NextResponse.json({ received: true })
}
