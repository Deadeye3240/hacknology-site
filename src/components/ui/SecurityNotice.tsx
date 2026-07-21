import { cn } from "@/lib/cn";
import { AlertTriangleIcon } from "@/components/ui/icons";

interface SecurityNoticeProps {
  /** Compact single-line variant for tighter spaces (e.g. detail sidebars). */
  compact?: boolean;
  className?: string;
}

const AUTHORIZATION_MESSAGE =
  "Hacknology provides educational information and resources for authorized security testing and cybersecurity education. Only test systems you own or have explicit permission to test. External websites and resources are not controlled or guaranteed by Hacknology.";

const COMPACT_MESSAGE =
  "Only test systems you own or have explicit permission to test.";

/**
 * Prominent security notice shown across Labs, Scan, Tools, Resources, and the
 * Forum. Reinforces that all practice must be authorized and defensive.
 */
export function SecurityNotice({ compact = false, className }: SecurityNoticeProps) {
  return (
    <div
      role="note"
      aria-label="Authorization notice"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] text-amber-100",
        compact ? "px-3 py-2.5" : "px-4 py-3.5",
        className,
      )}
    >
      <AlertTriangleIcon
        className={cn("mt-0.5 shrink-0 text-amber-300", compact ? "text-base" : "text-lg")}
      />
      <div className="flex flex-col gap-0.5">
        {!compact && (
          <span className="text-sm font-semibold text-amber-200">
            Security Notice
          </span>
        )}
        <p
          className={cn(
            "text-pretty leading-relaxed text-amber-100/90",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {compact ? COMPACT_MESSAGE : AUTHORIZATION_MESSAGE}
        </p>
      </div>
    </div>
  );
}
