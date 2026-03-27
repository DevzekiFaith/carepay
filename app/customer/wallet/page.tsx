"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, History, ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { toast } from "sonner";

interface Transaction {
  id: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  created_at: string;
  description: string;
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

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to view your wallet.");
        return;
      }

      // Fetch or Create Wallet
      let { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code === 'PGRST116') {
        // Wallet doesn't exist, create it
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({ user_id: user.id, balance: 0 })
          .select()
          .single();
        
        if (createError) throw createError;
        wallet = newWallet;
      } else if (walletError) {
        throw walletError;
      }

      setBalance(wallet.balance);

      // Fetch Transactions
      const { data: txs, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false });

      if (txError) throw txError;
      setTransactions(txs || []);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .single();

      if (!wallet) return;

      // 1. Update Balance
      const { error: balanceError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance + val })
        .eq('id', wallet.id);

      if (balanceError) throw balanceError;

      // 2. Log Transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          wallet_id: wallet.id,
          amount: val,
          transaction_type: 'credit',
          description: 'Deposit via Wallet Funding',
          status: 'success'
        });

      if (txError) throw txError;

      await fetchData();
      setFunding(false);
      setAmount("");
      toast.success(`Successfully funded ₦${val.toLocaleString()}`);
    } catch (err: any) {
      toast.error(`Funding failed: ${err.message}`);
    } finally {
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
    <div className="relative min-h-screen bg-background px-4 py-8 text-foreground antialiased overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 -top-[10%] -z-10 h-[40%] w-full rounded-full bg-brand-primary/10 opacity-60 blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-3xl relative z-10">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6">
          <Link href="/customer/dashboard" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-primary transition-colors w-fit">
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-gradient-primary">
              Wallet
            </h1>
            <p className="mt-1 text-sm text-zinc-400 font-medium">Manage your funds and transaction history securely.</p>
          </div>
        </header>

        {error && (
          <div className="mb-6 glass-panel p-4 border-red-500/20 bg-red-500/5 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        <motion.main variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          {/* Balance Card */}
          <motion.section variants={itemVariants} className="glass-panel p-8 shadow-premium border-brand-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[50px] -mr-32 -mt-32 pointer-events-none" />
            
            <p className="text-[3vw] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Available Balance</p>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight">
              <span className="text-brand-primary mr-1">₦</span>{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            
            <div className="mt-8">
              {!funding ? (
                <button 
                   onClick={() => setFunding(true)} 
                   className="btn-minimal rounded-full px-8 h-12 w-full sm:w-auto text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Funds
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
                       className="flex-1 sm:flex-none rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 h-12 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.section>

          {/* Transactions */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium">
            <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <History size={16} className="text-brand-primary" />
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Transaction History</h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {transactions.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No transactions yet.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-4 glass-panel-hover px-3 sm:px-4 rounded-xl transition-colors -mx-2 sm:-mx-4 group overflow-hidden">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`flex shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 ${tx.transaction_type === 'credit' ? 'text-emerald-500' : 'text-zinc-400'}`}>
                        {tx.transaction_type === 'credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors truncate">{tx.description}</p>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-zinc-500 mt-1 truncate">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-xs sm:text-sm font-extrabold font-mono tracking-tight shrink-0 pl-3 sm:pl-4 ${tx.transaction_type === 'credit' ? 'text-emerald-500' : 'text-foreground'}`}>
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
