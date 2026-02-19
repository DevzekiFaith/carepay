 "use client";

import Link from "next/link";

const DEMO_REQUESTS = [
  {
    id: "REQ-3001",
    type: "Carpenter",
    summary: "Fix wardrobe hinges and replace drawer handle",
    status: "Awaiting match",
    date: "Today",
  },
  {
    id: "REQ-3002",
    type: "Electrician",
    summary: "Install new ceiling fan in living room",
    status: "Scheduled",
    date: "Yesterday",
  },
];

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen vibe-bg px-4 py-8 text-stone-900 antialiased">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
              Welcome back!
            </h1>
            <p className="mt-1 text-xs text-stone-500">
              Track your requests, see your history, and manage your account.
            </p>
          </div>
          <div className="text-right text-xs text-stone-500">
            <p className="font-semibold text-stone-700">John Doe</p>
            <p>Lagos customer</p>
          </div>
        </header>

        <main className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-vibe rounded-xl p-4">
              <p className="text-xs text-stone-500">Total requests</p>
              <p className="mt-1 text-2xl font-bold text-stone-900">12</p>
            </div>
            <div className="card-vibe rounded-xl p-4">
              <p className="text-xs text-stone-500">Completed</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">10</p>
            </div>
            <div className="card-vibe rounded-xl p-4">
              <p className="text-xs text-stone-500">In progress</p>
              <p className="mt-1 text-2xl font-bold text-violet-600">2</p>
            </div>
          </div>

          {/* Quick actions */}
          <section className="card-vibe rounded-xl p-5">
            <h2 className="text-sm font-semibold text-stone-800 mb-3">Quick actions</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/request"
                className="btn-gradient interactive-tap inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold"
              >
                New request
              </Link>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-tap inline-flex items-center rounded-full border-2 border-stone-300 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                WhatsApp support
              </a>
            </div>
          </section>

          {/* Recent requests */}
          <section className="card-vibe rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-800">
                Recent requests
              </h2>
              <Link
                href="/request"
                className="text-xs font-medium text-violet-600 underline-offset-2 hover:underline"
              >
                New request
              </Link>
            </div>
            <div className="divide-y divide-stone-100">
              {DEMO_REQUESTS.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-stone-800">
                      {request.type}
                    </p>
                    <p className="text-xs text-stone-500">{request.summary}</p>
                    <p className="text-[10px] text-stone-400">{request.date}</p>
                  </div>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-700">
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Referral */}
          <section className="card-vibe rounded-xl border-2 border-dashed border-violet-200/60 bg-gradient-to-br from-violet-50 to-amber-50 p-5">
            <h3 className="text-sm font-semibold text-stone-800">Invite friends, get rewards</h3>
            <p className="mt-1 text-xs text-stone-600">
              Share CarePay and both you and your friend get ₦500 credit.
            </p>
            <button
              type="button"
              onClick={() => {
                const shareText = encodeURIComponent("Check out CarePay - book handymen in Lagos!");
                const shareUrl = window.location.origin;
                if (navigator.share) {
                  navigator.share({ title: "CarePay", text: shareText, url: shareUrl });
                } else {
                  navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                  alert("Referral link copied!");
                }
              }}
              className="mt-3 w-full rounded-lg border-2 border-violet-300 bg-white px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              Share & Get ₦500
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

