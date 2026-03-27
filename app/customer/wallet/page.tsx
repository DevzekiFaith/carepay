"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, History, ArrowUpRight, ArrowDownLeft } from "lucide-react";

// Fake transaction data
const MOCK_TRANSACTIONS = [
  { id: "tx_101", type: "credit", amount: 15000, date: "Today, 10:24 AM", desc: "Paystack Deposit" },
  { id: "tx_102", type: "debit", amount: 5000, date: "Yesterday", desc: "Plumbing Service #REQ-3001" },
];

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } } };

export default function CustomerWalletPage() {
  const [balance, setBalance] = useState(10000);
  const [funding, setFunding] = useState(false);
  const [amount, setAmount] = useState("");

  const handleFund = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      setBalance(b => b + val);
      setFunding(false);
      setAmount("");
      alert(`Successfully simulated funding ₦${val.toLocaleString()}`);
    }
  };

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
            <p className="mt-1 text-sm text-zinc-400 font-medium">Manage your funds and transaction history.</p>
          </div>
        </header>

        <motion.main variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
          {/* Balance Card */}
          <motion.section variants={itemVariants} className="glass-panel p-8 shadow-premium border-brand-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[50px] -mr-32 -mt-32 pointer-events-none" />
            
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Available Balance</p>
            <p className="text-5xl font-heading font-extrabold text-foreground tracking-tight">
              <span className="text-brand-primary mr-1">₦</span>{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            
            <div className="mt-8">
              {!funding ? (
                <button onClick={() => setFunding(true)} className="btn-minimal rounded-full px-8 h-12 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <Plus size={14} /> Add Funds
                </button>
              ) : (
                <form onSubmit={handleFund} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₦</span>
                    <input 
                      type="number" 
                      required 
                      autoFocus
                      placeholder="Amount" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full rounded-full border border-brand-primary/50 bg-brand-primary/5 pl-8 pr-4 h-12 text-sm text-foreground outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="submit" className="btn-minimal rounded-full px-6 h-12 text-xs font-bold uppercase tracking-widest">
                      Proceed
                    </button>
                    <button type="button" onClick={() => setFunding(false)} className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 h-12 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors">
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
              {MOCK_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-4 glass-panel-hover px-4 rounded-xl transition-colors -mx-4 group">
                  <div className="flex items-center gap-4">
                    <div className={`flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 ${tx.type === 'credit' ? 'text-emerald-500' : 'text-zinc-400'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors">{tx.desc}</p>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-extrabold font-mono tracking-tight shrink-0 pl-4 ${tx.type === 'credit' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.main>
      </div>
    </div>
  );
}
