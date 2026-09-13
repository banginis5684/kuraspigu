"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { FluidHeaderBackground } from "./FluidHeaderBackground";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const NAV_LINKS = [
  { href: "/", label: "Pagrindinis" },
  { href: "/kainos", label: "Kainos" },
  { href: "/zemelapis", label: "Žemėlapis" },
  { href: "/apie-mus", label: "Apie mus" },
  { href: "/kontaktai", label: "Kontaktai" },
];

export function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 overflow-hidden bg-[#050505]">
      <FluidHeaderBackground />
      <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo variant="dark" />
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <>
              <span className="max-w-[160px] truncate text-sm font-medium text-white/80">
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => supabase.auth.signOut()}
                className="text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                Atsijungti
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              Prisijungti
            </button>
          )}
          <Link
            href="/kainos"
            className="inline-block rounded-full bg-brand-yellow px-5 py-2 text-sm font-semibold text-brand-black transition-opacity hover:opacity-85"
          >
            Rasti pigiausią
          </Link>
        </div>
        <MobileNav
          signedIn={Boolean(user)}
          onAuthClick={() => setAuthOpen(true)}
          onSignOut={() => supabase.auth.signOut()}
        />
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  );
}

function MobileNav({
  signedIn,
  onAuthClick,
  onSignOut,
}: {
  signedIn: boolean;
  onAuthClick: () => void;
  onSignOut: () => void;
}) {
  return (
    <nav className="relative flex items-center gap-4 sm:hidden">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs font-medium text-white/80"
        >
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={signedIn ? onSignOut : onAuthClick}
        className="text-xs font-semibold text-brand-yellow"
      >
        {signedIn ? "Atsijungti" : "Prisijungti"}
      </button>
    </nav>
  );
}
