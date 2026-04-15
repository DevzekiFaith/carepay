"use client";

import Link from "next/link";
import Logo from "../Logo";

export default function FooterSection() {
  return (
    <footer className="bg-background pt-24 pb-12 px-6 border-t border-white/5 relative z-10 w-full overflow-hidden">
      <div className="absolute top-0 left-[20%] w-[30%] h-[100%] bg-brand-primary/5 blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
        <div className="md:col-span-2">
          <Logo size="md" className="mb-6" />
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed mb-6">
            Connecting you to vetted home service professionals, artisans, and repair experts in minutes. Book it. Fix it. Done.
          </p>
          <div className="space-y-2 text-sm text-zinc-400">
            <p>+234 706 994 8802</p>
            <p>info@homecare.com</p>
            <p>Enugu, Nigeria</p>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-xs">Platform</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li><Link href="/auth/customer/register" className="hover:text-brand-primary transition-colors">Users Options</Link></li>
            <li><Link href="/auth/worker/register" className="hover:text-brand-primary transition-colors">Professional Sign Up</Link></li>
            <li><Link href="#" className="hover:text-brand-primary transition-colors">Services</Link></li>
            <li><Link href="#" className="hover:text-brand-primary transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 tracking-widest uppercase text-xs">Company</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li><Link href="#" className="hover:text-brand-primary transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-brand-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-brand-primary transition-colors">FAQs</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-zinc-600 uppercase tracking-widest relative z-10">
        <p>© {new Date().getFullYear()} HomeCare Technologies. All rights reserved.</p>
        <p>Built for Nigeria.</p>
      </div>
    </footer>
  );
}
