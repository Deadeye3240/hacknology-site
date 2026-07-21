import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Card } from "@/components/ui/Card";

interface LostInFilesChallengeProps {
  onSolve: () => void;
}

const VFS: Record<string, string> = {
  "readme.txt": "Welcome to the public file server.\nFiles are served from /public/",
  "index.html": "<html><body><h1>Public Site</h1></body></html>",
  "../secret/admin-notes.txt":
    "CONFIDENTIAL\nDeploy credentials rotated Q3.\nFLAG{PATH_TRAVERSAL}",
  "../../secret/admin-notes.txt":
    "CONFIDENTIAL\nDeploy credentials rotated Q3.\nFLAG{PATH_TRAVERSAL}",
  "secret/admin-notes.txt":
    "CONFIDENTIAL\nDeploy credentials rotated Q3.\nFLAG{PATH_TRAVERSAL}",
};

function resolvePath(requested: string): string | null {
  const normalized = requested.replace(/^\/+/, "");
  if (VFS[normalized]) return VFS[normalized];
  if (normalized.includes("..")) {
    if (normalized.includes("secret") || normalized.includes("admin-notes")) {
      return VFS["secret/admin-notes.txt"];
    }
  }
  return null;
}

export function LostInFilesChallenge({ onSolve }: LostInFilesChallengeProps) {
  const [path, setPath] = useState("readme.txt");
  const [content, setContent] = useState(VFS["readme.txt"]);
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  function fetchFile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const file = resolvePath(path);
    if (file) {
      setContent(file);
      if (file.includes("FLAG{PATH_TRAVERSAL}")) {
        setSolved(true);
        onSolve();
      }
    } else {
      setError("File not found in /public/");
      setContent("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-white/10 bg-base-950/80">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
          File viewer — base path: /public/
        </p>
        <form onSubmit={fetchFile} className="flex gap-2">
          <TextField
            label="File path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            hint="/public/"
          />
          <Button type="submit" size="sm" className="self-end">
            Read file
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        {content && (
          <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-white/10 bg-base-950 p-3 font-mono text-xs text-slate-300">
            {content}
          </pre>
        )}
        {solved && (
          <p className="mt-3 text-xs text-emerald-300">You traversed outside the public directory!</p>
        )}
      </Card>
    </div>
  );
}
