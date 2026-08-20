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
      icon: <span className="h-3 w-3 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />,
      pill: "border-sky-300 bg-sky-50 text-sky-800 font-bold",
      label: "Analysing photo…",
    },
    verified: {
      icon: <CheckCircle2 size={13} className="text-emerald-600" />,
      pill: "border-emerald-300 bg-emerald-50 text-emerald-800 font-bold",
      label: confidence === "high" ? "AI Verified — Clear Photo" : "AI Verified",
    },
    rejected: {
      icon: <XCircle size={13} className="text-rose-600" />,
      pill: "border-rose-300 bg-rose-50 text-rose-800 font-bold",
      label: "Photo Issue Detected",
    },
    pending_manual: {
      icon: <Clock size={13} className="text-amber-600" />,
      pill: "border-amber-300 bg-amber-50 text-amber-800 font-bold",
      label: "Pending Manual Review",
    },
    error: {
      icon: <AlertTriangle size={13} className="text-slate-600" />,
      pill: "border-slate-300 bg-slate-100 text-slate-700 font-bold",
      label: "Verification Unavailable",
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
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${cfg.pill}`}
      >
        {cfg.icon}
        {cfg.label}
      </span>
      {reason && status !== "checking" && (
        <p className="text-xs text-slate-600 leading-relaxed pl-1 font-medium">
          {reason}
        </p>
      )}
    </motion.div>
  );
}

