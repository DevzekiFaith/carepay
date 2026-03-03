"use client";

import Image from "next/image";
import Link from "next/link";

const DEMO_REQUESTS = [
  {
    id: "REQ-3001",
    type: "Carpenter",
    summary: "Fix wardrobe hinges",
    status: "In Progress",
    step: 2,
    date: "Today",
    icon: "🪚",
  },
  {
    id: "REQ-3002",
    type: "Electrician",
    summary: "Install ceiling fan",
    status: "Scheduled",
    step: 1,
    date: "Yesterday",
    icon: "💡",
  },
];

const TOP_PROS = [
  { name: "Musa I.", skill: "Plumbing", rating: 4.9, jobs: 128, image: "/su4.jpg" },
  { name: "Sarah O.", skill: "Electrical", rating: 4.8, jobs: 94, image: "/su5.jpg" },
  { name: "David A.", skill: "Carpentry", rating: 5.0, jobs: 210, image: "/su6.jpg" },
];

const USER_IMAGE = "/su1.jpg";

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen vibe-bg text-stone-900 antialiased selection:bg-emerald-100 pb-20">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header Section */}
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-3xl border-4 border-white shadow-xl ring-1 ring-stone-100 shrink-0">
              <Image src={USER_IMAGE} alt="Profile" fill className="object-cover" sizes="80px" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  Premium Member
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-stone-900">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">John!</span>
              </h1>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-tighter mt-0.5">
                Verified User • 3 requests completed
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/request"
              className="btn-gradient interactive-tap flex items-center justify-center rounded-full px-6 py-3 text-sm shadow-lg shadow-emerald-200/50"
            >
              + New Request
            </Link>
          </div>
        </header>

        <main className="space-y-8 animate-slide-up delay-1">

          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="card-vibe group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.02]">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total requests</p>
                <p className="mt-2 text-4xl font-black text-stone-900">3</p>
              </div>
              <div className="absolute -right-4 -top-4 text-6xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity select-none">📊</div>
            </div>

            <div className="card-vibe group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.02] bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 border-emerald-100">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60">Completed</p>
                <div className="flex items-baseline gap-2">
                  <p className="mt-2 text-4xl font-black text-emerald-700">2</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-white/80 px-1.5 py-0.5 rounded-md border border-emerald-200">✓ Vetted</span>
                </div>
              </div>
              <div className="absolute -right-4 -top-4 text-6xl opacity-[0.05] group-hover:opacity-[0.1] transition-opacity select-none">✅</div>
            </div>

            <div className="card-vibe group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.02] bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 border-emerald-100">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60">In Progress</p>
                <p className="mt-2 text-4xl font-black text-emerald-700">1</p>
              </div>
              <div className="absolute -right-4 -top-4 text-6xl opacity-[0.05] group-hover:opacity-[0.1] transition-opacity select-none">⚡️</div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

            {/* Recent Activity */}
            <section className="card-vibe overflow-hidden rounded-3xl p-5 sm:p-8 shadow-xl shadow-stone-200/40">
              <div className="mb-8 border-b border-stone-100 pb-6">
                <h2 className="text-xl font-extrabold text-stone-900 leading-none">Your Requests</h2>
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-2 px-0.5">Track your bookings in real-time</p>
              </div>
              <Link
                href="/request"
                className="text-xs font-black uppercase tracking-widest text-emerald-600 border-b-2 border-emerald-100 hover:border-emerald-500 transition-all pb-0.5"
              >
                View All →
              </Link>
              {/* Live Tracker View */}
              <section className="card-vibe rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/40">
                <div className="mb-6">
                  <h2 className="text-lg font-black text-stone-900 leading-none">Active Trackers</h2>
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mt-1">Real-time job progress</p>
                </div>

                <div className="grid gap-6">
                  {DEMO_REQUESTS.map((request) => (
                    <div key={request.id} className="relative rounded-2xl border-2 border-stone-100 bg-white p-5 transition-all hover:border-emerald-100 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-50 text-2xl group-hover:bg-emerald-50 transition-colors">
                            {request.icon}
                          </div>
                          <div>
                            <p className="text-sm font-black text-stone-900">{request.type}</p>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">ID: {request.id}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-200">
                          {request.status}
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="relative flex justify-between">
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-100" />
                        <div
                          className="absolute top-4 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
                          style={{ width: `${(request.step / 3) * 100}%` }}
                        />
                        {["Request", "Matching", "En Route", "Working"].map((label, i) => (
                          <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`h-8 w-8 rounded-full border-4 flex items-center justify-center text-[10px] font-black transition-colors ${i <= request.step ? "bg-emerald-500 border-white text-white shadow-md shadow-emerald-200" : "bg-white border-stone-100 text-stone-300"}`}>
                              {i <= request.step ? "✓" : i + 1}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tight ${i <= request.step ? "text-emerald-700" : "text-stone-400"}`}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </section>

            {/* Sidebar with Refer & Support */}
            <aside className="space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-6 text-white shadow-xl shadow-emerald-200/50">
                <h3 className="text-xl font-black">Refer & Get ₦500</h3>
                <p className="mt-2 text-xs font-medium text-white/90 leading-relaxed">
                  Share CarePay with your community and both get ₦500 credit on your next booking.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const shareText = encodeURIComponent("Check out CarePay - book handymen in your area in 2 mins!");
                    const shareUrl = window.location.origin;
                    if (navigator.share) {
                      navigator.share({ title: "CarePay", text: shareText, url: shareUrl });
                    } else {
                      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                      alert("Referral link copied!");
                    }
                  }}
                  className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-xs font-black text-emerald-700 shadow-lg active:scale-95 transition-transform"
                >
                  Invite Friends
                </button>
              </div>

              {/* Top Rated Pros */}
              <div className="card-vibe rounded-3xl p-6 shadow-xl shadow-stone-200/40">
                <div className="mb-4">
                  <h3 className="text-sm font-black text-stone-900">Verified Pros Nearby</h3>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Available now in your city</p>
                </div>
                <div className="space-y-4">
                  {TOP_PROS.map((pro) => (
                    <div key={pro.name} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-white shadow-sm ring-1 ring-stone-100">
                          <Image src={pro.image} alt={pro.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-stone-900 group-hover:text-emerald-600 transition-colors">{pro.name}</p>
                          <p className="text-[9px] font-medium text-stone-500">{pro.skill} • ⭐ {pro.rating}</p>
                        </div>
                      </div>
                      <div className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        Available
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-vibe rounded-3xl p-6 border-2 border-dashed border-stone-200 bg-white/60">
                <h3 className="text-sm font-black text-stone-900">Need Help?</h3>
                <p className="mt-1 text-[11px] font-medium text-stone-500 italic">24/7 Priority Support for premium members</p>
                <div className="mt-4 grid gap-3">
                  <a
                    href="https://wa.me/2348123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-between rounded-2xl border-2 border-stone-100 bg-white p-4 transition-all hover:border-emerald-100 hover:shadow-md active:scale-[0.99]"
                  >
                    <span className="text-base text-emerald-500">💬</span>
                    WhatsApp Chat
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
