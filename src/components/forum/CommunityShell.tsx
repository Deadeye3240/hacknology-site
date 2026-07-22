import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { paths } from "@/routes/paths";

interface CommunityShellProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; to?: string }[];
  children: ReactNode;
}

/** Compact community page shell — tuned for information density. */
export function CommunityShell({
  title,
  description,
  actions,
  breadcrumb,
  children,
}: CommunityShellProps) {
  return (
    <div className="min-h-[50vh]">
      <div className="border-b border-white/[0.06] bg-base-950/40">
        <PageContainer className="py-3 sm:py-3.5">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="mb-1.5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
              <Link to={paths.forum} className="transition-colors hover:text-accent-300">
                Community
              </Link>
              {breadcrumb.map((crumb) => (
                <span key={crumb.label} className="flex items-center gap-1">
                  <span aria-hidden className="text-slate-600">
                    /
                  </span>
                  {crumb.to ? (
                    <Link to={crumb.to} className="transition-colors hover:text-accent-300">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-400">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {!breadcrumb && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-400/80">
                  Hacknology Community
                </p>
              )}
              {title && (
                <h1
                  className={
                    breadcrumb
                      ? "text-base font-semibold tracking-tight text-white"
                      : "mt-0.5 text-lg font-semibold tracking-tight text-white"
                  }
                >
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-0.5 max-w-2xl text-xs leading-snug text-slate-500">{description}</p>
              )}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-1.5">{actions}</div>}
          </div>
        </PageContainer>
      </div>
      <PageContainer className="py-4 sm:py-5">{children}</PageContainer>
    </div>
  );
}
