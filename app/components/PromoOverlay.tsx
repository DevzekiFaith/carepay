"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, Flame, ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";

const PROMO_DELAY_MS = 4000; // First popup after 4 seconds
const PROMO_INTERVAL_MS = 60000; // Show a new product every 60 seconds
const DISMISS_KEY = "homecare-promo-session";

// Get a pool of featured products (prioritize badged items, then all)
function getPromoPool() {
  const badged = PRODUCTS.filter((p) => p.badge);
  return badged.length >= 3 ? badged : PRODUCTS;
}

export default function PromoOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart, setIsCartOpen } = useCart();

  const pool = getPromoPool();
  const product = pool[currentIndex % pool.length];

  // Show the first promo after initial delay, then rotate at intervals
  useEffect(() => {
    // Pick a random starting point so it's not always the same product
    setCurrentIndex(Math.floor(Math.random() * pool.length));

    const firstTimer = setTimeout(() => {
      setIsVisible(true);
    }, PROMO_DELAY_MS);

    return () => clearTimeout(firstTimer);
  }, [pool.length]);

  // Set up the rotation interval — after dismiss, show next product after interval
  useEffect(() => {
    if (isVisible) return; // Don't start interval while popup is showing

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pool.length);
      setIsVisible(true);
    }, PROMO_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isVisible, pool.length]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleAddToCart = useCallback(() => {
    addToCart(product, 1);
    setIsVisible(false);
    setIsCartOpen(true);
  }, [product, addToCart, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl border border-white/10 bg-background shadow-[0_0_60px_rgba(249,115,22,0.15)]">
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:bg-black/60 transition-all"
              >
                <X size={18} />
              </button>

              {/* Top Banner */}
              <div className="relative bg-gradient-to-r from-brand-primary/20 via-rose-500/10 to-violet-500/10 px-6 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Flame
                    size={16}
                    className="text-brand-primary animate-pulse"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
                    Featured Deal — Limited Stock
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row gap-0">
                {/* Image */}
                <div className="relative w-full sm:w-1/2 aspect-video sm:aspect-auto sm:min-h-[280px] bg-white/5 shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 250px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent sm:bg-gradient-to-r" />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[9px] font-bold uppercase tracking-widest text-rose-400 backdrop-blur-md">
                      🔥 {product.badge}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-heading font-extrabold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={
                              star <= Math.round(product.rating!)
                                ? "text-amber-400 fill-amber-400"
                                : "text-zinc-600"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {product.rating} ({product.reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-2xl font-extrabold text-foreground">
                      <span className="text-brand-primary text-base mr-0.5">
                        ₦
                      </span>
                      {product.price.toLocaleString()}
                    </span>
                    {product.stock && product.stock <= 20 && (
                      <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">
                        Only {product.stock} left
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-brand-primary text-background text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                    <Link
                      href="/store"
                      onClick={handleDismiss}
                      className="flex items-center justify-center gap-2 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-300 transition-all px-5"
                    >
                      View Store <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
