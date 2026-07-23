import { Hero } from "@/components/ui/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { LearningPathCard } from "@/components/cards/LearningPathCard";
import {
  ArrowRightIcon,
  DiscordIcon,
  MessageIcon,
  PlayIcon,
  RadarIcon,
  TerminalIcon,
} from "@/components/ui/icons";
import { learningPaths } from "@/data/learningPaths";
import { DiscordCommunityCard } from "@/components/community/DiscordCommunityCard";
import { ExploreHacknology } from "@/components/home/ExploreHacknology";
import { LearnPracticeMaster } from "@/components/home/LearnPracticeMaster";
import { NerdGamesSpotlight } from "@/components/home/NerdGamesSpotlight";
import { CommunitySpotlight } from "@/components/home/CommunitySpotlight";
import { HomeSection } from "@/components/home/HomeSection";
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
            <TerminalIcon className="text-sm text-accent-300" aria-hidden />
            Hands-on cybersecurity · {site.domain}
          </>
        }
        title={<Logo asLink={false} size="hero" showDomain />}
        subtitle="A hands-on cybersecurity learning platform."
        description="Structured lessons and terminal labs. Sandbox web challenges and ScanMe recon. XP progression, Cyber Rider, and a practitioner forum — built for people who learn by doing, not watching."
        actions={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Button to={paths.lessons} size="lg" className="w-full sm:w-auto">
              Start Learning
              <ArrowRightIcon />
            </Button>
            <Button to={paths.game("stick-rider")} size="lg" variant="secondary" className="w-full sm:w-auto">
              <PlayIcon />
              Play Cyber Rider
            </Button>
            <Button to={paths.forum} size="lg" variant="ghost" className="w-full sm:w-auto">
              <MessageIcon />
              Join Community
            </Button>
          </div>
        }
        visual={<PlatformHeroVisual />}
      />

      <HomeSection id="start-learning">
        <SectionHeader
          eyebrow="Start learning"
          title="Structured paths from fundamentals to specialist skills"
          description={`${platformStats.pathCount} learning paths and ${platformStats.lessonCount} lessons with embedded terminal labs, knowledge checks, and XP — pick a track and begin.`}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
        <div className="mt-8 flex justify-center sm:justify-start">
          <Button to={paths.lessons} variant="secondary">
            Open Learn hub
            <ArrowRightIcon />
          </Button>
        </div>
      </HomeSection>

      <HomeSection id="practice" tone="secondary">
        <SectionHeader
          eyebrow="Practice hands-on"
          title="Train in terminals and sandbox environments"
          description="Apply what you study in guided recon missions and isolated vulnerable web labs — the same muscle memory employers expect."
          className="[&_h2]:text-xl [&_h2]:sm:text-2xl"
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
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
              Learn scanning step by step — from your first port scan through service detection, inside a guided
              terminal experience.
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
                <h3 className="text-lg font-semibold text-white">Vulnerable web labs</h3>
                <p className="text-xs text-slate-500">
                  {platformStats.vulnerableLabCount} isolated challenge scenarios
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Practice IDOR, XSS, auth flaws, and more in safe sandbox apps with hints and XP rewards.
            </p>
            <Button to={paths.vulnerableLab} variant="secondary" size="sm" className="mt-auto w-fit">
              Open Vulnerable Lab
              <ArrowRightIcon />
            </Button>
          </Card>
        </div>
      </HomeSection>

      <HomeSection id="games">
        <SectionHeader
          eyebrow="Play & challenge"
          title="Nerd Games — quick cybersecurity drills"
          description="Cyber Rider is the flagship time-attack run. The arcade also includes trivia, forensics puzzles, and more."
        />
        <div className="mt-10">
          <NerdGamesSpotlight />
        </div>
      </HomeSection>

      <HomeSection id="progress">
        <SectionHeader
          eyebrow="Track progress"
          title="Learn → Practice → Test → Master"
          description="Every phase maps to real platform features — lessons, terminal labs, assessments, and XP achievements."
        />
        <div className="mt-10">
          <LearnPracticeMaster />
        </div>
      </HomeSection>

      <HomeSection tone="secondary">
        <SectionHeader
          align="center"
          eyebrow="Explore"
          title="Everything on Hacknology"
          description="Lessons, labs, tools, resources, games, and community — each links to a live part of the platform."
          className="[&_h2]:text-xl [&_h2]:sm:text-2xl [&_p]:text-sm"
        />
        <div className="mt-8">
          <ExploreHacknology />
        </div>
      </HomeSection>

      <HomeSection id="community">
        <SectionHeader
          eyebrow="Connect"
          title="Join the practitioner community"
          description="Ask questions, share knowledge, and discuss cybersecurity on the Hacknology forum."
        />
        <div className="mt-8">
          <CommunitySpotlight />
        </div>
      </HomeSection>

      <HomeSection tone="secondary">
        <SectionHeader
          eyebrow="Live chat companion"
          title="Discord for real-time conversation"
          description="Pair the forum with Discord for quick questions, study sessions, and announcements alongside the platform."
          className="[&_h2]:text-xl [&_h2]:sm:text-2xl [&_p]:text-sm"
        />
        <div className="mt-6">
          <DiscordCommunityCard />
        </div>
      </HomeSection>

      <Section>
        <Card className="relative overflow-hidden border-accent-400/20 bg-surface/60 px-6 py-12 text-center sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-60" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <Logo asLink={false} size="lg" showDomain className="justify-center" />
            <h2 className="text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Ready to learn cybersecurity by doing?
            </h2>
            <p className="text-pretty text-sm text-slate-400 sm:text-base lg:text-lg">
              Pick a path, practice in the terminal, chase a Cyber Rider best time, and join discussions with people
              building real skills.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
              <Button to={paths.lessons} size="lg" className="w-full sm:w-auto">
                Start Learning
                <ArrowRightIcon />
              </Button>
              <Button to={paths.game("stick-rider")} size="lg" variant="secondary" className="w-full sm:w-auto">
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
        </Card>
      </Section>
    </>
  );
}
