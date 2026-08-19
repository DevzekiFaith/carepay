"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Zap,
  Building2,
  CheckCircle2,
  ExternalLink
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
  const [paymentMethod, setPaymentMethod] = useState<"flutterwave" | "transfer">("flutterwave");
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
            fullName: data.user?.user_metadata?.full_name || "",
            email: data.user?.email || "",
            phone: data.user?.user_metadata?.phone || "",
          }));
        }
      } catch {
        // Guest mode fallback
      }
    };
    checkUser();
  }, [supabase]);

  // Redirect if cart is empty after hydration/mounted
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

    const orderRef = `HC-${typeof window !== 'undefined' ? Date.now().toString(36).toUpperCase() : 'PENDING'}`;

    try {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        toast.error("Please fill all required fields.");
        setSubmitting(false);
        return;
      }

      // 1. Insert order record into database
      const { error } = await supabase.from("store_orders").insert({
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
      });

      if (error) {
        console.warn("Supabase insert error (proceeding with payment init):", error);
      }

      orderPlacedRef.current = true;
      clearCart();

      // 2. Route based on selected payment method
      if (paymentMethod === "flutterwave") {
        toast.loading("Opening Flutterwave Secure Checkout...");
        
        const initRes = await fetch("/api/payment/flutterwave/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderRef,
            amount: grandTotal,
            email: formData.email,
            name: formData.fullName,
            phone: formData.phone,
            title: "HomeCare Smart Appliances Store",
            description: `Payment for Order ${orderRef} (${cartCount} items)`,
            type: "store_order",
            userId: user?.id || null,
          }),
        });

        const initData = await initRes.json();

        if (initData.success && initData.paymentUrl) {
          window.location.href = initData.paymentUrl;
          return;
        } else {
          toast.error("Flutterwave Gateway notice: " + (initData.error || "Falling back to order confirmation"));
          router.push(`/store/order-confirmation?ref=${orderRef}&total=${grandTotal}`);
        }
      } else {
        // Globus Bank transfer fallback
        router.push(`/store/order-confirmation?ref=${orderRef}&total=${grandTotal}`);
      }
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      orderPlacedRef.current = true;
      clearCart();
      setOfflineOrder({
        ref: orderRef,
        total: grandTotal,
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
      });
      toast.info("Your order is received. Please complete the payment below.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || (cartCount === 0 && !orderPlacedRef.current)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={32} />
      </div>
    );
  }

  // Offline fallback
  if (offlineOrder) {
    return (
      <div className="relative min-h-screen bg-slate-50 text-slate-900 py-16 px-4">
        <div className="mx-auto max-w-xl bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-sm text-slate-500 mb-6">Order Ref: <strong className="text-sky-600 font-mono">{offlineOrder.ref}</strong></p>
          <p className="text-sm text-slate-600 mb-6">Total: <strong>₦{offlineOrder.total.toLocaleString()}</strong></p>

          <Link
            href={`/store/order-confirmation?ref=${offlineOrder.ref}&total=${offlineOrder.total}`}
            className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-full bg-sky-600 text-white font-extrabold text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-md shadow-sky-600/20"
          >
            View Payment Instructions <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 antialiased overflow-hidden">
      {/* Royal Blue Hero Banner */}
      <section className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-blue-800 text-white pt-10 pb-16 px-6 rounded-b-[40px] md:rounded-b-[50px] shadow-2xl shadow-blue-900/15 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-300/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <Link
            href="/store"
            className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-sky-200 hover:text-white transition-colors mb-4 w-fit"
          >
            <ArrowLeft size={14} /> Back to Store
          </Link>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Secure <span className="text-cyan-200">Checkout</span>
          </h1>
          <p className="mt-1 text-sm sm:text-base text-sky-100/90 font-medium">
            Fast escrow checkout powered by Flutterwave with nationwide delivery.
          </p>
        </div>
      </section>

      {/* Main Form & Summary Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-10 relative z-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Customer Info & Payment Selector (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Contact Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  1. Delivery & Contact Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                      Full Name *
                    </label>
                    <input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. David Adeleke"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="08012345678"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                      Delivery Address *
                    </label>
                    <input
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street, Estate / Area, City, State"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                      Special Delivery Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Any landmark, building number, or preferred delivery timing..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector (Flutterwave Primary 90% vs Globus Bank Secondary) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    2. Select Payment Method
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    🔒 256-bit Encrypted
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Option A: Flutterwave (Primary 90%) */}
                  <label
                    onClick={() => setPaymentMethod("flutterwave")}
                    className={`flex items-start justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "flutterwave"
                        ? "border-sky-600 bg-sky-50/70 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={paymentMethod === "flutterwave"}
                        onChange={() => setPaymentMethod("flutterwave")}
                        className="mt-1 accent-sky-600 h-4 w-4"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            Flutterwave Online Checkout
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest bg-sky-600 text-white px-2 py-0.5 rounded-full">
                            Recommended · Instant
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Pay instantly via <strong>MasterCard, Visa, Verve, USSD (*737#, *901#), Bank Transfer, or Apple Pay</strong>. Zero transaction delay.
                        </p>
                      </div>
                    </div>
                    <Zap size={20} className="text-amber-500 shrink-0 ml-2 mt-0.5" />
                  </label>

                  {/* Option B: Globus Bank Transfer (Substitute 10%) */}
                  <label
                    onClick={() => setPaymentMethod("transfer")}
                    className={`flex items-start justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === "transfer"
                        ? "border-sky-600 bg-sky-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 opacity-80"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={paymentMethod === "transfer"}
                        onChange={() => setPaymentMethod("transfer")}
                        className="mt-1 accent-sky-600 h-4 w-4"
                      />
                      <div>
                        <span className="font-bold text-sm text-slate-800">
                          Direct Bank Transfer (Globus Bank Alternative)
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Manual bank deposit to {PAYMENT_ACCOUNT.bankName} ({PAYMENT_ACCOUNT.accountNumber}). Confirmation takes 10-20 mins.
                        </p>
                      </div>
                    </div>
                    <Building2 size={18} className="text-slate-400 shrink-0 ml-2 mt-0.5" />
                  </label>
                </div>
              </div>

            </div>

            {/* Right: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    Order Summary
                  </h2>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                    {cartCount} {cartCount === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Qty: {item.quantity} × ₦{item.product.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs font-extrabold text-slate-900 shrink-0">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Appliance Subtotal</span>
                    <span className="font-bold text-slate-900">₦{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Dispatch & Handling</span>
                    <span className="font-bold text-slate-900">₦{DELIVERY_FEE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-extrabold text-slate-900">
                    <span>Grand Total</span>
                    <span className="text-xl font-black text-sky-600">₦{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs uppercase tracking-widest shadow-md shadow-sky-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-102 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : paymentMethod === "flutterwave" ? (
                    <>
                      <Zap size={16} className="text-cyan-200 fill-cyan-200" />
                      <span>Pay with Flutterwave · ₦{grandTotal.toLocaleString()}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Place Order (Bank Transfer)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>100% Escrow Protection Guaranteed</span>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
