"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import { motion } from "framer-motion";

const REQUEST_HERO_IMAGE = "/su4.jpg";

import { Wrench, Zap, Hammer, Armchair, Snowflake, Paintbrush, PenTool } from "lucide-react";

const SERVICES = [
  { label: "Plumber", icon: Wrench, price: "₦5,000 Start" },
  { label: "Electrician", icon: Zap, price: "₦8,000 Start" },
  { label: "Carpenter", icon: Hammer, price: "₦10,000 Start" },
  { label: "Furniture Maker", icon: Armchair, price: "₦15,000 Start" },
  { label: "AC & Fridge Repair", icon: Snowflake, price: "₦7,000 Start" },
  { label: "Painter", icon: Paintbrush, price: "₦12,000 Start" },
  { label: "General Handyman", icon: PenTool, price: "₦5,000 Start" },
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
    <div className="min-h-screen bg-background text-foreground antialiased py-12 sm:py-24">
      <div className="mx-auto flex min-w-0 max-w-5xl flex-col px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0">
            <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground sm:text-4xl">
              Book a Professional
            </h1>
            <p className="mt-2 text-sm text-zinc-500 font-medium">
              Select a service and provide your details. We match you instantly.
            </p>
          </div>
          <Link
            href="/"
            className="flex h-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 px-6 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            ← Home
          </Link>
        </motion.header>

        <main className="grid flex-1 gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
                1. Select Service
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {SERVICES.map((service) => {
                  const isActive = selectedService === service.label;
                  return (
                    <button
                      key={service.label}
                      type="button"
                      onClick={() => setSelectedService(isActive ? null : service.label)}
                      className={`group flex flex-col items-start rounded-2xl border transition-all duration-300 overflow-hidden text-left w-full p-4 sm:p-5 ${isActive
                        ? "bg-foreground text-background border-transparent shadow-premium-hover scale-[1.02]"
                        : "bg-background text-foreground border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-premium"
                        }`}
                    >
                      <div className="flex w-full items-start justify-between mb-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isActive
                          ? "bg-background/10 text-background"
                          : "bg-zinc-100 dark:bg-zinc-900 text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800"
                          }`}>
                          <service.icon size={18} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
                        </div>
                      </div>

                      <h3 className="text-sm font-bold tracking-tight mt-4 mb-2">
                        {service.label}
                      </h3>

                      <div className={`flex flex-col items-start w-full pt-3 border-t transition-colors ${isActive ? "border-background/10" : "border-zinc-100 dark:border-zinc-800"}`}>
                        <span className={`text-sm font-bold tracking-tight ${isActive ? "text-background" : "text-foreground"}`}>
                          {service.price.split(' ')[0]}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase tracking-widest ${isActive ? "text-background/60" : "text-zinc-500"}`}>
                          {service.price.split(' ').slice(1).join(' ')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
                2. Your Details
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Full name
                    </label>
                    <input
                      required
                      name="fullName"
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Phone number
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="+234 812 345 6789"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Address
                  </label>
                  <input
                    required
                    name="address"
                    placeholder="House number, street, area"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-foreground"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Service
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
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-foreground appearance-none"
                    >
                      <option value="">Select a service</option>
                      {SERVICES.map(({ label }) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Preferred time
                    </label>
                    <input
                      type="datetime-local"
                      name="preferredTime"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Work Description
                  </label>
                  <textarea
                    required
                    name="details"
                    rows={4}
                    placeholder="Describe the issue. Detailed descriptions help us match the right pro."
                    className="w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      name="whatsapp"
                      defaultChecked
                      className="h-4 w-4 rounded border-zinc-300 text-foreground focus:ring-foreground accent-foreground"
                    />
                    Contact me on WhatsApp for faster updates
                  </label>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-minimal h-12 w-full sm:w-auto min-w-[200px] rounded-full px-8 text-xs font-bold uppercase tracking-widest shadow-premium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                        Processing
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8"
                  >
                    <h3 className="text-xl font-heading font-bold text-foreground">Request confirmed.</h3>
                    <p className="mt-2 text-sm text-zinc-500">We will contact you shortly to confirm time & pricing.</p>

                    <div className="mt-6 rounded-xl bg-background border border-zinc-200 dark:border-zinc-800 p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Payment Details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Bank Name</p>
                          <p className="text-sm font-semibold text-foreground">{PAYMENT_ACCOUNT.bankName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Account No.</p>
                          <p className="text-sm font-semibold text-foreground">{PAYMENT_ACCOUNT.accountNumber}</p>
                        </div>
                        <div className="sm:col-span-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Account Name</p>
                          <p className="text-sm font-semibold text-foreground">{PAYMENT_ACCOUNT.accountName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        href="/customer/dashboard"
                        className="btn-minimal h-10 rounded-full px-6 flex items-center text-xs font-bold uppercase tracking-widest"
                      >
                        Track Status
                      </Link>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Image
                src={REQUEST_HERO_IMAGE}
                alt="Expert Professional"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
                How It Works
              </h2>
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-foreground">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Submit Details</p>
                    <p className="mt-1 text-xs text-zinc-500">Provide the task specifics and preferred timing.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-foreground">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Match & Confirm</p>
                    <p className="mt-1 text-xs text-zinc-500">We assign an elite pro and confirm pricing.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-foreground">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Execution</p>
                    <p className="mt-1 text-xs text-zinc-500">Fast, reliable resolution of your issue.</p>
                  </div>
                </li>
              </ol>
            </div>
          </motion.aside>
        </main>
      </div>
    </div>
  );
}
