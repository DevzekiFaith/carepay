"use client";

import { useState, useEffect } from "react";

interface MockMapProps {
    interactive?: boolean;
    showRoute?: boolean;
    onLocationSelect?: (location: string) => void;
    height?: string;
    className?: string;
}

export default function MockMap({
    interactive = true,
    showRoute = false,
    onLocationSelect,
    height = "300px",
    className = ""
}: MockMapProps) {
    const [pinPos, setPinPos] = useState({ x: 40, y: 50 });
    const [isPulsing, setIsPulsing] = useState(true);

    const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!interactive) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPinPos({ x, y });
        if (onLocationSelect) {
            onLocationSelect(`Area ${Math.floor(x / 10)}${Math.floor(y / 10)}`);
        }
    };

    return (
        <div className={`relative overflow-hidden rounded-3xl border-2 border-stone-100 bg-stone-50 shadow-inner ${className}`} style={{ height }}>
            {/* Search Overlay */}
            {interactive && (
                <div className="absolute left-4 top-4 z-10 w-64 animate-fade-in">
                    <div className="flex items-center gap-2 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur-sm ring-1 ring-stone-100">
                        <span className="text-stone-400">📍</span>
                        <input
                            readOnly
                            value={`GPS: ${pinPos.x.toFixed(1)}, ${pinPos.y.toFixed(1)}`}
                            className="w-full bg-transparent text-[10px] font-black uppercase tracking-widest text-stone-900 outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Stylized Map SVG */}
            <svg
                className="h-full w-full cursor-crosshair opacity-90 transition-opacity hover:opacity-100"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                onClick={handleMapClick}
            >
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                    </pattern>
                    <radialGradient id="proGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Background Grid */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Simulated Roads/Blocks */}
                <path d="M 0 20 L 100 20 M 20 0 L 20 100 M 0 60 L 100 60 M 70 0 L 70 100" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <path d="M 30 30 L 60 30 L 60 80" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" fill="none" />

                {/* Mock Landmarks */}
                <rect x="10" y="25" width="15" height="10" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
                <rect x="75" y="10" width="10" height="20" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
                <rect x="40" y="70" width="20" height="15" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />

                {/* Pulse Animations for 'PROS NEARBY' */}
                {[{ x: 30, y: 40 }, { x: 65, y: 75 }, { x: 80, y: 30 }].map((pro, i) => (
                    <g key={i}>
                        <circle cx={pro.x} cy={pro.y} r="6" fill="url(#proGlow)">
                            <animate attributeName="r" values="3;7;3" dur={`${2 + i}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${2 + i}s`} repeatCount="indefinite" />
                        </circle>
                        <circle cx={pro.x} cy={pro.y} r="1.5" fill="#10b981" className="shadow-sm" />
                    </g>
                ))}

                {/* Route Line (Simulated Routing) */}
                {showRoute && (
                    <g className="animate-draw-path">
                        <path
                            d={`M 20 80 L 20 50 L ${pinPos.x} ${pinPos.y}`}
                            fill="none"
                            stroke="#059669"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                        >
                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" fill="freeze" />
                        </path>
                        {/* Origin Dot */}
                        <circle cx="20" cy="80" r="1.5" fill="#059669" />
                    </g>
                )}

                {/* Active Pin Selection */}
                <g transform={`translate(${pinPos.x}, ${pinPos.y - 4})`} className="animate-bounce-slow">
                    <path
                        d="M 0 0 C -2 -4 -4 -4 -4 -8 C -4 -10 -2 -12 0 -12 C 2 -12 4 -10 4 -8 C 4 -4 2 -4 0 0 Z"
                        fill="#10b981"
                        stroke="white"
                        strokeWidth="1"
                    />
                    <circle cx="0" cy="-8" r="1.5" fill="white" />
                </g>
            </svg>

            {/* Map Hint */}
            <div className="absolute bottom-4 right-4 z-10">
                <span className="rounded-full bg-stone-900/80 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                    {interactive ? "Tap to Pin Work Location" : "Real-time Route Active"}
                </span>
            </div>
        </div>
    );
}
