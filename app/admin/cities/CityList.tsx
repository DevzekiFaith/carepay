"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { type CityConfig } from "@/lib/cities";

export default function CityList({ cities }: { cities: CityConfig[] }) {
  const [expanded, setExpanded] = useState<string | null>("enugu");

  return (
    <div className="space-y-3">
      {cities.map((city, idx) => {
        const isOpen = expanded === city.id;
        return (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-panel overflow-hidden"
          >
            {/* Header row */}
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : city.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <MapPin size={14} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{city.name}</p>
                  <p className="text-xs text-zinc-400">{city.state} · {city.areas.length} areas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {city.active && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                )}
                {city.launchSoon && !city.active && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                    Soon
                  </span>
                )}
                {!city.active && !city.launchSoon && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Planned
                  </span>
                )}
                {isOpen ? <ChevronUp size={14} className="text-brand-primary" /> : <ChevronDown size={14} className="text-zinc-500 hover:text-brand-primary transition-colors" />}
              </div>
            </button>

            {/* Expanded area list */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5 bg-background/30 backdrop-blur-sm overflow-hidden"
                >
                  <div className="px-6 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-3">
                      Service Areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {city.areas.map((area) => (
                        <span
                          key={area}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3 py-1 text-xs font-medium text-zinc-300"
                        >
                          <Globe size={9} className="text-brand-primary" />
                          {area}
                        </span>
                      ))}
                    </div>
                    {!city.active && (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-medium text-zinc-400">
                          To activate {city.name}, set{" "}
                          <code className="rounded bg-black/40 px-1 font-mono text-[11px] text-brand-primary">active: true</code>{" "}
                          in <code className="rounded bg-black/40 px-1 font-mono text-[11px]">lib/cities.ts</code>.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
