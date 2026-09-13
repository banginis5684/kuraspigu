"use client";

import dynamic from "next/dynamic";

const MapExplorer = dynamic(() => import("./MapExplorer"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full animate-pulse bg-muted" />
  ),
});

export function MapExplorerLoader() {
  return <MapExplorer />;
}
