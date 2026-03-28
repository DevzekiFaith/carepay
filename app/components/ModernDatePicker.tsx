"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Clock } from "lucide-react";

interface ModernDatePickerProps {
  onSelect: (date: Date) => void;
  selectedDate?: Date | null;
}

export default function ModernDatePicker({ onSelect, selectedDate }: ModernDatePickerProps) {
  const [dates, setDates] = useState<Date[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate next 14 days
    const nextDates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      nextDates.push(d);
    }
    setDates(nextDates);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const formatDay = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
          <CalendarIcon size={12} className="text-brand-primary" strokeWidth={3} />
          Choose Date
        </label>
        <div className="flex gap-2">
           <button type="button" onClick={() => handleScroll('left')} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-zinc-500">
             <ChevronLeft size={18} />
           </button>
           <button type="button" onClick={() => handleScroll('right')} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-zinc-500">
             <ChevronRight size={18} />
           </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((date, i) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(date)}
              className={`flex-shrink-0 snap-center w-[72px] h-[90px] rounded-[24px] flex flex-col items-center justify-center transition-all duration-300 border ${
                isSelected 
                  ? "bg-brand-primary border-brand-primary shadow-[0_15px_30px_-10px_rgba(249,115,22,0.5)] scale-[1.05]" 
                  : "glass-panel border-white/5 hover:border-brand-primary/20 bg-white/[0.02]"
              }`}
            >
              <span className={`text-[9px] font-extrabold uppercase tracking-[0.15em] ${isSelected ? "text-background" : "text-zinc-500"}`}>
                {formatDay(date)}
              </span>
              <span className={`text-2xl font-heading font-extrabold mt-1.5 leading-none ${isSelected ? "text-background" : "text-foreground"}`}>
                {formatDate(date)}
              </span>
              {isToday && !isSelected && (
                 <div className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-2 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
