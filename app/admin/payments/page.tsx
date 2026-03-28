"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Check, X, Building2, Clock, ShieldCheck, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/app/components/Logo";

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  sender_name: string;
  receipt_url: string;
  status: string;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('payment_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

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
      fetchPayments();
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
       await supabase.from('payment_verifications').update({ status: 'rejected' }).eq('id', paymentId);
       toast.error("Payment Rejected");
       fetchPayments();
     } catch (err: any) {
       toast.error(err.message);
     } finally {
       setProcessing(null);
     }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Logo size="md" />
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={16} className="text-brand-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">Admin Control</p>
               </div>
               <h1 className="text-3xl font-heading font-extrabold text-gradient-primary">Payment Verifications</h1>
            </div>
          </div>
          <p className="text-xs text-zinc-500 font-medium">Reviewing {payments.filter(p => p.status === 'pending').length} pending transfers</p>
        </header>

        {loading ? (
           <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-primary" /></div>
        ) : (
          <div className="grid gap-4">
            {payments.map(p => (
               <motion.div 
                 key={p.id} 
                 initial={{ opacity: 0, scale: 0.98 }} 
                 animate={{ opacity: 1, scale: 1 }}
                 className={`glass-panel p-6 border ${p.status === 'approved' ? 'border-emerald-500/20 bg-emerald-500/5' : p.status === 'rejected' ? 'border-red-500/20 bg-red-500/5' : 'border-white/10 bg-white/5'}`}
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
                             'border-amber-500/30 text-amber-500'
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
            {payments.length === 0 && (
               <div className="py-20 text-center text-zinc-500 glass-panel">
                  <p className="text-sm font-bold">No payments to review</p>
                  <p className="text-xs mt-1">Pending bank transfers will appear here.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
