"use client";

import { motion } from "framer-motion";

const DEMO_JOBS = [
  {
    id: "JOB-1024",
    type: "Plumbing",
    customer: "Mrs. Adebayo",
    area: "Ikeja",
    time: "Today · 4:00 PM",
    status: "New",
    price: "₦12,000",
  },
  {
    id: "JOB-1025",
    type: "Electrical",
    customer: "Chinedu Okafor",
    area: "Yaba",
    time: "Tomorrow · 11:30 AM",
    status: "Scheduled",
    price: "₦18,000",
  },
];

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
  return (
    <div className="relative min-h-screen bg-background px-4 py-8 text-foreground antialiased overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[50%] w-full rounded-full bg-brand-primary/5 opacity-50 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Pro Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-heading font-extrabold tracking-tight text-gradient-primary">
              Your Jobs & Earnings
            </h1>
            <p className="mt-1 text-sm text-zinc-400 font-medium">
              Manage your jobs, track earnings, and grow your business.
            </p>
          </div>
          <div className="text-left sm:text-right text-xs text-zinc-500">
            <p className="font-bold text-foreground">Ibrahim Adewale</p>
            <p className="uppercase tracking-widest mt-1 text-[10px]">Enugu • Plumber</p>
            <span className="mt-2 inline-flex h-6 items-center rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 text-[9px] font-bold uppercase tracking-widest text-brand-primary shadow-[0_0_10px_-2px_rgba(249,115,22,0.3)]">
              Authorized Pro
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
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium border-brand-primary/20">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-primary">This week</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">₦45,000</p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium">
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Jobs completed</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">8</p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium">
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Rating</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground tracking-tighter">4.8<span className="text-brand-primary ml-1 text-2xl">★</span></p>
            </motion.div>
          </div>

          {/* Upcoming jobs */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Upcoming jobs</h2>
              <span className="rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                2 active
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {DEMO_JOBS.map((job) => (
                <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 glass-panel-hover px-4 rounded-xl transition-colors -mx-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {job.type} <span className="text-zinc-500 font-normal">in {job.area}</span>
                    </p>
                    <p className="text-xs font-medium text-zinc-400">
                      {job.customer} • {job.time}
                    </p>
                    <p className="text-[11px] font-extrabold tracking-widest text-brand-primary">{job.price}</p>
                  </div>
                  <span className="inline-flex self-start sm:self-center h-6 items-center rounded-full border border-white/10 bg-background/50 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Quick actions */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium">
            <h3 className="mb-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">Quick actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-minimal inline-flex shrink-0 h-10 items-center justify-center rounded-full px-6 text-xs font-bold uppercase tracking-widest">
                Set availability
              </button>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 dark:border-white/5 bg-background/50 backdrop-blur-sm px-6 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                Support Hub
              </a>
            </div>
          </motion.section>

          {/* Earnings breakdown */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium border border-brand-primary/20 bg-gradient-to-br from-background/50 to-brand-primary/5">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary mb-4">
              Earnings this month
            </h3>
            <div className="space-y-3 text-xs font-semibold text-zinc-400">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Completed jobs</span>
                <span className="font-bold text-foreground">32</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Total earned</span>
                <span className="font-extrabold text-foreground text-sm">₦180,000</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Avg per job</span>
                <span className="font-bold text-foreground">₦5,625</span>
              </div>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-l-2 border-brand-primary/30 pl-3">
              Payouts are processed weekly. Ensure your settlement accounts are ready by every Thursday midnight.
            </p>
          </motion.section>
        </motion.main>
      </div>
    </div>
  );
}
