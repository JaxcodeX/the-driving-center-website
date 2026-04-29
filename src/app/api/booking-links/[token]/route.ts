import { NextResponse } from 'next/server'
import { createClient, getSupabaseAdmin } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'
import type { BookingFull, BookingWithSession } from '@/lib/supabase/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id,
      student_name,
      student_email,
      status,
      deposit_amount_cents,
      created_at,
      confirmation_token,
      session:session_id (
        id,
        start_date,
        location,
        session_type:session_type_id (
          name,
          duration_minutes,
          price_cents,
          deposit_cents
        ),
        instructor:instructor_id (
          name
        )
      )
    `)
    .eq('confirmation_token', token)
    .single() as { data: BookingFull; error: any }

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Never expose the token in responses
  const { confirmation_token: _, ...safeBooking } = booking
  return NextResponse.json(safeBooking)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await request.json()
  const { action } = body // 'cancel' | 'confirm'

  if (!token || !action) {
    return NextResponse.json({ error: 'Token and action required' }, { status: 400 })
  }

  const supabase = await createClient()
  const supabaseAdmin = getSupabaseAdmin() as any

  // Get booking with session info
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, session:session_id(id, school_id, start_date, seats_booked)')
    .eq('confirmation_token', token)
    .single() as { data: BookingWithSession; error: any }

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking already cancelled' }, { status: 409 })
  }

  if (action === 'cancel') {
    const { error: cancelError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: body.reason ?? 'Customer cancelled',
      })
      .eq('confirmation_token', token)

    if (cancelError) {
      return NextResponse.json({ error: cancelError.message }, { status: 500 })
    }

    // Decrement seats_booked
    if (booking.session) {
      await supabaseAdmin
        .from('sessions')
        .update({ seats_booked: Math.max(0, booking.session.seats_booked - 1) })
        .eq('id', booking.session.id)
    }

    await supabaseAdmin.from('audit_logs').insert(
      auditLog('BOOKING_CANCELLED', booking.student_email, {
        booking_id: booking.id,
        reason: body.reason ?? 'Customer cancelled',
      })
    )

    return NextResponse.json({ success: true, message: 'Booking cancelled' })
  }

  if (action === 'confirm') {
    const { error: confirmError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'confirmed',
      })
      .eq('confirmation_token', token)
      .eq('status', 'pending')

    if (confirmError) {
      return NextResponse.json({ error: confirmError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Booking confirmed' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
