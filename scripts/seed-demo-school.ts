import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load env vars from .env.local
try {
  const envFile = readFileSync(resolve('./.env.local'), 'utf8')
  for (const line of envFile.split('\n')) {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
  }
} catch { /* ignore */ }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const admin = createClient(supabaseUrl, supabaseServiceKey)
const DEMO_SCHOOL_ID = '0daea68b-06ed-445b-bf52-91d4f16b9e01'

// ── Seed Demo School — 4 students, 3 instructors, 5 sessions ──────────────
async function seed() {
  console.log('🌱 Seeding demo school data...')

  // ── Instructors ──────────────────────────────────────────────────────────
  const instructors = [
    { name: 'Marcus Rivera', email: 'marcus.rivera@example.com', phone: '423-555-0142' },
    { name: 'Diana Okonkwo', email: 'diana.okonkwo@example.com', phone: '423-555-0198' },
    { name: 'Jake Thornton', email: 'jake.thornton@example.com', phone: '423-555-0276' },
  ]

  const instructorIds: string[] = []
  for (const inst of instructors) {
    let data = null
    try {
      const result = await admin.from('instructors').insert({
        school_id: DEMO_SCHOOL_ID,
        name: inst.name,
        email: inst.email,
        phone: inst.phone,
        active: true,
      }).select('id').single()
      data = result.data
    } catch { /* already exists */ }
    if (!data) {
      // Fetch existing
      const existing = await admin.from('instructors').select('id').eq('email', inst.email).eq('school_id', DEMO_SCHOOL_ID).single()
      if (existing.data?.id) instructorIds.push(existing.data.id)
    } else if (data?.id) {
      instructorIds.push(data.id)
    }
  }
  console.log(`✅ ${instructorIds.length} instructors`)

  // ── Sessions (this week + next week) ───────────────────────────────────
  const today = new Date()
  const sessionDates = [
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000),
  ]

  const times = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']
  const locations = ['Highland Ave Training Lot', 'Downtown Practice Route', 'Highway 63 Loop', 'Westside Parking Zone', 'Interstate 75 On-Ramp']

  const sessionIds: string[] = []
  for (let i = 0; i < sessionDates.length; i++) {
    const dateStr = sessionDates[i].toISOString().split('T')[0]
    const timeStr = times[i % times.length]
    const instIdx = i % instructorIds.length

    let data = null
    try {
      // Check if session already exists for this date/time/instructor
      const existing = await admin.from('sessions').select('id')
        .eq('school_id', DEMO_SCHOOL_ID)
        .eq('instructor_id', instructorIds[instIdx])
        .eq('start_date', dateStr)
        .single()
      if (existing.data?.id) {
        sessionIds.push(existing.data.id)
        continue
      }

      const result = await admin.from('sessions').insert({
        school_id: DEMO_SCHOOL_ID,
        instructor_id: instructorIds[instIdx],
        start_date: dateStr,
        end_date: dateStr,
        start_time: timeStr,
        end_time: '12:00 PM',
        max_seats: 4,
        seats_booked: i < 3 ? Math.floor(Math.random() * 3) : 0,
        status: 'scheduled',
        location: locations[i % locations.length],
      }).select('id').single()
      data = result.data
    } catch (e: any) {
      console.error(`   Session insert error: ${e.message}`)
    }
    if (data?.id) sessionIds.push(data.id)
  }
  console.log(`✅ ${sessionIds.length} sessions`)

  // ── Students ─────────────────────────────────────────────────────────────
  // students_driver_ed columns (verified via REST API):
  // id, legal_name, permit_number, dob, parent_email, contract_signed_url,
  // classroom_hours, driving_hours, certificate_issued_at, class_session_id,
  // created_at, permit_expiration, date_of_birth, address_street, address_city,
  // emergency_contact_name, emergency_contact_phone, school_id, enrollment_date,
  // completion_date, certificate_number, reminder_72h_sent, reminder_24h_sent
  const students = [
    { name: 'Olivia Chen', dob: '2008-07-15', permit: 'TN-8847291035', parentEmail: 'susan.chen@gmail.com', drivingHours: 18, classroomHours: 32 },
    { name: 'Jaylen Brooks', dob: '2008-03-22', permit: 'TN-7736192048', parentEmail: 'tasha.brooks@yahoo.com', drivingHours: 6, classroomHours: 28 },
    { name: 'Priya Nair', dob: '2009-01-08', permit: 'TN-6625083159', parentEmail: 'arun.nair@outlook.com', drivingHours: 24, classroomHours: 36 },
    { name: 'Mason Torres', dob: '2008-11-30', permit: 'TN-5513974260', parentEmail: 'sofia.torres@gmail.com', drivingHours: 2, classroomHours: 10 },
  ]

  const studentIds: string[] = []
  for (const student of students) {
    try {
      const existing = await admin.from('students_driver_ed').select('id')
        .eq('parent_email', student.parentEmail)
        .eq('school_id', DEMO_SCHOOL_ID)
        .single()
      if (existing.data?.id) {
        studentIds.push(existing.data.id)
        continue
      }

      const result = await admin.from('students_driver_ed').insert({
        school_id: DEMO_SCHOOL_ID,
        legal_name: student.name,
        dob: student.dob,
        permit_number: student.permit,
        parent_email: student.parentEmail,
        emergency_contact_name: 'On file',
        driving_hours: student.drivingHours,
        classroom_hours: student.classroomHours,
      }).select('id').single()
      if (result.data?.id) studentIds.push(result.data.id)
    } catch (e: any) {
      console.error(`   Student error (${student.name}): ${e.message}`)
    }
  }
  console.log(`✅ ${studentIds.length} students`)

  // ── Bookings (attach students to sessions) ───────────────────────────────
  const bookingConfigs = [
    { studentIdx: 0, sessionIdx: 0, time: '09:00 AM', status: 'confirmed', payment: 'paid' },
    { studentIdx: 1, sessionIdx: 0, time: '09:00 AM', status: 'confirmed', payment: 'paid' },
    { studentIdx: 2, sessionIdx: 1, time: '11:30 AM', status: 'confirmed', payment: 'paid' },
    { studentIdx: 3, sessionIdx: 2, time: '02:00 PM', status: 'pending', payment: 'pending' },
  ]

  let bookingsCreated = 0
  for (const bc of bookingConfigs) {
    try {
      const dateStr = sessionDates[bc.sessionIdx].toISOString().split('T')[0]
      const existing = await admin.from('bookings').select('id')
        .eq('student_email', students[bc.studentIdx].parentEmail)
        .eq('session_date', dateStr)
        .single()
      if (existing.data?.id) continue

      await admin.from('bookings').insert({
        school_id: DEMO_SCHOOL_ID,
        student_name: students[bc.studentIdx].name,
        student_email: students[bc.studentIdx].parentEmail,
        student_phone: '423-555-0000',
        session_date: dateStr,
        session_time: bc.time,
        session_id: sessionIds[bc.sessionIdx],
        status: bc.status,
        payment_status: bc.payment,
        booking_token: crypto.randomUUID(),
      })
      bookingsCreated++
    } catch { /* exists */ }
  }
  console.log(`✅ ${bookingsCreated} bookings`)

  console.log('\n🎉 Demo school seeded!')
  console.log(`   Students: ${studentIds.length} | Instructors: ${instructorIds.length} | Sessions: ${sessionIds.length}`)
  console.log(`   School ID: ${DEMO_SCHOOL_ID}`)
}

seed().catch(console.error)