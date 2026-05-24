"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface CourtMapProps {
  courts: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
  }>;
  onCourtClick?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function CourtMap({
  courts,
  onCourtClick,
  center = [30.2672, -97.7431], // Austin, TX default
  zoom = 12,
  height = "400px",
}: CourtMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    courts.forEach((court) => {
      const marker = L.marker([court.lat, court.lng]).addTo(map);
      marker.bindPopup(
        `<strong>${court.name}</strong><br/>${court.address}`
      );

      if (onCourtClick) {
        marker.on("click", () => onCourtClick(court.id));
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [courts, center, zoom, onCourtClick]);

  return <div ref={containerRef} style={{ height, width: "100%", borderRadius: "var(--radius-lg)" }} />;
}
