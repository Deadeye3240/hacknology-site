import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface HeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Call-to-action buttons rendered below the copy. */
  actions?: ReactNode;
  /** Optional decorative element rendered beside the copy on large screens. */
  visual?: ReactNode;
  className?: string;
}

/**
 * Reusable hero band with a soft accent glow and faint grid backdrop. Used for
 * the homepage and available for prominent page intros.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  description,
  actions,
  visual,
  className,
}: HeroProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Decorative background layers */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />

      <div className="container-page relative py-20 sm:py-24 lg:py-28">
        <div
          className={cn(
            "grid items-center gap-12",
            visual ? "lg:grid-cols-2" : "lg:grid-cols-1",
          )}
        >
          <div className="flex flex-col items-start gap-6 animate-fade-in-up">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/20 bg-accent-400/5 px-3 py-1 text-xs font-medium text-accent-200">
                {eyebrow}
              </span>
            )}

            <div className="flex flex-col gap-4">
              {title}
              {subtitle && (
                <p className="text-balance text-xl font-medium text-slate-200 sm:text-2xl">
                  {subtitle}
                </p>
              )}
            </div>

            {description && (
              <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
                {description}
              </p>
            )}

            {actions && (
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                {actions}
              </div>
            )}
          </div>

          {visual && (
            <div className="relative hidden md:block">{visual}</div>
          )}
        </div>
      </div>
    </section>
  );
}
