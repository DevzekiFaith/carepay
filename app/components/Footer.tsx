import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-primary/20 bg-background/50 backdrop-blur-3xl px-6 py-16 text-foreground sm:px-12 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none" />
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid gap-12 sm:grid-cols-[1.5fr_1fr_1fr] items-start mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-primary to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)]">
                <Zap size={16} fill="currentColor" />
              </div>
              <span className="font-heading font-extrabold tracking-tight text-foreground text-xl">
                Care<span className="text-brand-primary">Pay</span>
              </span>
            </div>

            <h3 className="text-2xl font-heading font-extrabold tracking-tight mb-4 text-gradient-primary">
              Book it. Fix it. Done.
            </h3>
            <p className="text-sm font-medium text-zinc-400 max-w-xs leading-relaxed mb-6">
              Premium handymen. Rapid matching. Pay seamlessly before the job begins.
            </p>

            <div className="flex flex-col gap-3 text-xs font-semibold text-brand-primary/80">
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-brand-glow" /> Verified network</span>
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-brand-glow" /> Same-day priority</span>
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-brand-glow" /> Local experts</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Customers</h3>
            <ul className="space-y-4 text-sm font-semibold text-zinc-400">
              <li>
                <Link href="/request" className="hover:text-brand-primary transition-colors">
                  Book a Pro
                </Link>
              </li>
              <li>
                <Link href="/auth/customer/login" className="hover:text-brand-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-brand-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Professionals</h3>
            <ul className="space-y-4 text-sm font-semibold text-zinc-400">
              <li>
                <Link href="/auth/worker/register" className="hover:text-brand-primary transition-colors">
                  Join the Network
                </Link>
              </li>
              <li>
                <Link href="/auth/worker/login" className="hover:text-brand-primary transition-colors">
                  Pro Login
                </Link>
              </li>
              <li>
                <a href="https://wa.me/2348123456789" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-brand-primary/10 pt-8 text-xs font-bold text-zinc-500">
          <p>&copy; {new Date().getFullYear()} CarePay. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 uppercase tracking-widest text-[10px] text-brand-primary/60">
            Engineered for minimalist perfection.
          </p>
        </div>
      </div>
    </footer>
  );
}
