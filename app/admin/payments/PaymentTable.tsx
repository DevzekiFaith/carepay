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
    } catch (err: any) {
      toast.error(err.message);
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
     } catch (err: any) {
       toast.error(err.message);
     } finally {
       setProcessing(null);
     }
  };

  if (payments.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 glass-panel">
        <p className="text-sm font-bold">No payments to review</p>
        <p className="text-xs mt-1">Pending bank transfers will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {payments.map(p => (
        <motion.div 
          key={p.id} 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-panel p-6 border transition-all ${
            p.status === 'approved' ? 'border-emerald-500/20 bg-emerald-500/5' : 
            p.status === 'rejected' ? 'border-red-500/20 bg-red-500/5' : 
            'border-white/10 bg-white/5'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Receipt Preview */}
            <div className="relative w-full md:w-40 aspect-video md:aspect-[3/4] rounded-xl overflow-hidden bg-black/40 border border-white/10 group shrink-0">
              <img src={p.receipt_url} alt="Receipt" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <a href={p.receipt_url} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={20} className="text-white" />
              </a>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-heading font-bold text-foreground">₦{Number(p.amount).toLocaleString()}</p>
                  <p className="text-xs text-zinc-500 font-medium">{p.sender_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                  p.status === 'approved' ? 'border-emerald-500/30 text-emerald-500' : 
                  p.status === 'rejected' ? 'border-red-500/30 text-red-500' : 
                  'border-amber-500/30 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                }`}>
                  {p.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1.5"><Clock size={12} /> {new Date(p.created_at).toLocaleDateString()}</div>
                <div className="flex items-center gap-1.5"><Building2 size={12} /> FirstBank Transfer</div>
              </div>

              {p.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button 
                    disabled={!!processing}
                    onClick={() => handleApprove(p)}
                    className="btn-minimal bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all rounded-lg px-6 h-10 text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-2"
                  >
                    {processing === p.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />} Approve
                  </button>
                  <button 
                    disabled={!!processing}
                    onClick={() => handleReject(p.id)}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all px-6 h-10 text-[10px] font-bold uppercase tracking-[0.1em] text-red-400 flex items-center gap-2"
                  >
                    <X size={14} /> Reject
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
