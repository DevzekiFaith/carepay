"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const FAQ_ITEMS = [
    {
        question: "How do I pay?",
        answer: "Pay to our Globus Bank account before the job. Bank details are shown after you submit a request and confirmed via WhatsApp.",
    },
    {
        question: "How quickly will someone come?",
        answer: "Usually same-day or next day, depending on your preferred time and worker availability. We confirm this within minutes of your request.",
    },
    {
        question: "Are workers verified?",
        answer: "Yes. All workers register with their NIN (National Identification Number) for verification and traceability to ensure your safety and quality service.",
    },
    {
        question: "What if I'm not happy with the work?",
        answer: "Contact us via WhatsApp immediately. We have a satisfaction guarantee and will work with you to make it right or provide a partial refund.",
    },
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="mx-auto mt-16 max-w-5xl px-4 opacity-0 animate-slide-up delay-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
                    Common Questions
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"></div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {FAQ_ITEMS.map((item, index) => (
                    <div
                        key={index}
                        className={`group rounded-2xl border-2 p-5 transition-all duration-300 ${activeIndex === index
                            ? "border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-100"
                            : "border-stone-100 bg-white hover:border-stone-200 hover:shadow-md"
                            }`}
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="flex items-start justify-between gap-4 py-1">
                            <h3 className={`text-base sm:text-lg font-bold leading-tight transition-colors ${activeIndex === index ? "text-emerald-900" : "text-stone-800"
                                }`}>
                                {item.question}
                            </h3>
                            <div className={`transition-transform duration-300 shrink-0 mt-1 ${activeIndex === index ? "text-emerald-600" : "text-stone-400 group-hover:text-stone-600"}`}>
                                {activeIndex === index ? <X size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
                            </div>
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? "mt-4 max-h-60 opacity-100" : "max-h-0 opacity-0"
                            }`}>
                            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
