import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { LockIcon } from "@/components/ui/icons";
import { timeAgo } from "@/lib/date";
import { paths } from "@/routes/paths";
import type { DiscussionListItem } from "@/types/forum";
import { cn } from "@/lib/cn";

const CATEGORY_ACCENTS: Record<string, string> = {
  "general-cybersecurity": "border-l-slate-400/40",
  networking: "border-l-sky-400/40",
  linux: "border-l-orange-400/40",
  "web-security": "border-l-rose-400/40",
  "defensive-security": "border-l-indigo-400/40",
  tools: "border-l-emerald-400/40",
  labs: "border-l-accent-400/40",
  "off-topic": "border-l-violet-400/40",
};

function categoryAccent(slug: string): string {
  return CATEGORY_ACCENTS[slug] ?? "border-l-accent-400/30";
}

interface DiscussionRowProps {
  discussion: DiscussionListItem;
}

export function DiscussionRow({ discussion: d }: DiscussionRowProps) {
  const isHot = d.reply_count >= 5;
  const isNew =
    Date.now() - new Date(d.created_at).getTime() < 1000 * 60 * 60 * 48 && d.reply_count === 0;

  return (
    <Link
      to={`${paths.forum}/${d.id}`}
      className={cn(
        "group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-b border-white/[0.04] px-2.5 py-2 transition-colors last:border-b-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-2.5 sm:px-3",
        "border-l-2 border-l-transparent hover:bg-white/[0.025]",
        categoryAccent(d.category_slug),
        "hover:border-l-accent-400/50",
      )}
    >
      <Avatar
        name={d.author_display_name}
        avatar={d.author_avatar}
        size="xs"
        className="hidden shrink-0 sm:grid"
      />

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1.5">
          {d.locked === 1 && (
            <LockIcon className="shrink-0 text-[10px] text-amber-400/80" aria-label="Locked" />
          )}
          <h3 className="truncate text-[13px] font-medium leading-tight text-slate-100 group-hover:text-white">
            {d.title}
          </h3>
          {isNew && (
            <span className="hidden shrink-0 rounded bg-emerald-400/10 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-emerald-300 sm:inline">
              New
            </span>
          )}
          {isHot && (
            <span className="hidden shrink-0 rounded bg-amber-400/10 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-amber-300 sm:inline">
              Hot
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-[11px] leading-tight text-slate-500">
          <span className="text-slate-400">{d.category_name}</span>
          <span aria-hidden> · </span>
          {d.author_display_name}
          <span aria-hidden> · </span>
          {timeAgo(d.updated_at)}
          {d.content_excerpt && (
            <>
              <span aria-hidden> · </span>
              <span className="text-slate-600">{d.content_excerpt}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex shrink-0 items-baseline gap-0.5 pl-1 text-right sm:pl-0">
        <span className="font-mono text-[11px] tabular-nums text-slate-300">{d.reply_count}</span>
      </div>
    </Link>
  );
}

/** Column labels for the discussion feed table. */
export function DiscussionFeedHeader() {
  return (
    <div className="hidden grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2.5 border-b border-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:grid">
      <span className="w-6" aria-hidden />
      <span>Discussion</span>
      <span className="text-right">Replies</span>
    </div>
  );
}
