"use client";

import { motion } from "framer-motion";
import { ShieldAlert, CreditCard, Lock, Check } from "lucide-react";

export default function WalletEscrowSection() {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
        
        <div className="lg:w-1/2 w-full">
           <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative w-full max-w-sm mx-auto lg:mx-0 p-8 rounded-3xl bg-gradient-to-tr from-zinc-900 to-green-950/20 border-2 border-brand-primary/20 shadow-[0_0_60px_rgba(34,197,94,0.15)] overflow-hidden"
          >
             {/* decorative gradient */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />

             <div className="flex justify-between items-center mb-8 relative z-10">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">In-App Wallet</span>
                <CreditCard size={20} className="text-zinc-400" />
             </div>

             <div className="mb-8 relative z-10">
               <span className="text-zinc-500 text-sm block mb-1">Total Balance</span>
               <span className="text-4xl font-extrabold text-white tracking-tighter">₦145,000</span>
             </div>

             <div className="space-y-3 relative z-10">
               <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                     <Lock size={14} className="text-green-400" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">Funds in Escrow</p>
                     <p className="text-[10px] text-zinc-500 uppercase">Plumbing Fix</p>
                   </div>
                 </div>
                 <span className="text-sm font-bold text-zinc-300">-₦15,000</span>
               </div>
               
               <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between opacity-50">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                     <Check size={14} className="text-brand-primary" />
                   </div>
                   <div>
                     <p className="text-sm border-b border-transparent font-bold text-white">Cashback Earned</p>
                     <p className="text-[10px] text-zinc-500 uppercase">Direct App Payment</p>
                   </div>
                 </div>
                 <span className="text-sm font-bold text-zinc-300">+₦1,500</span>
               </div>
             </div>
          </motion.div>
        </div>

        <div className="lg:w-1/2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold uppercase tracking-widest text-green-400"
          >
            <ShieldAlert size={14} />
            <span>Escrow Protection</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
          >
            Your money is safe <br />until you're satisfied.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-base leading-relaxed mb-8"
          >
            With our integrated Escrow Wallet system, you can fund your balance and book services without risk. Your payment is held securely and only released to the professional when you explicitly confirm the job is done perfectly.
          </motion.p>
        </div>

      </div>
    </section>
  );
}
