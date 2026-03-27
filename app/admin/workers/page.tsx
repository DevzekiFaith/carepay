"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

type Worker = {
  id: string;
  full_name: string;
  phone: string;
  primary_skill: string;
  nin: string | null;
  is_verified: boolean;
  ai_verified: boolean | null;
  created_at: string;
};

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("professionals")
      .select("id, full_name, phone, primary_skill, nin, is_verified, ai_verified, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => { setWorkers(data ?? []); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (id: string, approve: boolean) => {
    setVerifyingId(id);
    await supabase.from("professionals").update({ is_verified: approve }).eq("id", id);
    setWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, is_verified: approve } : w))
    );
    setVerifyingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Admin</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Workers</h1>
        <p className="mt-1 text-sm text-zinc-500">Review and verify professional registrations.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[1.5fr_auto_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
          {["Name & Skill", "Phone", "NIN", "AI Check", "Status", "Action"].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="divide-y divide-white/5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 px-6 py-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 flex-1 animate-pulse rounded bg-white/5" />
                ))}
              </div>
            ))}
          </div>
        ) : workers.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">No workers registered yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {workers.map((worker, i) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid lg:grid-cols-[1.5fr_auto_auto_auto_auto_auto] gap-4 px-6 py-4 items-center"
              >
                {/* Name */}
                <div>
                  <p className="text-sm font-semibold text-foreground">{worker.full_name}</p>
                  <p className="text-xs text-zinc-500">{worker.primary_skill}</p>
                </div>

                {/* Phone */}
                <p className="text-xs text-zinc-500">{worker.phone}</p>

                {/* NIN */}
                <p className="text-xs font-mono text-zinc-500">
                  {worker.nin ? `${worker.nin.slice(0, 4)}•••••${worker.nin.slice(-2)}` : "—"}
                </p>

                {/* AI Check */}
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                  worker.ai_verified
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}>
                  {worker.ai_verified ? (
                    <><CheckCircle2 size={10} /> AI OK</>
                  ) : (
                    <><Clock size={10} /> Pending</>
                  )}
                </span>

                {/* Verified Status */}
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                  worker.is_verified
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                }`}>
                  {worker.is_verified ? <><CheckCircle2 size={10} /> Verified</> : <><Clock size={10} /> Unverified</>}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!worker.is_verified ? (
                    <button
                      onClick={() => handleVerify(worker.id, true)}
                      disabled={verifyingId === worker.id}
                      className="btn-minimal rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] shadow-premium hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] disabled:opacity-50"
                    >
                      {verifyingId === worker.id ? "…" : "Approve"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerify(worker.id, false)}
                      disabled={verifyingId === worker.id}
                      className="glass-panel glass-panel-hover rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500 transition-all disabled:opacity-50"
                    >
                      <XCircle size={10} className="inline mr-1" />
                      Revoke
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="px-6 py-3 border-t border-white/5 bg-white/5 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {workers.length} <span className="text-brand-primary">worker{workers.length !== 1 ? "s" : ""}</span> ·{" "}
          <span className="text-emerald-500">{workers.filter((w) => w.is_verified).length} verified</span>
        </div>
      </div>
    </div>
  );
}
