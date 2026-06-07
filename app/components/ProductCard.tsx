"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Plus, Check, Minus, Star, ShoppingBag, Sparkles } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";

interface ProductCardProps {
  product: Product;
  onAddStep?: (product: Product) => void;
  isAdded?: boolean;
  priority?: boolean;
}

export default function ProductCard({
  product,
  onAddStep,
  isAdded,
  priority = false,
}: ProductCardProps) {
  const { cartItems, addToCart, updateQuantity, removeFromCart, setIsCartOpen } =
    useCart();
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    setIsCartOpen(true);
  };

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-background/40 backdrop-blur-xl p-4 transition-all duration-500 hover:-translate-y-1.5 hover:bg-white dark:hover:bg-background/60 hover:border-brand-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute top-5 right-5 z-20 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:scale-105 flex items-center gap-1 ${
            product.badge === "Best Seller"
              ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
              : product.badge === "New"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : product.badge === "Hot Deal"
              ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
              : "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400"
          }`}
        >
          {product.badge === "Hot Deal" && <Sparkles size={10} className="mr-0.5" />}
          {product.badge}
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-grow">
        <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-white/5 shrink-0 flex items-center justify-center group/image">
          {!imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              unoptimized={product.image.startsWith("http")}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-600">
              <ShoppingBag size={48} strokeWidth={1} className="opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Image Pending</span>
            </div>
          )}
          
          {/* Subtle Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Category Tag */}
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-black/60 backdrop-blur-md border border-zinc-200 dark:border-white/10 text-[9px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
            {product.category}
          </div>
        </div>

        <div className="mt-4 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-grow">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-3">
            {/* Rating */}
            {product.rating ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={
                        star <= Math.round(product.rating!)
                          ? "text-amber-400 fill-amber-400"
                          : "text-zinc-300 dark:text-zinc-700"
                      }
                    />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {product.rating} <span className="opacity-70">({product.reviewCount})</span>
                </span>
              </div>
            ) : (
              <div /> // Spacer if no rating
            )}

            {/* Stock indicator */}
            {product.stock !== undefined && product.stock <= 20 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                </span>
                <p className="text-[9px] font-bold uppercase tracking-wider">
                  {product.stock} left
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price and Actions */}
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/5 relative z-10">
        <p suppressHydrationWarning className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 mb-4 flex items-start">
          <span className="text-brand-primary text-xs sm:text-sm mr-0.5 font-bold mt-1">
            ₦
          </span>
          {product.price.toLocaleString()}
        </p>

        {/* Booking flow button */}
        {onAddStep && (
          <button
            onClick={() => onAddStep(product)}
            className={`w-full flex items-center justify-center gap-2 h-10 rounded-xl border transition-all duration-300 text-[10px] font-bold uppercase tracking-widest ${
              isAdded
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:border-brand-primary/50 hover:text-brand-primary hover:bg-brand-primary/5 active:scale-[0.98]"
            }`}
          >
            {isAdded ? (
              <>
                <Check size={14} strokeWidth={2.5} className="animate-in zoom-in duration-300" /> 
                <span>Added to Job</span>
              </>
            ) : (
              <>
                <Plus size={14} strokeWidth={2.5} /> 
                <span>Add to Job</span>
              </>
            )}
          </button>
        )}

        {/* Cart Controls */}
        {!onAddStep && (
          <div className="flex flex-col gap-2">
            {quantity > 0 ? (
              <div className="flex items-center flex-1 w-full h-11">
                <div className="flex items-center w-full h-full justify-between rounded-xl border border-brand-primary/30 bg-brand-primary/5 p-1 shadow-inner">
                  <button
                    onClick={() =>
                      quantity === 1
                        ? removeFromCart(product.id)
                        : updateQuantity(product.id, quantity - 1)
                    }
                    className="flex h-full aspect-square items-center justify-center rounded-lg bg-white dark:bg-background text-zinc-600 dark:text-zinc-400 hover:text-rose-500 transition-all shadow-sm hover:shadow active:scale-95 border border-zinc-200 dark:border-white/5"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 select-none w-8 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="flex h-full aspect-square items-center justify-center rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shadow-sm hover:shadow active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="group/btn relative w-full overflow-hidden flex items-center justify-center gap-2 h-11 rounded-xl bg-brand-primary text-white text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-brand-primary/90 hover:shadow-[0_8px_20px_-6px_rgba(249,115,22,0.5)] active:scale-[0.98]"
              >
                {justAdded ? (
                  <>
                    <Check size={16} strokeWidth={2.5} className="animate-in zoom-in duration-200" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} className="transition-transform duration-300 group-hover/btn:-rotate-12 group-hover/btn:scale-110" />
                    <span>Add to Cart</span>
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-[150%] skew-x-12" />
                  </>
                )}
              </button>
            )}
            {/* View Cart / Checkout button — only visible when item is in cart */}
            {quantity > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl border border-brand-primary/30 bg-brand-primary/5 text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:bg-brand-primary/10 active:scale-[0.98] transition-all"
              >
                <ShoppingCart size={12} />
                <span>View Cart & Checkout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
