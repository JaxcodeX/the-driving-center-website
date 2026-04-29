import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/bookings/[token] — look up a booking by its confirmation_token
// Used by /book/confirmation after Stripe deposit payment
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  if (!token) {
    return new NextResponse('Token required', { status: 400 })
  }

  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      id,
      student_name,
      student_email,
      student_phone,
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
          color
        ),
        instructor:instructor_id (
          name
        ),
        school:school_id (
          name
        )
      )
    `)
    .eq('confirmation_token', token)
    .single()

  if (error || !booking) {
    return new NextResponse('Booking not found', { status: 404 })
  }

  return NextResponse.json(booking)
}
