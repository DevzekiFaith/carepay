"use client";

import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Wallet, Zap, ShoppingCart, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { User, UserResponse, Session, AuthChangeEvent } from "@supabase/supabase-js";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";
import { useCart } from "@/lib/cart";

export default function Nav() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const supabase = createClient();
    console.log("Nav: Supabase client initialized");
    
    const fetchUserAndRole = async () => {
      try {
        // Add a 5s timeout to the auth check (resolve instead of reject to prevent uncaught runtime errors)
        const timeout = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 5000));
        const getUser = supabase.auth.getUser();
        const response = (await Promise.race([getUser, timeout])) as any;
        
        if (response && 'timeout' in response) {
          console.warn("Nav: Authentication check timed out. Proceeding as guest.");
          setUser(null);
          setRole(null);
          return;
        }

        const user = response?.data?.user ?? null;
        setUser(user);
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          if (profile) setRole(profile.role);
        }
      } catch (err) {
        console.error("Nav auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRole();

    // Subscribe to auth state changes with error handling
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
        try {
          setUser(session?.user ?? null);
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();
            if (profile) setRole(profile.role);
          } else {
            setRole(null);
          }
          setLoading(false);
        } catch (err) {
          console.error("Auth state change error:", err);
          setLoading(false);
        }
      });
      subscription = sub;
    } catch (err) {
      console.error("Failed to subscribe to auth changes:", err);
      setLoading(false);
    }

    return () => {
      try {
        subscription?.unsubscribe?.();
      } catch (err) {
        console.error("Failed to unsubscribe:", err);
      }
    };
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-background/50 backdrop-blur-xl transition-all"
      aria-label="Main"
    >
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-12 relative z-10">
        <Logo 
          size="sm" 
          href="/" 
          className="transition-opacity hover:opacity-80"
          aria-label="HomeCare home"
        />
        <div className="flex items-center gap-2 sm:gap-4">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800/50" />
          ) : (
            <>
              {user ? (
                <>
                  {pathname !== "/" && (
                    <Link
                      href="/customer/wallet"
                      className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                      title="Your Wallet"
                    >
                      <Wallet size={14} />
                      <span>Wallet</span>
                    </Link>
                  )}
                  <Link
                    href="/customer/dashboard"
                    className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <Link
                    href="/customer/subscription"
                    className="hidden lg:flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                    title="Manage Tiers"
                  >
                    <ShieldCheck size={14} />
                    <span className="hidden sm:inline">Subscription</span>
                  </Link>
                  {role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-2 rounded-full px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-widest font-black text-white bg-orange-600 hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] animate-pulse hover:animate-none"
                    >
                      <Shield size={14} className="fill-white" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <div className="hidden md:block">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/customer/login"
                  className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                >
                  <span>Login</span>
                </Link>
              )}
            </>
          )}

          <Link
            href="/store"
            className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors mr-1"
          >
            <Zap size={14} className="text-brand-primary" />
            <span>Store</span>
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-brand-primary hover:border-brand-primary/30 hover:bg-brand-primary/10 transition-all mr-1"
            title="Shopping Cart"
          >
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span suppressHydrationWarning className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-background text-[9px] font-extrabold ring-2 ring-background animate-in zoom-in duration-200">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          <Link
            href="/request"
            className="btn-minimal flex items-center rounded-full px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-premium"
          >
            {user ? "New Request" : "Book Now"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
