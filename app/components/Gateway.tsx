"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Star, Shield } from "lucide-react";
import Image from "next/image";
import Logo from "./Logo";

export default function Gateway() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-xl w-full text-center relative z-10"
      >
        {/* Branding / Logo */}
        <motion.div variants={itemVariants} className="mb-12 flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.4em] text-zinc-500">
            Book it. Fix it. Done.
          </p>
        </motion.div>

        {/* Value Prop */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight">
            Nigeria's first <span className="text-brand-primary">visual-first</span> repair platform.
          </h2>
          <p className="text-sm font-medium text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Connect with vetted professionals instantly. Snap a photo, get a match, and fix your home in minutes.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <Link 
            href="/auth/customer/register" 
            className="btn-minimal h-14 rounded-full flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)] transition-all"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <Link 
            href="/auth/customer/login" 
            className="h-14 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-300 transition-colors"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="my-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Enterprise Access</span>
          <div className="h-px flex-1 bg-white/10" />
        </motion.div>

        {/* Worker Path */}
        <motion.div variants={itemVariants}>
          <Link 
            href="/auth/worker/login" 
            className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
          >
            Are you a Professional? <span className="text-brand-primary text-[10px] border border-brand-primary/30 px-2 py-0.5 rounded-full">Apply here</span>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-white/5 grid grid-cols-3 gap-8 opacity-40">
           <div className="flex flex-col items-center gap-2">
             <Shield size={16} />
             <span className="text-[8px] font-bold uppercase tracking-widest">NIN Verified</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <Zap size={16} />
             <span className="text-[8px] font-bold uppercase tracking-widest">Flash Match</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <Star size={16} />
             <span className="text-[8px] font-bold uppercase tracking-widest">Elite Pros</span>
           </div>
        </motion.div>
      </motion.div>

      {/* Floating decorative elements */}
       <div className="fixed bottom-0 left-0 w-full p-4 text-[10px] font-bold text-zinc-700 uppercase tracking-widest text-center pointer-events-none">
          © 2026 HomeCare Technologies • Enugu, Nigeria
       </div>
    </div>
  );
}
