import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(`Middleware: ${request.nextUrl.pathname}, user: ${user?.id || 'none'}, confirmed: ${user?.email_confirmed_at ? 'yes' : 'no'}`);

  // Security: Auto-logout users who navigate to homepage
  if (user && request.nextUrl.pathname === '/') {
    console.log("Middleware: User found on homepage, redirecting to logout")
    const response = NextResponse.redirect(new URL('/login?logout=security', request.url))
    // Add headers to prevent caching and force logout
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  // Protect dashboard and other authenticated routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/client-portal')) {
    
    if (!user) {
      console.log("Middleware: No user, redirecting to login")
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (!user.email_confirmed_at) {
      console.log("Middleware: Email not confirmed, redirecting")
      return NextResponse.redirect(new URL('/confirm-email', request.url));
    }
    
    console.log("Middleware: User authenticated and confirmed")
  }
  
  // Skip protection for [company] routes temporarily for debugging
  // if (request.nextUrl.pathname.match(/^\/[^\/]+$/)) { 
  //   // Dynamic [company] routes - temporarily disabled
  // }

  // Redirect authenticated users away from auth pages
  if (user && user.email_confirmed_at) {
    const authPages = ['/login', '/auth', '/confirm-email']
    if (authPages.includes(request.nextUrl.pathname)) {
      console.log(`Middleware: Redirecting authenticated user from ${request.nextUrl.pathname} to /dashboard`)
      const response = NextResponse.redirect(new URL('/dashboard', request.url))
      // Add headers to prevent caching
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
