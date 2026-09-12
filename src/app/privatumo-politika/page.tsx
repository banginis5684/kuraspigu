import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privatumo politika",
  description: "KuraSpigu.lt privatumo politika.",
};

export default function PrivatumoPolitikaPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Privatumo politika
      </h1>
      <p className="mt-3 text-sm text-subtle">
        Paskutinį kartą atnaujinta 2026-09-12
      </p>

      <div className="mt-10 space-y-8 text-foreground/90">
        <div>
          <h2 className="text-xl font-semibold">1. Bendra informacija</h2>
          <p className="mt-2 text-subtle">
            Ši privatumo politika paaiškina, kaip KuraSpigu.lt (toliau —
            „svetainė“) renka, naudoja ir saugo informaciją apie svetainės
            lankytojus.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">2. Kokius duomenis renkame</h2>
          <p className="mt-2 text-subtle">
            Svetainė gali rinkti bendrą, neasmenuotą naršymo statistiką
            (pvz., lankomus puslapius, naudojamą naršyklę) svetainės
            veikimui gerinti. Jei ateityje bus įdiegta kontaktų forma ar
            registracija, papildomai galime rinkti jūsų pateiktą el. pašto
            adresą ar kitą kontaktinę informaciją.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">3. Slapukai (cookies)</h2>
          <p className="mt-2 text-subtle">
            Svetainė gali naudoti būtinuosius slapukus svetainės veikimui
            užtikrinti bei analitinius slapukus lankytojų srautui suprasti.
            Naršyklėje galite bet kada valdyti arba išjungti slapukus.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">4. Duomenų saugojimas ir dalijimasis</h2>
          <p className="mt-2 text-subtle">
            Nerenkame ir neparduodame asmens duomenų trečiosioms šalims
            rinkodaros tikslais. Bet kokie surinkti duomenys naudojami
            tik svetainės funkcionalumui ir kokybei gerinti.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">5. Jūsų teisės</h2>
          <p className="mt-2 text-subtle">
            Pagal Bendrąjį duomenų apsaugos reglamentą (BDAR) turite teisę
            susipažinti su savo duomenimis, juos ištaisyti ar prašyti
            ištrinti. Dėl šių teisių įgyvendinimo kreipkitės el. paštu{" "}
            <a href="mailto:info@kuraspigu.lt" className="font-medium text-foreground underline">
              info@kuraspigu.lt
            </a>
            .
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">6. Pakeitimai</h2>
          <p className="mt-2 text-subtle">
            Ši politika gali būti atnaujinama. Apie esminius pakeitimus
            informuosime šiame puslapyje.
          </p>
        </div>
      </div>

      <p className="mt-12 rounded-xl border border-border bg-muted px-4 py-3 text-xs text-subtle">
        Ši informacija pateikiama bendrai ir nėra teisinė konsultacija.
        Prieš paleidžiant svetainę viešai, rekomenduojame šį tekstą
        peržiūrėti kartu su teisininku, kad jis pilnai atitiktų BDAR ir
        kitus taikomus reikalavimus.
      </p>
    </section>
  );
}
