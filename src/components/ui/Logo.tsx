import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { ShieldIcon } from "@/components/ui/icons";

interface LogoProps {
  /** Renders as a link back to home when true (default). */
  asLink?: boolean;
  className?: string;
}

/** Hacknology wordmark with shield glyph, used in the navbar and footer. */
export function Logo({ asLink = true, className }: LogoProps) {
  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-accent-400/30 bg-accent-400/10 text-accent-300 shadow-glow-sm">
        <ShieldIcon className="text-lg" />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-white">
        {site.name}
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link to="/" aria-label={`${site.nameFormatted} home`} className="shrink-0">
      {content}
    </Link>
  );
}
