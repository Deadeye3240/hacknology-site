import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CommunityShell } from "@/components/forum/CommunityShell";
import { ForumContent } from "@/components/forum/ForumContent";
import { api, ApiError } from "@/lib/api";
import { paths } from "@/routes/paths";
import type { ForumCategory } from "@/types/forum";

const EXAMPLE = `\`\`\`bash
nmap -sV -p 22,80 10.10.10.25
\`\`\`

Use fenced code blocks for commands. Add #tags in titles for discoverability.`;

const fieldClass =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-accent-400/50 focus:outline-none focus:ring-1 focus:ring-accent-400/20";

const CODE_SNIPPETS = [
  { label: "Bash", value: "```bash\n\n```" },
  { label: "Log", value: "```\n[timestamp] event detail\n```" },
  { label: "Inline", value: "`command`" },
] as const;

export default function ForumNewPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    api
      .get<{ categories: ForumCategory[] }>("/forum/categories")
      .then((res) => {
        setCategories(res.categories);
        if (res.categories[0]) setCategoryId(res.categories[0].id);
      })
      .catch(() => setError("Could not load categories."));
  }, []);

  function insertSnippet(snippet: string) {
    setContent((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
    setShowPreview(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await api.post<{ id: string }>("/forum/discussions", {
        title,
        categoryId,
        content,
      });
      navigate(`${paths.forum}/${res.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fields ?? {});
        if (!err.fields) setError(err.message);
      } else {
        setError("Could not create the discussion.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CommunityShell title="Start a discussion" breadcrumb={[{ label: "New" }]}>
      <div className="mx-auto grid max-w-3xl gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="rounded-md border border-white/[0.06] bg-white/[0.01] p-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            {error && <Alert variant="error">{error}</Alert>}

            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-[11px] font-medium text-slate-400">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={140}
                required
                autoFocus
                placeholder="Be specific about your question or topic"
                className={fieldClass + (fieldErrors.title ? " border-red-400/50" : "")}
              />
              {fieldErrors.title && <p className="text-[10px] text-red-300">{fieldErrors.title}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="category" className="text-[11px] font-medium text-slate-400">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={fieldClass + " h-8"}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-base-900">
                    {c.name}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId && (
                <p className="text-[10px] text-red-300">{fieldErrors.categoryId}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="content" className="text-[11px] font-medium text-slate-400">
                  Content
                </label>
                <div className="flex flex-wrap items-center gap-1">
                  {CODE_SNIPPETS.map((snippet) => (
                    <button
                      key={snippet.label}
                      type="button"
                      onClick={() => insertSnippet(snippet.value)}
                      className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 transition hover:border-accent-400/30 hover:text-accent-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-400/40"
                    >
                      + {snippet.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowPreview((v) => !v)}
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-500 hover:text-accent-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-400/40"
                  >
                    {showPreview ? "Edit" : "Preview"}
                  </button>
                </div>
              </div>
              {showPreview ? (
                <div className="min-h-[10rem] rounded-md border border-white/[0.06] bg-base-950/50 p-2">
                  {content.trim() ? (
                    <ForumContent content={content} compact />
                  ) : (
                    <p className="text-xs text-slate-600">Nothing to preview yet.</p>
                  )}
                </div>
              ) : (
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={10000}
                  required
                  placeholder="Context, steps tried, relevant output…"
                  className={fieldClass + " min-h-[10rem] resize-y"}
                />
              )}
              {fieldErrors.content && <p className="text-[10px] text-red-300">{fieldErrors.content}</p>}
            </div>

            <div className="flex justify-end gap-1.5 border-t border-white/[0.04] pt-2.5">
              <Button to={paths.forum} variant="ghost" size="xs">
                Cancel
              </Button>
              <Button type="submit" size="xs" disabled={submitting}>
                {submitting ? "Posting…" : "Publish"}
              </Button>
            </div>
          </form>
        </div>

        <aside className="flex flex-col gap-2 lg:sticky lg:top-16 lg:self-start">
          <div className="rounded-md border border-white/[0.06] bg-white/[0.015] p-2.5">
            <h2 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              Formatting
            </h2>
            <ForumContent content={EXAMPLE} compact />
          </div>
        </aside>
      </div>
    </CommunityShell>
  );
}
