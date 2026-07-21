import type { ReactNode } from "react";
import type { IconComponent } from "@/types";
import { PageContainer } from "@/components/layout/PageContainer";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  icon?: IconComponent;
  /** Optional actions (e.g. buttons) rendered under the description. */
  actions?: ReactNode;
}

/**
 * Consistent header band used at the top of every inner page: optional icon,
 * eyebrow, title, and supporting description.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-white/5">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" />
      <PageContainer className="relative py-14 sm:py-16">
        <div className="flex max-w-3xl flex-col gap-4">
          {Icon && (
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-accent-400/25 bg-accent-400/10 text-2xl text-accent-300 shadow-glow-sm">
              <Icon />
            </span>
          )}
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
              {eyebrow}
            </span>
          )}
          <h1 className="text-balance text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
              {description}
            </p>
          )}
          {actions && (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">{actions}</div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
