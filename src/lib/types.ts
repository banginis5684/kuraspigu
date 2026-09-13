export type FuelType = "a95" | "diesel" | "lpg";

export interface FuelTypeInfo {
  id: FuelType;
  label: string;
  shortLabel: string;
}

export interface Station {
  id: string;
  /** Chain/company name (e.g. "Neste", "Circle K") — used for branding/logos. */
  company: string;
  /** Specific station display name from LEA (can be per-location, e.g. "Neste Europos"). */
  brand: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  prices: Partial<Record<FuelType, number>>;
  updatedAt: string;
}
