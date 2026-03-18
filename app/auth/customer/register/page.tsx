 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function CustomerRegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setMessage("Account created (demo). In a real app, this would redirect to your dashboard.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-900 antialiased">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-7">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Customer
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Save your details so you can see your requests and book faster next
            time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Full name
            </label>
            <input
              required
              name="fullName"
              placeholder="John Doe"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Phone number
            </label>
            <input
              required
              type="tel"
              name="phone"
              placeholder="+234 812 345 6789"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
          >
            {submitting ? "Creating..." : "Create account"}
          </button>

          {message && (
            <p className="pt-2 text-xs font-medium text-emerald-600">{message}</p>
          )}
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/auth/customer/login"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            Already have an account? Log in
          </Link>
          <Link
            href="/"
            className="underline-offset-2 hover:text-slate-700 hover:underline"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

