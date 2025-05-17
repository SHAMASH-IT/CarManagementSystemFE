import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Liste des routes qui nécessitent une authentification
const protectedRoutes = [
  '/dashboard',
  '/vehicles',
  '/appointments',
  '/services',
  '/profile',
  '/users',
]

// Liste des routes publiques
const publicRoutes = [
  '/login',
  '/register',
  '/',
  '/login/forgot-password',
  '/reset-password'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Vérifier si nous sommes sur le client
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')

    // Si l'utilisateur est sur une route protégée et n'est pas authentifié
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    // Si l'utilisateur est authentifié et essaie d'accéder aux routes publiques
    if (publicRoutes.includes(pathname) && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// Configuration des routes sur lesquelles le middleware s'applique
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 