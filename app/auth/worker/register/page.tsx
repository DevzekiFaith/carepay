"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, UserCircle, UploadCloud, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { getDefaultAreas } from "@/lib/cities";
import IdVerificationStatus, { type VerificationStatus } from "@/app/components/IdVerificationStatus";
import Logo from "@/app/components/Logo";
import ErrorAlert from "@/app/components/ErrorAlert";

const NIN_LENGTH = 11;

const SKILLS = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Furniture Maker",
  "AC & Fridge Repair",
  "Painter",
  "Tiler",
  "General Handyman",
];

const AREAS = getDefaultAreas();

export default function WorkerRegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [ninError, setNinError] = useState<string | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<VerificationStatus>("idle");
  const [verifyReason, setVerifyReason] = useState<string | undefined>(undefined);
  const [verifyConfidence, setVerifyConfidence] = useState<"high" | "medium" | "low" | null>(null);
  const [aiVerified, setAiVerified] = useState(false);
  const [aiVerifyReason, setAiVerifyReason] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setNinError(null);
    setSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Extract fields
    const email = (formData.get("email") as string)?.trim() ?? "";
    const nin = (formData.get("nin") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() ?? "";
    const pin = (formData.get("pin") as string)?.trim() ?? "";
    const fullName = (formData.get("fullName") as string)?.trim() ?? "";
    const primarySkill = (formData.get("primarySkill") as string)?.trim() ?? "";
    const experience = parseInt((formData.get("experience") as string) || "0", 10);
    const bio = (formData.get("bio") as string)?.trim() ?? "";
    const areas = formData.getAll("areas") as string[];

    if (nin.length !== NIN_LENGTH || !/^\d+$/.test(nin)) {
      setNinError(`NIN must be exactly ${NIN_LENGTH} digits.`);
      setSubmitting(false);
      return;
    }

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: pin,
      options: {
        data: {
          full_name: fullName,
          role: 'worker'
        }
      }
    });

    if (authError || !authData?.user) {
      setMessage(`Registration failed: ${authError?.message || "Unknown error"}`);
      setSubmitting(false);
      return;
    }

    // Insert into professionals table
    const { error: dbError } = await supabase.from('professionals').insert({
      id: authData.user.id,
      full_name: fullName,
      phone: phone,
      nin: nin,
      primary_skill: primarySkill,
      experience_years: experience,
      areas: areas,
      bio: bio,
      is_verified: false,
      ai_verified: aiVerified,
      ai_verification_reason: aiVerifyReason,
    });

    if (dbError) {
      setMessage(`Profile creation failed: ${dbError.message}`);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setMessage(
      "Profile successfully submitted! We will securely verify your identity before activating your account to ensure total safety."
    );
    form.reset();
    setCertFile(null);
    setPhotoFile(null);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased py-12 sm:py-24">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-background/85 dark:bg-background/95 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-foreground/5 dark:bg-foreground/5 z-10" />
        <div className="relative w-full h-full">
          <Image
            src="/su1.jpg"
            alt="Background"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-20" />
      </div>

      <div className="relative z-30 mx-auto flex max-w-5xl flex-col gap-12 lg:flex-row px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel w-full p-8 lg:p-12 lg:w-2/3"
        >
          <div className="mb-10">
            <Logo size="md" className="mb-6" />
            <div className="h-px w-12 bg-brand-primary/20 mb-6" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">
              For Professionals
            </p>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-gradient-primary">
              Pro Verification
            </h1>
            <p className="mt-2 text-sm text-zinc-400 font-medium max-w-xl leading-relaxed">
              Customer safety is our absolute priority. Please provide your true identity and professional details to be vetted and approved. Let's make home repairs secure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">

            {/* Sec 1: Personal Info */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <UserCircle size={16} /> 1. Personal Details
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Full Legal Name
                  </label>
                  <input
                    required
                    name="fullName"
                    placeholder="Matches your NIN"
                    className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Phone (WhatsApp)
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="+234 812 345 6789"
                    className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    6-Digit PIN
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      name="pin"
                      minLength={6}
                      maxLength={6}
                      placeholder="e.g. 123456"
                      className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-primary transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-1 py-1">
                <button 
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 cursor-pointer group w-fit"
                >
                   <div className="relative flex items-center justify-center h-4 w-4 rounded border border-white/20 bg-white/5 group-hover:border-brand-primary/50 transition-colors">
                      <input 
                        type="checkbox" 
                        name="remember" 
                        className="sr-only" 
                        checked={rememberMe} 
                        onChange={() => {}} 
                      />
                      <div className={`h-2 w-2 rounded-sm bg-brand-primary transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
                   </div>
                   <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors underline-offset-4">Keep me signed in</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Residential Address
                </label>
                <input
                  required
                  name="homeAddress"
                  placeholder="Your full home verifiable address in Enugu"
                  className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>

            {/* Sec 2: Security & ID */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <ShieldCheck size={16} className="text-foreground" /> 2. Security & Identity
              </h2>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    NIN (National Identity Number)
                  </label>
                  <p className="text-xs font-medium text-zinc-500 mb-3 mt-1">
                    Your 11-digit NIN is rigorously vetted against national databases to guarantee customer safety.
                  </p>
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]{11}"
                    maxLength={11}
                    name="nin"
                    placeholder="12345678901"
                    className="w-full max-w-sm rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground tabular-nums outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary shadow-sm"
                  />
                  {ninError && (
                    <p className="text-xs font-semibold text-red-500 mt-2">
                      {ninError}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
                    Upload Clear Photo (Selfie)
                  </label>
                   <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-background px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm">
                     <input
                       required
                       type="file"
                       name="photo"
                       accept="image/*"
                       className="sr-only"
                       onChange={async (e) => {
                         const file = e.target.files?.[0];
                         setPhotoFile(file ?? null);
                         if (!file) return;
                         // Trigger AI verification
                         setVerifyStatus("checking");
                         setVerifyReason(undefined);
                         try {
                           const reader = new FileReader();
                           reader.onload = async (ev) => {
                             const imageBase64 = ev.target?.result as string;
                             const res = await fetch("/api/verify-id", {
                               method: "POST",
                               headers: { "Content-Type": "application/json" },
                               body: JSON.stringify({ imageBase64, workerName: "" }),
                             });
                             const data = await res.json() as {
                               status: VerificationStatus;
                               confidence?: "high" | "medium" | "low" | null;
                               reason?: string;
                             };
                             setVerifyStatus(data.status);
                             setVerifyReason(data.reason);
                             setVerifyConfidence(data.confidence ?? null);
                             setAiVerified(data.status === "verified");
                             setAiVerifyReason(data.reason ?? "");
                           };
                           reader.readAsDataURL(file);
                         } catch {
                           setVerifyStatus("pending_manual");
                           setVerifyReason("Verification will be completed manually by our team.");
                         }
                       }}
                     />
                     <UploadCloud size={16} />
                     <span>{photoFile ? photoFile.name : "Capture Selfie"}</span>
                   </label>
                   <IdVerificationStatus status={verifyStatus} reason={verifyReason} confidence={verifyConfidence} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Guarantor Full Name
                  </label>
                  <input
                    required
                    name="guarantorName"
                    placeholder="A trusted relative or associate"
                    className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Guarantor Phone
                  </label>
                  <input
                    required
                    name="guarantorPhone"
                    type="tel"
                    placeholder="Must be reachable"
                    className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sec 3: Expertise */}
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <UserCircle size={16} /> 3. Professional Details
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Primary skill
                  </label>
                  <select
                    required
                    name="primarySkill"
                    className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-[#121212] px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background focus:ring-1 focus:ring-brand-primary appearance-none"
                  >
                    <option value="">Select your main skill</option>
                    {SKILLS.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Years of experience
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    max={40}
                    name="experience"
                    placeholder="e.g. 4"
                    className="w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Areas you can reliably cover
                </label>
                <div className="flex flex-wrap gap-2">
                  {AREAS.map((area) => (
                    <label
                      key={area}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        name="areas"
                        value={area}
                        className="h-3.5 w-3.5 rounded border-zinc-300 text-foreground focus:ring-foreground accent-foreground"
                      />
                      {area}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Short bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Detail your past projects, specializations, and why customers should trust you."
                  className="w-full resize-none rounded-xl border border-white/10 dark:border-white/5 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:bg-background/80 focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Trade certification (optional)
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground">
                  <input
                    type="file"
                    name="certification"
                    accept=".pdf,image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        e.target.value = "";
                        return;
                      }
                      setCertFile(file ?? null);
                    }}
                  />
                  <UploadCloud size={16} />
                  <span>{certFile ? certFile.name : "Upload Document"}</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-zinc-100 dark:border-zinc-900">
              <p className="flex-1 text-xs text-zinc-500 font-medium leading-relaxed">
                By submitting this document, you agree to our stringent safety terms. Fraudulent identities will be prosecuted.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="btn-minimal w-full sm:w-auto sm:min-w-[180px] h-14 inline-flex items-center justify-center rounded-full px-8 text-xs uppercase tracking-widest font-bold shadow-premium disabled:opacity-50"
              >
                {submitting ? "Vetting..." : "Submit Identity"}
              </button>
            </div>

            <ErrorAlert 
              error={message && message.includes("failed") ? message : null} 
              onClear={() => setMessage(null)}
              className="mt-6"
            />

            {message && !message.includes("failed") && (
              <p className="p-6 rounded-xl border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/10 text-sm font-semibold text-emerald-800 dark:text-emerald-400 mt-6 leading-relaxed">
                {message}
              </p>
            )}
          </form>
        </motion.section>

        {/* ... Aside logic from previous generation ... */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel w-full p-8 lg:w-1/3 h-fit"
        >
          <div className="bg-background/50 rounded-xl p-6 border border-white/10 dark:border-white/5 mb-8 space-y-4 shadow-sm">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
              <ShieldCheck size={14} /> Trust & Safety First
            </h2>
            <p className="text-xs font-medium text-zinc-500 leading-relaxed">
              HomeCare customers pay up-front for security. In return, we demand absolute verification of our pros. Unverified profiles or those missing Guarantors will not receive jobs.
            </p>
          </div>

          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 mt-10">
            Why join us?
          </h3>
          <ul className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-3">
              <span className="text-foreground font-bold">•</span> Top-tier matching.
            </li>
            <li className="flex gap-3">
              <span className="text-foreground font-bold">•</span> Guaranteed payouts upon job completion.
            </li>
            <li className="flex gap-3">
              <span className="text-foreground font-bold">•</span> Protect your rates from under-cutting.
            </li>
          </ul>

          <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
            <p className="font-semibold text-zinc-500">
              Already registered with us?
            </p>
            <Link href="/auth/worker/login" className="font-bold text-foreground hover:underline">
              Go to Login
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs">
            <Link href="/" className="font-bold uppercase tracking-widest text-zinc-400 hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
