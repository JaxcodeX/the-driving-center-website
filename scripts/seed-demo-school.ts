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

// ── Seed Matt Reedy's Driving Center — real business data ─────────────────
async function seed() {
  console.log('🌱 Seeding Matt Reedy\'s Driving Center demo data...')

  // Check if data already exists
  const existingCheck = await admin.from('students_driver_ed').select('id', { count: 'exact', head: true }).eq('school_id', DEMO_SCHOOL_ID)
  if ((existingCheck.count ?? 0) > 0) {
    console.log('✅ Demo school already has data — skipping seed')
    const allStudents = await admin.from('students_driver_ed').select('id', { count: 'exact', head: true }).eq('school_id', DEMO_SCHOOL_ID)
    const allSessions = await admin.from('sessions').select('id', { count: 'exact', head: true }).eq('school_id', DEMO_SCHOOL_ID)
    const allInstructors = await admin.from('instructors').select('id', { count: 'exact', head: true }).eq('school_id', DEMO_SCHOOL_ID)
    const allSessionTypes = await admin.from('session_types').select('id', { count: 'exact', head: true }).eq('school_id', DEMO_SCHOOL_ID)
    console.log(`   Students: ${allStudents.count ?? 0} | Instructors: ${allInstructors.count ?? 0} | Sessions: ${allSessions.count ?? 0} | SessionTypes: ${allSessionTypes.count ?? 0}`)
    return
  }

  // ── 1. Update school name ─────────────────────────────────────────────────
  await admin.from('schools').update({ name: 'The Driving Center', slug: 'the-driving-center' }).eq('id', DEMO_SCHOOL_ID)
  console.log('   School name updated: The Driving Center')

  // ── 2. Instructors ─────────────────────────────────────────────────────────
  const instructorResults: { id: string; name: string }[] = []
  const instructors = [
    { name: 'Matt Reedy', email: 'matt@thedrivingcenter.org', phone: '865-482-6700' },
    { name: 'Jim Woofter', email: 'jim@thedrivingcenter.org', phone: '865-482-6700' },
  ]
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
      const existing = await admin.from('instructors').select('id,name').eq('email', inst.email).eq('school_id', DEMO_SCHOOL_ID).single()
      if (existing.data?.id) instructorResults.push(existing.data as { id: string; name: string })
    } else if (data?.id) {
      instructorResults.push({ id: data.id, name: inst.name })
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
  const sessionTypeIds: string[] = []
  for (const st of sessionTypes) {
    try {
      const r = await admin.from('session_types').insert({ school_id: DEMO_SCHOOL_ID, ...st, active: true }).select('id').single()
      if (r.data?.id) sessionTypeIds.push(r.data.id)
    } catch { /* already exists */ }
  }
  console.log(`✅ ${sessionTypeIds.length} session types created`)

  // ── 4. Sessions (next 2 weeks) ────────────────────────────────────────────
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

  // [instructorIdx, sessionTypeIdx, time, seatsBooked, location]
  const sessionConfigs: [number, number, string, number, string][] = [
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

  const sessionIds: string[] = []
  for (let i = 0; i < sessionConfigs.length; i++) {
    const [instIdx, stIdx, time, booked, loc] = sessionConfigs[i]
    const dateStr = dateStrs[i]
    try {
      const existing = await admin.from('sessions').select('id')
        .eq('school_id', DEMO_SCHOOL_ID)
        .eq('start_date', dateStr)
        .single()
      if (existing.data?.id) {
        sessionIds.push(existing.data.id)
        continue
      }
      const endTime = time === '01:00 PM' ? '02:00 PM' : time === '02:00 PM' ? '03:00 PM' : '12:00 PM'
      const r = await admin.from('sessions').insert({
        school_id: DEMO_SCHOOL_ID,
        instructor_id: instructorResults[instIdx].id,
        session_type_id: sessionTypeIds[stIdx],
        start_date: dateStr,
        end_date: dateStr,
        start_time: time,
        end_time: endTime,
        max_seats: 4,
        seats_booked: booked,
        status: 'scheduled',
        location: loc,
      }).select('id').single()
      if (r.data?.id) sessionIds.push(r.data.id)
    } catch (e: any) {
      console.error(`   Session error (${i+1}): ${e.message}`)
    }
  }
  console.log(`✅ ${sessionIds.length} sessions created`)

  // ── 5. Students ────────────────────────────────────────────────────────────
  // students_driver_ed columns: legal_name, permit_number, dob, parent_email,
  // emergency_contact_name, emergency_contact_phone, driving_hours, classroom_hours,
  // school_id, enrollment_date, certificate_issued_at
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

  const studentIds: string[] = []
  for (const s of students) {
    const enrollmentDate = new Date(today.getTime() + s.enrollmentOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const insertData: Record<string, unknown> = {
      school_id: DEMO_SCHOOL_ID,
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
    try {
      const existing = await admin.from('students_driver_ed').select('id').eq('parent_email', s.email).eq('school_id', DEMO_SCHOOL_ID).single()
      if (existing.data?.id) {
        studentIds.push(existing.data.id)
        continue
      }
      const r = await admin.from('students_driver_ed').insert(insertData).select('id').single()
      if (r.data?.id) studentIds.push(r.data.id)
    } catch (e: any) {
      console.error(`   Student error (${s.name}): ${e.message}`)
    }
  }
  console.log(`✅ ${studentIds.length} students created`)

  // ── 6. Bookings ────────────────────────────────────────────────────────────
  // [studentIdx, sessionIdx, time, status, payment]
  const bookingConfigs: [number, number, string, string, string][] = [
    [0, 0, '09:00 AM', 'confirmed', 'paid'],    // Marcus -> Driver Ed
    [4, 0, '09:00 AM', 'confirmed', 'paid'],   // Brandon -> Driver Ed
    [1, 1, '09:00 AM', 'confirmed', 'paid'],   // Jessica -> Private
    [2, 2, '10:00 AM', 'confirmed', 'paid'],   // Tyler -> Traffic School 4hr
    [3, 3, '01:00 PM', 'confirmed', 'paid'],   // Naomi -> Driver Ed
    [4, 5, '09:00 AM', 'pending', 'pending'],   // Brandon -> Traffic School 8hr
  ]
  let bookingsCreated = 0
  for (const bc of bookingConfigs) {
    const [si, sessIdx, time, status, payment] = bc
    const dateStr = dateStrs[sessIdx]
    try {
      const existing = await admin.from('bookings').select('id')
        .eq('student_email', students[si].email)
        .eq('session_date', dateStr)
        .single()
      if (existing.data?.id) continue
      await admin.from('bookings').insert({
        school_id: DEMO_SCHOOL_ID,
        student_name: students[si].name,
        student_email: students[si].email,
        student_phone: students[si].emergencyPhone,
        session_date: dateStr,
        session_time: time,
        session_id: sessionIds[sessIdx],
        status,
        payment_status: payment,
        deposit_amount_cents: payment === 'paid' ? 5000 : 0,
        booking_token: crypto.randomUUID(),
      })
      bookingsCreated++
    } catch { /* exists */ }
  }
  console.log(`✅ ${bookingsCreated} bookings created`)

  console.log('\n🎉 Matt Reedy\'s Driving Center demo seeded!')
  console.log(`   School: The Driving Center — 130 Bus Terminal Road, Oak Ridge, TN 37830`)
  console.log(`   Phone: 865-482-6700 | Email: thedrivingcenteror@gmail.com`)
  console.log(`   Students: ${studentIds.length} | Instructors: ${instructorResults.length} | Sessions: ${sessionIds.length} | SessionTypes: ${sessionTypeIds.length}`)
}

seed().catch(console.error)