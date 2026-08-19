import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If env vars are missing, pass through immediately
    if (!supabaseUrl || !supabaseAnonKey) {
        return supabaseResponse
    }

    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some(c => 
        c.name.startsWith('sb-') || c.name.includes('auth-token')
    );

    // If guest or static request, return immediately (< 1ms)
    if (!hasAuthCookie) {
        return supabaseResponse;
    }

    // Fast cookie refresher
    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Non-blocking background session validation for protected API routes only
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith('/api/protected')) {
        try {
            await supabase.auth.getUser();
        } catch {
            // Ignore failure on edge
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
}
