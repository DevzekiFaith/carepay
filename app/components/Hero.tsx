"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HERO_IMAGE = "/su9.jpg";

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <header className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden bg-background pt-24 pb-16">
            <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)", y: 10 }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: [0, -8, 0] }}
                    transition={{ 
                        opacity: { duration: 0.8, ease: "easeOut" },
                        scale: { duration: 0.8, ease: "easeOut" },
                        filter: { duration: 0.8, ease: "easeOut" },
                        y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 }
                    }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 glass-panel text-foreground text-xs font-semibold mb-8 uppercase tracking-widest hover:border-orange-500/50 transition-colors"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    Verified Pros Active
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-[14vw] sm:text-7xl md:text-8xl lg:text-9xl font-heading font-extrabold tracking-tighter text-foreground leading-[0.9]"
                >
                    Book it. <br />
                    <span className="text-gradient-primary">Fix it.</span> <br />
                    Done.
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-8 max-w-xl text-lg md:text-xl text-zinc-500 font-medium leading-relaxed"
                >
                    A premium approach to finding reliable plumbers, electricians, and handymen. Book in 2 minutes, we handle the rest.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="mt-12 flex flex-col w-full sm:w-auto sm:flex-row gap-4 items-center"
                >
                    <Link
                        href="/request"
                        className="group btn-minimal flex w-full sm:w-auto h-14 items-center justify-center gap-2 rounded-full px-8 sm:px-10 text-xs sm:text-sm uppercase tracking-widest"
                    >
                        Book Now
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/auth/worker/register"
                        className="flex w-full sm:w-auto h-14 items-center justify-center rounded-full px-8 sm:px-10 text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-600 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
                    >
                        <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-rose-500 transition-all duration-300">
                            Join as Pro
                        </span>
                    </Link>
                </motion.div>
            </div>

            {/* Glowing Orbs for Cyber-Glass Aesthetic */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div 
                    style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]) }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-orange-500/20 dark:bg-orange-500/15 blur-[120px]" 
                />
                <motion.div 
                    style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "80%"]) }}
                    className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-rose-500/20 dark:bg-rose-500/15 blur-[100px]" 
                />
            </div>

            {/* Parallax Background Image */}
            <div ref={ref} className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.10] dark:opacity-5">
                <motion.div style={{ y, opacity, width: "100%", height: "120%" }} className="relative top-[-10%]">
                    <Image
                        src={HERO_IMAGE}
                        alt="Background"
                        fill
                        className="object-cover object-center grayscale mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
                </motion.div>
            </div>
        </header>
    );
}

