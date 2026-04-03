import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — allow through
  const publicPaths = ['/', '/auth', '/charities', '/draws', '/api/auth', '/api/charities', '/api/draws', '/api/webhooks'];
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // Protected routes — require auth token
  const token =
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    request.cookies.get('auth-token')?.value;

  if (!token) {
    // API routes return 401, page routes redirect to login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Admin routes — require admin role
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Auth error' }, { status: 500 });
      }
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/admin/:path*', '/api/user/:path*', '/api/scores/:path*', '/api/payments/:path*'],
};
