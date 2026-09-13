type Variant = "light" | "dark";

const DROP_COLORS: Record<Variant, string[]> = {
  light: [
    "var(--brand-black)",
    "var(--brand-brown)",
    "var(--brand-yellow)",
    "var(--brand-black)",
    "var(--brand-brown)",
    "var(--brand-yellow)",
  ],
  dark: [
    "#f5f5f5",
    "var(--brand-yellow)",
    "var(--brand-brown)",
    "#f5f5f5",
    "var(--brand-yellow)",
    "var(--brand-brown)",
  ],
};

// Single drop, tip at the origin, body extending in +Y.
const DROP_PATH =
  "M0,0 C9,15 17,25 17,36 A17,17 0 1 1 -17,36 C-17,25 -9,15 0,0 Z";

export function LogoMark({
  size = 40,
  variant = "light",
  className,
}: {
  size?: number;
  variant?: Variant;
  className?: string;
}) {
  const colors = DROP_COLORS[variant];
  return (
    <svg
      width={size}
      height={size}
      viewBox="-58 -58 116 116"
      role="img"
      aria-label="KuraSpigu ženklas"
      className={className}
    >
      {colors.map((color, i) => (
        <g key={i} transform={`rotate(${(360 / colors.length) * i}) translate(0,6)`}>
          <path d={DROP_PATH} fill={color} />
        </g>
      ))}
    </svg>
  );
}

export function Logo({
  size = 36,
  withWordmark = true,
  variant = "light",
}: {
  size?: number;
  withWordmark?: boolean;
  variant?: Variant;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} variant={variant} />
      {withWordmark && (
        <span
          className={`text-xl font-bold tracking-tight ${
            variant === "dark" ? "text-white" : "text-foreground"
          }`}
        >
          Kuras
          <span
            className={
              variant === "dark" ? "text-brand-yellow" : "text-brand-brown"
            }
          >
            pigu
          </span>
        </span>
      )}
    </span>
  );
}
