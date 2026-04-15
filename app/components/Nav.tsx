"use client";

import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Wallet, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { User, UserResponse, Session, AuthChangeEvent } from "@supabase/supabase-js";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";

export default function Nav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    console.log("Nav: Supabase client initialized");
    
    // Check current session
    supabase.auth.getUser().then((response: UserResponse) => {
      console.log("Nav: getUser response:", response);
      setUser(response.data?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth state changes (login/logout events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      console.log("Nav: auth state changed:", _event, session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
                    className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                    title="Manage Tiers"
                  >
                    <ShieldCheck size={14} />
                    <span className="hidden sm:inline">Subscription</span>
                  </Link>
                  <div className="hidden md:block">
                    <LogoutButton />
                  </div>
                </>
              ) : null}
            </>
          )}

          <Link
            href="/request"
            className="btn-minimal flex items-center rounded-full px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-premium ml-2"
          >
            {user ? "New Request" : "Book Now"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
