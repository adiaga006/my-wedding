import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Chỉ bảo vệ route /studio
  if (!request.nextUrl.pathname.startsWith('/studio')) {
    return NextResponse.next()
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return NextResponse.next() // Dev mode: không có password thì bypass

  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    const encoded = authHeader.replace('Basic ', '')
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    const [, password] = decoded.split(':')
    if (password === adminPassword) return NextResponse.next()
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Wedding Admin"',
    },
  })
}

export const config = {
  matcher: '/studio/:path*',
}
