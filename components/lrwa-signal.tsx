export type SignalVariant =
  | "buyer"
  | "supplier"
  | "competitor"
  | "skeptic"
  | "input"
  | "decompose"
  | "personas"
  | "inquiries"
  | "branches"
  | "gate";

const routePaths: Record<SignalVariant, string> = {
  buyer: "M12 34H23L31 16H39",
  supplier: "M11 15H20L27 34H39",
  competitor: "M10 30L19 19L29 28L39 14",
  skeptic: "M12 14L36 36M36 14L12 36",
  input: "M11 31H21V18H37",
  decompose: "M12 13L24 24M36 13L24 24M24 24V38",
  personas: "M11 34L18 20L24 34L30 20L37 34",
  inquiries: "M10 31H19L24 17L29 31H38",
  branches: "M11 34V24H24M24 24V14M24 24H37V34",
  gate: "M14 24H34M18 24V35H30V24M20 20V16A4 4 0 0 1 28 16V20",
};

export function LrwaSignal({
  label,
  size = 34,
  variant,
}: {
  label?: string;
  size?: number;
  variant: SignalVariant;
}) {
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className="lrwa-signal"
      height={size}
      role={label ? "img" : undefined}
      viewBox="0 0 48 48"
      width={size}
    >
      <path className="lrwa-signal-frame frame-a" d="M24 5L40 39H8Z" />
      <path className="lrwa-signal-frame frame-b" d="M43 14L7 35V17Z" />
      <path className="lrwa-signal-route" d={routePaths[variant]} />
      <circle className="lrwa-signal-core" cx="24" cy="24" r="2.6" />
    </svg>
  );
}
