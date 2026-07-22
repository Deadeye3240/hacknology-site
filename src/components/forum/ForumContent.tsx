import { parseForumContent, splitInlineCode } from "@/lib/forumContent";
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
          <span key={`t-${i}`}>{part.value}</span>
        ),
      )}
    </>
  );
}

/** Renders forum plain text with fenced code blocks and inline `code`. */
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
          return (
            <div
              key={`code-${i}`}
              className="my-2 overflow-hidden rounded border border-white/[0.07] bg-[#0a0e14]"
            >
              {block.language && (
                <div className="border-b border-white/[0.05] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-slate-600">
                  {block.language}
                </div>
              )}
              <pre className="overflow-x-auto p-2 font-mono text-[11px] leading-relaxed text-slate-200">
                <code>{block.code}</code>
              </pre>
            </div>
          );
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
