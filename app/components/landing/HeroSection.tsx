"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
  };

  return (
    <section className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-blue-800 text-white pt-16 pb-32 lg:pb-36 px-6 overflow-hidden rounded-b-[40px] md:rounded-b-[60px] shadow-2xl shadow-blue-900/20">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-300/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Column: Headlines & CTA */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          <motion.div 
            variants={itemVariants} 
            className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold uppercase tracking-widest text-sky-200"
          >
            <ShieldCheck size={15} className="text-cyan-300" />
            <span>Verified Local Professionals</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 uppercase"
          >
            Fast & Reliable <br />
            <span className="text-cyan-200">Home Care</span> Repairs
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="text-base sm:text-lg text-sky-100/90 font-medium max-w-xl leading-relaxed mb-8"
          >
            Direct connection to verified plumbers, electricians, carpenters, and repair specialists. Rapid dispatch, transparent pricing, and quality guaranteed before payment is released.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Link
              href="/request"
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-sky-400 hover:bg-sky-300 text-blue-950 flex items-center justify-center gap-3 text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg shadow-sky-400/30 hover:scale-105 transition-all"
            >
              Request a Service <ArrowRight size={18} />
            </Link>
            <Link
              href="/store"
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors backdrop-blur-sm"
            >
              Browse Parts Store
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-6 text-xs font-semibold text-sky-100/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-300" />
              <span>100% Vetted Artisans</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cyan-300" />
              <span>15 Min Avg Arrival</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-300" />
              <span>Escrow Protected</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Visual with Technician */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center"
        >
          <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-blue-900/40">
            <Image
              src="/hero-tech.jpg"
              alt="HomeCare Professional Technician"
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 450px"
            />
            
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent" />

            {/* Floating pro status pill */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-sky-100">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <CheckCircle2 size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Verified Professional on Duty</p>
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Ready for instant dispatch</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
