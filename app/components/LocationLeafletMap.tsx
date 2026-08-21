"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom emerald pin icon for selected area
const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Blue icon for other areas
const otherIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  shadowSize: [33, 33],
});

interface AreaPoint {
  name: string;
  lat: number;
  lng: number;
}

interface FlyToProps {
  lat: number;
  lng: number;
  zoom: number;
}

// Inner component to animate pan on coordinate change
function FlyTo({ lat, lng, zoom }: FlyToProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { animate: true, duration: 0.8 });
  }, [lat, lng, zoom]);
  return null;
}

interface Props {
  lat: number;
  lng: number;
  zoom: number;
  areaName: string;
  allAreas: AreaPoint[];
}

export default function LocationLeafletMap({ lat, lng, zoom, areaName, allAreas }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      attributionControl={true}
    >
      {/* Carto Voyager tile layer — clean, modern map style */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {/* Fly to newly selected coordinates */}
      <FlyTo lat={lat} lng={lng} zoom={zoom} />

      {/* Selected area — prominent green marker */}
      <Marker position={[lat, lng]} icon={selectedIcon}>
        <Popup>
          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 12 }}>
            <strong style={{ fontSize: 13 }}>📍 {areaName}</strong>
            <br />
            <span style={{ color: "#16a34a" }}>✓ HomeCare Service Zone</span>
          </div>
        </Popup>
      </Marker>

      {/* All other service areas in the city — blue markers */}
      {allAreas
        .filter(a => a.name !== areaName)
        .map(area => (
          <Marker key={area.name} position={[area.lat, area.lng]} icon={otherIcon}>
            <Popup>
              <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 12 }}>
                <strong>{area.name}</strong>
                <br />
                <span style={{ color: "#2563eb" }}>Service Area</span>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
