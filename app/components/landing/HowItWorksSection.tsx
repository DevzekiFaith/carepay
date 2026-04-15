"use client";

import { motion } from "framer-motion";
import { Search, UserCheck, Wrench, FileText, Send, DollarSign } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">A simple, transparent process whether you need a fix or want to provide one.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          {/* For Users */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 blur-xl pointer-events-none">
              <div className="w-32 h-32 bg-brand-primary rounded-full"></div>
            </div>
            
            <h3 className="text-2xl font-bold mb-6 sm:mb-8 text-white uppercase tracking-wider text-[10px] sm:text-xs flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-primary"></span> For Users
            </h3>
            
            <div className="space-y-6 sm:space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-brand-primary font-bold text-sm">1</div>
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1 flex items-center gap-2"><Search size={16} /> Search for Service</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">Search for any domestic service, and we'll instantly find registered providers closest to your location.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-brand-primary font-bold text-sm">2</div>
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1 flex items-center gap-2"><UserCheck size={16} /> Pick a Provider</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">Select from the listed professionals. Once accepted, contact them directly to discuss the specifics.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-brand-primary text-black flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1 flex items-center gap-2"><Wrench size={16} /> Job Done</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">Your assigned provider arrives, completes your job safely, and you only release funds when satisfied.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* For Providers */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 blur-xl pointer-events-none">
              <div className="w-32 h-32 bg-blue-500 rounded-full"></div>
            </div>

            <h3 className="text-2xl font-bold mb-8 text-white uppercase tracking-wider text-sm flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> For Providers
            </h3>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-blue-400 font-bold">1</div>
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1 flex items-center gap-2"><FileText size={16} /> Register</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">Register as a professional and submit your ID and certification documents for our swift verifying.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-blue-400 font-bold">2</div>
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1 flex items-center gap-2"><Send size={16} /> Get Listed</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">Get listed based on your location and expertise, allowing users around you to discover and request your service.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-base font-bold text-foreground mb-1 flex items-center gap-2"><DollarSign size={16} /> Get Paid</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">Accept job requests, complete the work to excellent standards, and get paid directly to your app wallet.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
