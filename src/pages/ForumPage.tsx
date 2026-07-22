import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { CommunityShell } from "@/components/forum/CommunityShell";
import { FeedTabs } from "@/components/forum/FeedTabs";
import { CategoryFilter } from "@/components/forum/CategoryFilter";
import { DiscussionRow, DiscussionFeedHeader } from "@/components/forum/DiscussionRow";
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { api } from "@/lib/api";
import { sortDiscussions, feedStats, type FeedSort } from "@/lib/forumFeed";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import type { ForumCategory, DiscussionListItem } from "@/types/forum";

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionListItem[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<FeedSort>("latest");
  const [loading, setLoading] = useState(true);
  const [discussionsFailed, setDiscussionsFailed] = useState(false);
  const [categoriesFailed, setCategoriesFailed] = useState(false);

  useEffect(() => {
    api
      .get<{ categories: ForumCategory[] }>("/forum/categories")
      .then((res) => {
        setCategories(res.categories);
        setCategoriesFailed(false);
      })
      .catch(() => setCategoriesFailed(true));
  }, []);

  const loadDiscussions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search.trim()) params.set("search", search.trim());
      const qs = params.toString();
      const res = await api.get<{ discussions: DiscussionListItem[] }>(
        `/forum/discussions${qs ? `?${qs}` : ""}`,
      );
      setDiscussions(res.discussions);
      setDiscussionsFailed(false);
    } catch {
      setDiscussionsFailed(true);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(() => void loadDiscussions(), 250);
    return () => clearTimeout(timer);
  }, [loadDiscussions]);

  const sorted = useMemo(() => sortDiscussions(discussions, sort), [discussions, sort]);
  const stats = useMemo(() => feedStats(discussions), [discussions]);

  return (
    <CommunityShell
      title="Discussions"
      actions={
        isAuthenticated ? (
          <Button to={paths.forumNew} size="xs">
            Start discussion
          </Button>
        ) : (
          <Button to={paths.login} variant="secondary" size="xs">
            Sign in to post
          </Button>
        )
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_188px] lg:gap-5">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              compact
              value={search}
              onChange={setSearch}
              placeholder="Search…"
              label="Search discussions"
              className="sm:max-w-[220px]"
            />
            <FeedTabs value={sort} onChange={setSort} />
          </div>

          <div className="lg:hidden">
            <CategoryFilter categories={categories} value={category} onChange={setCategory} />
          </div>

          <div className="overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.008]">
            <DiscussionFeedHeader />

            {discussionsFailed ? (
              <div className="p-3">
                <EmptyState
                  compact
                  title="Community unavailable"
                  description="The forum backend isn't reachable. If you're running locally, start it with npm run cf:dev."
                />
              </div>
            ) : loading ? (
              <div className="flex min-h-[120px] items-center justify-center py-6">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
              </div>
            ) : sorted.length === 0 ? (
              <div className="p-3">
                <EmptyState
                  compact
                  title="Nothing here yet"
                  description={
                    sort === "unanswered"
                      ? "All visible discussions have at least one reply."
                      : "Be the first to start a conversation in this view."
                  }
                  action={
                    isAuthenticated ? (
                      <Button to={paths.forumNew} size="xs">
                        Start a discussion
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ) : (
              <>
                <div role="list">
                  {sorted.map((d) => (
                    <div key={d.id} role="listitem">
                      <DiscussionRow discussion={d} />
                    </div>
                  ))}
                </div>
                {discussions.length >= 100 && (
                  <p className="border-t border-white/[0.04] px-3 py-1.5 text-center text-[10px] text-slate-600">
                    Showing 100 most recent — refine search or category to narrow results.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <ForumSidebar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          stats={stats}
        />
      </div>

      {categoriesFailed && !discussionsFailed && (
        <p className="text-xs text-amber-300/90">
          Category filters are temporarily unavailable — discussions still load.
        </p>
      )}
    </CommunityShell>
  );
}
