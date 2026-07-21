import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { BookIcon } from "@/components/ui/icons";
import { api, ApiError } from "@/lib/api";
import { paths } from "@/routes/paths";
import type { ForumCategory } from "@/types/forum";

export default function ForumNewPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<{ categories: ForumCategory[] }>("/forum/categories")
      .then((res) => {
        setCategories(res.categories);
        if (res.categories[0]) setCategoryId(res.categories[0].id);
      })
      .catch(() => setError("Could not load categories."));
  }, []);

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
    <>
      <PageHeader
        eyebrow="Community"
        title="Start a discussion"
        description="Ask a question or share something with the community."
        icon={BookIcon}
      />
      <PageContainer className="py-10">
        <Card className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {error && <Alert variant="error">{error}</Alert>}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={fieldErrors.title}
              maxLength={140}
              required
              autoFocus
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-slate-200">
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 focus:border-accent-400/60 focus:outline-none focus:ring-2 focus:ring-accent-400/20"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-base-900">
                    {c.name}
                  </option>
                ))}
              </select>
              {fieldErrors.categoryId && (
                <p className="text-xs text-red-300">{fieldErrors.categoryId}</p>
              )}
            </div>
            <TextAreaField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={fieldErrors.content}
              hint="Plain text only. Links and formatting are not rendered as HTML."
              maxLength={10000}
              required
            />
            <div className="flex justify-end gap-2">
              <Button to={paths.forum} variant="ghost">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Posting…" : "Post discussion"}
              </Button>
            </div>
          </form>
        </Card>
      </PageContainer>
    </>
  );
}
