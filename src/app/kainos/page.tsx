import type { Metadata } from "next";
import { FuelPriceTable } from "@/components/FuelPriceTable";

export const metadata: Metadata = {
  title: "Kainos",
  description: "Palyginkite A95, A98, dyzelino ir dujų kainas degalinėse visoje Lietuvoje.",
};

export default function KainosPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Degalų kainos
        </h1>
        <p className="mt-3 max-w-2xl text-subtle">
          Filtruokite pagal miestą ir rūšiuokite pagal degalų tipą, kad
          rastumėte pigiausią degalinę šalia savęs.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-subtle">
        Šiuo metu rodomi pavyzdiniai duomenys — gyva kainų integracija bus
        pridėta netrukus.
      </div>

      <FuelPriceTable />
    </section>
  );
}
