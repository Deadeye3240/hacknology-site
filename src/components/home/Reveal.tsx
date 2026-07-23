import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

/** Scroll-triggered fade/slide — subtle; respects reduced motion via CSS. */
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

  return (
    <div
      ref={ref}
      className={cn(
        "motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-out",
        inView ? "motion-safe:translate-y-0 motion-safe:opacity-100" : "motion-safe:translate-y-5 motion-safe:opacity-0",
        className,
      )}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
