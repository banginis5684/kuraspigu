"use client";

import { useState } from "react";
import { LogoMark } from "./Logo";
import { supabase } from "@/lib/supabase";

type Mode = "sign-in" | "sign-up";
type Step = "form" | "location" | "done";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "requesting" | "granted" | "denied"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const { data, error: authError } =
      mode === "sign-up"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (authError) {
      setError(translateAuthError(authError.message));
      return;
    }

    if (mode === "sign-up") {
      setNeedsEmailConfirm(!data.session);
      setStep("location");
    } else {
      setStep("done");
    }
  }

  function requestLocation() {
    setLocationStatus("requesting");
    if (!("geolocation" in navigator)) {
      setLocationStatus("denied");
      setStep("done");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationStatus("granted");
        setStep("done");
      },
      () => {
        setLocationStatus("denied");
        setStep("done");
      }
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-border bg-background p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Uždaryti"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-subtle transition-colors hover:bg-muted hover:text-foreground"
        >
          ✕
        </button>

        <div className="flex justify-center">
          <LogoMark size={44} />
        </div>

        {step === "form" && (
          <>
            <div className="mt-5 flex justify-center gap-1 rounded-full border border-border p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("sign-in");
                  setError(null);
                }}
                className={`flex-1 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  mode === "sign-in"
                    ? "bg-foreground text-background"
                    : "text-subtle hover:text-foreground"
                }`}
              >
                Prisijungti
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("sign-up");
                  setError(null);
                }}
                className={`flex-1 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  mode === "sign-up"
                    ? "bg-foreground text-background"
                    : "text-subtle hover:text-foreground"
                }`}
              >
                Registruotis
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-foreground">
                  El. paštas
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="jus@paštas.lt"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-foreground">
                  Slaptažodis
                </span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </label>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-60"
              >
                {submitting
                  ? "Palaukite…"
                  : mode === "sign-in"
                    ? "Prisijungti"
                    : "Sukurti paskyrą"}
              </button>
            </form>
          </>
        )}

        {step === "location" && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-bold tracking-tight">
              Rodyti degalines šalia jūsų?
            </h3>
            <p className="mt-2 text-sm text-subtle">
              Leiskite naudoti šio įrenginio vietą, kad iš karto matytumėte
              artimiausias ir pigiausias degalines. Naršyklė paprašys jūsų
              leidimo.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={requestLocation}
                disabled={locationStatus === "requesting"}
                className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-60"
              >
                {locationStatus === "requesting"
                  ? "Laukiama leidimo…"
                  : "Leisti vietos prieigą"}
              </button>
              <button
                type="button"
                onClick={() => setStep("done")}
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-subtle transition-colors hover:text-foreground"
              >
                Praleisti
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-bold tracking-tight">
              {mode === "sign-up" ? "Paskyra sukurta!" : "Prisijungta!"}
            </h3>
            <p className="mt-2 text-sm text-subtle">
              {mode === "sign-up" && needsEmailConfirm
                ? "Išsiuntėme patvirtinimo laišką — paspauskite nuorodą jame, kad užbaigtumėte registraciją."
                : locationStatus === "granted"
                  ? "Puiku — rodysime artimiausias degalines, kai ši funkcija bus paleista."
                  : locationStatus === "denied"
                    ? "Gerai, vietos prieigos galėsite bet kada leisti vėliau paieškoje."
                    : "Sveiki!"}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
            >
              Uždaryti
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Neteisingas el. paštas arba slaptažodis.";
  }
  if (message.includes("User already registered")) {
    return "Toks el. paštas jau užregistruotas — bandykite prisijungti.";
  }
  if (message.includes("Password should be")) {
    return "Slaptažodis per trumpas — turi būti bent 6 simboliai.";
  }
  return message;
}
