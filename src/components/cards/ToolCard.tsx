import type { Tool } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { DocsIcon, GlobeIcon, WrenchIcon } from "@/components/ui/icons";
import { difficultyBadgeVariant } from "@/lib/difficulty";

interface ToolCardProps {
  tool: Tool;
}

/** Educational reference card for a single security tool. */
export function ToolCard({ tool }: ToolCardProps) {
  const {
    name,
    description,
    category,
    platforms,
    skillLevel,
    website,
    documentation,
  } = tool;

  return (
    <Card interactive className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-lg text-accent-300">
          <WrenchIcon />
        </span>
        <Badge variant={difficultyBadgeVariant(skillLevel)}>{skillLevel}</Badge>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Badge variant="neutral" className="self-start">
          {category}
        </Badge>
        <ul className="flex flex-wrap gap-1.5" aria-label="Platforms">
          {platforms.map((platform) => (
            <li
              key={platform}
              className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400"
            >
              {platform}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-white/5 pt-4 text-sm">
        <ExternalLink href={website}>
          <GlobeIcon className="text-sm" />
          Website
        </ExternalLink>
        {documentation && (
          <ExternalLink href={documentation}>
            <DocsIcon className="text-sm" />
            Docs
          </ExternalLink>
        )}
      </div>
    </Card>
  );
}
