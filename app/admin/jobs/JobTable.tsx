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
    cls: "border border-amber-300 bg-amber-50 text-amber-800 font-extrabold" 
  },
  matched: { 
    label: "Matched", 
    cls: "border border-sky-300 bg-sky-50 text-sky-800 font-extrabold" 
  },
  completed: { 
    label: "Completed", 
    cls: "border border-emerald-300 bg-emerald-50 text-emerald-800 font-extrabold" 
  },
  cancelled: { 
    label: "Cancelled", 
    cls: "border border-rose-300 bg-rose-50 text-rose-800 font-extrabold" 
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
        const selCity = CITIES.find((c) => c.id === cityFilter);
        if (selCity) {
          const addr = (j.address || "").toLowerCase();
          const cityName = selCity.name.toLowerCase();
          const hasCityName = addr.includes(cityName);
          const hasAreaName = (selCity.areas || []).some((area) =>
            addr.includes(area.toLowerCase())
          );
          if (!hasCityName && !hasAreaName) {
            return false;
          }
        }
      }

      // Search query matching: search in service_type, description, address, or ID
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesService = (j.service_type || "").toLowerCase().includes(q);
        const matchesDesc = (j.description || "").toLowerCase().includes(q);
        const matchesAddr = (j.address || "").toLowerCase().includes(q);
        const matchesId = (j.id || "").toLowerCase().includes(q);
        if (!matchesService && !matchesDesc && !matchesAddr && !matchesId) {
          return false;
        }
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
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-600 font-bold" />
          <input
            type="text"
            placeholder="Search service, address, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Status Filter */}
          <div className="flex-1 sm:flex-none min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 hover:bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Statuses ({jobs.length})</option>
              <option value="pending">Pending ({jobs.filter((j) => (j.status ?? "pending") === "pending").length})</option>
              <option value="matched">Matched ({jobs.filter((j) => j.status === "matched").length})</option>
              <option value="completed">Completed ({jobs.filter((j) => j.status === "completed").length})</option>
              <option value="cancelled">Cancelled ({jobs.filter((j) => j.status === "cancelled").length})</option>
            </select>
          </div>

          {/* City Filter */}
          <div className="flex-1 sm:flex-none min-w-[130px]">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 hover:bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Cities</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.active ? "Live" : "Upcoming"})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filter Button */}
          {(statusFilter !== "all" || cityFilter !== "all" || searchQuery !== "") && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-700 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table with Responsive Horizontal Scroll */}
      <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm bg-white">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[760px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.3fr_1.5fr_1fr_1fr_1.2fr] gap-4 px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
              {[
                { label: "Service & Description" },
                { label: "Address" },
                { label: "Preferred Time" },
                { label: "Status" },
                { label: "Manage Status" },
              ].map((h) => (
                <span key={h.label} className="text-xs font-black uppercase tracking-wider text-white">
                  {h.label}
                </span>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="px-6 py-16 text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
                  <AlertCircle size={24} />
                </div>
                <p className="text-sm font-bold text-slate-900">No matching jobs found</p>
                <p className="text-xs text-slate-500">Try adjusting your search keywords or clearing active filters.</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md hover:bg-sky-500 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} /> Clear All Filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
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
                        className="grid grid-cols-[1.3fr_1.5fr_1fr_1fr_1.2fr] gap-4 px-6 py-4.5 items-center hover:bg-sky-50/50 transition-colors"
                      >
                        {/* Service & Details */}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-slate-900">{job.service_type}</span>
                            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
                              #{job.id.slice(0, 6)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1" title={job.description}>
                            {job.description || "No specific details provided."}
                          </p>
                        </div>

                        {/* Address */}
                        <div>
                          <p className="text-xs text-slate-800 font-bold line-clamp-2" title={job.address}>
                            {job.address}
                          </p>
                          <p className="text-xs text-slate-500 font-semibold mt-1">
                            📅 {new Date(job.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        {/* Preferred Time */}
                        <div>
                          <p className="text-xs text-slate-800 font-bold">
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
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${st.cls}`}
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
                            className="w-full text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-800 px-3 py-2 outline-none focus:border-sky-500 hover:border-slate-400 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                          >
                            <option value="pending" className="font-bold text-amber-700">Mark: Pending</option>
                            <option value="matched" className="font-bold text-sky-700">Mark: Matched</option>
                            <option value="completed" className="font-bold text-emerald-700">Mark: Completed</option>
                            <option value="cancelled" className="font-bold text-rose-700">Mark: Cancelled</option>
                          </select>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Footer Statistics */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-slate-700">
          <div>
            Showing <span className="text-sky-600 font-black text-sm">{filtered.length}</span> of {jobs.length} jobs
          </div>
          <div className="flex gap-4 flex-wrap">
            <span className="text-amber-700 font-bold">{jobs.filter((j) => (j.status ?? "pending") === "pending").length} pending</span>
            <span className="text-emerald-700 font-bold">{jobs.filter((j) => j.status === "completed").length} completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
