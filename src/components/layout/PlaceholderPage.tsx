import type { PageContent } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SecurityNotice } from "@/components/ui/SecurityNotice";
import { ArrowRightIcon } from "@/components/ui/icons";

interface PlaceholderPageProps {
  content: PageContent;
  /** Show the authorization notice at the top (used by Scan-related areas). */
  showSecurityNotice?: boolean;
}

/**
 * Shared shell for the inner routes. Each page supplies its own content while
 * the structure (header, "what's coming" note, highlight grid) stays uniform.
 */
export function PlaceholderPage({
  content,
  showSecurityNotice = false,
}: PlaceholderPageProps) {
  const { eyebrow, title, description, icon, status, highlights } = content;

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        icon={icon}
      />

      <Section>
        <div className="flex flex-col gap-8">
          {showSecurityNotice && <SecurityNotice />}

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Badge variant="accent">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent-400" />
              {status}
            </Badge>
            <Button to="/lessons" variant="secondary" size="sm">
              Start learning
              <ArrowRightIcon />
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="flex flex-col gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-lg text-accent-300">
                    <Icon />
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <p className="text-sm text-slate-500">
            This is an early foundation. Full functionality for this section is
            planned in upcoming development.
          </p>
        </div>
      </Section>
    </>
  );
}
