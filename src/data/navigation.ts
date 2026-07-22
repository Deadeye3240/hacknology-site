import type { NavGroup, NavItem } from "@/types";
import { paths } from "@/routes/paths";
import { site } from "@/lib/site";

/** Grouped navigation for the navbar dropdown menus. */
export const navGroups: NavGroup[] = [
  {
    label: "Learn",
    items: [
      { label: "Lessons", to: paths.lessons },
      { label: "Resources", to: paths.resources },
    ],
  },
  {
    label: "Practice",
    items: [
      { label: "Labs", to: paths.labs },
      { label: "ScanMe", to: paths.scanme },
      { label: "Vulnerable Lab", to: paths.vulnerableLab },
      { label: "Nerd Games", to: paths.games },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Forum", to: paths.forum },
      { label: "Discord", to: site.discordInviteUrl, external: true },
    ],
  },
  {
    label: "More",
    items: [
      { label: "Tools", to: paths.tools },
      { label: "About", to: paths.about },
      { label: "Support", to: paths.support },
    ],
  },
];

/** Primary navigation shown in the footer (flat list of all main routes). */
export const primaryNav: NavItem[] = [
  { label: "Home", to: paths.home },
  { label: "Lessons", to: paths.lessons },
  { label: "Labs", to: paths.labs },
  { label: "Tools", to: paths.tools },
  { label: "ScanMe", to: paths.scanme },
  { label: "Resources", to: paths.resources },
  { label: "Forum", to: paths.forum },
  { label: "Nerd Games", to: paths.games },
  { label: "Vulnerable Lab", to: paths.vulnerableLab },
  { label: "About", to: paths.about },
];
