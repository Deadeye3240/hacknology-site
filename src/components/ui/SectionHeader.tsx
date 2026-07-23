import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  /** Editorial section index, e.g. "01". */
  index?: string;
  /** Small uppercase label rendered above the title. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Consistent heading block used to introduce page and homepage sections. */
export function SectionHeader({
  index,
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
      {(index || eyebrow) && (
        <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
          {index && (
            <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-slate-600">{index}</span>
          )}
          {index && eyebrow && <span className="h-px w-8 bg-white/10" aria-hidden />}
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">{eyebrow}</span>
          )}
        </div>
      )}
      <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl lg:text-[2rem] lg:leading-tight">
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
