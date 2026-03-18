"use client";

const DEMO_JOBS = [
  {
    id: "JOB-1024",
    type: "Plumbing",
    customer: "Mrs. Adebayo",
    area: "Ikeja",
    time: "Today · 4:00 PM",
    status: "New",
    price: "₦12,000",
  },
  {
    id: "JOB-1025",
    type: "Electrical",
    customer: "Chinedu Okafor",
    area: "Yaba",
    time: "Tomorrow · 11:30 AM",
    status: "Scheduled",
    price: "₦18,000",
  },
];

export default function WorkerDashboardPage() {
  return (
    <div className="min-h-screen vibe-bg px-4 py-8 text-stone-900 antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              Worker dashboard
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
              Your jobs & earnings
            </h1>
            <p className="mt-1 text-xs text-stone-500">
              Manage your jobs, track earnings, and grow your business.
            </p>
          </div>
          <div className="text-right text-xs text-stone-500">
            <p className="font-semibold text-stone-700">Ibrahim Adewale</p>
            <p>Enugu • Plumber</p>
            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              ✓ Verified
            </span>
          </div>
        </header>

        <main className="mac-stack">
          {/* Earnings stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-vibe mac-card-pad">
              <p className="text-xs text-stone-500">This week</p>
              <p className="mt-1 text-2xl font-bold text-stone-900">₦45,000</p>
            </div>
            <div className="card-vibe mac-card-pad">
              <p className="text-xs text-stone-500">Jobs completed</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">8</p>
            </div>
            <div className="card-vibe mac-card-pad">
              <p className="text-xs text-stone-500">Rating</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">4.8★</p>
            </div>
          </div>

          {/* Upcoming jobs */}
          <section className="card-vibe mac-card-pad">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-800">Upcoming jobs</h2>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-medium text-violet-700">
                2 active
              </span>
            </div>
            <div className="divide-y divide-stone-100">
              {DEMO_JOBS.map((job) => (
                <div key={job.id} className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-stone-800">
                      {job.type} · {job.area}
                    </p>
                    <p className="text-xs text-stone-500">
                      {job.customer} • {job.time}
                    </p>
                    <p className="text-xs font-semibold text-emerald-600">{job.price}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="card-vibe mac-card-pad">
            <h3 className="mb-3 text-sm font-semibold text-stone-800">Quick actions</h3>
            <div className="flex flex-wrap gap-2">
              <button className="interactive-tap rounded-full border-2 border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50">
                Set availability
              </button>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-tap rounded-full border-2 border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Support
              </a>
            </div>
          </section>

          {/* Earnings breakdown */}
          <section className="card-vibe mac-card-pad border-2 border-dashed border-violet-200/60 bg-white/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Earnings this month
            </h3>
            <div className="mt-3 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Completed jobs:</span>
                <span className="font-semibold text-stone-800">32</span>
              </div>
              <div className="flex justify-between">
                <span>Total earned:</span>
                <span className="font-semibold text-emerald-600">₦180,000</span>
              </div>
              <div className="flex justify-between">
                <span>Avg per job:</span>
                <span className="font-semibold text-stone-800">₦5,625</span>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-stone-500">
              Payouts are processed weekly. Check your bank account every Friday.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
