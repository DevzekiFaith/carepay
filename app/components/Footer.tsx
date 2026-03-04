import Link from "next/link";
import { ShieldCheck, Twitter, Instagram, MessageCircle, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-stone-900 pt-20 pb-10 text-stone-300">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-emerald-900/20 blur-3xl opacity-50" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Micro-CTA Section */}
        <div className="mb-16 rounded-3xl bg-gradient-to-r from-emerald-600 to-green-500 p-8 sm:p-12 shadow-2xl shadow-emerald-900/20 text-white flex flex-col md:flex-row items-center justify-between gap-8 animate-slide-up">
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-2xl font-black sm:text-3xl leading-tight">Ready to fix your home today?</h2>
            <p className="mt-2 text-sm font-medium text-emerald-50 opacity-90">Book a verified pro in under 2 minutes. No hidden fees.</p>
          </div>
          <Link
            href="/request"
            className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black text-emerald-700 shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            Get Started Now
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 items-start">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black uppercase tracking-tighter text-white">CarePay</span>
            </Link>
            <p className="text-sm font-medium leading-relaxed opacity-70">
              The premium service network connecting homeowners with the best verified handymen.
              <span className="block mt-2 italic font-bold text-emerald-500">Book it. Fix it. Done.</span>
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: MessageCircle, href: "#" }
              ].map((item, i) => (
                <button key={i} className="h-10 w-10 rounded-full border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:border-emerald-500 transition-all text-stone-400 hover:text-emerald-500">
                  <item.icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6 font-primary">For Customers</h3>
            <ul className="space-y-4">
              <li><Link href="/request" className="text-sm font-medium hover:text-emerald-400 transition-colors">Book a Handyman</Link></li>
              <li><Link href="/auth/customer/login" className="text-sm font-medium hover:text-emerald-400 transition-colors">Customer Portal</Link></li>
              <li><Link href="/#faq" className="text-sm font-medium hover:text-emerald-400 transition-colors">Pricing & Safety</Link></li>
              <li><Link href="/#faq" className="text-sm font-medium hover:text-emerald-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">For Professionals</h3>
            <ul className="space-y-4">
              <li><Link href="/auth/worker/register" className="text-sm font-medium hover:text-emerald-400 transition-colors">Join as a Partner</Link></li>
              <li><Link href="/auth/worker/login" className="text-sm font-medium hover:text-emerald-400 transition-colors">Partner Login</Link></li>
              <li><Link href="/auth/worker/register" className="text-sm font-medium hover:text-emerald-400 transition-colors">Worker Requirements</Link></li>
            </ul>
          </div>

          <div className="rounded-3xl bg-stone-800/50 p-6 border border-stone-800">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4">Service Status</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-100">System Live</span>
            </div>
            <p className="text-xs font-medium text-stone-400 italic leading-relaxed">
              Accepting bookings in your area. Average response time: <span className="font-black text-white">8 mins</span>.
            </p>
            <a
              href="https://wa.me/2349119059859"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 py-3 text-xs font-bold hover:bg-emerald-600 transition-colors group"
            >
              Contact Support
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-stone-800 pt-8 sm:flex-row">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} CarePay Technologies.
            </p>
            <p className="text-[9px] font-medium text-stone-600 italic">Built for modern homes & businesses.</p>
          </div>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-stone-500">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
