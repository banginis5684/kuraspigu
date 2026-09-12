import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Apie mus",
  description: "Sužinokite, kodėl sukūrėme KuraSpigu.lt ir kaip veikia kainų palyginimas.",
};

export default function ApieMusPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <LogoMark size={56} />
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        Apie mus
      </h1>
      <p className="mt-4 text-lg text-subtle">
        KuraSpigu.lt gimė iš paprastos idėjos — degalų kainos skirtingose
        degalinėse gali skirtis kelis centus už litrą, o pildydami baką
        keliasdešimt kartų per metus, tie centai virsta realiais pinigais.
      </p>

      <div className="mt-10 space-y-8 text-foreground/90">
        <div>
          <h2 className="text-xl font-semibold">Mūsų tikslas</h2>
          <p className="mt-2 text-subtle">
            Padėti Lietuvos vairuotojams greitai ir aiškiai palyginti A95,
            A98, dyzelino ir dujų kainas didžiuosiuose miestuose — be
            reikalo neapsilankant kiekvienoje degalinėje.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Kaip renkame duomenis</h2>
          <p className="mt-2 text-subtle">
            Siekiame rodyti kuo tikslesnę ir šviežiausią informaciją.
            Šiuo metu svetainėje rodomi pavyzdiniai duomenys, o gyva
            duomenų integracija su degalinių tinklais bus paleista
            artimiausiu metu.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Kam tai skirta</h2>
          <p className="mt-2 text-subtle">
            Kiekvienam vairuotojui — nuo kasdien į darbą važiuojančio
            gyventojo iki tolimuosius reisus dirbančio vairuotojo,
            norinčio sumažinti kuro išlaidas.
          </p>
        </div>
      </div>
    </section>
  );
}
