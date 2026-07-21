import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  /** Small uppercase label rendered above the title. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Consistent heading block used to introduce page and homepage sections. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty text-base leading-relaxed text-slate-400",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
