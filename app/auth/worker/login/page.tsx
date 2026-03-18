"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

export default function WorkerLoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setMessage("Logged in (demo). Redirecting to your job dashboard...");
    }, 700);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground antialiased w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-background p-8 lg:p-10 shadow-premium"
      >
        <div className="mb-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Professional Portal
          </p>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">
            Access your jobs
          </h1>
          <p className="mt-2 text-sm font-medium text-zinc-500">
            Enter the phone number registered to your CarePay account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Phone number (WhatsApp)
            </label>
            <input
              required
              type="tel"
              name="phone"
              placeholder="+234 812 345 6789"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-foreground"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              PIN
            </label>
            <input
              required
              type="password"
              name="pin"
              placeholder="4-digit PIN"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-minimal mt-4 flex h-12 w-full items-center justify-center rounded-full px-8 text-xs font-bold uppercase tracking-widest shadow-premium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Authenticating..." : "Sign In"}
          </button>

          {message && (
            <p className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 text-center text-sm font-semibold text-foreground">
              {message}
            </p>
          )}
        </form>

        <div className="mt-8 flex flex-col items-center justify-center space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-6 text-xs text-zinc-500">
          <Link
            href="/auth/worker/register"
            className="font-bold text-foreground hover:underline"
          >
            New professional? Register here
          </Link>
          <Link
            href="/"
            className="font-bold uppercase tracking-widest hover:text-foreground transition-colors"
          >
            ← Back home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
