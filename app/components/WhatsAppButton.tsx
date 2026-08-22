"use client";

import { motion } from "framer-motion";
import { MessageCircle, GripVertical } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const WHATSAPP_NUMBER = "2349119059859";
  const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hi HomeCare! I have a 24/7 enquiry regarding a service or order."
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <motion.div
      drag
      dragConstraints={{ left: -320, right: 10, top: -650, bottom: 10 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.08, cursor: "grabbing" }}
      className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-[65] touch-none select-none flex items-center gap-2 group cursor-grab"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      {/* 24/7 Pill Tag */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 text-white text-xs font-bold px-3.5 py-2 rounded-full border border-slate-700/80 shadow-xl backdrop-blur-md transition-all group-hover:bg-slate-900">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>24/7 Enquiries · +234 911 905 9859</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white ml-1 text-[10px] uppercase font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Draggable WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-600/30 transition-transform duration-300 group-hover:scale-110 border-2 border-white/30"
        aria-label="Chat 24/7 on WhatsApp"
        title="Drag anywhere or click for 24/7 WhatsApp Support"
      >
        <svg
          className="h-8 w-8 text-white fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Online Indicator Badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>
      </a>
    </motion.div>
  );
}
