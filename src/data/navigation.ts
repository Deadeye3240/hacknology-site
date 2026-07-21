import type { NavItem } from "@/types";

/** Primary navigation shown in the navbar (and mirrored in the footer). */
export const primaryNav: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Lessons", to: "/lessons" },
  { label: "Labs", to: "/labs" },
  { label: "Tools", to: "/tools" },
  { label: "Scan", to: "/scan" },
  { label: "Resources", to: "/resources" },
  { label: "About", to: "/about" },
];
