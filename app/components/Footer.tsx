import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-amber-700 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-[1.3fr_1fr_1fr] items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
              CarePay
              <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-100">
                Lagos
              </span>
            </p>
            <h3 className="mt-3 text-lg font-semibold tracking-tight">
              Fix it. Book it. Done.
            </h3>
            <p className="mt-2 text-xs text-violet-50">
              Handymen you can actually trust. Pay before the job, we handle the rest.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-violet-100">
              <span className="rounded-full bg-black/10 px-3 py-1">✓ NIN-verified workers</span>
              <span className="rounded-full bg-black/10 px-3 py-1">✓ Same-day options</span>
              <span className="rounded-full bg-black/10 px-3 py-1">✓ Lagos only (for now)</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">For customers</h3>
            <ul className="mt-3 space-y-1.5 text-xs text-violet-50/90">
              <li>
                <Link
                  href="/request"
                  className="hover:text-white hover:underline"
                >
                  Book a handyman
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/customer/login"
                  className="hover:text-white hover:underline"
                >
                  Customer login
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-white hover:underline"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">For workers</h3>
            <ul className="mt-3 space-y-1.5 text-xs text-violet-50/90">
              <li>
                <Link
                  href="/auth/worker/register"
                  className="hover:text-white hover:underline"
                >
                  Join as a worker
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/worker/login"
                  className="hover:text-white hover:underline"
                >
                  Worker login
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline"
                >
                  WhatsApp support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-5 text-[11px] text-violet-50/90 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} CarePay. All rights reserved.</p>
          <p className="text-[10px]">
            Built for Lagos homes &amp; small businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}
