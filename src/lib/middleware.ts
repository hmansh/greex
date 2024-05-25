import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/app/api/auth/[...nextauth]/route";

const PROTECTED_ROUTES = [
    '/dashboard',
    '/profile',
];

const PUBLIC_ROUTES = [
    '/login'
];

export default async function middleware(request: NextRequest) {
    const session = await auth();
    console.log(session);

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (!session && isProtectedRoute) {
        const newURL = new URL('/', request.nextUrl.origin);
        return NextResponse.redirect(newURL.toString());
    }

    if (session && PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
        const absoluteURL = new URL('/dashboard', request.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }
}
