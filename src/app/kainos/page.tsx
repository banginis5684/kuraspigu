import type { Metadata } from "next";
import { FuelPriceTable } from "@/components/FuelPriceTable";
import { StationMapLoader } from "@/components/StationMapLoader";

export const metadata: Metadata = {
  title: "Kainos",
  description: "Palyginkite A95, dyzelino ir dujų (SND) kainas degalinėse visoje Lietuvoje.",
};

export default function KainosPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Degalų kainos
        </h1>
        <p className="mt-3 max-w-2xl text-subtle">
          Filtruokite pagal savivaldybę ir rūšiuokite pagal degalų tipą, kad
          rastumėte pigiausią degalinę šalia savęs.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-subtle">
        Kainos — Lietuvos energetikos agentūros (LEA) skelbiami duomenys,
        atnaujinti kartą per parą (savaitgaliais duomenys neatnaujinami).
        Degalinių vietos žemėlapyje nustatytos automatiškai pagal adresą ir
        gali būti netikslios.
      </div>

      <div className="mb-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight">
          Degalinių žemėlapis
        </h2>
        <StationMapLoader />
      </div>

      <FuelPriceTable />
    </section>
  );
}
