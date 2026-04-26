/**
 * Subscription Status Middleware
 * Every request to /school-admin/* checks the school's subscription_status.
 * Canceled/past_due → redirect to /billing
 * DEMO_MODE skips all subscription checks.
 */
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard /school-admin/* routes
  if (!pathname.startsWith('/school-admin')) return NextResponse.next()

  // DEMO_MODE skips all subscription checks
  if (process.env.DEMO_MODE === 'true') return NextResponse.next()

  // Build the auth-aware client to get the user
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
  if (!schoolId) return NextResponse.next() // onboarding will handle missing school

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

  // active / trial — let them in
  if (status === 'active' || status === 'trial') {
    const response = NextResponse.next()
    response.headers.set('x-school-id', schoolId)
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-subscription-status', status)
    return response
  }

  // Canceled, past_due, cancelled — redirect to billing page
  if (status === 'canceled' || status === 'past_due' || status === 'cancelled') {
    const billingUrl = new URL('/school-admin/billing', request.url)
    billingUrl.searchParams.set('reason', status)
    return NextResponse.redirect(billingUrl)
  }

  // Unknown status — fail open but log
  console.warn(`[middleware] Unknown subscription_status for school ${schoolId}: ${status}`)
  return NextResponse.next()
}

export const config = {
  matcher: ['/school-admin/:path*'],
}
