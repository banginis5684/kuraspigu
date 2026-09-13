"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark } from "./Logo";

const STORAGE_KEY = "kuraspigu-welcome-seen";

export function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // fall through and show it
    }
    const timer = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-border bg-background p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Uždaryti"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-subtle transition-colors hover:bg-muted hover:text-foreground"
        >
          ✕
        </button>

        <div className="flex justify-center">
          <LogoMark size={56} />
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-tight">
          Sveiki atvykę į KuraSpigu!
        </h2>
        <p className="mt-2 text-sm text-subtle">
          Palyginkite degalų kainas visoje Lietuvoje ir raskite pigiausią
          degalinę šalia savęs — greitai ir nemokamai.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/kainos"
            onClick={close}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            Peržiūrėti kainas
          </Link>
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-subtle transition-colors hover:text-foreground"
          >
            Ne dabar
          </button>
        </div>
      </div>
    </div>
  );
}
