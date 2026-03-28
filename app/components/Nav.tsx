import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";

export default async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav
      className="sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-background/50 backdrop-blur-xl transition-all"
      aria-label="Main"
    >
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-12 relative z-10">
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
          aria-label="CarePay home"
        >
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {!user ? (
            <Link
              href="/auth/worker/register"
              className="flex items-center rounded-full px-4 py-2 text-sm font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
            >
              <span className="hidden sm:inline">Professional Portal</span>
              <span className="sm:hidden">Pros</span>
            </Link>
          ) : (
            <>
              <Link
                href="/customer/subscription"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
                title="Manage Tiers"
              >
                <ShieldCheck size={16} />
                <span className="hidden lg:inline">Subscription</span>
              </Link>
              <Link
                href="/customer/dashboard"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
              >
                <LayoutDashboard size={16} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <LogoutButton />
            </>
          )}

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
