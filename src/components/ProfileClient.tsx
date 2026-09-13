"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "@/components/AuthModal";
import { LogoMark } from "@/components/Logo";

const AVATAR_SIZE = 160;

function resizeImageToDataUrl(file: File, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Nepavyko apdoroti paveikslėlio."));
          return;
        }
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Nepavyko įkelti paveikslėlio."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Nepavyko nuskaityti failo."));
    reader.readAsDataURL(file);
  });
}

export function ProfileClient() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      setFullName((user.user_metadata?.full_name as string) || "");
      setAvatarUrl((user.user_metadata?.avatar_url as string) || null);
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Pasirinkite paveikslėlio failą.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage("Failas per didelis (maks. 8 MB).");
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const dataUrl = await resizeImageToDataUrl(file, AVATAR_SIZE);
      const { error } = await supabase.auth.updateUser({ data: { avatar_url: dataUrl } });
      if (error) throw error;
      setAvatarUrl(dataUrl);
      setMessage("Nuotrauka atnaujinta.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Nepavyko įkelti nuotraukos.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaving(false);
    setMessage(error ? "Nepavyko išsaugoti." : "Išsaugota.");
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <p className="text-subtle">Kraunama…</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <LogoMark size={48} className="mx-auto opacity-60" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Mano profilis</h1>
        <p className="mt-2 text-subtle">
          Prisijunkite, kad galėtumėte matyti ir redaguoti savo profilį.
        </p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85"
        >
          Prisijungti
        </button>
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      </section>
    );
  }

  const initials = (fullName || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mano profilis</h1>
      <p className="mt-2 text-subtle">Tvarkykite savo paskyros informaciją.</p>

      <div className="mt-8 flex items-center gap-5">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-muted"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-subtle">{initials}</span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              {uploading ? "…" : "Keisti"}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {uploading ? "Keliama…" : "Įkelti nuotrauką"}
          </button>
          <p className="mt-1 text-xs text-subtle">JPG arba PNG, iki 8 MB.</p>
        </div>
      </div>

      <form onSubmit={handleSaveName} className="mt-10 space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground">Vardas</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jūsų vardas"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-foreground">El. paštas</span>
          <input
            value={user.email ?? ""}
            disabled
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-subtle"
          />
        </label>

        {message && <p className="text-sm text-subtle">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {saving ? "Saugoma…" : "Išsaugoti"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => supabase.auth.signOut()}
        className="mt-10 text-sm font-semibold text-subtle transition-colors hover:text-foreground"
      >
        Atsijungti
      </button>
    </section>
  );
}
