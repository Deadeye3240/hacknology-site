import type { NavGroup, NavItem } from "@/types";
import { paths } from "@/routes/paths";

/** Core routes that must remain reachable even when CMS navigation overrides defaults. */
const REQUIRED_ITEMS: NavItem[] = [
  { label: "Lessons", to: paths.lessons },
  { label: "Forum", to: paths.forum },
  { label: "ScanMe", to: paths.scanme },
  { label: "Vulnerable Lab", to: paths.vulnerableLab },
  { label: "Nerd Games", to: paths.games },
];

function itemKey(item: NavItem): string {
  return `${item.label.toLowerCase()}::${item.to}`;
}

function groupForItem(kind: string, groups: NavGroup[]): NavGroup {
  if (kind === "community") return groups.find((g) => /community/i.test(g.label)) ?? groups[0];
  if (kind === "practice") return groups.find((g) => /practice/i.test(g.label)) ?? groups[0];
  if (kind === "learn") return groups.find((g) => /learn/i.test(g.label)) ?? groups[0];
  return groups[groups.length - 1] ?? groups[0];
}

/** Merge CMS navigation with static defaults so core product routes are never dropped. */
export function mergeNavGroups(cmsGroups: NavGroup[], defaults: NavGroup[]): NavGroup[] {
  if (cmsGroups.length === 0) return defaults;

  const merged: NavGroup[] = cmsGroups.map((g) => ({
    label: g.label,
    items: [...g.items],
  }));

  const present = new Set(merged.flatMap((g) => g.items.map(itemKey)));
  const missing = REQUIRED_ITEMS.filter((item) => !present.has(itemKey(item)));

  for (const item of missing) {
    let target: NavGroup | undefined;
    if (item.to === paths.forum) {
      target = groupForItem("community", merged);
    } else if (
      item.to === paths.scanme ||
      item.to === paths.vulnerableLab ||
      item.to.startsWith(`${paths.games}/`) ||
      item.to === paths.games
    ) {
      target = groupForItem("practice", merged);
    } else if (item.to === paths.lessons) {
      target = groupForItem("learn", merged);
    } else {
      target = merged[0];
    }
    if (target && !target.items.some((i) => itemKey(i) === itemKey(item))) {
      target.items.push(item);
    }
  }

  return merged;
}
