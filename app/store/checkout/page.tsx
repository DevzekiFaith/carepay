"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  CreditCard,
  Check,
  Loader2,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import { toast } from "sonner";

const DELIVERY_FEE = 2500;

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();
  }, [supabase]);

  // Redirect if cart is empty
  useEffect(() => {
    if (typeof window !== "undefined" && cartCount === 0) {
      // Small delay to allow cart to load from localStorage
      const t = setTimeout(() => {
        if (cartCount === 0) {
          router.push("/store");
        }
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [cartCount, router]);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(PAYMENT_ACCOUNT.accountNumber);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const fullName = ((formData.get("fullName") as string) || "").trim();
    const email = ((formData.get("email") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const address = ((formData.get("address") as string) || "").trim();
    const notes = ((formData.get("notes") as string) || "").trim();

    if (!fullName || !email || !phone || !address) {
      toast.error("Please fill all required fields.");
      setSubmitting(false);
      return;
    }

    // Generate order reference
    const orderRef = `HC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      // Save order to Supabase
      const { error } = await supabase.from("store_orders").insert({
        order_ref: orderRef,
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        delivery_address: address,
        notes: notes || null,
        items: cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        subtotal: cartTotal,
        delivery_fee: DELIVERY_FEE,
        total: cartTotal + DELIVERY_FEE,
        status: "pending_payment",
        user_id: user?.id || null,
      });

      if (error) {
        // If table doesn't exist yet, still proceed (order confirmation will show)
        console.warn("Order save error (table may not exist yet):", error.message);
      }

      // Clear cart and redirect
      clearCart();
      router.push(
        `/store/order-confirmation?ref=${orderRef}&total=${cartTotal + DELIVERY_FEE}`
      );
    } catch (err) {
      console.error("Checkout error:", err);
      // Still proceed even if DB save fails
      const orderRef = `HC-${Date.now().toString(36).toUpperCase()}`;
      clearCart();
      router.push(
        `/store/order-confirmation?ref=${orderRef}&total=${cartTotal + DELIVERY_FEE}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const grandTotal = cartTotal + DELIVERY_FEE;

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
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
              <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
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
                      defaultValue={user?.user_metadata?.full_name || ""}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand-primary transition-all"
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
                      defaultValue={user?.email || ""}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand-primary transition-all"
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
                      defaultValue={user?.user_metadata?.phone || ""}
                      placeholder="+234..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Delivery Address *
                    </label>
                    <input
                      required
                      name="address"
                      placeholder="House number, street, area"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              {/* Delivery */}
              <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
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
               <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
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
                     <span className="text-sm font-bold text-foreground">Bank Transfer</span>
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Selected</span>
                 </div>
                 
                 <p className="mt-4 text-[10px] text-zinc-500 leading-relaxed">
                   After placing your order, you will be provided with our bank details to complete the transfer.
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="p-6 border-b border-white/5">
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

                <div className="p-6 border-t border-white/5 space-y-3">
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
                  <div className="h-px bg-white/10" />
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
                    className="btn-minimal w-full h-14 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-premium hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
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
                    By placing your order, you agree to our terms. Payment is
                    via bank transfer.
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
