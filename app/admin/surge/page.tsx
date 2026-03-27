"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getSurgeResult, getSurgePrice, BASE_PRICES } from "@/lib/surge";
import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const SERVICES = Object.keys(BASE_PRICES);
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function hourLabel(h: number) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export default function AdminSurgePage() {
  const [previewHour, setPreviewHour] = useState<number>(new Date().getHours());
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const handleOverride = (service: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 1 || num > 3) return;
    setOverrides((prev) => ({ ...prev, [service]: num }));
    setSaved(false);
  };

  const handleSave = () => {
    // In production: write to supabase surge_overrides table
    // For now, just simulate a save confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Admin</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Surge Pricing</h1>
        <p className="mt-1 text-sm text-zinc-500">
          View real-time multipliers and manually override pricing per service.
        </p>
      </div>

      {/* Hour Simulator */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-brand-primary" />
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">Time Simulator</p>
        </div>
        <p className="text-xs text-zinc-500">Preview surge levels for any hour of the day.</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={23}
            value={previewHour}
            onChange={(e) => setPreviewHour(parseInt(e.target.value))}
            className="flex-1 accent-foreground"
          />
          <span className="text-sm font-bold text-foreground w-16 text-right">{hourLabel(previewHour)}</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="glass-panel overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1.5fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
          {["Service", "Base Price", "Multiplier", "Surge Price", "Override"].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-white/5">
          {SERVICES.map((service, i) => {
            const surge = getSurgeResult(service, "Enugu", previewHour);
            const effectiveMultiplier = overrides[service] ?? surge.multiplier;
            const surgePrice = getSurgePrice(service, effectiveMultiplier);
            const hasOverride = !!overrides[service];

            return (
              <motion.div
                key={service}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid sm:grid-cols-[1.5fr_auto_auto_auto_auto] gap-4 px-6 py-4 items-center"
              >
                {/* Service name */}
                <div>
                  <p className="text-sm font-semibold text-foreground">{service}</p>
                  <p className="text-xs text-zinc-500">{surge.reason}</p>
                </div>

                {/* Base */}
                <p className="text-xs font-mono text-zinc-500">
                  ₦{(BASE_PRICES[service] ?? 0).toLocaleString()}
                </p>

                {/* Auto Multiplier */}
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                  surge.level === "high"
                    ? "border-red-500/30 bg-red-500/10 text-red-500"
                    : surge.level === "busy"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                    : "border-white/10 bg-white/5 text-zinc-400"
                }`}>
                  {surge.level === "high" && <TrendingUp size={9} />}
                  {surge.multiplier}×
                </span>

                {/* Surge Price */}
                <p className="text-sm font-bold text-foreground">{surgePrice}</p>

                {/* Override input */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={3}
                    step={0.05}
                    placeholder={surge.multiplier.toString()}
                    value={overrides[service] ?? ""}
                    onChange={(e) => handleOverride(service, e.target.value)}
                    className={`w-20 rounded-xl border px-3 py-1.5 text-xs font-mono text-foreground outline-none transition focus:border-brand-primary ${
                      hasOverride
                        ? "border-brand-primary/50 bg-brand-primary/10 shadow-[0_0_10px_rgba(249,115,22,0.2)] text-brand-primary"
                        : "border-white/10 bg-background/50 focus:bg-background/80"
                    }`}
                  />
                  {hasOverride && (
                    <button
                      type="button"
                      onClick={() => { setOverrides((p) => { const n = { ...p }; delete n[service]; return n; }); setSaved(false); }}
                      className="text-zinc-400 hover:text-foreground text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer / Save */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/5 backdrop-blur-sm flex items-center justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <span className="text-brand-primary">{Object.keys(overrides).length}</span> manual override{Object.keys(overrides).length !== 1 ? "s" : ""} active
          </p>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 size={12} /> Saved
              </motion.span>
            )}
            <button
              onClick={handleSave}
              disabled={Object.keys(overrides).length === 0}
              className="btn-minimal rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest disabled:opacity-40"
            >
              Save Overrides
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Logic Explainer */}
      <div className="glass-panel p-6 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">How Surge Works</p>
        <div className="grid gap-2 sm:grid-cols-3 text-xs text-zinc-500">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Peak Hours</p>
            <p>7–9 AM and 5–8 PM increase rates by 15–25%</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">After Hours</p>
            <p>Requests after 9 PM or before 6 AM carry a 40% premium</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Weekends</p>
            <p>Saturday & Sunday add a 10–15% availability premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
