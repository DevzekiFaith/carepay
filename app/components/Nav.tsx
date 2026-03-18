import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-background/80 backdrop-blur-lg"
      aria-label="Main"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="CarePay home"
        >
          <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-lg">
            C
          </div>
          <span className="hidden font-heading font-bold tracking-tight text-foreground sm:inline text-lg">
            CarePay
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/auth/worker/register"
            className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 transition-colors hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <span className="hidden sm:inline">For Professionals</span>
            <span className="sm:hidden">Pros</span>
          </Link>
          <Link
            href="/request"
            className="btn-minimal flex items-center rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest"
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
