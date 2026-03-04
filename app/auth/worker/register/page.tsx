"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const IMAGE = "/su11.jpg";

export default function WorkerRegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setMessage("Application received! Redirecting to onboard...");
      window.location.href = "/worker/dashboard";
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-stretch bg-white text-stone-900 antialiased">
      {/* Left side: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-[500px] xl:w-[600px] animate-fade-in">
        <div className="mx-auto w-full max-w-sm">
          <header className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 group mb-8">
              <div className="h-8 w-8 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">C</div>
              <span className="text-sm font-black uppercase tracking-tighter">CarePay</span>
            </Link>
            <div className="mb-8 flex rounded-2xl bg-stone-100 p-1">
              <Link href="/auth/customer/register" className="flex-1 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-all text-center">I need help</Link>
              <button className="flex-1 rounded-xl bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-stone-900 shadow-sm transition-all">I want to work</button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">PARTNER Registration</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-stone-900">Be a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">CarePro.</span></h1>
            <p className="mt-2 text-sm font-medium text-stone-500 italic">Join Nigeria&apos;s most trusted fleet of service professionals.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Legal First Name</label>
                <input required placeholder="E.g. Ibrahim" className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Legal Last Name</label>
                <input required placeholder="E.g. Musa" className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Primary Skill</label>
              <select className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm outline-none transition-all appearance-none bg-white">
                <option>Plumbing</option>
                <option>Electrical Systems</option>
                <option>Carpentry / Woodwork</option>
                <option>HVAC / AC Repair</option>
                <option>Interior Painting</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">NIN (National ID Number)</label>
              <input
                required
                name="nin"
                autoComplete="off"
                placeholder="11-digit ID Number"
                className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 group"
              />
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter ml-1">* Required for law enforcement clearance</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Phone Number</label>
              <input
                required
                type="tel"
                placeholder="+234 812 345 6789"
                className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-stone-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-relaxed">
                By clicking Register, you agree to our skill-vetting process and criminal background check policy.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient h-14 w-full rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting Application..." : "Start Earning →"}
            </button>

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center animate-success-pop">
                <p className="text-[11px] font-bold text-emerald-700">{message}</p>
              </div>
            )}
          </form>

          <footer className="mt-12 pt-8 border-t border-stone-100">
            <p className="text-center text-xs font-medium text-stone-500">
              Already a partner? <Link href="/auth/worker/login" className="font-black text-emerald-600 hover:text-emerald-800 transition-colors">Sign In</Link>
            </p>
            <div className="mt-6 flex justify-center gap-6">
              <Link href="/auth/customer/register" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Join as Customer</Link>
              <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Back Home</Link>
            </div>
          </footer>
        </div>
      </div>

      {/* Right side: Image (Desktop only) */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image src={IMAGE} alt="CarePay Partner" fill className="absolute inset-0 h-full w-full object-cover" sizes="50vw" priority />
        <div className="absolute inset-0 bg-emerald-900/10" />
        <div className="absolute bottom-12 left-12 right-12 text-white animate-slide-up">
          <p className="text-4xl font-black leading-tight drop-shadow-xl">Work on your <br />own terms.</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] bg-stone-900/80 text-white inline-block px-4 py-2 rounded-full border border-white/20">Active in multiple regions</p>
        </div>
      </div>
    </div>
  );
}
