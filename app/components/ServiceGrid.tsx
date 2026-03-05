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
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service, idx) => (
                        <button
                            key={service.label}
                            onClick={() => onSelectService(service.label)}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            className={`group relative flex flex-col items-start rounded-[48px] border border-stone-800 p-10 transition-all duration-700 animate-slide-up hover:-translate-y-4 active:scale-95 overflow-hidden text-left min-h-[420px] w-full ${selectedService === service.label
                                ? "bg-stone-950 ring-2 ring-emerald-500 shadow-[0_0_60px_-12px_rgba(16,185,129,0.35)]"
                                : "bg-gradient-to-br from-stone-900 via-stone-950 to-black shadow-2xl hover:border-emerald-500/50 hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]"
                                }`}
                        >
                            {/* Inner Precision Ring */}
                            <div className="absolute inset-0 rounded-[48px] ring-1 ring-white/5 pointer-events-none" />

                            <div className="relative z-10 w-full grow flex flex-col">
                                <div className="flex w-full items-start justify-between mb-10">
                                    {/* Recessed Icon Housing */}
                                    <div className={`flex h-20 w-20 items-center justify-center rounded-[24px] border transition-all duration-700 ${selectedService === service.label
                                        ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/40"
                                        : "bg-black/40 border-stone-800 text-stone-500 group-hover:border-emerald-500/30 group-hover:text-emerald-400 group-hover:bg-black/60 shadow-inner"}`}>
                                        <service.icon size={36} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    {selectedService === service.label ? (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-500/10">
                                            <CheckCircle2 size={18} strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 border border-stone-800 bg-stone-900/80 px-4 py-2 rounded-full shadow-lg">
                                            <Star size={12} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                                            <span className="text-[11px] font-black text-stone-200 uppercase tracking-[0.2em]">PLATINUM</span>
                                        </div>
                                    )}
                                </div>

                                {/* Main Content Block */}
                                <div className="mt-auto">
                                    {/* Price Anchor */}
                                    <div className="mb-4 flex items-baseline gap-3">
                                        <span className="text-4xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
                                            {service.price.split(' ')[0]}
                                        </span>
                                        <span className="text-[12px] font-black uppercase tracking-widest text-stone-500">
                                            {service.price.split(' ').slice(1).join(' ')}
                                        </span>
                                    </div>

                                    <h3 className={`text-2xl font-black tracking-tight mb-8 leading-[1.1] ${selectedService === service.label ? "text-white" : "text-stone-50 group-hover:text-white"}`}>
                                        {service.label}
                                    </h3>

                                    <div className="flex flex-col gap-4 py-5 border-t border-white/5">
                                        <div className="flex items-center gap-3 text-stone-400 group-hover:text-stone-100 transition-colors">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 ring-1 ring-stone-800">
                                                <Clock size={16} className="text-stone-500" />
                                            </div>
                                            <span className="text-[13px] font-bold uppercase tracking-widest">{service.time} response time</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-emerald-500/90 group-hover:text-emerald-400 transition-colors">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <span className="text-[13px] font-black uppercase tracking-widest">Verified Artisan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Background Bloom Effect */}
                            <div className={`absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-emerald-500/5 blur-[100px] transition-opacity duration-1000 ${selectedService === service.label ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
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
