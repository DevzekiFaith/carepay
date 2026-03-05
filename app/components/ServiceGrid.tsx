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
                <div className="grid grid-cols-1 gap-4 min-[450px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredServices.map((service, idx) => (
                        <button
                            key={service.label}
                            onClick={() => onSelectService(service.label)}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            className={`group relative flex flex-col items-start gap-4 rounded-[32px] border-2 p-6 transition-all duration-500 animate-slide-up hover:-translate-y-2 active:scale-95 ${selectedService === service.label
                                ? "border-emerald-500 bg-emerald-50/50 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500"
                                : "border-stone-50 bg-white/80 backdrop-blur-sm hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10"
                                }`}
                        >
                            <div className="flex w-full items-center justify-between">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-[20px] transition-all duration-500 ${selectedService === service.label ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-stone-50 text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:rotate-6"}`}>
                                    <service.icon size={28} strokeWidth={2.5} />
                                </div>
                                {selectedService === service.label ? (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                                        <CheckCircle2 size={14} strokeWidth={3} />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 glass-morphism px-2 py-1 rounded-full">
                                        <Star size={10} className="fill-stone-300 text-stone-300 group-hover:fill-amber-400 group-hover:text-amber-400 transition-colors" />
                                        <span className="text-[9px] font-black text-stone-400 group-hover:text-stone-900 leading-none">NEW</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full text-left">
                                <h3 className={`text-lg font-black tracking-tight ${selectedService === service.label ? "text-emerald-900" : "text-stone-800"}`}>
                                    {service.label}
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                                        {service.price}
                                    </span>
                                    <div className="h-1 w-1 rounded-full bg-stone-200" />
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} className="text-stone-300" />
                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
                                            {service.time}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Badge */}
                            <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <ShieldCheck size={12} className="text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Vetted Pro</span>
                            </div>

                            {/* Background Glow */}
                            <div className={`absolute -inset-px rounded-[32px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none ${selectedService === service.label ? "hidden" : "bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent"}`} />
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
