"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, ShieldCheck, Wallet, LogOut, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe?.();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Store", href: "/store", icon: ShoppingBag },
    ...(user ? [
      { label: "Wallet", href: "/customer/wallet", icon: Wallet },
      { label: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
      { label: "Tier", href: "/customer/subscription", icon: ShieldCheck },
    ] : [])
  ];

  if (!user && pathname === '/') return null; // Don't show on landing page if not logged in? Or show guest home? 
  // Let's show it only for logged in users on mobile to keep it premium for customers.

  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background/80 backdrop-blur-xl border-t border-white/5 px-6 pb-safe-area-inset-bottom">
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
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-rose-500 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </div>
  );
}
