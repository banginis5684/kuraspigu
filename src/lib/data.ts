import type { FuelType, FuelTypeInfo, Station } from "./types";
import stationsData from "./stations-data.json";

export const FUEL_TYPES: FuelTypeInfo[] = [
  { id: "a95", label: "Benzinas A95", shortLabel: "A95" },
  { id: "diesel", label: "Dyzelinas", shortLabel: "DYZ" },
  { id: "lpg", label: "Dujos (SND)", shortLabel: "SND" },
];

// Real data imported from LEA's (Lietuvos energetikos agentūra) published
// price export — see scripts/import-lea-data.mjs. Re-run that script
// whenever a fresh export lands in data/ to refresh this file.
export const STATIONS: Station[] = stationsData as Station[];

export const CITIES: string[] = Array.from(
  new Set(STATIONS.map((s) => s.city))
).sort((a, b) => a.localeCompare(b, "lt"));

export function cheapestByFuel(fuel: FuelType, limit = 3): Station[] {
  return STATIONS.filter((s) => s.prices[fuel] != null)
    .sort((a, b) => (a.prices[fuel]! - b.prices[fuel]!))
    .slice(0, limit);
}

export function formatPrice(value: number | undefined | null): string {
  if (value == null) return "—";
  return `${value.toFixed(3)} €`;
}
