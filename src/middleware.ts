import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect these routes — require valid session
  const protectedPaths = ['/dashboard', '/admin', '/api/admin']
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (!isProtected) return NextResponse.next()

  // Create Supabase client to verify session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          const response = NextResponse.next()
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // School ID from user metadata — attach to headers for downstream use
  const schoolId = user.user_metadata?.school_id
  const response = NextResponse.next()
  if (schoolId) {
    response.headers.set('x-school-id', schoolId)
  }
  response.headers.set('x-user-id', user.id)
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/school-admin/:path*', '/admin/:path*', '/api/admin/:path*', '/api/school-admin/:path*'],
}
