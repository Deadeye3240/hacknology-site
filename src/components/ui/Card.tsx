import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adds a subtle lift + accent border on hover (useful for links). */
  interactive?: boolean;
  className?: string;
}

/**
 * Rounded surface used as the base container for most content blocks.
 */
export function Card({
  children,
  interactive = false,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-surface/70 p-6 shadow-card backdrop-blur-sm",
        interactive &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-400/40 hover:shadow-glow",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
