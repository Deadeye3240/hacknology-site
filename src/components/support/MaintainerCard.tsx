import { creator } from "@/data/creator";
import { site } from "@/lib/site";
import { Card } from "@/components/ui/Card";
import { ExternalLink } from "@/components/ui/ExternalLink";

/** Maintainer contact card — professional, not promotional. */
export function MaintainerCard() {
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Platform lead
        </p>
        <h2 className="mt-1 text-xl font-semibold text-white">{creator.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {site.nameFormatted} is maintained independently. Reach out for platform questions,
          partnership ideas, or technical issues with the site.
        </p>
      </div>

      <dl className="grid gap-3 text-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
          <dt className="shrink-0 text-slate-500 sm:w-24">Email</dt>
          <dd>
            <a
              href={`mailto:${creator.email}`}
              className="text-accent-300 transition-colors hover:text-accent-200"
            >
              {creator.email}
            </a>
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
          <dt className="shrink-0 text-slate-500 sm:w-24">Phone</dt>
          <dd>
            <a
              href={`tel:${creator.phoneTel}`}
              className="text-slate-300 transition-colors hover:text-white"
            >
              {creator.phone}
            </a>
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
          <dt className="shrink-0 text-slate-500 sm:w-24">GitHub</dt>
          <dd>
            <ExternalLink
              href={creator.github.url}
              className="text-slate-300 hover:text-white"
              showIcon={false}
            >
              {creator.github.username}
            </ExternalLink>
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
          <dt className="shrink-0 text-slate-500 sm:w-24">Discord</dt>
          <dd className="text-slate-300">
            {creator.discord.displayName}{" "}
            <span className="text-slate-500">(@{creator.discord.username})</span>
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
          <dt className="shrink-0 text-slate-500 sm:w-24">TikTok</dt>
          <dd>
            <ExternalLink
              href={creator.tiktok.url}
              className="text-slate-300 hover:text-white"
              showIcon={false}
            >
              {creator.tiktok.handle}
            </ExternalLink>
          </dd>
        </div>
      </dl>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Support the project
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {creator.funding.description}
        </p>
        <p className="mt-3">
          <ExternalLink href={creator.funding.url} className="text-sm">
            {creator.funding.label}: {creator.funding.handle}
          </ExternalLink>
        </p>
      </div>
    </Card>
  );
}
