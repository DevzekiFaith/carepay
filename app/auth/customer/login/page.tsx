"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const IMAGE = "/su4.jpg";

export default function CustomerLoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setMessage("Demo: Redirecting to dashboard...");
      window.location.href = "/customer/dashboard";
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-stretch bg-white text-stone-900 antialiased">
      {/* Left side: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-[500px] xl:w-[600px] animate-fade-in">
        <div className="mx-auto w-full max-w-sm">
          <header className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 group mb-8">
              <div className="h-8 w-8 bg-gradient-to-br from-emerald-600 to-green-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">C</div>
              <span className="text-sm font-black uppercase tracking-tighter">CarePay</span>
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Customer Portal</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900">Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">Back.</span></h1>
            <p className="mt-2 text-sm font-medium text-stone-500 italic">Access your requests and manage your home care needs.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Email or Phone</label>
              <input
                required
                name="identifier"
                placeholder="you@example.com"
                className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-700">Verification Code</label>
                <button type="button" className="text-[9px] font-bold text-emerald-600 hover:text-emerald-800 transition-colors uppercase tracking-widest">Resend?</button>
              </div>
              <input
                required
                type="password"
                name="otp"
                placeholder="Enter 6-digit OTP"
                className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient h-14 w-full rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In →</span>
              )}
            </button>

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center animate-success-pop">
                <p className="text-[11px] font-bold text-emerald-700">{message}</p>
              </div>
            )}
          </form>

          <footer className="mt-12 pt-8 border-t border-stone-100">
            <p className="text-center text-xs font-medium text-stone-500">
              New to CarePay? <Link href="/auth/customer/register" className="font-black text-emerald-600 hover:text-emerald-800 transition-colors">Create Account</Link>
            </p>
            <div className="mt-6 flex justify-center gap-6">
              <Link href="/auth/worker/login" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Login as Worker</Link>
              <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Back Home</Link>
            </div>
          </footer>
        </div>
      </div>

      {/* Right side: Image (Desktop only) */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image src={IMAGE} alt="CarePay Customer" fill className="absolute inset-0 h-full w-full object-cover" sizes="50vw" priority />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-12 right-12 text-white animate-slide-up">
          <p className="text-4xl font-black leading-tight drop-shadow-xl">Reliable pros, <br />just a tap away.</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-stone-300`}></div>)}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">Join 2,000+ happy customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
