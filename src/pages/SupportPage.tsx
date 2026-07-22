import { Link } from "react-router-dom";
import { SupportContactForm } from "@/components/support/SupportContactForm";
import { MaintainerCard } from "@/components/support/MaintainerCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { MessageIcon } from "@/components/ui/icons";
import { creator } from "@/data/creator";
import { site } from "@/lib/site";
import { paths } from "@/routes/paths";

export default function SupportPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Support & contact"
        description={`Questions about ${site.nameFormatted}, your account, or the learning platform? Send a message — ${creator.agentLabel} handles platform support.`}
        icon={MessageIcon}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white">Send a message</h2>
            <p className="mt-2 text-sm text-slate-400">
              Messages go to the admin inbox and alert the team when Discord notifications are
              enabled. Include enough detail for us to help you quickly.
            </p>
            <div className="mt-6">
              <SupportContactForm />
            </div>
          </Card>
          <MaintainerCard />
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          For community discussion, visit the{" "}
          <Link to={paths.forum} className="text-accent-300 hover:text-accent-200">
            forum
          </Link>{" "}
          or{" "}
          <a
            href={site.discordInviteUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent-300 hover:text-accent-200"
          >
            Discord
          </a>
          .
        </p>
      </Section>
    </>
  );
}
