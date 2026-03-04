"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

const LiveMap = dynamic(() => import("../../components/LiveMap"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-stone-100 animate-pulse rounded-2xl" />
});

const DEMO_JOBS = [
  {
    id: "JOB-1024",
    type: "Plumbing",
    customer: "Mrs. Adebayo",
    area: "Region A",
    time: "Today · 4:00 PM",
    status: "New",
    price: "₦12,000",
    icon: "🔧",
  },
  {
    id: "JOB-1025",
    type: "Electrical",
    customer: "Chinedu Okafor",
    area: "Region B",
    time: "Tomorrow · 11:30 AM",
    status: "Scheduled",
    price: "₦18,000",
    icon: "💡",
  },
];

const WORKER_IMAGE = "/su2.jpg";

export default function WorkerDashboardPage() {
  const [activeRouteJob, setActiveRouteJob] = useState<string | null>(null);
  return (
    <div className="min-h-screen vibe-bg text-stone-900 antialiased selection:bg-emerald-100 pb-20">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header Section */}
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-3xl border-4 border-white shadow-xl ring-1 ring-stone-100 shrink-0">
              <Image src={WORKER_IMAGE} alt="Worker Profile" fill className="object-cover" sizes="80px" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  ✓ Verified Pro
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  4.8★
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-stone-900">
                Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">Ibrahim!</span>
              </h1>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-tighter mt-0.5">
                Plumbing Specialist • Active Region
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="btn-gradient interactive-tap flex items-center justify-center rounded-full px-6 py-3 text-sm shadow-lg shadow-emerald-200/50"
            >
              Set Availability
            </button>
          </div>
        </header>

        <main className="space-y-8 animate-slide-up delay-1">

          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="card-vibe group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.02]">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 font-black">This Week</p>
                <div className="flex items-baseline gap-1">
                  <p className="mt-2 text-3xl font-black text-stone-900">₦45,000</p>
                  <span className="text-[10px] font-bold text-emerald-600">+12%</span>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 text-6xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity select-none">💰</div>
            </div>

            <div className="card-vibe group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.02] bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 border-emerald-100">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60 font-black">Jobs Done</p>
                <p className="mt-2 text-4xl font-black text-emerald-700">5</p>
              </div>
              <div className="absolute -right-4 -top-4 text-6xl opacity-[0.05] group-hover:opacity-[0.1] transition-opacity select-none">🛠️</div>
            </div>

            <div className="card-vibe group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.02] bg-gradient-to-br from-stone-50/50 to-stone-100/30 border-stone-100">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-700/60 font-black">Current Rating</p>
                <p className="mt-2 text-4xl font-black text-stone-900">4.8</p>
              </div>
              <div className="absolute -right-4 -top-4 text-6xl opacity-[0.05] group-hover:opacity-[0.1] transition-opacity select-none">⭐️</div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

            {/* Upcoming Jobs */}
            <section className="card-vibe rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/40">
              <div className="mb-8 border-b border-stone-100 pb-6">
                <h2 className="text-xl font-extrabold text-stone-900 leading-none">Upcoming Jobs</h2>
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-2 px-0.5">Don't miss a beat</p>
              </div>

              <div className="grid gap-4">
                {DEMO_JOBS.map((job) => (
                  <div
                    key={job.id}
                    className={`group relative flex flex-col gap-4 rounded-3xl border-2 p-5 transition-all sm:p-6 ${activeRouteJob === job.id ? "border-emerald-500 bg-emerald-50/20" : "border-stone-100 bg-white hover:border-emerald-100 hover:shadow-md"}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-50 text-2xl group-hover:bg-emerald-50 transition-colors">
                          {job.icon}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-black text-stone-900">
                            {job.type} · {job.area}
                          </p>
                          <p className="text-[11px] font-medium text-stone-500 leading-tight">
                            {job.customer} • <span className="text-emerald-600 font-bold">{job.time}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveRouteJob(activeRouteJob === job.id ? null : job.id)}
                          className={`flex h-10 items-center justify-center rounded-full border-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeRouteJob === job.id ? "border-emerald-500 bg-emerald-500 text-white" : "border-emerald-600 bg-white text-emerald-600 hover:bg-emerald-50 shadow-md shadow-emerald-100"}`}
                        >
                          {activeRouteJob === job.id ? "✕ Close Map" : "🗺️ View Job Route"}
                        </button>
                        <button className={`inline-block rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-sm transition-all ${job.status === "Scheduled"
                          ? "bg-stone-100 text-stone-400 cursor-default"
                          : "bg-stone-900 text-white hover:bg-emerald-600 active:scale-95"
                          }`}>
                          {job.status === "Scheduled" ? "Accepted" : "Accept →"}
                        </button>
                      </div>
                    </div>

                    {activeRouteJob === job.id && (
                      <div className="mt-4 animate-slide-up space-y-4">
                        <LiveMap interactive={false} showRoute={true} height="200px" className="rounded-2xl border-emerald-200" />
                        <div className="flex items-center justify-between rounded-2xl bg-white p-3 border border-emerald-100">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">🧭</span>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 leading-none">Direct Route</p>
                              <p className="text-xs font-bold text-stone-900 mt-1">12 mins away (4.2 km)</p>
                            </div>
                          </div>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.area)}`}
                            target="_blank"
                            className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800"
                          >
                            Open Maps ↗
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Sidebar: Breakdown & Support */}
            <aside className="space-y-6">
              <section className="card-vibe rounded-3xl p-6 border-2 border-dashed border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white overflow-hidden relative">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-4">Earnings Breakdown</h3>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-end border-b border-emerald-100 pb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase">Jobs completed</span>
                    <span className="text-lg font-black text-stone-900">12</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-emerald-100 pb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase">Total earned</span>
                    <span className="text-lg font-black text-emerald-600">₦65,000</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-stone-500 uppercase">Avg / Job</span>
                    <span className="text-lg font-black text-stone-900">₦5,416</span>
                  </div>
                </div>
                <div className="mt-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-[10px] font-medium text-emerald-800 leading-relaxed italic">
                  💡 High demand in <span className="font-black">your area</span> this week. Set your availability to early mornings to earn up to 1.5x.
                </div>
                <div className="absolute -right-6 -bottom-6 text-9xl text-emerald-500/5 font-black uppercase rotate-12 select-none pointer-events-none">CASH</div>
              </section>

              <div className="card-vibe rounded-3xl p-6 border border-stone-100 bg-white/60">
                <h3 className="text-sm font-black text-stone-900">Worker Support</h3>
                <p className="mt-1 text-[11px] font-medium text-stone-500 italic">Get help with jobs or payments</p>
                <div className="mt-4 grid gap-3">
                  <a
                    href="https://wa.me/2348123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive-tap flex items-center justify-center gap-2 rounded-2xl border-2 border-stone-200 bg-white py-3 text-xs font-bold text-stone-700 transition hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                  >
                    <span className="text-xl text-emerald-500">💬</span>
                    Help Center
                  </a>
                </div>
              </div>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}
