import { parseForumContent, splitInlineCode, splitLinks } from "@/lib/forumContent";
import { cn } from "@/lib/cn";

interface ForumContentProps {
  content: string;
  className?: string;
  compact?: boolean;
}

function InlineText({ text }: { text: string }) {
  const parts = splitInlineCode(text);
  return (
    <>
      {parts.map((part, i) =>
        part.kind === "code" ? (
          <code
            key={`${part.value}-${i}`}
            className="rounded border border-white/10 bg-white/[0.06] px-0.5 py-px font-mono text-[0.9em] text-accent-200"
          >
            {part.value}
          </code>
        ) : (
          <span key={`t-${i}`}>
            {splitLinks(part.value).map((segment, j) =>
              segment.kind === "link" ? (
                <a
                  key={`link-${i}-${j}`}
                  href={segment.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-300 underline decoration-accent-400/30 underline-offset-2 hover:text-accent-200"
                >
                  {segment.value}
                </a>
              ) : (
                <span key={`text-${i}-${j}`}>{segment.value}</span>
              ),
            )}
          </span>
        ),
      )}
    </>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="my-2 overflow-hidden rounded border border-white/[0.07] bg-[#0a0e14]">
      <div className="flex items-center justify-between border-b border-white/[0.05] px-2 py-0.5">
        <span className="font-mono text-[9px] uppercase tracking-wide text-slate-600">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300"
        >
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto p-2 font-mono text-[11px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** Renders forum plain text with fenced code blocks, inline `code`, and auto-linked URLs. */
export function ForumContent({ content, className, compact = true }: ForumContentProps) {
  const blocks = parseForumContent(content);

  return (
    <div
      className={cn(
        "text-pretty text-slate-300",
        compact ? "text-[13px] leading-[1.55]" : "text-sm leading-relaxed",
        className,
      )}
    >
      {blocks.map((block, i) => {
        if (block.type === "code") {
          return <CodeBlock key={`code-${i}`} code={block.code} language={block.language} />;
        }
        const paragraphs = block.text.split(/\n\n+/);
        return paragraphs.map((para, j) => (
          <p
            key={`p-${i}-${j}`}
            className={j > 0 ? "mt-2 whitespace-pre-wrap" : "whitespace-pre-wrap"}
          >
            <InlineText text={para} />
          </p>
        ));
      })}
    </div>
  );
}
