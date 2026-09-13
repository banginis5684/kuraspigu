import Link from "next/link";
import { OilPour } from "@/components/OilPour";
import { CITIES, FUEL_TYPES, STATIONS, cheapestByFuel, formatPrice } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <CheapestToday />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[280px] lg:block xl:w-[420px]"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 25%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 25%)",
        }}
      >
        <OilPour />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-subtle">
            Degalų kainos visoje Lietuvoje
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Rask pigiausią kurą{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">šalia savęs</span>
              <span
                aria-hidden
                className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-brand-yellow/50"
              />
            </span>
          </h1>
          <p className="mt-6 text-lg text-subtle">
            KuraSpigu.lt renka ir lygina A95, dyzelino ir dujų (SND) kainas
            visose Lietuvos savivaldybėse — kad sumokėtumėte mažiau
            kiekvieną kartą užsukę į degalinę.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/kainos"
              className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85"
            >
              Peržiūrėti kainas
            </Link>
            <Link
              href="/apie-mus"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Kaip tai veikia?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: `${STATIONS.length}+`, label: "degalinių sekamos" },
    { value: `${CITIES.length}`, label: "savivaldybės" },
    { value: `${FUEL_TYPES.length}`, label: "degalų rūšys" },
    { value: "24/7", label: "atnaujinama" },
  ];
  return (
    <section className="border-b border-border bg-muted">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-3xl font-bold text-foreground">{item.value}</div>
            <div className="mt-1 text-sm text-subtle">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CheapestToday() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Šiandien pigiausia
          </h2>
          <p className="mt-2 text-subtle">
            Geriausios kainos pagal degalų rūšį šiuo metu.
          </p>
        </div>
        <Link
          href="/kainos"
          className="hidden shrink-0 text-sm font-semibold text-foreground underline decoration-brand-yellow decoration-2 underline-offset-4 sm:inline-block"
        >
          Visos kainos →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FUEL_TYPES.map((fuel) => {
          const [best] = cheapestByFuel(fuel.id, 1);
          return (
            <div
              key={fuel.id}
              className="flex flex-col justify-between rounded-2xl border border-border p-6"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-subtle">
                  {fuel.label}
                </span>
                <div className="mt-3 text-3xl font-bold text-foreground">
                  {best ? formatPrice(best.prices[fuel.id]) : "—"}
                </div>
              </div>
              {best && (
                <div className="mt-6 text-sm text-subtle">
                  <div className="font-medium text-foreground">{best.brand}</div>
                  <div>{best.city} · {best.address}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link
        href="/kainos"
        className="mt-8 inline-block text-sm font-semibold text-foreground underline decoration-brand-yellow decoration-2 underline-offset-4 sm:hidden"
      >
        Visos kainos →
      </Link>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Pasirink miestą",
      body: "Susirask savo miestą ar artimiausią rajoną iš sąrašo.",
    },
    {
      n: "02",
      title: "Palygink kainas",
      body: "Peržiūrėk visų degalinių A95, dyzelino ir dujų (SND) kainas viename puslapyje.",
    },
    {
      n: "03",
      title: "Sutaupyk",
      body: "Važiuok į pigiausią degalinę ir sumokėk mažiau už kiekvieną litrą.",
    },
  ];
  return (
    <section className="border-y border-border bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Kaip tai veikia
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n}>
              <div className="text-sm font-bold text-brand-brown">{step.n}</div>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-subtle">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-foreground px-8 py-12 text-background sm:flex-row sm:items-center sm:px-12">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Pasiruošęs sutaupyti pildydamas baką?
          </h2>
          <p className="mt-2 text-background/70">
            Peržiūrėk visas kainas savo mieste jau dabar — tai nemokama.
          </p>
        </div>
        <Link
          href="/kainos"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
        >
          Peržiūrėti kainas
        </Link>
      </div>
    </section>
  );
}
