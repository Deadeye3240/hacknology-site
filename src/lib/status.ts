import type { BadgeVariant } from "@/components/ui/Badge";
import type { LabStatus } from "@/types";

/** Maps a lab progress status to a consistent badge color. */
export function labStatusBadgeVariant(status: LabStatus): BadgeVariant {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "accent";
    case "Not Started":
      return "neutral";
  }
}
