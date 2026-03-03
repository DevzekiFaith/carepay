"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";

interface QuickRequestFormProps {
    selectedService: string | null;
    onServiceChange: (service: string | null) => void;
    services: { label: string }[];
}

export default function QuickRequestForm({ selectedService, onServiceChange, services }: QuickRequestFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (formData: FormData) => {
        const newErrors: Record<string, string> = {};
        if (!formData.get("fullName")) newErrors.fullName = "Name is required";
        if (!formData.get("phone")) newErrors.phone = "Phone number is required";
        if (!formData.get("address")) newErrors.address = "Address is required";
        if (!formData.get("service")) newErrors.service = "Please select a service";
        if (!formData.get("details")) newErrors.details = "Tell us what you need fixed";
        return newErrors;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newErrors = validate(formData);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setSubmitted(false);
        setSubmitting(true);

        // Mock sumission
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
            (e.target as HTMLFormElement).reset();
            onServiceChange(null);
        }, 1200);
    };

    return (
        <div className="border-t border-stone-100 pt-8 mt-4">
            <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-stone-400">
                        Send Request
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-stone-500 uppercase tracking-tight">
                        Instant matching with nearby pros
                    </p>
                </div>
                <Link
                    href="/request"
                    className="text-[10px] font-black uppercase tracking-widest text-emerald-600 border-b-2 border-emerald-200 hover:border-emerald-500 transition-all py-0.5"
                >
                    Adv. Form →
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                <div className="grid gap-5 sm:grid-cols-2">
                    {/* Full Name */}
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">
                            Full Name
                        </label>
                        <input
                            name="fullName"
                            placeholder="E.g. Chioma Adebayo"
                            className={`input-vibe w-full rounded-2xl border-2 px-4 py-4 text-base outline-none transition-all sm:py-3 sm:text-sm ${errors.fullName
                                ? "border-rose-200 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100"
                                : "border-stone-100 bg-stone-50/50 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                                }`}
                        />
                        {errors.fullName && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">
                            WhatsApp / Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+234 812 345 6789"
                            className={`input-vibe w-full rounded-2xl border-2 px-4 py-4 text-base outline-none transition-all sm:py-3 sm:text-sm ${errors.phone
                                ? "border-rose-200 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100"
                                : "border-stone-100 bg-stone-50/50 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                                }`}
                        />
                        {errors.phone && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{errors.phone}</p>}
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {/* Address */}
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">
                            Service Address
                        </label>
                        <input
                            name="address"
                            placeholder="Number, street, your area"
                            className={`input-vibe w-full rounded-2xl border-2 px-4 py-3 text-sm outline-none transition-all ${errors.address
                                ? "border-rose-200 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100"
                                : "border-stone-100 bg-stone-50/50 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                                }`}
                        />
                        {errors.address && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{errors.address}</p>}
                    </div>

                    {/* Service Type */}
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">
                            Select Service
                        </label>
                        <select
                            name="service"
                            value={selectedService ?? ""}
                            onChange={(e) => onServiceChange(e.target.value || null)}
                            className={`input-vibe w-full rounded-2xl border-2 px-4 py-4 text-base outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat sm:py-3 sm:text-sm ${errors.service
                                ? "border-rose-200 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100"
                                : "border-stone-100 bg-stone-50/50 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                                }`}
                        >
                            <option value="">Choose service...</option>
                            {services.map(({ label }) => (
                                <option key={label} value={label}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        {errors.service && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{errors.service}</p>}
                    </div>
                </div>

                {/* Task Details */}
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-700 ml-1">
                        Work Details
                    </label>
                    <textarea
                        name="details"
                        rows={3}
                        placeholder="What exactly needs fixing? (e.g. Toilet is leaking, need new fan installed...)"
                        className={`input-vibe w-full resize-none rounded-2xl border-2 px-4 py-4 text-base outline-none transition-all sm:py-3 sm:text-sm ${errors.details
                            ? "border-rose-200 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100"
                            : "border-stone-100 bg-stone-50/50 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                            }`}
                    />
                    {errors.details && <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{errors.details}</p>}
                </div>

                <div className="flex flex-col gap-6 pt-2 lg:flex-row lg:items-center lg:justify-between">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 flex-1 lg:max-w-md">
                        <span className="text-xl">💬</span>
                        <p className="text-[11px] font-medium text-emerald-700 leading-relaxed">
                            <span className="font-bold">Pro Tip:</span> We usually respond on WhatsApp within <span className="underline decoration-emerald-300 underline-offset-2">5-10 minutes</span> to confirm the arrival and final quote.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-gradient interactive-tap group h-14 rounded-full px-10 text-base shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2 min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                <span>Matching...</span>
                            </>
                        ) : (
                            <>
                                <span>Request Pro</span>
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </>
                        )}
                    </button>
                </div>

                {submitted && (
                    <div className="animate-success-pop rounded-3xl border-2 border-emerald-200 bg-emerald-50/50 p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl">
                                ✓
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-emerald-900 leading-tight">Request Received!</h3>
                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-tighter">Someone is looking at it rn</p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-5 shadow-sm border border-emerald-100 space-y-3">
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Pre-payment Details</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-stone-400">Bank Name</p>
                                    <p className="text-sm font-bold text-stone-900">{PAYMENT_ACCOUNT.bankName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-stone-400">Account No.</p>
                                    <p className="text-sm font-bold text-stone-900">{PAYMENT_ACCOUNT.accountNumber}</p>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-stone-50">
                                    <p className="text-[10px] font-black uppercase text-stone-400">Account Name</p>
                                    <p className="text-sm font-bold text-emerald-700">{PAYMENT_ACCOUNT.accountName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/customer/dashboard"
                                className="btn-gradient h-12 rounded-full px-6 flex items-center justify-center text-xs shadow-md"
                            >
                                Track Status
                            </Link>
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="h-12 rounded-full border-2 border-stone-200 bg-white px-6 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                                Book Another
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
