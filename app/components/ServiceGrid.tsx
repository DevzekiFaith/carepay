import { useState, useMemo } from "react";
import { Search, CheckCircle2, Wind, Clock } from "lucide-react";

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
        <div className="space-y-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-black tracking-tight text-stone-900 sm:text-2xl">
                        Choose a Service
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70 mt-1">
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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
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
                                <span className={`${selectedService === service.label ? "text-emerald-600" : "text-stone-400 group-hover:text-emerald-500"} transition-colors`} aria-hidden>
                                    <service.icon size={28} strokeWidth={2.5} />
                                </span>
                                {selectedService === service.label && (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-white" />
                                )}
                            </div>
                            <div className="text-center sm:text-left w-full">
                                <span className={`block text-sm font-black sm:text-base ${selectedService === service.label ? "text-emerald-900" : "text-stone-800"}`}>
                                    {service.label}
                                </span>
                                <span className="mt-1 block text-xs font-bold text-stone-400 uppercase tracking-tight">
                                    {service.price}
                                </span>
                                <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                                    <Clock size={12} className="text-stone-300" />
                                    <span className="text-xs font-medium text-stone-400">
                                        {service.time}
                                    </span>
                                </div>
                            </div>

                            {selectedService !== service.label && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl pointer-events-none" />
                            )}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center rounded-3xl border-2 border-dashed border-stone-100">
                    <Wind className="h-10 w-10 text-stone-200 mx-auto mb-3" />
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
