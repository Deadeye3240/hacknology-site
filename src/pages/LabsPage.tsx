import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { SecurityNotice } from "@/components/ui/SecurityNotice";
import { EmptyState } from "@/components/ui/EmptyState";
import { LabCard } from "@/components/cards/LabCard";
import { LabFilters, ALL } from "@/components/labs/LabFilters";
import { LabProgress } from "@/components/labs/LabProgress";
import { FlaskIcon } from "@/components/ui/icons";
import { labs } from "@/data/labs";
import { pageContent } from "@/data/pages";

export default function LabsPage() {
  const { eyebrow, title, description, icon } = pageContent.labs;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [difficulty, setDifficulty] = useState<string>(ALL);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return labs.filter((lab) => {
      const matchesCategory = category === ALL || lab.category === category;
      const matchesDifficulty = difficulty === ALL || lab.level === difficulty;
      const matchesSearch =
        query === "" ||
        lab.title.toLowerCase().includes(query) ||
        lab.description.toLowerCase().includes(query) ||
        lab.category.toLowerCase().includes(query) ||
        lab.skills.some((skill) => skill.toLowerCase().includes(query));
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [search, category, difficulty]);

  const hasFilters = search !== "" || category !== ALL || difficulty !== ALL;

  function clearFilters() {
    setSearch("");
    setCategory(ALL);
    setDifficulty(ALL);
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

          <LabProgress />

          <LabFilters
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {filtered.length} {filtered.length === 1 ? "lab" : "labs"}
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
              {filtered.map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FlaskIcon}
              title="No labs found"
              description="No labs match your current search and filters. Try a different keyword or reset the filters to see everything."
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
