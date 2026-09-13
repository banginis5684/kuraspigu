export type FuelType = "a95" | "a98" | "diesel" | "lpg";

export interface FuelTypeInfo {
  id: FuelType;
  label: string;
  shortLabel: string;
}

export interface Station {
  id: string;
  brand: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  prices: Partial<Record<FuelType, number>>;
  updatedAt: string;
}
