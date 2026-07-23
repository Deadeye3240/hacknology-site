import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/date";
import { paths } from "@/routes/paths";
import type { DiscussionListItem } from "@/types/forum";

export function CommunityThreadPreview() {
  const [discussions, setDiscussions] = useState<DiscussionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void api
      .get<{ discussions: DiscussionListItem[] }>("/forum/discussions")
      .then((res) => {
        if (cancelled) return;
        setDiscussions(res.discussions.slice(0, 3));
        setUnavailable(false);
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-lg px-2 py-3">
            <div className="h-3.5 w-4/5 rounded bg-white/10" />
            <div className="mt-2 h-2.5 w-1/2 rounded bg-white/[0.06]" />
          </div>
        ))}
      </div>
    );
  }

  if (unavailable || discussions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center">
        <p className="text-sm text-slate-400">
          {unavailable
            ? "Recent discussions will appear here when the forum is available."
            : "No discussions yet — be the first to start a conversation."}
        </p>
        <Link
          to={paths.forumNew}
          className="mt-3 inline-block text-xs font-medium text-accent-300 hover:text-accent-200"
        >
          Start a discussion
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2">
      {discussions.map((thread) => {
        const isHot = thread.reply_count >= 5;
        const isNew =
          Date.now() - new Date(thread.created_at).getTime() < 1000 * 60 * 60 * 48 &&
          thread.reply_count === 0;

        return (
          <Link
            key={thread.id}
            to={`${paths.forum}/${thread.id}`}
            className="block rounded-lg border border-transparent px-2.5 py-2.5 transition hover:border-white/10 hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400/50"
          >
            <div className="flex items-start gap-2">
              <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-slate-200">
                {thread.title}
              </p>
              <div className="flex shrink-0 gap-1">
                {isNew && (
                  <span className="rounded bg-emerald-400/10 px-1 py-px text-[9px] font-semibold uppercase text-emerald-300">
                    New
                  </span>
                )}
                {isHot && (
                  <span className="rounded bg-amber-400/10 px-1 py-px text-[9px] font-semibold uppercase text-amber-300">
                    Hot
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              <span className="text-slate-400">{thread.category_name}</span>
              <span aria-hidden> · </span>
              {thread.author_display_name}
              <span aria-hidden> · </span>
              {timeAgo(thread.updated_at)}
              <span aria-hidden> · </span>
              {thread.reply_count} {thread.reply_count === 1 ? "reply" : "replies"}
            </p>
            {thread.content_excerpt && (
              <p className="mt-1 line-clamp-1 text-[11px] text-slate-600">{thread.content_excerpt}</p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
