import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import type { CmsPage, CmsPageContent } from "@/types/cms";

function defaultContent(): string {
  return JSON.stringify(
    {
      blocks: [
        { type: "heading", level: 1, text: "Page title" },
        { type: "paragraph", text: "Write your content here." },
      ],
    } satisfies CmsPageContent,
    null,
    2,
  );
}

export default function AdminPageEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [content, setContent] = useState(defaultContent());
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (isNew || !id) return;
    const res = await api.get<{ page: CmsPage }>(`/admin/pages/${id}`);
    const p = res.page;
    setSlug(p.slug);
    setTitle(p.title);
    setDescription(p.description);
    setSeoTitle(p.seoTitle ?? "");
    setSeoDescription(p.seoDescription ?? "");
    setContent(p.content);
    setStatus(p.status);
  }, [id, isNew]);

  useEffect(() => {
    void load().catch(() => setError("Could not load page."));
  }, [load]);

  async function save(nextStatus?: "draft" | "published") {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        title,
        description,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        content,
        status: nextStatus ?? status,
      };
      if (isNew) {
        const res = await api.post<{ page: CmsPage }>("/admin/pages", payload);
        navigate(`/admin/pages/${res.page.id}`, { replace: true });
      } else {
        await api.patch(`/admin/pages/${id}`, payload);
      }
      if (nextStatus) setStatus(nextStatus);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-white">{isNew ? "Create page" : "Edit page"}</h2>
      {error && <Alert variant="error">{error}</Alert>}
      <Card className="flex flex-col gap-4 p-5">
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextField
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          hint="URL path, e.g. nmap-fundamentals"
        />
        <TextAreaField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField label="SEO title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        <TextAreaField
          label="SEO description"
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
        />
        <TextAreaField
          label="Content (JSON blocks)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          hint='Structured blocks: heading, paragraph, list, code. Rendered safely as text.'
          rows={16}
        />
        <div className="flex flex-wrap gap-2">
          <Button disabled={busy} onClick={() => void save("draft")}>Save draft</Button>
          <Button disabled={busy} variant="secondary" onClick={() => void save("published")}>
            Publish
          </Button>
          {status === "published" && slug && (
            <Button to={`/${slug}`} variant="ghost">Preview</Button>
          )}
          <Button to="/admin/pages" variant="ghost">Back</Button>
        </div>
      </Card>
    </div>
  );
}
