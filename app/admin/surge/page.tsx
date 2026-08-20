"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getSurgeResult, getSurgePrice, BASE_PRICES } from "@/lib/surge";
import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const SERVICES = Object.keys(BASE_PRICES);

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
        <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-1">Admin Console</p>
        <h1 className="text-2xl font-heading font-black tracking-tight text-white">Surge Pricing</h1>
        <p className="mt-1 text-xs text-zinc-300 font-medium">
          View real-time multipliers and manually override pricing per service.
        </p>
      </div>

      {/* Hour Simulator */}
      <div className="glass-panel p-6 space-y-4 border-2 border-blue-500/30 rounded-2xl bg-slate-950/80 shadow-xl">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-cyan-300 font-bold" />
          <p className="text-xs font-black uppercase tracking-wider text-white">Time Simulator</p>
        </div>
        <p className="text-xs text-zinc-300 font-medium">Preview surge levels for any hour of the day.</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={23}
            value={previewHour}
            onChange={(e) => setPreviewHour(parseInt(e.target.value))}
            className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
          />
          <span className="text-sm font-black text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-3 py-1 rounded-xl w-20 text-center">
            {hourLabel(previewHour)}
          </span>
        </div>
      </div>

      {/* Services Grid with Horizontal Scroll on Mobile */}
      <div className="glass-panel overflow-hidden border-2 border-blue-500/30 rounded-2xl shadow-2xl bg-slate-950/80">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/30">
          <div className="min-w-[650px]">
            <div className="grid grid-cols-[1.5fr_auto_auto_auto_auto] gap-4 px-6 py-4 border-b-2 border-blue-500/40 bg-blue-900/40 backdrop-blur-md">
              {["Service", "Base Price", "Multiplier", "Surge Price", "Override"].map((h) => (
                <span key={h} className="text-xs font-black uppercase tracking-wider text-white drop-shadow-sm">
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-blue-500/15">
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
                    className="grid grid-cols-[1.5fr_auto_auto_auto_auto] gap-4 px-6 py-4.5 items-center hover:bg-blue-600/10 transition-colors"
                  >
                    {/* Service name */}
                    <div>
                      <p className="text-sm font-black text-white">{service}</p>
                      <p className="text-xs text-zinc-300 font-medium">{surge.reason}</p>
                    </div>

                    {/* Base */}
                    <p className="text-xs font-mono font-bold text-zinc-200">
                      ₦{(BASE_PRICES[service] ?? 0).toLocaleString()}
                    </p>

                    {/* Auto Multiplier */}
                    <span className={`inline-flex items-center gap-1 rounded-full border-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider whitespace-nowrap ${
                      surge.level === "high"
                        ? "border-rose-400 bg-rose-500/20 text-rose-300"
                        : surge.level === "busy"
                        ? "border-amber-400 bg-amber-500/20 text-amber-300"
                        : "border-blue-400/40 bg-blue-500/10 text-cyan-300"
                    }`}>
                      {surge.level === "high" && <TrendingUp size={11} />}
                      {surge.multiplier}×
                    </span>

                    {/* Surge Price */}
                    <p className="text-sm font-black text-amber-300 whitespace-nowrap">{surgePrice}</p>

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
                        className={`w-24 rounded-xl border-2 px-3 py-1.5 text-xs font-mono font-bold text-white placeholder:text-slate-200 outline-none transition focus:border-cyan-300 ${
                          hasOverride
                            ? "border-cyan-400 bg-cyan-950/70 shadow-[0_0_12px_rgba(6,182,212,0.3)] text-cyan-300"
                            : "border-blue-400/50 bg-slate-900 focus:bg-slate-900"
                        }`}
                      />
                      {hasOverride && (
                        <button
                          type="button"
                          onClick={() => { setOverrides((p) => { const n = { ...p }; delete n[service]; return n; }); setSaved(false); }}
                          className="text-zinc-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer / Save */}
        <div className="px-6 py-4 border-t-2 border-blue-500/30 bg-blue-950/40 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-wider text-white">
            <span className="text-cyan-300">{Object.keys(overrides).length}</span> manual override{Object.keys(overrides).length !== 1 ? "s" : ""} active
          </p>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300"
              >
                <CheckCircle2 size={14} /> Saved
              </motion.span>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-300 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
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
