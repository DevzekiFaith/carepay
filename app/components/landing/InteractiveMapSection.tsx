"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Clock } from "lucide-react";
import dynamic from 'next/dynamic';

const RealTimeMap = dynamic(() => import('./RealTimeMap'), {
  ssr: false,
  loading: () => <div className="w-full aspect-square md:aspect-video lg:aspect-square bg-zinc-900 rounded-3xl animate-pulse flex items-center justify-center border border-white/10 shadow-2xl"><span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Loading Map Engine...</span></div>
});

export default function InteractiveMapSection() {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        <div className="lg:w-1/2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400"
          >
            <MapPin size={14} />
            <span>Hyper-Local Matching</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
          >
            Real-Time Tracking <br />& Live Provider Map
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base leading-relaxed mb-8"
          >
            Don&apos;t guess when help will arrive. Our interactive map connects you to the closest verified professionals. Watch them arrive in real-time right from your screen.
          </motion.p>

          <motion.ul 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Navigation size={16} />
              </div>
              <span>Visual location-based GPS radius filtering</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <span>Moving radar pins showing live artisan transit ETA</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <span>Real-time dispatch status: Know exactly who is arriving</span>
            </li>
          </motion.ul>
        </div>

        <div className="lg:w-1/2 w-full relative">
           <RealTimeMap />
        </div>

      </div>
    </section>
  );
}
