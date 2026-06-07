import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Safety check: If environment variables are missing, skip auth logic
    // and return the response to avoid 500 Internal Server Error in production.
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Proxy: Missing Supabase environment variables. Skipping auth check.')
        return supabaseResponse
    }

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
            cookieOptions: {
                name: 'sb-auth',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
                sameSite: 'lax',
            }
        }
    )

    // IMPORTANT: Avoid throwing errors here to prevent 500s.
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user && request.cookies.has('sb-auth')) {
            // User session is invalid or logged out, clear server-side cookies
            supabaseResponse.cookies.delete('sb-auth')
        }
    } catch (error) {
        console.error('Proxy: Auth check failed', error)
        if (request.cookies.has('sb-auth')) {
            supabaseResponse.cookies.delete('sb-auth')
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
