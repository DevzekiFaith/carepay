"use client";

import Image from "next/image";
import Link from "next/link";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import ModernCalendar from "../components/ModernCalendar";
import MockMap from "../components/MockMap";
import dynamic from "next/dynamic";
import { FormEvent, useState } from "react";

const LiveMap = dynamic(() => import("../components/LiveMap"), {
  ssr: false,
  loading: () => <div className="h-[280px] w-full bg-stone-100 animate-pulse rounded-2xl" />
});

import { Wrench, Lightbulb, Hammer, Sofa, Snowflake, Palette, Settings, MapPin, CheckCircle2, ChevronRight, MessageSquare, Clock, ArrowLeft } from "lucide-react";

const REQUEST_HERO_IMAGE = "/su3.jpg";

const SERVICES = [
  { label: "Plumber", icon: Wrench, basePrice: "₦5,000" },
  { label: "Electrician", icon: Lightbulb, basePrice: "₦4,500" },
  { label: "Carpenter", icon: Hammer, basePrice: "₦6,000" },
  { label: "Furniture Maker", icon: Sofa, basePrice: "₦8,000" },
  { label: "AC & Fridge Repair", icon: Snowflake, basePrice: "₦10,000" },
  { label: "Painter", icon: Palette, basePrice: "₦5,500" },
  { label: "General Handyman", icon: Settings, basePrice: "₦3,000" },
];
export default function RequestPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
      setSelectedService(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen vibe-bg text-stone-900 antialiased selection:bg-emerald-100 pb-20">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumbs / Header */}
        <header className="mb-10 flex flex-col gap-4 animate-fade-in sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-emerald-600 transition-colors">Home</Link>
              <span className="text-stone-300 text-[10px]">/</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">New Request</span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-900 sm:text-5xl">
              Professional Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">Booking</span>
            </h1>
            <p className="mt-2 text-base font-medium text-stone-600 sm:text-lg">
              Licensed technicians at your doorstep in under 2 hours.
            </p>
          </div>
          <Link
            href="/"
            className="group flex h-11 items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-all border-2 border-stone-200 rounded-full px-5 bg-white sm:h-auto sm:py-2.5"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" /> Back Home
          </Link>
        </header>

        {/* Form Container */}
        <main className="grid flex-1 gap-8 lg:grid-cols-[1.4fr_1fr]">

          <section className="card-vibe animate-slide-up delay-1 overflow-hidden rounded-3xl border border-stone-100 shadow-2xl shadow-stone-200/50">
            <div className="bg-gradient-to-br from-emerald-50/30 to-emerald-50/20 px-6 py-8 sm:px-10">

              <div className="mb-8">
                <h2 className="text-base font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">1</span>
                  Identify the Service
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-3">
                  {SERVICES.map((item) => {
                    const isActive = selectedService === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSelectedService(isActive ? null : item.label)}
                        className={`card-hover interactive-tap group relative flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all ${isActive
                          ? "border-emerald-500 bg-white shadow-lg ring-2 ring-emerald-200/60"
                          : "border-stone-100 bg-white/60 hover:border-emerald-200 hover:bg-white"
                          }`}
                      >
                        <span className={`transition-colors mb-1 ${isActive ? "text-emerald-600" : "text-stone-400 group-hover:text-emerald-500"}`}>
                          <item.icon size={28} strokeWidth={2.5} aria-hidden />
                        </span>
                        <span className={`text-xs font-black uppercase tracking-tight ${isActive ? "text-emerald-900" : "text-stone-700"}`}>{item.label}</span>
                        {isActive && (
                          <div className="absolute top-1.5 right-1.5 rounded-full bg-emerald-600 flex items-center justify-center text-white p-0.5 shadow-md ring-2 ring-white">
                            <CheckCircle2 size={10} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-stone-100">
                <h2 className="text-base font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">2</span>
                  Service Details
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-stone-700 ml-1">Full Name</label>
                    <input
                      required
                      name="fullName"
                      placeholder="Chioma Adebayo"
                      className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-white px-5 py-5 text-lg outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 sm:py-4 sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-stone-700 ml-1">Phone / WhatsApp</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="+234 812 345 6789"
                      className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-white px-5 py-5 text-lg outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 sm:py-4 sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2 relative">
                    <label className="text-[11px] font-black uppercase tracking-widest text-stone-700 ml-1">Service Address</label>
                    <input
                      required
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="E.g. Number, street, area in your city"
                      className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-white px-5 py-5 text-lg outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 sm:py-4 sm:text-base"
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 z-[3000] mt-2 max-h-48 overflow-y-auto rounded-2xl border-2 border-emerald-100 bg-white shadow-2xl animate-fade-in ring-1 ring-emerald-500/10 backdrop-blur-sm">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setAddress(s.display_name);
                              setSuggestions([]);
                            }}
                            className="flex w-full items-start gap-4 border-b border-stone-50 px-5 py-4 text-left hover:bg-emerald-50 transition-colors last:border-0"
                          >
                            <MapPin size={18} className="text-emerald-500 mt-1 shrink-0" />
                            <span className="text-sm font-bold text-stone-900 leading-tight">{s.display_name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="group relative overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white p-2 shadow-lg shadow-emerald-100/20 ring-1 ring-emerald-500/10">
                    <div className="absolute left-6 top-6 z-20 flex flex-col gap-1">
                      <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-white/95 px-3 py-2 rounded-full shadow-sm backdrop-blur-sm border border-emerald-100 animate-pulse">
                        <MapPin size={12} strokeWidth={3} />
                        Select Work Location
                      </p>
                    </div>
                    <LiveMap
                      height="280px"
                      className="rounded-2xl"
                      address={address}
                      onAddressResolved={setAddress}
                      onSuggestionsFound={setSuggestions}
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-stone-700 ml-1">Service Category</label>
                    <select
                      required
                      name="service"
                      value={selectedService ?? ""}
                      onChange={(e) => setSelectedService(e.target.value || null)}
                      className="input-vibe w-full rounded-2xl border-2 border-stone-100 bg-white px-5 py-5 text-lg outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat sm:py-4 sm:text-base"
                    >
                      <option value="">Select a service</option>
                      {SERVICES.map(({ label }) => (
                        <option key={label} value={label}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Preferred Time</label>
                    <ModernCalendar
                      selectedDate={scheduledDate}
                      onSelect={setScheduledDate}
                    />
                    {scheduledDate && (
                      <div className="rounded-2xl bg-emerald-50 px-4 py-3 border border-emerald-100 animate-fade-in">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Selected Schedule</p>
                        <p className="text-sm font-bold text-emerald-900 mt-1">
                          {scheduledDate.toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">Additional Notes</label>
                  <textarea
                    required
                    name="details"
                    rows={4}
                    placeholder="Describe the issue in detail—this helps us send the right tools."
                    className="input-vibe w-full resize-none rounded-2xl border-2 border-stone-100 bg-white px-4 py-4 text-base outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 sm:py-3 sm:text-sm"
                  />
                </div>

                <div className="pt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {selectedService && (
                    <div className="flex flex-col gap-1 animate-fade-in">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Estimated Base Price</p>
                      <p className="text-2xl font-black text-emerald-600">{SERVICES.find(s => s.label === selectedService)?.basePrice}</p>
                    </div>
                  )}
                  {!showPayment ? (
                    <button
                      type="button"
                      disabled={!scheduledDate || !selectedService}
                      onClick={() => setShowPayment(true)}
                      className="btn-gradient relative h-16 rounded-full px-12 text-base font-black shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-3 min-w-[240px] disabled:opacity-50 ml-auto transition-all hover:-translate-y-1"
                    >
                      <span>Add to Cart & Review</span>
                      <ChevronRight size={18} strokeWidth={3} />
                    </button>
                  ) : (
                    <div className="space-y-6 animate-slide-up w-full max-w-sm ml-auto">
                      <div className="rounded-3xl border-2 border-emerald-100 bg-emerald-50/50 p-6 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4">Secured Booking</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-stone-600">Commitment Fee</span>
                          <span className="text-sm font-black text-stone-900">₦2,500</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-medium leading-relaxed italic">
                          * This fee ensures your pro is secured. It will be deducted from your final bill.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-gradient flex h-16 items-center justify-center rounded-full text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-200/50 transition-all active:scale-95"
                        >
                          {submitting ? "Securing Pro..." : "Pay Commitment Fee"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPayment(false)}
                          className="flex h-12 items-center justify-center rounded-full text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors gap-1.5"
                        >
                          <ArrowLeft size={12} strokeWidth={3} /> Change Schedule
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {submitted && (
                  <div className="animate-success-pop rounded-3xl border-2 border-emerald-200 bg-emerald-50/50 p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <CheckCircle2 size={24} strokeWidth={3} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-emerald-900 leading-tight">Booking Sent!</h3>
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">We'll contact you in 5-10 mins</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-emerald-100 shadow-sm space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Payment Breakdown</p>
                      <div className="grid gap-4">
                        <div className="flex justify-between border-b border-stone-50 pb-2">
                          <span className="text-xs font-bold text-stone-600 uppercase">Bank</span>
                          <span className="text-xs font-black text-stone-900">{PAYMENT_ACCOUNT.bankName}</span>
                        </div>
                        <div className="flex justify-between border-b border-stone-50 pb-2">
                          <span className="text-xs font-bold text-stone-600 uppercase">Account No.</span>
                          <span className="text-xs font-black text-stone-900 tracking-widest font-mono">{PAYMENT_ACCOUNT.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-bold text-stone-600 uppercase">Account Name</span>
                          <span className="text-xs font-black text-emerald-700">{PAYMENT_ACCOUNT.accountName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href="/customer/dashboard"
                        className="btn-gradient h-14 rounded-full px-8 flex items-center justify-center text-xs font-black uppercase tracking-widest"
                      >
                        Track Status
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="h-14 rounded-full border-2 border-stone-200 bg-white px-8 text-xs font-black text-stone-700 hover:bg-stone-50 transition-all uppercase tracking-widest"
                      >
                        Another Booking
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-8 animate-slide-up delay-2">

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-white shadow-2xl ring-1 ring-stone-100">
              <Image
                src={REQUEST_HERO_IMAGE}
                alt="Professional at work"
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-black leading-tight">Certified Quality</h3>
                <p className="mt-2 text-xs font-medium text-white/80">Every technician undergoes a background check and skill audit before joining our fleet.</p>
              </div>
            </div>

            <div className="card-vibe p-8 rounded-3xl border-2 border-dashed border-emerald-200/60 bg-white/80">
              <h3 className="text-sm font-black uppercase tracking-widest text-stone-400 mb-6">Execution Path</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Job Matching", desc: "AI finds best pro nearby" },
                  { step: "2", title: "Confirmation", desc: "Pro confirms price on WhatsApp" },
                  { step: "3", title: "Execution", desc: "Work starts upon arrival" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white">{item.step}</span>
                    <div>
                      <p className="text-sm font-black text-stone-900 leading-none">{item.title}</p>
                      <p className="mt-1 text-xs text-stone-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-stone-900 p-8 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">System Live</span>
              </div>
              <p className="text-lg font-bold leading-tight italic text-stone-100">"The fastest way to get things fixed—no drama, just results."</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center font-black text-[10px]">C</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">CarePay Operations</p>
              </div>
            </div>

          </aside>

        </main>
      </div>
    </div>
  );
}
