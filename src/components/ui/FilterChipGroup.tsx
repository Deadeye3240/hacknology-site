import { cn } from "@/lib/cn";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterChipGroupProps {
  /** Group label (e.g. "Category" or "Difficulty"). */
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Single-select row of filter chips. Parents supply the option list (including
 * any "All" option), keeping this component generic across Labs/Tools/Resources.
 */
export function FilterChipGroup({
  label,
  options,
  value,
  onChange,
  className,
}: FilterChipGroupProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-accent-400/50 bg-accent-400/15 text-accent-100"
                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
