import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SecurityNotice } from "@/components/ui/SecurityNotice";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToolCard } from "@/components/cards/ToolCard";
import { ToolFilters } from "@/components/tools/ToolFilters";
import { ALL } from "@/components/labs/LabFilters";
import { WrenchIcon } from "@/components/ui/icons";
import { tools } from "@/data/tools";
import { pageContent } from "@/data/pages";

export default function ToolsPage() {
  const { eyebrow, title, description, icon } = pageContent.tools;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [skillLevel, setSkillLevel] = useState<string>(ALL);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category === ALL || tool.category === category;
      const matchesSkill = skillLevel === ALL || tool.skillLevel === skillLevel;
      const matchesSearch =
        query === "" ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);
      return matchesCategory && matchesSkill && matchesSearch;
    });
  }, [search, category, skillLevel]);

  const hasFilters = search !== "" || category !== ALL || skillLevel !== ALL;

  function clearFilters() {
    setSearch("");
    setCategory(ALL);
    setSkillLevel(ALL);
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

          <ToolFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            skillLevel={skillLevel}
            onSkillLevelChange={setSkillLevel}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {filtered.length} {filtered.length === 1 ? "tool" : "tools"}
              {hasFilters ? " match your filters" : " in the reference"}
            </p>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={WrenchIcon}
              title="No tools found"
              description="No tools match your current search and filters. Try a different keyword or reset the filters."
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
