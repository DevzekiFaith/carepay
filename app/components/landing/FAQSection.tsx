"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is the HomeCare app free to use?",
    a: "The HomeCare app is totally free to download and use for finding providers. Register and find your next client or provider today for zero cost!"
  },
  {
    q: "Are there consultation fees?",
    a: "No, there are no consultation fees. We have eliminated all forms of middleman or 3rd party interference to foster a free independent market economy."
  },
  {
    q: "Is my privacy protected?",
    a: "Yes, HomeCare protects your privacy and does not disclose your information to any 3rd party without your full consent. When trust is built, users are free to disclose location on their own discretion."
  },
  {
    q: "How do I know providers are safe?",
    a: "We physically verify all our providers. There are icons that indicate verified providers. Your safety and satisfaction is our top priority."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 relative z-10 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Got Questions?</h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">Everything you need to know about HomeCare.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="border border-white/10 bg-white/5 rounded-2xl overflow-hidden"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-bold text-foreground pr-8">{faq.q}</span>
              <ChevronDown 
                className={`text-zinc-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                size={20} 
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
