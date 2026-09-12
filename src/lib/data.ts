import type { FuelType, FuelTypeInfo, Station } from "./types";

export const FUEL_TYPES: FuelTypeInfo[] = [
  { id: "a95", label: "Benzinas A95", shortLabel: "A95" },
  { id: "a98", label: "Benzinas A98", shortLabel: "A98" },
  { id: "diesel", label: "Dyzelinas", shortLabel: "DYZ" },
  { id: "lpg", label: "Dujos (LPG)", shortLabel: "LPG" },
];

export const CITIES = [
  "Vilnius",
  "Kaunas",
  "Klaipėda",
  "Šiauliai",
  "Panevėžys",
] as const;

// Sample / illustrative data for launch. Replace with a live feed once a
// pricing data source (API, scraper, or manual feed) is connected.
export const STATIONS: Station[] = [
  { id: "vln-1", brand: "Circle K", city: "Vilnius", address: "Ukmergės g. 280", prices: { a95: 1.499, a98: 1.599, diesel: 1.459, lpg: 0.649 }, updatedAt: "2026-09-12T07:10:00+03:00" },
  { id: "vln-2", brand: "Neste", city: "Vilnius", address: "Savanorių pr. 178", prices: { a95: 1.489, a98: 1.589, diesel: 1.449, lpg: 0.639 }, updatedAt: "2026-09-12T06:55:00+03:00" },
  { id: "vln-3", brand: "Viada", city: "Vilnius", address: "Liepkalnio g. 2", prices: { a95: 1.479, diesel: 1.439, lpg: 0.629 }, updatedAt: "2026-09-12T07:20:00+03:00" },
  { id: "vln-4", brand: "Lukoil", city: "Vilnius", address: "Gerosios Vilties g. 15", prices: { a95: 1.509, a98: 1.609, diesel: 1.469 }, updatedAt: "2026-09-12T06:40:00+03:00" },
  { id: "vln-5", brand: "Emsi", city: "Vilnius", address: "Kirtimų g. 51", prices: { a95: 1.469, diesel: 1.429, lpg: 0.619 }, updatedAt: "2026-09-12T07:05:00+03:00" },
  { id: "kau-1", brand: "Circle K", city: "Kaunas", address: "Islandijos pl. 32", prices: { a95: 1.494, a98: 1.594, diesel: 1.454, lpg: 0.644 }, updatedAt: "2026-09-12T07:00:00+03:00" },
  { id: "kau-2", brand: "Viada", city: "Kaunas", address: "Raudondvario pl. 150", prices: { a95: 1.474, diesel: 1.434, lpg: 0.624 }, updatedAt: "2026-09-12T06:50:00+03:00" },
  { id: "kau-3", brand: "Neste", city: "Kaunas", address: "Kauno g. 3, Domeikava", prices: { a95: 1.484, a98: 1.584, diesel: 1.444 }, updatedAt: "2026-09-12T07:15:00+03:00" },
  { id: "kau-4", brand: "Lukoil", city: "Kaunas", address: "Chemijos g. 25", prices: { a95: 1.499, diesel: 1.459, lpg: 0.639 }, updatedAt: "2026-09-12T06:35:00+03:00" },
  { id: "klp-1", brand: "Circle K", city: "Klaipėda", address: "Minijos g. 154", prices: { a95: 1.489, a98: 1.589, diesel: 1.449, lpg: 0.634 }, updatedAt: "2026-09-12T07:25:00+03:00" },
  { id: "klp-2", brand: "Viada", city: "Klaipėda", address: "Taikos pr. 61", prices: { a95: 1.469, diesel: 1.429, lpg: 0.614 }, updatedAt: "2026-09-12T06:45:00+03:00" },
  { id: "klp-3", brand: "Emsi", city: "Klaipėda", address: "Statybininkų pr. 2", prices: { a95: 1.459, diesel: 1.419 }, updatedAt: "2026-09-12T07:10:00+03:00" },
  { id: "sia-1", brand: "Neste", city: "Šiauliai", address: "Tilžės g. 214", prices: { a95: 1.479, a98: 1.579, diesel: 1.439, lpg: 0.629 }, updatedAt: "2026-09-12T06:58:00+03:00" },
  { id: "sia-2", brand: "Viada", city: "Šiauliai", address: "Pramonės pr. 2", prices: { a95: 1.464, diesel: 1.424, lpg: 0.609 }, updatedAt: "2026-09-12T07:12:00+03:00" },
  { id: "pan-1", brand: "Circle K", city: "Panevėžys", address: "Klaipėdos g. 140", prices: { a95: 1.484, a98: 1.584, diesel: 1.444, lpg: 0.634 }, updatedAt: "2026-09-12T06:48:00+03:00" },
  { id: "pan-2", brand: "Lukoil", city: "Panevėžys", address: "Molainių g. 24", prices: { a95: 1.494, diesel: 1.454 }, updatedAt: "2026-09-12T07:02:00+03:00" },
];

export function cheapestByFuel(fuel: FuelType, limit = 3): Station[] {
  return STATIONS.filter((s) => s.prices[fuel] != null)
    .sort((a, b) => (a.prices[fuel]! - b.prices[fuel]!))
    .slice(0, limit);
}

export function formatPrice(value: number | undefined): string {
  if (value == null) return "—";
  return `${value.toFixed(3)} €`;
}
