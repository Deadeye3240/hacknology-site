import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { PageContainer } from "@/components/layout/PageContainer";

interface SectionProps {
  children: ReactNode;
  /** Renders content without the centered container (for custom layouts). */
  bleed?: boolean;
  className?: string;
  id?: string;
}

/** Standard vertical spacing wrapper for page and homepage sections. */
export function Section({ children, bleed, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-14 sm:py-16 lg:py-20", className)}>
      {bleed ? children : <PageContainer>{children}</PageContainer>}
    </section>
  );
}
