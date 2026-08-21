"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

// City coordinate data mapped by state → city → areas with lat/lng
export interface AreaPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface CityData {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  areas: AreaPoint[];
}

export interface StateData {
  label: string;
  cities: Record<string, CityData>;
}

export const NIGERIA_STATES: Record<string, StateData> = {
  enugu: {
    label: "Enugu State",
    cities: {
      enugu: {
        name: "Enugu Urban",
        lat: 6.4527,
        lng: 7.5108,
        zoom: 13,
        areas: [
          { name: "Independence Layout", lat: 6.4574, lng: 7.5200 },
          { name: "GRA", lat: 6.4480, lng: 7.5050 },
          { name: "New Haven", lat: 6.4620, lng: 7.5280 },
          { name: "Abakpa", lat: 6.4750, lng: 7.5400 },
          { name: "Thinkers Corner", lat: 6.4900, lng: 7.5500 },
          { name: "Emene", lat: 6.4200, lng: 7.5750 },
          { name: "Trans Ekulu", lat: 6.4650, lng: 7.5350 },
          { name: "Coal Camp", lat: 6.4400, lng: 7.5180 },
        ],
      },
    },
  },
  lagos: {
    label: "Lagos State",
    cities: {
      lagos_island: {
        name: "Lagos Island / VI",
        lat: 6.4281,
        lng: 3.4219,
        zoom: 13,
        areas: [
          { name: "Victoria Island", lat: 6.4317, lng: 3.4118 },
          { name: "Lekki Phase 1", lat: 6.4354, lng: 3.4759 },
          { name: "Ikoyi", lat: 6.4530, lng: 3.4451 },
          { name: "Oniru", lat: 6.4302, lng: 3.4592 },
        ],
      },
      lagos_mainland: {
        name: "Lagos Mainland",
        lat: 6.5244,
        lng: 3.3792,
        zoom: 13,
        areas: [
          { name: "Ikeja", lat: 6.6018, lng: 3.3515 },
          { name: "Surulere", lat: 6.4972, lng: 3.3490 },
          { name: "Yaba", lat: 6.5091, lng: 3.3761 },
          { name: "Ajah", lat: 6.4651, lng: 3.5637 },
        ],
      },
    },
  },
  abuja: {
    label: "FCT — Abuja",
    cities: {
      abuja: {
        name: "Abuja Central",
        lat: 9.0579,
        lng: 7.4951,
        zoom: 13,
        areas: [
          { name: "Wuse", lat: 9.0625, lng: 7.4735 },
          { name: "Maitama", lat: 9.0855, lng: 7.4916 },
          { name: "Garki", lat: 9.0454, lng: 7.4836 },
          { name: "Asokoro", lat: 9.0376, lng: 7.5269 },
          { name: "Gwarinpa", lat: 9.1209, lng: 7.4021 },
          { name: "Kubwa", lat: 9.1369, lng: 7.3490 },
        ],
      },
    },
  },
  rivers: {
    label: "Rivers State",
    cities: {
      portharcourt: {
        name: "Port Harcourt",
        lat: 4.8156,
        lng: 7.0498,
        zoom: 13,
        areas: [
          { name: "GRA Phase 1", lat: 4.7981, lng: 7.0108 },
          { name: "GRA Phase 2", lat: 4.8052, lng: 7.0184 },
          { name: "Old GRA", lat: 4.8009, lng: 7.0037 },
          { name: "Rumuola", lat: 4.8315, lng: 7.0612 },
          { name: "Diobu", lat: 4.8231, lng: 7.0389 },
        ],
      },
    },
  },
  ogun: {
    label: "Ogun State",
    cities: {
      abeokuta: {
        name: "Abeokuta",
        lat: 7.1557,
        lng: 3.3451,
        zoom: 13,
        areas: [
          { name: "Ibara", lat: 7.1470, lng: 3.3360 },
          { name: "Oke-Mosan", lat: 7.1651, lng: 3.3542 },
          { name: "Kuto", lat: 7.1540, lng: 3.3460 },
          { name: "Adigbe", lat: 7.1430, lng: 3.3280 },
          { name: "Obantoko", lat: 7.1350, lng: 3.3190 },
        ],
      },
    },
  },
};

interface LocationMapPickerProps {
  selectedState: string;
  selectedCity: string;
  selectedArea: string;
  onStateChange: (s: string) => void;
  onCityChange: (c: string) => void;
  onAreaChange: (a: string) => void;
}

// Dynamically import the actual map (SSR-safe)
const LeafletMap = dynamic(() => import("./LocationLeafletMap"), { ssr: false });

export default function LocationMapPicker({
  selectedState,
  selectedCity,
  selectedArea,
  onStateChange,
  onCityChange,
  onAreaChange,
}: LocationMapPickerProps) {
  const stateData = selectedState ? NIGERIA_STATES[selectedState] : null;
  const cityKeys = stateData ? Object.keys(stateData.cities) : [];
  const cityData = (stateData && selectedCity) ? stateData.cities[selectedCity] : null;
  const areas = cityData?.areas ?? [];

  // Auto-select first city when state changes
  useEffect(() => {
    if (cityKeys.length > 0 && !cityKeys.includes(selectedCity)) {
      onCityChange(cityKeys[0]);
    }
  }, [selectedState]);

  // Auto-select first area when city changes
  useEffect(() => {
    if (areas.length > 0 && !areas.find(a => a.name === selectedArea)) {
      onAreaChange(areas[0].name);
    }
  }, [selectedCity]);

  const selectedAreaPoint = areas.find(a => a.name === selectedArea) || (cityData ? { lat: cityData.lat, lng: cityData.lng, name: selectedArea } : null);

  return (
    <div className="space-y-4">
      {/* Cascading Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* State */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
            State
          </label>
          <select
            value={selectedState}
            onChange={e => onStateChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 cursor-pointer"
          >
            <option value="">— Select State —</option>
            {Object.entries(NIGERIA_STATES).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
            City / Zone
          </label>
          <select
            value={selectedCity}
            onChange={e => onCityChange(e.target.value)}
            disabled={!selectedState}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 cursor-pointer disabled:opacity-40"
          >
            <option value="">— Select City —</option>
            {cityKeys.map(k => (
              <option key={k} value={k}>{stateData!.cities[k].name}</option>
            ))}
          </select>
        </div>

        {/* Area / LGA */}
        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
            Area / LGA
          </label>
          <select
            value={selectedArea}
            onChange={e => onAreaChange(e.target.value)}
            disabled={!selectedCity}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 cursor-pointer disabled:opacity-40"
          >
            <option value="">— Select Area —</option>
            {areas.map(a => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Badge */}
      {selectedArea && cityData && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
          <MapPin size={13} className="shrink-0 text-emerald-600" />
          <span>
            Coverage zone: <strong>{selectedArea}</strong>, {cityData.name} — {stateData?.label}
          </span>
        </div>
      )}

      {/* Leaflet Map */}
      {cityData && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 280 }}>
          <LeafletMap
            lat={selectedAreaPoint?.lat ?? cityData.lat}
            lng={selectedAreaPoint?.lng ?? cityData.lng}
            zoom={cityData.zoom}
            areaName={selectedArea || cityData.name}
            allAreas={areas}
          />
        </div>
      )}
    </div>
  );
}
