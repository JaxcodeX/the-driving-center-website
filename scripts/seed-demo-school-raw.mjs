/**
 * Seed Demo School — raw HTTPS (bypasses supabase-js chaining issues)
 * Run: node --experimental-vm-modules scripts/seed-demo-school-raw.mjs
 * Or: npx tsx scripts/seed-demo-school-raw.ts
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
  console.log('🌱 Seeding demo school...')

  // Check existing data
  const existingStudents = await rest(`students_driver_ed?school_id=eq.${SCHOOL_ID}&select=id&limit=1`)
  if (existingStudents.data?.length > 0) {
    console.log('✅ Demo school already has data — skipping seed')
    const all = await rest(`students_driver_ed?school_id=eq.${SCHOOL_ID}&select=id`)
    const sessions = await rest(`sessions?school_id=eq.${SCHOOL_ID}&select=id`)
    const instructors = await rest(`instructors?school_id=eq.${SCHOOL_ID}&select=id`)
    console.log(`   Students: ${all.data?.length ?? 0} | Instructors: ${instructors.data?.length ?? 0} | Sessions: ${sessions.data?.length ?? 0}`)
    return
  }

  const instructorId = 'ed0b1cee-fbae-4561-b1d9-ae1621a63ef0'
  const today = new Date()
  const sessionDates = [
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  ]
  const locations = ['Highland Ave Training Lot', 'Downtown Practice Route', 'Highway 63 Loop', 'Westside Parking Zone', 'Interstate 75 On-Ramp']

  // Create sessions
  const sessionIds = []
  for (let i = 0; i < 5; i++) {
    const r = await rest('sessions', 'POST', [{ school_id: SCHOOL_ID, instructor_id: instructorId, start_date: sessionDates[i], end_date: sessionDates[i], max_seats: 4, seats_booked: i < 3 ? i : 0, status: 'scheduled', location: locations[i] }])
    if (r.status === 201 && r.data?.[0]?.id) { sessionIds.push(r.data[0].id) }
    else console.log('  Session', i+1, r.status, r.data?.message || r.data)
  }
  console.log(`✅ ${sessionIds.length} sessions created`)

  // Create students
  const students = [
    { name: 'Olivia Chen', email: 'susan.chen@gmail.com', dob: '2008-07-15', permit: 'TN-8847291035', drivingHours: 18, classroomHours: 32 },
    { name: 'Jaylen Brooks', email: 'tasha.brooks@yahoo.com', dob: '2008-03-22', permit: 'TN-7736192048', drivingHours: 6, classroomHours: 28 },
    { name: 'Priya Nair', email: 'arun.nair@outlook.com', dob: '2009-01-08', permit: 'TN-6625083159', drivingHours: 24, classroomHours: 36 },
    { name: 'Mason Torres', email: 'sofia.torres@gmail.com', dob: '2008-11-30', permit: 'TN-5513974260', drivingHours: 2, classroomHours: 10 },
  ]
  const studentIds = []
  for (const s of students) {
    const r = await rest('students_driver_ed', 'POST', [{ school_id: SCHOOL_ID, legal_name: s.name, dob: s.dob, permit_number: s.permit, parent_email: s.email, emergency_contact_name: 'On file', driving_hours: s.drivingHours, classroom_hours: s.classroomHours }])
    if (r.status === 201 && r.data?.[0]?.id) studentIds.push(r.data[0].id)
    else console.log('  Student', s.name, r.status, r.data?.message || '')
  }
  console.log(`✅ ${studentIds.length} students created`)

  // Create bookings
  const bookingConfigs = [
    { si: 0, sessIdx: 0, time: '09:00 AM', status: 'confirmed', payment: 'paid' },
    { si: 1, sessIdx: 0, time: '09:00 AM', status: 'confirmed', payment: 'paid' },
    { si: 2, sessIdx: 1, time: '11:30 AM', status: 'confirmed', payment: 'paid' },
    { si: 3, sessIdx: 2, time: '02:00 PM', status: 'pending', payment: 'pending' },
  ]
  let bookingsCreated = 0
  for (const bc of bookingConfigs) {
    const r = await rest('bookings', 'POST', [{ school_id: SCHOOL_ID, student_name: students[bc.si].name, student_email: students[bc.si].email, student_phone: '423-555-0000', session_date: sessionDates[bc.sessIdx], session_time: bc.time, session_id: sessionIds[bc.sessIdx], status: bc.status, payment_status: bc.payment, booking_token: crypto.randomUUID() }])
    if (r.status === 201) bookingsCreated++
  }
  console.log(`✅ ${bookingsCreated} bookings created`)
  console.log('\n🎉 Demo school seeded!')
}

seed().catch(console.error)