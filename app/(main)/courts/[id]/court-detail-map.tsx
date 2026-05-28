"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CourtMap3D = dynamic(() => import("@/components/court-map-3d"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-muted)",
        fontSize: "var(--text-sm)",
      }}
    >
      Loading 3D map...
    </div>
  ),
});

export default function CourtDetailMap({
  courts,
}: {
  courts: Array<{ id: string; name: string; lat: number; lng: number; address: string }>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg-secondary)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-muted)",
          fontSize: "var(--text-sm)",
        }}
      >
        Loading 3D map...
      </div>
    );
  }

  const center: [number, number] = courts.length === 1
    ? [courts[0].lng, courts[0].lat]
    : [122.9491, 10.6676];

  return <CourtMap3D courts={courts} height="300px" zoom={15} center={center} />;
}
