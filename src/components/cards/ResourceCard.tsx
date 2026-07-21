import type { Resource } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArrowRightIcon, GlobeIcon } from "@/components/ui/icons";

interface ResourceCardProps {
  resource: Resource;
}

/** Card for a single external, reputable cybersecurity resource. */
export function ResourceCard({ resource }: ResourceCardProps) {
  const { name, description, category, website, resourceLink } = resource;

  return (
    <Card interactive className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <Badge variant="neutral" className="shrink-0">
          {category}
        </Badge>
      </div>

      <p className="text-sm leading-relaxed text-slate-400">{description}</p>

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-white/5 pt-4 text-sm">
        <ExternalLink href={website}>
          <GlobeIcon className="text-sm" />
          Website
        </ExternalLink>
        {resourceLink && (
          <ExternalLink href={resourceLink}>
            <ArrowRightIcon className="text-sm" />
            Resource
          </ExternalLink>
        )}
      </div>
    </Card>
  );
}
