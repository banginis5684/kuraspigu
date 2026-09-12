const DROP_COLORS = [
  "var(--brand-black)",
  "var(--brand-brown)",
  "var(--brand-yellow)",
  "var(--brand-black)",
  "var(--brand-brown)",
  "var(--brand-yellow)",
];

// Single drop, tip at the origin, body extending in +Y.
const DROP_PATH =
  "M0,0 C9,15 17,25 17,36 A17,17 0 1 1 -17,36 C-17,25 -9,15 0,0 Z";

export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-58 -58 116 116"
      role="img"
      aria-label="KuraSpigu ženklas"
      className={className}
    >
      {DROP_COLORS.map((color, i) => (
        <g key={i} transform={`rotate(${(360 / DROP_COLORS.length) * i}) translate(0,6)`}>
          <path d={DROP_PATH} fill={color} />
        </g>
      ))}
    </svg>
  );
}

export function Logo({ size = 36, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      {withWordmark && (
        <span className="text-xl font-bold tracking-tight text-foreground">
          Kuras<span className="text-brand-brown">pigu</span>
        </span>
      )}
    </span>
  );
}
