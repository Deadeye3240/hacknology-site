import { cn } from "@/lib/cn";

interface HacknologyMarkProps {
  className?: string;
  /** Pixel size of the square mark (width and height). */
  size?: number;
  /** When true, renders a single-color mark for tight spaces. */
  mono?: boolean;
}

/**
 * Hacknology brand mark — hex frame, terminal prompt, and geometric H.
 * Designed for navbar, hero, favicon, and product surfaces.
 */
export function HacknologyMark({ className, size = 36, mono = false }: HacknologyMarkProps) {
  const id = mono ? "hn-mono" : "hn-gradient";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {!mono && (
        <defs>
          <linearGradient id="hn-gradient" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="45%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="hn-glow" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      )}

      <rect x="1" y="1" width="46" height="46" rx="12" fill="#05070d" />
      {!mono && <rect x="1" y="1" width="46" height="46" rx="12" fill="url(#hn-glow)" />}

      {/* Hex frame */}
      <path
        d="M24 5 L39 13.5 V30.5 L24 39 L9 30.5 V13.5 Z"
        fill="none"
        stroke={mono ? "currentColor" : `url(#${id})`}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Corner nodes */}
      <circle cx="24" cy="5" r="1.25" fill={mono ? "currentColor" : "#67e8f9"} />
      <circle cx="39" cy="13.5" r="1" fill={mono ? "currentColor" : "#22d3ee"} opacity="0.85" />
      <circle cx="9" cy="30.5" r="1" fill={mono ? "currentColor" : "#3b82f6"} opacity="0.85" />

      {/* Geometric H */}
      <path
        d="M17 16 V32 M17 24 H31 M31 16 V32"
        fill="none"
        stroke={mono ? "currentColor" : `url(#${id})`}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Terminal prompt accent */}
      <path
        d="M20 35 L24 35 L22 38"
        fill="none"
        stroke={mono ? "currentColor" : "#22d3ee"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}
