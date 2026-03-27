"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { PAYMENT_ACCOUNT } from "@/lib/payment-details";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import SurgeBadge from "@/app/components/SurgeBadge";
import type { SurgeResult } from "@/lib/surge";

import { Wrench, Zap, Hammer, Armchair, Snowflake, Paintbrush, PenTool, Camera, X } from "lucide-react";

const REQUEST_HERO_IMAGE = "/su4.jpg";

const SERVICES = [
  { label: "Plumber", icon: Wrench, price: "₦15,000 Start" },
  { label: "Electrician", icon: Zap, price: "₦18,000 Start" },
  { label: "Carpenter", icon: Hammer, price: "₦20,000 Start" },
  { label: "Furniture Maker", icon: Armchair, price: "₦25,000 Start" },
  { label: "AC & Fridge Repair", icon: Snowflake, price: "₦20,000 Start" },
  { label: "Painter", icon: Paintbrush, price: "₦22,000 Start" },
  { label: "General Handyman", icon: PenTool, price: "₦15,000 Start" },
];


export default function RequestPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [surgeData, setSurgeData] = useState<(SurgeResult & { displayPrice: string }) | null>(null);
  const [surgeLoading, setSurgeLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleServiceSelect = async (label: string) => {
    const isActive = selectedService === label;
    const next = isActive ? null : label;
    setSelectedService(next);
    setSurgeData(null);
    if (!next) return;
    setSurgeLoading(true);
    try {
      const res = await fetch(`/api/surge?service=${encodeURIComponent(next)}&city=Enugu`);
      const data = await res.json() as SurgeResult & { displayPrice: string };
      setSurgeData(data);
    } catch {
      // Surge fetch failed — non-breaking, just don't show badge
    } finally {
      setSurgeLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setErrorMsg(null);
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = ((formData.get("email") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const pin = ((formData.get("pin") as string) || "").trim();
    const fullName = ((formData.get("fullName") as string) || "").trim();
    const address = ((formData.get("address") as string) || "").trim();
    const serviceType = selectedService || "";
    const details = ((formData.get("details") as string) || "").trim();
    const preferredTimeRaw = formData.get("preferredTime") as string;

    if (!serviceType) {
      setErrorMsg("Please select a service above.");
      setSubmitting(false);
      return;
    }

    const supabase = createClient();

    let userId = null;

    // Seamless Auth Flow: Attempt Signup (New User), if exists -> Signin (Returning User)
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
        const { error: profileError } = await supabase.from('profiles').insert({
          id: userId,
          full_name: fullName,
          phone: phone,
          address: address
        });
        if (profileError) {
          setErrorMsg(`Error creating profile: ${profileError.message}`);
          setSubmitting(false);
          return;
        }
      }
    }

    if (!userId) {
      setErrorMsg("Failed to authenticate user.");
      setSubmitting(false);
      return;
    }

    const preferredTime = preferredTimeRaw ? new Date(preferredTimeRaw).toISOString() : null;

    // Handle Image Upload First
    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('job-photos')
        .upload(fileName, imageFile, {
          upsert: true,
        });

      if (uploadError) {
        setErrorMsg(`Failed to upload photo: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('job-photos')
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

    // Insert Request
    const { error: requestError } = await supabase.from('service_requests').insert({
      customer_id: userId,
      service_type: serviceType,
      description: details,
      address: address,
      preferred_time: preferredTime,
      image_url: imageUrl
    });

    if (requestError) {
      setErrorMsg(`Failed to submit request: ${requestError.message}`);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
    form.reset();
    setSelectedService(null);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased py-12 sm:py-24 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 -top-[30%] -z-10 h-[80%] w-full rounded-full bg-brand-primary/5 opacity-50 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="mx-auto flex min-w-0 max-w-5xl flex-col px-6 lg:px-8 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0">
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-gradient-primary sm:text-4xl">
              Book a Professional
            </h1>
            <p className="mt-2 text-sm text-zinc-400 font-medium">
              Select a service and provide your details. We match you instantly.
            </p>
          </div>
          <Link
            href="/"
            className="flex h-10 items-center justify-center rounded-full border border-white/10 dark:border-white/5 glass-panel px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 glass-panel-hover transition-colors"
          >
            ← Home
          </Link>
        </motion.header>

        <main className="grid flex-1 gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
                1. Select Service
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {SERVICES.map((service) => {
                  const isActive = selectedService === service.label;
                  return (
                    <button
                      key={service.label}
                      type="button"
                      onClick={() => handleServiceSelect(service.label)}
                      className={`group flex flex-col items-start rounded-2xl border transition-all duration-300 overflow-hidden text-left w-full p-4 sm:p-5 ${isActive
                        ? "bg-brand-primary/10 text-foreground border-brand-primary/50 shadow-[0_0_20px_rgba(249,115,22,0.15)] scale-[1.02]"
                        : "glass-panel glass-panel-hover"
                        }`}
                    >
                      <div className="flex w-full items-start justify-between mb-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isActive
                          ? "bg-brand-primary/20 text-brand-primary"
                          : "bg-white/5 border border-white/5 text-zinc-400 group-hover:bg-brand-primary/20 group-hover:border-brand-primary/30 group-hover:text-brand-primary"
                          }`}>
                          <service.icon size={18} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
                        </div>
                      </div>

                      <h3 className={`text-sm font-bold tracking-tight mt-4 mb-2 ${isActive ? "text-brand-primary" : "text-foreground group-hover:text-brand-primary transition-colors"}`}>
                        {service.label}
                      </h3>

                      <div className={`flex flex-col items-start w-full pt-3 border-t transition-colors ${isActive ? "border-brand-primary/20" : "border-white/5"}`}>
                        <span className={`text-sm font-bold tracking-tight ${isActive ? "text-foreground" : "text-zinc-300"}`}>
                          {service.price.split(' ')[0]}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase tracking-widest ${isActive ? "text-brand-primary" : "text-zinc-500"}`}>
                          {service.price.split(' ').slice(1).join(' ')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Surge Pricing Badge */}
              {selectedService && !surgeLoading && surgeData && (
                <SurgeBadge
                  level={surgeData.level}
                  label={surgeData.label}
                  reason={surgeData.reason}
                  multiplier={surgeData.multiplier}
                  displayPrice={surgeData.displayPrice}
                  service={selectedService}
                />
              )}
              {surgeLoading && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
                  <span className="text-[10px] text-zinc-500 font-medium">Checking pricing…</span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
                2. Your Details
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Full name
                    </label>
                    <input
                      required
                      name="fullName"
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Phone number
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="+234 812 345 6789"
                      className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Address
                    </label>
                    <input
                      required
                      name="address"
                      placeholder="House number, street, area"
                      className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      6-Digit PIN <span className="text-zinc-400 lowercase">(To track booking)</span>
                    </label>
                    <input
                      required
                      type="password"
                      name="pin"
                      maxLength={6}
                      minLength={6}
                      placeholder="e.g. 123456"
                      className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Service
                    </label>
                    <select
                      required
                      name="service"
                      value={selectedService ?? ""}
                      onChange={(e) =>
                        setSelectedService(
                          e.target.value || null,
                        )
                      }
                      className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary appearance-none"
                    >
                      <option value="">Select a service</option>
                      {SERVICES.map(({ label }) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Preferred time
                    </label>
                    <input
                      type="datetime-local"
                      name="preferredTime"
                      className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Work Description
                  </label>
                  <textarea
                    required
                    name="details"
                    rows={4}
                    placeholder="Describe the issue. Detailed descriptions help us match the right pro."
                    className="w-full resize-none rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Photo of Issue (Optional)
                  </label>
                  <div className="relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed border-white/10 dark:border-white/5 bg-background/50 p-6 transition-all hover:bg-background/80 hover:border-brand-primary/40 group">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Issue preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            setImageFile(null); 
                            setImagePreview(null); 
                          }}
                          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground hover:bg-red-500 hover:text-white transition-all shadow-premium"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-zinc-400 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors mb-3">
                          <Camera size={20} />
                        </div>
                        <p className="text-sm font-bold text-foreground">Tap to take a photo</p>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">or upload from gallery</p>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setImageFile(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      name="whatsapp"
                      defaultChecked
                      className="h-4 w-4 rounded border-zinc-300 text-foreground focus:ring-foreground accent-foreground"
                    />
                    Contact me on WhatsApp for faster updates
                  </label>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-minimal h-12 w-full sm:w-auto min-w-[200px] rounded-full px-8 text-[11px] font-bold uppercase tracking-[0.2em] shadow-premium hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-3 transition-all duration-300"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                        Processing
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>

                {errorMsg && (
                  <p className="p-4 rounded-xl border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/10 text-sm font-semibold text-red-800 dark:text-red-400 mt-4 leading-relaxed">
                    {errorMsg}
                  </p>
                )}

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 p-8 shadow-[0_0_30px_rgba(249,115,22,0.1)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
                    <h3 className="text-2xl font-heading font-extrabold text-foreground tracking-tight">Request Confirmed!</h3>
                    <p className="mt-2 text-sm text-zinc-400 font-medium">We've received your request and are matching you with a professional now.</p>

                    <div className="mt-6 rounded-xl bg-background/50 border border-white/10 p-6 backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-4 flex items-center gap-2">
                        Preferred Payment Details
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Bank Name</p>
                          <p className="text-sm font-bold text-foreground">{PAYMENT_ACCOUNT.bankName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Account No.</p>
                          <p className="text-sm font-extrabold tracking-widest text-brand-primary font-mono">{PAYMENT_ACCOUNT.accountNumber}</p>
                        </div>
                        <div className="sm:col-span-2 pt-4 border-t border-white/5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Account Name</p>
                          <p className="text-sm font-bold text-foreground">{PAYMENT_ACCOUNT.accountName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <Link
                        href="/customer/dashboard"
                        className="btn-minimal h-12 rounded-xl px-8 flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.2em] w-full sm:w-auto"
                      >
                        Track Status
                      </Link>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl glass-panel p-2">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={REQUEST_HERO_IMAGE}
                  alt="Expert Professional"
                  fill
                  className="object-cover scale-[1.05] transition-transform duration-[10s] hover:scale-[1.1]"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              </div>
            </div>

            <div className="glass-panel p-8">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-6">
                How It Works
              </h2>
              <ol className="space-y-8">
                <li className="flex gap-4 group">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-foreground group-hover:bg-brand-primary group-hover:text-background group-hover:border-brand-primary transition-all duration-300">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors">Submit Details</p>
                    <p className="mt-1 text-xs text-zinc-400 font-medium leading-relaxed">Provide the task specifics, upload any photos, and select your preferred timing.</p>
                  </div>
                </li>
                <li className="flex gap-4 group">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-foreground group-hover:bg-brand-primary group-hover:text-background group-hover:border-brand-primary transition-all duration-300">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors">Match & Confirm</p>
                    <p className="mt-1 text-xs text-zinc-400 font-medium leading-relaxed">We algorithmically assign an elite professional and confirm transparent pricing directly.</p>
                  </div>
                </li>
                <li className="flex gap-4 group">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-foreground group-hover:bg-brand-primary group-hover:text-background group-hover:border-brand-primary transition-all duration-300">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-brand-primary transition-colors">Execution & Review</p>
                    <p className="mt-1 text-xs text-zinc-400 font-medium leading-relaxed">Fast, reliable resolution of your issue with a 7-day satisfaction guarantee.</p>
                  </div>
                </li>
              </ol>
            </div>
          </motion.aside>
        </main>
      </div>
    </div>
  );
}
