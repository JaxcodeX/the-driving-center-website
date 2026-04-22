import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { booking_id } = body

  if (!booking_id) {
    return new NextResponse('booking_id required', { status: 400 })
  }

  const supabase = await createClient()
  const supabaseAdmin = await createClient()

  // Get booking + session info
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .select(`
      id, confirmation_token,
      student_email,
      student_name,
      deposit_amount_cents,
      status,
      session:session_id (
        id,
        school_id,
        start_date,
        start_time,
        location,
        session_type:session_type_id (
          name
        )
      )
    `)
    .eq('id', booking_id)
    .single() as { data: any; error: any }

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.status !== 'pending') {
    return NextResponse.json({ error: 'Booking is not pending payment' }, { status: 409 })
  }

  if (!booking.deposit_amount_cents || booking.deposit_amount_cents <= 0) {
    // No deposit needed — confirm directly
    await supabaseAdmin
      .from('bookings')
      .update({ status: 'confirmed', deposit_paid_at: new Date().toISOString() })
      .eq('id', booking_id)

    return NextResponse.json({ confirmed: true })
  }

  const stripe = getStripe()

  // Get school name for Stripe description
  const { data: school } = await supabaseAdmin
    .from('schools')
    .select('name')
    .eq('id', (booking.session as any).school_id)
    .single()

  const sessionTypeName = (booking.session as any).session_type?.name ?? 'Lesson'
  const dateStr = new Date(`${(booking.session as any).start_date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${sessionTypeName} — ${dateStr} at ${(booking.session as any).start_time}`,
            description: `${school?.name ?? 'Driving Lesson'} deposit — credited toward total`,
          },
          unit_amount: booking.deposit_amount_cents,
        },
        quantity: 1,
      },
    ],
    customer_email: booking.student_email,
    metadata: {
      booking_id: booking.id,
      session_id: (booking.session as any).id,
      school_id: (booking.session as any).school_id,
      student_email: booking.student_email,
      student_name: booking.student_name,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/book/confirmation?token=${booking.confirmation_token}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/book/cancel?token=${booking.confirmation_token}`,
  })

  await supabaseAdmin.from('audit_logs').insert(
    auditLog('STRIPE_CHECKOUT_CREATED', booking.student_email, {
      booking_id: booking.id,
      deposit_cents: booking.deposit_amount_cents,
      checkout_session_id: checkoutSession.id,
    })
  )

  return NextResponse.json({ url: checkoutSession.url })
}
