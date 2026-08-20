"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, User, Calendar, ShieldCheck, Loader2 } from "lucide-react";

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
      <div className="mt-4 p-5 rounded-2xl border border-sky-200 bg-sky-50 flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-sky-600" size={20} />
        <p className="text-xs font-black uppercase tracking-wider text-sky-800">Verifying with NIMC Database...</p>
      </div>
    );
  }

  if (status === 'error' || status === 'rejected') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 p-4 rounded-2xl border border-rose-200 bg-rose-50 flex gap-3.5 items-start"
      >
        <div className="shrink-0 p-1.5 rounded-full bg-rose-100 text-rose-600 mt-0.5">
          <XCircle size={18} />
        </div>
        <div>
          <p className="text-xs font-black text-rose-800 uppercase tracking-wider mb-0.5">NIN Verification Failed</p>
          <p className="text-xs text-rose-700 font-medium leading-relaxed">{reason || "Could not verify this NIN. Please check the 11 digits and try again."}</p>
        </div>
      </motion.div>
    );
  }

  if (status === 'verified' && details) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 overflow-hidden rounded-2xl border border-emerald-300 bg-white shadow-xs"
      >
        <div className="bg-emerald-50 px-4 py-2.5 flex items-center justify-between border-b border-emerald-200">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
            <CheckCircle2 size={15} className="text-emerald-600" /> Identity Confirmed
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">NIMC Verified</span>
        </div>
        
        <div className="p-4 flex gap-4 items-center">
          <div className="shrink-0 h-14 w-14 rounded-xl border border-emerald-200 flex items-center justify-center bg-emerald-50 text-emerald-700 font-black text-xl shadow-2xs">
            {details.fullName ? details.fullName.charAt(0) : "W"}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Authenticated Name</p>
            <p className="text-base font-black text-slate-900 truncate">{details.fullName}</p>
            
            <div className="mt-2 flex gap-4 flex-wrap">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <Calendar size={13} className="text-sky-600" /> {details.dob}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                <User size={13} className="text-sky-600" /> {details.gender}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

