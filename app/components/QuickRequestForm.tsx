"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
        if (!formData.get("email")) newErrors.email = "Email is required";
        if (!formData.get("phone")) newErrors.phone = "Phone number is required";
        if (!formData.get("address")) newErrors.address = "Address is required";
        if (!formData.get("service")) newErrors.service = "Please select a service";
        if (!formData.get("details")) newErrors.details = "Tell us what you need fixed";
        if (!formData.get("pin") || (formData.get("pin") as string).length !== 6) newErrors.pin = "6-digit PIN required";
        return newErrors;
    };

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newErrors = validate(formData);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setSubmitted(false);
        setErrorMsg(null);
        setSubmitting(true);

        const fullName = (formData.get("fullName") as string)?.trim() ?? "";
        const email = (formData.get("email") as string)?.trim() ?? "";
        const phone = (formData.get("phone") as string)?.trim() ?? "";
        const address = (formData.get("address") as string)?.trim() ?? "";
        const service = (formData.get("service") as string)?.trim() ?? "";
        const details = (formData.get("details") as string)?.trim() ?? "";
        const pin = (formData.get("pin") as string)?.trim() ?? "";

        const supabase = createClient();

        let userId = null;

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password: pin,
        });

        if (signUpError && signUpError.message.includes("User already registered")) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password: pin,
            });
            if (signInError) {
                setErrorMsg("Incorrect PIN for this phone number.");
                setSubmitting(false);
                return;
            }
            userId = signInData.user?.id;
        } else if (signUpError) {
            setErrorMsg(`Auth Error: ${signUpError.message}`);
            setSubmitting(false);
            return;
        } else {
            userId = signUpData.user?.id;
            if (userId) {
                await supabase.from('profiles').insert({
                    id: userId, full_name: fullName, phone, address
                });
            }
        }

        if (!userId) {
            setErrorMsg("Failed to authenticate.");
            setSubmitting(false);
            return;
        }

        const { error: requestError } = await supabase.from('service_requests').insert({
            customer_id: userId,
            service_type: service,
            description: details,
            address: address
        });

        if (requestError) {
            setErrorMsg(`Failed to submit request: ${requestError.message}`);
            setSubmitting(false);
            return;
        }

        setSubmitting(false);
        setSubmitted(true);
        (e.target as HTMLFormElement).reset();
        onServiceChange(null);
    };

    return (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 mt-12 relative z-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-xl font-heading font-bold text-foreground">
                        Instant Booking
                    </h2>
                    <p className="mt-1 text-sm font-medium text-zinc-500">
                        Fill in your details, we match you instantly.
                    </p>
                </div>
                <Link
                    href="/request"
                    className="text-xs font-bold uppercase tracking-widest text-brand-primary hover:text-brand-primary-hover transition-colors border-b border-brand-primary/30 hover:border-brand-primary pb-0.5 self-start sm:self-auto"
                >
                    Advanced Form
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                            Full Name
                        </label>
                        <input
                            name="fullName"
                            placeholder="E.g. Chioma Adebayo"
                            className={`w-full rounded-xl border px-4 py-3.5 text-sm bg-background/50 backdrop-blur-sm outline-none transition-all ${errors.fullName
                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                                : "border-zinc-200/50 dark:border-zinc-800/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm"
                                }`}
                        />
                        {errors.fullName && <p className="text-xs font-semibold text-red-500">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+234 812 345 6789"
                            className={`w-full rounded-xl border px-4 py-3.5 text-sm bg-background/50 backdrop-blur-sm outline-none transition-all ${errors.phone
                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                                : "border-zinc-200/50 dark:border-zinc-800/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm"
                                }`}
                        />
                        {errors.phone && <p className="text-xs font-semibold text-red-500">{errors.phone}</p>}
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                            Address
                        </label>
                        <input
                            name="address"
                            placeholder="Number, street, area"
                            className={`w-full rounded-xl border px-4 py-3.5 text-sm bg-background/50 backdrop-blur-sm outline-none transition-all ${errors.address
                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                                : "border-zinc-200/50 dark:border-zinc-800/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm"
                                }`}
                        />
                        {errors.address && <p className="text-xs font-semibold text-red-500">{errors.address}</p>}
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                            6-Digit PIN <span className="text-zinc-400 lowercase">(To track booking)</span>
                        </label>
                        <input
                            required
                            type="password"
                            name="pin"
                            minLength={6}
                            maxLength={6}
                            placeholder="e.g. 123456"
                            className={`w-full rounded-xl border px-4 py-3.5 text-sm bg-background/50 backdrop-blur-sm outline-none transition-all tracking-widest font-mono ${errors.pin
                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                                : "border-zinc-200/50 dark:border-zinc-800/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm"
                                }`}
                        />
                        {errors.pin && <p className="text-xs font-semibold text-red-500">{errors.pin}</p>}
                    </div>
                </div>

                <div className="space-y-2 flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Select Service
                    </label>
                    <select
                        name="service"
                        value={selectedService ?? ""}
                        onChange={(e) => onServiceChange(e.target.value || null)}
                        className={`w-full rounded-xl border px-4 py-3.5 text-sm bg-background/50 backdrop-blur-sm outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23f97316%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat ${errors.service
                            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                            : "border-zinc-200/50 dark:border-zinc-800/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm"
                            }`}
                    >
                        <option value="">Choose service...</option>
                        {services.map(({ label }) => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                    {errors.service && <p className="text-xs font-semibold text-red-500">{errors.service}</p>}
                </div>

                <div className="space-y-2 flex flex-col">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Work Details
                    </label>
                    <textarea
                        name="details"
                        rows={3}
                        placeholder="What needs fixing?"
                        className={`w-full resize-none rounded-xl border px-4 py-3.5 text-sm bg-background/50 backdrop-blur-sm outline-none transition-all ${errors.details
                            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                            : "border-zinc-200/50 dark:border-zinc-800/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm"
                            }`}
                    />
                    {errors.details && <p className="text-xs font-semibold text-red-500">{errors.details}</p>}
                </div>

                <div className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="p-4 rounded-xl border border-brand-primary/20 bg-brand-primary/5 flex items-start gap-4 flex-1">
                        <MessageCircle className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" strokeWidth={2} />
                        <p className="text-xs font-medium text-foreground leading-relaxed">
                            <span className="font-bold text-brand-primary">Next step:</span> We typically respond on WhatsApp within 5-10 minutes to verify pricing and pro arrival time.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-minimal h-14 w-full sm:w-auto rounded-full px-8 text-xs font-bold uppercase tracking-widest shadow-[0_8px_32px_-4px_rgba(249,115,22,0.6)] flex items-center justify-center gap-2 sm:min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                                <span>Processing</span>
                            </>
                        ) : (
                            <span>Request Pro</span>
                        )}
                    </button>
                </div>

                {errorMsg && (
                    <p className="p-4 rounded-xl border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/10 text-sm font-semibold text-red-800 dark:text-red-400 mt-4 leading-relaxed">
                        {errorMsg}
                    </p>
                )}

                {submitted && (
                    <div className="mt-8 rounded-2xl glass-panel p-8 shadow-[0_8px_32px_-4px_rgba(249,115,22,0.2)]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-500">
                                <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-xl font-heading font-bold text-foreground leading-tight">Request Received</h3>
                                <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mt-1">Matching in progress</p>
                            </div>
                        </div>

                        <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 border border-zinc-200/50 dark:border-zinc-800/50">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Payment Details</p>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Bank Name</p>
                                    <p className="text-sm font-semibold text-foreground">{PAYMENT_ACCOUNT.bankName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Account No.</p>
                                    <p className="text-sm font-semibold text-foreground">{PAYMENT_ACCOUNT.accountNumber}</p>
                                </div>
                                <div className="sm:col-span-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Account Name</p>
                                    <p className="text-sm font-semibold text-foreground">{PAYMENT_ACCOUNT.accountName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/customer/dashboard"
                                className="btn-minimal h-10 rounded-full px-6 flex items-center justify-center text-xs font-bold tracking-widest uppercase"
                            >
                                Track Status
                            </Link>
                            <button
                                type="button"
                                onClick={() => setSubmitted(false)}
                                className="h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-background px-6 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
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
