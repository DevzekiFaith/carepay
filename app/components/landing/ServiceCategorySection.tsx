"use client";

import { motion } from "framer-motion";
import { Wrench, Sparkles, Home, Truck, Scissors, Zap, Droplet, Monitor } from "lucide-react";

const categories = [
  { name: "Plumbing", icon: <Droplet size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" /> },
  { name: "Electrical", icon: <Zap size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" /> },
  { name: "AC & Fridge", icon: <Monitor size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" /> },
  { name: "Cleaning", icon: <Sparkles size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" /> },
  { name: "Carpentry", icon: <Home size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" /> },
  { name: "Haulage & Movers", icon: <Truck size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" />, comingSoon: true },
  { name: "Beauty & Makeup", icon: <Scissors size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" /> },
  { name: "Auto Mechanic", icon: <Wrench size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" />, comingSoon: true },
  { name: "Generator Repair", icon: <Zap size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" /> },
  { name: "Fumigation", icon: <Sparkles size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" />, comingSoon: true },
  { name: "Appliance Repair", icon: <Monitor size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" />, comingSoon: true },
  { name: "Painting", icon: <Droplet size={20} className="text-zinc-400 group-hover:text-brand-primary transition-colors" /> },
];

export default function ServiceCategorySection() {
  return (
    <section className="py-24 px-6 bg-zinc-950/50 border-y border-white/5 relative z-10 overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[30%] h-[30%] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Over 20+ Service Categories</h2>
            <p className="text-zinc-400 max-w-xl text-sm md:text-base">We've expanded our platform. From quick home fixes to heavy lifting and personal grooming, find any expert you need.</p>
          </div>
          <button className="h-12 px-6 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest text-white whitespace-nowrap">
            View All Services
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              key={index} 
              className={`relative flex flex-col items-start rounded-2xl border transition-all duration-300 overflow-hidden text-left p-4 sm:p-5 group ${category.comingSoon ? "bg-white/5 border-white/5 opacity-75 grayscale cursor-not-allowed" : "bg-white/5 border-white/10 hover:border-brand-primary/30 hover:bg-white/10 cursor-pointer"}`}
            >
              <div className="flex w-full items-start justify-between mb-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${category.comingSoon ? "bg-white/5 border-white/5" : "bg-white/5 border border-white/5 group-hover:bg-brand-primary/20 group-hover:border-brand-primary/30"}`}>
                  <div className={category.comingSoon ? "" : "group-hover:scale-110 transition-transform"}>
                    {category.icon}
                  </div>
                </div>
                {category.comingSoon && (
                  <span className="text-[8px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-1 rounded-full whitespace-nowrap ml-2 mt-1">
                    Waitlist
                  </span>
                )}
              </div>
              <h3 className={`font-bold text-sm mt-3 ${category.comingSoon ? "text-zinc-500" : "text-foreground group-hover:text-brand-primary transition-colors"}`}>{category.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
