import type { Difficulty, LabCategory } from "@/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterChipGroup, type FilterOption } from "@/components/ui/FilterChipGroup";

/** Sentinel value representing "no filter applied". */
export const ALL = "all";

const categoryValues: LabCategory[] = [
  "Beginner",
  "Networking",
  "Linux",
  "Web Security",
  "Defensive Security",
  "CTF",
];

const difficultyValues: Difficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const categoryOptions: FilterOption[] = [
  { value: ALL, label: "All" },
  ...categoryValues.map((c) => ({ value: c, label: c })),
];

const difficultyOptions: FilterOption[] = [
  { value: ALL, label: "All" },
  ...difficultyValues.map((d) => ({ value: d, label: d })),
];

interface LabFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
}

/** Search + category + difficulty controls for the lab library. */
export function LabFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
}: LabFiltersProps) {
  return (
    <div className="flex flex-col gap-5">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search labs by title, description, or skill…"
        label="Search labs"
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
          label="Difficulty"
          options={difficultyOptions}
          value={difficulty}
          onChange={onDifficultyChange}
        />
      </div>
    </div>
  );
}
