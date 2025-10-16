import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only if user is admin
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/posts/:path*',
    '/admin/settings/:path*'
  ]
}
