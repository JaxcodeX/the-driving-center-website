import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectParam = searchParams.get('redirect')
  const next = redirectParam ? `${origin}${redirectParam}` : `${origin}/dashboard`

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }

  // ── FIX: Link school to auth user after magic link click ──
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Get the authenticated user from the session
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email) {
      // Find the school this user owns (by email, unclaimed)
      const { data: school } = await supabaseAdmin
        .from('schools')
        .select('id, name')
        .eq('email', user.email)
        .is('owner_id', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (school) {
        // 1. Link school → owner
        await supabaseAdmin
          .from('schools')
          .update({ owner_id: user.id })
          .eq('id', school.id)

        // 2. Set school_id on the auth user so RLS works
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...(user.user_metadata ?? {}),
            school_id: school.id,
          },
        })

        console.log(`[Auth Callback] Linked user ${user.id} → school ${school.id} (${school.name})`)
      } else {
        // School already claimed or email doesn't match — check if this user already has a school
        const { data: existingSchool } = await supabaseAdmin
          .from('schools')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1)
          .single()

        if (!existingSchool) {
          console.log(`[Auth Callback] No unclaimed school found for email ${user.email} — user may already be linked`)
        }
      }
    }
  } catch (err) {
    // Non-fatal: don't break the auth flow if DB link fails
    console.error('[Auth Callback] School linking error:', err)
  }
  // ── End FIX ──

  return NextResponse.redirect(next)
}
