"use client";

import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { FUEL_TYPES, STATIONS, formatPrice } from "@/lib/data";
import { priceIcon } from "@/lib/map-icons";
import { companySlug } from "@/lib/slug";
import type { FuelType } from "@/lib/types";

const LITHUANIA_CENTER: [number, number] = [55.1694, 23.8813];

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
      <div className="mx-auto mb-4 flex max-w-6xl flex-wrap gap-2 px-4 sm:px-6">
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

      <div className="h-[600px] w-full border-y border-border">
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
          {stations.map((s) => (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={priceIcon(s.prices[fuel]!, s.id === cheapestId, s.company)}
            >
              <Popup>
                <div className="flex min-w-[160px] items-start gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/logos/${companySlug(s.company)}.png`}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full border border-border bg-white object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {s.company}
                      {s.id === cheapestId && (
                        <span className="ml-2 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase text-brand-black">
                          Pigiausia
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-subtle">
                      {s.city} · {s.address}
                      {s.brand !== s.company && ` · ${s.brand}`}
                    </div>
                  </div>
                </div>
                <div className="mt-1 min-w-[160px]">
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
