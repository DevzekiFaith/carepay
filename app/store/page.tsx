"use client";

import { useState, useMemo } from "react";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/app/components/ProductCard";
import {
  Search,
  ShoppingCart,
  ArrowLeft,
  SlidersHorizontal,
  ArrowUpDown,
  Package,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "newest";

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const { cartCount, cartTotal, setIsCartOpen } = useCart();

  const categories = ["All", "Plumbing", "Electrical", "Carpentry", "General"];

  const filteredProducts = useMemo(() => {
    let results = PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case "price-asc":
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results = [...results].sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        break;
      case "newest":
        results = [...results].sort((a, b) =>
          (a.badge === "New" ? -1 : 1) - (b.badge === "New" ? -1 : 1)
        );
        break;
    }

    return results;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased py-8 sm:py-20 overflow-hidden px-4 sm:px-0">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 -top-[20%] -z-10 h-[60%] w-full rounded-full bg-brand-primary/5 opacity-40 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-brand-primary transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-gradient-primary">
                HomeCare Store
              </h1>
              <p className="mt-2 text-sm sm:text-lg text-zinc-400 font-medium max-w-2xl leading-relaxed">
                Premium parts and fittings curated for professional
                installations. Browse, add to cart, and checkout — no account
                needed.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass-panel px-4 py-2 flex items-center gap-3">
                <Package size={16} className="text-brand-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {PRODUCTS.length} Products
                </span>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-background text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
              >
                <ShoppingCart size={16} />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[9px] font-extrabold ring-2 ring-background">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Filters, Search, Sort */}
        <div className="mb-10 space-y-4">
          {/* Category pills + Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    selectedCategory === category
                      ? "bg-brand-primary text-background shadow-lg shadow-brand-primary/20"
                      : "glass-panel glass-panel-hover text-zinc-400"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <ArrowUpDown size={12} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent outline-none text-foreground cursor-pointer appearance-none pr-4"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search premium parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 pl-12 pr-6 py-3.5 text-sm text-foreground outline-none focus:border-brand-primary transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500 font-medium">
              No products found matching your search.
            </p>
          </div>
        )}

        {/* Floating Cart Summary Bar (Mobile) */}
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-20 left-4 right-4 z-[55] md:hidden"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-brand-primary text-background shadow-[0_0_30px_rgba(249,115,22,0.3)]"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
                </span>
              </div>
              <span className="text-sm font-extrabold">
                ₦{cartTotal.toLocaleString()}
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
