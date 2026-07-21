import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

const controlClasses =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-accent-400/60 focus:outline-none focus:ring-2 focus:ring-accent-400/20";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
}

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

export function TextField({ label, error, hint, ...rest }: InputProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlClasses, error && "border-red-400/50")}
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

type TextAreaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

export function TextAreaField({ label, error, hint, ...rest }: TextAreaProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlClasses, "min-h-[7rem] resize-y", error && "border-red-400/50")}
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
