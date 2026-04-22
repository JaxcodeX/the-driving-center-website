import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return new NextResponse('Missing stripe-signature header', { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new NextResponse('Invalid signature', { status: 401 })
  }

  const supabase = await createClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { metadata } = session

    const schoolId = metadata?.school_id
    const sessionId = metadata?.session_id
    const studentEmail = session.customer_details?.email ?? metadata?.student_email

    if (!studentEmail) {
      console.error('No student email in Stripe session')
      return new NextResponse('Missing student email', { status: 400 })
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

    // 2. Create student record (profile incomplete — marked via permit_number = 'PENDING')
    const { error: studentError } = await supabase.from('students_driver_ed').insert({
      parent_email: studentEmail, // parent email == student email for simplicity
      school_id: schoolId ?? null,
      permit_number: 'PENDING', // filled via complete-profile form
      dob: '2000-01-01',        // placeholder until complete-profile form
      class_session_id: sessionId ?? null,
    })

    if (studentError) {
      console.error('[Stripe Webhook] student insert failed:', studentError)
    }

    // 3. Increment seats_booked if session_id was provided
    if (sessionId) {
      await supabase.rpc('increment_seats_booked', { session_id: sessionId })
    }

    // 4. Audit log
    await supabase.from('audit_logs').insert({
      action: 'PAYMENT_COMPLETED',
      details: {
        stripe_session_id: session.id,
        student_email: studentEmail,
        school_id: schoolId,
        session_id: sessionId,
        amount: session.amount_total,
      },
    })

    // 5. Forward to n8n for email sequences, Calendly booking link, etc.
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (n8nUrl) {
      fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'checkout.session.completed',
          student_email: studentEmail,
          school_id: schoolId,
          session_id: sessionId,
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/complete-profile?session_id=${session.id}`,
        }),
      }).catch((err) => console.error('[Stripe Webhook] n8n forward failed:', err))
    }
  }

  return new NextResponse('OK')
}
