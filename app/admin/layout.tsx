"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MapPin,
  TrendingUp,
  ArrowLeft,
  ShoppingBag,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import AdminLockScreen from "@/app/components/admin/AdminLockScreen";
import { isAdminUnlocked, lockAdmin } from "@/lib/admin-auth";
import { playSound } from "@/lib/audio-fx";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: ClipboardList },
  { href: "/admin/workers", label: "Workers", icon: Users },
  { href: "/admin/store-orders", label: "Store Orders", icon: ShoppingBag },
  { href: "/admin/payments", label: "Payments", icon: ShieldCheck },
  { href: "/admin/cities", label: "Cities", icon: MapPin },
  { href: "/admin/surge", label: "Surge Pricing", icon: TrendingUp },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setUnlocked(isAdminUnlocked());
  }, []);

  const handleLock = () => {
    playSound("click");
    lockAdmin();
    setUnlocked(false);
  };

  // Prevent flash of content during hydration
  if (unlocked === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased overflow-hidden">
      {/* Biometric & Passcode Lock Guard */}
      {!unlocked && (
        <AdminLockScreen onUnlock={() => setUnlocked(true)} />
      )}

      {/* Background Ambience */}
      <div className="fixed inset-x-0 -top-[30%] -z-10 h-[80%] w-full rounded-full bg-blue-600/5 opacity-40 blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-blue-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={12} />
              Back to site
            </Link>
            <span className="text-white/10">|</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLock}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/20 hover:bg-blue-600/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-300 transition-all shadow-sm"
              title="Lock Admin Console"
            >
              <Lock size={12} />
              Lock Console
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-0 lg:gap-8 px-6 py-8 lg:flex-row flex-col">
        {/* Sidebar nav with vibrant Blue Buttons */}
        <nav className="flex-shrink-0 w-full lg:w-56 mb-8 lg:mb-0">
          <div className="p-2 rounded-2xl bg-blue-950/20 border border-blue-500/20 backdrop-blur-md">
            <p className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-blue-400/70">
              Navigation
            </p>
            <ul className="flex lg:flex-col gap-1.5 flex-wrap">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <li key={href} className="flex-1 lg:flex-none">
                    <Link
                      href={href}
                      className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm ${
                        active
                          ? "bg-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.45)] border border-blue-400/50 font-extrabold translate-x-0.5"
                          : "bg-blue-950/40 text-blue-200/90 hover:bg-blue-600/30 hover:text-white border border-blue-500/20 hover:border-blue-400/40"
                      }`}
                    >
                      <Icon size={15} className={active ? "text-white" : "text-blue-400 opacity-90"} />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Page content */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 min-w-0"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

