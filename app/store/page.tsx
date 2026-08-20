"use client";

import { useState, useMemo } from "react";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/app/components/ProductCard";
import {
  Search,
  ShoppingCart,
  ArrowLeft,
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

  const categories = [
    "All",
    "Smart Security",
    "Smart Climate",
    "Smart Cleaning",
    "Smart Lighting",
    "Smart Kitchen",
    "Smart Automation"
  ];

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
    <div className="relative min-h-screen bg-slate-50 text-slate-900 antialiased overflow-hidden">
      {/* Royal Blue Hero Banner */}
      <section className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-blue-800 text-white pt-12 pb-16 md:pb-20 px-6 rounded-b-[40px] md:rounded-b-[50px] shadow-2xl shadow-blue-900/15 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-300/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-sky-200 hover:text-white transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-sky-200 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-block mb-3">
                Grade A Smart Home Appliances · Direct China Sourcing
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
                HomeCare <span className="text-cyan-200">Smart Store</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-sky-100/90 font-medium max-w-2xl leading-relaxed">
                Premium IoT appliances, robotic vacuums, biometric security, and climate automation with pro installation support.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 flex items-center gap-2.5 text-white">
                <Package size={16} className="text-cyan-300" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-100">
                  {PRODUCTS.length} Products
                </span>
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-sky-400 hover:bg-sky-300 text-blue-950 text-[11px] font-extrabold uppercase tracking-widest transition-all shadow-lg shadow-sky-400/25 hover:scale-105"
              >
                <ShoppingCart size={16} />
                {cartCount > 0 ? (
                  <span>Cart · ₦{cartTotal.toLocaleString()}</span>
                ) : (
                  <span>Cart</span>
                )}
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[9px] font-extrabold ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Store Catalog Content */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-12 py-8 sm:py-10 pb-36 relative z-10 space-y-6">
          {/* Category pills + Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap gap-2 scrollbar-none">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest transition-all shrink-0 cursor-pointer ${
                    selectedCategory === category
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/25 scale-105"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:bg-sky-50 shadow-xs"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Sort */}
              <div className="relative w-full sm:w-auto">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-[11px] font-bold uppercase tracking-widest text-slate-700 shadow-xs">
                  <ArrowUpDown size={13} className="text-sky-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent outline-none text-slate-800 cursor-pointer appearance-none pr-4 text-xs"
                  >
                    <option value="default">Default Sorting</option>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              type="text"
              placeholder="Search smart locks, fans, bulbs, switches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white pl-12 pr-6 py-3 sm:py-3.5 text-sm text-slate-800 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 shadow-xs transition-all"
            />
          </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 12} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 p-8">
            <p className="text-slate-500 font-medium">
              No products found matching your search.
            </p>
          </div>
        )}

        {/* Floating Cart Summary Bar (Mobile) */}
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-24 left-4 right-4 z-[55] md:hidden"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold">₦{cartTotal.toLocaleString()}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Checkout →</span>
              </div>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
