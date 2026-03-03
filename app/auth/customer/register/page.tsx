"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const IMAGE = "/su6.jpg";

export default function CustomerRegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setMessage("Account created! Redirecting...");
      window.location.href = "/customer/dashboard";
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-stretch bg-white text-stone-900 antialiased">
      {/* Left side: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-[500px] xl:w-[600px] animate-fade-in text-stone-900">
        <div className="mx-auto w-full max-w-sm">
          <header className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 group mb-8">
              <div className="h-8 w-8 bg-gradient-to-br from-emerald-600 to-green-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">C</div>
              <span className="text-sm font-black uppercase tracking-tighter">CarePay</span>
            </Link>
            <div className="mb-8 flex rounded-2xl bg-stone-100 p-1">
              <button className="flex-1 rounded-xl bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-stone-900 shadow-sm transition-all">I need help</button>
              <Link href="/auth/worker/register" className="flex-1 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-all text-center">I want to work</Link>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">CLIENT Registration</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900">Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">CarePay.</span></h1>
            <p className="mt-2 text-sm font-medium text-stone-500 italic">Get the best handymen in your area delivered to your door.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">First Name</label>
                <input required placeholder="E.g. Chioma" className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Last Name</label>
                <input required placeholder="E.g. Adebayo" className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">WhatsApp Number</label>
              <input
                required
                type="tel"
                placeholder="+234 812 345 6789"
                className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Preferred Location</label>
              <select className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm outline-none transition-all appearance-none bg-white">
                <option>Region A</option>
                <option>Region B</option>
                <option>Region C</option>
                <option>Other / Not Listed</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient h-14 w-full rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Continue →"}
            </button>

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center animate-success-pop">
                <p className="text-[11px] font-bold text-emerald-700">{message}</p>
              </div>
            )}
          </form>

          <footer className="mt-12 pt-8 border-t border-stone-100">
            <p className="text-center text-xs font-medium text-stone-500">
              Already have an account? <Link href="/auth/customer/login" className="font-black text-emerald-600 hover:text-emerald-800 transition-colors">Sign In</Link>
            </p>
            <div className="mt-6 flex justify-center gap-6">
              <Link href="/auth/worker/register" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Join as Worker</Link>
              <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Back Home</Link>
            </div>
          </footer>
        </div>
      </div>

      {/* Right side: Image (Desktop only) */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image src={IMAGE} alt="CarePay Registration" fill className="absolute inset-0 h-full w-full object-cover" sizes="50vw" priority />
        <div className="absolute inset-0 bg-stone-900/10" />
        <div className="absolute bottom-12 left-12 right-12 text-white animate-slide-up">
          <p className="text-4xl font-black leading-tight drop-shadow-xl text-stone-900">Seamless Home <br />Care Services.</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] bg-white/90 text-stone-900 inline-block px-4 py-2 rounded-full">Coming to your city soon</p>
        </div>
      </div>
    </div>
  );
}
