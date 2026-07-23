import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { LearningPathCard } from "@/components/cards/LearningPathCard";
import {
  ArrowRightIcon,
  DiscordIcon,
  MessageIcon,
  RadarIcon,
  TerminalIcon,
} from "@/components/ui/icons";
import { learningPaths } from "@/data/learningPaths";
import { DiscordCommunityCard } from "@/components/community/DiscordCommunityCard";
import { ExploreHacknology } from "@/components/home/ExploreHacknology";
import { LearningJourney } from "@/components/home/LearningJourney";
import { PlatformHeroVisual } from "@/components/home/PlatformHeroVisual";
import { platformStats } from "@/data/platformStats";
import { site } from "@/lib/site";
import { paths } from "@/routes/paths";

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow={
          <>
            <TerminalIcon className="text-sm text-accent-300" />
            Learn by doing · {site.domain}
          </>
        }
        title={<Logo asLink={false} size="hero" showDomain />}
        subtitle="A cybersecurity learning platform where you practice in real terminal labs — not just read about it."
        description="Hacknology combines structured lessons, hands-on terminal training, ScanMe recon missions, sandbox labs, and a community forum into one ecosystem built for people who want to actually build skills."
        actions={
          <>
            <Button to={paths.lessons} size="lg">
              Start Learning
              <ArrowRightIcon />
            </Button>
            <Button to={paths.forum} size="lg" variant="secondary">
              <MessageIcon />
              Explore Community
            </Button>
            <Button to={paths.scanme} size="lg" variant="secondary">
              <RadarIcon />
              Try ScanMe
            </Button>
            <Button to={paths.vulnerableLab} size="lg" variant="ghost">
              Practical Labs
            </Button>
          </>
        }
        visual={<PlatformHeroVisual />}
      />

      <Section className="border-t border-white/5 pt-0">
        <SectionHeader
          align="center"
          eyebrow="Explore Hacknology"
          title="Everything in one ecosystem"
          description="Jump directly into the experience that matches how you want to learn — structured paths, terminal practice, recon training, sandbox challenges, and community discussion."
        />
        <div className="mt-12">
          <ExploreHacknology />
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeader
          align="center"
          eyebrow="Your path"
          title="From first lesson to real skill"
          description="Hacknology is designed around a practical learning loop — discover the platform, choose a path, practice in the terminal, test your knowledge, and grow with the community."
        />
        <div className="mt-12">
          <LearningJourney />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Structured curriculum"
            title={`${platformStats.pathCount} learning paths · ${platformStats.lessonCount} lessons`}
            description="Each path includes scenarios, embedded terminal labs, knowledge checks, and XP progress — from fundamentals through SOC, forensics, OSINT, and Nmap."
          />
          <Button to={paths.lessons} variant="ghost" size="sm" className="shrink-0">
            Open Learn hub
            <ArrowRightIcon />
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col gap-4 border-brand-500/15 bg-brand-500/[0.03] p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-xl text-brand-400">
                <RadarIcon />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">ScanMe recon training</h3>
                <p className="text-xs text-slate-500">
                  {platformStats.scanMeMissionCount} progressive Nmap missions
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Learn scanning and reconnaissance step by step — from your first ping and port scan through
              service detection and scripting, inside a guided terminal experience.
            </p>
            <Button to={paths.scanme} variant="secondary" size="sm" className="mt-auto w-fit">
              Launch ScanMe
              <ArrowRightIcon />
            </Button>
          </Card>

          <Card className="flex flex-col gap-4 border-amber-400/15 bg-amber-400/[0.03] p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-xl text-amber-300">
                <TerminalIcon />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Sandbox vulnerable labs</h3>
                <p className="text-xs text-slate-500">
                  {platformStats.vulnerableLabCount} isolated challenge scenarios
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Practice offensive and defensive concepts in safe, fictional environments — SQL injection,
              IDOR, XSS, cookie abuse, and more with hints and XP rewards.
            </p>
            <Button to={paths.vulnerableLab} variant="secondary" size="sm" className="mt-auto w-fit">
              Open Vulnerable Lab
              <ArrowRightIcon />
            </Button>
          </Card>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeader
          align="center"
          eyebrow="Community"
          title="Learn with others"
          description="Use the forum for long-form discussion and knowledge sharing, or join Discord for live conversation alongside the platform."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col gap-4 p-6">
            <h3 className="text-lg font-semibold text-white">Hacknology Forum</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Ask questions, share what you are learning, and discuss cybersecurity and technology topics with
              other members of the platform.
            </p>
            <Button to={paths.forum} size="sm" className="mt-auto w-fit">
              Visit forum
              <ArrowRightIcon />
            </Button>
          </Card>
          <DiscordCommunityCard />
        </div>
      </Section>

      <Section>
        <Card className="relative overflow-hidden border-accent-400/20 bg-surface/60 px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-80" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <Logo asLink={false} size="lg" showDomain className="justify-center" />
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              Ready to learn cybersecurity by doing?
            </h2>
            <p className="text-pretty text-base text-slate-400 sm:text-lg">
              Pick a learning path, practice in the terminal, complete knowledge checks, and join a
              community built for people who want real technical skills — not generic security content.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button to={paths.lessons} size="lg">
                Start Learning
                <ArrowRightIcon />
              </Button>
              <Button to={paths.forum} size="lg" variant="secondary">
                Explore Community
              </Button>
              <Button href={site.discordInviteUrl} size="lg" variant="ghost">
                <DiscordIcon />
                Join Discord
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
