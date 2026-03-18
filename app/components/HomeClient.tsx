"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Hero from "./Hero";
import ServiceGrid from "./ServiceGrid";
import QuickRequestForm from "./QuickRequestForm";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import { motion } from "framer-motion";
import { Wrench, Zap, Hammer, Armchair, Snowflake, Paintbrush, PenTool } from "lucide-react";

const PRO_IMAGES = [
  { src: "/su10.jpg", alt: "Electrician at work" },
  { src: "/su11.jpg", alt: "Handyman with tools" },
  { src: "/su12.jpg", alt: "Technician repairing" },
];

const SERVICES = [
  { label: "Plumber", icon: Wrench, price: "₦5,000 Start", time: "2-4 hrs" },
  { label: "Electrician", icon: Zap, price: "₦8,000 Start", time: "2-5 hrs" },
  { label: "Carpenter", icon: Hammer, price: "₦10,000 Start", time: "3-6 hrs" },
  { label: "Furniture Maker", icon: Armchair, price: "₦15,000 Start", time: "4-8 hrs" },
  { label: "AC & Fridge Repair", icon: Snowflake, price: "₦7,000 Start", time: "2-4 hrs" },
  { label: "Painter", icon: Paintbrush, price: "₦12,000 Start", time: "4-8 hrs" },
  { label: "General Handyman", icon: PenTool, price: "₦5,000 Start", time: "2-5 hrs" },
];

const JOBS_COMPLETED = 1247;

export default function HomeClient() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased w-full overflow-x-hidden">
      <Hero />
      <ServiceGrid
        services={SERVICES}
        selectedService={selectedService}
        onSelectService={setSelectedService}
      />

      <section className="py-24 border-t border-zinc-200 dark:border-zinc-800 bg-background">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
          <div className="space-y-24">
            <QuickRequestForm
              selectedService={selectedService}
              onServiceChange={setSelectedService}
              services={SERVICES}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 bg-zinc-50 dark:bg-zinc-900"
            >
              <h2 className="text-xl font-heading font-bold text-foreground mb-4">Refer & Get ₦500</h2>
              <p className="text-sm font-medium text-zinc-500 mb-6 max-w-md">
                Share CarePay with your community safely, and both you and your friend get ₦500 credit on your next booking.
              </p>
              <button
                type="button"
                onClick={() => {
                  const shareText = encodeURIComponent("Check out CarePay - book handymen in Enugu in 2 mins! Book it. Fix it. Done.");
                  const shareUrl = window.location.origin;
                  if (navigator.share) {
                    navigator.share({ title: "CarePay", text: shareText, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                    alert("Referral link copied!");
                  }
                }}
                className="btn-minimal h-10 px-8 rounded-full text-xs font-bold uppercase tracking-widest shadow-premium"
              >
                Share
              </button>
            </motion.div>

            <div id="faq" className="space-y-8">
              <h2 className="text-2xl font-heading font-bold text-foreground">Common Questions</h2>
              <div className="space-y-4 max-w-2xl">
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <h3 className="text-sm font-bold text-foreground mb-2">How do I pay?</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">Pay to our Globus Bank account before the job. Bank details are shown after your request.</p>
                </div>
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <h3 className="text-sm font-bold text-foreground mb-2">How quickly will someone come?</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">Usually same-day or next day, confirmed within minutes on WhatsApp.</p>
                </div>
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <h3 className="text-sm font-bold text-foreground mb-2">Are workers verified?</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">Yes. All workers register with their NIN for tracking and verification.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Pros at work</h2>
              <div className="grid grid-cols-3 gap-3">
                {PRO_IMAGES.map(({ src, alt }) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <Image src={src} alt={alt} fill className="object-cover grayscale" sizes="120px" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">How it works</h2>
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-background text-[10px] font-bold">1</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Submit Details</p>
                    <p className="text-xs font-medium text-zinc-500 mt-1">Description & location.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-background text-[10px] font-bold">2</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Match & Confirm</p>
                    <p className="text-xs font-medium text-zinc-500 mt-1">Pro confirms visit & price.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-background text-[10px] font-bold">3</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Pay & Fix</p>
                    <p className="text-xs font-medium text-zinc-500 mt-1">Pay to bank, job gets done.</p>
                  </div>
                </li>
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8"
            >
              <p className="text-center text-xs font-bold text-zinc-500">
                <span className="text-3xl font-heading font-extrabold text-foreground">
                  {JOBS_COMPLETED.toLocaleString()}+
                </span>
                <br />
                <span className="text-[10px] uppercase tracking-widest mt-2 block">Jobs completed monthly</span>
              </p>
            </motion.div>
          </aside>
        </div>
      </section>
    </div>
  );
}
