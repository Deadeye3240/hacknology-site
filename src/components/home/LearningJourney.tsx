import { learningJourneySteps } from "@/data/platformFeatures";

export function LearningJourney() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-accent-400/40 via-white/10 to-transparent lg:block" />

      <ol className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        {learningJourneySteps.map((item) => (
          <li
            key={item.step}
            className="relative rounded-2xl border border-white/10 bg-surface/50 p-5 backdrop-blur-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-accent-400/20 bg-accent-400/10 font-mono text-xs font-semibold text-accent-300">
                {item.step}
              </span>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
