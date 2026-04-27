"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  ChevronRight,
  Loader2,
  AlertCircle,
  Download
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/app/components/Logo";
import OrderReceipt from "@/app/components/OrderReceipt";

interface Order {
  order_ref: string;
  status: string;
  created_at: string;
  items: any[];
  total: number;
  delivery_address: string;
}

const statusMap: Record<string, { label: string; icon: any; color: string; description: string; step: number }> = {
  "pending_payment": { 
    label: "Pending Payment", 
    icon: CreditCard, 
    color: "text-amber-500", 
    description: "We are waiting for your bank transfer confirmation.",
    step: 1
  },
  "processing": { 
    label: "Processing", 
    icon: Clock, 
    color: "text-blue-500", 
    description: "Your payment has been received and we are preparing your items.",
    step: 2
  },
  "shipped": { 
    label: "Out for Delivery", 
    icon: Truck, 
    color: "text-brand-primary", 
    description: "Your package is with our delivery partner.",
    step: 3
  },
  "delivered": { 
    label: "Delivered", 
    icon: CheckCircle2, 
    color: "text-emerald-500", 
    description: "Items have been successfully delivered to your address.",
    step: 4
  },
  "cancelled": { 
    label: "Cancelled", 
    icon: AlertCircle, 
    color: "text-red-500", 
    description: "This order has been cancelled.",
    step: 0
  }
};

export default function OrderTrackingPage() {
  const [orderRef, setOrderRef] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    const supabase = createClient();
    try {
      const { data, error: fetchError } = await supabase
        .from("store_orders")
        .select("*")
        .eq("order_ref", orderRef.trim().toUpperCase())
        .eq("customer_email", email.trim().toLowerCase())
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      if (!data) {
        setError("Order not found. Please check your reference and email.");
      } else {
        setOrder(data);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = order ? statusMap[order.status] || statusMap["processing"] : null;

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased py-12 sm:py-24 overflow-hidden px-4">
      <div className="absolute inset-x-0 -top-[20%] -z-10 h-[60%] w-full rounded-full bg-brand-primary/5 opacity-40 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-4xl relative z-10">
        <header className="mb-12 text-center">
          <Link href="/store" className="inline-block mb-8">
            <Logo size="md" />
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-gradient-primary mb-3"
          >
            Track Your Order
          </motion.h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Enter your order details below to see the current status of your delivery.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          {/* Search Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-3xl border-brand-primary/20"
          >
            <form onSubmit={handleTrack} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Order Reference
                </label>
                <input 
                  required
                  placeholder="e.g. HC-XXXXX"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-mono text-brand-primary placeholder:text-zinc-600 outline-none focus:border-brand-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Email Address
                </label>
                <input 
                  required
                  type="email"
                  placeholder="The email used for checkout"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm outline-none focus:border-brand-primary transition-all"
                />
              </div>
              <button 
                disabled={loading}
                className="btn-minimal w-full h-12 rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                Locate Order
              </button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                >
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={14} />
                  <p className="text-xs font-medium text-red-400 leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {order ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Status Header */}
                  <div className="glass-panel p-8 rounded-3xl border-white/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${currentStatus?.color}`}>
                          {currentStatus && <currentStatus.icon size={32} strokeWidth={1.5} />}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Current Status</p>
                          <h2 className={`text-2xl font-heading font-extrabold tracking-tight mt-1 ${currentStatus?.color}`}>
                            {currentStatus?.label}
                          </h2>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-3">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Estimated Total</p>
                          <p className="text-2xl font-heading font-extrabold text-foreground mt-1">
                            ₦{order.total.toLocaleString()}
                          </p>
                        </div>
                        <button 
                          onClick={() => setShowReceipt(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-primary transition-all"
                        >
                          <Download size={12} /> View Receipt
                        </button>
                      </div>
                    </div>
                    <p className="mt-6 text-sm text-zinc-400 font-medium leading-relaxed">
                      {currentStatus?.description}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className="glass-panel p-8 rounded-3xl border-white/10">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-8">Delivery Timeline</h3>
                    <div className="relative">
                      {/* Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 hidden sm:block" />
                      
                      <div className="space-y-10 relative">
                        {[
                          { step: 1, label: "Order Placed", desc: "Your order is in the system", date: new Date(order.created_at).toLocaleDateString() },
                          { step: 2, label: "Processing", desc: "We are preparing your items for shipping", date: "" },
                          { step: 3, label: "On the way", desc: "Our delivery pro is heading to your address", date: "" },
                          { step: 4, label: "Delivered", desc: "Items received and verified", date: "" },
                        ].map((s) => {
                          const isDone = currentStatus ? currentStatus.step >= s.step : false;
                          const isCurrent = currentStatus ? currentStatus.step === s.step : false;
                          
                          return (
                            <div key={s.step} className="flex items-start gap-6 group">
                              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-500 z-10 ${
                                isDone 
                                  ? "bg-brand-primary/20 border-brand-primary text-brand-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
                                  : "bg-white/5 border-white/10 text-zinc-600"
                              }`}>
                                {isDone ? <CheckCircle2 size={20} /> : <span className="text-sm font-bold">{s.step}</span>}
                              </div>
                              <div className="flex-1 pt-1">
                                <div className="flex items-center justify-between">
                                  <h4 className={`text-sm font-bold transition-colors ${isDone ? "text-foreground" : "text-zinc-500"}`}>
                                    {s.label}
                                  </h4>
                                  {s.date && <span className="text-[10px] text-zinc-600 font-bold">{s.date}</span>}
                                </div>
                                <p className={`mt-1 text-xs transition-colors ${isDone ? "text-zinc-400" : "text-zinc-600"}`}>
                                  {s.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="glass-panel p-6 rounded-3xl border-white/10 grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Delivery Address</h3>
                      <div className="flex gap-3 text-zinc-300">
                        <Truck size={14} className="shrink-0 mt-1" />
                        <p className="text-xs font-medium leading-relaxed">{order.delivery_address}</p>
                      </div>
                    </div>
                    <div className="sm:border-l border-white/5 sm:pl-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Order Items</h3>
                      <div className="space-y-2">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-medium">
                            <span className="text-zinc-400 truncate max-w-[150px]">{item.quantity}x {item.name}</span>
                            <span className="text-foreground">₦{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 glass-panel rounded-3xl border-dashed border-white/10"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 mb-6">
                    <Package size={40} strokeWidth={1} />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-400">Ready to track?</h2>
                  <p className="mt-2 text-sm text-zinc-600 max-w-xs">
                    Your order details will appear here once you enter your reference number and email.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showReceipt && order && (
        <OrderReceipt 
          orderRef={order.order_ref}
          date={order.created_at}
          customerName={(order as any).customer_name}
          customerEmail={(order as any).customer_email}
          address={order.delivery_address}
          items={order.items}
          subtotal={(order as any).subtotal}
          deliveryFee={(order as any).delivery_fee}
          total={order.total}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
