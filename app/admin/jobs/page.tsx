"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/cities";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

type Job = {
  id: string;
  service_type: string;
  description: string;
  address: string;
  status: string | null;
  preferred_time: string | null;
  created_at: string;
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "border-amber-500/30 bg-amber-500/10 text-amber-500" },
  matched: { label: "Matched", cls: "border-blue-500/30 bg-blue-500/10 text-blue-500" },
  completed: { label: "Completed", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" },
  cancelled: { label: "Cancelled", cls: "border-white/10 bg-white/5 text-zinc-400" },
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("service_requests")
      .select("id, service_type, description, address, status, preferred_time, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => { setJobs(data ?? []); setLoading(false); });
  }, []);

  const filtered = jobs.filter((j) => {
    if (statusFilter !== "all" && (j.status ?? "pending") !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Admin</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">All Jobs</h1>
        <p className="mt-1 text-sm text-zinc-500">Every service request across the platform.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 glass-panel">
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-brand-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Filters</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-background/50 px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-brand-primary appearance-none hover:bg-white/5 transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="matched">Matched</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-background/50 px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-brand-primary appearance-none hover:bg-white/5 transition-colors"
        >
          <option value="all">All Cities</option>
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_auto_1.5fr_auto_auto] gap-4 px-6 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
          {["Service", "Status", "Address", "Preferred Time", "Date"].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="divide-y divide-white/5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 px-6 py-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 flex-1 animate-pulse rounded bg-white/5" />
                ))}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-500">No jobs found.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((job, i) => {
              const st = STATUS_LABELS[job.status ?? "pending"] ?? STATUS_LABELS.pending;
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="grid sm:grid-cols-[1fr_auto_1.5fr_auto_auto] gap-4 px-6 py-4 items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{job.service_type}</p>
                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{job.description}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${st.cls}`}>
                    {st.label}
                  </span>
                  <p className="text-xs text-zinc-500 truncate">{job.address}</p>
                  <p className="text-xs text-zinc-500 whitespace-nowrap">
                    {job.preferred_time ? new Date(job.preferred_time).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Flexible"}
                  </p>
                  <p className="text-xs text-zinc-400 whitespace-nowrap">
                    {new Date(job.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="px-6 py-3 border-t border-white/5 bg-white/5 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {filtered.length} <span className="text-brand-primary">job{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}
