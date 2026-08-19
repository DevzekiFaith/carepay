"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Logo from "@/app/components/Logo";

export default function AuthCodeErrorPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground antialiased w-full">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 -top-[30%] -z-10 h-[80%] w-full rounded-full bg-rose-500/10 opacity-30 blur-[120px] mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-6 sm:p-8 text-center"
      >
        <div className="mb-6 flex flex-col items-center">
          <Logo size="md" className="mb-4" />
          <div className="h-px w-12 bg-rose-500/20 mb-4" />
          
          <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
            <AlertCircle size={32} />
          </div>

          <h1 className="text-2xl font-heading font-extrabold tracking-tight text-foreground">
            Invalid or Expired Link
          </h1>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            The verification or password reset link you clicked is invalid, has already been used, or has expired.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/auth/forgot-password"
            className="btn-minimal flex h-12 w-full items-center justify-center gap-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-premium"
          >
            <RefreshCw size={14} /> Request New Reset Link
          </Link>

          <Link
            href="/auth/customer/login"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
