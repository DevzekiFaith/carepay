 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

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

const AREAS = ["Ikeja", "Yaba", "Lekki", "Ajah", "Surulere", "Victoria Island"];

export default function WorkerRegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [ninError, setNinError] = useState<string | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setNinError(null);

    const form = e.target as HTMLFormElement;
    const nin = (form.elements.namedItem("nin") as HTMLInputElement)?.value?.trim() ?? "";

    if (nin.length !== NIN_LENGTH || !/^\d+$/.test(nin)) {
      setNinError(`NIN must be exactly ${NIN_LENGTH} digits.`);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setMessage(
        "Profile submitted. We'll verify your NIN and certification, then activate your account and send you jobs."
      );
      form.reset();
      setCertFile(null);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 antialiased">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row">
        <section className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-7 lg:w-2/3">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              For handymen & artisans
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Join CarePay as a professional
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Register with your NIN for verification and traceability. We
              review profiles before going live.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Full name
                </label>
                <input
                  required
                  name="fullName"
                  placeholder="e.g. Ibrahim Adewale"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Phone number (WhatsApp)
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="+234 812 345 6789"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                NIN (National Identification Number)
              </label>
              <p className="text-[11px] text-slate-500">
                Required for verification and tracing. Your 11-digit NIN.
              </p>
              <input
                required
                inputMode="numeric"
                pattern="[0-9]{11}"
                maxLength={11}
                name="nin"
                placeholder="e.g. 12345678901"
                className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm tabular-nums text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                aria-describedby={ninError ? "nin-error" : undefined}
                aria-invalid={!!ninError}
              />
              {ninError && (
                <p id="nin-error" className="text-xs text-red-600" role="alert">
                  {ninError}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Primary skill
                </label>
                <select
                  required
                  name="primarySkill"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Select your main skill</option>
                  {SKILLS.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Years of experience
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  max={40}
                  name="experience"
                  placeholder="e.g. 4"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Areas you can cover in Lagos
              </label>
              <p className="text-[11px] text-slate-500">
                Choose at least one area where you can reliably take jobs.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AREAS.map((area) => (
                  <label
                    key={area}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-700 hover:border-sky-300 hover:bg-sky-50"
                  >
                    <input
                      type="checkbox"
                      name="areas"
                      value={area}
                      className="h-3 w-3 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Short bio
              </label>
              <textarea
                name="bio"
                rows={3}
                placeholder="Tell customers about your experience, certifications and the type of jobs you like to handle."
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Trade certification (optional)
              </label>
              <p className="text-[11px] text-slate-500">
                Upload a government ID or trade certificate for faster verification. PDF or image, max 5MB.
              </p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50/50">
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
                <span>{certFile ? certFile.name : "Choose file"}</span>
              </label>
              {certFile && (
                <p className="text-[11px] text-slate-600">
                  Selected: {certFile.name} ({(certFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="flex-1 text-[11px] text-slate-500">
                We verify your NIN and review your profile before activating your account and sending you jobs.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="ml-4 inline-flex items-center justify-center rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-sky-500"
              >
                {submitting ? "Submitting..." : "Submit profile"}
              </button>
            </div>

            {message && (
              <p className="pt-2 text-xs font-medium text-emerald-600">{message}</p>
            )}
          </form>
        </section>

        <aside className="w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-sm text-slate-700 sm:p-6 lg:w-1/3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Why join CarePay
          </h2>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            <li>• Get matched with nearby customers who need your skills.</li>
            <li>• NIN verification keeps the platform safe and traceable.</li>
            <li>• We focus on quality jobs and timely payouts.</li>
          </ul>

          <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Next steps (planned)
          </h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-600">
            <li>• Dedicated worker app with job list and earnings.</li>
            <li>• Ratings and reviews from customers.</li>
            <li>• In-app payments and cash-out to your bank.</li>
          </ul>

          <div className="mt-6 space-y-2 text-xs text-slate-500">
            <p className="font-medium text-slate-700">
              Already registered with us?
            </p>
            <Link
              href="/auth/worker/login"
              className="font-medium text-sky-700 underline-offset-2 hover:underline"
            >
              Go to worker login
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
            <Link
              href="/"
              className="underline-offset-2 hover:text-slate-700 hover:underline"
            >
              ← Back to home
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

