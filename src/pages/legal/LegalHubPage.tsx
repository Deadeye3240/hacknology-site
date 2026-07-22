import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { ShieldIcon } from "@/components/ui/icons";
import { legalDocuments, legalHubLinks } from "@/data/legal";
import { site } from "@/lib/site";

export default function LegalHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Legal & policies"
        description={`Important information about using ${site.nameFormatted}, your data, and authorized practice on the Platform.`}
        icon={ShieldIcon}
      />
      <Section>
        <div className="mx-auto grid max-w-3xl gap-6">
          <Card className="border-accent-400/15 bg-accent-400/[0.04] p-5">
            <p className="text-sm leading-relaxed text-slate-300">
              {site.nameFormatted} is an educational cybersecurity platform. These
              documents explain your rights, our responsibilities, and the rules for
              labs, forums, and community participation. They are not a substitute
              for professional legal advice.
            </p>
          </Card>

          <div className="grid gap-4">
            {legalHubLinks.map((link) => {
              const doc = Object.values(legalDocuments).find((d) => `/${d.slug}` === link.to);
              return (
                <Link key={link.to} to={link.to} className="group block">
                  <Card interactive className="flex flex-col gap-2 p-5">
                    <h2 className="text-lg font-semibold text-white group-hover:text-accent-200">
                      {link.label}
                    </h2>
                    {doc && (
                      <p className="text-sm text-slate-400">{doc.description}</p>
                    )}
                    {doc && (
                      <p className="text-xs text-slate-500">
                        Last updated: {doc.lastUpdated}
                      </p>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
