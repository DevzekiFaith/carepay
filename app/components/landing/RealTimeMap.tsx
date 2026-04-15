"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Remove default leaflet icon to prevent broken images
delete (L.Icon.Default.prototype as any)._getIconUrl;

const createPulseIcon = (color: string) => new L.DivIcon({
  className: "bg-transparent",
  html: `<div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 15px ${color}; position: absolute; z-index: 2;"></div>
            <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; position: absolute; opacity: 0.3; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const userIcon = createPulseIcon("#f97316"); // brand-primary
const providerIcon = createPulseIcon("#3b82f6"); // blue

// Coordinates around Lagos/Enugu
const center: [number, number] = [6.4584, 7.5464]; // Enugu

export default function RealTimeMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-zinc-900 rounded-3xl animate-pulse flex items-center justify-center">
        <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Loading GPS...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
      <MapContainer 
        center={center} 
        zoom={14} 
        scrollWheelZoom={false} 
        className="w-full h-full bg-[#0a0a0c]"
        zoomControl={false}
      >
        {/* CartoDB Dark Matter tiles perfect for Uber-style radar */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* User Location */}
        <Marker position={center} icon={userIcon}>
          <Popup className="bg-zinc-900 border border-white/10 text-white rounded-lg p-0 m-0">
            <div className="bg-zinc-900 p-2 rounded text-white text-xs font-bold uppercase tracking-wider text-center">My Location</div>
          </Popup>
        </Marker>
        <Circle center={center} radius={1000} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.05, stroke: false }} />

        {/* Dummy Provider 1 */}
        <Marker position={[6.4630, 7.5500]} icon={providerIcon}>
           <Popup>
            <div className="bg-zinc-900 px-3 py-1 rounded text-[10px] font-bold tracking-wider text-white border border-white/10">ETA: 4 MINS</div>
           </Popup>
        </Marker>

        {/* Dummy Provider 2 */}
        <Marker position={[6.4510, 7.5400]} icon={providerIcon}>
           <Popup>
            <div className="bg-zinc-900 px-3 py-1 rounded text-[10px] font-bold tracking-wider text-white border border-white/10">JOHN (PLUMBER)</div>
           </Popup>
        </Marker>

      </MapContainer>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0c] to-transparent z-[1000] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0a0c] to-transparent z-[1000] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0c] to-transparent z-[1000] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0c] to-transparent z-[1000] pointer-events-none" />
    </div>
  );
}
