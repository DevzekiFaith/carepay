 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function WorkerLoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setMessage(
        "Logged in (demo). In a real app, we would redirect you to your job dashboard."
      );
    }, 700);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 text-slate-900 antialiased">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-7">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Worker login
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            Access your jobs
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Enter the phone number you registered with CarePay. This is a demo
            screen; we will plug in real auth later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Phone number (WhatsApp)
            </label>
            <input
              required
              type="tel"
              name="phone"
              placeholder="+234 812 345 6789"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              PIN (demo)
            </label>
            <input
              required
              type="password"
              name="pin"
              placeholder="4-digit PIN"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-sky-500"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          {message && (
            <p className="pt-2 text-xs font-medium text-emerald-600">{message}</p>
          )}
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/auth/worker/register"
            className="font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            New worker? Register
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

