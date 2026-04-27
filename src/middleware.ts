/**
 * Subscription Status Middleware + Demo Auth
 *
 * /school-admin/* routes:
 * - DEMO_MODE: accepts demo_session cookie (PIN 0000 login flow)
 * - Non-DEMO_MODE: requires Supabase auth session + checks subscription_status
 */
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard /school-admin/* routes
  if (!pathname.startsWith('/school-admin')) return NextResponse.next()

  // ── DEMO_MODE: Check for demo_session cookie ──────────────────────────
  if (process.env.DEMO_MODE === 'true') {
    const demoCookie = request.cookies.get('demo_session')
    if (demoCookie) {
      try {
        const session = JSON.parse(Buffer.from(demoCookie.value, 'base64').toString('utf8'))
        if (session.exp > Date.now()) {
          // Valid demo session — inject user context and let through
          const response = NextResponse.next()
          response.headers.set('x-school-id', session.schoolId)
          response.headers.set('x-user-id', session.userId)
          response.headers.set('x-subscription-status', 'trial') // demo always gets trial
          response.headers.set('x-demo-mode', 'true')
          return response
        }
      } catch {
        // Invalid demo cookie — clear it and fall through to login
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('demo_session')
        return response
      }
    }
    // No demo cookie in DEMO_MODE → still let through (subscription checks skipped)
    // Auth is handled client-side via the demo-login endpoint
    return NextResponse.next()
  }

  // ── NON-DEMO_MODE: Full auth + subscription check ──────────────────────
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

export const config = {
  matcher: ['/school-admin/:path*'],
}
