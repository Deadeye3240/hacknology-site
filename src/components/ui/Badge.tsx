import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "accent" | "neutral" | "success" | "warning";

const variantClasses: Record<BadgeVariant, string> = {
  accent: "border-accent-400/30 bg-accent-400/10 text-accent-200",
  neutral: "border-white/10 bg-white/[0.04] text-slate-300",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/** Small pill used for tags, difficulty levels, and status labels. */
export function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
