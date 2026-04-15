"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import Logo from "../Logo";

export default function HeroSection() {
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
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-3xl w-full text-center relative z-10 flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <Zap size={14} className="text-brand-primary" />
          <span>Flash Match Technology</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-[1.15] tracking-tight">
          Find Vetted Home Service Pros in <span className="text-brand-primary">Minutes.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg font-medium text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 lg:px-0 px-2">
          Connecting you to skilled workers, service providers, and artisans instantly. 
          Snap a photo, get a match, and fix your home with absolute confidence.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href="/auth/customer/register" 
            className="w-full sm:w-auto h-14 px-8 rounded-full bg-brand-primary text-foreground flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)] transition-all hover:scale-105"
          >
            Get Started <ArrowRight size={18} />
          </Link>
          <Link 
            href="/auth/worker/login" 
            className="w-full sm:w-auto h-14 px-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-300 transition-colors"
          >
            Provide Help
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16 text-zinc-500 text-[11px] font-bold uppercase tracking-widest flex items-center gap-4">
          <div className="flex -space-x-3">
             {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-xs">
                  {['T','A','O','K'][i-1]}
                </div>
             ))}
          </div>
          <p>Join 10,000+ satisfied users</p>
        </motion.div>

      </motion.div>
    </section>
  );
}
