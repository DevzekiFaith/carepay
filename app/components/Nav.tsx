import Link from "next/link";
import { Zap } from "lucide-react";

export default function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-background/50 backdrop-blur-xl transition-all"
      aria-label="Main"
    >
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-12 relative z-10">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80 group"
          aria-label="CarePay home"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-primary to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="hidden font-heading font-extrabold tracking-tight text-foreground sm:inline text-xl">
            Care<span className="text-brand-primary">Pay</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/auth/worker/register"
            className="flex items-center rounded-full px-4 py-2 text-sm font-bold text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
          >
            <span className="hidden sm:inline">For Professionals</span>
            <span className="sm:hidden">Pros</span>
          </Link>
          <Link
            href="/request"
            className="btn-minimal flex items-center rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-premium"
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
