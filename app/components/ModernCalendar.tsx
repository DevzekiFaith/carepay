"use client";

import { useState } from "react";

interface ModernCalendarProps {
    onSelect: (date: Date) => void;
    selectedDate: Date | null;
}

const TIME_SLOTS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
    "04:00 PM", "05:00 PM"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ModernCalendar({ onSelect, selectedDate }: ModernCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (selectedTime) {
            const [time, period] = selectedTime.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;
            newDate.setHours(hours, minutes);
        }
        onSelect(newDate);
    };

    const handleTimeClick = (time: string) => {
        setSelectedTime(time);
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            const [t, p] = time.split(" ");
            let [h, m] = t.split(":").map(Number);
            if (p === "PM" && h !== 12) h += 12;
            if (p === "AM" && h === 12) h = 0;
            newDate.setHours(h, m);
            onSelect(newDate);
        }
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    return (
        <div className="w-full max-w-md rounded-3xl border-2 border-stone-100 bg-white p-6 shadow-xl shadow-stone-200/20">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-stone-900">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-100 hover:bg-stone-50">←</button>
                    <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-100 hover:bg-stone-50">→</button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-4">
                {DAYS.map(day => (
                    <span key={day} className="text-[10px] font-black uppercase tracking-widest text-stone-400">{day}</span>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth.getMonth() && selectedDate?.getFullYear() === currentMonth.getFullYear();
                    return (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold transition-all ${isSelected
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-2 ring-emerald-50"
                                    : "text-stone-700 hover:bg-emerald-50 hover:text-emerald-700"
                                }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 border-t border-stone-50 pt-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Available Times</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {TIME_SLOTS.map(time => (
                        <button
                            key={time}
                            onClick={() => handleTimeClick(time)}
                            className={`rounded-xl border-2 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedTime === time
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                    : "border-stone-50 bg-stone-50/50 text-stone-500 hover:border-emerald-200 hover:bg-white hover:text-emerald-600"
                                }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
