import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SecurityNotice } from "@/components/ui/SecurityNotice";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { ALL } from "@/components/labs/LabFilters";
import { DocsIcon, ArrowRightIcon } from "@/components/ui/icons";
import { resources as staticResources } from "@/data/resources";
import { pageContent } from "@/data/pages";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { Resource } from "@/types";

interface CmsResourcePublic {
  id: string;
  name: string;
  description: string;
  category: string;
  website: string | null;
  resourceLink: string | null;
  downloadUrl: string | null;
  fileName: string | null;
}

function CmsDownloadCard({ resource }: { resource: CmsResourcePublic }) {
  return (
    <Card interactive className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{resource.name}</h3>
        <Badge variant="neutral" className="shrink-0">{resource.category}</Badge>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{resource.description}</p>
      <div className="mt-auto flex flex-wrap gap-3 border-t border-white/5 pt-4 text-sm">
        {resource.downloadUrl && (
          <a
            href={resource.downloadUrl}
            className="inline-flex items-center gap-1.5 text-accent-300 hover:text-accent-200"
            download={resource.fileName ?? undefined}
          >
            <ArrowRightIcon className="text-sm" />
            Download
          </a>
        )}
        {resource.website && (
          <a
            href={resource.website}
            target="_blank"
            rel="noreferrer noopener"
            className="text-slate-400 hover:text-white"
          >
            Website
          </a>
        )}
      </div>
    </Card>
  );
}

export default function ResourcesPage() {
  const { eyebrow, title, description, icon } = pageContent.resources;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [cmsResources, setCmsResources] = useState<CmsResourcePublic[]>([]);

  useEffect(() => {
    void api
      .get<{ resources: CmsResourcePublic[] }>("/cms/resources")
      .then((res) => setCmsResources(res.resources))
      .catch(() => {
        /* static resources still shown */
      });
  }, []);

  const filteredStatic = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staticResources.filter((resource) => {
      const matchesCategory = category === ALL || resource.category === category;
      const matchesSearch =
        query === "" ||
        resource.name.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const filteredCms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cmsResources.filter((resource) => {
      const matchesCategory = category === ALL || resource.category === category;
      const matchesSearch =
        query === "" ||
        resource.name.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, category, cmsResources]);

  const hasFilters = search !== "" || category !== ALL;
  const totalCount = filteredStatic.length + filteredCms.length;

  function clearFilters() {
    setSearch("");
    setCategory(ALL);
  }

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} icon={icon} />

      <Section>
        <div className="flex flex-col gap-8">
          <SecurityNotice />

          <ResourceFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {totalCount} {totalCount === 1 ? "resource" : "resources"}
              {hasFilters ? " match your filters" : " available"}
            </p>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>

          {filteredCms.length > 0 && (
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Downloads
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCms.map((resource) => (
                  <CmsDownloadCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {filteredStatic.length > 0 ? (
            <div>
              {filteredCms.length > 0 && (
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  External resources
                </h2>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStatic.map((resource: Resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          ) : filteredCms.length === 0 ? (
            <EmptyState
              icon={DocsIcon}
              title="No resources found"
              description="No resources match your current search and filters."
              action={
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : null}
        </div>
      </Section>
    </>
  );
}
