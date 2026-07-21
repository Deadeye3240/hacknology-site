import type { ReactNode } from "react";
import type { IconComponent } from "@/types";
import { SearchIcon } from "@/components/ui/icons";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconComponent;
  /** Optional action, e.g. a "Clear filters" button. */
  action?: ReactNode;
}

/** Polished placeholder shown when a filtered list has no results. */
export function EmptyState({
  title,
  description,
  icon: Icon = SearchIcon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl text-slate-500">
        <Icon />
      </span>
      <div className="flex max-w-md flex-col gap-1.5">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
