import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * DEMO_MODE only — instant demo login bypassing magic link email requirement.
 * PIN: 0000
 *
 * Flow: Validate PIN → Find school by email → Create/find auth user via Admin API
 *        → Write demo_session cookie → Redirect to /school-admin
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

  // 1. Find school by owner_email
  const schoolRes = await fetch(
    `${supabaseUrl}/rest/v1/schools?owner_email=eq.${encodeURIComponent(email)}&limit=1&select=id,name`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  )
  const schools = await schoolRes.json()
  const school: { id: string; name: string } | undefined = schools?.[0]
  if (!school) {
    return NextResponse.json({ error: 'No school found for that email. Complete signup first.' }, { status: 404 })
  }

  // 2. Try to create auth user via Admin API (fails if already exists)
  let userId: string
  const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify({ email, email_confirm: true, user_metadata: { school_id: school.id } }),
  })

  if (createRes.ok) {
    const newUser = await createRes.json()
    userId = (newUser as { id: string }).id
  } else {
    // User already exists — find by email from user list
    const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    })
    const listData = await listRes.json()
    const existingUser = (listData?.users || []).find((u: { email: string }) => u.email === email)
    if (!existingUser) return NextResponse.json({ error: 'Could not find or create user' }, { status: 500 })
    userId = (existingUser as { id: string }).id
  }

  // 3. Link school to user + set user metadata
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

  // 4. Set demo session cookie (middleware reads this for /school-admin/* access)
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
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  })).toString('base64'), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return response
}
