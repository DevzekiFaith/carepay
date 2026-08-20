"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Building2, Clock, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  sender_name: string;
  receipt_url: string;
  status: string;
  created_at: string;
}

export default function PaymentTable({ initialPayments }: { initialPayments: Payment[] }) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (payment: Payment) => {
    try {
      setProcessing(payment.id);
      const supabase = createClient();

      // 1. Get User's Wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', payment.user_id)
        .maybeSingle();
      
      if (walletError) throw walletError;
      if (!wallet) throw new Error("This user does not have a wallet initialized yet.");

      // 2. Update Payment Status
      const { error: statusError } = await supabase
        .from('payment_verifications')
        .update({ status: 'approved' })
        .eq('id', payment.id);
      
      if (statusError) throw statusError;

      // 3. Update Wallet Balance
      const { error: balanceError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance + Number(payment.amount) })
        .eq('id', wallet.id);
      
      if (balanceError) throw balanceError;

      // 4. Log Transaction
      await supabase.from('transactions').insert({
        wallet_id: wallet.id,
        amount: payment.amount,
        transaction_type: 'credit',
        description: `Manual Transfer Verified (Ref: ${payment.id.slice(0,8)})`,
        status: 'success'
      });

      toast.success("Payment Approved! Wallet credited.");
      // Optimistic update
      setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: 'approved' } : p));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (paymentId: string) => {
     try {
       setProcessing(paymentId);
       const supabase = createClient();
       const { error } = await supabase.from('payment_verifications').update({ status: 'rejected' }).eq('id', paymentId);
       if (error) throw error;
       
       toast.error("Payment Rejected");
       setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p));
     } catch (err: unknown) {
       toast.error(err instanceof Error ? err.message : "Rejection failed");
     } finally {
       setProcessing(null);
     }
  };

  if (payments.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-300 glass-panel border-2 border-blue-500/30 rounded-2xl bg-slate-950/80 shadow-xl">
        <p className="text-base font-black text-white">No payments to review</p>
        <p className="text-xs mt-1 text-zinc-400">Pending bank transfers and manual receipts will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {payments.map((p) => (
        <motion.div 
          key={p.id} 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-panel p-6 border-2 rounded-2xl transition-all shadow-xl ${
            p.status === 'approved' ? 'border-emerald-500/50 bg-emerald-950/20' : 
            p.status === 'rejected' ? 'border-rose-500/50 bg-rose-950/20' : 
            'border-blue-500/40 bg-slate-950/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Receipt Preview */}
            <div className="relative w-full sm:w-44 aspect-video sm:aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border-2 border-blue-500/30 group shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.receipt_url} alt="Receipt" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={22} className="text-cyan-300" />
              </a>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4 w-full">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="text-xl font-heading font-black text-amber-300">₦{Number(p.amount).toLocaleString()}</p>
                  <p className="text-xs text-white font-bold mt-0.5">{p.sender_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 ${
                  p.status === 'approved' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 
                  p.status === 'rejected' ? 'border-rose-400 bg-rose-500/20 text-rose-300' : 
                  'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                }`}>
                  {p.status}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 font-semibold">
                <div className="flex items-center gap-1.5 text-cyan-300"><Clock size={13} /> {new Date(p.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                <div className="flex items-center gap-1.5 text-white"><Building2 size={13} className="text-blue-400" /> Bank Transfer</div>
              </div>

              {p.status === 'pending' && (
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button 
                    disabled={!!processing}
                    onClick={() => handleApprove(p)}
                    className="bg-blue-600 hover:bg-blue-500 text-white transition-all rounded-xl px-6 h-10 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-blue-500/30 cursor-pointer disabled:opacity-50"
                  >
                    {processing === p.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={15} />} Approve & Credit Wallet
                  </button>
                  <button 
                    disabled={!!processing}
                    onClick={() => handleReject(p.id)}
                    className="bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-400/50 transition-all rounded-xl px-5 h-10 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <X size={15} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
