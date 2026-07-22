import type { FeedSort } from "@/lib/forumFeed";
import { FEED_SORT_OPTIONS } from "@/lib/forumFeed";
import { cn } from "@/lib/cn";

interface FeedTabsProps {
  value: FeedSort;
  onChange: (sort: FeedSort) => void;
}

export function FeedTabs({ value, onChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto">
      {FEED_SORT_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          title={opt.hint}
          onClick={() => onChange(opt.id)}
          className={cn(
            "relative shrink-0 rounded px-2 py-1 text-[11px] font-medium transition-colors",
            value === opt.id
              ? "bg-white/[0.06] text-white"
              : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
