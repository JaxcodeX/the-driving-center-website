import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * DEMO_MODE only — instant demo login bypassing magic link email requirement.
 * PIN: 0000
 *
 * Sets two cookies:
 *   demo_session  (HttpOnly) — read by middleware to grant /school-admin/* access
 *   demo_user    (plain)     — readable by JS so layout.tsx can call DB without Supabase JWT
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
  const DEMO_SCHOOL_ID = '0daea68b-06ed-445b-bf52-91d4f16b9e01'

  // 1. Get demo school by fixed ID (not email — demo mode ignores the email field)
  const schoolRes = await fetch(
    `${supabaseUrl}/rest/v1/schools?id=eq.${DEMO_SCHOOL_ID}&select=id,name,slug`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  )
  const schools: { id: string; name: string; slug: string }[] = await schoolRes.json()
  const school = schools?.[0]
  if (!school) return NextResponse.json({ error: 'Demo school not found' }, { status: 500 })

  // 2. Create or find auth user via Admin API — use demo school email
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
    const existingUser: { id: string; email: string } | undefined = (listData?.users || []).find((u: any) => u.email === demoEmail)
    if (!existingUser) return NextResponse.json({ error: 'Could not find or create user' }, { status: 500 })
    userId = existingUser.id
  }

  // 3. Link school to user + update user metadata
  await fetch(
    `${supabaseUrl}/rest/v1/schools?id=eq.${school.id}`,
    {
      method: 'PATCH',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_user_id: userId, stripe_customer_id: userId }),
    }
  )

  await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_metadata: { school_id: school.id } }),
  })

  // 4. Set cookies and return
  const response = NextResponse.json({
    success: true,
    demoMode: true,
    schoolId: school.id,
    schoolName: school.name,
    userId,
  })

  response.cookies.set('demo_session', Buffer.from(JSON.stringify({
    userId,
    schoolId: school.id,
    email: demoEmail,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })).toString('base64'), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  // Plain cookie readable by JS — so layout can get userId without Supabase auth
  response.cookies.set('demo_user', Buffer.from(JSON.stringify({
    userId,
    schoolId: school.id,
    email: demoEmail,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })).toString('base64'), {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return response
}
