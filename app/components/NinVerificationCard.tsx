"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, User, Calendar, ShieldCheck } from "lucide-react";

export interface NinDetails {
  fullName: string;
  dob: string;
  gender: string;
  photo?: string;
}

interface NinVerificationCardProps {
  status: 'verified' | 'rejected' | 'error' | 'idle' | 'verifying';
  details?: NinDetails;
  reason?: string;
}

export default function NinVerificationCard({ status, details, reason }: NinVerificationCardProps) {
  if (status === 'idle') return null;

  if (status === 'verifying') {
    return (
      <div className="mt-4 p-6 rounded-2xl border border-white/10 bg-white/5 animate-pulse flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Connecting to National Database...</p>
      </div>
    );
  }

  if (status === 'error' || status === 'rejected') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex gap-4 items-start"
      >
        <div className="shrink-0 p-2 rounded-full bg-red-500/10 text-red-500">
          <XCircle size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Verification Failed</p>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">{reason || "Could not verify this NIN. Please double-check the digits."}</p>
        </div>
      </motion.div>
    );
  }

  if (status === 'verified' && details) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
      >
        <div className="bg-emerald-500/10 px-4 py-2 flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-emerald-500">
            <CheckCircle2 size={12} /> Identity Confirmed
          </div>
          <ShieldCheck size={14} className="text-emerald-500/50" />
        </div>
        
        <div className="p-5 flex gap-5 items-center">
          {details.photo ? (
            <div className="shrink-0 h-16 w-16 rounded-xl border border-emerald-500/20 overflow-hidden bg-white/5">
              <img src={details.photo} alt="Identity" className="h-full w-full object-cover" />
            </div>
          ) : (
             <div className="shrink-0 h-16 w-16 rounded-xl border border-emerald-500/20 flex items-center justify-center bg-white/5 text-emerald-500/50">
               <User size={32} />
             </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Authenticated Name</p>
            <p className="text-lg font-heading font-black tracking-tight text-foreground truncate">{details.fullName}</p>
            
            <div className="mt-3 flex gap-4">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                <Calendar size={12} /> {details.dob}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                <User size={12} className="opacity-70" /> {details.gender}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
