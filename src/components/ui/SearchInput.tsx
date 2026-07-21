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
}

/** Reusable search field with a leading icon and a clear button. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
  id,
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-slate-500" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-accent-400/50 focus:bg-white/[0.05]"
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
