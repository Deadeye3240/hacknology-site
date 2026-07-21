import { useParams } from "react-router-dom";
import { isReservedSlug } from "@/lib/reservedSlugs";
import NotFoundPage from "@/pages/NotFoundPage";
import CmsPage from "@/pages/CmsPage";

/** Catch-all slug route — serves CMS pages when slug is not reserved. */
export default function DynamicSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug || isReservedSlug(slug)) return <NotFoundPage />;
  return <CmsPage />;
}
