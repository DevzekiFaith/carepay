"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Shield, Star, Zap, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ErrorAlert from "@/app/components/ErrorAlert";

import { toast } from "sonner";

export default function SubscriptionPage() {
  const [currentTier, setCurrentTier] = useState<'plus' | 'pro' | 'elite'>('plus');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<'lagos' | 'abuja' | 'ph' | 'enugu' | 'ogun'>('lagos');
  const [paymentPeriod, setPaymentPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setCurrentTier(profile?.subscription_tier || 'basic');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpgrade = async (tier: 'plus' | 'pro' | 'elite') => {
    try {
      setUpgrading(tier);
      setError(null);
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        setError("Please log in to upgrade.");
        return;
      }

      // 1. Update Profile Tier
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 2. Log Subscription (Expires in 30 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          tier: tier,
          status: 'active',
          expires_at: expiresAt.toISOString()
        });

      if (subError) throw subError;

      setCurrentTier(tier);
      toast.success(`Welcome to HomeCare ${tier.toUpperCase()}! Your benefits are now active.`, {
        description: "Your subscription has been activated successfully."
      });
    } catch (err: any) {
      setError(`Upgrade failed: ${err.message}`);
      toast.error(`Upgrade failed: ${err.message}`);
    } finally {
      setUpgrading(null);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } } };

  // State-specific pricing configuration
  const statePricing = {
    lagos: { plus: 25000, pro: 45000, elite: 200000 },
    abuja: { plus: 22000, pro: 40000, elite: 180000 },
    ph: { plus: 20000, pro: 38000, elite: 175000 },
    enugu: { plus: 18000, pro: 35000, elite: 150000 },
    ogun: { plus: 18000, pro: 35000, elite: 150000 },
  };

  const stateNames = {
    lagos: 'Lagos State',
    abuja: 'FCT Abuja',
    ph: 'Rivers State (PH)',
    enugu: 'Enugu State',
    ogun: 'Ogun State',
  };

  const currentPricing = statePricing[selectedState];

  // Calculate pricing based on payment period
  const getDiscountedPrice = (basePrice: number) => {
    switch (paymentPeriod) {
      case 'quarterly':
        return Math.round(basePrice * 3 * 0.9); // 10% discount for quarterly
      case 'annual':
        return Math.round(basePrice * 12 * 0.8); // 20% discount for annual
      default:
        return basePrice;
    }
  };

  const getPeriodLabel = () => {
    switch (paymentPeriod) {
      case 'quarterly':
        return 'quarterly';
      case 'annual':
        return 'annually';
      default:
        return 'monthly';
    }
  };

  const adjustedPricing = {
    plus: getDiscountedPrice(currentPricing.plus),
    pro: getDiscountedPrice(currentPricing.pro),
    elite: getDiscountedPrice(currentPricing.elite),
  };

  if (loading && !upgrading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background px-4 py-8 text-foreground antialiased overflow-hidden">
      {/* Ambience */}
      <div className="absolute inset-x-0 -top-[10%] -z-10 h-[40%] w-full rounded-full bg-brand-primary/10 opacity-60 blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <header className="mb-6 sm:mb-8 flex flex-col items-center text-center gap-4 pb-6">
          <Link href="/customer/dashboard" className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-primary transition-colors absolute left-0 top-0">
            <ArrowLeft size={12} /> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="mt-8 sm:mt-12">
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-gradient-primary">
              HomeCare Tiers
            </h1>
            <p className="mt-2 text-[11px] sm:text-sm text-zinc-400 font-medium max-w-md mx-auto leading-relaxed">
              Choose your location for state-specific pricing and unlock premium benefits.
            </p>
          </div>
          
          {/* State Selector */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {Object.entries(stateNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedState(key as any)}
                className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${
                  selectedState === key
                    ? 'bg-brand-primary text-background shadow-premium'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-foreground hover:border-white/20'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Payment Period Selector */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              { value: 'monthly' as const, label: 'Monthly', discount: '' },
              { value: 'quarterly' as const, label: 'Quarterly', discount: 'Save 10%' },
              { value: 'annual' as const, label: 'Annual', discount: 'Save 20%' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setPaymentPeriod(period.value)}
                className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${
                  paymentPeriod === period.value
                    ? 'bg-brand-primary text-background shadow-premium'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-foreground hover:border-white/20'
                }`}
              >
                {period.label}
                {period.discount && (
                  <span className="ml-1 text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    {period.discount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        <ErrorAlert 
          error={error} 
          onClear={() => setError(null)} 
          className="mb-6 sm:mb-8 max-w-xl mx-auto"
        />

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mt-8 sm:mt-12">
          
          {/* Plus Tier */}
          <motion.div variants={itemVariants} className={`glass-panel p-6 sm:p-8 shadow-premium flex flex-col relative ${currentTier === 'plus' ? 'border-brand-primary/20 bg-brand-primary/5' : ''}`}>
            <h3 className="text-base sm:text-lg font-bold text-foreground">HomeCare Plus</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Essential coverage</p>
            <div className="my-6">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">₦{(adjustedPricing.plus / 1000).toFixed(0)}k</span>
              <span className="text-zinc-500 text-[10px] sm:text-xs">/ {getPeriodLabel()}</span>
            </div>
            <ul className="space-y-4 flex-1 mb-8">
              {[
                "Reduced 7.5% convenience fee",
                "1 Free Routine Call-Out /mo",
                "Standard matching speed",
                "Surge pricing capped at 2x",
                "Priority support",
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-400 items-start">
                  <Check size={16} className="text-zinc-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleUpgrade('plus')}
              disabled={currentTier === 'plus' || !!upgrading}
              className={`w-full rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 h-12 text-xs font-bold uppercase tracking-widest text-foreground transition-colors disabled:opacity-50 flex items-center justify-center`}
            >
              {upgrading === 'plus' ? <Loader2 className="animate-spin" size={16} /> : currentTier === 'plus' ? "Current Plan" : "Select Plus"}
            </button>
          </motion.div>

          {/* Pro Tier (Popular) */}
          <motion.div variants={itemVariants} className={`glass-panel p-6 sm:p-8 shadow-[0_0_30px_rgba(249,115,22,0.15)] border-brand-primary/50 relative flex flex-col transform md:-translate-y-4 ${currentTier === 'pro' ? 'border-brand-primary shadow-[0_0_40px_rgba(249,115,22,0.3)] bg-brand-primary/5' : ''}`}>
            <div className="absolute top-0 right-0 w-full h-full bg-brand-primary/5 blur-xl pointer-events-none" />
            <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center z-20">
              <span className="bg-brand-primary text-background text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-premium">
                Most Popular
              </span>
            </div>
            
            <h3 className="text-base sm:text-lg font-bold text-brand-primary relative z-10">HomeCare Pro</h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 relative z-10">For busy professionals</p>
            <div className="my-6 relative z-10">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">₦{(adjustedPricing.pro / 1000).toFixed(0)}k</span>
              <span className="text-zinc-400 text-[10px] sm:text-xs">/ {getPeriodLabel()}</span>
            </div>
            <ul className="space-y-4 flex-1 mb-8 relative z-10">
              {[
                { text: "Zero platform convenience fees", icon: Shield },
                { text: "2 Free Routine Call-Outs /mo", icon: Star },
                { text: "Priority matching (3x faster)", icon: Zap },
                { text: "Surge pricing capped at 1.5x", icon: Zap },
                { text: "Same-day guarantee for urgent requests", icon: Zap },
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-xs sm:text-sm text-zinc-200 items-start">
                  <feature.icon size={14} className="text-brand-primary shrink-0 mt-0.5 sm:mt-1 sm:size-4" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleUpgrade('pro')}
              disabled={currentTier === 'pro' || currentTier === 'elite' || !!upgrading}
              className={`btn-minimal relative z-10 w-full rounded-full px-6 h-12 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center disabled:opacity-50`}
            >
              {upgrading === 'pro' ? <Loader2 className="animate-spin" size={16} /> : currentTier === 'pro' ? "Current Plan" : currentTier === 'elite' ? "Included" : "Upgrade to Pro"}
            </button>
          </motion.div>

          {/* Elite Tier */}
          <motion.div variants={itemVariants} className={`glass-panel p-6 sm:p-8 shadow-premium border-white/10 relative flex flex-col ${currentTier === 'elite' ? 'border-brand-primary/50 bg-brand-primary/5 shadow-[0_0_30px_rgba(249,115,22,0.15)]' : ''}`}>
            <h3 className="text-base sm:text-lg font-bold text-foreground">HomeCare Elite</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Facility management level</p>
            <div className="my-6">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground tracking-tight">₦{(adjustedPricing.elite / 1000).toFixed(0)}k</span>
              <span className="text-zinc-500 text-[10px] sm:text-xs">/ {getPeriodLabel()}</span>
            </div>
            <ul className="space-y-4 flex-1 mb-8">
              {[
                { text: "Zero surge pricing ever", icon: Shield },
                { text: "Dedicated 24/7 Account Manager", icon: Shield },
                { text: "Matched with top 5% Artisans only", icon: Star },
                { text: "4 Free routine sweeps /mo", icon: Shield },
                { text: "Unlimited emergency calls", icon: Zap },
                { text: "Preferred vendor pricing", icon: Star },
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-xs sm:text-sm text-zinc-400 items-start">
                  <feature.icon size={14} className="text-zinc-200 shrink-0 mt-0.5 sm:mt-1 sm:size-4" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleUpgrade('elite')}
              disabled={currentTier === 'elite' || !!upgrading}
              className={`w-full rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-6 h-12 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center`}
            >
              {upgrading === 'elite' ? <Loader2 className="animate-spin" size={16} /> : currentTier === 'elite' ? "Current Plan" : "Upgrade to Elite"}
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
