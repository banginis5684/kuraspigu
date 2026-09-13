import Link from "next/link";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <LogoMark size={28} />
              <span className="text-lg font-bold tracking-tight">
                Kuras<span className="text-brand-brown">pigu</span>
              </span>
            </div>
            <p className="text-sm text-subtle">
              Pigiausios degalų kainos Lietuvoje — vienoje vietoje.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Naršymas</h3>
            <ul className="space-y-2 text-sm text-subtle">
              <li><Link href="/" className="hover:text-foreground">Pagrindinis</Link></li>
              <li><Link href="/kainos" className="hover:text-foreground">Kainos</Link></li>
              <li><Link href="/apie-mus" className="hover:text-foreground">Apie mus</Link></li>
              <li><Link href="/kontaktai" className="hover:text-foreground">Kontaktai</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Teisinė informacija</h3>
            <ul className="space-y-2 text-sm text-subtle">
              <li><Link href="/privatumo-politika" className="hover:text-foreground">Privatumo politika</Link></li>
              <li><Link href="/naudojimosi-taisykles" className="hover:text-foreground">Naudojimosi taisyklės</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Kontaktai</h3>
            <ul className="space-y-2 text-sm text-subtle">
              <li>
                <a href="mailto:info@kuraspigu.lt" className="hover:text-foreground">
                  info@kuraspigu.lt
                </a>
              </li>
              <li>Lietuva</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} KuraSpigu.lt. Visos teisės saugomos.</p>
          <p>Kainų šaltinis — LEA. Degalinių vietos žemėlapyje nustatytos automatiškai ir gali būti netikslios.</p>
        </div>
      </div>
    </footer>
  );
}
