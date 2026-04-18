"use client";

import { useState } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import ProductCard from "@/app/components/ProductCard";
import { Search, ShoppingBag, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const router = useRouter();
  const supabase = createClient();

  const categories = ["All", "Plumbing", "Electrical", "Carpentry", "General"];

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuy = async (product: Product) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required", {
        description: "Please login to purchase items from the store."
      });
      router.push("/auth/login?returnTo=/store");
      return;
    }

    // Check wallet balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!wallet || wallet.balance < product.price) {
      toast.error("Insufficient Balance", {
        description: `Your balance (₦${(wallet?.balance || 0).toLocaleString()}) is not enough. Please fund your wallet.`,
        action: {
          label: "Fund Wallet",
          onClick: () => router.push("/customer/wallet")
        }
      });
      return;
    }

    // Direct purchase logic (Debit wallet)
    try {
      // In a real app, this would be a server action or a transaction
      const { error: debitError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - product.price })
        .eq('user_id', user.id);

      if (debitError) throw debitError;

      await supabase.from('transactions').insert({
        wallet_id: (await supabase.from('wallets').select('id').eq('user_id', user.id).single()).data?.id,
        amount: product.price,
        transaction_type: 'debit',
        description: `Purchased: ${product.name}`,
        status: 'success'
      });

      toast.success("Purchase Successful!", {
        description: `${product.name} has been paid for. Our team will contact you for delivery.`
      });
    } catch (err) {
      toast.error("Purchase failed", { description: "An error occurred during transaction." });
    }
  };

  const handleAddToJob = (product: Product) => {
    toast.success("Added to recommendation", {
      description: `You can now select ${product.name} when booking a service.`
    });
    router.push(`/request?part=${product.id}`);
  };

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
                Premium parts and fittings curated for professional installations. High-quality imports with a satisfaction guarantee.
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="glass-panel px-4 py-2 flex items-center gap-3">
                  <ShoppingBag size={18} className="text-brand-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">Quality Guaranteed</span>
               </div>
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === category
                    ? "bg-brand-primary text-background shadow-lg shadow-brand-primary/20"
                    : "glass-panel glass-panel-hover text-zinc-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={handleBuy}
                onAddStep={handleAddToJob}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500 font-medium">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
