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
        <p className="text-xs font-black uppercase tracking-wider text-sky-600 mb-1">Admin Console</p>
        <h1 className="text-2xl font-heading font-black tracking-tight text-slate-900">Surge Pricing</h1>
        <p className="mt-1 text-xs text-slate-500 font-semibold">
          View real-time multipliers and manually override pricing per service.
        </p>
      </div>

      {/* Hour Simulator */}
      <div className="p-6 space-y-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-sky-600 font-bold" />
          <p className="text-xs font-black uppercase tracking-wider text-slate-800">Time Simulator</p>
        </div>
        <p className="text-xs text-slate-500 font-medium">Preview surge levels for any hour of the day.</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={23}
            value={previewHour}
            onChange={(e) => setPreviewHour(parseInt(e.target.value))}
            className="flex-1 accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <span className="text-sm font-black text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl w-20 text-center">
            {hourLabel(previewHour)}
          </span>
        </div>
      </div>

      {/* Services Grid with Horizontal Scroll on Mobile */}
      <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm bg-white">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[650px]">
            <div className="grid grid-cols-[1.5fr_auto_auto_auto_auto] gap-4 px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
              {["Service", "Base Price", "Multiplier", "Surge Price", "Override"].map((h) => (
                <span key={h} className="text-xs font-black uppercase tracking-wider text-white">
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-slate-100">
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
                    className="grid grid-cols-[1.5fr_auto_auto_auto_auto] gap-4 px-6 py-4.5 items-center hover:bg-sky-50/50 transition-colors"
                  >
                    {/* Service name */}
                    <div>
                      <p className="text-sm font-black text-slate-900">{service}</p>
                      <p className="text-xs text-slate-500 font-medium">{surge.reason}</p>
                    </div>

                    {/* Base */}
                    <p className="text-xs font-mono font-bold text-slate-600">
                      ₦{(BASE_PRICES[service] ?? 0).toLocaleString()}
                    </p>

                    {/* Auto Multiplier */}
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                      surge.level === "high"
                        ? "border border-rose-300 bg-rose-50 text-rose-800"
                        : surge.level === "busy"
                        ? "border border-amber-300 bg-amber-50 text-amber-800"
                        : "border border-sky-300 bg-sky-50 text-sky-800"
                    }`}>
                      {surge.level === "high" && <TrendingUp size={12} />}
                      {surge.multiplier}×
                    </span>

                    {/* Surge Price */}
                    <p className="text-sm font-black text-sky-700 whitespace-nowrap">{surgePrice}</p>

                    {/* Manual override input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={3}
                        step={0.1}
                        placeholder="Auto"
                        value={overrides[service] ?? ""}
                        onChange={(e) => handleOverride(service, e.target.value)}
                        className={`w-20 rounded-xl px-2.5 py-1.5 text-xs font-bold outline-none border transition-colors shadow-xs ${
                          hasOverride
                            ? "border-sky-500 bg-sky-50 text-sky-900"
                            : "border-slate-300 bg-white text-slate-800 focus:border-sky-500"
                        }`}
                      />
                      {hasOverride && (
                        <button
                          onClick={() =>
                            setOverrides((prev) => {
                              const next = { ...prev };
                              delete next[service];
                              return next;
                            })
                          }
                          className="text-xs text-rose-600 hover:text-rose-700 font-bold px-1.5 cursor-pointer"
                          title="Reset to automatic"
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

        {/* Action button */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-600 font-semibold">
            {Object.keys(overrides).length > 0
              ? `${Object.keys(overrides).length} custom override(s) active`
              : "All services running on automatic algorithm"}
          </p>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-black">
                <CheckCircle2 size={14} /> Saved
              </span>
            )}
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              Save Overrides
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Logic Explainer */}
      <div className="p-6 space-y-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wider text-sky-600">How Surge Works</p>
        <div className="grid gap-4 sm:grid-cols-3 text-xs text-slate-600">
          <div className="space-y-1">
            <p className="font-bold text-slate-900">Peak Hours</p>
            <p>7–9 AM and 5–8 PM increase rates by 15–25% automatically</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900">After Hours</p>
            <p>Requests after 9 PM or before 6 AM carry a 40% premium</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900">Weekends</p>
            <p>Saturday & Sunday add a 10–15% availability premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}

