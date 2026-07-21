import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AlertTriangleIcon, CheckIcon, InfoIcon } from "@/components/ui/icons";

type AlertVariant = "error" | "success" | "info";

const styles: Record<AlertVariant, string> = {
  error: "border-red-400/30 bg-red-400/[0.08] text-red-100",
  success: "border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-100",
  info: "border-accent-400/30 bg-accent-400/[0.08] text-accent-100",
};

const icons: Record<AlertVariant, typeof InfoIcon> = {
  error: AlertTriangleIcon,
  success: CheckIcon,
  info: InfoIcon,
};

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = "info", children, className }: AlertProps) {
  const Icon = icons[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
        styles[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 shrink-0 text-base" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
