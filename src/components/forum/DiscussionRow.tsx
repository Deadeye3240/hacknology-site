import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
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
  const isActive =
    Date.now() - new Date(d.updated_at).getTime() < 1000 * 60 * 60 * 6 && d.reply_count > 0;

  return (
    <Link
      to={`${paths.forum}/${d.id}`}
      className={cn(
        "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2.5 border-b border-white/[0.04] px-3 py-3 transition-colors last:border-b-0 sm:items-center sm:gap-x-3 sm:px-4 sm:py-2.5",
        "border-l-2 border-l-transparent hover:bg-white/[0.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent-400/40",
        categoryAccent(d.category_slug),
        "hover:border-l-accent-400/50",
      )}
    >
      <Avatar
        name={d.author_display_name}
        avatar={d.author_avatar}
        size="xs"
        className="mt-0.5 shrink-0 sm:mt-0"
      />

      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-1.5 sm:mb-0.5">
          <Badge variant="neutral" className="px-1.5 py-0 text-[9px] font-medium">
            {d.category_name}
          </Badge>
          {d.locked === 1 && (
            <LockIcon className="shrink-0 text-[10px] text-amber-400/80" aria-label="Locked" />
          )}
          {isNew && (
            <span className="rounded bg-emerald-400/10 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-emerald-300">
              New
            </span>
          )}
          {isHot && (
            <span className="rounded bg-amber-400/10 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-amber-300">
              Hot
            </span>
          )}
          {isActive && !isHot && (
            <span className="hidden rounded bg-sky-400/10 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-sky-300 sm:inline">
              Active
            </span>
          )}
        </div>

        <h3 className="text-[13px] font-semibold leading-snug text-slate-100 group-hover:text-white sm:text-sm">
          {d.title}
        </h3>

        <p className="mt-1 hidden text-[11px] text-slate-500 sm:block">
          <span className="text-slate-400">{d.author_display_name}</span>
          <span aria-hidden> · </span>
          <time dateTime={d.updated_at}>{timeAgo(d.updated_at)}</time>
        </p>

        {d.content_excerpt && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600 sm:line-clamp-1">
            {d.content_excerpt}
          </p>
        )}

        <p className="mt-1 text-[10px] text-slate-600 sm:hidden">
          {d.author_display_name} · {timeAgo(d.updated_at)}
        </p>
      </div>

      <div
        className="flex shrink-0 flex-col items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 text-center sm:min-w-[3rem] sm:px-2.5"
        aria-label={`${d.reply_count} replies`}
      >
        <span className="font-mono text-sm font-semibold tabular-nums text-slate-200">{d.reply_count}</span>
        <span className="text-[9px] uppercase tracking-wide text-slate-600">replies</span>
      </div>
    </Link>
  );
}

/** Column labels for the discussion feed table. */
export function DiscussionFeedHeader() {
  return (
    <div className="hidden grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-white/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:grid">
      <span className="w-6" aria-hidden />
      <span>Discussion</span>
      <span className="text-center">Replies</span>
    </div>
  );
}
