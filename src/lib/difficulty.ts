import type { BadgeVariant } from "@/components/ui/Badge";
import type { Difficulty } from "@/types";

/** Maps a difficulty level to a consistent badge color across the site. */
export function difficultyBadgeVariant(level: Difficulty): BadgeVariant {
  switch (level) {
    case "Beginner":
      return "success";
    case "Intermediate":
      return "accent";
    case "Advanced":
      return "warning";
  }
}
