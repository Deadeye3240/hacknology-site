import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/home/Reveal";
import { ArrowRightIcon, DiscordIcon, PlayIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { paths } from "@/routes/paths";

export function HomeFinalCta() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-40" />
      <div className="container-page relative">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent-400/15 bg-surface/50 px-6 py-11 sm:px-12 sm:py-14">
            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
              <Logo asLink={false} size="lg" showDomain className="justify-center" />

              <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl">
                Ready to start?
              </h2>
              <p className="text-pretty text-sm text-slate-400 sm:text-base">
                Pick a learning path, open a terminal lab, chase a Cyber Rider best time, or ask your first question
                on the forum.
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
                <Button to={paths.lessons} size="lg" className="w-full sm:w-auto">
                  Start Learning
                  <ArrowRightIcon />
                </Button>
                <Button to={paths.game("stick-rider")} size="lg" variant="secondary" className="w-full sm:w-auto">
                  <PlayIcon />
                  Play Cyber Rider
                </Button>
                <Button to={paths.forum} size="lg" variant="ghost" className="w-full sm:w-auto">
                  Visit forum
                </Button>
                <Button href={site.discordInviteUrl} size="lg" variant="ghost" className="w-full sm:w-auto">
                  <DiscordIcon />
                  Join Discord
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
