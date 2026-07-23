import type { FeedSort } from "@/lib/forumFeed";
import { FEED_SORT_OPTIONS } from "@/lib/forumFeed";
import { cn } from "@/lib/cn";

interface FeedTabsProps {
  value: FeedSort;
  onChange: (sort: FeedSort) => void;
}

export function FeedTabs({ value, onChange }: FeedTabsProps) {
  return (
    <div
      className="flex items-center gap-1 overflow-x-auto pb-0.5"
      role="tablist"
      aria-label="Sort discussions"
    >
      {FEED_SORT_OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            title={opt.hint}
            onClick={() => onChange(opt.id)}
            className={cn(
              "relative shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400/50",
              active
                ? "bg-white/[0.06] text-white"
                : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300",
            )}
          >
            {opt.label}
            {active && (
              <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent-400/80" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}
