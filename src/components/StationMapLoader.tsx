"use client";

import dynamic from "next/dynamic";

const StationMap = dynamic(() => import("./StationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] animate-pulse rounded-2xl border border-border bg-muted" />
  ),
});

export function StationMapLoader() {
  return <StationMap />;
}
