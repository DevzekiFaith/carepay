"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

export type VerificationStatus = "idle" | "checking" | "verified" | "rejected" | "pending_manual" | "error";

interface IdVerificationStatusProps {
  status: VerificationStatus;
  reason?: string;
  confidence?: "high" | "medium" | "low" | null;
}

export default function IdVerificationStatus({
  status,
  reason,
  confidence,
}: IdVerificationStatusProps) {
  if (status === "idle") return null;

  const configs = {
    checking: {
      icon: <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-700" />,
      pill: "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-500",
      label: "Analysing photo…",
    },
    verified: {
      icon: <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />,
      pill: "border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400",
      label: confidence === "high" ? "AI Verified — Clear photo" : "AI Verified",
    },
    rejected: {
      icon: <XCircle size={12} className="text-red-600 dark:text-red-400" />,
      pill: "border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400",
      label: "Photo issue detected",
    },
    pending_manual: {
      icon: <Clock size={12} className="text-amber-600 dark:text-amber-400" />,
      pill: "border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400",
      label: "Pending Manual Review",
    },
    error: {
      icon: <AlertTriangle size={12} className="text-zinc-500" />,
      pill: "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-500",
      label: "Verification unavailable",
    },
  };

  const cfg = configs[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 space-y-1.5"
    >
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${cfg.pill}`}
      >
        {cfg.icon}
        {cfg.label}
      </span>
      {reason && status !== "checking" && (
        <p className="text-[10px] text-zinc-500 leading-relaxed pl-1">
          {reason}
        </p>
      )}
    </motion.div>
  );
}
