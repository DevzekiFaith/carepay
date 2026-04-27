"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Emerald Icon
const emeraldIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
});

interface LiveMapProps {
    interactive?: boolean;
    showRoute?: boolean;
    onLocationSelect?: (location: string) => void;
    onAddressResolved?: (address: string) => void;
    onSuggestionsFound?: (suggestions: Array<{ lat: string, lon: string, display_name: string, importance: number }>) => void;
    address?: string;
    height?: string;
    className?: string;
    initialCenter?: [number, number];
    onSearchStateChange?: (searching: boolean) => void;
    trackingJobId?: string;
}

function LocationMarker({ onSelect, onPositionChange, onAddressResolved }: {
    onSelect?: (location: string) => void,
    onPositionChange?: (pos: L.LatLng) => void,
    onAddressResolved?: (address: string) => void
}) {
    const [position, setPosition] = useState<L.LatLng | null>(null);
    const map = useMapEvents({
        async click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
            if (onSelect) {
                onSelect(`${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
            }
            if (onPositionChange) {
                onPositionChange(e.latlng);
            }

            // Reverse Geocoding
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`);
                const data = await res.json();
                if (data.display_name && onAddressResolved) {
                    onAddressResolved(data.display_name);
                }
            } catch (err) {
                console.error("Geocoding error:", err);
            }
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Service Location</Popup>
        </Marker>
    );
}

// Map Controller for Forward Geocoding
function MapController({ address, onPositionChange, onSuggestionsFound, onSearchStateChange }: {
    address?: string,
    onPositionChange: (pos: L.LatLng) => void,
    onSuggestionsFound?: (suggestions: Array<{ lat: string, lon: string, display_name: string, importance: number }>) => void,
    onSearchStateChange?: (searching: boolean) => void
}) {
    const map = useMap();

    useEffect(() => {
        if (!address || address.length < 5) {
            if (onSuggestionsFound) onSuggestionsFound([]);
            return;
        }

        const timer = setTimeout(async () => {
            if (onSearchStateChange) onSearchStateChange(true);
            try {
                // Fetch more results to provide suggestions
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=5&countrycodes=ng`);
                const data = await res.json();

                if (onSuggestionsFound) {
                    onSuggestionsFound(data);
                }

                if (data && data.length > 0) {
                    const { lat, lon, importance } = data[0];
                    const pos = new L.LatLng(parseFloat(lat), parseFloat(lon));

                    // Only flyTo if the result is reasonably specific (importance > 0.4)
                    // or if it's the exact first match for a long string
                    if (importance > 0.4 || address.split(' ').length > 2) {
                        map.flyTo(pos, 16);
                        onPositionChange(pos);
                    }
                }
            } catch (err) {
                console.error("Forward geocoding error:", err);
            } finally {
                if (onSearchStateChange) onSearchStateChange(false);
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [address, map, onPositionChange, onSuggestionsFound, onSearchStateChange]);

    return null;
}

export default function LiveMap({
    interactive = true,
    showRoute = false,
    onLocationSelect,
    onAddressResolved,
    onSuggestionsFound,
    address,
    height = "400px",
    className = "",
    initialCenter = [6.4584, 7.5464], // Enugu, Nigeria default
    onSearchStateChange,
    trackingJobId
}: LiveMapProps) {
    const [mounted] = useState(true);
    const [targetPos, setTargetPos] = useState<L.LatLng | null>(null);
    const [proPos, setProPos] = useState<[number, number] | null>(null);

    // Handle real-time tracking if trackingJobId is provided, else fallback to mock
    useEffect(() => {
        if (!trackingJobId) {
            if (targetPos) {
                const timeout = setTimeout(() => {
                    setProPos([
                        targetPos.lat + (Math.random() - 0.5) * 0.02,
                        targetPos.lng + (Math.random() - 0.5) * 0.02
                    ]);
                }, 800);
                return () => clearTimeout(timeout);
            } else {
                setTimeout(() => setProPos(null), 0);
            }
            return;
        }

        // Real-time tracking
        const supabase = createClient();
        const channel = supabase.channel(`tracking:${trackingJobId}`)
            .on(
                'broadcast',
                { event: 'location' },
                (payload: any) => {
                    const { lat, lng } = payload.payload;
                    setProPos([lat, lng]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [trackingJobId, targetPos]);

    if (!mounted) return <div style={{ height }} className={`bg-stone-100 animate-pulse rounded-3xl ${className}`} />;

    return (
        <div className={`relative overflow-hidden rounded-3xl border-2 border-stone-100 shadow-xl ${className}`} style={{ height }}>
            <MapContainer
                center={initialCenter}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                    address={address}
                    onPositionChange={setTargetPos}
                    onSuggestionsFound={onSuggestionsFound}
                    onSearchStateChange={onSearchStateChange}
                />

                {interactive && <LocationMarker
                    onSelect={onLocationSelect}
                    onPositionChange={setTargetPos}
                    onAddressResolved={onAddressResolved}
                />}

                {(showRoute || proPos) && targetPos && proPos && (
                    <>
                        <Marker position={proPos} icon={emeraldIcon}>
                            <Popup>Nearest HomePro</Popup>
                        </Marker>

                        <Polyline
                            positions={[proPos, [targetPos.lat, targetPos.lng]]}
                            color="#10b981"
                            weight={4}
                            dashArray="8, 12"
                            className="animate-pulse"
                        />
                        {targetPos && <Marker position={targetPos} />}
                    </>
                )}
            </MapContainer>

            {/* Control Overlay */}
            <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2 items-end">
                {proPos && (
                    <div className="animate-success-pop rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur-md border border-emerald-100 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs animate-bounce">🚗</div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Pro Found Nearby</p>
                            <p className="text-[10px] font-bold text-stone-900">Est: 8 mins arrival</p>
                        </div>
                    </div>
                )}
                <span className="rounded-full bg-stone-900/90 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-2xl ring-1 ring-white/20">
                    {interactive ? (targetPos ? "Location Confirmed" : "Tap Map to Set Location") : "Real-Time Tracking Live"}
                </span>
            </div>
        </div>
    );
}
