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
      <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 backdrop-blur-md flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
          <input
            type="text"
            placeholder="Search worker name, skill, phone, NIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-blue-500/20 text-xs text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Verification Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-blue-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-blue-500/30 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-blue-100 outline-none focus:border-blue-400 transition-colors cursor-pointer"
          >
            <option value="all">All Statuses ({workers.length})</option>
            <option value="verified">Verified ({workers.filter((w) => w.is_verified).length})</option>
            <option value="unverified">Unverified ({workers.filter((w) => !w.is_verified).length})</option>
            <option value="ai_verified">AI Verified ({workers.filter((w) => w.ai_verified).length})</option>
          </select>
        </div>

        {/* Skill Filter */}
        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="rounded-xl border border-blue-500/30 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-blue-100 outline-none focus:border-blue-400 transition-colors cursor-pointer"
        >
          <option value="all">All Skills</option>
          {availableSkills.map((sk) => (
            <option key={sk} value={sk}>
              {sk}
            </option>
          ))}
        </select>

        {/* Reset Filter Button */}
        {(statusFilter !== "all" || skillFilter !== "all" || searchQuery !== "") && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-bold text-blue-300 transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="glass-panel overflow-hidden border border-blue-500/20 rounded-2xl shadow-xl">
        <div className="hidden lg:grid grid-cols-[1.5fr_auto_auto_auto_auto_auto] gap-4 px-6 py-3.5 border-b border-blue-500/20 bg-blue-950/30 backdrop-blur-sm">
          {["Name & Skill", "Phone", "NIN", "AI Check", "Status", "Action"].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-blue-300/80">
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <AlertCircle size={24} />
            </div>
            <p className="text-sm font-semibold text-zinc-300">No matching workers found</p>
            <p className="text-xs text-zinc-500">Try adjusting your filters or search terms.</p>
            <button
              onClick={resetFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-colors"
            >
              <RotateCcw size={13} /> Clear All Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {filtered.map((worker, i) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                  className="grid lg:grid-cols-[1.5fr_auto_auto_auto_auto_auto] gap-4 px-6 py-4 items-center hover:bg-blue-600/[0.03] transition-colors"
                >
                  {/* Name */}
                  <div>
                    <p className="text-sm font-bold text-foreground">{worker.full_name}</p>
                    <p className="text-xs text-blue-400 font-medium">{worker.primary_skill}</p>
                  </div>

                  {/* Phone */}
                  <p className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                    <Phone size={11} className="text-zinc-500" />
                    {worker.phone || "N/A"}
                  </p>

                  {/* NIN */}
                  <p className="text-xs font-mono text-zinc-400">
                    {worker.nin ? `${worker.nin.slice(0, 4)}•••••${worker.nin.slice(-2)}` : "—"}
                  </p>

                  {/* AI Check */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                      worker.ai_verified ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {worker.ai_verified ? (
                      <>
                        <CheckCircle2 size={12} /> AI Verified
                      </>
                    ) : (
                      <>
                        <Clock size={12} /> Pending AI
                      </>
                    )}
                  </span>

                  {/* Verified Status */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap ${
                      worker.is_verified
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                        : "border-amber-500/40 bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {worker.is_verified ? (
                      <>
                        <CheckCircle2 size={11} /> Verified
                      </>
                    ) : (
                      <>
                        <Clock size={11} /> Unverified
                      </>
                    )}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!worker.is_verified ? (
                      <button
                        onClick={() => handleVerify(worker.id, true)}
                        disabled={verifyingId === worker.id}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-md hover:shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {verifyingId === worker.id ? "…" : "Approve"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(worker.id, false)}
                        disabled={verifyingId === worker.id}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <XCircle size={12} />
                        Revoke
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="px-6 py-3.5 border-t border-blue-500/20 bg-blue-950/20 backdrop-blur-sm flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          <div>
            Showing <span className="text-blue-400 font-extrabold">{filtered.length}</span> of {workers.length} workers
          </div>
          <div className="flex gap-4">
            <span className="text-emerald-400">{workers.filter((w) => w.is_verified).length} verified</span>
            <span className="text-amber-400">{workers.filter((w) => !w.is_verified).length} pending verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}

