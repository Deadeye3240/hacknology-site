import type { ResourceCategory } from "@/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterChipGroup, type FilterOption } from "@/components/ui/FilterChipGroup";
import { ALL } from "@/components/labs/LabFilters";

const categoryValues: ResourceCategory[] = [
  "Learning Platforms",
  "Documentation",
  "Security Frameworks",
  "Communities",
  "Books",
  "CTF Platforms",
];

const categoryOptions: FilterOption[] = [
  { value: ALL, label: "All" },
  ...categoryValues.map((c) => ({ value: c, label: c })),
];

interface ResourceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

/** Search + category controls for the resource library. */
export function ResourceFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: ResourceFiltersProps) {
  return (
    <div className="flex flex-col gap-5">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search resources by name, description, or category…"
        label="Search resources"
        className="max-w-xl"
      />
      <FilterChipGroup
        label="Category"
        options={categoryOptions}
        value={category}
        onChange={onCategoryChange}
      />
    </div>
  );
}
