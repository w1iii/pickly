"use client";

import dynamic from "next/dynamic";

const CourtMap = dynamic(() => import("@/components/court-map"), {
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
      Loading map...
    </div>
  ),
});

export default function MapWrapper({
  courts,
  height,
  zoom,
}: {
  courts: Array<{ id: string; name: string; lat: number; lng: number; address: string }>;
  height?: string;
  zoom?: number;
}) {
  return <CourtMap courts={courts} height={height} zoom={zoom} />;
}
