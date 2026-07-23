import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { HacknologyMark } from "@/components/brand/HacknologyMark";

interface LogoProps {
  /** Renders as a link back to home when true (default). */
  asLink?: boolean;
  className?: string;
  /** Full wordmark, icon-only mark, or text-only. */
  variant?: "full" | "mark" | "wordmark";
  size?: "sm" | "md" | "lg" | "hero";
  /** Show hacknology.xyz under the wordmark (hero/footer contexts). */
  showDomain?: boolean;
}

const markSizes = { sm: 28, md: 36, lg: 44, hero: 56 } as const;

const wordmarkSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  hero: "text-3xl sm:text-4xl",
} as const;

/** Hacknology brand lockup — mark + wordmark for navbar, footer, auth, and hero. */
export function Logo({
  asLink = true,
  className,
  variant = "full",
  size = "md",
  showDomain = false,
}: LogoProps) {
  const content = (
    <span className={cn("group inline-flex items-center gap-3", className)}>
      {(variant === "full" || variant === "mark") && (
        <span
          className={cn(
            "relative grid place-items-center rounded-xl border border-accent-400/25 bg-base-950/80 shadow-glow-sm transition group-hover:border-accent-400/40",
            size === "hero" ? "h-14 w-14" : size === "lg" ? "h-11 w-11" : "h-9 w-9",
          )}
        >
          <HacknologyMark size={markSizes[size]} />
        </span>
      )}

      {(variant === "full" || variant === "wordmark") && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-extrabold tracking-tight", wordmarkSizes[size])}>
            <span className="text-white">HACK</span>
            <span className="text-gradient-accent">NOLOGY</span>
          </span>
          {showDomain && (
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
              {site.domain}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link to="/" aria-label={`${site.nameFormatted} home`} className="shrink-0">
      {content}
    </Link>
  );
}
