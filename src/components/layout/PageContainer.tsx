import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageContainerProps {
  children: ReactNode;
  /** Removes the default horizontal padding/max-width (for full-bleed rows). */
  bleed?: boolean;
  className?: string;
}

/**
 * Centers content within the site's max width and applies consistent
 * horizontal padding. Use `bleed` for sections that manage their own layout.
 */
export function PageContainer({
  children,
  bleed = false,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        !bleed && "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
