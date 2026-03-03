import { useState, useMemo } from "react";

interface Service {
    label: string;
    emoji: string;
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
        <div className="space-y-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl">
                        Choose a Service
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-1">
                        Verified Pros ready to help
                    </p>
                </div>
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-2xl border-2 border-stone-100 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/5 sm:py-2"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                        🔍
                    </span>
                </div>
            </div>

            {filteredServices.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredServices.map((service) => (
                        <button
                            key={service.label}
                            onClick={() => onSelectService(service.label)}
                            className={`group relative flex flex-col items-center gap-3 rounded-3xl border-2 p-4 transition-all duration-300 active:scale-95 ${selectedService === service.label
                                ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-200/50 ring-1 ring-emerald-500"
                                : "border-white bg-white hover:border-emerald-100 hover:shadow-xl hover:shadow-stone-200/50"
                                }`}
                        >
                            <div className="flex w-full items-start justify-between">
                                <span className="text-2xl sm:text-3xl filter drop-shadow-sm mb-2" aria-hidden>
                                    {service.emoji}
                                </span>
                                {selectedService === service.label && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-sm ring-4 ring-white">
                                        ✓
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className={`block text-xs font-bold sm:text-sm ${selectedService === service.label ? "text-emerald-900" : "text-stone-800"}`}>
                                    {service.label}
                                </span>
                                <span className="mt-1 block text-[10px] font-bold text-stone-400 uppercase tracking-tight">
                                    {service.price}
                                </span>
                                <span className="text-[10px] font-medium text-stone-400">
                                    ⚡ {service.time}
                                </span>
                            </div>

                            {selectedService !== service.label && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl pointer-events-none" />
                            )}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center rounded-3xl border-2 border-dashed border-stone-100">
                    <span className="text-4xl mb-3 block">🏜️</span>
                    <p className="text-sm font-bold text-stone-500">No services found matching "{searchQuery}"</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-4 text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800"
                    >
                        Clear Search
                    </button>
                </div>
            )}
        </div>
    );
}
