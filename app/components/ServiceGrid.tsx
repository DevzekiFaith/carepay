"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Service {
    label: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
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
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-16">
                    <div>
                        <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground sm:text-4xl">
                            Our Services
                        </h2>
                        <p className="text-sm font-medium text-zinc-500 mt-2">
                            Select a category to see available verified pros.
                        </p>
                    </div>
                    <div className="relative w-full sm:w-80 group">
                        <input
                            type="text"
                            placeholder="Find a professional..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent py-4 pl-11 pr-4 text-sm font-medium text-foreground outline-none transition-all placeholder:text-zinc-400 focus:border-foreground dark:focus:border-zinc-400"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4 transition-colors group-focus-within:text-foreground dark:group-focus-within:text-zinc-400" />
                    </div>
                </div>

                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredServices.map((service, idx) => (
                            <motion.button
                                key={service.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                onClick={() => onSelectService(service.label)}
                                className={`group flex flex-col items-start rounded-2xl border transition-all duration-300 overflow-hidden text-left min-h-[280px] sm:min-h-[320px] w-full p-6 sm:p-8 ${selectedService === service.label
                                    ? "bg-foreground text-background border-transparent shadow-premium-hover scale-[1.02]"
                                    : "bg-background text-foreground border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-premium"
                                    }`}
                            >
                                <div className="flex w-full items-start justify-between mb-auto">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${selectedService === service.label
                                        ? "bg-background/10 text-background"
                                        : "bg-zinc-100 dark:bg-zinc-900 text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800"
                                        }`}>
                                        <service.icon size={20} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xl font-bold tracking-tight ${selectedService === service.label ? "text-background" : "text-foreground"}`}>
                                            {service.price.split(' ')[0]}
                                        </span>
                                        <span className={`text-[10px] font-semibold uppercase tracking-widest ${selectedService === service.label ? "text-background/60" : "text-zinc-500"}`}>
                                            {service.price.split(' ').slice(1).join(' ')}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-heading font-bold tracking-tight mt-12 mb-6">
                                    {service.label}
                                </h3>

                                <div className={`flex items-center gap-6 w-full pt-6 border-t transition-colors ${selectedService === service.label ? "border-background/10" : "border-zinc-100 dark:border-zinc-800"}`}>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className={selectedService === service.label ? "text-background/60" : "text-zinc-400"} />
                                        <span className={`text-xs font-semibold ${selectedService === service.label ? "text-background/80" : "text-zinc-600 dark:text-zinc-400"}`}>{service.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className={selectedService === service.label ? "text-background/60" : "text-zinc-400"} />
                                        <span className={`text-xs font-semibold ${selectedService === service.label ? "text-background/80" : "text-zinc-600 dark:text-zinc-400"}`}>Local Pros</span>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <h3 className="text-lg font-bold text-foreground">No pros found</h3>
                        <p className="mt-2 text-sm font-medium text-zinc-500 max-w-sm mx-auto">We couldn&apos;t find any results for &quot;{searchQuery}&quot;. Try a broader category.</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-6 btn-minimal h-10 px-6 rounded-full text-xs font-semibold uppercase tracking-widest"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
