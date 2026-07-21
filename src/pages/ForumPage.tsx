import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SecurityNotice } from "@/components/ui/SecurityNotice";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { UsersIcon, LockIcon } from "@/components/ui/icons";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/date";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import type { ForumCategory, DiscussionListItem } from "@/types/forum";

export default function ForumPage() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionListItem[]>([]);
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api
      .get<{ categories: ForumCategory[] }>("/forum/categories")
      .then((res) => setCategories(res.categories))
      .catch(() => setFailed(true));
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
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(() => void loadDiscussions(), 250);
    return () => clearTimeout(timer);
  }, [loadDiscussions]);

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Forum"
        description="A lightweight community to ask questions, share knowledge, and discuss cybersecurity."
        icon={UsersIcon}
        actions={
          isAuthenticated ? (
            <Button to={paths.forumNew}>Start a discussion</Button>
          ) : (
            <Button to={paths.login} variant="secondary">
              Sign in to post
            </Button>
          )
        }
      />
      <PageContainer className="py-10">
        <div className="flex flex-col gap-6">
          <SecurityNotice />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="sm:max-w-sm sm:flex-1">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search discussions…"
                label="Search discussions"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory("")}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (category === ""
                    ? "border-accent-400/40 bg-accent-400/10 text-accent-200"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white")
                }
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                    (category === c.id
                      ? "border-accent-400/40 bg-accent-400/10 text-accent-200"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white")
                  }
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {failed ? (
            <EmptyState
              title="Forum unavailable"
              description="The forum backend isn't reachable. If you're running locally, start it with npm run cf:dev after setting up the D1 database (see README)."
            />
          ) : loading ? (
            <div className="flex min-h-[30vh] items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
            </div>
          ) : discussions.length === 0 ? (
            <EmptyState
              title="No discussions yet"
              description="Be the first to start a conversation in this category."
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {discussions.map((d) => (
                <li key={d.id}>
                  <Link to={`${paths.forum}/${d.id}`} className="block">
                    <Card interactive className="flex items-center justify-between gap-4 p-5">
                      <div className="flex min-w-0 items-start gap-3">
                        <Avatar
                          name={d.author_display_name}
                          avatar={d.author_avatar}
                          size="sm"
                          className="mt-0.5"
                        />
                        <div className="flex min-w-0 flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            {d.locked === 1 && <LockIcon className="text-sm text-amber-300" />}
                            <h3 className="truncate text-base font-semibold text-white">
                              {d.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <Badge variant="neutral">{d.category_name}</Badge>
                            <span>by {d.author_display_name}</span>
                            <span aria-hidden>·</span>
                            <span>updated {timeAgo(d.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end text-right">
                        <span className="text-lg font-semibold text-white">{d.reply_count}</span>
                        <span className="text-xs text-slate-500">
                          {d.reply_count === 1 ? "reply" : "replies"}
                        </span>
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PageContainer>
    </>
  );
}
