import { cn } from "@/lib/cn";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Accessible label for the input (visually hidden). */
  label?: string;
  id?: string;
  className?: string;
  compact?: boolean;
}

/** Reusable search field with a leading icon and a clear button. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
  id,
  className,
  compact = false,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500",
          compact ? "text-sm" : "text-base",
        )}
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={cn(
          "w-full rounded-md border border-white/10 bg-white/[0.03] pr-9 text-slate-100 placeholder:text-slate-500 transition-colors focus:border-accent-400/50 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-accent-400/20",
          compact ? "h-8 pl-8 text-xs" : "h-11 pl-10 text-sm",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-500 transition-colors hover:text-slate-200"
        >
          <CloseIcon className="text-base" />
        </button>
      )}
    </div>
  );
}
