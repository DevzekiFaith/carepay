"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  ShieldCheck, 
  Loader2, 
  MapPin, 
  Fingerprint,
  Building,
  Lock
} from "lucide-react";

export interface NinDetails {
  fullName: string;
  dob: string;
  gender: string;
  stateOfOrigin?: string;
  lga?: string;
  maskedNin?: string;
  verificationRef?: string;
  verifiedAt?: string;
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
      <motion.div 
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 rounded-2xl border border-sky-200 bg-sky-50/90 flex items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-sky-600 shrink-0" size={20} />
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-sky-900">
              Querying NIMC National Registry...
            </p>
            <p className="text-[11px] text-sky-700 font-medium mt-0.5">
              Live biometric & identity cross-referencing in progress
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-sky-200/70 text-sky-800 px-2.5 py-1 rounded-full border border-sky-300">
          NIMC-256
        </span>
      </motion.div>
    );
  }

  if (status === 'error' || status === 'rejected') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 p-4 rounded-2xl border border-rose-200 bg-rose-50/90 flex gap-3.5 items-start shadow-xs"
      >
        <div className="shrink-0 p-1.5 rounded-full bg-rose-100 text-rose-600 mt-0.5">
          <XCircle size={18} />
        </div>
        <div>
          <p className="text-xs font-black text-rose-900 uppercase tracking-wider mb-0.5">
            NIN Verification Unsuccessful
          </p>
          <p className="text-xs text-rose-700 font-medium leading-relaxed">
            {reason || "Could not authenticate this National Identity Number. Please confirm the 11 digits and retry."}
          </p>
        </div>
      </motion.div>
    );
  }

  if (status === 'verified' && details) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="mt-4 overflow-hidden rounded-2xl border-2 border-emerald-500 bg-white shadow-md shadow-emerald-500/10"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-200 animate-pulse" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                NIMC Identity Authenticated
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping inline-block" />
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-800/80 text-emerald-100 px-2.5 py-1 rounded-full border border-emerald-400/40">
            Official Govt Record
          </span>
        </div>
        
        {/* Body Content */}
        <div className="p-5 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="shrink-0 h-14 w-14 rounded-2xl border-2 border-emerald-200 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-800 font-black text-2xl shadow-xs">
              <Fingerprint size={28} className="text-emerald-700" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Legal Name
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {details.maskedNin}
                </span>
              </div>
              <p className="text-base font-black text-slate-900 truncate mt-1">
                {details.fullName}
              </p>
            </div>
          </div>

          {/* Details Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Calendar size={14} className="text-sky-600 shrink-0" />
              <div className="truncate">
                <p className="text-[9px] uppercase font-bold text-slate-400">DOB</p>
                <p className="font-bold text-slate-800 text-[11px] truncate">{details.dob}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <User size={14} className="text-sky-600 shrink-0" />
              <div className="truncate">
                <p className="text-[9px] uppercase font-bold text-slate-400">Gender</p>
                <p className="font-bold text-slate-800 text-[11px] truncate">{details.gender}</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 col-span-2 sm:col-span-1">
              <MapPin size={14} className="text-emerald-600 shrink-0" />
              <div className="truncate">
                <p className="text-[9px] uppercase font-bold text-slate-400">Origin / LGA</p>
                <p className="font-bold text-slate-800 text-[11px] truncate">
                  {details.stateOfOrigin ? `${details.stateOfOrigin}, ${details.lga || ''}` : "Nigeria"}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Audit Footer */}
          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1 font-bold text-emerald-800">
              <Lock size={11} className="text-emerald-600" />
              Ref: {details.verificationRef || "NIMC-VERIFIED"}
            </span>
            <span className="font-medium text-slate-600">
              Verified: {details.verifiedAt || "Today"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
