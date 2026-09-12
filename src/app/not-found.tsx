import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <LogoMark size={48} className="opacity-40" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        Puslapis nerastas
      </h1>
      <p className="mt-3 text-subtle">
        Atrodo, šis kelias baigėsi ne degalinėje. Pabandykite grįžti į
        pradžią.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85"
      >
        Grįžti į pradžią
      </Link>
    </section>
  );
}
