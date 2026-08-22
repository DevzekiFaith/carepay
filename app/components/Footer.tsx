import Link from "next/link";
import Logo from "./Logo";
import { ArrowRight, ExternalLink, SearchCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 px-6 py-16 text-slate-100 sm:px-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid gap-12 sm:grid-cols-[1.5fr_1fr_1fr] items-start mb-16">
          <div>
            <div className="mb-6">
              <Logo size="md" variant="white" />
            </div>

            <h3 className="text-2xl font-heading font-extrabold tracking-tight mb-4 text-white">
              Book it. Fix it. Done.
            </h3>
            <p className="text-sm font-medium text-slate-400 max-w-xs leading-relaxed mb-6">
              Verified artisans. Rapid matching. Escrow protected payments.
            </p>

            {/* Featured Home Inspection & Fixes Link Callout */}
            <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-xs shadow-sm">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <SearchCheck size={14} />
                <span>Home Inspection & Service Fixes</span>
              </div>
              <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                Looking for professional home inspection or home service fixes?
              </p>
              <a
                href="https://www.homecare.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <span>www.homecare.com.ng</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="flex flex-col gap-3 text-xs font-semibold text-sky-400">
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-sky-400" /> Verified network</span>
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-sky-400" /> Same-day priority</span>
              <span className="flex items-center gap-2"><ArrowRight size={12} className="text-sky-400" /> Local experts</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Customers</h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-300">
              <li>
                <Link href="/request" className="hover:text-white transition-colors">
                  Book a Pro
                </Link>
              </li>
              <li>
                <Link href="/inspection" className="hover:text-white transition-colors">
                  Property Inspection
                </Link>
              </li>
              <li>
                <a
                  href="https://www.homecare.com.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-white transition-colors inline-flex items-center gap-1.5 font-bold"
                >
                  <span>Home Inspection & Fixes</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <Link href="/auth/customer/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-white transition-colors">
                  Parts Store
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Professionals</h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-300">
              <li>
                <Link href="/auth/worker/register" className="hover:text-white transition-colors">
                  Join the Network
                </Link>
              </li>
              <li>
                <Link href="/auth/worker/login" className="hover:text-white transition-colors">
                  Pro Login
                </Link>
              </li>
              <li>
                <a href="https://wa.me/2347069948802" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Support
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                  🔒 Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-8 text-xs font-bold text-slate-400">
          <p>&copy; {new Date().getFullYear()} <span className="text-white font-extrabold">HomeCare</span> Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 uppercase tracking-widest text-[10px] text-cyan-400">
            Fast & Reliable Home Repairs
          </p>
        </div>
      </div>
    </footer>
  );
}
