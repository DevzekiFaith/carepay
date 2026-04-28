"use client";

import { useCart } from "@/lib/cart";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  PackageOpen,
} from "lucide-react";

const DELIVERY_FEE = 2500;

export default function CartDrawer() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-md bg-background border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-brand-primary" />
                <h2 className="text-lg font-heading font-extrabold text-foreground">
                  Your Cart
                </h2>
                {cartCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-[10px] font-bold text-brand-primary">
                    {cartCount} item{cartCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-foreground hover:border-white/20 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-16">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <PackageOpen
                      size={32}
                      className="text-zinc-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-xs mb-6">
                    Browse our store and add premium parts and fittings to your
                    cart.
                  </p>
                  <Link
                    href="/store"
                    onClick={() => setIsCartOpen(false)}
                    className="btn-minimal flex items-center gap-2 rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-widest"
                  >
                    Browse Store <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        className="flex gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-white/5">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            unoptimized
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h4 className="text-sm font-bold text-foreground truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                            {item.product.category}
                          </p>
                          <p suppressHydrationWarning className="text-sm font-extrabold text-foreground mt-auto">
                            <span className="text-brand-primary text-[10px] mr-0.5">
                              ₦
                            </span>
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-end justify-between shrink-0">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                item.quantity === 1
                                  ? removeFromCart(item.product.id)
                                  : updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 hover:text-foreground transition-all"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-primary/50 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-rose-400 transition-colors py-2"
                  >
                    Clear All Items
                  </button>
                </>
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4 bg-background/80 backdrop-blur-xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span suppressHydrationWarning className="font-bold text-foreground">
                      ₦{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Delivery</span>
                    <span className="font-bold text-foreground">
                      ₦{DELIVERY_FEE.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      Total
                    </span>
                    <span suppressHydrationWarning className="text-lg font-extrabold text-brand-primary">
                      ₦{(cartTotal + DELIVERY_FEE).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/store/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-minimal flex items-center justify-center gap-2 w-full h-12 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-premium"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-brand-primary transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
