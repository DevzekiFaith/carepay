"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock } from "lucide-react";
import Logo from "@/app/components/Logo";
import ErrorAlert from "@/app/components/ErrorAlert";

export default function WorkerLoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get("email") as string)?.trim() ?? "";
    const pin = (formData.get("pin") as string)?.trim() ?? "";

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    });

    if (error) {
      setMessage(`Login failed: Invalid phone number or PIN.`);
      setSubmitting(false);
      return;
    }

    setMessage("Logged in securely. Redirecting...");
    setTimeout(() => {
      window.location.href = "/"; // We will build a true pro dashboard soon
    }, 1000);
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center bg-background px-6 py-12 text-foreground antialiased w-full overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 -top-[30%] -z-10 h-[80%] w-full rounded-full bg-brand-primary/10 opacity-30 blur-[120px] mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-md p-8 lg:p-10"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo size="md" className="mb-6" />
          <div className="h-px w-12 bg-brand-primary/20 mb-6" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">
            Professional Portal
          </p>
          <h1 className="text-2xl font-heading font-extrabold tracking-tight text-gradient-primary">
            Access your jobs
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Email Address
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder="pro@example.com"
              className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Security PIN
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                name="pin"
                placeholder="6-digit PIN"
                className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer group w-fit">
              <div className="relative flex items-center justify-center h-4 w-4 rounded border border-white/20 bg-white/5 group-hover:border-brand-primary/50 transition-colors">
                 <input 
                   type="checkbox" 
                   name="remember" 
                   className="sr-only" 
                   checked={rememberMe} 
                   onChange={(e) => setRememberMe(e.target.checked)} 
                 />
                 <div className={`h-2 w-2 rounded-sm bg-brand-primary transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors whitespace-nowrap">Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-minimal mt-4 flex h-12 w-full items-center justify-center rounded-full px-8 text-xs font-bold uppercase tracking-widest shadow-premium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Authenticating..." : "Sign In"}
          </button>

          <ErrorAlert 
            error={message && message.includes("failed") ? message : null} 
            onClear={() => setMessage(null)}
            className="mt-6"
          />
          
          {message && !message.includes("failed") && (
             <p className="pt-4 text-center text-xs font-bold text-brand-primary">
               {message}
             </p>
          )}
        </form>

        <div className="mt-8 flex flex-col items-center justify-center space-y-4 border-t border-white/10 pt-6 text-xs text-zinc-500">
          <Link
            href="/auth/worker/register"
            className="font-bold text-foreground hover:text-brand-primary transition-colors hover:underline"
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
