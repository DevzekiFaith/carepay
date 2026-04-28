"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Plus, Check, Minus, Star, ShoppingBag } from "lucide-react";
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

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/10 dark:border-white/5 bg-background/50 p-3 transition-all hover:bg-background/80 hover:border-brand-primary/30 shadow-premium">
      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border backdrop-blur-md ${
            product.badge === "Best Seller"
              ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
              : product.badge === "New"
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : product.badge === "Hot Deal"
              ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
              : "bg-violet-500/20 border-violet-500/40 text-violet-400"
          }`}
        >
          {product.badge}
        </div>
      )}

      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5 shrink-0 flex items-center justify-center">
          {!imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-zinc-700">
              <ShoppingBag size={48} strokeWidth={1} />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Image Pending</span>
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[8px] font-bold uppercase tracking-widest text-zinc-300">
            {product.category}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-xs font-bold text-foreground group-hover:text-brand-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={10}
                    className={
                      star <= Math.round(product.rating!)
                        ? "text-amber-400 fill-amber-400"
                        : "text-zinc-600"
                    }
                  />
                ))}
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Stock indicator */}
          {product.stock !== undefined && product.stock <= 20 && (
            <p className="mt-1.5 text-[9px] font-bold text-rose-400 uppercase tracking-widest">
              Only {product.stock} left!
            </p>
          )}
        </div>
      </div>

      {/* Price and Actions pinned to bottom */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <p suppressHydrationWarning className="text-sm font-extrabold text-foreground mb-3">
          <span className="text-brand-primary text-[10px] mr-0.5 font-bold">
            ₦
          </span>
          {product.price.toLocaleString()}
        </p>

        {/* Booking flow button — shown on request page */}
        {onAddStep && (
          <button
            onClick={() => onAddStep(product)}
            className={`w-full flex items-center justify-center gap-2 h-9 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-widest mb-2 ${
              isAdded
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
                : "border-white/10 bg-white/5 text-zinc-400 hover:border-brand-primary/50 hover:text-brand-primary hover:bg-brand-primary/10"
            }`}
          >
            {isAdded ? (
              <>
                <Check size={12} strokeWidth={3} /> Added to Job
              </>
            ) : (
              <>
                <Plus size={12} /> Add to Job
              </>
            )}
          </button>
        )}

        {/* Cart Controls — always visible */}
        <div className="flex items-center gap-2">
          {quantity > 0 ? (
            <div className="flex items-center flex-1 w-full relative">
              <div className="flex items-center w-full justify-between rounded-xl border border-brand-primary/30 bg-brand-primary/5 p-1">
                <button
                  onClick={() =>
                    quantity === 1
                      ? removeFromCart(product.id)
                      : updateQuantity(product.id, quantity - 1)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-zinc-400 hover:text-rose-400 transition-all shadow-sm"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="text-xs font-bold text-foreground select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-background hover:bg-brand-primary/90 transition-all shadow-sm"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-brand-primary text-background text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
