import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired and retrieve user - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  // Quality of life: Redirect logged-in users from home page to admin dashboard
  if (request.nextUrl.pathname === '/' && user) {
    const redirectUrl = new URL('/admin', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Protect admin routes - redirect unauthenticated users to login with return URL
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If user is logged in and trying to access login page, redirect to admin or return URL
  if (request.nextUrl.pathname === '/login' && user) {
    const returnUrl = request.nextUrl.searchParams.get('next') || '/admin'
    const redirectUrl = new URL(returnUrl, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     * - manifest.json (PWA manifest)
     * - icons/ (PWA icons)
     * - api/ (API routes - handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|icons|api).*)',
  ],
}
