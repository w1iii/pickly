"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface CourtItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  num_courts?: number;
  indoor?: boolean;
  surface_type?: string;
}

interface CourtMap3DProps {
  courts: CourtItem[];
  onCourtClick?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function CourtMap3D({
  courts,
  onCourtClick,
  center = [122.9491, 10.6676],
  zoom = 12.5,
  height = "400px",
}: CourtMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center,
      zoom,
      pitch: 50,
      bearing: 10,
      attributionControl: false,
    } as maplibregl.MapOptions);

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.on("style.load", () => {
      map.addSource("courtsSource", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "courts-glow",
        type: "circle",
        source: "courtsSource",
        paint: {
          "circle-radius": ["interpolate", ["exponential", 1.5], ["zoom"], 10, 6, 16, 20],
          "circle-color": "#3b82f6",
          "circle-opacity": 0.15,
          "circle-blur": 1,
        },
      });

      map.addLayer({
        id: "courts-pulse",
        type: "circle",
        source: "courtsSource",
        paint: {
          "circle-radius": ["interpolate", ["exponential", 1.5], ["zoom"], 10, 4, 16, 12],
          "circle-color": "#60a5fa",
          "circle-opacity": 0.3,
          "circle-blur": 0.5,
        },
      });

      map.addLayer({
        id: "courts-dot",
        type: "circle",
        source: "courtsSource",
        paint: {
          "circle-radius": ["interpolate", ["exponential", 1.5], ["zoom"], 10, 3, 16, 8],
          "circle-color": "#2563eb",
          "circle-stroke-color": "#93c5fd",
          "circle-stroke-width": 2,
        },
      });

      map.addLayer({
        id: "courts-label",
        type: "symbol",
        source: "courtsSource",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 11,
          "text-offset": [0, -1.5],
          "text-anchor": "bottom",
        },
        paint: {
          "text-color": "#1e293b",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
          "text-halo-blur": 1,
        },
      });

      map.addLayer({
        id: "courts-count",
        type: "symbol",
        source: "courtsSource",
        filter: ["has", "num_courts"],
        layout: {
          "text-field": ["get", "num_courts"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 10,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      const courtFeatures = courts.map((c) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [c.lng, c.lat] },
        properties: {
          id: c.id,
          name: c.name,
          address: c.address,
          num_courts: c.num_courts ?? 1,
          indoor: c.indoor ?? false,
        },
      }));

      const source = map.getSource("courtsSource") as maplibregl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: courtFeatures,
        });
      }

      map.getCanvas().style.cursor = "pointer";
    });

    map.on("click", "courts-dot", (e) => {
      if (e.features?.[0]?.properties?.id && onCourtClick) {
        onCourtClick(e.features[0].properties.id);
      }
    });

    map.on("click", "courts-label", (e) => {
      if (e.features?.[0]?.properties?.id && onCourtClick) {
        onCourtClick(e.features[0].properties.id);
      }
    });

    map.on("mouseenter", "courts-dot", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "courts-dot", () => {
      map.getCanvas().style.cursor = "";
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [courts, center, zoom, onCourtClick]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%", borderRadius: "var(--radius-lg)", overflow: "hidden" }}
    />
  );
}
