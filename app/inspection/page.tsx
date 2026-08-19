"use client";

import { motion } from "framer-motion";
import { Check, ClipboardCheck, ArrowLeft, Home, User, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ModernDatePicker from "@/app/components/ModernDatePicker";

const PRICING = {
  apartment: 50000,
  duplex: 150000,
  mansion: 300000,
  commercial: 200000,
} as const;

type PropertyType = keyof typeof PRICING | "";

export default function PropertyInspectionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(new Date());
  const [appointmentTime, setAppointmentTime] = useState("10:00");
  const [propertyType, setPropertyType] = useState<PropertyType>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Processing request", {
      description: "Securing your inspection appointment..."
    });
    setTimeout(() => {
      setSubmitted(true);
      toast.success("Inspection Requested!", {
        description: "We will contact you via WhatsApp shortly."
      });
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 antialiased overflow-hidden">
      {/* Royal Blue Hero Banner */}
      <section className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-blue-800 text-white pt-12 pb-16 md:pb-20 px-6 rounded-b-[40px] md:rounded-b-[50px] shadow-2xl shadow-blue-900/15 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-300/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-6xl relative z-10">
          <Link
            href="/customer/dashboard"
            className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-sky-200 hover:text-white transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-block mb-3">
              Elite Engineering Audit
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
              Comprehensive <span className="text-cyan-200">Property Inspection</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-sky-100/90 font-medium max-w-2xl leading-relaxed">
              Don&apos;t sign that lease or transfer payment until verified engineers inspect the plumbing, electrical lines, and structural roofing.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 relative z-10 grid gap-10 lg:gap-12 lg:grid-cols-2 lg:items-start">
        
        {/* Left: Value Prop */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Inspection Coverage</h2>

          <div className="space-y-4">
            {[
              "Complete Electrical Safety & Load Sweep",
              "Plumbing & Hidden Pipe Leak Detection",
              "Structural, Dampness & Roof Integrity Check",
              "Same-day Certified PDF Report Generation"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-sm font-semibold text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 mb-1">
              {propertyType ? "Fixed Pricing" : "Base Pricing"}
            </p>
            <p className="text-4xl font-black text-sky-600 tracking-tight">
              ₦{(propertyType ? PRICING[propertyType] : 50000).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {propertyType 
                ? `Standard pricing for ${propertyType} inspections.`
                : "Select a property type below to see exact pricing."}
            </p>
          </div>
        </motion.div>

        {/* Right: Intake Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="w-full min-w-0">
          <div className="glass-panel p-5 sm:p-10 shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[50px] -mt-32 pointer-events-none" />

            {submitted ? (
              <div className="text-center py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mb-6">
                  <Check size={24} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-heading font-extrabold text-foreground tracking-tight">Request Received</h3>
                <p className="mt-2 text-sm text-zinc-400">An inspector will be assigned shortly. We will contact you via WhatsApp to confirm the schedule.</p>
                <Link href="/customer/dashboard" className="btn-minimal inline-flex w-full justify-center mt-8 rounded-full px-6 h-12 text-xs font-bold uppercase tracking-[0.2em] items-center">
                  Back to Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <h3 className="text-lg font-bold text-foreground mb-6">Book an Inspection</h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-zinc-400 pl-1 block mb-2 leading-relaxed">Property Full Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input required type="text" placeholder="e.g. 15 Admiralty Way, Lekki" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:border-brand-primary/50 focus:bg-brand-primary/5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-zinc-400 pl-1 block mb-2 leading-relaxed">Property Type</label>
                  <div className="relative">
                    <Home size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <select 
                      required 
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-[#121214] pl-11 pr-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:border-brand-primary/50"
                    >
                      <option value="">Select type...</option>
                      <option value="apartment">Apartment / Flat (Single Level)</option>
                      <option value="duplex">Standard Duplex (2+ Floors)</option>
                      <option value="mansion">Luxury Mansion (Large Detached)</option>
                      <option value="commercial">Commercial / Office Space</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-8">
                  <ModernDatePicker 
                    selectedDate={appointmentDate} 
                    onSelect={(date) => setAppointmentDate(date)} 
                    selectedTime={appointmentTime}
                    onTimeSelect={(time) => setAppointmentTime(time)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-zinc-400 pl-1 block mb-2 leading-relaxed">Landlord / Agent Details (Optional)</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" placeholder="Name & Phone Number" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:border-brand-primary/50 focus:bg-brand-primary/5" />
                  </div>
                </div>

                <button type="submit" className="btn-minimal mt-8 w-full rounded-full px-4 sm:px-6 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.2em] flex items-center justify-center gap-2 shadow-premium hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                  <ClipboardCheck size={16} className="shrink-0" /> <span className="truncate">Secure Your Inspection</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
