"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const DEMO_REQUESTS = [
  {
    id: "REQ-3001",
    type: "Carpenter",
    summary: "Fix wardrobe hinges and replace drawer handle",
    status: "Awaiting match",
    date: "Today",
  },
  {
    id: "REQ-3002",
    type: "Electrician",
    summary: "Install new ceiling fan in living room",
    status: "Scheduled",
    date: "Yesterday",
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

export default function CustomerDashboardPage() {
  return (
    <div className="relative min-h-screen bg-background px-4 py-8 text-foreground antialiased overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[50%] w-full rounded-full bg-brand-primary/5 opacity-50 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-heading font-extrabold tracking-tight text-gradient-primary">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-zinc-400 font-medium">
              Track your requests, see your history, and manage your account.
            </p>
          </div>
          <div className="text-left sm:text-right text-xs text-zinc-500">
            <p className="font-bold text-foreground">John Doe</p>
            <p className="uppercase tracking-widest mt-1 text-[10px]">Enugu customer</p>
          </div>
        </header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium">
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Total requests</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">12</p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium border-brand-primary/20">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-primary">Completed</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">10</p>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-panel p-6 shadow-premium">
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">In progress</p>
              <p className="mt-2 text-3xl font-heading font-extrabold text-foreground">2</p>
            </motion.div>
          </div>

          {/* Quick actions */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium">
            <h2 className="mb-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">Quick actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/request"
                className="btn-minimal inline-flex items-center rounded-full px-6 h-10 text-xs font-bold uppercase tracking-widest"
              >
                New request
              </Link>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 dark:border-white/5 bg-background/50 backdrop-blur-sm px-6 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-foreground hover:bg-white/5 transition-colors"
              >
                WhatsApp support
              </a>
            </div>
          </motion.section>

          {/* Recent requests */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                Recent requests
              </h2>
              <Link
                href="/request"
                className="text-xs font-bold text-brand-primary hover:text-brand-glow transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {DEMO_REQUESTS.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 glass-panel-hover px-4 rounded-xl transition-colors -mx-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {request.type}
                    </p>
                    <p className="text-xs font-medium text-zinc-400">{request.summary}</p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">{request.date}</p>
                  </div>
                  <span className="inline-flex self-start sm:self-center h-6 items-center rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Referral */}
          <motion.section variants={itemVariants} className="glass-panel p-6 shadow-premium relative overflow-hidden group">
            {/* Subtle glow effect for Premium banner */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors blur-xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">Invite friends, get rewarded</h3>
                <p className="mt-1 text-xs font-medium text-zinc-400 max-w-md">
                  Share CarePay with your network. When they book their first pro, you both receive ₦500 in service credits.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const shareText = encodeURIComponent("Check out CarePay - elite home services!");
                  const shareUrl = window.location.origin;
                  if (navigator.share) {
                    navigator.share({ title: "CarePay", text: shareText, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                    alert("Referral link copied!");
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
    </div>
  );
}

