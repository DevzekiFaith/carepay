import Image from "next/image";

interface Testimonial {
    name: string;
    area: string;
    text: string;
    rating: number;
}

interface TrustSectionProps {
    testimonials: Testimonial[];
    jobsCompleted: number;
    proImages: { src: string; alt: string }[];
}

export default function TrustSection({ testimonials, jobsCompleted, proImages }: TrustSectionProps) {
    return (
        <aside className="card-vibe space-y-8 rounded-2xl border-2 border-dashed border-emerald-200/60 bg-white/80 p-5 text-sm text-stone-700 opacity-0 animate-slide-up delay-2 sm:p-6 lg:sticky lg:top-8">
            {/* Pros at work gallery */}
            <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Pros at work
                </h2>
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {proImages.map(({ src, alt }) => (
                        <div
                            key={src}
                            className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-white shadow-md ring-1 ring-stone-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <Image src={src} alt={alt} fill className="object-cover" sizes="120px" />
                            <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats counter */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-px shadow-lg transition-transform hover:scale-[1.02]">
                <div className="rounded-[15px] bg-white p-4 text-center">
                    <p className="text-sm font-bold text-stone-900 leading-none">
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-emerald-500">
                            {jobsCompleted.toLocaleString()}+
                        </span>
                        <br />
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-black">
                            Jobs completed this month
                        </span>
                    </p>
                </div>
            </div>

            {/* Testimonials */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    What customers say
                </h3>
                <div className="mt-4 space-y-4">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="group relative rounded-2xl border-2 border-stone-100 bg-white p-4 text-xs transition-all hover:border-emerald-100 hover:shadow-md"
                        >
                            <div className="mb-2 flex items-center gap-1">
                                {[...Array(5)].map((_, j) => (
                                    <span key={j} className={`text-[10px] ${j < testimonial.rating ? "text-emerald-500" : "text-stone-200"}`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="italic text-stone-700 leading-relaxed font-medium">&quot;{testimonial.text}&quot;</p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600 uppercase">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <p className="text-[10px] font-bold text-stone-900">
                                    {testimonial.name} <span className="mx-1 text-stone-300 font-normal">|</span> <span className="text-stone-500 font-medium">{testimonial.area}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100 uppercase">
                        ✓ NIN Verified Pros
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 border border-blue-100 uppercase">
                        ⚡ Quick Response
                    </span>
                </div>
            </div>
        </aside>
    );
}
