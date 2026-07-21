import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import { navGroups as defaultNav } from "@/data/navigation";

interface NavItemEdit {
  label: string;
  url: string;
  position: number;
}

interface NavGroupEdit {
  label: string;
  position: number;
  items: NavItemEdit[];
}

export default function AdminNavigationPage() {
  const [groups, setGroups] = useState<NavGroupEdit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const res = await api.get<{ navigation: NavGroupEdit[] | null }>("/admin/navigation");
    if (res.navigation && res.navigation.length > 0) {
      setGroups(res.navigation);
    } else {
      setGroups(
        defaultNav.map((g, gi) => ({
          label: g.label,
          position: gi,
          items: g.items.map((item, ii) => ({
            label: item.label,
            url: item.to,
            position: ii,
          })),
        })),
      );
    }
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Failed to load navigation."));
  }, [load]);

  async function save() {
    setError(null);
    setSaved(false);
    try {
      await api.put("/admin/navigation", { groups });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    }
  }

  function updateGroup(index: number, label: string) {
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, label } : g)));
  }

  function updateItem(gi: number, ii: number, field: "label" | "url", value: string) {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === gi
          ? {
              ...g,
              items: g.items.map((item, j) =>
                j === ii ? { ...item, [field]: value } : item,
              ),
            }
          : g,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Navigation</h2>
      <p className="text-sm text-slate-400">
        Customize navbar dropdown groups. Falls back to static defaults when empty.
      </p>
      {error && <Alert variant="error">{error}</Alert>}
      {saved && <Alert variant="success">Navigation saved.</Alert>}
      {groups.map((group, gi) => (
        <Card key={gi} className="flex flex-col gap-4 p-5">
          <TextField
            label="Group label"
            value={group.label}
            onChange={(e) => updateGroup(gi, e.target.value)}
          />
          {group.items.map((item, ii) => (
            <div key={ii} className="grid gap-2 sm:grid-cols-2">
              <TextField
                label="Link label"
                value={item.label}
                onChange={(e) => updateItem(gi, ii, "label", e.target.value)}
              />
              <TextField
                label="URL"
                value={item.url}
                onChange={(e) => updateItem(gi, ii, "url", e.target.value)}
              />
            </div>
          ))}
        </Card>
      ))}
      <Button onClick={() => void save()}>Save navigation</Button>
    </div>
  );
}
