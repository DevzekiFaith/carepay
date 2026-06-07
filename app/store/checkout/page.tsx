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
  Check,
  Loader2,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const DELIVERY_FEE = 2500;

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart, mounted } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const orderPlacedRef = useRef(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const checkUser = async () => {
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

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill all required fields.");
      setSubmitting(false);
      return;
    }

    const orderRef = `HC-${Date.now().toString(36).toUpperCase()}`;

    try {
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
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Failed to place order. Please try again.");
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
                      value={formData.fullName}
                      onChange={handleInputChange}
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
                      value={formData.email}
                      onChange={handleInputChange}
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
                      value={formData.phone}
                      onChange={handleInputChange}
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
                      value={formData.address}
                      onChange={handleInputChange}
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
                    value={formData.notes}
                    onChange={handleInputChange}
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
