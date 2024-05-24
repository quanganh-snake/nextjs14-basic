import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/profile']
const authPaths = ['/login', '/register']
export function middleware(request: NextRequest) {
  let sessionToken = request.cookies.get('sessionToken')?.value
  const { pathname } = request.nextUrl
  console.log('check');

  // Chưa đăng nhập thì không cho vào các privatePaths
  if (privatePaths.some(path => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Đã đăng nhập thì không cho vào các authPaths
  if (authPaths.some(path => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/profile', '/login', '/register',
  ]
}