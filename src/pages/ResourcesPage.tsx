import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SecurityNotice } from "@/components/ui/SecurityNotice";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { ALL } from "@/components/labs/LabFilters";
import { DocsIcon } from "@/components/ui/icons";
import { resources } from "@/data/resources";
import { pageContent } from "@/data/pages";

export default function ResourcesPage() {
  const { eyebrow, title, description, icon } = pageContent.resources;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = category === ALL || resource.category === category;
      const matchesSearch =
        query === "" ||
        resource.name.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const hasFilters = search !== "" || category !== ALL;

  function clearFilters() {
    setSearch("");
    setCategory(ALL);
  }

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        icon={icon}
      />

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
              {filtered.length}{" "}
              {filtered.length === 1 ? "resource" : "resources"}
              {hasFilters ? " match your filters" : " available"}
            </p>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={DocsIcon}
              title="No resources found"
              description="No resources match your current search and filters. Try a different keyword or reset the filters."
              action={
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </Section>
    </>
  );
}
