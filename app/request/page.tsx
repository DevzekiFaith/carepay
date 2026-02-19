 "use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";

const REQUEST_HERO_IMAGE = "/su4.jpg";

const SERVICES = [
  { label: "Plumber", emoji: "🔧" },
  { label: "Electrician", emoji: "💡" },
  { label: "Carpenter", emoji: "🪚" },
  { label: "Furniture Maker", emoji: "🪑" },
  { label: "AC & Fridge Repair", emoji: "❄️" },
  { label: "Painter", emoji: "🎨" },
  { label: "General Handyman", emoji: "🔨" },
];

export default function RequestPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
      setSelectedService(null);
    }, 800);
  };

  return (
    <div className="min-h-screen vibe-bg text-stone-900 antialiased">
      <div className="mx-auto flex min-w-0 max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 opacity-0 animate-fade-in sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="pill-vibe inline-flex rounded-full px-3 py-1 text-xs">
              New request
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Book a pro in Lagos
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Pick a service, drop your details—we&apos;ll match you with a nearby pro.
            </p>
          </div>
          <Link
            href="/"
            className="flex min-h-[44px] items-center text-sm font-medium text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline"
          >
            ← Back
          </Link>
        </header>

        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2 opacity-0 animate-slide-up">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              selectedService
                ? "bg-violet-100 text-violet-700"
                : "bg-stone-100 text-stone-600"
            }`}
          >
            {selectedService ? "1 ✓" : "1"} Service
          </span>
          <span className="h-px w-4 bg-stone-200" />
          <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600">
            2 Details
          </span>
        </div>

        <main className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <section className="card-vibe card-hover space-y-8 rounded-2xl p-5 opacity-0 animate-slide-up delay-1 sm:p-7">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                Pick what you need
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Tap one—we&apos;ll find the right pro.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SERVICES.map(({ label, emoji }) => {
                  const isActive = selectedService === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelectedService(isActive ? null : label)
                      }
                      className={`card-hover interactive-tap group flex items-center justify-center gap-2 rounded-xl border-2 px-2 py-2 text-center text-xs font-semibold transition-all sm:px-3 sm:py-3 sm:text-sm ${
                        isActive
                          ? "border-violet-500 bg-violet-50 text-violet-700 shadow-lg ring-2 ring-violet-200/60"
                          : "border-stone-200 bg-white text-stone-700 hover:border-violet-300 hover:bg-violet-50/50"
                      }`}
                    >
                      <span className="text-base sm:text-lg" aria-hidden>{emoji}</span>
                      {isActive && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white" aria-hidden>✓</span>
                      )}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                Your details
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                We&apos;ll use this to confirm your booking and share updates.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-4 text-sm"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Full name
                    </label>
                    <input
                      required
                      name="fullName"
                      placeholder="John Doe"
                      className="input-vibe w-full rounded-xl border-2 border-stone-200 bg-stone-50/80 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Phone number
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="+234 812 345 6789"
                      className="input-vibe w-full rounded-xl border-2 border-stone-200 bg-stone-50/80 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Address
                  </label>
                  <input
                    required
                    name="address"
                    placeholder="House number, street, area"
                    className="input-vibe w-full rounded-xl border-2 border-stone-200 bg-stone-50/80 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Service type
                    </label>
                    <select
                      required
                      name="service"
                      value={selectedService ?? ""}
                      onChange={(e) =>
                        setSelectedService(
                          e.target.value || null,
                        )
                      }
                      className="input-vibe w-full rounded-xl border-2 border-stone-200 bg-stone-50/80 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    >
                      <option value="">Select a service</option>
                      {SERVICES.map(({ label }) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Preferred time
                    </label>
                    <input
                      type="datetime-local"
                      name="preferredTime"
                      className="input-vibe w-full rounded-xl border-2 border-stone-200 bg-stone-50/80 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    What needs to be done?
                  </label>
                  <textarea
                    required
                    name="details"
                    rows={4}
                    placeholder="Describe the issue—photos on WhatsApp help. We'll match the right pro."
                    className="input-vibe w-full resize-none rounded-xl border-2 border-stone-200 bg-stone-50/80 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-stone-600">
                    <input
                      type="checkbox"
                      name="whatsapp"
                      defaultChecked
                      className="h-3.5 w-3.5 rounded border-stone-300 text-violet-600 focus:ring-violet-500"
                    />
                    Contact me on WhatsApp for faster updates
                  </label>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 flex-1 text-xs text-stone-500">
                    We&apos;ll create your request and a pro will confirm before coming.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gradient interactive-tap order-first w-full min-h-[44px] shrink-0 rounded-full px-4 py-2.5 text-sm sm:order-none sm:ml-4 sm:w-auto disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-70"
                  >
                    {submitting ? (
                      <span className="animate-pulse-soft">Sending…</span>
                    ) : (
                      "Submit request"
                    )}
                  </button>
                </div>

                {submitted && (
                  <div className="animate-success-pop rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4">
                    <p className="text-base font-bold text-emerald-800">
                      You&apos;re in! 🎉
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      We&apos;re on it—someone will hit you up soon to confirm time & price.
                    </p>
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-white/80 p-2.5 text-xs text-stone-700">
                      <p className="font-semibold text-stone-800">You&apos;re in — pay before the job:</p>
                      <p><span className="font-medium">Bank:</span> {PAYMENT_ACCOUNT.bankName}</p>
                      <p><span className="font-medium">Account:</span> {PAYMENT_ACCOUNT.accountName}</p>
                      <p><span className="font-medium">Number:</span> {PAYMENT_ACCOUNT.accountNumber}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href="/customer/dashboard"
                        className="inline-flex min-h-[44px] items-center rounded-full bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Track requests
                      </Link>
                      <Link
                        href="/request"
                        className="inline-flex min-h-[44px] items-center rounded-full border-2 border-emerald-300 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Book another
                      </Link>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </section>

          <aside className="card-vibe space-y-6 rounded-2xl border-2 border-dashed border-violet-200/60 bg-white/80 p-5 text-sm text-stone-700 opacity-0 animate-slide-up delay-2 sm:p-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-stone-200">
              <Image
                src={REQUEST_HERO_IMAGE}
                alt="Handyman with tools"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                What happens next
              </h2>
              <ol className="mt-3 space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-amber-100 text-xs font-bold text-violet-700">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">Request created</p>
                    <p className="text-xs text-stone-500">
                      We match you to a nearby pro.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-amber-100 text-xs font-bold text-violet-700">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">They hit you up</p>
                    <p className="text-xs text-stone-500">
                      Confirm time, price & details.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-amber-100 text-xs font-bold text-violet-700">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">Pay before the job.</p>
                    <p className="text-xs text-stone-500">
                      Pay to our bank details, then we send the pro.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Pay before the job
              </h3>
              <p className="mt-2 text-xs text-stone-700">
                <span className="font-semibold">Bank:</span> {PAYMENT_ACCOUNT.bankName}
              </p>
              <p className="mt-0.5 text-xs text-stone-700">
                <span className="font-semibold">Account name:</span> {PAYMENT_ACCOUNT.accountName}
              </p>
              <p className="mt-0.5 text-xs text-stone-700">
                <span className="font-semibold">Account no.:</span> {PAYMENT_ACCOUNT.accountNumber}
              </p>
            </div>

            <p className="rounded-xl bg-gradient-to-r from-violet-50 to-amber-50 py-2.5 text-center text-xs font-semibold text-stone-600">
              🔒 Vetted pros · Lagos-wide
            </p>

            <div className="border-t border-stone-200 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Coming soon
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-stone-600">
                <li>• Live request status</li>
                <li>• Pro profiles & ratings</li>
                <li>• In-app payments</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

