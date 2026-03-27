"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { CITIES } from "@/lib/cities";
import { ClipboardList, Users, MapPin, TrendingUp } from "lucide-react";

interface Stats {
  totalJobs: number;
  pendingJobs: number;
  totalWorkers: number;
  verifiedWorkers: number;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  delay,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-brand-primary">
          <Icon size={14} />
        </div>
      </div>
      <p className="text-3xl font-heading font-bold tracking-tight text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalJobs: 0, pendingJobs: 0, totalWorkers: 0, verifiedWorkers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const [jobsRes, workersRes] = await Promise.all([
        supabase.from("service_requests").select("id, status", { count: "exact" }),
        supabase.from("professionals").select("id, is_verified", { count: "exact" }),
      ]);

      const jobs = jobsRes.data ?? [];
      const workers = workersRes.data ?? [];

      setStats({
        totalJobs: jobs.length,
        pendingJobs: jobs.filter((j: { status?: string }) => !j.status || j.status === "pending").length,
        totalWorkers: workers.length,
        verifiedWorkers: workers.filter((w: { is_verified?: boolean }) => w.is_verified).length,
      });
      setLoading(false);
    }
    load();
  }, []);

  const activeCities = CITIES.filter((c) => c.active);
  const upcomingCities = CITIES.filter((c) => c.launchSoon);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Overview</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Platform health across all active cities.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse glass-panel" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Jobs" value={stats.totalJobs} sub="All time" icon={ClipboardList} delay={0} />
          <StatCard label="Pending Jobs" value={stats.pendingJobs} sub="Awaiting match" icon={TrendingUp} delay={0.05} />
          <StatCard label="Registered Workers" value={stats.totalWorkers} sub="All cities" icon={Users} delay={0.1} />
          <StatCard label="Verified Workers" value={stats.verifiedWorkers} sub={`${Math.round((stats.verifiedWorkers / Math.max(stats.totalWorkers, 1)) * 100)}% approval rate`} icon={Users} delay={0.15} />
        </div>
      )}

      {/* City Overview */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-2 backdrop-blur-sm">
          <MapPin size={14} className="text-brand-primary" />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground">City Status</h2>
        </div>
        <div className="divide-y divide-white/5">
          {CITIES.map((city) => (
            <div key={city.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{city.name}</p>
                <p className="text-xs text-zinc-500">{city.state} · {city.areas.length} areas</p>
              </div>
              <div className="flex items-center gap-2">
                {city.active && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                )}
                {city.launchSoon && !city.active && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                    Coming Soon
                  </span>
                )}
                {!city.active && !city.launchSoon && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Planned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-white/5 border-t border-white/5 flex gap-4 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
          <span><strong className="text-brand-primary">{activeCities.length}</strong> live</span>
          <span><strong className="text-brand-primary">{upcomingCities.length}</strong> coming soon</span>
        </div>
      </div>
    </div>
  );
}
