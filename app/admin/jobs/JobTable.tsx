"use client";

import { useState, useMemo } from "react";
import { CITIES } from "@/lib/cities";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, RotateCcw, CheckCircle2, Clock, AlertCircle, XCircle, ArrowUpDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export type Job = {
  id: string;
  service_type: string;
  description: string;
  address: string;
  status: string | null;
  preferred_time: string | null;
  created_at: string;
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { 
    label: "Pending", 
    cls: "border-amber-400/80 bg-amber-500/25 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.25)] font-black" 
  },
  matched: { 
    label: "Matched", 
    cls: "border-sky-400/80 bg-sky-500/25 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)] font-black" 
  },
  completed: { 
    label: "Completed", 
    cls: "border-emerald-400/80 bg-emerald-500/25 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)] font-black" 
  },
  cancelled: { 
    label: "Cancelled", 
    cls: "border-rose-400/80 bg-rose-500/25 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)] font-black" 
  },
};

export default function JobTable({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setUpdatingId(jobId);
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) {
        toast.error("Failed to update status: " + error.message);
        return;
      }

      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
      );
      toast.success(`Job updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error("Error updating status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const currentStatus = j.status ?? "pending";
      if (statusFilter !== "all" && currentStatus !== statusFilter) {
        return false;
      }

      // City filter matching: checks if address contains city name or city areas
      if (cityFilter !== "all") {
        const targetCity = CITIES.find((c) => c.id === cityFilter);
        if (targetCity) {
          const addr = (j.address || "").toLowerCase();
          const cityName = targetCity.name.toLowerCase();
          const matchesCity = addr.includes(cityName);
          const matchesArea = targetCity.areas.some((area) =>
            addr.includes(area.toLowerCase())
          );
          if (!matchesCity && !matchesArea) return false;
        }
      }

      // Text search query matching
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesService = (j.service_type || "").toLowerCase().includes(query);
        const matchesDesc = (j.description || "").toLowerCase().includes(query);
        const matchesAddr = (j.address || "").toLowerCase().includes(query);
        const matchesId = j.id.toLowerCase().includes(query);
        if (!matchesService && !matchesDesc && !matchesAddr && !matchesId) return false;
      }

      return true;
    });
  }, [jobs, statusFilter, cityFilter, searchQuery]);

  const resetFilters = () => {
    setStatusFilter("all");
    setCityFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border-2 border-blue-500/30 backdrop-blur-md flex flex-wrap items-center gap-3 shadow-lg">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-300 font-bold" />
          <input
            type="text"
            placeholder="Search service, address, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-blue-400/40 text-sm font-semibold text-white placeholder:text-zinc-400 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 transition-all"
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

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-cyan-300 font-bold" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border-2 border-blue-400/50 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-cyan-300 transition-colors cursor-pointer shadow-sm"
          >
            <option value="all">All Statuses ({jobs.length})</option>
            <option value="pending">Pending ({jobs.filter((j) => (j.status ?? "pending") === "pending").length})</option>
            <option value="matched">Matched ({jobs.filter((j) => j.status === "matched").length})</option>
            <option value="completed">Completed ({jobs.filter((j) => j.status === "completed").length})</option>
            <option value="cancelled">Cancelled ({jobs.filter((j) => j.status === "cancelled").length})</option>
          </select>
        </div>

        {/* City Filter */}
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-xl border-2 border-blue-400/50 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-cyan-300 transition-colors cursor-pointer shadow-sm"
        >
          <option value="all">All Cities</option>
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.active ? "Live" : "Upcoming"})
            </option>
          ))}
        </select>

        {/* Reset Filter Button */}
        {(statusFilter !== "all" || cityFilter !== "all" || searchQuery !== "") && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-300 text-xs font-black text-white transition-all shadow-md cursor-pointer"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="glass-panel overflow-hidden border-2 border-blue-500/30 rounded-2xl shadow-2xl bg-slate-950/80">
        {/* Table Header with Ultra Bright, High Contrast Labels */}
        <div className="hidden sm:grid grid-cols-[1.3fr_1.5fr_1fr_1fr_1.2fr] gap-4 px-6 py-4 border-b-2 border-blue-500/40 bg-blue-900/40 backdrop-blur-md">
          {[
            { label: "Service & Description", color: "text-white" },
            { label: "Address", color: "text-white" },
            { label: "Preferred Time", color: "text-white" },
            { label: "Status", color: "text-white" },
            { label: "Manage Status", color: "text-white" },
          ].map((h) => (
            <span key={h.label} className={`text-xs font-black uppercase tracking-wider ${h.color} drop-shadow-sm`}>
              {h.label}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-cyan-300 border border-blue-400/40">
              <AlertCircle size={24} />
            </div>
            <p className="text-sm font-bold text-white">No matching jobs found</p>
            <p className="text-xs text-zinc-300">Try adjusting your search keywords or clearing active filters.</p>
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
              {filtered.map((job, i) => {
                const currentStatus = job.status ?? "pending";
                const st = STATUS_LABELS[currentStatus] ?? STATUS_LABELS.pending;
                const isUpdating = updatingId === job.id;

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className="grid sm:grid-cols-[1.3fr_1.5fr_1fr_1fr_1.2fr] gap-4 px-6 py-4.5 items-center hover:bg-blue-600/10 transition-colors"
                  >
                    {/* Service & Details */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-white">{job.service_type}</span>
                        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                          #{job.id.slice(0, 6)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium line-clamp-2 mt-1" title={job.description}>
                        {job.description || "No specific details provided."}
                      </p>
                    </div>

                    {/* Address */}
                    <div>
                      <p className="text-xs text-white font-bold line-clamp-2" title={job.address}>
                        {job.address}
                      </p>
                      <p className="text-[11px] text-cyan-300/90 font-semibold mt-1">
                        📅 {new Date(job.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <p className="text-xs text-white font-bold">
                        {job.preferred_time
                          ? new Date(job.preferred_time).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Flexible / ASAP"}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full border-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider whitespace-nowrap ${st.cls}`}
                      >
                        {st.label}
                      </span>
                    </div>

                    {/* Manage Status Action Dropdown */}
                    <div>
                      <select
                        disabled={isUpdating}
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className="w-full text-xs font-bold rounded-xl bg-slate-900 border-2 border-blue-400/60 text-white px-3 py-2 outline-none focus:border-cyan-300 hover:border-cyan-400 transition-all cursor-pointer disabled:opacity-50 shadow-md"
                      >
                        <option value="pending" className="bg-slate-900 text-amber-300 font-bold">Mark: Pending</option>
                        <option value="matched" className="bg-slate-900 text-sky-300 font-bold">Mark: Matched</option>
                        <option value="completed" className="bg-slate-900 text-emerald-300 font-bold">Mark: Completed</option>
                        <option value="cancelled" className="bg-slate-900 text-rose-300 font-bold">Mark: Cancelled</option>
                      </select>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Statistics */}
        <div className="px-6 py-4 border-t-2 border-blue-500/30 bg-blue-950/40 backdrop-blur-sm flex items-center justify-between text-xs font-black uppercase tracking-wider text-white">
          <div>
            Showing <span className="text-cyan-300 font-black text-sm">{filtered.length}</span> of {jobs.length} jobs
          </div>
          <div className="flex gap-4">
            <span className="text-amber-300 font-black">{jobs.filter((j) => (j.status ?? "pending") === "pending").length} pending</span>
            <span className="text-emerald-300 font-black">{jobs.filter((j) => j.status === "completed").length} completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}


