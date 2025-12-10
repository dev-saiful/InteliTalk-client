import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/change-password", "/guest"]

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected dashboard routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/teacher") || pathname.startsWith("/student")) {
    // TODO: Add authentication check here
    // You would typically check for a session/token
    // Example: const token = request.cookies.get('auth-token')?.value
    // if (!token) return NextResponse.redirect(new URL('/login', request.url))

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon).*)"],
}
