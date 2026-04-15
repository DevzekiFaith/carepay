"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Star, CheckCircle, Award } from "lucide-react";

const features = [
  {
    icon: <CheckCircle size={24} className="text-brand-primary" />,
    title: "30-Day Guarantee",
    description: "Every job comes with a 30-day service guarantee so you can book with peace of mind.",
  },
  {
    icon: <Star size={24} className="text-brand-primary" />,
    title: "Ratings & Reviews",
    description: "Accountability built-in. Rate your provider and read genuine reviews before booking.",
  },
  {
    icon: <ShieldCheck size={24} className="text-brand-primary" />,
    title: "Vetted Providers",
    description: "All professionals undergo rigorous identity verification and skill testing before joining.",
  },
  {
    icon: <Award size={24} className="text-brand-primary" />,
    title: "Elite Badges",
    description: "Easily spot top-performing professionals who consistently provide 5-star service.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 px-6 bg-zinc-950/50 border-y border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 px-2">You can't go <span className="text-rose-500">wrong</span> with HomeCare</h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">We've built a secure ecosystem to ensure every repair is handled with utmost professionalism.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index} 
              className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/30 transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
