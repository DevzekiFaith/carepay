 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function CustomerLoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    // MVP: fake login, later we can plug real auth
    setTimeout(() => {
      setSubmitting(false);
      setMessage("Logged in (demo). In a real app, this would redirect to your dashboard.");
    }, 700);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-900 antialiased">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-7">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Customer
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            Log in to continue
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Use your email or phone to access your requests. This is a demo flow
            without real authentication yet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Email or phone
            </label>
            <input
              required
              name="identifier"
              placeholder="you@example.com or +234..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              One-time password (demo)
            </label>
            <input
              required
              type="password"
              name="otp"
              placeholder="123456"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
          >
            {submitting ? "Checking..." : "Continue"}
          </button>

          {message && (
            <p className="pt-2 text-xs font-medium text-emerald-600">{message}</p>
          )}
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/auth/customer/register"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            New here? Create an account
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

