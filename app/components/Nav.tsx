import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav
      className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/95 backdrop-blur-md"
      aria-label="Main"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl px-2 py-1.5 transition hover:opacity-90"
          aria-label="CarePay home"
        >
          <Image
            src="/su5.jpg"
            alt="CarePay"
            width={36}
            height={36}
            className="h-9 w-auto rounded-lg object-contain"
          />
          <span className="hidden font-semibold text-stone-800 sm:inline">CarePay</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/auth/worker/register"
            className="flex min-h-[44px] items-center rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            <span className="hidden sm:inline">For workers</span>
            <span className="sm:hidden">Workers</span>
          </Link>
          <Link
            href="/request"
            className="btn-gradient interactive-tap flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm"
          >
            Book now
          </Link>
        </div>
      </div>
    </nav>
  );
}
