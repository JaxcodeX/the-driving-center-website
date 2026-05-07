/**
 * scripts/seed-fake-students.ts
 * Generates and inserts 50 diverse fake students for stress testing.
 * Run: npx tsx scripts/seed-fake-students.ts
 *
 * Students are attached to the DEMO_SCHOOL_ID.
 * Mix of TCA completion states, ages, and enrollment dates.
 */

import { createClient } from '@supabase/supabase-js'
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

const admin = createClient(supabaseUrl, supabaseServiceKey)

// ── Fake data pools ──────────────────────────────────────────────────────────

const firstNames = [
  'Aiden', 'Amara', 'Brandon', 'Camila', 'DeShawn', 'Elena', 'Fernando', 'Grace',
  'Hassan', 'Isabella', 'Jerome', 'Kiana', 'Luis', 'Maya', 'Noah', 'Olivia',
  'Patrick', 'Queena', 'Rafael', 'Sofia', 'Tyrell', 'Uma', 'Victor', 'Wendy',
  'Xavier', 'Yasmin', 'Zach', 'Alicia', 'Ben', 'Chloe', 'Dante', 'Eva',
  'Frank', 'Gia', 'Hector', 'Iris', 'JJ', 'Kofi', 'Lena', 'Marco',
  'Nadia', 'Oscar', 'Priya', 'Quinn', 'Rosa', 'Sam', 'Tara', 'Uriel',
  'Valentina', 'Will', 'Ximena', 'Yusuf', 'Zara', 'Andre', 'Bella', 'Cole',
  'Diana', 'Ethan', 'Fatima', 'Greg', 'Hana', 'Ivan', 'Jade', 'Kai',
]

const lastNames = [
  'Anderson', 'Banerjee', 'Chen', 'Davis', 'Edwards', 'Franklin', 'Garcia', 'Hayes',
  'Ibrahim', 'Johnson', 'Kim', 'Lopez', 'Martinez', 'Nguyen', 'Okonkwo', 'Patel',
  'Quinn', 'Rodriguez', 'Singh', 'Thompson', 'Uribe', 'Vasquez', 'Williams', 'Xavier',
  'Young', 'Zahid', 'Brown', 'Wilson', 'Moore', 'Taylor', 'Thomas', 'Jackson',
  'White', 'Harris', 'Martin', 'Torres', 'Hill', 'Scott', 'Green', 'Adams',
  'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips',
  'Campbell', 'Parker', 'Evans', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers',
  'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper',
]

const emergencyFirstNames = ['Maria', 'James', 'Carmen', 'Robert', 'Angela', 'Jose', 'Linda', 'Michael', 'Sarah', 'David', 'Ashley', 'Christopher', 'Amanda', 'Daniel', 'Stephanie']
const emergencyLastNames = ['Smith', 'Johnson', 'Garcia', 'Martinez', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris']

// Tennessee area codes for realistic phone numbers
const areaCodes = ['615', '629', '731', '865', '901', '931']

const schools = [
  'Oak Ridge High School', 'Knox Central High', 'Farragut High School',
  'Bearden High School', 'West High School', 'Hardin Valley Academy',
  'Powell High School', 'Clinton High School', 'Halls High School',
  'Carter High School', 'South-Doyle High', 'Grace Christian Academy',
  'Catholic High School', 'L&N Stem Academy', 'Central High School',
]

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generatePhone(): string {
  const area = random(areaCodes)
  return `${area}-555-${String(randomInt(1000, 9999))}`
}

function generatePermit(state: string = 'TN'): string {
  const num = String(randomInt(1000000000, 9999999999))
  return `${state}-${num.slice(0, 10)}`
}

function generateEmail(firstName: string, lastName: string, domain?: string): string {
  const d = domain ?? `${random(['gmail', 'yahoo', 'outlook', 'icloud', 'protonmail'])}`
  const variants = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${randomInt(1, 99)}`,
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 99)}`,
  ]
  return `${random(variants)}@${d}.com`
}

function generateDOB(): { dob: string; age: number } {
  // Students are typically 15-18 for driver ed
  const age = randomInt(15, 17)
  const year = new Date().getFullYear() - age
  const month = randomInt(1, 12).toString().padStart(2, '0')
  const day = randomInt(1, 28).toString().padStart(2, '0')
  return { dob: `${year}-${month}-${day}`, age }
}

// ── Student archetype generator ──────────────────────────────────────────────
// Mix of TCA states to stress-test the dashboard KPIs

type TCAState = 'not_started' | 'in_progress' | 'nearly_ready' | 'ready_for_test' | 'completed'

const tcaArchetypes: Array<{
  state: TCAState
  classroomHours: number
  drivingHours: number
  weight: number // relative frequency
}> = [
  // Most students: in progress with varying hours
  { state: 'not_started',     classroomHours: randomInt(0, 4),    drivingHours: 0,           weight: 8 },
  { state: 'in_progress',      classroomHours: randomInt(5, 18),  drivingHours: randomInt(1, 4),   weight: 20 },
  { state: 'in_progress',      classroomHours: randomInt(20, 29), drivingHours: randomInt(3, 5),   weight: 12 },
  { state: 'nearly_ready',    classroomHours: 30,               drivingHours: randomInt(5, 5),   weight: 6 },
  { state: 'ready_for_test',  classroomHours: 36,               drivingHours: 6,           weight: 4 },
  { state: 'completed',       classroomHours: 36,               drivingHours: randomInt(6, 12),  weight: 4 },
]

function pickArchetype(): typeof tcaArchetypes[0] {
  const total = tcaArchetypes.reduce((s, a) => s + a.weight, 0)
  let r = Math.random() * total
  for (const a of tcaArchetypes) {
    r -= a.weight
    if (r <= 0) return a
  }
  return tcaArchetypes[0]
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🚀 Seeding 70 fake students for stress testing...\n')

  // Wipe existing demo school students first (optional — set WIPE=true to clear)
  if (process.env.WIPE === 'true') {
    console.log('🗑️  Wiping existing demo students...')
    await admin.from('students_driver_ed').delete().eq('school_id', DEMO_SCHOOL_ID)
    console.log('   Wiped.\n')
  }

  const target = 70
  const existing = await admin
    .from('students_driver_ed')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', DEMO_SCHOOL_ID)

  const existingCount = existing.count ?? 0
  console.log(`Existing demo students: ${existingCount}`)
  if (existingCount >= target) {
    console.log(`Already have ${existingCount} students. Set WIPE=true to reset.\n`)
    return
  }

  const toCreate = target - existingCount
  let created = 0
  let skipped = 0

  for (let i = 0; i < toCreate * 2 && created < toCreate; i++) {
    const firstName = random(firstNames)
    const lastName = random(lastNames)
    const email = generateEmail(firstName, lastName)
    const { dob, age } = generateDOB()

    const archetype = pickArchetype()
    const permit = generatePermit('TN')
    const enrollmentDaysAgo = randomInt(1, 90)
    const enrollmentDate = new Date(Date.now() - enrollmentDaysAgo * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    // Random permit expiration (typically 1 year from issue)
    const permitExp = new Date(new Date(dob).getTime() + (age < 16 ? 17 : 19) * 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    const insertData: Record<string, unknown> = {
      school_id: DEMO_SCHOOL_ID,
      legal_name: `${firstName} ${lastName}`,
      dob,
      permit_number: permit,
      parent_email: email,
      emergency_contact_name: `${random(emergencyFirstNames)} ${random(emergencyLastNames)}`,
      emergency_contact_phone: generatePhone(),
      classroom_hours: archetype.classroomHours,
      driving_hours: archetype.drivingHours,
      enrollment_date: enrollmentDate,
      permit_expiration: permitExp,
      address_city: random(['Oak Ridge', 'Knoxville', 'Clinton', 'Maryville', 'Lenoir City', 'Alcoa', 'Powell', 'Farragut']),
      address_street: `${randomInt(100, 9999)} ${random(['Main', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm', 'Park', 'Sunset', 'Lake', 'Hill'])} ${random(['St', 'Ave', 'Dr', 'Rd', 'Ln', 'Ct'])}`,
      reminder_72h_sent: false,
      reminder_24h_sent: false,
      dob_encrypted: null,
      permit_encrypted: null,
      class_session_id: null,
    }

    // Completed/certified students
    if (archetype.state === 'completed') {
      insertData.certificate_issued_at = new Date(Date.now() - randomInt(1, 60) * 24 * 60 * 60 * 1000).toISOString()
      insertData.completion_date = new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      insertData.certificate_number = `CERT-${randomInt(100000, 999999)}`
    }

    // Check for duplicate permit (reduces duplicates)
    const { data: dup } = await admin
      .from('students_driver_ed')
      .select('id')
      .eq('permit_number', permit)
      .single()

    if (dup) {
      skipped++
      continue
    }

    const { error } = await admin
      .from('students_driver_ed')
      .insert(insertData)

    if (error) {
      console.error(`   ❌ ${firstName} ${lastName}: ${error.message}`)
    } else {
      created++
      if (created % 10 === 0) {
        process.stdout.write(`   Created ${created}/${toCreate}... \n`)
      }
    }
  }

  console.log(`\n✅ Done: ${created} students created, ${skipped} skipped (duplicates)\n`)

  // ── Summary stats ─────────────────────────────────────────────────────────
  const { data: allStudents } = await admin
    .from('students_driver_ed')
    .select('classroom_hours, driving_hours, certificate_issued_at')

  const total = allStudents?.length ?? 0
  const certified = allStudents?.filter(s => s.certificate_issued_at).length ?? 0
  const ready = allStudents?.filter(s => (s.classroom_hours ?? 0) >= 30 && (s.driving_hours ?? 0) >= 6 && !s.certificate_issued_at).length ?? 0
  const inProgress = allStudents?.filter(s => (s.classroom_hours ?? 0) > 0 && (s.driving_hours ?? 0) < 6).length ?? 0

  console.log('── Stress test cohort ──')
  console.log(`  Total students:  ${total}`)
  console.log(`  Certified:       ${certified}`)
  console.log(`  Ready for test:  ${ready}`)
  console.log(`  In progress:     ${inProgress}`)
  console.log(`  Not started:     ${total - certified - ready - inProgress}`)
}

seed().catch(console.error)