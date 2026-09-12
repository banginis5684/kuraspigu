import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontaktai",
  description: "Susisiekite su KuraSpigu.lt komanda.",
};

export default function KontaktaiPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Kontaktai
      </h1>
      <p className="mt-4 text-lg text-subtle">
        Turite pastabų, pastebėjote neteisingą kainą ar norite pasiūlyti
        naują degalinę? Parašykite mums.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">
            El. paštas
          </h2>
          <a
            href="mailto:info@kuraspigu.lt"
            className="mt-2 inline-block text-lg font-semibold text-foreground underline decoration-brand-yellow decoration-2 underline-offset-4"
          >
            info@kuraspigu.lt
          </a>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">
            Veikimo sritis
          </h2>
          <p className="mt-2 text-lg font-semibold text-foreground">
            Lietuva
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm text-subtle">
        Kontaktų forma svetainėje netrukus — kol kas rašykite tiesiai el.
        paštu, atsakysime kuo greičiau.
      </p>
    </section>
  );
}
