/**
 * Subscription Status Middleware + Demo Auth
 *
 * /school-admin/* routes:
 * - DEMO_MODE: accepts demo_session cookie (PIN 0000 login flow)
 * - Non-DEMO_MODE: requires Supabase auth session + checks subscription_status
 *
 * /instructor/* routes:
 * - DEMO_MODE: accepts demo_session cookie
 * - Non-DEMO_MODE: requires Supabase auth session + instructor record exists
 */
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Handle demo_session cookie (used by both /school-admin and /instructor) ──
  if (process.env.DEMO_MODE === 'true') {
    const demoCookie = request.cookies.get('demo_session')
    if (demoCookie) {
      try {
        const session = JSON.parse(Buffer.from(demoCookie.value, 'base64').toString('utf8'))
        if (session.exp > Date.now()) {
          const response = NextResponse.next()
          response.headers.set('x-school-id', session.schoolId)
          response.headers.set('x-user-id', session.userId)
          response.headers.set('x-subscription-status', 'trial')

          // For instructor routes, resolve instructor from user email
          if (pathname.startsWith('/instructor')) {
            const email = session.email ?? ''
            if (email) {
              try {
                const admin = createClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL!,
                  process.env.SUPABASE_SERVICE_ROLE_KEY!
                )
                const { data: instructor } = await (admin as any)
                  .from('instructors')
                  .select('id')
                  .eq('email', email)
                  .maybeSingle()
                if (instructor) {
                  response.headers.set('x-instructor-id', instructor.id)
                }
              } catch {
                // Gracefully continue without instructor header
              }
            }
          }

          return response
        }
      } catch {
        // Invalid demo cookie — clear it and fall through to login
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('demo_session')
        return response
      }
    }
    // No demo cookie in DEMO_MODE for instructor routes → redirect to login
    if (pathname.startsWith('/instructor')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('demo', 'true')
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── Guard /school-admin/* routes ──────────────────────────────────────────
  if (pathname.startsWith('/school-admin')) {
    // DEMO_MODE handling already happened above — if we get here without a
    // valid demo cookie and DEMO_MODE is true, redirect to login.
    if (process.env.DEMO_MODE === 'true') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('demo', 'true')
      return NextResponse.redirect(loginUrl)
    }

    // Non-DEMO_MODE: Full auth + subscription check
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
            })
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const schoolId = user.user_metadata?.school_id
    if (!schoolId) return NextResponse.next()

    // Use service role key — bypasses RLS so we can read any school's status
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: school } = await adminClient
      .from('schools')
      .select('subscription_status')
      .eq('id', schoolId)
      .single()

    const status = school?.subscription_status

    if (status === 'active' || status === 'trial') {
      const response = NextResponse.next()
      response.headers.set('x-school-id', schoolId)
      response.headers.set('x-user-id', user.id)
      response.headers.set('x-subscription-status', status ?? 'unknown')
      return response
    }

    if (status === 'canceled' || status === 'past_due' || status === 'cancelled') {
      const billingUrl = new URL('/school-admin/billing', request.url)
      billingUrl.searchParams.set('reason', status)
      return NextResponse.redirect(billingUrl)
    }

    console.warn(`[middleware] Unknown subscription_status for school ${schoolId}: ${status}`)
    return NextResponse.next()
  }

  // ── Guard /instructor/* routes ────────────────────────────────────────────
  if (pathname.startsWith('/instructor')) {
    // DEMO_MODE handling already happened above
    if (process.env.DEMO_MODE === 'true') {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('demo', 'true')
      return NextResponse.redirect(loginUrl)
    }

    // Non-DEMO_MODE: require Supabase auth session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
            })
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Resolve instructor from user email
    if (user.email) {
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data: instructor } = await (adminClient as any)
        .from('instructors')
        .select('id, school_id')
        .eq('email', user.email)
        .maybeSingle()

      if (instructor) {
        const response = NextResponse.next()
        response.headers.set('x-instructor-id', instructor.id)
        response.headers.set('x-school-id', instructor.school_id)
        response.headers.set('x-user-id', user.id)
        return response
      }
    }

    // If we can't resolve an instructor, still allow access but without instructor headers
    // The page/API will handle unauthorized gracefully
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/school-admin/:path*', '/instructor/:path*'],
}
