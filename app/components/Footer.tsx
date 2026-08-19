import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-sky-100 bg-white px-6 py-16 text-slate-900 sm:px-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid gap-12 sm:grid-cols-[1.5fr_1fr_1fr] items-start mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-sky-600/30">
                <Zap size={16} fill="currentColor" />
              </div>
              <span className="font-heading font-extrabold tracking-tight text-slate-900 text-xl">
                Home<span className="text-sky-600">Care</span>
              </span>
            </div>

            <h3 className="text-2xl font-heading font-extrabold tracking-tight mb-4 text-slate-900">
              Book it. Fix it. Done.
            </h3>
            <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed mb-6">
              Verified artisans. Rapid matching. Escrow protected payments.
            </p>

            <div className="flex flex-col gap-3 text-xs font-semibold text-sky-700">
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-sky-500" /> Verified network</span>
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-sky-500" /> Same-day priority</span>
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-sky-500" /> Local experts</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Customers</h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-600">
              <li>
                <Link href="/request" className="hover:text-sky-600 transition-colors">
                  Book a Pro
                </Link>
              </li>
              <li>
                <Link href="/auth/customer/login" className="hover:text-sky-600 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-sky-600 transition-colors">
                  Parts Store
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Professionals</h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-600">
              <li>
                <Link href="/auth/worker/register" className="hover:text-sky-600 transition-colors">
                  Join the Network
                </Link>
              </li>
              <li>
                <Link href="/auth/worker/login" className="hover:text-sky-600 transition-colors">
                  Pro Login
                </Link>
              </li>
              <li>
                <a href="https://wa.me/2347069948802" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 transition-colors">
                  WhatsApp Support
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-sky-600 hover:text-sky-700 font-bold transition-colors">
                  🔒 Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-8 text-xs font-bold text-slate-400">
          <p>&copy; {new Date().getFullYear()} HomeCare Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 uppercase tracking-widest text-[10px] text-sky-600">
            Fast & Reliable Home Repairs
          </p>
        </div>
      </div>
    </footer>
  );
}
