"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, ExternalLink, AlertCircle, CheckCircle2, Navigation, ClipboardList, Check } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/app/components/Logo";

// Types
interface ServiceRequest {
  id: string;
  created_at: string;
  service_type: string;
  description: string;
  address: string;
  preferred_time: string | null;
  status: string;
  image_url: string | null;
  assigned_worker_id: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } },
};

export default function WorkerDashboardPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'my-jobs'>('radar');
  const [user, setUser] = useState<any>(null);

  const fetchRequests = async () => {
    try {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      const { data, error: fetchError } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setRequests(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Set up Realtime Subscription
    const supabase = createClient();
    const channel = supabase
      .channel('worker-radar')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'service_requests',
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const newJob = payload.new as ServiceRequest;
            setRequests((prev) => [newJob, ...prev]);
            toast.info("New Job Nearby!", {
              description: `${newJob.service_type} requested in ${newJob.address.split(',')[0]}`,
              action: {
                label: "View Radar",
                onClick: () => setActiveTab('radar')
              }
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedJob = payload.new as ServiceRequest;
            setRequests((prev) =>
              prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setRequests((prev) => prev.filter((job) => job.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleAcceptJob = async (jobId: string) => {
    if (!user) return;
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("service_requests")
        .update({ 
          assigned_worker_id: user.id,
          status: 'in_progress' 
        })
        .eq('id', jobId);

      if (updateError) throw updateError;
      
      toast.success("Job Claimed!", {
        description: "Moving to your active jobs list."
      });
      fetchRequests();
      setActiveTab('my-jobs');
    } catch (err: any) {
      toast.error("Failed to claim job", { description: err.message });
    }
  };

  const handleCompleteJob = async (jobId: string) => {
     try {
       const supabase = createClient();
       const { error: updateError } = await supabase
         .from("service_requests")
         .update({ status: 'completed' })
         .eq('id', jobId);
 
       if (updateError) throw updateError;
       
       toast.success("Job Completed!", {
         description: "Well done, Pro! Earnings updated."
       });
       fetchRequests();
     } catch (err: any) {
       toast.error("Update failed", { description: err.message });
     }
  };

  const radarJobs = requests.filter(r => r.status === 'pending' || r.status === 'new' || !r.assigned_worker_id);
  const myActiveJobs = requests.filter(r => r.assigned_worker_id === user?.id && r.status === 'in_progress');
  const displayJobs = activeTab === 'radar' ? radarJobs : myActiveJobs;

  return (
    <div className="relative min-h-screen bg-background px-4 py-8 text-foreground antialiased overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[50%] w-full rounded-full bg-brand-primary/5 opacity-50 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-4">
            <Logo size="md" />
            <div>
              <h1 className="text-3xl font-heading font-extrabold tracking-tight text-gradient-primary">
                Pro Center
              </h1>
              <p className="mt-1 text-sm text-zinc-400 font-medium whitespace-pre-wrap">
                Accept live requests and preview customer defect photos before deploying.
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right text-xs text-zinc-500">
            <p className="font-bold text-foreground">Worker Profile</p>
            <p className="uppercase tracking-widest mt-1 text-[10px]">Verified Professional</p>
            <span className="mt-2 inline-flex h-6 items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 text-[9px] font-bold uppercase tracking-widest text-emerald-500 shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)]">
              Radar Active
            </span>
          </div>
        </header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Earnings stats */}
          <div className="grid gap-4 sm:grid-cols-3">
             {/* ... same stats as before ... */}
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium border-brand-primary/20">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-primary">This week</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">₦45,000</p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium">
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Jobs completed</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">
                {requests.filter(r => r.status === 'completed' && r.assigned_worker_id === user?.id).length}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium">
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Rating</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground tracking-tighter">4.9<span className="text-brand-primary ml-1 text-2xl">★</span></p>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full sm:w-fit">
            <button 
              onClick={() => setActiveTab('radar')}
              className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'radar' ? 'bg-brand-primary text-background' : 'text-zinc-500 hover:text-foreground'}`}
            >
              <Navigation size={14} /> Area Radar
            </button>
            <button 
              onClick={() => setActiveTab('my-jobs')}
              className={`flex-1 sm:flex-none flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'my-jobs' ? 'bg-brand-primary text-background' : 'text-zinc-500 hover:text-foreground'}`}
            >
              <ClipboardList size={14} /> My Active Jobs 
              {myActiveJobs.length > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[9px]">{myActiveJobs.length}</span>}
            </button>
          </div>

          {/* Jobs Feed */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium">
             <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
               <div className="flex items-center gap-3">
                 {activeTab === 'radar' ? (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                    </span>
                 ) : (
                    <ClipboardList size={16} className="text-brand-primary" />
                 )}
                 <h2 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                    {activeTab === 'radar' ? 'Incoming Request Radar' : 'Your Ongoing Projects'}
                 </h2>
               </div>
               <span className="rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                 {displayJobs.length} Total
               </span>
             </div>

             <div className="divide-y divide-white/5">
               {loading ? (
                 <div className="py-12 flex flex-col items-center justify-center text-zinc-500">
                   <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-primary border-t-transparent mb-4" />
                   <p className="text-xs font-medium">Updating boards...</p>
                 </div>
               ) : error ? (
                 <div className="py-6 flex flex-col items-center justify-center text-red-400">
                   <AlertCircle size={24} className="mb-2 opacity-50" />
                   <p className="text-xs font-bold uppercase tracking-widest">Connection Error</p>
                   <p className="text-xs text-red-500/70 mt-1 text-center">{error}</p>
                 </div>
               ) : displayJobs.length === 0 ? (
                 <div className="py-12 flex flex-col items-center justify-center text-zinc-500">
                   <CheckCircle2 size={32} className="mb-3 opacity-20" />
                   <p className="text-sm font-bold text-foreground">
                      {activeTab === 'radar' ? 'Radar is empty' : 'You have no active jobs'}
                   </p>
                   <p className="text-xs mt-1">
                      {activeTab === 'radar' ? 'Leave your radar on to get notified instantly.' : 'Claim a job from the radar to get started.'}
                   </p>
                 </div>
               ) : (
                 <AnimatePresence mode="wait">
                   {displayJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col sm:flex-row gap-5 py-5 transition-colors group"
                    >
                      {/* Photo Thumbnail */}
                      {job.image_url ? (
                        <div 
                          className="relative w-full sm:w-28 aspect-video sm:aspect-square rounded-xl overflow-hidden shrink-0 cursor-pointer border border-white/10 group/img shadow-md bg-black/20"
                          onClick={() => setLightboxImage(job.image_url!)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={job.image_url} 
                            alt="Issue thumbnail" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
                          />
                          <div className="absolute inset-0 bg-brand-primary/80 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <ExternalLink size={16} className="text-white drop-shadow-md" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col w-full sm:w-28 aspect-video sm:aspect-square items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 shrink-0">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">No Photo</p>
                        </div>
                      )}

                      {/* Job Info */}
                      <div className="flex-1 space-y-1 w-full flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors">
                              {job.service_type}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                              {job.address.slice(0, 30)}{job.address.length > 30 ? '...' : ''}
                            </p>
                          </div>
                          <span className={`inline-flex h-6 items-center rounded-full border px-3 text-[9px] font-bold uppercase tracking-widest ${
                            job.status === 'pending' || job.status === 'new'
                              ? 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary'
                              : 'border-white/10 bg-white/5 text-zinc-400'
                          }`}>
                            {job.status || 'New'}
                          </span>
                        </div>
                        
                        <p className="text-xs text-zinc-400 font-medium pt-1">
                          {new Date(job.created_at).toLocaleDateString()} at {new Date(job.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-2 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                          "{job.description}"
                        </p>
                        
                        <div className="flex justify-between items-center mt-auto pt-4">
                            <div>
                                <p className="text-[11px] font-extrabold tracking-widest text-brand-primary">₦15,000</p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mt-0.5">Base Call-Out</p>
                            </div>
                            {activeTab === 'radar' ? (
                                <button 
                                  onClick={() => handleAcceptJob(job.id)}
                                  className="btn-minimal h-9 px-6 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] shadow-premium hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
                                >
                                  Accept Job
                                </button>
                            ) : (
                                <button 
                                  onClick={() => handleCompleteJob(job.id)}
                                  className="flex items-center gap-2 h-9 px-6 bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.15em] shadow-premium hover:bg-emerald-600 transition-all"
                                >
                                  <Check size={14} /> Mark Complete
                                </button>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.section>
        </motion.main>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 sm:p-12" 
            onClick={() => setLightboxImage(null)}
          >
            <button 
              className="absolute top-6 right-6 sm:top-8 sm:right-8 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-primary hover:text-white transition-colors shadow-premium backdrop-blur-md"
              onClick={() => setLightboxImage(null)}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               className="relative max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/10 bg-black"
               onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={lightboxImage} 
                alt="Enlarged issue detail" 
                className="w-full h-full object-contain max-h-[90vh]" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
