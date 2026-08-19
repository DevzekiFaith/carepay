"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ShieldCheck, Zap } from "lucide-react";

// Remove default leaflet icon broken URL lookup
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

const createRadarIcon = (color: string, label: string) => new L.DivIcon({
  className: "bg-transparent",
  html: `<div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
            <div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 16px ${color}; position: relative; z-index: 2;"></div>
            <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; position: absolute; top: -10px; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="margin-top: 4px; background: rgba(15, 23, 42, 0.9); color: white; font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 6px; white-space: nowrap; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 10px rgba(0,0,0,0.3);">${label}</div>
         </div>`,
  iconSize: [34, 48],
  iconAnchor: [17, 24],
});

const userIcon = createRadarIcon("#0284c7", "You");
const plumberIcon = createRadarIcon("#10b981", "Plumber · 4m");
const sparkIcon = createRadarIcon("#f59e0b", "Electrician · 8m");
const acIcon = createRadarIcon("#38bdf8", "AC Tech · 12m");

interface CityLocation {
  name: string;
  center: [number, number];
  zoom: number;
}

const CITIES: CityLocation[] = [
  { name: "Lagos (Lekki)", center: [6.4474, 3.4735], zoom: 13 },
  { name: "Abuja (Wuse)", center: [9.0667, 7.4833], zoom: 13 },
  { name: "Port Harcourt", center: [4.8156, 7.0498], zoom: 13 },
  { name: "Enugu", center: [6.4584, 7.5464], zoom: 13 },
];

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function RealTimeMap() {
  const [mounted, setMounted] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityLocation>(CITIES[0]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full aspect-square md:aspect-video lg:aspect-square bg-slate-900 rounded-3xl animate-pulse flex items-center justify-center border border-sky-500/20 shadow-2xl">
        <div className="flex items-center gap-3 text-sky-400 font-bold uppercase tracking-widest text-xs">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span>Initializing Carto GPS Engine...</span>
        </div>
      </div>
    );
  }

  // Generate dynamic nearby artisan coordinates around selected city center
  const [lat, lng] = selectedCity.center;
  const p1: [number, number] = [lat + 0.007, lng + 0.009];
  const p2: [number, number] = [lat - 0.006, lng - 0.008];
  const p3: [number, number] = [lat + 0.004, lng - 0.006];

  return (
    <div className="relative w-full aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden border-2 border-sky-500/20 shadow-2xl bg-slate-950">
      
      {/* City Switcher Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 pl-2 pr-1 hidden sm:inline">
          Radar Zone:
        </span>
        {CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => setSelectedCity(city)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCity.name === city.name
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/40"
                : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      <MapContainer 
        center={selectedCity.center} 
        zoom={selectedCity.zoom} 
        scrollWheelZoom={false} 
        className="w-full h-full"
        zoomControl={false}
      >
        <ChangeView center={selectedCity.center} zoom={selectedCity.zoom} />

        {/* CartoDB Voyager TileLayer for crisp, high-resolution urban topography */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        
        {/* Customer Location */}
        <Marker position={selectedCity.center} icon={userIcon}>
          <Popup className="custom-popup">
            <div className="p-2 text-center">
              <p className="text-xs font-black text-slate-900 uppercase">Your Dispatch Location</p>
              <p className="text-[10px] text-sky-600 font-semibold mt-0.5">3 Verified Artisans within 2km</p>
            </div>
          </Popup>
        </Marker>
        <Circle 
          center={selectedCity.center} 
          radius={1200} 
          pathOptions={{ color: '#0284c7', fillColor: '#0284c7', fillOpacity: 0.08, weight: 1.5 }} 
        />

        {/* Nearby Artisan 1 */}
        <Marker position={p1} icon={plumberIcon}>
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-black uppercase">
                <ShieldCheck size={14} /> Verified Plumber
              </div>
              <p className="text-xs font-extrabold text-slate-900 mt-1">Emeka N. · 4.9 ★</p>
              <p className="text-[10px] text-slate-500">In transit · ETA: 4 mins</p>
            </div>
          </Popup>
        </Marker>

        {/* Nearby Artisan 2 */}
        <Marker position={p2} icon={sparkIcon}>
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-amber-600 text-xs font-black uppercase">
                <Zap size={14} /> Certified Electrician
              </div>
              <p className="text-xs font-extrabold text-slate-900 mt-1">Tunde A. · 5.0 ★</p>
              <p className="text-[10px] text-slate-500">Equipped for call-out · ETA: 8 mins</p>
            </div>
          </Popup>
        </Marker>

        {/* Nearby Artisan 3 */}
        <Marker position={p3} icon={acIcon}>
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-1.5 text-sky-600 text-xs font-black uppercase">
                <ShieldCheck size={14} /> AC & Fridge Tech
              </div>
              <p className="text-xs font-extrabold text-slate-900 mt-1">Chidi O. · 4.8 ★</p>
              <p className="text-[10px] text-slate-500">Available on demand · ETA: 12 mins</p>
            </div>
          </Popup>
        </Marker>

      </MapContainer>

      {/* Floating Live Dispatch Badge */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <p className="text-xs font-extrabold text-white">Live Artisan Radar Active</p>
            <p className="text-[10px] text-sky-300 font-semibold">Leaflet + Carto GPS Engine</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
            15m Avg Arrival
          </span>
        </div>
      </div>

    </div>
  );
}
