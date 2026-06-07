"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, ShieldCheck, Wallet, LogOut, ShoppingBag, ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (err) {
        console.error("Mobile nav auth check failed:", err);
      }
    };
    checkUser();

    let subscription: { unsubscribe: () => void } | null = null;
    try {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        try {
          setUser(session?.user ?? null);
        } catch (err) {
          console.error("Mobile nav auth state change error:", err);
        }
      });
      subscription = sub;
    } catch (err) {
      console.error("Mobile nav failed to subscribe to auth changes:", err);
    }

    return () => {
      try {
        subscription?.unsubscribe?.();
      } catch (err) {
        console.error("Mobile nav failed to unsubscribe:", err);
      }
    };
  }, [supabase]);

  const handleLogout = async () => {
    try {
      const toastId = toast.loading("Logging out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Logged out", { id: toastId });
      
      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Hard redirect is the most reliable way to clear all React state and caches
      window.location.href = "/";
    } catch (err) {
      console.error("Mobile logout failed:", err);
      window.location.href = '/';
    }
  };

  // Base nav items visible to everyone
  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Store", href: "/store", icon: ShoppingBag },
  ];

  // Add logged-in-only items
  if (user) {
    navItems.push(
      { label: "Wallet", href: "/customer/wallet", icon: Wallet },
      { label: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    );
  }

  // Don't show on landing page for non-logged-in users (keep it clean)
  if (!user && pathname === '/') return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 px-4 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-between h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-brand-primary" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <item.icon 
                size={20} 
                fill={isActive ? "currentColor" : "none"} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-brand-primary transition-colors"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span suppressHydrationWarning className="absolute -top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-background text-[8px] font-extrabold">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-widest">Cart</span>
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-rose-500 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}
