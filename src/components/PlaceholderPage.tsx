export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 text-subtle">
        Šis puslapis dar kuriamas — netrukus čia bus daugiau informacijos.
      </p>
    </section>
  );
}
