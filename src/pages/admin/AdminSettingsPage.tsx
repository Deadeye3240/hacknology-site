import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";

export default function AdminSettingsPage() {
  const [social, setSocial] = useState({ twitter: "", github: "", discord: "" });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void api
      .get<{ settings: Record<string, string> }>("/admin/settings")
      .then((res) => {
        setSocial({
          twitter: res.settings["social.twitter"] ?? "",
          github: res.settings["social.github"] ?? "",
          discord: res.settings["social.discord"] ?? "",
        });
      })
      .catch(() => setError("Could not load settings."));
  }, []);

  async function save() {
    setError(null);
    setSaved(false);
    try {
      await api.put("/admin/settings", {
        "social.twitter": social.twitter,
        "social.github": social.github,
        "social.discord": social.discord,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Site settings</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {saved && <Alert variant="success">Settings saved.</Alert>}
      <Card className="flex flex-col gap-4 p-5">
        <TextField label="Twitter / X URL" value={social.twitter} onChange={(e) => setSocial((s) => ({ ...s, twitter: e.target.value }))} />
        <TextField label="GitHub URL" value={social.github} onChange={(e) => setSocial((s) => ({ ...s, github: e.target.value }))} />
        <TextField
          label="Discord invite URL"
          value={social.discord}
          onChange={(e) => setSocial((s) => ({ ...s, discord: e.target.value }))}
          hint="Used for the homepage community card (e.g. https://discord.gg/R6JQy9b9ey)"
          placeholder="https://discord.gg/R6JQy9b9ey"
        />
        <Button onClick={() => void save()}>Save settings</Button>
      </Card>
    </div>
  );
}
