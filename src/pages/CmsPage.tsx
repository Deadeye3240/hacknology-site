import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { PageRenderer } from "@/components/cms/PageRenderer";
import { DocsIcon } from "@/components/ui/icons";
import { api, ApiError } from "@/lib/api";
import type { CmsPageContent } from "@/types/cms";
import NotFoundPage from "@/pages/NotFoundPage";

interface PublicCmsPage {
  slug: string;
  title: string;
  description: string;
  content: CmsPageContent;
}

/** Renders a published CMS page at /pages/:slug or /:slug. */
export default function CmsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PublicCmsPage | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    void api
      .get<{ page: PublicCmsPage }>(`/cms/pages/${encodeURIComponent(slug)}`)
      .then((res) => setPage(res.page))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-400" />
      </div>
    );
  }

  if (notFound || !page) return <NotFoundPage />;

  return (
    <>
      <PageHeader
        eyebrow="Page"
        title={page.title}
        description={page.description}
        icon={DocsIcon}
      />
      <Section>
        <PageRenderer content={page.content} />
      </Section>
    </>
  );
}
