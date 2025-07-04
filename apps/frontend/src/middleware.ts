import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

const protectedRoutes = ['/dashboard', '/assignors', '/payables'];
const publicRoutes = ['/login', '/signup', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route
  );

  if (!isProtectedRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      if (!decodedToken.exp || decodedToken.exp < currentTime) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }
      
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

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
}; 