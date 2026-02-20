"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";

/* CarePay images from /public */
const HERO_IMAGE = "/su9.jpg";
const PRO_IMAGES = [
  { src: "/su10.jpg", alt: "Electrician at work" },
  { src: "/su11.jpg", alt: "Handyman with tools" },
  { src: "/su12.jpg", alt: "Technician repairing" },
];

const SERVICES = [
  { label: "Plumber", emoji: "🔧", price: "₦5,000 - ₦20,000", time: "2-4 hrs" },
  { label: "Electrician", emoji: "💡", price: "₦8,000 - ₦25,000", time: "2-5 hrs" },
  { label: "Carpenter", emoji: "🪚", price: "₦10,000 - ₦40,000", time: "3-6 hrs" },
  { label: "Furniture Maker", emoji: "🪑", price: "₦15,000 - ₦60,000", time: "4-8 hrs" },
  { label: "AC & Fridge Repair", emoji: "❄️", price: "₦7,000 - ₦30,000", time: "2-4 hrs" },
  { label: "Painter", emoji: "🎨", price: "₦12,000 - ₦50,000", time: "4-8 hrs" },
  { label: "General Handyman", emoji: "🔨", price: "₦5,000 - ₦25,000", time: "2-5 hrs" },
];

const TESTIMONIALS = [
  { name: "Chioma O.", area: "Ikeja", text: "Fixed my sink in 2 hours. The plumber was professional and clean. Highly recommend!", rating: 5 },
  { name: "Tunde M.", area: "Lekki", text: "Best electrician I've used. Fair pricing and did quality work. Will book again.", rating: 5 },
  { name: "Amina K.", area: "Yaba", text: "Quick response, great service. The carpenter fixed my wardrobe perfectly.", rating: 5 },
];

export default function Home() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [jobsCompleted] = useState(1247); // Animated counter - replace with real data later

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setSubmitting(true);

    // For MVP: just fake a request and show feedback
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
        {/* Header */}
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-fade-in">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill-vibe inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
                ⚡ 2 min to book
              </span>
              <span className="hidden text-[10px] font-medium text-stone-400 sm:inline">
                Lagos · Same-day
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Fix it. Book it. Done.
            </h1>
            <p className="mt-2 max-w-xl text-base text-stone-600">
              Plumbers, electricians, carpenters & more—vetted pros at your place. Book in 2 mins, we handle the rest.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/request"
                className="group btn-gradient interactive-tap inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm"
              >
                Book a pro
                <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>→</span>
              </Link>
              <Link
                href="/auth/worker/register"
                className="interactive-tap inline-flex items-center justify-center rounded-full border-2 border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50/50"
              >
                I&apos;m a handyman
              </Link>
            </div>
          </div>
          <div className="hidden sm:block sm:w-64 shrink-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-stone-200/80 shadow-lg">
              <Image
                src={HERO_IMAGE}
                alt="Handyman working on a repair"
                fill
                className="object-cover"
                sizes="256px"
                priority
              />
            </div>
            <p className="mt-2 text-right text-xs font-semibold text-stone-600">Need help rn? We match you with vetted pros.</p>
          </div>
        </header>

        {/* Hero image on mobile */}
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border-2 border-stone-200/80 opacity-0 animate-slide-up sm:hidden">
          <Image
            src={HERO_IMAGE}
            alt="Handyman working on a repair"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 0px"
          />
        </div>

        {/* Main content */}
        <main className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left: Service selection & quick request */}
          <section className="card-vibe card-hover space-y-8 rounded-2xl p-5 sm:p-7 opacity-0 animate-slide-up delay-1">
            {/* Service selector */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                Pick what you need
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Tap one—we&apos;ll match you with the right pro.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SERVICES.map(({ label, emoji, price, time }) => {
                  const isActive = selectedService === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelectedService(isActive ? null : label)
                      }
                      className={`card-hover interactive-tap group flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-2 py-2 text-center text-xs font-semibold transition-all sm:px-3 sm:py-3 sm:text-sm ${isActive
                        ? "border-violet-500 bg-violet-50 text-violet-700 shadow-lg ring-2 ring-violet-200/60"
                        : "border-stone-200 bg-white text-stone-700 hover:border-violet-300 hover:bg-violet-50/50"
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base sm:text-lg" aria-hidden>{emoji}</span>
                        {isActive && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white" aria-hidden>✓</span>
                        )}
                      </div>
                      <span className="font-semibold">{label}</span>
                      <span className="text-[10px] font-medium text-stone-500">{price}</span>
                      <span className="text-[10px] text-stone-400">{time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Request form */}
            <div className="border-t border-stone-100 pt-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                  Quick request
                </h2>
                <Link
                  href="/request"
                  className="text-xs font-semibold text-violet-600 underline-offset-2 hover:text-violet-700 hover:underline"
                >
                  Full form →
                </Link>
              </div>
              <p className="mt-1 text-sm text-stone-500">
                Drop your details—we&apos;ll find a nearby pro and confirm.
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

                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
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
                    rows={3}
                    placeholder="e.g. leaking sink, install ceiling fan, fix wardrobe—we'll match the right pro."
                    className="input-vibe w-full resize-none rounded-xl border-2 border-stone-200 bg-stone-50/80 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 flex-1 text-xs text-stone-500">
                    We&apos;ll reach out on WhatsApp or phone to confirm your
                    request.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gradient interactive-tap order-first w-full min-h-[44px] shrink-0 rounded-full px-4 py-2.5 text-sm sm:order-none sm:ml-4 sm:w-auto disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-70"
                  >
                    {submitting ? (
                      <span className="animate-pulse-soft">Sending…</span>
                    ) : (
                      "Request a handyman"
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
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="inline-flex min-h-[44px] items-center rounded-full border-2 border-emerald-300 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Book another
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* Right: How it works / highlights */}
          <aside className="card-vibe space-y-6 rounded-2xl border-2 border-dashed border-violet-200/60 bg-white/80 p-5 text-sm text-stone-700 opacity-0 animate-slide-up delay-2 sm:p-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                Pros at work
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {PRO_IMAGES.map(({ src, alt }, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-stone-200">
                    <Image src={src} alt={alt} fill className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                How it works
              </h2>
              <ol className="mt-3 space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-amber-100 text-xs font-bold text-violet-700">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">Tell us what you need</p>
                    <p className="text-xs text-stone-500">
                      Description, location, when you need them.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-amber-100 text-xs font-bold text-violet-700">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-stone-800">We match you with a pro</p>
                    <p className="text-xs text-stone-500">
                      Vetted technician confirms visit & price.
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

            <div className="rounded-xl border border-stone-200 bg-gradient-to-br from-violet-50 to-amber-50 p-3">
              <p className="text-center text-xs font-semibold text-stone-700">
                <span className="text-lg font-bold text-violet-700">{jobsCompleted.toLocaleString()}+</span>
                <br />
                <span className="text-[10px] text-stone-600">Jobs completed this month</span>
              </p>
            </div>

            <div className="border-t border-stone-200 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                What customers say
              </h3>
              <div className="mt-3 space-y-3">
                {TESTIMONIALS.map((testimonial, i) => (
                  <div key={i} className="rounded-lg border border-stone-200 bg-white p-2.5 text-xs">
                    <div className="mb-1 flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <span key={j} className="text-[10px] text-amber-500">★</span>
                      ))}
                    </div>
                    <p className="text-stone-700">&quot;{testimonial.text}&quot;</p>
                    <p className="mt-1.5 text-[10px] font-medium text-stone-500">
                      {testimonial.name} · {testimonial.area}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-200 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Refer a friend
              </h3>
              <p className="mt-2 text-xs text-stone-600">
                Share CarePay and both you and your friend get ₦500 credit on your next booking.
              </p>
              <button
                type="button"
                onClick={() => {
                  const shareText = encodeURIComponent("Check out CarePay - book handymen in Lagos in 2 mins! Fix it. Book it. Done.");
                  const shareUrl = window.location.origin;
                  if (navigator.share) {
                    navigator.share({ title: "CarePay", text: shareText, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                    alert("Referral link copied! Share it with friends.");
                  }
                }}
                className="mt-2 w-full rounded-lg border-2 border-violet-300 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
              >
                Share & Get ₦500
              </button>
            </div>

            <div className="border-t border-stone-200 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                No stress
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-stone-600">
                <li>• Book in 2 mins, no sign-up required.</li>
                <li>• Real pros, real reviews (coming soon).</li>
                <li>• Pay before the job (bank details above).</li>
              </ul>
            </div>
          </aside>
        </main>

        {/* FAQ Section */}
        <section id="faq" className="mx-auto mt-12 max-w-5xl px-4 opacity-0 animate-slide-up delay-3 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
            Frequently asked questions
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-stone-800">How do I pay?</h3>
              <p className="mt-1 text-xs text-stone-600">
                Pay to our Globus Bank account before the job. Bank details are shown after you submit a request.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-stone-800">How quickly will someone come?</h3>
              <p className="mt-1 text-xs text-stone-600">
                Usually same-day or next day, depending on your preferred time and worker availability.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-stone-800">Are workers verified?</h3>
              <p className="mt-1 text-xs text-stone-600">
                Yes. All workers register with their NIN for verification and traceability.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-stone-800">What if I&apos;m not happy with the work?</h3>
              <p className="mt-1 text-xs text-stone-600">
                Contact us via WhatsApp. We&apos;ll work with you and the worker to make it right.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
