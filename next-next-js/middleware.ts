import { withAuth } from 'next-auth/middleware'

export const middleware = withAuth(
  function middleware(req) {
    // You can add custom middleware logic here
    // For example, redirect non-authenticated users
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (public login page)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)',
  ],
}
