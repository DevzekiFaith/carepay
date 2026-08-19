"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  CreditCard,
  Loader2,
  Copy,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import { User } from "@supabase/supabase-js";

const DELIVERY_FEE = 2500;

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart, mounted } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const orderPlacedRef = useRef(false);
  const [offlineOrder, setOfflineOrder] = useState<{
    ref: string;
    total: number;
    customerName: string;
    phone: string;
    email: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        if (data.user) {
          setFormData(prev => ({
            ...prev,
            fullName: data.user.user_metadata?.full_name || "",
            email: data.user.email || "",
            phone: data.user.user_metadata?.phone || "",
          }));
        }
      } catch {
        // Supabase unavailable (e.g. paused) — proceed as guest
      }
    };
    checkUser();
  }, [supabase]);


  // Redirect if cart is empty after hydration/mounted (but not after a successful order)
  useEffect(() => {
    if (mounted && cartCount === 0 && !orderPlacedRef.current) {
      router.push("/store");
    }
  }, [mounted, cartCount, router]);

  const grandTotal = cartTotal + DELIVERY_FEE;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    // Generate order reference above try/catch so it's accessible in both blocks
    const orderRef = `HC-${typeof window !== 'undefined' ? Date.now().toString(36).toUpperCase() : 'PENDING'}`;

    try {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        toast.error("Please fill all required fields.");
        return;
      }

      console.log("Starting order submission...", { orderRef, cartItems: cartItems.length });

      const { data, error } = await supabase.from("store_orders").insert({
        order_ref: orderRef,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: formData.address,
        notes: formData.notes || null,
        items: cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        subtotal: cartTotal,
        delivery_fee: DELIVERY_FEE,
        total: grandTotal,
        status: "pending_payment",
        user_id: user?.id || null,
      }).select();

      console.log("Order submission result:", { data, error });

      if (error) throw error;

      orderPlacedRef.current = true;
      clearCart();
      router.push(`/store/order-confirmation?ref=${orderRef}&total=${grandTotal}`);
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      // If database/network is unavailable (e.g. Supabase paused), show offline
      // payment fallback so the customer can still complete via bank transfer
      orderPlacedRef.current = true;
      clearCart();
      setOfflineOrder({
        ref: orderRef,
        total: grandTotal,
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
      });
      toast.info("Your order reference is ready. Please complete the bank transfer below.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || (cartCount === 0 && !orderPlacedRef.current)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  // Offline / Supabase-unavailable fallback — customer can still pay via bank transfer
  if (offlineOrder) {
    const whatsappMessage = encodeURIComponent(
      `Hi! I just placed a HomeCare Store order.\n\nOrder Ref: ${offlineOrder.ref}\nName: ${offlineOrder.customerName}\nTotal: \u20a6${offlineOrder.total.toLocaleString()}\n\nI've made the bank transfer. Please confirm my order.`
    );
    return (
      <div className="relative min-h-screen bg-background text-foreground antialiased py-12 sm:py-24 overflow-hidden px-4">
        <div className="absolute inset-x-0 -top-[20%] -z-10 h-[60%] w-full rounded-full bg-emerald-500/5 opacity-40 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="mx-auto max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground mb-3">Order Received!</h1>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your order reference is ready. Please complete your payment via bank transfer and notify us on WhatsApp to confirm.
            </p>
          </motion.div>

          {/* Order Reference Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md overflow-hidden mb-6 shadow-premium"
          >
            <div className="p-6 sm:p-8 bg-white/[0.02] border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-1">Order Reference</span>
                <span className="text-2xl font-mono font-extrabold text-brand-primary tracking-widest">{offlineOrder.ref}</span>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(offlineOrder.ref); toast.success("Order reference copied!"); }}
                className="flex items-center gap-2 h-9 px-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-primary transition-all"
              >
                <Copy size={12} /> Copy Ref
              </button>
            </div>
            <div className="p-6 sm:p-8 flex items-center justify-between bg-emerald-500/5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/60 block mb-1">Amount to Pay</span>
                <span className="text-3xl font-extrabold text-emerald-500">\u20a6{offlineOrder.total.toLocaleString()}</span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Payment Status</p>
                <p className="text-xs font-extrabold uppercase mt-1 text-amber-500">Pending Payment</p>
              </div>
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
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-6">Transfer to this account</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Bank Name</p>
                <p className="text-base font-bold text-foreground">{PAYMENT_ACCOUNT.bankName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Account No.</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-extrabold tracking-widest text-brand-primary font-mono">{PAYMENT_ACCOUNT.accountNumber}</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(PAYMENT_ACCOUNT.accountNumber); toast.success("Account number copied!"); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-brand-primary transition-all"
                    title="Copy account number"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2 pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Account Name</p>
                <p className="text-base font-bold text-foreground">{PAYMENT_ACCOUNT.accountName}</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <a
              href={`https://wa.me/2349060002990?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-2 flex items-center justify-center gap-2 h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-lg"
            >
              <MessageCircle size={18} /> Notify Payment via WhatsApp
            </a>
            <Link
              href={`/store/track?ref=${offlineOrder.ref}`}
              className="flex items-center justify-center gap-2 h-14 rounded-xl bg-brand-primary text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-brand-primary/90 transition-all shadow-lg"
            >
              Track Order Status
            </Link>
            <Link
              href="/store"
              className="flex items-center justify-center gap-2 h-14 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 transition-all"
            >
              Continue Shopping
            </Link>
          </motion.div>

          <p className="text-center text-[10px] text-zinc-600 mt-8 leading-relaxed">
            Save your reference: <span className="text-brand-primary font-mono font-bold">{offlineOrder.ref}</span> — use it to track your order at <span className="text-zinc-400">/store/track</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased py-8 sm:py-16 overflow-hidden px-4 sm:px-0">
      <div className="absolute inset-x-0 -top-[20%] -z-10 h-[60%] w-full rounded-full bg-brand-primary/5 opacity-40 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Link
          href="/store"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-brand-primary transition-colors mb-8 w-fit"
        >
          <ArrowLeft size={14} /> Back to Store
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-gradient-primary mb-2"
        >
          Checkout
        </motion.h1>
        <p className="text-sm text-zinc-400 mb-10">
          {user
            ? "Your details are pre-filled. Review and place your order."
            : "No account needed — just fill in your details and pay."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            {/* Left — Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* Customer Details */}
              <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <ShoppingBag size={18} />
                  </div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Customer Details
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Full Name *
                    </label>
                    <input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-3 text-sm text-zinc-800 dark:text-foreground outline-none focus:border-brand-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-3 text-sm text-zinc-800 dark:text-foreground outline-none focus:border-brand-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234..."
                      className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-3 text-sm text-zinc-800 dark:text-foreground outline-none focus:border-brand-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Delivery Address *
                    </label>
                    <input
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House number, street, area"
                      className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-3 text-sm text-zinc-800 dark:text-foreground outline-none focus:border-brand-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                    className="w-full resize-none rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-3 text-sm text-zinc-800 dark:text-foreground outline-none focus:border-brand-primary transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Delivery */}
              <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Truck size={18} />
                  </div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Delivery Info
                  </h2>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Flat delivery fee of{" "}
                  <span className="font-bold text-foreground">
                    ₦{DELIVERY_FEE.toLocaleString()}
                  </span>{" "}
                  within Enugu metropolis. Delivery takes 1-3 business days
                  after payment confirmation.
                </p>
              </div>

               {/* Payment */}
                <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                     <CreditCard size={18} />
                   </div>
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                     Payment Method
                   </h2>
                 </div>
 
                 <div className="flex items-center justify-between p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                     <span className="text-sm font-bold text-foreground">Bank Transfer (Globus Bank)</span>
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Manual</span>
                 </div>
                 
                 <p className="mt-4 text-[10px] text-zinc-500 leading-relaxed">
                   You will receive bank details on the next page to complete your transfer.
                 </p>
               </div>
            </motion.div>

            {/* Right — Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24 self-start"
            >
              <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md overflow-hidden">
                <div className="p-6 border-b border-zinc-200 dark:border-white/5">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Order Summary ({cartCount} item{cartCount !== 1 ? "s" : ""})
                  </h2>
                </div>

                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3"
                    >
                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white/5">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-foreground shrink-0">
                        ₦
                        {(
                          item.product.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-zinc-200 dark:border-white/5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="font-bold text-foreground">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Delivery</span>
                    <span className="font-bold text-foreground">
                      ₦{DELIVERY_FEE.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-zinc-200 dark:bg-white/10" />
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-foreground">
                      Total
                    </span>
                    <span className="text-xl font-extrabold text-brand-primary">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-minimal w-full h-14 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-premium hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 flex items-center justify-center gap-3 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} /> Place Order — ₦
                        {grandTotal.toLocaleString()}
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-zinc-600 text-center mt-3">
                    By placing your order, you agree to our terms. Manual bank transfer required.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
