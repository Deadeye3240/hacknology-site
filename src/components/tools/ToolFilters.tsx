import type { Difficulty, ToolCategory } from "@/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterChipGroup, type FilterOption } from "@/components/ui/FilterChipGroup";
import { ALL } from "@/components/labs/LabFilters";

const categoryValues: ToolCategory[] = [
  "Network Analysis",
  "Web Security",
  "System Administration",
  "Defensive Security",
  "Digital Forensics",
  "Monitoring",
  "Privacy & Security",
];

const skillValues: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

const categoryOptions: FilterOption[] = [
  { value: ALL, label: "All" },
  ...categoryValues.map((c) => ({ value: c, label: c })),
];

const skillOptions: FilterOption[] = [
  { value: ALL, label: "All" },
  ...skillValues.map((s) => ({ value: s, label: s })),
];

interface ToolFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  skillLevel: string;
  onSkillLevelChange: (value: string) => void;
}

/** Search + category + skill-level controls for the tools reference. */
export function ToolFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  skillLevel,
  onSkillLevelChange,
}: ToolFiltersProps) {
  return (
    <div className="flex flex-col gap-5">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search tools by name, description, or category…"
        label="Search tools"
        className="max-w-xl"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
        <FilterChipGroup
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={onCategoryChange}
        />
        <FilterChipGroup
          label="Skill level"
          options={skillOptions}
          value={skillLevel}
          onChange={onSkillLevelChange}
        />
      </div>
    </div>
  );
}
