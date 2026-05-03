import { NextResponse } from 'next/server'
import { createClient, getSupabaseAdmin } from '@/lib/supabase/server'
import { auditLog } from '@/lib/security'
import type { BookingFull, BookingWithSession } from '@/lib/supabase/types'

// Look up a booking by token without string concatenation in .or().
// Tries booking_token first, falls back to confirmation_token.
function lookupByToken(supabase: any, token: string) {
  // Use two separate queries — avoids .or() string concatenation entirely.
  // Both columns are TEXT, both indexed via primary/unique constraints.
  return supabase
    .from('bookings')
    .select('*, session:session_id(id, school_id, start_date, seats_booked)')
    .eq('booking_token', token)
    .single()
    .then(({ data, error }: any) => {
      if (data) return { data, error: null }
      // Not found by booking_token — try confirmation_token
      return supabase
        .from('bookings')
        .select('*, session:session_id(id, school_id, start_date, seats_booked)')
        .eq('confirmation_token', token)
        .single()
    })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: booking, error } = await lookupByToken(supabase, token) as { data: BookingFull; error: any }

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Strip token fields from response — never expose raw tokens
  const safeBooking = {
    id: booking.id,
    student_name: booking.student_name,
    student_email: booking.student_email,
    status: booking.status,
    deposit_amount_cents: booking.deposit_amount_cents,
    created_at: booking.created_at,
    session: booking.session,
  }
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

  // Get booking with session info — no string concatenation, no SQL injection risk
  const { data: booking, error: fetchError } = await lookupByToken(supabase, token) as { data: BookingWithSession; error: any }

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
      .eq('id', booking.id)

    if (cancelError) {
      return NextResponse.json({ error: cancelError.message }, { status: 500 })
    }

    // Decrement seats_booked
    if (booking.session) {
      await supabaseAdmin
        .from('sessions')
        .update({ seats_booked: Math.max(0, (booking.session as any).seats_booked - 1) })
        .eq('id', (booking.session as any).id)
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
      .update({ status: 'confirmed' })
      .eq('id', booking.id)
      .eq('status', 'pending')

    if (confirmError) {
      return NextResponse.json({ error: confirmError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Booking confirmed' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
