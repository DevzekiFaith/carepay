"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardList, MapPin, TrendingUp, ShoppingBag, Users, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { CITIES } from "@/lib/cities";

interface DashboardClientProps {
  stats: {
    totalJobs: number;
    pendingJobs: number;
    totalWorkers: number;
    verifiedWorkers: number;
    totalStoreOrders: number;
    pendingStoreOrders: number;
    totalStoreRevenue: number;
  };
  activeCitiesCount: number;
  upcomingCitiesCount: number;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  delay,
  accentColor = "text-blue-400",
  bgAccent = "bg-blue-600/15 border-blue-500/30",
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  delay: number;
  accentColor?: string;
  bgAccent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel p-6 rounded-2xl border border-blue-500/20 shadow-lg relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300/80">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bgAccent} border ${accentColor}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-400 font-medium">{sub}</p>}
    </motion.div>
  );
}

export default function DashboardClient({ stats, activeCitiesCount, upcomingCitiesCount }: DashboardClientProps) {
  const quickActions = [
    {
      title: "Manage Jobs",
      desc: `${stats.pendingJobs} pending assignments`,
      href: "/admin/jobs",
      icon: ClipboardList,
      btnText: "Open Jobs",
    },
    {
      title: "Verify Workers",
      desc: `${stats.totalWorkers - stats.verifiedWorkers} unverified registrations`,
      href: "/admin/workers",
      icon: Users,
      btnText: "Review Workers",
    },
    {
      title: "Store Orders",
      desc: `${stats.pendingStoreOrders} pending fulfillment`,
      href: "/admin/store-orders",
      icon: ShoppingBag,
      btnText: "Manage Orders",
    },
    {
      title: "Payment Verifications",
      desc: "Review customer bank transfers",
      href: "/admin/payments",
      icon: ShieldCheck,
      btnText: "Verify Payments",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Jobs" 
          value={stats.totalJobs} 
          sub={`${stats.pendingJobs} awaiting match`} 
          icon={ClipboardList} 
          delay={0}
          accentColor="text-blue-400"
          bgAccent="bg-blue-500/15 border-blue-500/30"
        />
        <StatCard 
          label="Active Workers" 
          value={stats.totalWorkers} 
          sub={`${stats.verifiedWorkers} verified pros`} 
          icon={Users} 
          delay={0.05}
          accentColor="text-emerald-400"
          bgAccent="bg-emerald-500/15 border-emerald-500/30"
        />
        <StatCard 
          label="Store Orders" 
          value={stats.totalStoreOrders} 
          sub={`${stats.pendingStoreOrders} pending payment`} 
          icon={ShoppingBag} 
          delay={0.1}
          accentColor="text-amber-400"
          bgAccent="bg-amber-500/15 border-amber-500/30"
        />
        <StatCard 
          label="Store Revenue" 
          value={`₦${stats.totalStoreRevenue.toLocaleString()}`} 
          sub="Platform item sales" 
          icon={TrendingUp} 
          delay={0.15}
          accentColor="text-purple-400"
          bgAccent="bg-purple-500/15 border-purple-500/30"
        />
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="space-y-3">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400/80">Quick Controls</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/20 hover:border-blue-400/40 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2 text-blue-400">
                  <action.icon size={16} />
                  <h3 className="text-sm font-bold text-foreground">{action.title}</h3>
                </div>
                <p className="text-xs text-zinc-400 mb-4">{action.desc}</p>
              </div>
              <Link
                href={action.href}
                className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-blue-500/25 transition-all"
              >
                <span>{action.btnText}</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* City Status Overview */}
      <div className="glass-panel overflow-hidden border border-blue-500/20 rounded-2xl shadow-xl">
        <div className="px-6 py-4 border-b border-blue-500/20 bg-blue-950/30 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">City Expansion Status</h2>
          </div>
          <Link
            href="/admin/cities"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Configure Cities →
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {CITIES.map((city) => (
            <div key={city.id} className="flex items-center justify-between px-6 py-4 hover:bg-blue-600/[0.02] transition-colors">
              <div>
                <p className="text-sm font-bold text-foreground">{city.name}</p>
                <p className="text-xs text-zinc-400">{city.state} · {city.areas.length} active service areas</p>
              </div>
              <div className="flex items-center gap-2">
                {city.active && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                )}
                {city.launchSoon && !city.active && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
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
        <div className="px-6 py-3.5 bg-blue-950/20 border-t border-blue-500/20 flex gap-6 text-[11px] uppercase font-bold tracking-widest text-zinc-400">
          <span><strong className="text-blue-400 font-extrabold">{activeCitiesCount}</strong> live markets</span>
          <span><strong className="text-blue-400 font-extrabold">{upcomingCitiesCount}</strong> upcoming launches</span>
        </div>
      </div>
    </div>
  );
}

