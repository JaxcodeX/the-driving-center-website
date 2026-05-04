/**
 * Seed Demo School — raw HTTPS (bypasses supabase-js chaining issues)
 * Seeds Matt Reedy's real driving school data for demo mode.
 *
 * School: The Driving Center — 130 Bus Terminal Road, Oak Ridge, TN 37830
 * Run: node --experimental-vm-modules scripts/seed-demo-school-raw.mjs
 * Or: npx tsx scripts/seed-demo-school.ts
 */
import https from 'https'
import crypto from 'crypto'
import { readFileSync } from 'fs'

const envFile = readFileSync('./.env.local', 'utf8')
for (const line of envFile.split('\n')) {
  const [key, ...vals] = line.split('=')
  if (key) process.env[key.trim()] = vals.join('=').trim()
}

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SCHOOL_ID = '0daea68b-06ed-445b-bf52-91d4f16b9e01'

function rest(table, method='GET', body=null) {
  return new Promise((resolve) => {
    const url = new URL(`https://evswdlsqlaztvajibgta.supabase.co/rest/v1/${table}`)
    const headers = { 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }
    if (body) headers['Prefer'] = 'return=representation'
    const req = https.request(url, { headers, method }, (res) => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }) }
        catch { resolve({ status: res.statusCode, data }) }
      })
    })
    req.on('error', e => resolve({ error: e.message }))
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function seed() {
  console.log('🌱 Seeding Matt Reedy\'s Driving Center demo data...')

  // Check existing data
  const existingStudents = await rest(`students_driver_ed?school_id=eq.${SCHOOL_ID}&select=id&limit=1`)
  if (existingStudents.data?.length > 0) {
    console.log('✅ Demo school already has data — skipping seed')
    const all = await rest(`students_driver_ed?school_id=eq.${SCHOOL_ID}&select=id`)
    const sessions = await rest(`sessions?school_id=eq.${SCHOOL_ID}&select=id`)
    const instructors = await rest(`instructors?school_id=eq.${SCHOOL_ID}&select=id`)
    const sessionTypes = await rest(`session_types?school_id=eq.${SCHOOL_ID}&select=id`)
    console.log(`   Students: ${all.data?.length ?? 0} | Instructors: ${instructors.data?.length ?? 0} | Sessions: ${sessions.data?.length ?? 0} | SessionTypes: ${sessionTypes.data?.length ?? 0}`)
    return
  }

  // ── 1. Update school name to Matt's real school ──────────────────────────
  const schoolUpdate = await rest('schools', 'PATCH', [{ id: SCHOOL_ID, name: 'The Driving Center', slug: 'the-driving-center' }])
  console.log(`   School name updated: ${schoolUpdate.status === 200 ? 'The Driving Center' : '⚠️ ' + schoolUpdate.status}`)

  // ── 2. Instructors ───────────────────────────────────────────────────────
  const instructorResults = []
  const instructors = [
    { name: 'Matt Reedy', email: 'matt@thedrivingcenter.org', phone: '865-482-6700' },
    { name: 'Jim Woofter', email: 'jim@thedrivingcenter.org', phone: '865-482-6700' },
  ]
  for (const inst of instructors) {
    const r = await rest('instructors', 'POST', [{
      school_id: SCHOOL_ID, name: inst.name, email: inst.email, phone: inst.phone, active: true
    }])
    if (r.status === 201 && r.data?.[0]?.id) instructorResults.push({ id: r.data[0].id, name: inst.name })
    else {
      // Already exists — fetch it
      const existing = await rest(`instructors?school_id=eq.${SCHOOL_ID}&email=eq.${encodeURIComponent(inst.email)}&select=id,name`)
      if (existing.data?.[0]) instructorResults.push({ id: existing.data[0].id, name: inst.name })
    }
  }
  console.log(`✅ ${instructorResults.length} instructors: ${instructorResults.map(i => i.name).join(', ')}`)

  // ── 3. Session Types (Matt's pricing) ────────────────────────────────────
  const sessionTypes = [
    { name: 'Driver Education', description: '30-day course — 6 classroom + 6 behind-wheel sessions', duration_minutes: 3600, price_cents: 47500, deposit_cents: 5000, color: '#06b6d4', tca_hours_credit: 30, requires_permit: true },
    { name: '4-Hour Traffic School', description: 'State-approved 4-hour driver improvement course', duration_minutes: 240, price_cents: 5000, deposit_cents: 2500, color: '#ef4444', tca_hours_credit: 4, requires_permit: false },
    { name: '8-Hour Traffic School', description: 'Extended 8-hour driver improvement course', duration_minutes: 480, price_cents: 8000, deposit_cents: 2500, color: '#f97316', tca_hours_credit: 8, requires_permit: false },
    { name: 'Private Lesson', description: 'One-on-one driving instruction', duration_minutes: 60, price_cents: 5000, deposit_cents: 2500, color: '#8b5cf6', tca_hours_credit: null, requires_permit: true },
  ]
  const sessionTypeIds = []
  for (const st of sessionTypes) {
    const r = await rest('session_types', 'POST', [{ school_id: SCHOOL_ID, ...st, active: true }])
    if (r.status === 201 && r.data?.[0]?.id) sessionTypeIds.push(r.data[0].id)
  }
  console.log(`✅ ${sessionTypeIds.length} session types created`)

  // ── 4. Sessions (next 2 weeks, mix of types) ─────────────────────────────
  const today = new Date()
  const sessionDates = [
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 13 * 24 * 60 * 60 * 1000),
  ]
  const dateStrs = sessionDates.map(d => d.toISOString().split('T')[0])

  // session configs: [instructorIdx, sessionTypeIdx, time, seatsBooked, location]
  const sessionConfigs = [
    [0, 0, '09:00 AM', 2, 'Highland Ave Training Lot'],
    [1, 3, '09:00 AM', 1, 'Downtown Practice Route'],
    [0, 1, '10:00 AM', 3, 'Oak Ridge High School Lot'],
    [1, 0, '01:00 PM', 1, 'Highland Ave Training Lot'],
    [0, 3, '02:00 PM', 0, 'Westside Parking Zone'],
    [1, 2, '09:00 AM', 2, 'Highland Ave Training Lot'],
    [0, 1, '10:00 AM', 1, 'Oak Ridge High School Lot'],
    [1, 0, '01:00 PM', 0, 'Downtown Practice Route'],
    [0, 3, '09:00 AM', 1, 'Highland Ave Training Lot'],
    [1, 1, '10:00 AM', 0, 'Westside Parking Zone'],
  ]

  const sessionIds = []
  for (let i = 0; i < sessionConfigs.length; i++) {
    const [instIdx, stIdx, time, booked, loc] = sessionConfigs[i]
    const r = await rest('sessions', 'POST', [{
      school_id: SCHOOL_ID,
      instructor_id: instructorResults[instIdx].id,
      session_type_id: sessionTypeIds[stIdx],
      start_date: dateStrs[i],
      end_date: dateStrs[i],
      start_time: time,
      end_time: time === '01:00 PM' ? '02:00 PM' : time === '02:00 PM' ? '03:00 PM' : '12:00 PM',
      max_seats: 4,
      seats_booked: booked,
      status: 'scheduled',
      location: loc,
    }])
    if (r.status === 201 && r.data?.[0]?.id) sessionIds.push(r.data[0].id)
    else console.log('  Session', i+1, r.status, r.data?.message || '')
  }
  console.log(`✅ ${sessionIds.length} sessions created`)

  // ── 5. Students ───────────────────────────────────────────────────────────
  const students = [
    {
      name: 'Marcus Rivera', email: 'marcus.rivera@oakridge.org', dob: '2008-04-12', permit: 'TN-7738192048',
      drivingHours: 12, classroomHours: 24, enrollmentOffset: -45,
      emergencyName: 'Carmen Rivera', emergencyPhone: '865-555-0142',
    },
    {
      name: 'Jessica Thompson', email: 'jess.thompson@gmail.com', dob: '2007-09-25', permit: 'TN-8847291035',
      drivingHours: 36, classroomHours: 36, enrollmentOffset: -90, certificateIssued: true,
      emergencyName: 'Diane Thompson', emergencyPhone: '865-555-0231',
    },
    {
      name: 'Tyler Anderson', email: 't.anderson@knox.edu', dob: '2009-02-08', permit: 'TN-6625083159',
      drivingHours: 0, classroomHours: 6, enrollmentOffset: -5,
      emergencyName: 'Sandra Anderson', emergencyPhone: '865-555-0389',
    },
    {
      name: 'Naomi Patel', email: 'naomi.patel@outlook.com', dob: '2008-06-30', permit: 'TN-5513974260',
      drivingHours: 30, classroomHours: 36, enrollmentOffset: -60, readyForRoadTest: true,
      emergencyName: 'Priya Patel', emergencyPhone: '865-555-0477',
    },
    {
      name: 'Brandon Lee', email: 'brandon.lee@yahoo.com', dob: '2008-11-15', permit: 'TN-4402865371',
      drivingHours: 6, classroomHours: 20, enrollmentOffset: -20,
      emergencyName: 'Karen Lee', emergencyPhone: '865-555-0528',
    },
  ]

  const studentIds = []
  for (const s of students) {
    const enrollmentDate = new Date(today.getTime() + s.enrollmentOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const insertData = {
      school_id: SCHOOL_ID,
      legal_name: s.name,
      dob: s.dob,
      permit_number: s.permit,
      parent_email: s.email,
      emergency_contact_name: s.emergencyName,
      emergency_contact_phone: s.emergencyPhone,
      driving_hours: s.drivingHours,
      classroom_hours: s.classroomHours,
      enrollment_date: enrollmentDate,
    }
    if (s.certificateIssued) {
      insertData.certificate_issued_at = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    const r = await rest('students_driver_ed', 'POST', [insertData])
    if (r.status === 201 && r.data?.[0]?.id) studentIds.push(r.data[0].id)
    else console.log('  Student', s.name, r.status, r.data?.message || '')
  }
  console.log(`✅ ${studentIds.length} students created`)

  // ── 6. Bookings ───────────────────────────────────────────────────────────
  // Book some students to some sessions
  const bookingConfigs = [
    { si: 0, sessIdx: 0, time: '09:00 AM', status: 'confirmed', payment: 'paid' },   // Marcus -> Driver Ed
    { si: 4, sessIdx: 0, time: '09:00 AM', status: 'confirmed', payment: 'paid' },   // Brandon -> Driver Ed
    { si: 1, sessIdx: 1, time: '09:00 AM', status: 'confirmed', payment: 'paid' },   // Jessica -> Private
    { si: 2, sessIdx: 2, time: '10:00 AM', status: 'confirmed', payment: 'paid' },   // Tyler -> Traffic School
    { si: 3, sessIdx: 3, time: '01:00 PM', status: 'confirmed', payment: 'paid' },   // Naomi -> Driver Ed
    { si: 4, sessIdx: 5, time: '09:00 AM', status: 'pending', payment: 'pending' },   // Brandon -> Traffic School 8hr
  ]
  let bookingsCreated = 0
  for (const bc of bookingConfigs) {
    const r = await rest('bookings', 'POST', [{
      school_id: SCHOOL_ID,
      student_email: students[bc.si].email,
      student_name: students[bc.si].name,
      student_phone: students[bc.si].emergencyPhone,
      session_id: sessionIds[bc.sessIdx],
      session_date: dateStrs[bc.sessIdx],
      session_time: bc.time,
      status: bc.status,
      payment_status: bc.payment,
      deposit_amount_cents: bc.payment === 'paid' ? 5000 : 0,
      booking_token: crypto.randomUUID(),
    }])
    if (r.status === 201) bookingsCreated++
  }
  console.log(`✅ ${bookingsCreated} bookings created`)

  console.log('\n🎉 Matt Reedy\'s Driving Center demo seeded!')
  console.log(`   School: The Driving Center — 130 Bus Terminal Road, Oak Ridge, TN 37830`)
  console.log(`   Students: ${studentIds.length} | Instructors: ${instructorResults.length} | Sessions: ${sessionIds.length} | SessionTypes: ${sessionTypeIds.length}`)
}

seed().catch(console.error)