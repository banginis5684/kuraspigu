import Link from "next/link";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Pagrindinis" },
  { href: "/kainos", label: "Kainos" },
  { href: "/apie-mus", label: "Apie mus" },
  { href: "/kontaktai", label: "Kontaktai" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/kainos"
          className="hidden rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-85 sm:inline-block"
        >
          Rasti pigiausią
        </Link>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <nav className="flex items-center gap-4 sm:hidden">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs font-medium text-foreground/80"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
