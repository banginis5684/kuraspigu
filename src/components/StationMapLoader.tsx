"use client";

import dynamic from "next/dynamic";

const StationMap = dynamic(() => import("./StationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full animate-pulse border-y border-border bg-muted" />
  ),
});

export function StationMapLoader() {
  return <StationMap />;
}
