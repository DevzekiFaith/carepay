"use client";

import { FormEvent, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/app/components/Logo";
import ErrorAlert from "@/app/components/ErrorAlert";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function ResetPasswordPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (!session) {
            // Also check onAuthStateChange in case session is being set from URL recovery token
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
              if (event === 'PASSWORD_RECOVERY' || session) {
                setCheckingSession(false);
              }
            });

            // If after 2s still no session, redirect to forgot-password
            setTimeout(async () => {
              if (mounted) {
                const { data: { session: retrySession } } = await supabase.auth.getSession();
                if (!retrySession) {
                  toast.error("Session expired or invalid", {
                    description: "Please request a fresh reset link."
                  });
                  router.push("/auth/forgot-password");
                }
                setCheckingSession(false);
              }
            }, 2000);

            return () => subscription.unsubscribe();
          } else {
            setCheckingSession(false);
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
        if (mounted) setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router, supabase.auth]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      toast.success("Password updated successfully!", {
        description: "Your new password is now active. Redirecting to login...",
        icon: <CheckCircle2 className="text-emerald-500" />
      });
      
      setTimeout(() => {
        router.push("/auth/customer/login");
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      toast.error("Update failed", {
        description: msg
      });
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isMatching = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const isMinLength = password.length >= 6;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground antialiased w-full">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 -top-[30%] -z-10 h-[80%] w-full rounded-full bg-brand-primary/10 opacity-30 blur-[120px] mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-6 sm:p-8"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="md" className="mb-4" />
          <div className="h-px w-12 bg-brand-primary/20 mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary flex items-center gap-1.5">
            <Lock size={12} /> Security Center
          </p>
          <h1 className="mt-2 text-2xl font-heading font-extrabold tracking-tight text-gradient-primary">
            New Password
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Create a new secure password for your account.
          </p>
        </div>

        {checkingSession ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="animate-spin text-brand-primary" size={32} />
            <p className="text-xs text-zinc-500 font-medium">Verifying reset authorization...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                New Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary pr-12"
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

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-primary transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Validation Checklist */}
            <div className="rounded-xl bg-white/5 p-3 space-y-1.5 text-[11px]">
              <div className={`flex items-center gap-2 ${isMinLength ? "text-emerald-500" : "text-zinc-500"}`}>
                <ShieldCheck size={13} /> At least 6 characters
              </div>
              <div className={`flex items-center gap-2 ${isMatching ? "text-emerald-500" : "text-zinc-500"}`}>
                <ShieldCheck size={13} /> Passwords match
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !isMinLength || !isMatching}
              className="btn-minimal mt-4 flex h-12 w-full items-center justify-center rounded-full text-xs font-bold uppercase tracking-widest shadow-premium disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : "Update Password"}
            </button>

            <ErrorAlert 
              error={error} 
              onClear={() => setError(null)} 
              className="mt-6"
            />
          </form>
        )}
      </motion.div>
    </div>
  );
}

