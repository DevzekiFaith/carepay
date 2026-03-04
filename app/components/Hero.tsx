import Image from "next/image";
import Link from "next/link";
import { Zap, ArrowRight, UserCircle } from "lucide-react";

const HERO_IMAGE = "/su9.jpg";

export default function Hero() {
    return (
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between opacity-0 animate-fade-in">
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="pill-vibe inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
                        <Zap size={10} className="fill-emerald-500 text-emerald-500" /> 2 min to book
                    </span>
                    <span className="hidden text-[10px] font-medium text-stone-400 sm:inline">
                        Verified · Same-day
                    </span>
                </div>
                <h1 className="mt-5 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl lg:text-7xl">
                    Book it. <span className="text-emerald-600">Fix it.</span> Done.
                </h1>
                <p className="mt-4 max-w-xl text-base text-stone-600 leading-snug sm:text-lg sm:leading-relaxed">
                    Plumbers, electricians, carpenters & more—vetted pros at your place.
                    Book in 2 mins, we handle the rest.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <Link
                        href="/request"
                        className="group btn-gradient interactive-tap inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-black uppercase tracking-widest shadow-xl hover:shadow-emerald-200/50"
                    >
                        Book a pro now
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/auth/worker/register"
                        className="interactive-tap inline-flex h-14 items-center justify-center rounded-full border-2 border-stone-200 bg-white px-8 text-sm font-black uppercase tracking-widest text-stone-800 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/50 gap-2"
                    >
                        <UserCircle size={18} />
                        I&apos;m a handyman
                    </Link>
                </div>
            </div>
            <div className="hidden lg:block w-80 shrink-0">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white shadow-2xl ring-1 ring-stone-100">
                    <Image
                        src={HERO_IMAGE}
                        alt="Handyman working on a repair"
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="320px"
                        priority
                    />
                </div>
                <div className="mt-4 flex items-center justify-end gap-2 text-xs font-semibold text-stone-500">
                    <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                    24/7 matching active
                </div>
            </div>
        </header>
    );
}
