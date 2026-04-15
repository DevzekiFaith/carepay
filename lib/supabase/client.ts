import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If environment variables are missing during SSR or hydration, return a safe proxy
    // that effectively "does nothing" but prevents the application from crashing.
    if (!supabaseUrl || !supabaseAnonKey) {
        if (typeof window !== 'undefined') {
            console.error('Supabase: Missing env variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.');
        }

        // Infinite Proxy: Any access returns a function that returns the same proxy
        const createSafeProxy = (): any => {
            const proxy: any = new Proxy(() => proxy, {
                get: (target, prop) => {
                    if (prop === 'then') {
                        // Return a function that behaves like a promise that never resolves
                        return (resolve: any) => new Promise(() => {});
                    }
                    if (prop === 'auth') return proxy;
                    if (prop === 'data') return { 
                        user: null, 
                        session: null,
                        subscription: { unsubscribe: () => {} }
                    }; // Return structured data with safe unsubscribe
                    if (prop === 'error') return null;
                    return proxy;
                }
            });
            return proxy;
        };
        
        return createSafeProxy();
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            },
            cookieOptions: {
                name: 'sb-auth',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                domain: '',
                path: '/',
                sameSite: 'lax'
            }
        }
    )
}
