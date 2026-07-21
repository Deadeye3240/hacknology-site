import type { Feature } from "@/types";
import { BookIcon, FlaskIcon, ShieldIcon } from "@/components/ui/icons";

/** The three core pillars highlighted on the homepage. */
export const features: Feature[] = [
  {
    id: "learn",
    title: "Learn",
    description:
      "Structured lessons and learning paths that break down security concepts into clear, approachable modules — from fundamentals to advanced defensive topics.",
    icon: BookIcon,
  },
  {
    id: "practice",
    title: "Practice",
    description:
      "Reinforce theory in authorized, controlled lab environments and CTF-style challenges designed for safe, hands-on skill building.",
    icon: FlaskIcon,
  },
  {
    id: "defend",
    title: "Defend",
    description:
      "Develop a defender's mindset with practical guidance on detection, hardening, and responsible security practices.",
    icon: ShieldIcon,
  },
];
