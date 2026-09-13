"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import {
  CITIES,
  COMPANIES_COUNT,
  FUEL_TYPES,
  LAST_UPDATED,
  STATIONS,
  formatPrice,
  priceRange,
} from "@/lib/data";
import { clusterIcon, popupHtml, priceIcon } from "@/lib/map-icons";
import { companySlug } from "@/lib/slug";
import type { FuelType, Station } from "@/lib/types";

const LITHUANIA_CENTER: [number, number] = [55.1694, 23.8813];
const ALL_CITIES = "Visos savivaldybės";

function downloadCsv(stations: Station[]) {
  const header = ["Savivaldybė", "Įmonė", "Degalinė", "Adresas", "A95", "Dyzelinas", "SND"];
  const rows = stations.map((s) => [
    s.city,
    s.company,
    s.brand,
    s.address,
    s.prices.a95 ?? "",
    s.prices.diesel ?? "",
    s.prices.lpg ?? "",
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kuraspigu-degalu-kainos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ClusterLayer({
  stations,
  fuel,
  cheapestId,
  selectedId,
}: {
  stations: Station[];
  fuel: FuelType;
  cheapestId: string | null;
  selectedId: string | null;
}) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction: (cluster) => clusterIcon(cluster.getChildCount()),
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
    });

    const markers: Record<string, L.Marker> = {};
    for (const s of stations) {
      const price = s.prices[fuel];
      if (price == null) continue;
      const marker = L.marker([s.lat, s.lng], {
        icon: priceIcon(price, s.id === cheapestId, s.company),
      });
      marker.bindPopup(
        popupHtml({
          brand: s.company,
          city: s.city,
          address: s.brand !== s.company ? `${s.address} · ${s.brand}` : s.address,
          isCheapest: s.id === cheapestId,
          company: s.company,
          fuelRows: FUEL_TYPES.map((f) => ({
            label: f.shortLabel,
            value: formatPrice(s.prices[f.id]),
            highlighted: f.id === fuel,
          })),
        })
      );
      clusterGroup.addLayer(marker);
      markers[s.id] = marker;
    }
    markersRef.current = markers;

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, stations, fuel, cheapestId]);

  useEffect(() => {
    if (!selectedId) return;
    const marker = markersRef.current[selectedId];
    const group = clusterGroupRef.current;
    if (!marker || !group) return;
    group.zoomToShowLayer(marker, () => marker.openPopup());
  }, [selectedId]);

  return null;
}

export default function MapExplorer() {
  const [fuel, setFuel] = useState<FuelType>("a95");
  const [city, setCity] = useState<string>(ALL_CITIES);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stations = useMemo(() => {
    const filtered = STATIONS.filter(
      (s) => (city === ALL_CITIES || s.city === city) && s.prices[fuel] != null
    );
    return filtered.sort((a, b) => a.prices[fuel]! - b.prices[fuel]!);
  }, [city, fuel]);

  const cheapestId = stations[0]?.id ?? null;
  const range = priceRange(fuel);

  return (
    <div>
      {/* stats bar */}
      <div className="border-y border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 sm:px-6 md:grid-cols-4">
          <Stat label="Savivaldybės" value={String(CITIES.length)} />
          <Stat label="Įmonės" value={String(COMPANIES_COUNT)} />
          <Stat label="Degalinės" value={String(STATIONS.length)} />
          <Stat label="Atnaujinta" value={LAST_UPDATED ?? "—"} />
        </div>
        {range && (
          <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
            <div className="flex items-center justify-between text-xs font-medium text-background/70">
              <span>MIN {formatPrice(range.min)}</span>
              <span>VID. {formatPrice(range.avg)}</span>
              <span>MAX {formatPrice(range.max)}</span>
            </div>
            <div className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background/20">
              <div className="h-full w-full bg-gradient-to-r from-brand-yellow via-brand-brown to-background/40" />
            </div>
          </div>
        )}
      </div>

      {/* sidebar + map */}
      <div className="flex flex-col md:h-[720px] md:flex-row">
        <div className="flex flex-col border-b border-border md:h-full md:w-[380px] md:shrink-0 md:border-b-0 md:border-r">
          <div className="space-y-3 border-b border-border p-4">
            <div className="flex flex-wrap gap-2">
              {FUEL_TYPES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFuel(f.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    fuel === f.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {f.shortLabel}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filtersOpen
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                Filtrai
              </button>
              <button
                type="button"
                onClick={() => downloadCsv(stations)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Atsisiųsti
              </button>
              <button
                type="button"
                disabled
                title="Analitika — netrukus"
                className="cursor-not-allowed rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-subtle opacity-60"
              >
                Analitika
              </button>
            </div>

            {filtersOpen && (
              <label className="block text-xs">
                <span className="mb-1 block font-medium text-subtle">
                  Savivaldybė
                </span>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
                >
                  <option value={ALL_CITIES}>{ALL_CITIES}</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <p className="text-xs text-subtle">Rezultatai: {stations.length}</p>
          </div>

          <div className="flex-1 overflow-y-auto md:max-h-none">
            {stations.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedId(s.id)}
                className={`block w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted ${
                  s.id === selectedId ? "bg-muted" : ""
                }`}
              >
                <div className="text-xs text-subtle">{s.city}</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/logos/${companySlug(s.company)}.png`}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-full border border-border bg-white object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {s.company}
                        {s.id === cheapestId && (
                          <span className="ml-2 rounded-full bg-brand-yellow px-2 py-0.5 text-[9px] font-bold uppercase text-brand-black">
                            Pigiausia
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs text-subtle">{s.address}</div>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-bold text-foreground">
                    {formatPrice(s.prices[fuel])}
                  </div>
                </div>
              </button>
            ))}
            {stations.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-subtle">
                Šiai savivaldybei degalinių nerasta.
              </p>
            )}
          </div>
        </div>

        <div className="h-[500px] w-full md:h-full md:flex-1">
          <MapContainer
            center={LITHUANIA_CENTER}
            zoom={7}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> autoriai'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClusterLayer
              stations={stations}
              fuel={fuel}
              cheapestId={cheapestId}
              selectedId={selectedId}
            />
          </MapContainer>
        </div>
      </div>

      <p className="border-t border-border px-4 py-4 text-xs text-subtle">
        Duomenys: LEA (Lietuvos energetikos agentūra) ir degalais prekiaujančios
        įmonės. Naudojant šią informaciją būtina nurodyti šaltinį — LEA bei
        degalinę valdančios įmonės pavadinimą.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wide text-background/60">
        {label}
      </div>
    </div>
  );
}
