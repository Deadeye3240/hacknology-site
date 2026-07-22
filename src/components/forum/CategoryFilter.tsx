import type { ForumCategory } from "@/types/forum";
import { cn } from "@/lib/cn";

interface CategoryFilterProps {
  categories: ForumCategory[];
  value: string;
  onChange: (categoryId: string) => void;
  layout?: "horizontal" | "vertical";
}

export function CategoryFilter({
  categories,
  value,
  onChange,
  layout = "horizontal",
}: CategoryFilterProps) {
  const items = [{ id: "", name: "All topics" }, ...categories];

  if (layout === "vertical") {
    return (
      <ul className="flex flex-col gap-0.5">
        {items.map((c) => (
          <li key={c.id || "all"}>
            <button
              type="button"
              onClick={() => onChange(c.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                value === c.id
                  ? "bg-white/[0.06] font-medium text-white"
                  : "text-slate-400 hover:bg-white/[0.03] hover:text-slate-200",
              )}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((c) => (
        <button
          key={c.id || "all"}
          type="button"
          onClick={() => onChange(c.id)}
          className={cn(
            "rounded border px-2 py-0.5 text-[10px] font-medium transition-colors",
            value === c.id
              ? "border-accent-400/30 bg-accent-400/[0.08] text-accent-200"
              : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:border-white/10 hover:text-slate-200",
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
