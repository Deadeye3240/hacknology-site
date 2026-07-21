import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import { site } from "@/lib/site";

const HOMEPAGE_KEYS = [
  "homepage.heroTitle",
  "homepage.heroSubtitle",
  "homepage.heroDescription",
  "homepage.featuredSectionTitle",
] as const;

export default function AdminHomepagePage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void api
      .get<{ settings: Record<string, string> }>("/admin/settings")
      .then((res) => {
        setValues({
          "homepage.heroTitle": res.settings["homepage.heroTitle"] ?? site.nameFormatted,
          "homepage.heroSubtitle": res.settings["homepage.heroSubtitle"] ?? site.tagline,
          "homepage.heroDescription": res.settings["homepage.heroDescription"] ?? site.description,
          "homepage.featuredSectionTitle":
            res.settings["homepage.featuredSectionTitle"] ?? "Structured paths for every stage",
        });
      })
      .catch(() => setError("Could not load homepage settings."));
  }, []);

  async function save() {
    setError(null);
    setSaved(false);
    try {
      await api.put("/admin/settings", values);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Homepage</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {saved && <Alert variant="success">Homepage settings saved.</Alert>}
      <Card className="flex flex-col gap-4 p-5">
        {HOMEPAGE_KEYS.map((key) => (
          key.includes("Description") ? (
            <TextAreaField
              key={key}
              label={key.replace("homepage.", "").replace(/([A-Z])/g, " $1")}
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
          ) : (
            <TextField
              key={key}
              label={key.replace("homepage.", "").replace(/([A-Z])/g, " $1")}
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
          )
        ))}
        <Button onClick={() => void save()}>Save homepage</Button>
      </Card>
    </div>
  );
}
