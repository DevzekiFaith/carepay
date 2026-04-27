"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Image as ImageIcon, Loader2, Shield, Star, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/app/components/Logo";
import dynamic from "next/dynamic";
import { X, MessageCircle, Navigation } from "lucide-react";

const LiveMap = dynamic(() => import("@/app/components/LiveMap"), { ssr: false });
const ChatModal = dynamic(() => import("@/app/components/ChatModal"), { ssr: false });

interface Request {
  id: string;
  customer_id: string;
  service_type: string;
  description: string;
  status: string;
  created_at: string;
  image_url: string | null;
  address: string;
}

interface Order {
  id: string;
  order_ref: string;
  items: any[];
  total: number;
  status: string;
  created_at: string;
  delivery_address: string;
}

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } } };

export default function CustomerDashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [tier, setTier] = useState<'basic' | 'pro' | 'elite'>('basic');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'orders'>('requests');
  const [trackingJob, setTrackingJob] = useState<Request | null>(null);
  const [chatJob, setChatJob] = useState<Request | null>(null);
  const isFetchingRef = useRef(false);
  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      if (!isSilent) setLoading(true);
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      if (!currentUser) return;
      setUser(currentUser);

      // 1. Fetch Requests
      const { data: reqData } = await supabase
        .from('service_requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
      
      setRequests(reqData || []);

      // 1b. Fetch Store Orders
      const { data: orderData } = await supabase
        .from('store_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setOrders(orderData || []);

      // 2. Fetch or Create Wallet Balance (Non-destructive)
      let { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!wallet) {
        // Create only if missing
        const { data: newWallet } = await supabase
          .from('wallets')
          .insert({ user_id: user.id, balance: 0 })
          .select('balance')
          .single();
        wallet = newWallet;
      }
      
      if (wallet) setBalance(Number(wallet.balance));

      // 3. Fetch Profile Tier
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile) setTier(profile.subscription_tier || 'basic');

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();

    // Set up Realtime Subscription
    const channel = supabase
      .channel('customer-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'service_requests',
        },
        async (payload: any) => {
          const updatedReq = payload.new as Request;
          // Check if this update is for the current customer (safety check)
          const { data } = await supabase.auth.getUser();
      const user = data.user;
          if (user && updatedReq.customer_id === user.id) {
             // Show contextual toasts
             if (payload.old.status !== 'in_progress' && updatedReq.status === 'in_progress') {
                toast.success("Pro matched!", {
                  description: `A professional has accepted your ${updatedReq.service_type} request.`
                });
             } else if (payload.old.status !== 'completed' && updatedReq.status === 'completed') {
                toast.success("Job Completed!", {
                  description: `Your ${updatedReq.service_type} request is marked as finished.`,
                  icon: <CheckCircle2 className="text-emerald-500" />
                });
             }
             fetchData(true);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
        },
        async (payload: any) => {
          const updatedWallet = payload.new;
          const { data } = await supabase.auth.getUser();
          if (data.user && updatedWallet.user_id === data.user.id) {
             setBalance(Number(updatedWallet.balance));
             // Optional contextual toast if balance increased
             if (payload.old && Number(updatedWallet.balance) > Number(payload.old.balance)) {
                 toast.success("Wallet Credited!", {
                   description: `Your balance is now ₦${Number(updatedWallet.balance).toLocaleString()}`,
                   icon: <CheckCircle2 className="text-emerald-500" />
                 });
             }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, supabase]);

  return (
    <div className="relative min-h-screen bg-background px-4 py-8 text-foreground antialiased overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[50%] w-full rounded-full bg-brand-primary/5 opacity-50 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10 px-2 sm:px-0">
        <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-4">
            <Logo size="sm" />
            <div>
               <div className="flex items-center gap-2">
                 <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-gradient-primary">
                   Welcome back
                 </h1>
                 <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[7px] sm:text-[8px] font-bold uppercase tracking-wider ${
                   tier === 'elite' ? 'bg-zinc-100 text-black' : 
                   tier === 'pro' ? 'bg-brand-primary text-background' : 
                   'bg-white/5 text-zinc-500 border border-white/10'
                 }`}>
                   {tier === 'elite' && <Shield size={8} />}
                   {tier === 'pro' && <Zap size={8} />}
                   {tier}
                 </span>
               </div>
               <p className="mt-1 text-[11px] sm:text-sm text-zinc-400 font-medium leading-relaxed">
                 Track your requests, see your history, and manage your account.
               </p>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end text-[10px] sm:text-xs text-zinc-500 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
            <p className="font-bold text-foreground capitalize">{tier} {tier !== 'basic' ? 'Member' : 'User'}</p>
            <p className="uppercase tracking-widest sm:mt-1 text-[8px] sm:text-[9px] font-bold bg-white/5 sm:bg-transparent px-2 py-1 sm:p-0 rounded-full">Active Profile</p>
          </div>
        </header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Wallet Summary */}
          <motion.section variants={itemVariants} className="glass-panel p-4 sm:p-6 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 border-brand-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[50px] -mr-32 -mt-32 pointer-events-none" />
            <div className="relative z-10 text-center sm:text-left">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400">Available Balance</p>
              <div className="flex items-baseline justify-center sm:justify-start gap-1">
                <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-brand-primary tracking-tight">₦{balance.toLocaleString()}</p>
                <span className="text-lg sm:text-xl text-brand-primary/50 font-heading font-bold">.00</span>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <Link href="/customer/wallet" className="btn-minimal rounded-full px-8 h-12 w-full sm:w-auto text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center">
                Fund Wallet
              </Link>
            </div>
          </motion.section>

          {/* Stats */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <motion.div variants={itemVariants} className="glass-panel p-4 sm:p-6 shadow-premium text-center sm:text-left">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-500">Total requests</p>
              <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-heading font-extrabold text-foreground">{requests.length}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium border-brand-primary/20">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-primary">Completed</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">
                {requests.filter(r => r.status?.toLowerCase() === 'completed').length}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium">
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">In progress</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">
                {requests.filter(r => r.status?.toLowerCase() !== 'completed').length}
              </p>
            </motion.div>
          </div>          {/* Quick actions */}
          <motion.section variants={itemVariants} className="glass-panel p-4 sm:p-6 shadow-premium">
            <h2 className="mb-4 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400">Quick actions</h2>
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
              <Link
                href="/request"
                className="btn-minimal inline-flex items-center justify-center rounded-full px-6 h-12 text-[10px] font-bold uppercase tracking-widest bg-brand-primary text-background sm:bg-transparent sm:text-foreground"
              >
                New request
              </Link>
              <Link
                href="/customer/subscription"
                className="inline-flex h-12 items-center justify-center rounded-full border border-brand-primary/30 bg-brand-primary/10 px-6 text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:bg-brand-primary/20 transition-colors"
              >
                Subscription Tiers
              </Link>
              <Link
                href="/inspection"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 dark:border-white/5 bg-background/50 backdrop-blur-sm px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                Property Inspection
              </Link>
            </div>
          </motion.section>

          {/* Recent requests */}
          <motion.section variants={itemVariants} className="glass-panel p-4 sm:p-6 shadow-premium">
            <div className="mb-6 border-b border-white/10 pb-4 flex items-center justify-between">
              <h2 className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                Recent requests
              </h2>
              <Link
                href="/request"
                className="text-[10px] sm:text-xs font-bold text-brand-primary hover:text-brand-glow transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="flex gap-4 mb-6 border-b border-white/5">
               <button 
                 onClick={() => setActiveTab('requests')}
                 className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                   activeTab === 'requests' ? 'text-brand-primary' : 'text-zinc-500 hover:text-zinc-300'
                 }`}
               >
                 Service Requests
                 {activeTab === 'requests' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
               </button>
               <button 
                 onClick={() => setActiveTab('orders')}
                 className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                   activeTab === 'orders' ? 'text-brand-primary' : 'text-zinc-500 hover:text-zinc-300'
                 }`}
               >
                 Product Orders
                 {activeTab === 'orders' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
               </button>
            </div>
            
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="animate-spin text-brand-primary" size={24} />
              </div>
            ) : activeTab === 'requests' ? (
              requests.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-zinc-500">
                   <p className="text-sm font-bold text-foreground">No recent requests</p>
                   <p className="text-xs mt-1">When you book a professional, it will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:py-4 sm:px-4 gap-4 glass-panel glass-panel-hover rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        {/* Photo Thumbnail */}
                        {request.image_url ? (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-black/20 overflow-hidden shrink-0 border border-white/10 group-hover:border-brand-primary/30 transition-colors pointer-events-none">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={request.image_url} alt="Uploaded issue" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-zinc-600 transition-colors">
                            <ImageIcon size={14} className="sm:size-16" />
                          </div>
                        )}
                        
                        <div className="space-y-1 overflow-hidden">
                          <p className="text-xs sm:text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors">
                            {request.service_type}
                          </p>
                          <p className="text-[10px] sm:text-xs font-medium text-zinc-400 truncate max-w-[150px] sm:max-w-xs">{request.description}</p>
                          <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-zinc-500">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
  
                        <div className="flex flex-col items-end gap-2">
                          <span className={`inline-flex shrink-0 h-6 items-center rounded-full border px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            !request.status || request.status.toLowerCase() === 'pending' || request.status.toLowerCase() === 'new'
                              ? 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary'
                              : request.status.toLowerCase() === 'completed'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                              : 'border-blue-500/30 bg-blue-500/10 text-blue-500'
                          }`}>
                            {request.status === 'in_progress' ? 'Active' : request.status || 'New'}
                          </span>
                          
                          {(request.status?.toLowerCase() === 'in_progress' || request.status?.toLowerCase() === 'active') && (
                             <div className="flex gap-2">
                               <button 
                                 onClick={() => setChatJob(request)}
                                 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-foreground flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all"
                               >
                                 <MessageCircle size={10} /> Chat
                               </button>
                               <button 
                                 onClick={() => setTrackingJob(request)}
                                 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-brand-glow flex items-center gap-1 bg-brand-primary/10 px-3 py-1.5 rounded-full border border-brand-primary/20 hover:bg-brand-primary/20 transition-all"
                               >
                                 <Navigation size={10} /> Track Pro
                               </button>
                             </div>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              )
            ) : (
              orders.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-zinc-500">
                   <p className="text-sm font-bold text-foreground">No orders yet</p>
                   <p className="text-xs mt-1">Visit the HomeCare Store to browse products.</p>
                   <Link href="/store" className="mt-4 text-xs font-bold text-brand-primary uppercase tracking-widest hover:underline">Go to Store</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 glass-panel glass-panel-hover rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 border border-brand-primary/20 text-brand-primary">
                          <ImageIcon size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-foreground">{order.order_ref}</p>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">₦{order.total.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">{order.items.length} item(s) • {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <span className={`inline-flex h-6 items-center rounded-full border px-3 text-[9px] font-bold uppercase tracking-widest ${
                          order.status === 'delivered' 
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
                            : 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <Link 
                          href={`/store/track?ref=${order.order_ref}&email=${user?.email}`}
                          className="h-8 px-4 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-foreground hover:bg-white/10 transition-all"
                        >
                          Track Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </motion.section>

          {/* Referral */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors blur-xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">Invite friends, get rewarded</h3>
                <p className="mt-1 text-xs font-medium text-zinc-400 max-w-md">
                  Share HomeCare with your network. When they book their first pro, you both receive ₦500 in service credits.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const shareText = encodeURIComponent("Check out HomeCare - elite home services!");
                  const shareUrl = window.location.origin;
                  if (navigator.share) {
                    navigator.share({ title: "HomeCare", text: shareText, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                    toast.success("Link Copied!", { description: "Send it to your friends to earn ₦500." });
                  }
                }}
                className="btn-minimal inline-flex shrink-0 h-10 items-center justify-center rounded-full px-6 text-xs font-bold uppercase tracking-widest"
              >
                Share & Get ₦500
              </button>
            </div>
          </motion.section>
        </motion.main>
      </div>

      {/* Tracking Modal */}
      <AnimatePresence>
        {trackingJob && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 sm:p-12" 
            onClick={() => setTrackingJob(null)}
          >
            <button 
              className="absolute top-6 right-6 sm:top-8 sm:right-8 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-primary hover:text-white transition-colors shadow-premium backdrop-blur-md"
              onClick={() => setTrackingJob(null)}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(249,115,22,0.15)] border border-white/10 bg-background"
               onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                 <div>
                    <h3 className="text-sm font-bold text-foreground">Live Tracking</h3>
                    <p className="text-xs text-zinc-400 mt-1">{trackingJob.service_type} • {trackingJob.address}</p>
                 </div>
                 <span className="animate-pulse flex h-3 w-3 rounded-full bg-brand-primary"></span>
              </div>
              <div className="w-full bg-black">
                 <LiveMap 
                    address={trackingJob.address}
                    trackingJobId={trackingJob.id}
                    height="60vh"
                    interactive={false}
                 />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatModal 
        isOpen={!!chatJob}
        onClose={() => setChatJob(null)}
        requestId={chatJob?.id || ""}
        title="Message Your Pro"
        subtitle={chatJob?.service_type}
      />
    </div>
  );
}
