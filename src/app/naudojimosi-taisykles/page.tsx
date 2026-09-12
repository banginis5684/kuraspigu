import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naudojimosi taisyklės",
  description: "KuraSpigu.lt naudojimosi taisyklės.",
};

export default function NaudojimosiTaisyklesPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Naudojimosi taisyklės
      </h1>
      <p className="mt-3 text-sm text-subtle">
        Paskutinį kartą atnaujinta 2026-09-12
      </p>

      <div className="mt-10 space-y-8 text-foreground/90">
        <div>
          <h2 className="text-xl font-semibold">1. Paslaugos apibūdinimas</h2>
          <p className="mt-2 text-subtle">
            KuraSpigu.lt yra informacinė svetainė, skirta padėti
            lankytojams palyginti degalų kainas Lietuvoje esančiose
            degalinėse. Paslauga teikiama nemokamai.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">2. Kainų tikslumas</h2>
          <p className="mt-2 text-subtle">
            Dedame pastangas, kad rodoma informacija būtų kuo tikslesnė ir
            aktualesnė, tačiau kainos degalinėse gali keistis dažnai ir be
            išankstinio įspėjimo. KuraSpigu.lt negarantuoja, kad svetainėje
            rodoma kaina visada sutaps su realia kaina degalinėje. Prieš
            priimdami sprendimą, rekomenduojame kainą patikrinti vietoje.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">3. Atsakomybės apribojimas</h2>
          <p className="mt-2 text-subtle">
            KuraSpigu.lt neatsako už jokius nuostolius ar nepatogumus,
            atsiradusius dėl svetainėje pateiktos informacijos naudojimo,
            įskaitant netikslią ar pasenusią kainų informaciją.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">4. Intelektinė nuosavybė</h2>
          <p className="mt-2 text-subtle">
            Svetainės dizainas, logotipas ir turinys priklauso
            KuraSpigu.lt, jei nenurodyta kitaip. Turinio kopijavimas be
            leidimo yra draudžiamas.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">5. Taisyklių pakeitimai</h2>
          <p className="mt-2 text-subtle">
            Pasiliekame teisę bet kada atnaujinti šias taisykles.
            Tolesnis svetainės naudojimas po pakeitimų reiškia sutikimą su
            naująja redakcija.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">6. Kontaktai</h2>
          <p className="mt-2 text-subtle">
            Klausimus dėl šių taisyklių siųskite el. paštu{" "}
            <a href="mailto:info@kuraspigu.lt" className="font-medium text-foreground underline">
              info@kuraspigu.lt
            </a>
            .
          </p>
        </div>
      </div>

      <p className="mt-12 rounded-xl border border-border bg-muted px-4 py-3 text-xs text-subtle">
        Ši informacija pateikiama bendrai ir nėra teisinė konsultacija.
        Prieš paleidžiant svetainę viešai, rekomenduojame šį tekstą
        peržiūrėti kartu su teisininku.
      </p>
    </section>
  );
}
