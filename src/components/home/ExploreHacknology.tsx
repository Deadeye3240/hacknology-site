import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { platformFeatures, type PlatformFeature } from "@/data/platformFeatures";
import { site } from "@/lib/site";

const accentStyles: Record<PlatformFeature["accent"], string> = {
  cyan: "border-accent-400/20 bg-accent-400/[0.04] group-hover:border-accent-400/35",
  emerald: "border-emerald-400/20 bg-emerald-400/[0.04] group-hover:border-emerald-400/35",
  blue: "border-brand-500/20 bg-brand-500/[0.04] group-hover:border-brand-500/35",
  violet: "border-violet-400/20 bg-violet-400/[0.04] group-hover:border-violet-400/35",
  amber: "border-amber-400/20 bg-amber-400/[0.04] group-hover:border-amber-400/35",
};

const iconStyles: Record<PlatformFeature["accent"], string> = {
  cyan: "border-accent-400/25 bg-accent-400/10 text-accent-300",
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  blue: "border-brand-500/25 bg-brand-500/10 text-brand-400",
  violet: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
};

function FeatureLink({ feature }: { feature: PlatformFeature }) {
  const Icon = feature.icon;
  const isDiscord = feature.href === "external:discord";
  const href = isDiscord ? site.discordInviteUrl : feature.href;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-xl shadow-glow-sm",
            iconStyles[feature.accent],
          )}
        >
          <Icon />
        </span>
        <ArrowRightIcon className="mt-1 text-sm text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-accent-300" />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        {feature.scope && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-slate-500">
            {feature.scope}
          </span>
        )}
        <span className="text-xs font-medium text-accent-300">{feature.cta}</span>
      </div>
    </>
  );

  const className = cn(
    "group relative flex h-full flex-col gap-4 rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-glow",
    accentStyles[feature.accent],
  );

  if (isDiscord) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {body}
    </Link>
  );
}

export function ExploreHacknology() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {platformFeatures.map((feature) => (
        <FeatureLink key={feature.id} feature={feature} />
      ))}
    </div>
  );
}
