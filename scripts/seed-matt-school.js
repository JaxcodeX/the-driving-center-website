/**
 * Seed Matt's demo school with realistic-looking data.
 * Run: node scripts/seed-matt-school.js
 */
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://evswdlsqlaztvajibgta.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c3dkbHNxbGF6dHZhamliZ3RhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUzOTgzMSwiZXhwIjoyMDg1MTE1ODMxfQ.X9vg25NxO1KSYIKMjEWhUgKb7Tvgzbe097r8AlSzGOE'

const admin = createClient(SUPABASE_URL, SERVICE_KEY)
const SCHOOL_ID = '1576f434-8b52-41fb-a5c4-a21cf3b40086'
const MATT_ID = '9458ccf4-8dad-4b42-8d11-75e88da256de'
const DRIVER_ED_ID = '26c26850-91bb-4f8b-ae44-0a763ae9b2d6'
const PRIVATE_LESSON_ID = '35fb94e5-83d7-43d4-a7be-b729baa5c143'
const ROAD_TEST_ID = '00000000-0000-0000-0000-000000000022'

function futureDate(daysFromNow) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split('T')[0]
}

async function seed() {
  console.log('🧹 Clearing existing data...')
  await admin.from('bookings').delete().eq('school_id', SCHOOL_ID)
  await admin.from('sessions').delete().eq('school_id', SCHOOL_ID)
  await admin.from('students_driver_ed').delete().eq('school_id', SCHOOL_ID)
  console.log('  Cleared.\n')

  // ── Students ──────────────────────────────────────────────
  const students = [
    { name: 'Marcus Rivera', email: 'marcus.r@email.com', phone: '865-555-0101', status: 'active', dob: '2008-03-12' },
    { name: 'Sarah Chen', email: 'sarah.chen@email.com', phone: '865-555-0102', status: 'active', dob: '2007-11-28' },
    { name: 'James Wilson', email: 'james.w@email.com', phone: '865-555-0103', status: 'active', dob: '2008-06-04' },
    { name: 'Elena Rodriguez', email: 'elena.r@email.com', phone: '865-555-0104', status: 'active', dob: '2007-09-17' },
    { name: 'David Kim', email: 'david.kim@email.com', phone: '865-555-0105', status: 'enrolled', dob: '2008-01-22' },
    { name: 'Aisha Patel', email: 'aisha.p@email.com', phone: '865-555-0106', status: 'active', dob: '2007-12-08' },
    { name: 'Tyler Johnson', email: 'tyler.j@email.com', phone: '865-555-0107', status: 'completed', dob: '2007-05-30' },
    { name: 'Mia Thompson', email: 'mia.t@email.com', phone: '865-555-0108', status: 'active', dob: '2008-08-14' },
  ]

  console.log('📚 Creating students...')
  const studentIds = []
  for (const s of students) {
    const { data, error } = await admin.from('students_driver_ed').insert({
      school_id: SCHOOL_ID,
      legal_name: s.name,
      dob: s.dob,
      enrollment_date: '2026-03-15',
      permit_number: 'PENDING',
      parent_email: `parent.${s.email}`,
    }).select('id').single()
    if (error) { console.log(`  ERROR ${s.name}: ${error.message}`); studentIds.push(null) }
    else { studentIds.push(data.id); console.log(`  ✓ ${s.name}`) }
  }

  // ── Sessions ────────────────────────────────────────────────
  // Past sessions (completed)
  const pastSessions = [
    { daysAgo: 14, time: '09:00', typeId: DRIVER_ED_ID, status: 'completed', seats: 1 },
    { daysAgo: 12, time: '10:00', typeId: PRIVATE_LESSON_ID, status: 'completed', seats: 1 },
    { daysAgo: 10, time: '09:00', typeId: DRIVER_ED_ID, status: 'completed', seats: 1 },
    { daysAgo: 7,  time: '14:00', typeId: ROAD_TEST_ID, status: 'completed', seats: 1 },
    { daysAgo: 5,  time: '09:00', typeId: DRIVER_ED_ID, status: 'completed', seats: 1 },
  ]
  // Future sessions (scheduled)
  const futureSessions = [
    { daysFromNow: 2,  time: '09:00', typeId: DRIVER_ED_ID, status: 'scheduled', seats: 1 },
    { daysFromNow: 5,  time: '10:00', typeId: PRIVATE_LESSON_ID, status: 'scheduled', seats: 1 },
    { daysFromNow: 7,  time: '09:00', typeId: DRIVER_ED_ID, status: 'scheduled', seats: 1 },
    { daysFromNow: 9,  time: '14:00', typeId: ROAD_TEST_ID, status: 'scheduled', seats: 1 },
    { daysFromNow: 12, time: '09:00', typeId: DRIVER_ED_ID, status: 'scheduled', seats: 1 },
    { daysFromNow: 14, time: '10:00', typeId: PRIVATE_LESSON_ID, status: 'scheduled', seats: 1 },
  ]

  console.log('\n📅 Creating sessions...')
  const allSessions = []
  for (const s of [...pastSessions, ...futureSessions]) {
    const dateStr = s.daysAgo !== undefined
      ? (d => { const x = new Date(); x.setDate(x.getDate() + s.daysAgo); return x.toISOString().split('T')[0] })()
      : futureDate(s.daysFromNow)

    const { data, error } = await admin.from('sessions').insert({
      school_id: SCHOOL_ID,
      instructor_id: MATT_ID,
      session_type_id: s.typeId,
      start_date: dateStr,
      end_date: dateStr,
      start_time: s.time,
      status: s.status,
      max_seats: s.seats,
      seats_booked: s.seats,
    }).select('id, start_date, status').single()
    if (error) { console.log(`  ERROR: ${error.message}`); allSessions.push(null) }
    else { allSessions.push(data); console.log(`  ✓ ${s.status}: ${dateStr} ${s.time} (id: ${data.id.slice(0,8)})`) }
  }

  // ── Bookings ───────────────────────────────────────────────
  // Completed sessions → confirmed paid bookings
  // Future sessions → some confirmed, some pending
  const bookingDefs = [
    // [sessionIndex, studentIndex, deposit, status, paymentStatus, daysOffset]
    [0, 0, 5000, 'confirmed', 'paid', -14],  // Marcus, completed
    [1, 1, 2500, 'confirmed', 'paid', -12],  // Sarah, completed
    [2, 2, 5000, 'confirmed', 'paid', -10],  // James, completed
    [3, 3, 2500, 'confirmed', 'paid', -7],   // Elena, completed
    [4, 4, 5000, 'confirmed', 'paid', -5],   // David, completed
    [5, 5, 5000, 'confirmed', 'paid', 2],    // Aisha, upcoming
    [6, 6, 2500, 'confirmed', 'paid', 5],     // Tyler, upcoming
    [7, 7, 5000, 'pending', 'pending', 7],    // Mia, upcoming pending
    [8, 0, 5000, 'confirmed', 'paid', 9],     // Marcus again, upcoming
    [9, 1, 2500, 'confirmed', 'paid', 12],    // Sarah again
    [10, 2, 5000, 'confirmed', 'paid', 14],   // James again
  ]

  console.log('\n🎫 Creating bookings...')
  for (const [sessIdx, studentIdx, deposit, status, payStatus, daysOff] of bookingDefs) {
    const session = allSessions[sessIdx]
    if (!session) { console.log(`  Skipped session ${sessIdx}`); continue }
    const student = students[studentIdx]
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() + daysOff)
    const dateStr = session.start_date

    const { error } = await admin.from('bookings').insert({
      school_id: SCHOOL_ID,
      session_id: session.id,
      session_type_id: DRIVER_ED_ID,
      student_name: student.name,
      student_email: student.email,
      session_date: dateStr,
      session_time: '09:00',
      deposit_amount_cents: deposit,
      status,
      payment_status: payStatus,
      booking_token: `tok_${Math.random().toString(36).substr(2, 9)}`,
      created_at: createdAt.toISOString(),
    })
    if (error) console.log(`  ERROR ${student.name}: ${error.message}`)
    else console.log(`  ✓ ${student.name} | ${status} | $${deposit/100} | ${dateStr}`)
  }

  console.log('\n✅ Done! Dashboard should now show real-looking data.')
}

seed().catch(e => { console.error('Fatal:', e.message); process.exit(1) })