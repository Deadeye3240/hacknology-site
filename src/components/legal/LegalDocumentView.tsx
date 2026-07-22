import { Link } from "react-router-dom";
import type { LegalDocument } from "@/types/legal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { ShieldIcon } from "@/components/ui/icons";

interface LegalDocumentViewProps {
  document: LegalDocument;
}

/** Renders a static legal document with table-of-contents-friendly sections. */
export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={document.title}
        description={document.description}
        icon={ShieldIcon}
      />
      <Section>
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <p className="text-sm text-slate-500">
            Last updated:{" "}
            <time dateTime={document.lastUpdated}>{document.lastUpdated}</time>
            {" · "}
            <Link to="/legal" className="text-accent-300 hover:text-accent-200">
              All legal documents
            </Link>
          </p>

          <Card className="border-accent-400/15 bg-accent-400/[0.04] p-5">
            <p className="text-sm leading-relaxed text-slate-300">
              This document is provided for transparency and platform governance. It
              is not legal advice. Consider consulting qualified counsel for your
              specific situation.
            </p>
          </Card>

          <article className="flex flex-col gap-10">
            {document.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                <div className="mt-4 flex flex-col gap-3">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-sm leading-relaxed text-slate-300">
                      {paragraph}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </article>
        </div>
      </Section>
    </>
  );
}
