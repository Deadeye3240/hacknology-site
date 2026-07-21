import type { CmsBlock, CmsPageContent } from "@/types/cms";

interface PageRendererProps {
  content: CmsPageContent | unknown;
}

function renderBlock(block: CmsBlock, index: number) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === 1 ? "h1" : block.level === 2 ? "h2" : "h3";
      const sizes =
        block.level === 1
          ? "text-3xl font-bold"
          : block.level === 2
            ? "text-2xl font-semibold"
            : "text-xl font-semibold";
      return (
        <Tag key={index} className={`${sizes} text-white`}>
          {block.text}
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p key={index} className="text-base leading-relaxed text-slate-300">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="list-disc space-y-1 pl-5 text-slate-300">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre
          key={index}
          className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-slate-200"
        >
          <code>{block.content}</code>
        </pre>
      );
    default:
      return null;
  }
}

/** Safe renderer for CMS JSON blocks — no HTML injection. */
export function PageRenderer({ content }: PageRendererProps) {
  const parsed =
    content && typeof content === "object" && "blocks" in content
      ? (content as CmsPageContent)
      : { blocks: [] as CmsBlock[] };

  return (
    <article className="flex flex-col gap-5">
      {parsed.blocks.map((block, i) => renderBlock(block, i))}
    </article>
  );
}
