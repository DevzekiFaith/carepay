"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  Loader2,
  Check,
} from "lucide-react";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import { useState } from "react";
import { toast } from "sonner";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("ref") || "HC-UNKNOWN";
  const total = parseInt(searchParams.get("total") || "0");
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(PAYMENT_ACCOUNT.accountNumber);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I just placed an order on HomeCare Store.\n\nOrder Ref: ${orderRef}\nTotal: ₦${total.toLocaleString()}\n\nI've made the payment. Please confirm.`
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased py-12 sm:py-24 overflow-hidden px-4">
      <div className="absolute inset-x-0 -top-[20%] -z-10 h-[60%] w-full rounded-full bg-emerald-500/5 opacity-40 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 25 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
            <CheckCircle2
              size={40}
              className="text-emerald-500"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground mb-3">
            Order Placed!
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Your order has been recorded. Complete the bank transfer below and
            we&apos;ll process your delivery within 24 hours.
          </p>
        </motion.div>

        {/* Order Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Order Reference
            </span>
            <span className="px-4 py-2 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-sm font-mono font-extrabold text-brand-primary tracking-wider">
              {orderRef}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-sm font-bold text-foreground">
              Amount to Pay
            </span>
            <span className="text-2xl font-extrabold text-emerald-500">
              ₦{total.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Bank Transfer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 sm:p-8 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[50px] -mr-16 -mt-16 pointer-events-none" />

          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-6 flex items-center gap-2">
            Transfer to this account
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                Bank Name
              </p>
              <p className="text-base font-bold text-foreground">
                {PAYMENT_ACCOUNT.bankName}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                Account No.
              </p>
              <div className="flex items-center gap-2">
                <p className="text-base font-extrabold tracking-widest text-brand-primary font-mono">
                  {PAYMENT_ACCOUNT.accountNumber}
                </p>
                <button
                  onClick={handleCopyAccount}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
                  title="Copy account number"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
            <div className="sm:col-span-2 pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                Account Name
              </p>
              <p className="text-base font-bold text-foreground">
                {PAYMENT_ACCOUNT.accountName}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href={`https://wa.me/2349060002990?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-emerald-700 transition-all shadow-lg"
          >
            <MessageCircle size={18} />
            Notify Payment via WhatsApp
          </a>
          <Link
            href="/store"
            className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-300 transition-all"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
        </motion.div>

        <p className="text-center text-[10px] text-zinc-600 mt-8 leading-relaxed">
          Having issues? Contact us via WhatsApp or email at{" "}
          <span className="text-zinc-400">support@homecare.ng</span>
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
