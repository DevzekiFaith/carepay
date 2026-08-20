"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Building2, Clock, ExternalLink, Loader2, Search, RotateCcw, ShieldCheck, AlertCircle } from "lucide-react";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesSender = (p.sender_name || "").toLowerCase().includes(q);
        const matchesAmount = (p.amount || "").toString().includes(q);
        const matchesId = p.id.toLowerCase().includes(q);
        if (!matchesSender && !matchesAmount && !matchesId) return false;
      }
      return true;
    });
  }, [payments, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: payments.length,
      pending: payments.filter((p) => p.status === "pending").length,
      approved: payments.filter((p) => p.status === "approved").length,
      rejected: payments.filter((p) => p.status === "rejected").length,
    };
  }, [payments]);

  const resetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Quick KPI Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "all", label: "All Transfers", count: stats.total, color: "text-slate-900", bg: "bg-slate-100" },
          { id: "pending", label: "Pending Review", count: stats.pending, color: "text-amber-700", bg: "bg-amber-100" },
          { id: "approved", label: "Approved & Credited", count: stats.approved, color: "text-emerald-700", bg: "bg-emerald-100" },
          { id: "rejected", label: "Rejected", count: stats.rejected, color: "text-rose-700", bg: "bg-rose-100" },
        ].map((tab) => {
          const active = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex items-center justify-between ${
                active
                  ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-500/20"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{tab.label}</p>
                <p className={`text-2xl font-black mt-1 ${tab.color}`}>{tab.count}</p>
              </div>
              <div className={`h-8 w-8 rounded-xl ${tab.bg} flex items-center justify-center font-bold text-xs ${tab.color}`}>
                {tab.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-600 font-bold" />
          <input
            type="text"
            placeholder="Search sender name, amount, verification ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="flex-1 sm:flex-none min-w-[160px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 transition-colors cursor-pointer shadow-xs"
            >
              <option value="all">All Statuses ({payments.length})</option>
              <option value="pending">Pending Review ({stats.pending})</option>
              <option value="approved">Approved ({stats.approved})</option>
              <option value="rejected">Rejected ({stats.rejected})</option>
            </select>
          </div>

          {(statusFilter !== "all" || searchQuery !== "") && (
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
            <AlertCircle size={24} />
          </div>
          <p className="text-base font-black text-slate-900">No payment records found</p>
          <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
          <button
            onClick={resetFilters}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md hover:bg-sky-500 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filtered.map((p) => (
              <motion.div 
                key={p.id} 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`p-6 border rounded-2xl transition-all shadow-sm ${
                  p.status === 'approved' ? 'border-emerald-200 bg-white' : 
                  p.status === 'rejected' ? 'border-rose-200 bg-white' : 
                  'border-slate-200 bg-white hover:border-sky-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Receipt Preview */}
                  <div className="relative w-full sm:w-44 aspect-video sm:aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group shrink-0 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.receipt_url} alt="Receipt" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={22} className="text-white" />
                    </a>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <p className="text-2xl font-heading font-black text-slate-900">₦{Number(p.amount).toLocaleString()}</p>
                        <p className="text-xs text-slate-700 font-bold mt-0.5">{p.sender_name}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        p.status === 'approved' ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 
                        p.status === 'rejected' ? 'border border-rose-200 bg-rose-50 text-rose-800' : 
                        'border border-amber-200 bg-amber-50 text-amber-800'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          p.status === 'approved' ? 'bg-emerald-500' : 
                          p.status === 'rejected' ? 'bg-rose-500' : 
                          'bg-amber-500'
                        }`} />
                        {p.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-700"><Clock size={14} className="text-sky-600" /> {new Date(p.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold"><Building2 size={14} className="text-sky-600" /> Direct Bank Transfer</div>
                    </div>

                    {p.status === 'pending' && (
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        <button 
                          disabled={!!processing}
                          onClick={() => handleApprove(p)}
                          className="bg-sky-600 hover:bg-sky-500 text-white transition-all rounded-xl px-6 h-10 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {processing === p.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={15} />} Approve & Credit Wallet
                        </button>
                        <button 
                          disabled={!!processing}
                          onClick={() => handleReject(p.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all rounded-xl px-5 h-10 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <X size={15} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}


