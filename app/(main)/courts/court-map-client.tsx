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

interface CourtItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

export default function CourtMapClient({
  courts,
  height,
}: {
  courts: CourtItem[];
  height?: string;
}) {
  return <CourtMap courts={courts} height={height} />;
}
