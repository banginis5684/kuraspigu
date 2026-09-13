"use client";

import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { FUEL_TYPES, STATIONS, formatPrice } from "@/lib/data";
import type { FuelType } from "@/lib/types";

const LITHUANIA_CENTER: [number, number] = [55.1694, 23.8813];

function priceIcon(price: number, isCheapest: boolean) {
  const bg = isCheapest ? "#f2b705" : "#111111";
  const color = isCheapest ? "#111111" : "#ffffff";
  return L.divIcon({
    className: "",
    html: `<div style="background:${bg};color:${color};border-radius:9999px;padding:3px 8px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-family:inherit;">${price.toFixed(3)} €</div>`,
    iconSize: [60, 22],
    iconAnchor: [30, 28],
  });
}

export default function StationMap() {
  const [fuel, setFuel] = useState<FuelType>("a95");

  const stations = useMemo(
    () => STATIONS.filter((s) => s.prices[fuel] != null),
    [fuel]
  );

  const cheapestId = useMemo(() => {
    if (stations.length === 0) return null;
    return stations.reduce((best, s) =>
      s.prices[fuel]! < best.prices[fuel]! ? s : best
    ).id;
  }, [stations, fuel]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FUEL_TYPES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFuel(f.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              fuel === f.id
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="h-[480px] overflow-hidden rounded-2xl border border-border">
        <MapContainer
          center={LITHUANIA_CENTER}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> autoriai'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stations.map((s) => (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={priceIcon(s.prices[fuel]!, s.id === cheapestId)}
            >
              <Popup>
                <div className="min-w-[160px]">
                  <div className="font-semibold text-foreground">
                    {s.brand}
                    {s.id === cheapestId && (
                      <span className="ml-2 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase text-brand-black">
                        Pigiausia
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-subtle">
                    {s.city} · {s.address}
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm">
                    {FUEL_TYPES.map((f) => (
                      <div key={f.id} className="flex justify-between gap-4">
                        <span className="text-subtle">{f.shortLabel}</span>
                        <span
                          className={
                            f.id === fuel ? "font-semibold text-foreground" : ""
                          }
                        >
                          {formatPrice(s.prices[f.id])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
