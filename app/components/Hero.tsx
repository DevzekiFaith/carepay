import Image from "next/image";
import Link from "next/link";
import { Zap, ArrowRight, UserCircle, ShieldCheck, Sparkles } from "lucide-react";

const HERO_IMAGE = "/su9.jpg";

export default function Hero() {
    return (
        <header className="relative mb-16 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between opacity-0 animate-fade-in pt-8 sm:pt-12">
            {/* Background Decorations */}
            <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-[120px] animate-float-slow pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-stone-100/40 blur-[120px] animate-float pointer-events-none" />

            <div className="relative z-10 flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="glass-morphism rounded-full px-4 py-1.5 flex items-center gap-2 animate-slide-up">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Zap size={10} fill="currentColor" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">2 min to book</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 glass-morphism rounded-full px-4 py-1.5 animate-slide-up delay-1">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Verified · Same-day</span>
                    </div>
                </div>

                <h1 className="text-4xl font-black tracking-tight text-stone-900 sm:text-6xl lg:text-8xl leading-[0.9] sm:leading-[0.9]">
                    Book it. <br />
                    <span className="text-gradient">Fix it.</span> <br />
                    Done.
                </h1>

                <p className="mt-8 max-w-xl text-lg text-stone-500 leading-relaxed font-medium">
                    Plumbers, electricians, carpenters & more—<span className="text-stone-900 font-bold underline decoration-emerald-500/30 decoration-4">vetted pros</span> at your place.
                    Book in 2 mins, we handle the rest.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                        href="/request"
                        className="group relative overflow-hidden btn-gradient interactive-tap flex h-16 items-center justify-center gap-3 rounded-2xl px-10 text-base font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20"
                    >
                        <span className="relative z-10">Book a pro now</span>
                        <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                    <Link
                        href="/auth/worker/register"
                        className="glass-card interactive-tap flex h-16 items-center justify-center rounded-2xl border-2 border-white px-8 text-sm font-black uppercase tracking-widest text-stone-800 transition-all hover:bg-white/80 hover:shadow-xl hover:shadow-stone-200/40 gap-3"
                    >
                        <UserCircle size={20} className="text-stone-400" />
                        I&apos;m a handyman
                    </Link>
                </div>
            </div>

            <div className="relative hidden lg:block w-[420px] shrink-0 animate-slide-up delay-3">
                {/* Image Frame with Floating Elements */}
                <div className="relative">
                    <div className="absolute -inset-4 rounded-[40px] border border-stone-100 bg-white/50 backdrop-blur-3xl -rotate-2" />
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-8 border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-stone-100/50">
                        <Image
                            src={HERO_IMAGE}
                            alt="Handyman working on a repair"
                            fill
                            className="object-cover transition-transform duration-1000 hover:scale-110"
                            sizes="420px"
                            priority
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent opacity-60" />

                        {/* Live Indicator inside Image */}
                        <div className="absolute top-6 left-6 glass-morphism flex items-center gap-2 rounded-full px-4 py-2">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 leading-none">24/7 matching active</span>
                        </div>
                    </div>

                    {/* Floating Info Card */}
                    <div className="absolute -bottom-6 -right-6 glass-card rounded-3xl p-6 shadow-2xl animate-float-delayed max-w-[200px]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white mb-3 shadow-lg shadow-emerald-200">
                            <Sparkles size={20} fill="currentColor" />
                        </div>
                        <p className="text-xs font-black text-stone-900 uppercase tracking-widest leading-tight">Elite Talent Only</p>
                        <p className="mt-1 text-[10px] font-bold text-stone-400 leading-snug">Vetted through 15-point inspection.</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
