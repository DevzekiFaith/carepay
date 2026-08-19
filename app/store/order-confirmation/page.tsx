"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  ShoppingBag,
  MessageCircle,
  Loader2,
  Check,
  Truck,
  Download,
} from "lucide-react";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import OrderReceipt from "@/app/components/OrderReceipt";

interface StoreOrderItem {
  id?: string;
  product_id?: string;
  name?: string;
  product_name?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface StoreOrder {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_email: string;
  delivery_address: string;
  items: StoreOrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  created_at: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("ref") || "HC-UNKNOWN";
  const total = parseInt(searchParams.get("total") || "0");
  const [copied, setCopied] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderData, setOrderData] = useState<StoreOrder | null>(null);
  const [fetchingOrder, setFetchingOrder] = useState(orderRef !== "HC-UNKNOWN");
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (orderRef === "HC-UNKNOWN") return;

    let isMounted = true;
    const fetchOrder = async () => {
      setFetchingOrder(true);
      setFetchError(false);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('store_orders')
        .select('*')
        .eq('order_ref', orderRef)
        .maybeSingle();
      
      if (!isMounted) return;

      if (error) {
        console.error("Fetch error:", error);
        setFetchError(true);
      }
      if (data) {
        setOrderData(data);
      }
      setFetchingOrder(false);
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderRef]);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(PAYMENT_ACCOUNT.accountNumber);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const displayTotal = orderData?.total ? Number(orderData.total) : total;

  const isPaid = orderData && orderData.status !== 'pending_payment' && orderData.status !== 'cancelled';

  const whatsappMessage = encodeURIComponent(
    `Hi, I just placed an order on HomeCare Store.\n\nOrder Ref: ${orderRef}\nTotal: ₦${displayTotal.toLocaleString()}\n\nI've made the payment. Please confirm.`
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
            {isPaid 
              ? "Your payment was successful! We've received your order and we're processing your delivery within 24 hours."
              : "Your order has been recorded. Please complete the payment to process your delivery."}
          </p>
        </motion.div>

        {/* Order Reference & Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-md overflow-hidden mb-6 shadow-premium"
        >
          <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 block mb-1">
                Order Reference
              </span>
              <span className="text-2xl font-mono font-extrabold text-brand-primary tracking-widest">
                {orderRef}
              </span>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => {
                   navigator.clipboard.writeText(orderRef);
                   toast.success("Order reference copied!");
                 }}
                 className="flex items-center gap-2 h-9 px-4 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary transition-all"
               >
                 <Copy size={12} /> Copy Ref
               </button>
            </div>
          </div>
 
          <div className="p-6 sm:p-8 flex items-center justify-between bg-emerald-500/5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/60 block mb-1">
                Amount to Pay
              </span>
              <span className="text-3xl font-extrabold text-emerald-500">
                ₦{displayTotal.toLocaleString()}
              </span>
            </div>
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Payment Status</p>
               <p className={`text-xs font-extrabold uppercase mt-1 ${isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                 {isPaid ? 'Payment Successful' : 'Pending Payment'}
               </p>
            </div>
          </div>
        </motion.div>

        {/* Payment Details — shown from URL params even when DB is temporarily unavailable */}
        {!isPaid && orderRef !== 'HC-UNKNOWN' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 dark:bg-brand-primary/[0.03] p-6 sm:p-8 mb-6 relative overflow-hidden"
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-brand-primary hover:border-brand-primary/30 dark:hover:border-brand-primary/30 transition-all"
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
              <div className="sm:col-span-2 pt-4 border-t border-zinc-200 dark:border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                  Account Name
                </p>
                <p className="text-base font-bold text-foreground">
                  {PAYMENT_ACCOUNT.accountName}
                </p>
              </div>
            </div>

            {/* Show connecting status when DB is unavailable */}
            {fetchingOrder && !orderData && (
              <div className="mt-5 pt-4 border-t border-brand-primary/10 flex items-center gap-2">
                <Loader2 size={12} className="animate-spin text-zinc-500" />
                <p className="text-[10px] text-zinc-500">Verifying order with server...</p>
              </div>
            )}
            {fetchError && !orderData && (
              <div className="mt-5 pt-4 border-t border-brand-primary/10 flex items-center justify-between">
                <p className="text-[10px] text-amber-500">Could not reach server. Your order ref is valid.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest"
                >
                  Retry
                </button>
              </div>
            )}
          </motion.div>
        )}

        {isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 mb-6 relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
            <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-4" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 mb-2">Payment Confirmed</h3>
            <p className="text-xs text-zinc-400">Thank you! Your payment has been verified.</p>
          </motion.div>
        )}

        {/* Actions */}
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
            className={`flex items-center justify-center gap-2 h-14 rounded-xl text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-lg ${isPaid ? 'bg-zinc-800 dark:bg-zinc-900 opacity-50 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            onClick={(e) => {
              if (isPaid) {
                e.preventDefault();
                toast.info("Order is already paid.");
              }
            }}
          >
            <MessageCircle size={18} />
            {isPaid ? 'Payment Confirmed' : 'Notify Payment via WhatsApp'}
          </a>
          <button
            onClick={() => {
              if (fetchingOrder) {
                toast.loading("Retrieving order details...", { id: "receipt-load" });
                return;
              }
              if (!orderData) {
                toast.error("Order details not found. Please try again in a moment.", { id: "receipt-load" });
                return;
              }
              setShowReceipt(true);
            }}
            className="flex items-center justify-center gap-2 h-14 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-600 dark:text-zinc-300 transition-all"
          >
            <Download size={16} />
            Download Receipt
          </button>
          <Link
            href={`/store/track?ref=${orderRef}`}
            className="flex items-center justify-center gap-2 h-14 rounded-xl bg-brand-primary text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-brand-primary-hover hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all shadow-lg"
          >
            <Truck size={18} />
            Track Order Status
          </Link>
          <Link
            href="/store"
            className="flex items-center justify-center gap-2 h-14 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-600 dark:text-zinc-300 transition-all"
          >
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
        </motion.div>

        {/* Receipt Modal */}
        {showReceipt && orderData && (
          <OrderReceipt 
            orderRef={orderData.order_ref}
            date={orderData.created_at}
            customerName={orderData.customer_name}
            customerEmail={orderData.customer_email}
            address={orderData.delivery_address}
            items={orderData.items.map(item => ({
              name: item.name || item.product_name || 'Item',
              price: item.price,
              quantity: item.quantity
            }))}
            subtotal={orderData.subtotal}
            deliveryFee={orderData.delivery_fee}
            total={orderData.total}
            status={orderData.status}
            onClose={() => setShowReceipt(false)}
          />
        )}

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
