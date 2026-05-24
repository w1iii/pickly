"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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
          background: "var(--color-bg-tertiary)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-muted)",
          fontSize: "var(--text-sm)",
        }}
      >
        Loading map...
      </div>
    );
  }

  return <CourtMap courts={courts} height="300px" zoom={15} />;
}
