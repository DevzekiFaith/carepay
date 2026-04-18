"use client";

import Image from "next/image";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { Product } from "@/lib/products";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onBuy?: (product: Product) => void;
  onAddStep?: (product: Product) => void;
  isAdded?: boolean;
}

export default function ProductCard({ 
  product, 
  onBuy, 
  onAddStep,
  isAdded 
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col rounded-2xl border border-white/10 dark:border-white/5 bg-background/50 p-3 transition-all hover:bg-background/80 hover:border-brand-primary/30 shadow-premium overflow-hidden"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[8px] font-bold uppercase tracking-widest text-zinc-300">
          {product.category}
        </div>
      </div>

      <div className="mt-4 flex flex-col flex-1">
        <h3 className="text-xs font-bold text-foreground group-hover:text-brand-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <p className="text-sm font-extrabold text-foreground">
            <span className="text-brand-primary text-[10px] mr-0.5 font-bold">₦</span>
            {product.price.toLocaleString()}
          </p>
          
          <div className="flex gap-2">
            {onAddStep && (
              <button
                onClick={() => onAddStep(product)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                  isAdded 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" 
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-brand-primary/50 hover:text-brand-primary hover:bg-brand-primary/10"
                }`}
                title={isAdded ? "Added to booking" : "Add to booking"}
              >
                {isAdded ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
              </button>
            )}
            
            {onBuy && (
              <button
                onClick={() => onBuy(product)}
                className="flex h-8 px-3 items-center justify-center rounded-lg bg-brand-primary text-background text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
              >
                Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
