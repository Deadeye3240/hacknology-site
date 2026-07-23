import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LearningPathCard } from "@/components/cards/LearningPathCard";
import {
  ArrowRightIcon,
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
import { HomeHero } from "@/components/home/HomeHero";
import { HomeFinalCta } from "@/components/home/HomeFinalCta";
import { platformStats } from "@/data/platformStats";
import { paths } from "@/routes/paths";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <HomeSection id="start-learning">
        <SectionHeader
          index="01"
          eyebrow="Start learning"
          title="Structured paths from fundamentals to specialist skills"
          description={`${platformStats.pathCount} learning paths and ${platformStats.lessonCount} lessons with embedded terminal labs, knowledge checks, and XP.`}
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
          index="02"
          eyebrow="Practice hands-on"
          title="Train in terminals and sandbox environments"
          description="Apply what you study in guided recon missions and isolated vulnerable web labs — the same muscle memory employers expect."
          className="[&_h2]:text-xl [&_h2]:sm:text-2xl"
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Card className="group flex flex-col gap-4 border-brand-500/15 bg-brand-500/[0.03] p-6 transition hover:border-brand-500/25">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-brand-500/25 bg-brand-500/10 text-xl text-brand-400 transition group-hover:shadow-glow-sm">
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

          <Card className="group flex flex-col gap-4 border-amber-400/15 bg-amber-400/[0.03] p-6 transition hover:border-amber-400/25">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-xl text-amber-300 transition group-hover:shadow-glow-sm">
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
          index="03"
          eyebrow="Play & challenge"
          title="Nerd Games — quick cybersecurity drills"
          description="Cyber Rider is the flagship stunt run with real physics. The arcade also includes trivia, forensics puzzles, and more."
        />
        <div className="mt-10">
          <NerdGamesSpotlight />
        </div>
      </HomeSection>

      <HomeSection id="progress" tone="secondary">
        <SectionHeader
          index="04"
          eyebrow="Track progress"
          title="Learn → Practice → Test → Master"
          description="Every phase maps to real platform features — lessons, terminal labs, assessments, and XP achievements."
        />
        <div className="mt-10">
          <LearnPracticeMaster />
        </div>
      </HomeSection>

      <HomeSection>
        <SectionHeader
          index="05"
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
          index="06"
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
          index="07"
          eyebrow="Live chat companion"
          title="Discord for real-time conversation"
          description="Pair the forum with Discord for quick questions, study sessions, and announcements alongside the platform."
          className="[&_h2]:text-xl [&_h2]:sm:text-2xl [&_p]:text-sm"
        />
        <div className="mt-6">
          <DiscordCommunityCard />
        </div>
      </HomeSection>

      <HomeFinalCta />
    </>
  );
}
