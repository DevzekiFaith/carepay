"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MapPin,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: ClipboardList },
  { href: "/admin/workers", label: "Workers", icon: Users },
  { href: "/admin/cities", label: "Cities", icon: MapPin },
  { href: "/admin/surge", label: "Surge Pricing", icon: TrendingUp },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-x-0 -top-[30%] -z-10 h-[80%] w-full rounded-full bg-brand-primary/5 opacity-40 blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-primary transition-colors"
            >
              <ArrowLeft size={12} />
              Back to site
            </Link>
            <span className="text-white/10">|</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gradient-primary">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-0 lg:gap-8 px-6 py-8 lg:flex-row flex-col">
        {/* Sidebar nav */}
        <nav className="flex-shrink-0 w-full lg:w-52 mb-8 lg:mb-0">
          <ul className="flex lg:flex-col gap-1 flex-wrap">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      active
                        ? "bg-brand-primary text-background shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                        : "text-zinc-500 hover:text-brand-primary hover:bg-white/5 border border-transparent hover:border-white/5"
                    }`}
                  >
                    <Icon size={14} className={active ? "" : "opacity-70"} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
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
