"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "kuraspigu-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setVisible(true);
        }
      } catch {
        setVisible(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage failures (private mode etc.) — banner just reappears next visit
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-subtle">
          Naudojame slapukus, kad svetainė veiktų tinkamai ir galėtume
          suprasti lankytojų srautą. Daugiau informacijos —{" "}
          <Link
            href="/privatumo-politika"
            className="font-medium text-foreground underline underline-offset-2"
          >
            privatumo politikoje
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Atmesti
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            Sutinku
          </button>
        </div>
      </div>
    </div>
  );
}
