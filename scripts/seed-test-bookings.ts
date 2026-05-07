/**
 * scripts/seed-test-bookings.ts
 * Creates realistic test bookings across various states for payment flow testing.
 *
 * Run: npx tsx scripts/seed-test-bookings.ts
 */

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
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
const DEMO_SCHOOL_ID = '0daea68b-06ed-445b-bf52-91d4f16b9e01'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

type BookingState = 'pending_unpaid' | 'pending_checkout' | 'confirmed_paid' | 'cancelled' | 'expired'

const stateConfigs: Array<{
  status: BookingState
  paymentStatus: string
  depositCents: number
  count: number
}> = [
  { status: 'pending_unpaid',     paymentStatus: 'pending',   depositCents: 5000,  count: 5 },  // created, never went to checkout
  { status: 'pending_checkout',   paymentStatus: 'pending',   depositCents: 5000,  count: 3 },  // went to checkout, abandoned
  { status: 'confirmed_paid',     paymentStatus: 'paid',       depositCents: 5000,  count: 8 },  // paid + confirmed
  { status: 'cancelled',          paymentStatus: 'refunded',   depositCents: 5000,  count: 2 },  // cancelled after pay
  { status: 'expired',            paymentStatus: 'expired',   depositCents: 5000,  count: 2 },  // checkout session timed out
]

async function main() {
  console.log('🎫 Seeding test bookings...\n')

  // Get students and sessions
  const { data: students } = await supabase
    .from('students_driver_ed')
    .select('id, legal_name, parent_email')
    .eq('school_id', DEMO_SCHOOL_ID)
    .limit(30)

  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, start_date, session_type_id, instructor_id')
    .eq('school_id', DEMO_SCHOOL_ID)
    .limit(20)

  const { data: sessionTypes } = await supabase
    .from('session_types')
    .select('id, deposit_cents')
    .eq('school_id', DEMO_SCHOOL_ID)
    .limit(10)

  if (!students?.length || !sessions?.length || !sessionTypes?.length) {
    console.error('❌ Need students, sessions, and session types first. Run seed-demo-school.ts first.')
    return
  }

  let created = 0
  for (const config of stateConfigs) {
    for (let i = 0; i < config.count; i++) {
      const student = students[Math.floor(Math.random() * students.length)]
      const session = sessions[Math.floor(Math.random() * sessions.length)]
      const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)]

      const token = crypto.randomUUID()
      const confirmationToken = crypto.randomUUID()
      const futureDate = new Date(Date.now() + (i + 1) * 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

      const insertData: Record<string, unknown> = {
        school_id: DEMO_SCHOOL_ID,
        session_id: session.id,
        session_type_id: sessionType.id,
        instructor_id: session.instructor_id,
        session_date: session.start_date,
        session_time: '09:00 AM',
        student_name: student.legal_name,
        student_email: student.parent_email,
        student_phone: '865-555-0100',
        status: config.status === 'cancelled' ? 'cancelled'
              : config.status === 'expired' ? 'expired'
              : config.status === 'confirmed_paid' ? 'confirmed'
              : 'pending',
        payment_status: config.paymentStatus,
        deposit_amount_cents: config.depositCents,
        booking_token: token,
        confirmation_token: confirmationToken,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }

      if (config.status === 'cancelled') {
        insertData.cancellation_reason = 'Customer requested cancellation'
        insertData.cancelled_at = new Date().toISOString()
      }

      if (config.status === 'confirmed_paid') {
        insertData.stripe_payment_intent_id = `pi_test_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`
      }

      const { error } = await supabase.from('bookings').insert(insertData)
      if (error) {
        console.error(`   ❌ ${config.status}: ${error.message}`)
      } else {
        created++
      }
    }
    console.log(`   ✅ ${config.status}: ${config.count} bookings`)
  }

  console.log(`\n🎉 ${created} bookings created`)
  console.log('\n── Booking states in DB now ──')
  const { data: allBookings } = await supabase
    .from('bookings')
    .select('status, payment_status')
    .eq('school_id', DEMO_SCHOOL_ID)

  const counts: Record<string, number> = {}
  for (const b of allBookings ?? []) {
    const key = `${b.status}/${b.payment_status}`
    counts[key] = (counts[key] ?? 0) + 1
  }
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k}: ${v}`)
  }
}

main().catch(console.error)