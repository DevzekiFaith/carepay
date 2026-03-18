import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800 bg-background px-6 py-16 text-foreground sm:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-[1.5fr_1fr_1fr] items-start mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded bg-foreground text-background flex items-center justify-center font-bold text-lg">
                C
              </div>
              <span className="font-heading font-bold tracking-tight text-foreground text-xl">
                CarePay
              </span>
            </div>

            <h3 className="text-xl font-heading font-bold tracking-tight mb-4 text-foreground">
              Book it. Fix it. Done.
            </h3>
            <p className="text-sm font-medium text-zinc-500 max-w-xs leading-relaxed mb-6">
              Premium handymen. Rapid matching. Pay seamlessly before the job begins.
            </p>

            <div className="flex flex-col gap-2 text-xs font-semibold text-zinc-400">
              <span className="flex items-center gap-2"><ArrowRight size={12} /> Verified network</span>
              <span className="flex items-center gap-2"><ArrowRight size={12} /> Same-day priority</span>
              <span className="flex items-center gap-2"><ArrowRight size={12} /> Local experts</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Customers</h3>
            <ul className="space-y-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/request" className="hover:text-foreground transition-colors">
                  Book a Pro
                </Link>
              </li>
              <li>
                <Link href="/auth/customer/login" className="hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Professionals</h3>
            <ul className="space-y-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/auth/worker/register" className="hover:text-foreground transition-colors">
                  Join the Network
                </Link>
              </li>
              <li>
                <Link href="/auth/worker/login" className="hover:text-foreground transition-colors">
                  Pro Login
                </Link>
              </li>
              <li>
                <a href="https://wa.me/2348123456789" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-8 text-xs font-semibold text-zinc-400">
          <p>&copy; {new Date().getFullYear()} CarePay. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 uppercase tracking-widest text-[10px]">
            Engineered for minimalist perfection.
          </p>
        </div>
      </div>
    </footer>
  );
}
