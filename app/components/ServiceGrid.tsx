import { useState, useMemo } from "react";
import { Search, CheckCircle2, Wind, Clock, Star, ShieldCheck } from "lucide-react";

interface Service {
    label: string;
    icon: any;
    price: string;
    time: string;
}

interface ServiceGridProps {
    services: Service[];
    selectedService: string | null;
    onSelectService: (label: string | null) => void;
}

export default function ServiceGrid({ services, selectedService, onSelectService }: ServiceGridProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredServices = useMemo(() => {
        return services.filter(service =>
            service.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [services, searchQuery]);

    return (
        <div className="space-y-10 animate-slide-up delay-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Marketplace</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
                        Choose a Service
                    </h2>
                    <p className="text-sm font-medium text-stone-400 mt-1">
                        Select a category to see available <span className="text-emerald-600 font-bold">Verified Pros</span>.
                    </p>
                </div>
                <div className="relative w-full sm:w-80 group">
                    <input
                        type="text"
                        placeholder="Search for a pro (e.g. Plumber)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border-2 border-stone-100 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-8 focus:ring-emerald-500/5 sm:py-3"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5 transition-colors group-focus-within:text-emerald-500" />
                </div>
            </div>

            {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service, idx) => (
                        <button
                            key={service.label}
                            onClick={() => onSelectService(service.label)}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            className={`group relative flex flex-col items-start rounded-[32px] sm:rounded-[48px] border transition-all duration-700 animate-slide-up hover:-translate-y-4 active:scale-95 overflow-hidden text-left min-h-[380px] sm:min-h-[420px] w-full perspective-1000 ${selectedService === service.label
                                ? "bg-[#050505] border-emerald-500 shadow-[0_0_80px_-12px_rgba(16,185,129,0.5)] ring-2 ring-emerald-500/50"
                                : "bg-[#080808] border-stone-800 shadow-2xl hover:border-emerald-400 hover:shadow-[0_0_60px_-12px_rgba(16,185,129,0.3)]"
                                }`}
                        >
                            {/* Scanning Light Sweep Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </div>

                            {/* Obsidian Precision Ring */}
                            <div className="absolute inset-0 rounded-[32px] sm:rounded-[48px] ring-1 ring-white/10 pointer-events-none" />

                            <div className="relative z-10 w-full grow flex flex-col p-6 sm:p-8">
                                <div className="flex w-full items-start justify-between mb-8 sm:mb-10">
                                    {/* Cyber-Recessed Icon Housing */}
                                    <div className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-[18px] sm:rounded-[20px] border transition-all duration-700 ${selectedService === service.label
                                        ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                        : "bg-black/60 border-stone-800 text-stone-500 group-hover:border-emerald-500/50 group-hover:text-emerald-400 shadow-inner"}`}>
                                        <service.icon size={24} sm:size={28} strokeWidth={1} className="group-hover:scale-125 transition-transform duration-700 ease-out group-hover:rotate-12" />
                                    </div>

                                    {/* Holographic Price Anchor */}
                                    <div className={`flex flex-col items-end px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border transition-all duration-700 ${selectedService === service.label
                                        ? "bg-emerald-500/10 border-emerald-500/40"
                                        : "bg-white/5 border-white/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5"}`}>
                                        <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
                                            {service.price.split(' ')[0]}
                                        </span>
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">
                                            {service.price.split(' ').slice(1).join(' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Content Block */}
                                <div className="mt-auto">
                                    <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 sm:gap-2 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 sm:px-4 sm:py-2 rounded-full backdrop-blur-md">
                                        <Star size={12} sm:size={14} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                                        <span className="text-[10px] sm:text-[12px] font-black text-emerald-400 uppercase tracking-[0.1em] sm:tracking-[0.2em]">PLATINUM VETTED</span>
                                    </div>

                                    <h3 className={`text-xl sm:text-2xl font-black tracking-tighter mb-6 sm:mb-8 leading-[1] ${selectedService === service.label ? "text-white" : "text-stone-100 group-hover:text-white"}`}>
                                        {service.label}
                                    </h3>

                                    {/* Technical Metadata Tray */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10">
                                        <div className="flex flex-col gap-0.5 sm:gap-1">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-stone-600 uppercase tracking-widest">Response</span>
                                            <div className="flex items-center gap-1.2 sm:gap-2 text-stone-300 group-hover:text-white">
                                                <Clock size={14} sm:size={16} className="text-emerald-500" />
                                                <span className="text-xs sm:text-sm font-black">{service.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5 sm:gap-1">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-stone-600 uppercase tracking-widest">Status</span>
                                            <div className="flex items-center gap-1.2 sm:gap-2 text-stone-300 group-hover:text-white">
                                                <ShieldCheck size={14} sm:size={16} className="text-emerald-500" />
                                                <span className="text-xs sm:text-sm font-black uppercase">Elite</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Perspective Bloom Glow */}
                            <div className={`absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px] transition-all duration-1000 ${selectedService === service.label ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100 scale-100"}`} />
                        </button>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center rounded-[40px] border-4 border-dashed border-stone-100 glass-card">
                    <div className="relative inline-block mb-6">
                        <Wind className="h-16 w-16 text-stone-100 animate-float" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Search className="h-6 w-6 text-stone-300" />
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-stone-900">No pros found</h3>
                    <p className="mt-2 text-sm font-medium text-stone-400 max-w-xs mx-auto">We couldn't find any results for "{searchQuery}". Try a broader term like "repair".</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-8 relative btn-gradient h-12 px-8 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200/50"
                    >
                        Clear Search
                    </button>
                </div>
            )}
        </div>
    );
}
