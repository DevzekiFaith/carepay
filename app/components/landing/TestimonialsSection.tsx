"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Temiloluwa",
    role: "Homeowner",
    text: "I love this app! Got a professional plumber to fix an age-long issue with my water system. Smooth!! I totally recommend.",
  },
  {
    name: "Tony",
    role: "Resident",
    text: "HomeCare has been a life saver. I was able to get a plumber when my house flooded. Thank God we were able to stop the leak on time using the platform.",
  },
  {
    name: "Temilade",
    role: "New Homeowner",
    text: "Found a great painter to touch up my new house before the housewarming party. Great APP. No stress!",
  },
  {
    name: "Biola",
    role: "Business Owner",
    text: "HomeCare has really helped me be more organized when it comes to dealing with domestic needs. I totally recommend.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-zinc-950/50 border-y border-white/5 relative z-10 overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What people say about us</h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">Real experiences from our growing community of users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index} 
              className="p-8 rounded-3xl bg-white/5 border border-white/10 relative group"
            >
              <Quote className="absolute top-6 right-8 text-white/5 w-16 h-16 transition-all group-hover:text-white/10 group-hover:scale-110" />
              
              <div className="flex gap-1 mb-6 text-brand-primary">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-8 relative z-10">"{t.text}"</p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lg border border-white/10">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
