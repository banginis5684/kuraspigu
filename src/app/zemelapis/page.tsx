import type { Metadata } from "next";
import { MapExplorerLoader } from "@/components/MapExplorerLoader";

export const metadata: Metadata = {
  title: "Žemėlapis",
  description:
    "Degalų kainų žemėlapis Lietuvoje — filtruokite pagal savivaldybę ir degalų tipą, peržiūrėkite visas degalines žemėlapyje ir sąraše.",
};

export default function ZemelapisPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Degalų kainų žemėlapis
        </h1>
        <p className="mt-3 max-w-2xl text-subtle">
          Visos sekamos degalinės vienoje vietoje — filtruokite, ieškokite
          sąraše arba naršykite tiesiogiai žemėlapyje.
        </p>
      </section>

      <MapExplorerLoader />
    </>
  );
}
