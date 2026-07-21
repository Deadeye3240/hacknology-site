import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SecurityConsole } from "@/components/ui/SecurityConsole";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { LearningPathCard } from "@/components/cards/LearningPathCard";
import { LabCard } from "@/components/cards/LabCard";
import { ArrowRightIcon, LockIcon } from "@/components/ui/icons";
import { features } from "@/data/features";
import { learningPaths } from "@/data/learningPaths";
import { featuredLabs } from "@/data/labs";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow={
          <>
            <LockIcon className="text-sm text-accent-300" />
            Authorized cybersecurity education
          </>
        }
        title={
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl">
            <span className="text-gradient">{site.name}</span>
          </h1>
        }
        subtitle="Learn Cybersecurity. Build Skills. Defend Better."
        description={site.description}
        actions={
          <>
            <Button to="/lessons" size="lg">
              Start Learning
              <ArrowRightIcon />
            </Button>
            <Button to="/labs" size="lg" variant="secondary">
              Explore Labs
            </Button>
          </>
        }
        visual={<SecurityConsole />}
      />

      {/* Core pillars */}
      <Section>
        <SectionHeader
          align="center"
          eyebrow="Why Hacknology"
          title="Learn. Test. Defend."
          description="A focused platform that pairs clear instruction with safe, hands-on practice and a defensive mindset."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </Section>

      {/* Learning paths preview */}
      <Section className="pt-0">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Learning paths"
            title="Structured paths for every stage"
            description="Follow a guided curriculum from the fundamentals through advanced defensive security."
          />
          <Button to="/lessons" variant="ghost" size="sm" className="shrink-0">
            View all paths
            <ArrowRightIcon />
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <LearningPathCard key={path.id} path={path} />
          ))}
        </div>
      </Section>

      {/* Featured labs preview */}
      <Section className="pt-0">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Featured labs"
            title="Practice in controlled environments"
            description="Authorized, sandboxed labs designed for safe, hands-on skill building."
          />
          <Button to="/labs" variant="ghost" size="sm" className="shrink-0">
            View all labs
            <ArrowRightIcon />
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </Section>

      {/* Final call to action */}
      <Section>
        <Card className="relative overflow-hidden border-accent-400/20 bg-surface/60 px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-80" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              Ready to build real, responsible security skills?
            </h2>
            <p className="text-pretty text-base text-slate-400 sm:text-lg">
              Start with the fundamentals and work your way toward a defender's
              mindset — all in a safe, authorized learning environment.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/lessons" size="lg">
                Start Learning
                <ArrowRightIcon />
              </Button>
              <Button to="/about" size="lg" variant="secondary">
                Learn more
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
