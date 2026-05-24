"use client";

import dynamic from "next/dynamic";

const CourtMap3D = dynamic(() => import("@/components/court-map-3d"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-tertiary)",
        color: "var(--color-text-muted)",
        fontSize: "var(--text-sm)",
      }}
    >
      Loading 3D map...
    </div>
  ),
});

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

export default function CourtMapClient({
  courts,
  height,
  center,
  zoom,
}: {
  courts: CourtItem[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <CourtMap3D
      courts={courts}
      height={height}
      center={center}
      zoom={zoom}
    />
  );
}
