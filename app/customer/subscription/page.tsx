"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check, Shield, Star, Zap } from "lucide-react";

export default function SubscriptionPage() {
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } } };

  return (
    <div className="relative min-h-screen bg-background px-4 py-8 text-foreground antialiased overflow-hidden">
      {/* Ambience */}
      <div className="absolute inset-x-0 -top-[10%] -z-10 h-[40%] w-full rounded-full bg-brand-primary/10 opacity-60 blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <header className="mb-8 flex flex-col items-center text-center gap-4 pb-6">
          <Link href="/customer/dashboard" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-primary transition-colors absolute left-0 top-0">
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <div className="mt-8">
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-gradient-primary">
              Choose your CarePay Tier
            </h1>
            <p className="mt-2 text-sm text-zinc-400 font-medium max-w-md mx-auto">
              Upgrade your account to unlock zero surge fees, priority matching, and dedicated facility managers.
            </p>
          </div>
        </header>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mt-12">
          
          {/* Base Tier */}
          <motion.div variants={itemVariants} className="glass-panel p-8 shadow-premium flex flex-col relative">
            <h3 className="text-lg font-bold text-foreground">Pay-As-You-Go</h3>
            <p className="text-sm text-zinc-400 mt-1">For occasional fixes</p>
            <div className="my-6">
              <span className="text-4xl font-heading font-extrabold text-foreground tracking-tight">Free</span>
              <span className="text-zinc-500 text-xs">/ forever</span>
            </div>
            <ul className="space-y-4 flex-1 mb-8">
              {[
                "Standard matching speed",
                "Standard pricing applies",
                "Surge fees up to 2.5x during peak times",
                "Pay 15% platform convenience fee",
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-400 items-start">
                  <Check size={16} className="text-zinc-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full rounded-full border border-white/10 bg-white/5 px-6 h-12 text-xs font-bold uppercase tracking-widest text-zinc-400 cursor-not-allowed">
              Current Plan
            </button>
          </motion.div>

          {/* Pro Tier (Popular) */}
          <motion.div variants={itemVariants} className="glass-panel p-8 shadow-[0_0_30px_rgba(249,115,22,0.15)] border-brand-primary/50 relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 right-0 w-full h-full bg-brand-primary/5 blur-xl pointer-events-none" />
            <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
              <span className="bg-brand-primary text-background text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-premium">
                Most Popular
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-brand-primary relative z-10">CarePay Pro</h3>
            <p className="text-sm text-zinc-300 mt-1 relative z-10">For busy professionals</p>
            <div className="my-6 relative z-10">
              <span className="text-4xl font-heading font-extrabold text-foreground tracking-tight">₦35k</span>
              <span className="text-zinc-400 text-xs">/ month</span>
            </div>
            <ul className="space-y-4 flex-1 mb-8 relative z-10">
              {[
                { text: "Zero platform convenience fees", icon: Shield },
                { text: "2 Free Routine Call-Outs /mo", icon: Star },
                { text: "Priority matching (3x faster)", icon: Zap },
                { text: "Surge pricing capped at 1.5x", icon: Zap },
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-200 items-start">
                  <feature.icon size={16} className="text-brand-primary shrink-0 mt-0.5" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            <button className="btn-minimal relative z-10 w-full rounded-full px-6 h-12 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center">
              Upgrade to Pro
            </button>
          </motion.div>

          {/* Elite Tier */}
          <motion.div variants={itemVariants} className="glass-panel p-8 shadow-premium border-white/10 relative flex flex-col">
            <h3 className="text-lg font-bold text-foreground">CarePay Elite</h3>
            <p className="text-sm text-zinc-400 mt-1">Facility management level</p>
            <div className="my-6">
              <span className="text-4xl font-heading font-extrabold text-foreground tracking-tight">₦150k</span>
              <span className="text-zinc-500 text-xs">/ month</span>
            </div>
            <ul className="space-y-4 flex-1 mb-8">
              {[
                { text: "Zero surge pricing ever", icon: Shield },
                { text: "Dedicated 24/7 Account Manager", icon: Shield },
                { text: "Matched with top 5% Artisans only", icon: Star },
                { text: "4 Free routine sweeps /mo", icon: Shield },
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-400 items-start">
                  <feature.icon size={16} className="text-zinc-200 shrink-0 mt-0.5" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            <button className="w-full rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-6 h-12 text-xs font-bold uppercase tracking-widest text-zinc-200 transition-colors">
              Upgrade to Elite
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
