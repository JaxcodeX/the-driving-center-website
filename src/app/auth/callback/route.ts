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
  // schools table: no 'owner_id' column — use 'stripe_customer_id' as owner claim token
  // (stripe_customer_id is null for unpaid schools; set to user.id when claimed)
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email) {
      // Find school by owner_email (set during /api/schools signup)
      // stripe_customer_id IS NULL = unclaimed (no user.id written yet)
      const { data: school } = await supabaseAdmin
        .from('schools')
        .select('id, name, stripe_customer_id')
        .eq('owner_email', user.email)
        .is('stripe_customer_id', null)  // only link if not already claimed
        .limit(1)
        .single()

      if (school) {
        // Claim: write user.id into stripe_customer_id as owner claim token
        await supabaseAdmin
          .from('schools')
          .update({ stripe_customer_id: user.id })
          .eq('id', school.id)

        // Set school_id on the auth user so RLS can use it via user_metadata
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          user_metadata: { school_id: school.id },
        })

        console.log(`[Auth Callback] Linked user ${user.id} → school ${school.id} (${school.name})`)
      } else {
        // School not found unclaimed — either already linked or never created
        const { data: linkedSchool } = await supabaseAdmin
          .from('schools')
          .select('id')
          .eq('stripe_customer_id', user.id)
          .limit(1)
          .single()

        if (!linkedSchool) {
          console.log(`[Auth Callback] No unclaimed school for ${user.email} — may already be linked or never created`)
        }
      }
    }
  } catch (err) {
    console.error('[Auth Callback] School linking error:', err)
  }

  return NextResponse.redirect(next)
}