import { useEffect, useState } from "react";
import type { NavGroup } from "@/types";
import { navGroups as defaultNavGroups } from "@/data/navigation";
import { api } from "@/lib/api";

/** Load navbar groups from CMS API with static fallback. */
export function useCmsNavigation(): NavGroup[] {
  const [groups, setGroups] = useState<NavGroup[]>(defaultNavGroups);

  useEffect(() => {
    void api
      .get<{ navigation: { label: string; items: { label: string; to: string }[] }[] | null }>(
        "/cms/navigation",
      )
      .then((res) => {
        if (res.navigation && res.navigation.length > 0) {
          setGroups(res.navigation);
        }
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  return groups;
}
