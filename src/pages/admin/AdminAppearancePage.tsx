import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField, TextAreaField } from "@/components/ui/TextField";
import { api, ApiError } from "@/lib/api";
import { site } from "@/lib/site";

export default function AdminAppearancePage() {
  const [values, setValues] = useState<Record<string, string>>({
    "site.title": site.nameFormatted,
    "site.description": site.description,
    "site.tagline": site.tagline,
    "site.logoUrl": "",
    "site.faviconUrl": "",
    "site.footerText": "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void api
      .get<{ settings: Record<string, string> }>("/admin/settings")
      .then((res) => {
        setValues((v) => ({ ...v, ...res.settings }));
      })
      .catch(() => setError("Could not load appearance settings."));
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
      <h2 className="text-lg font-semibold text-white">Site appearance</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {saved && <Alert variant="success">Appearance saved.</Alert>}
      <Card className="flex flex-col gap-4 p-5">
        <TextField label="Site title" value={values["site.title"]} onChange={(e) => setValues((v) => ({ ...v, "site.title": e.target.value }))} />
        <TextField label="Tagline" value={values["site.tagline"]} onChange={(e) => setValues((v) => ({ ...v, "site.tagline": e.target.value }))} />
        <TextAreaField label="Description" value={values["site.description"]} onChange={(e) => setValues((v) => ({ ...v, "site.description": e.target.value }))} />
        <TextField label="Logo URL" value={values["site.logoUrl"]} onChange={(e) => setValues((v) => ({ ...v, "site.logoUrl": e.target.value }))} hint="Optional — URL from media library" />
        <TextField label="Favicon URL" value={values["site.faviconUrl"]} onChange={(e) => setValues((v) => ({ ...v, "site.faviconUrl": e.target.value }))} />
        <TextAreaField label="Footer text" value={values["site.footerText"]} onChange={(e) => setValues((v) => ({ ...v, "site.footerText": e.target.value }))} />
        <Button onClick={() => void save()}>Save appearance</Button>
      </Card>
    </div>
  );
}
