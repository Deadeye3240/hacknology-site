import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

interface AuthLayoutProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  /** Secondary content rendered below the card (e.g. a link to the other flow). */
  footer?: ReactNode;
}

/** Centered, single-column shell shared by the login and register pages. */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-60" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Link to="/" aria-label="Hacknology home">
            <Logo />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface/70 p-6 shadow-card backdrop-blur-sm sm:p-8">
          {children}
        </div>
        {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
      </div>
    </div>
  );
}
