"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, History, ArrowUpRight, ArrowDownLeft, Loader2, Upload, CheckCircle2, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ErrorAlert from "@/app/components/ErrorAlert";

import { toast } from "sonner";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";

interface Transaction {
  id: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  created_at: string;
  description: string;
}

interface PaymentVerification {
  id: string;
  amount: number;
  sender_name: string;
  status: string;
  created_at: string;
  receipt_url: string;
}

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } } };

export default function CustomerWalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      if (!isSilent) setLoading(true);
      setError(null);

      // 1. Instant session resolution (< 1ms from client cache)
      const { data: sessionData } = await supabase.auth.getSession();
      let user = sessionData.session?.user;

      if (!user) {
        const { data: userData } = await supabase.auth.getUser();
        user = userData.user;
      }

      if (!user) {
        setError("You must be logged in to view your wallet.");
        setLoading(false);
        return;
      }

      // 2. Fetch Wallet
      const walletRes = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      let wallet = walletRes.data;

      // If wallet is missing, initialize it
      if (!wallet && !walletRes.error) {
        const { data: newWallet } = await supabase
          .from('wallets')
          .insert({ user_id: user.id, balance: 0 })
          .select()
          .single();
        wallet = newWallet;
      }

      if (wallet) {
        setBalance(Number(wallet.balance) || 0);
      }

      // 3. Fetch Transactions using the wallet ID
      let txData = [];
      if (wallet) {
        const txRes = await supabase
          .from('transactions')
          .select('*')
          .eq('wallet_id', wallet.id)
          .order('created_at', { ascending: false });
        txData = txRes.data || [];
      }

      setTransactions(txData);

    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load wallet data");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        toast.error("Please login to fund your wallet.");
        setLoading(false);
        return;
      }

      toast.loading("Connecting to Flutterwave Gateway...", { id: "wallet-fund" });

      const res = await fetch("/api/payment/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef: `WLT-${user.id.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
          amount: val,
          email: user.email,
          name: user.user_metadata?.full_name || "HomeCare Customer",
          phone: user.user_metadata?.phone || "08000000000",
          title: "HomeCare Wallet Top-Up",
          description: `Deposit of ₦${val.toLocaleString()} to HomeCare Customer Wallet`,
          type: "wallet_topup",
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || "Failed to launch Flutterwave payment", { id: "wallet-fund" });
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Funding initiation failed";
      setError(`Funding failed: ${msg}`);
      toast.error(`Funding failed: ${msg}`, { id: "wallet-fund" });
      setLoading(false);
    }
  };



  if (loading && !funding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 antialiased overflow-hidden">
      {/* Royal Blue Hero Banner */}
      <section className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-blue-800 text-white pt-12 pb-16 md:pb-20 px-6 rounded-b-[40px] md:rounded-b-[50px] shadow-2xl shadow-blue-900/15 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-300/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-4xl relative z-10">
          <Link
            href="/customer/dashboard"
            className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-sky-200 hover:text-white transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-sky-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-block mb-3">
                Secure Escrow & Payments
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
                Customer <span className="text-cyan-200">Wallet</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-sky-100/90 font-medium max-w-md leading-relaxed">
                Manage your funds, view transactions, and enjoy instant one-tap service checkouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Wallet Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        <ErrorAlert 
          error={error} 
          onClear={() => setError(null)} 
          className="mb-6 sm:mb-8"
        />

        <motion.main variants={containerVariants} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
          {/* Balance Card */}
          <motion.section variants={itemVariants} className="glass-panel p-6 sm:p-8 shadow-premium border-brand-primary/30 relative overflow-hidden text-center sm:text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[50px] -mr-32 -mt-32 pointer-events-none" />
            
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Available Balance</p>
            <p className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight">
              <span className="text-brand-primary mr-1">₦</span>{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            
            <div className="mt-8 space-y-4">
              {!funding ? (
                <button 
                  onClick={() => setFunding(true)} 
                  className="btn-minimal rounded-full px-8 h-12 w-full sm:w-auto text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Instant Fund (via Flutterwave)
                </button>
              ) : (
                <form onSubmit={handleFund} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 w-full sm:max-w-xs">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₦</span>
                    <input 
                      type="number" 
                      required 
                      autoFocus
                      placeholder="Amount" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full rounded-full border border-brand-primary/50 bg-brand-primary/5 pl-8 pr-4 h-12 text-sm text-foreground outline-none focus:ring-1 focus:ring-brand-primary transition-all font-mono"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                       type="submit" 
                       disabled={loading}
                       className="btn-minimal flex-1 sm:flex-none rounded-full px-6 h-12 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={14} /> : "Proceed"}
                    </button>
                    <button 
                       type="button" 
                       onClick={() => setFunding(false)} 
                       className="flex-1 sm:flex-none rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 px-6 h-12 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.section>



          {/* Transactions */}
          <motion.section variants={itemVariants} className="glass-panel p-4 sm:p-6 shadow-premium">
            <div className="mb-4 sm:mb-6 flex items-center gap-2 border-b border-zinc-200 dark:border-white/10 pb-4">
              <History size={14} className="text-brand-primary" />
              <h2 className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400">Transaction History</h2>
            </div>
            
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No transactions yet.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3 px-3 sm:py-4 sm:px-4 glass-panel glass-panel-hover rounded-xl transition-all group overflow-hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex shrink-0 h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 ${tx.transaction_type === 'credit' ? 'text-emerald-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {tx.transaction_type === 'credit' ? <ArrowDownLeft size={12} className="sm:size-[14px]" /> : <ArrowUpRight size={12} className="sm:size-[14px]" />}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-[11px] sm:text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors truncate">{tx.description}</p>
                        <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5 truncate">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-[11px] sm:text-sm font-extrabold font-mono tracking-tighter sm:tracking-tight shrink-0 pl-2 ${tx.transaction_type === 'credit' ? 'text-emerald-500' : 'text-foreground'}`}>
                      {tx.transaction_type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </motion.main>
      </div>
    </div>
  );
}


