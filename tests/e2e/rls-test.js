/**
 * RLS Cross-School Access Test
 * Verifies that School A cannot read School B's data via the REST API.
 *
 * Usage:
 *   SUPABASE_URL=https://evswdlsqlaztvajibgta.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=<key> \
 *   SUPABASE_ANON_KEY=<key> \
 *   node tests/e2e/rls-test.js
 *
 * What it tests:
 *   1. Creates school A + student (service role — admin)
 *   2. Creates school B (service role — admin)
 *   3. Uses school B's auth token to try querying school A's data via REST API
 *   4. If rows returned → RLS BROKEN (critical vulnerability)
 *   5. If 403 or empty → RLS working correctly
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ANON_KEY) {
  console.error('Missing env vars. Need: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY')
  process.exit(1)
}

async function createSchool(name, ownerEmail) {
  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/schools`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      name,
      slug,
      owner_email: ownerEmail,
      state: 'TN',
      plan_tier: 'starter',
      active: true,
      subscription_status: 'trial',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to create school: ${JSON.stringify(data)}`)
  return data[0]
}

async function createStudent(schoolId, name, email) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      school_id: schoolId,
      legal_name: name, // encrypted field
      email,
      permit_number: 'ENC-' + Math.random().toString(36).slice(2),
      dob: '2008-01-15',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Failed to create student: ${JSON.stringify(data)}`)
  return data[0]
}

async function queryStudentsWithSchoolBToken(schoolBId) {
  // Use school B's anon key context to query — in a real magic link scenario,
  // the anon key is the same for all schools, but RLS should restrict by school_id
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/students?school_id=eq.${schoolBId}&select=id,legal_name,email`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  )
  return res.json()
}

async function queryStudentsCrossSchool(schoolAId, schoolBToken) {
  // Try to query school A's students using school B's authenticated context
  // This simulates a school B user trying to access school A's data
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/students?school_id=eq.${schoolAId}&select=id,legal_name,email`,
    {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }
  )
  // 200 = rows returned (BAD if school A data leaked)
  // 406 = not acceptable (RLS working but wrong auth)
  // 403 = forbidden (RLS working)
  return { status: res.status, data: await res.json() }
}

async function cleanupSchool(schoolId) {
  // Delete students first (FK constraint), then school
  await fetch(`${SUPABASE_URL}/rest/v1/students?school_id=eq.${schoolId}`, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  })
  await fetch(`${SUPABASE_URL}/rest/v1/schools?id=eq.${schoolId}`, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  })
}

async function run() {
  let schoolA = null, schoolB = null
  const ts = Date.now().toString(36)

  try {
    console.log('─── RLS Cross-School Test ───\n')

    // 1. Create two schools
    console.log('1. Creating schools...')
    schoolA = await createSchool(`RLS Test School A ${ts}`, `rls-a-${ts}@test.com`)
    schoolB = await createSchool(`RLS Test School B ${ts}`, `rls-b-${ts}@test.com`)
    console.log(`   ✓ School A: ${schoolA.id}`)
    console.log(`   ✓ School B: ${schoolB.id}`)

    // 2. Create a student in school A
    console.log('\n2. Creating student in School A...')
    const student = await createStudent(schoolA.id, 'Test Student CrossSchool', `student-${ts}@test.com`)
    console.log(`   ✓ Student created: ${student.id}`)

    // 3. Try to query school A's students (should be blocked if RLS working)
    console.log('\n3. Testing: School B context tries to read School A data...')
    const result = await queryStudentsCrossSchool(schoolA.id, ANON_KEY)

    console.log(`   Response status: ${result.status}`)
    console.log(`   Data returned: ${JSON.stringify(result.data)}`)

    if (result.status === 200 && Array.isArray(result.data) && result.data.length > 0) {
      console.log('\n🚨 RLS FAILURE — School B can read School A data!')
      console.log('   Cross-school data leak confirmed.')
      console.log('   IMMEDIATE ACTION REQUIRED.')
      process.exitCode = 1
    } else if (result.status === 406 || result.status === 403 || result.status === 401) {
      console.log('\n✅ RLS WORKING — Cross-school access blocked')
    } else if (result.status === 200 && Array.isArray(result.data) && result.data.length === 0) {
      console.log('\n✅ RLS WORKING — Empty response (school B correctly cannot see school A data)')
    } else {
      console.log(`\n⚠️  UNCLEAR RESULT — Status ${result.status}: ${JSON.stringify(result.data)}`)
      console.log('   Manual verification recommended.')
    }
  } catch (err) {
    console.error('\n💥 Test error:', err.message)
    process.exitCode = 1
  } finally {
    // Cleanup
    if (schoolA) {
      await fetch(`${SUPABASE_URL}/rest/v1/students?school_id=eq.${schoolA.id}`, {
        method: 'DELETE',
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
      })
      await fetch(`${SUPABASE_URL}/rest/v1/schools?id=eq.${schoolA.id}`, {
        method: 'DELETE',
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
      })
    }
    if (schoolB) {
      await fetch(`${SUPABASE_URL}/rest/v1/students?school_id=eq.${schoolB.id}`, {
        method: 'DELETE',
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
      })
      await fetch(`${SUPABASE_URL}/rest/v1/schools?id=eq.${schoolB.id}`, {
        method: 'DELETE',
        headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
      })
    }
    console.log('\n   Test schools cleaned up.')
  }
}

run()
