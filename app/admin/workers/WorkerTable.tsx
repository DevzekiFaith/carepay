"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, Search, Filter, RotateCcw, AlertCircle, Phone, UserCheck, Shield } from "lucide-react";
import { toast } from "sonner";

export type Worker = {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");

  const supabase = useMemo(() => createClient(), []);

  // Extract unique skills
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    workers.forEach((w) => {
      if (w.primary_skill) skills.add(w.primary_skill);
    });
    return Array.from(skills).sort();
  }, [workers]);

  const handleVerify = async (id: string, approve: boolean) => {
    setVerifyingId(id);
    try {
      const { error } = await supabase
        .from("professionals")
        .update({ is_verified: approve })
        .eq("id", id);

      if (error) {
        toast.error("Failed to update status: " + error.message);
        return;
      }

      setWorkers((prev) =>
        prev.map((w) => (w.id === id ? { ...w, is_verified: approve } : w))
      );
      toast.success(approve ? "Worker approved & verified!" : "Verification revoked.");
    } catch (err: any) {
      toast.error("Action error: " + err.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const filtered = useMemo(() => {
    return workers.filter((worker) => {
      // Status filter
      if (statusFilter === "verified" && !worker.is_verified) return false;
      if (statusFilter === "unverified" && worker.is_verified) return false;
      if (statusFilter === "ai_verified" && !worker.ai_verified) return false;

      // Skill filter
      if (skillFilter !== "all" && worker.primary_skill !== skillFilter) return false;

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = (worker.full_name || "").toLowerCase().includes(q);
        const matchesPhone = (worker.phone || "").toLowerCase().includes(q);
        const matchesSkill = (worker.primary_skill || "").toLowerCase().includes(q);
        const matchesNin = (worker.nin || "").toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesSkill && !matchesNin) return false;
      }

      return true;
    });
  }, [workers, statusFilter, skillFilter, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSkillFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border-2 border-blue-500/30 backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-lg">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-300 font-bold" />
          <input
            type="text"
            placeholder="Search worker name, skill, phone, NIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900 border-2 border-blue-400/50 text-sm font-semibold text-white placeholder:text-slate-200 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Verification Status Filter */}
          <div className="flex-1 sm:flex-none min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border-2 border-blue-400/50 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-cyan-300 transition-colors cursor-pointer shadow-sm"
            >
              <option value="all">All Statuses ({workers.length})</option>
              <option value="verified">Verified ({workers.filter((w) => w.is_verified).length})</option>
              <option value="unverified">Unverified ({workers.filter((w) => !w.is_verified).length})</option>
              <option value="ai_verified">AI Verified ({workers.filter((w) => w.ai_verified).length})</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div className="flex-1 sm:flex-none min-w-[130px]">
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full rounded-xl border-2 border-blue-400/50 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-cyan-300 transition-colors cursor-pointer shadow-sm"
            >
              <option value="all">All Skills</option>
              {availableSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filter Button */}
          {(statusFilter !== "all" || skillFilter !== "all" || searchQuery !== "") && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-300 text-xs font-black text-white transition-all shadow-md cursor-pointer shrink-0"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table with Responsive Horizontal Scroll */}
      <div className="glass-panel overflow-hidden border-2 border-blue-500/30 rounded-2xl shadow-2xl bg-slate-950/80">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/30">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.5fr_auto_auto_auto_auto_auto] gap-4 px-6 py-4 border-b-2 border-blue-500/40 bg-blue-900/40 backdrop-blur-md">
              {["Name & Skill", "Phone", "NIN", "AI Check", "Status", "Action"].map((h) => (
                <span key={h} className="text-xs font-black uppercase tracking-wider text-white drop-shadow-sm">
                  {h}
                </span>
              ))}
            </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-cyan-300 border border-blue-400/40">
              <AlertCircle size={24} />
            </div>
            <p className="text-sm font-bold text-white">No matching workers found</p>
            <p className="text-xs text-zinc-300">Try adjusting your filters or search terms.</p>
            <button
              onClick={resetFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-colors"
            >
              <RotateCcw size={13} /> Clear All Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-blue-500/15">
            <AnimatePresence>
              {filtered.map((worker, i) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                  className="grid lg:grid-cols-[1.5fr_auto_auto_auto_auto_auto] gap-4 px-6 py-4.5 items-center hover:bg-blue-600/10 transition-colors"
                >
                  {/* Name */}
                  <div>
                    <p className="text-sm font-black text-white">{worker.full_name}</p>
                    <p className="text-xs text-cyan-300 font-bold mt-0.5">{worker.primary_skill}</p>
                  </div>

                  {/* Phone */}
                  <p className="text-xs text-white font-mono font-bold flex items-center gap-1">
                    <Phone size={12} className="text-cyan-400" />
                    {worker.phone || "N/A"}
                  </p>

                  {/* NIN */}
                  <p className="text-xs font-mono font-bold text-zinc-200">
                    {worker.nin ? `${worker.nin.slice(0, 4)}•••••${worker.nin.slice(-2)}` : "—"}
                  </p>

                  {/* AI Check */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${
                      worker.ai_verified ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    {worker.ai_verified ? (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-400" /> AI Verified
                      </>
                    ) : (
                      <>
                        <Clock size={13} className="text-amber-400" /> Pending AI
                      </>
                    )}
                  </span>

                  {/* Verified Status */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${
                      worker.is_verified
                        ? "border-emerald-400/80 bg-emerald-500/25 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                        : "border-amber-400/80 bg-amber-500/25 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
                    }`}
                  >
                    {worker.is_verified ? (
                      <>
                        <CheckCircle2 size={12} /> Verified
                      </>
                    ) : (
                      <>
                        <Clock size={12} /> Unverified
                      </>
                    )}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!worker.is_verified ? (
                      <button
                        onClick={() => handleVerify(worker.id, true)}
                        disabled={verifyingId === worker.id}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-black uppercase tracking-wider shadow-md hover:shadow-blue-500/30 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {verifyingId === worker.id ? "…" : "Approve"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(worker.id, false)}
                        disabled={verifyingId === worker.id}
                        className="inline-flex items-center gap-1.5 rounded-xl border-2 border-rose-400/80 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <XCircle size={13} />
                        Revoke
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
          </div>
        </div>

        <div className="px-6 py-4 border-t-2 border-blue-500/30 bg-blue-950/40 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-white">
          <div>
            Showing <span className="text-cyan-300 font-black text-sm">{filtered.length}</span> of {workers.length} workers
          </div>
          <div className="flex gap-4 flex-wrap">
            <span className="text-emerald-300 font-black">{workers.filter((w) => w.is_verified).length} verified</span>
            <span className="text-amber-300 font-black">{workers.filter((w) => !w.is_verified).length} pending verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}


