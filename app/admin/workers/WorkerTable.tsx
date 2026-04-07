"use client";

import { useState } from "react";
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

export default function WorkerTable({ initialWorkers }: { initialWorkers: Worker[] }) {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const supabase = createClient();

  const handleVerify = async (id: string, approve: boolean) => {
    setVerifyingId(id);
    const { error } = await supabase.from("professionals").update({ is_verified: approve }).eq("id", id);
    
    if (!error) {
      setWorkers((prev) =>
        prev.map((w) => (w.id === id ? { ...w, is_verified: approve } : w))
      );
    }
    setVerifyingId(null);
  };

  if (workers.length === 0) {
    return <div className="px-6 py-12 text-center text-sm text-zinc-500">No workers registered yet.</div>;
  }

  return (
    <div className="divide-y divide-white/5">
      {workers.map((worker, i) => (
        <motion.div
          key={worker.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.01 }}
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
      
      <div className="px-6 py-3 border-t border-white/5 bg-white/5 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {workers.length} <span className="text-brand-primary">worker{workers.length !== 1 ? "s" : ""}</span> ·{" "}
        <span className="text-emerald-500">{workers.filter((w) => w.is_verified).length} verified</span>
      </div>
    </div>
  );
}
