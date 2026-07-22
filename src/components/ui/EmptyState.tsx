import type { ReactNode } from "react";
import type { IconComponent } from "@/types";
import { SearchIcon } from "@/components/ui/icons";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconComponent;
  /** Optional action, e.g. a "Clear filters" button. */
  action?: ReactNode;
  compact?: boolean;
}

/** Polished placeholder shown when a filtered list has no results. */
export function EmptyState({
  title,
  description,
  icon: Icon = SearchIcon,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={
        compact
          ? "flex flex-col items-center gap-3 px-4 py-8 text-center"
          : "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center"
      }
    >
      {!compact && (
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl text-slate-500">
          <Icon />
        </span>
      )}
      <div className="flex max-w-md flex-col gap-1.5">
        <h3 className={compact ? "text-sm font-semibold text-white" : "text-base font-semibold text-white"}>
          {title}
        </h3>
        <p className={compact ? "text-xs leading-relaxed text-slate-500" : "text-sm leading-relaxed text-slate-400"}>
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
