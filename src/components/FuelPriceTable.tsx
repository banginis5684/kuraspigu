"use client";

import { useMemo, useState } from "react";
import { CITIES, FUEL_TYPES, STATIONS, formatPrice } from "@/lib/data";
import type { FuelType } from "@/lib/types";

const ALL_CITIES = "Visi miestai";

export function FuelPriceTable() {
  const [city, setCity] = useState<string>(ALL_CITIES);
  const [sortFuel, setSortFuel] = useState<FuelType>("a95");

  const rows = useMemo(() => {
    const filtered = STATIONS.filter(
      (s) => city === ALL_CITIES || s.city === city
    );
    return [...filtered].sort((a, b) => {
      const pa = a.prices[sortFuel];
      const pb = b.prices[sortFuel];
      if (pa == null && pb == null) return 0;
      if (pa == null) return 1;
      if (pb == null) return -1;
      return pa - pb;
    });
  }, [city, sortFuel]);

  const cheapestId = rows.find((r) => r.prices[sortFuel] != null)?.id;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={city === ALL_CITIES}
            onClick={() => setCity(ALL_CITIES)}
          >
            {ALL_CITIES}
          </FilterButton>
          {CITIES.map((c) => (
            <FilterButton key={c} active={city === c} onClick={() => setCity(c)}>
              {c}
            </FilterButton>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-subtle">
          Rūšiuoti pagal
          <select
            value={sortFuel}
            onChange={(e) => setSortFuel(e.target.value as FuelType)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground"
          >
            {FUEL_TYPES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs font-semibold uppercase tracking-wide text-subtle">
              <th className="px-4 py-3">Degalinė</th>
              <th className="px-4 py-3">Miestas / adresas</th>
              {FUEL_TYPES.map((f) => (
                <th key={f.id} className="px-4 py-3 text-right">
                  {f.shortLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((station) => (
              <tr
                key={station.id}
                className={`border-b border-border last:border-0 ${
                  station.id === cheapestId ? "bg-brand-yellow/10" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {station.brand}
                  {station.id === cheapestId && (
                    <span className="ml-2 inline-block rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold uppercase text-brand-black">
                      Pigiausia
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-subtle">
                  {station.city} · {station.address}
                </td>
                {FUEL_TYPES.map((f) => (
                  <td
                    key={f.id}
                    className={`px-4 py-3 text-right tabular-nums ${
                      f.id === sortFuel ? "font-semibold text-foreground" : "text-subtle"
                    }`}
                  >
                    {formatPrice(station.prices[f.id])}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={2 + FUEL_TYPES.length} className="px-4 py-8 text-center text-subtle">
                  Šiam miestui degalinių nerasta.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
