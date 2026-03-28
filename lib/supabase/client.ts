import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If environment variables are missing during SSR or hydration, return an empty/dummy client
    // to prevent the application from crashing.
    if (!supabaseUrl || !supabaseAnonKey) {
        if (typeof window !== 'undefined') {
            console.warn('Supabase client: Missing environment variables.')
        }
        // Return a minimal proxy that won't throw on standard method calls
        return new Proxy({} as any, {
            get: (target, prop) => {
                if (prop === 'auth') return { getUser: async () => ({ data: { user: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) }
                return () => ({ from: () => ({ select: () => ({ order: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }) }) }) })
            }
        })
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    )
}
