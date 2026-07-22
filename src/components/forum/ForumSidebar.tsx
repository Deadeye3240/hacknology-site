import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { paths } from "@/routes/paths";
import type { ForumCategory } from "@/types/forum";

interface ForumSidebarProps {
  categories: ForumCategory[];
  category: string;
  onCategoryChange: (id: string) => void;
  stats: { total: number; unanswered: number; activeToday: number };
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.015] p-2.5">
      <h2 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">{title}</h2>
      {children}
    </div>
  );
}

export function ForumSidebar({ categories, category, onCategoryChange, stats }: ForumSidebarProps) {
  const { isAuthenticated } = useAuth();

  return (
    <aside className="flex flex-col gap-2 lg:sticky lg:top-16 lg:self-start">
      <Panel title="Participate">
        {isAuthenticated ? (
          <Button to={paths.forumNew} size="xs" className="w-full">
            New discussion
          </Button>
        ) : (
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] leading-snug text-slate-500">Sign in to post and reply.</p>
            <Button to={paths.login} variant="secondary" size="xs" className="w-full">
              Sign in
            </Button>
          </div>
        )}
      </Panel>

      <Panel title="Pulse">
        <dl className="grid grid-cols-3 gap-1 text-center">
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-slate-600">Total</dt>
            <dd className="font-mono text-xs text-slate-200">{stats.total}</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-slate-600">Today</dt>
            <dd className="font-mono text-xs text-emerald-300">{stats.activeToday}</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-wide text-slate-600">Open</dt>
            <dd className="font-mono text-xs text-amber-300">{stats.unanswered}</dd>
          </div>
        </dl>
      </Panel>

      <Panel title="Categories">
        <ul className="flex flex-col gap-px">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange("")}
              title="All topics"
              className={
                "w-full rounded px-1.5 py-1 text-left text-[11px] transition-colors " +
                (category === ""
                  ? "bg-white/[0.06] font-medium text-white"
                  : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300")
              }
            >
              All topics
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onCategoryChange(c.id)}
                title={c.description || c.name}
                className={
                  "w-full rounded px-1.5 py-1 text-left text-[11px] transition-colors " +
                  (category === c.id
                    ? "bg-white/[0.06] font-medium text-white"
                    : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300")
                }
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </aside>
  );
}
