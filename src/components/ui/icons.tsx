import type { SVGProps } from "react";

/**
 * Minimal, dependency-free icon set drawn with stroke-based SVG paths.
 *
 * Each icon inherits `currentColor` and sizes to `1em` by default so it can be
 * controlled entirely with Tailwind text-size and text-color utilities.
 */
export type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4.5" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z" />
      <path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5A2.5 2.5 0 014 18.5" />
      <path d="M9 7h7M9 10.5h7" />
    </svg>
  );
}

export function FlaskIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 3h6M10 3v6.2L5.2 17A2 2 0 007 20h10a2 2 0 001.8-3L14 9.2V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.7 6.3a4 4 0 00-5.2 5L4 16.8 7.2 20l5.5-5.5a4 4 0 005-5.2l-2.6 2.6-2.4-.4-.4-2.4z" />
    </svg>
  );
}

export function RadarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.5 12a8.5 8.5 0 11-4.2-7.3" />
      <path d="M17 12a5 5 0 11-2.5-4.3" />
      <path d="M12 12l6-6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DocsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
      <path d="M10 13h6M10 16.5h6" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.75h.01" />
    </svg>
  );
}

export function NetworkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="19" r="2.2" />
      <circle cx="19" cy="19" r="2.2" />
      <path d="M12 7.2v4M12 11.2L6.4 17M12 11.2L17.6 17" />
    </svg>
  );
}

export function TerminalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 018 0v2.5" />
      <path d="M12 14v2.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 5h5v5M19 5l-8 8" />
      <path d="M18 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7m12 5.7v-3.6a3.1 3.1 0 00-.9-2.4c2.9-.3 6-1.4 6-6.4a5 5 0 00-1.4-3.5 4.6 4.6 0 00-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 00-6.6 0C6.4 1.8 5.3 2.1 5.3 2.1a4.6 4.6 0 00-.1 3.5A5 5 0 003.8 9c0 5 3.1 6.1 6 6.4a3.1 3.1 0 00-.9 2.4V21" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4L3 19h18z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5l3 1.7" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-6-3.5-9S9.5 5.5 12 3z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0111 0" />
      <path d="M16 5.2a3 3 0 010 5.6M17.5 20a5.5 5.5 0 00-3-4.9" />
    </svg>
  );
}

export function ListChecksIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6l1.5 1.5L8 5" />
      <path d="M4 13l1.5 1.5L8 11" />
      <path d="M4 19.5L5.5 21 8 18.5" />
      <path d="M11 6h9M11 13h9M11 19h9" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
      <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z" />
    </svg>
  );
}
