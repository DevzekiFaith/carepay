"use client";

import { useState } from "react";
import Hero from "./Hero";
import ServiceGrid from "./ServiceGrid";
import QuickRequestForm from "./QuickRequestForm";
import TrustSection from "./TrustSection";
import FAQ from "./FAQ";

const PRO_IMAGES = [
  { src: "/su1.jpg", alt: "Electrician at work" },
  { src: "/su2.jpg", alt: "Handyman with tools" },
  { src: "/su3.jpg", alt: "Technician repairing" },
];

const SERVICES = [
  { label: "Plumber", emoji: "🔧", price: "₦5k - ₦20k", time: "2-4 hrs" },
  { label: "Electrician", emoji: "💡", price: "₦8k - ₦25k", time: "2-5 hrs" },
  { label: "Carpenter", emoji: "🪚", price: "₦10k - ₦40k", time: "3-6 hrs" },
  { label: "Furniture Maker", emoji: "🪑", price: "₦15k - ₦60k", time: "4-8 hrs" },
  { label: "AC & Fridge Repair", emoji: "❄️", price: "₦7k - ₦30k", time: "2-4 hrs" },
  { label: "Painter", emoji: "🎨", price: "₦12k - ₦50k", time: "4-8 hrs" },
  { label: "General Handyman", emoji: "🔨", price: "₦5k - ₦25k", time: "2-5 hrs" },
];

const TESTIMONIALS = [
  {
    name: "Chioma O.",
    area: "Ikeja",
    text: "Fixed my sink in 2 hours. The plumber was professional and clean. Highly recommend!",
    rating: 5,
  },
  {
    name: "Tunde M.",
    area: "Lekki",
    text: "Best electrician I've used. Fair pricing and did quality work. Will book again.",
    rating: 5,
  },
  {
    name: "Amina K.",
    area: "Yaba",
    text: "Quick response, great service. The carpenter fixed my wardrobe perfectly.",
    rating: 5,
  },
];

const JOBS_COMPLETED = 85;

export default function HomeClient() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen vibe-bg text-stone-900 antialiased selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">

        <Hero />

        {/* Main layout grid */}
        <main className="grid flex-1 gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] mt-8">

          {/* Left Column: Interactive Booking */}
          <div className="space-y-12">

            {/* Service Selection Section */}
            <section className="animate-slide-up delay-1">
              <ServiceGrid
                services={SERVICES}
                selectedService={selectedService}
                onSelectService={setSelectedService}
              />
            </section>

            {/* Form Section */}
            <section className="card-vibe animate-slide-up delay-2 overflow-hidden border border-stone-100 shadow-xl shadow-stone-200/50">
              <div className="bg-gradient-to-r from-emerald-600/5 to-emerald-500/5 px-6 py-8 sm:px-10">
                <QuickRequestForm
                  services={SERVICES}
                  selectedService={selectedService}
                  onServiceChange={setSelectedService}
                />
              </div>
            </section>

            {/* Refer Section (Mobile Optimization) */}
            <div className="lg:hidden animate-slide-up delay-3">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-6 text-white shadow-xl">
                <h3 className="text-xl font-black">Refer & Get ₦500</h3>
                <p className="mt-2 text-sm text-white/90 font-medium leading-relaxed">
                  Share CarePay with your community and both you and your friend get ₦500 credit on your next booking.
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
                  className="mt-6 w-full rounded-2xl bg-white px-6 py-3 text-sm font-black text-emerald-700 shadow-lg active:scale-95 transition-transform"
                >
                  Share Now
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Social Proof & Trust (Sticky on Desktop) */}
          <section className="hidden lg:block">
            <TrustSection
              testimonials={TESTIMONIALS}
              jobsCompleted={JOBS_COMPLETED}
              proImages={PRO_IMAGES}
            />
          </section>

        </main>

        <FAQ />

        {/* Referral Section (Desktop version at bottom or can be separate) */}
        <section className="mt-12 lg:hidden">
          {/* Trust elements on mobile below the main content */}
          <div className="space-y-8 mt-16 pt-12 border-t border-stone-100">
            <h2 className="text-xl font-bold uppercase tracking-tight text-stone-900 px-2">Trust & Community</h2>
            <div className="grid gap-6">
              <TrustSection
                testimonials={TESTIMONIALS.slice(0, 2)}
                jobsCompleted={JOBS_COMPLETED}
                proImages={PRO_IMAGES}
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
