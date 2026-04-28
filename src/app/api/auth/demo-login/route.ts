import { NextResponse } from 'next/server'
import { createHmac, randomBytes } from 'crypto'

/**
 * DEMO_MODE only — instant demo login bypassing magic link email requirement.
 * PIN: 0000
 *
 * Sets three cookies:
 *   demo_session  (HttpOnly) — custom session marker, read by middleware
 *   demo_user     (plain)    — readable by JS for schoolId
 *   sb-<project>-access-token — real Supabase JWT so createClient() queries work
 */
export async function POST(request: Request) {
  if (process.env.DEMO_MODE !== 'true') {
    return NextResponse.json({ error: 'Demo only' }, { status: 403 })
  }

  const { email, pin } = await request.json()

  if (pin !== '0000') return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  // SUPABASE_JWT_SECRET is the HMAC secret for signing client JWTs.
  // Fall back to service role key if not set (e.g. old Vercel deployments).
  const jwtSecret = process.env.SUPABASE_JWT_SECRET ?? serviceKey!
  const DEMO_SCHOOL_ID = '0daea68b-06ed-445b-bf52-91d4f16b9e01'
  const projectRef = supabaseUrl.split('//')[1]!.split('.')[0]!

  // 1. Get demo school
  const schoolRes = await fetch(
    `${supabaseUrl}/rest/v1/schools?id=eq.${DEMO_SCHOOL_ID}&select=id,name,slug`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  )
  const schools: { id: string; name: string; slug: string }[] = await schoolRes.json()
  const school = schools?.[0]
  if (!school) return NextResponse.json({ error: 'Demo school not found' }, { status: 500 })

  // 2. Create or find auth user
  const demoEmail = 'autotest1777248097@demo-test.com'
  let userId: string
  const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ email: demoEmail, email_confirm: true, user_metadata: { school_id: school.id } }),
  })

  if (createRes.ok) {
    const newUser: { id: string } = await createRes.json()
    userId = newUser.id
  } else {
    const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    })
    const listData = await listRes.json()
    const existingUser: { id: string } | undefined = (listData?.users || []).find((u: any) => u.email === demoEmail)
    if (!existingUser) return NextResponse.json({ error: 'Could not find or create user' }, { status: 500 })
    userId = existingUser.id
  }

  // 3. Link school to user
  await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/schools?id=eq.${school.id}`, {
      method: 'PATCH',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_user_id: userId, stripe_customer_id: userId }),
    }),
    fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_metadata: { school_id: school.id } }),
    }),
  ])

  // 4. Create a real Supabase JWT for the session cookie
  // Supabase uses HS256 with SUPABASE_JWT_SECRET
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 7 * 24 * 60 * 60 // 7 days

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: `${supabaseUrl}/auth/v1`,
    sub: userId,
    aud: 'authenticated',
    exp,
    iat: now,
    email: demoEmail,
    role: 'authenticated',
    cust_uid: userId,
  })).toString('base64url')

  const sig = createHmac('sha256', jwtSecret)
    .update(`${header}.${payload}`)
    .digest('base64url')

  const jwt = `${header}.${payload}.${sig}`

  // 5. Build response with all cookies
  const response = NextResponse.json({
    success: true,
    demoMode: true,
    schoolId: school.id,
    schoolName: school.name,
    userId,
  })

  // Supabase JWT session cookie — makes createClient() work in browser
  response.cookies.set(`sb-${projectRef}-access-token`, jwt, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  // Refresh token (simplified — stores expiry, browser-side jose lib handles actual refresh)
  const refreshPayload = Buffer.from(JSON.stringify({
    token: jwt,
    expiresAt: exp * 1000,
    expires: exp,
    email: demoEmail,
    lastRefreshedAt: now * 1000,
  })).toString('base64url')
  response.cookies.set(`sb-${projectRef}-refresh-token`, refreshPayload, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  // Custom demo markers
  const demoPayload = Buffer.from(JSON.stringify({
    userId,
    schoolId: school.id,
    email: demoEmail,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })).toString('base64')

  response.cookies.set('demo_session', demoPayload, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  response.cookies.set('demo_user', demoPayload, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return response
}
