/** Parse plain-text forum content into renderable blocks (text, code, inline). */

export type ForumContentBlock =
  | { type: "text"; text: string }
  | { type: "code"; code: string; language?: string };

const FENCE_RE = /```(\w*)\n?([\s\S]*?)```/g;

export function parseForumContent(content: string): ForumContentBlock[] {
  const blocks: ForumContentBlock[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  FENCE_RE.lastIndex = 0;
  while ((match = FENCE_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: "text", text: content.slice(lastIndex, match.index) });
    }
    blocks.push({
      type: "code",
      language: match[1] || undefined,
      code: match[2].replace(/\n$/, ""),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    blocks.push({ type: "text", text: content.slice(lastIndex) });
  }

  if (blocks.length === 0) {
    blocks.push({ type: "text", text: content });
  }

  return blocks;
}

/** Extract #hashtags from title or body for display (no backend). */
export function extractHashtags(...parts: string[]): string[] {
  const tags = new Set<string>();
  for (const part of parts) {
    for (const m of part.matchAll(/#([a-zA-Z][a-zA-Z0-9_-]{1,31})/g)) {
      tags.add(m[1].toLowerCase());
    }
  }
  return [...tags].slice(0, 5);
}

/** Split text segments on inline `backtick` code. */
export function splitInlineCode(text: string): Array<{ kind: "text" | "code"; value: string }> {
  const parts = text.split(/(`[^`\n]+`)/g);
  return parts.filter(Boolean).map((part) =>
    part.startsWith("`") && part.endsWith("`")
      ? { kind: "code" as const, value: part.slice(1, -1) }
      : { kind: "text" as const, value: part },
  );
}

const URL_RE = /(https?:\/\/[^\s<]+[^\s<.,;:!?)}\]"'])/g;

/** Split plain text into text and URL segments for safe rendering. */
export function splitLinks(text: string): Array<{ kind: "text" | "link"; value: string }> {
  const parts: Array<{ kind: "text" | "link"; value: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  URL_RE.lastIndex = 0;
  while ((match = URL_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: "text", value: text.slice(lastIndex, match.index) });
    }
    parts.push({ kind: "link", value: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ kind: "text", value: text.slice(lastIndex) });
  }
  if (parts.length === 0) parts.push({ kind: "text", value: text });
  return parts;
}
