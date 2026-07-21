import type { Feature } from "@/types";
import { Card } from "@/components/ui/Card";

interface FeatureCardProps {
  feature: Feature;
}

/** Displays one of the core "Learn / Practice / Defend" pillars. */
export function FeatureCard({ feature }: FeatureCardProps) {
  const { title, description, icon: Icon } = feature;

  return (
    <Card interactive className="flex flex-col gap-4">
      <span className="grid h-12 w-12 place-items-center rounded-xl border border-accent-400/25 bg-accent-400/10 text-2xl text-accent-300 shadow-glow-sm">
        <Icon />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
    </Card>
  );
}
