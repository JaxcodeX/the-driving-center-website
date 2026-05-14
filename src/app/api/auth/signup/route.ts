import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'

/**
 * POST /api/auth/signup
 *
 * Creates a Supabase auth user AND a school record in one atomic flow.
 * Supports both DEMO_MODE and production signups.
 *
 * Body: { schoolName, ownerName, email, password }
 *
 * Response:
 *   DEMO_MODE: { success, schoolId, slug, demoMode }
 *   Production: { success, schoolId, slug }
 *
 * The client should then:
 *   DEMO_MODE: redirect to /school-admin/onboarding
 *   Production: sign in with password → redirect to /school-admin/onboarding
 */
export async function POST(request: Request) {
  const body = await request.json()
  const { schoolName, ownerName, email, password } = body

  if (!schoolName || !email) {
    return NextResponse.json({ error: 'schoolName and email required' }, { status: 400 })
  }

  const admin: any = getSupabaseAdmin()
  const slug = schoolName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) + '-' + Date.now().toString(36)

  // ── DEMO MODE: skip auth user creation ────────────────────────────────
  if (process.env.DEMO_MODE === 'true') {
    const { data: existing } = await admin
      .from('schools')
      .select('id')
      .eq('owner_email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'A school with this email already exists' }, { status: 409 })
    }

    const { data: school, error: schoolError } = await admin
      .from('schools')
      .insert({
        name: schoolName,
        slug,
        owner_email: email,
        owner_name: ownerName ?? null,
        plan_tier: 'starter',
        subscription_status: 'trial',
        active: true,
      })
      .select('id, name, slug')
      .single()

    if (schoolError || !school) {
      return NextResponse.json({ error: schoolError?.message ?? 'Failed to create school' }, { status: 500 })
    }

    // Send welcome email (stubs in demo mode without RESEND_API_KEY)
    try {
      await sendWelcomeEmail(email, schoolName, school.id)
    } catch {
      console.log('[signup] Welcome email send failed (non-blocking)')
    }

    return NextResponse.json({
      success: true,
      schoolId: school.id,
      slug: school.slug,
      demoMode: true,
    })
  }

  // ── PRODUCTION MODE: create auth user + school ─────────────────────────

  // 1. Create Supabase auth user
  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password: password || undefined,
    email_confirm: true,
    user_metadata: { owner_name: ownerName, school_name: schoolName },
  })

  if (authError) {
    if (authError.message?.includes('already registered')) {
      return NextResponse.json({ error: 'An account with this email already exists. Try signing in instead.' }, { status: 409 })
    }
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  if (!authUser.user) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }

  const userId = authUser.user.id

  // 2. Check for duplicate school
  const { data: existing } = await admin
    .from('schools')
    .select('id')
    .eq('owner_email', email)
    .maybeSingle()

  if (existing) {
    // Auth user was created but school exists — clean up auth user
    await admin.auth.admin.deleteUser(userId).catch(() => {})
    return NextResponse.json({ error: 'A school with this email already exists' }, { status: 409 })
  }

  // 3. Create school
  const { data: school, error: schoolError } = await admin
    .from('schools')
    .insert({
      name: schoolName,
      slug,
      owner_email: email,
      owner_name: ownerName ?? null,
      plan_tier: 'starter',
      subscription_status: 'trial',
      active: true,
      owner_user_id: userId,
    })
    .select('id, name, slug')
    .single()

  if (schoolError || !school) {
    // Rollback: delete the auth user if school creation fails
    await admin.auth.admin.deleteUser(userId).catch(() => {})
    return NextResponse.json({ error: schoolError?.message ?? 'Failed to create school' }, { status: 500 })
  }

  // 4. Set school_id in user_metadata so RLS works immediately
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: { school_id: school.id },
  })

  // 5. Welcome email (non-blocking)
  try {
    await sendWelcomeEmail(email, schoolName, school.id)
  } catch {
    console.log('[signup] Welcome email send failed (non-blocking)')
  }

  return NextResponse.json({
    success: true,
    schoolId: school.id,
    slug: school.slug,
  })
}
