import { Link } from "react-router-dom";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { pageContent } from "@/data/pages";
import { creator } from "@/data/creator";
import { site } from "@/lib/site";
import { paths } from "@/routes/paths";

export default function AboutPage() {
  return (
    <>
      <PlaceholderPage content={pageContent.about} />
      <Section className="pt-0">
        <Card className="mx-auto max-w-3xl p-6 text-center">
          <p className="text-sm leading-relaxed text-slate-400">
            {site.nameFormatted} is maintained by {creator.name}. For platform questions,
            feedback, or partnerships, visit the{" "}
            <Link to={paths.support} className="text-accent-300 hover:text-accent-200">
              support page
            </Link>
            .
          </p>
        </Card>
      </Section>
    </>
  );
}
