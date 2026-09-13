import Link from "next/link";

const LINKS = [
  { href: "/parduok", label: "Parduok" },
  { href: "/pirk", label: "Pirk" },
  { href: "/naftos-kaina", label: "Naftos kaina" },
  { href: "/degaliniu-sarasas", label: "Degalinių sąrašas" },
  { href: "/skaiciuokle", label: "Skaičiuoklė" },
  { href: "/duk", label: "DUK" },
  { href: "/ateities-prognoze", label: "Ateities prognozė" },
  { href: "/ateities-sandoriai", label: "Ateities sandoriai" },
  { href: "/pasaulio-naujienos", label: "Pasaulio naujienos" },
  { href: "/profilis", label: "Mano profilis" },
];

export function SecondaryNav() {
  return (
    <nav
      className="sticky top-20 z-30 w-full overflow-x-auto bg-black"
      aria-label="Papildoma navigacija"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-6 whitespace-nowrap px-4 py-2.5 sm:px-6">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 text-xs font-medium text-background/75 transition-colors hover:text-background"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
