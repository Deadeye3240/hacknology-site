import type { DiscussionListItem } from "@/types/forum";

export type FeedSort = "latest" | "active" | "unanswered" | "trending";

export const FEED_SORT_OPTIONS: { id: FeedSort; label: string; hint: string }[] = [
  { id: "latest", label: "Newest", hint: "Recently created or updated discussions" },
  { id: "active", label: "Active", hint: "Most replies in this view" },
  { id: "trending", label: "Trending", hint: "Popular recent conversations" },
  { id: "unanswered", label: "Unanswered", hint: "Threads with no replies yet" },
];

function trendingScore(d: DiscussionListItem): number {
  const ageHours = (Date.now() - new Date(d.updated_at).getTime()) / 3_600_000;
  const recency = Math.max(0, 168 - ageHours) / 168;
  return d.reply_count * 2 + recency * 3;
}

export function sortDiscussions(
  discussions: DiscussionListItem[],
  sort: FeedSort,
): DiscussionListItem[] {
  const copy = [...discussions];
  switch (sort) {
    case "active":
      return copy.sort((a, b) => b.reply_count - a.reply_count || b.updated_at.localeCompare(a.updated_at));
    case "unanswered":
      return copy.filter((d) => d.reply_count === 0);
    case "trending":
      return copy.sort((a, b) => trendingScore(b) - trendingScore(a));
    case "latest":
    default:
      return copy.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }
}

export function feedStats(discussions: DiscussionListItem[]) {
  const total = discussions.length;
  const unanswered = discussions.filter((d) => d.reply_count === 0).length;
  const activeToday = discussions.filter((d) => {
    const hours = (Date.now() - new Date(d.updated_at).getTime()) / 3_600_000;
    return hours < 24;
  }).length;
  return { total, unanswered, activeToday };
}
