import type { ReactNode } from "react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/home/Reveal";
import { cn } from "@/lib/cn";

interface HomeSectionProps {
  children: ReactNode;
  id?: string;
  /** Primary sections carry the main story; secondary sections support without competing. */
  tone?: "primary" | "secondary";
  className?: string;
}

export function HomeSection({ children, id, tone = "primary", className }: HomeSectionProps) {
  return (
    <Section
      id={id}
      className={cn(
        tone === "primary" && "pt-0 first:pt-14 sm:first:pt-16",
        tone === "secondary" &&
          "relative border-y border-white/[0.04] bg-base-950/40 py-12 sm:py-14 lg:py-16",
        className,
      )}
    >
      <Reveal>{children}</Reveal>
    </Section>
  );
}
