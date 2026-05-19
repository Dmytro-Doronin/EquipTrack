import { NextRequest, NextResponse } from 'next/server';

import { protectedRoutes } from '@/lib/constants/routes';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const refreshToken = request.cookies.get('refresh_token')?.value;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute && !refreshToken) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
