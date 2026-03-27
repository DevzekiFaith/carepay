"use client";

import { motion } from "framer-motion";
import { Check, ClipboardCheck, ArrowLeft, Home, User, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function PropertyInspectionPage() {
  const [submitted, setSubmitted] = useState(false);

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
    <div className="relative min-h-screen bg-background text-foreground antialiased overflow-hidden">
      {/* Ambience */}
      <div className="absolute inset-x-0 -top-[20%] -z-10 h-[60%] w-full rounded-full bg-brand-primary/10 blur-[120px] mix-blend-screen pointer-events-none" />

      <main className="mx-auto max-w-6xl px-4 py-12 lg:py-24 relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        
        {/* Left: Copy & Value Prop */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/customer/dashboard" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-primary transition-colors w-fit mb-8">
            <ArrowLeft size={12} /> Dashboard
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)]">
            <ClipboardCheck size={12} />
            <span>CarePay Elite Service</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-white leading-tight">
            Comprehensive <br/>
            <span className="text-gradient-primary">Property Inspection</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-medium max-w-lg">
            Don't sign that lease or transfer payment until our verified engineers inspect the plumbing, electrical lines, and roofing. Save millions in hidden repair costs.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Complete Electrical Safety Sweep",
              "Plumbing & Hidden Leak Detection",
              "Structural & Roof Integrity Check",
              "Same-day PDF Report Generation"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm font-medium text-zinc-300">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Flat Rate Pricing</p>
            <p className="text-4xl font-heading font-extrabold text-white tracking-tight">₦50,000</p>
            <p className="text-xs text-zinc-400 mt-1">For standard 2-3 bedroom apartments. Mansions/Duplexes may vary.</p>
          </div>
        </motion.div>

        {/* Right: Intake Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-panel p-6 sm:p-10 shadow-premium relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[50px] -mr-32 -mt-32 pointer-events-none" />

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
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <h3 className="text-lg font-bold text-foreground mb-6">Book an Inspection</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Property Full Address</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input required type="text" placeholder="e.g. 15 Admiralty Way, Lekki" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:border-brand-primary/50 focus:bg-brand-primary/5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Property Type</label>
                    <div className="relative">
                      <Home size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <select required className="w-full appearance-none rounded-2xl border border-white/10 bg-[#121214] pl-11 pr-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:border-brand-primary/50">
                        <option value="">Select type...</option>
                        <option value="apartment">Apartment / Flat</option>
                        <option value="duplex">Duplex</option>
                        <option value="bungalow">Bungalow</option>
                        <option value="commercial">Commercial / Office</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Target Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input required type="date" className="w-full rounded-2xl border border-white/10 bg-[#121214] pl-11 pr-4 py-3.5 text-sm font-medium text-zinc-400 outline-none transition-all focus:border-brand-primary/50" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Landlord / Agent Details (Optional)</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" placeholder="Name & Phone Number" className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm font-medium text-foreground outline-none transition-all focus:border-brand-primary/50 focus:bg-brand-primary/5" />
                  </div>
                </div>

                <button type="submit" className="btn-minimal mt-8 w-full rounded-full px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <ClipboardCheck size={16} /> Secure Your Inspection
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
