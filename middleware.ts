import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidJWT } from './lib/jwt-auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Проверяем только защищенные роуты
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isProtectedAPIRoute = (
    pathname.startsWith('/api/blog') && request.method !== 'GET'
  ) || pathname.startsWith('/api/upload');
  
  if (isAdminRoute || isProtectedAPIRoute) {
    const adminSession = request.cookies.get('admin_session')?.value;
    
    console.log(`Checking access to: ${pathname}`);
    console.log(`Session token present: ${adminSession ? 'yes' : 'no'}`);
    
    if (!adminSession || !(await isValidJWT(adminSession))) {
      console.log(`Unauthorized access attempt to: ${pathname}`);
      
      // Для админских страниц - перенаправляем на логин
      if (isAdminRoute) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Для API - возвращаем ошибку авторизации
      return NextResponse.json(
        { error: 'Unauthorized - invalid or expired session' },
        { status: 401 }
      );
    }
    
    console.log(`Authorized access to: ${pathname}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/blog/:path*',
    '/api/upload/:path*'
  ],
}; 