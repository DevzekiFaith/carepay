"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, CheckCircle2 } from "lucide-react";

interface SurgeBadgeProps {
  level: "standard" | "busy" | "high";
  label: string;
  reason: string;
  multiplier: number;
  displayPrice: string;
  service: string;
}

export default function SurgeBadge({
  level,
  label,
  reason,
  multiplier,
  displayPrice,
}: SurgeBadgeProps) {
  if (level === "standard") {
    return (
      <AnimatePresence>
        <motion.div
          key="standard"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex items-center gap-2 mt-3"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <CheckCircle2 size={10} className="text-emerald-500" />
            Standard Rate
          </span>
          <span className="text-xs font-bold text-foreground">
            From {displayPrice}
          </span>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (level === "busy") {
    return (
      <AnimatePresence>
        <motion.div
          key="busy"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="mt-3 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 px-4 py-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={12} className="text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              {label} · {multiplier}×
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-foreground">
              From {displayPrice}
            </span>
            <span className="text-[10px] text-zinc-500">{reason}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // high demand
  return (
    <AnimatePresence>
      <motion.div
        key="high"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className="mt-3 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 px-4 py-3"
      >
        <div className="flex items-center gap-2 mb-1">
          <Zap size={12} className="text-red-600 dark:text-red-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 dark:text-red-400">
            {label} · {multiplier}× Surge
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-foreground">
            From {displayPrice}
          </span>
          <span className="text-[10px] text-zinc-500">{reason}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
