import { paths } from "@/routes/paths";
import { platformStats } from "@/data/platformStats";
import {
  BookIcon,
  TerminalIcon,
  ShieldIcon,
  RadarIcon,
  WrenchIcon,
  DocsIcon,
  ListChecksIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
} from "@/components/ui/icons";
import type { ComponentType, SVGProps } from "react";

export type FeatureAccent = "cyan" | "emerald" | "blue" | "violet" | "amber";

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent: FeatureAccent;
  scope?: string;
  cta: string;
}

export const platformFeatures: PlatformFeature[] = [
  {
    id: "lessons",
    title: "Interactive Lessons",
    description:
      "Structured paths with examples, knowledge checks, and embedded terminal labs — not passive video courses.",
    href: paths.lessons,
    icon: BookIcon,
    accent: "cyan",
    scope: `${platformStats.lessonCount} lessons · ${platformStats.pathCount} paths`,
    cta: "Browse lessons",
  },
  {
    id: "terminal-labs",
    title: "Terminal Practice",
    description:
      "Run real commands in simulated Kali environments tied to lesson objectives and guided feedback.",
    href: paths.lessons,
    icon: TerminalIcon,
    accent: "emerald",
    cta: "Open terminal labs",
  },
  {
    id: "vulnerable-lab",
    title: "Vulnerable Web Labs",
    description:
      "Exploit intentionally broken apps in an isolated sandbox — IDOR, XSS, auth flaws, and more.",
    href: paths.vulnerableLab,
    icon: ShieldIcon,
    accent: "amber",
    scope: `${platformStats.vulnerableLabCount} challenges`,
    cta: "Enter sandbox",
  },
  {
    id: "scanme",
    title: "ScanMe / Nmap Practice",
    description:
      "Recon missions with a live terminal against scan targets — learn port scanning without guesswork.",
    href: paths.scanme,
    icon: RadarIcon,
    accent: "blue",
    scope: `${platformStats.scanMeMissionCount} missions`,
    cta: "Launch ScanMe",
  },
  {
    id: "tools",
    title: "Cybersecurity Tools",
    description:
      "Curated utilities and references for recon, encoding, hashing, and day-to-day security work.",
    href: paths.tools,
    icon: WrenchIcon,
    accent: "violet",
    cta: "Open tools",
  },
  {
    id: "resources",
    title: "Resources Library",
    description:
      "Cheatsheets, reading lists, and reference material to support what you learn on the platform.",
    href: paths.resources,
    icon: DocsIcon,
    accent: "cyan",
    cta: "Browse resources",
  },
  {
    id: "assessments",
    title: "Assessments & Certs",
    description:
      "Path assessments and knowledge checks that verify skills before you claim completion.",
    href: paths.lessons,
    icon: ListChecksIcon,
    accent: "blue",
    cta: "View paths",
  },
  {
    id: "xp",
    title: "XP & Achievements",
    description:
      "Earn XP from lessons, labs, and missions. Unlock achievements as you progress through paths.",
    href: paths.dashboard,
    icon: SparklesIcon,
    accent: "violet",
    cta: "View progress",
  },
  {
    id: "games",
    title: "Nerd Games",
    description:
      "Quick cybersecurity mini-games — trivia, forensics puzzles, phishing drills, and more.",
    href: paths.games,
    icon: TargetIcon,
    accent: "emerald",
    scope: `${platformStats.gameCount} games`,
    cta: "Play games",
  },
  {
    id: "forum",
    title: "Community Forum",
    description:
      "Discuss techniques, ask questions, and share what you learned with other practitioners.",
    href: paths.forum,
    icon: UsersIcon,
    accent: "amber",
    cta: "Join discussion",
  },
];

export interface LearnPracticeStep {
  phase: string;
  title: string;
  description: string;
  href: string;
  examples: string[];
}

export const learnPracticeSteps: LearnPracticeStep[] = [
  {
    phase: "Learn",
    title: "Build the foundation",
    description:
      "Follow structured lesson paths with real examples, knowledge checks, and embedded terminal scenarios.",
    href: paths.lessons,
    examples: ["Fundamentals", "Web security", "Linux & networking"],
  },
  {
    phase: "Practice",
    title: "Train hands-on",
    description:
      "Apply concepts in Kali terminal labs, ScanMe recon missions, and isolated vulnerable web challenges.",
    href: paths.vulnerableLab,
    examples: ["Terminal labs", "ScanMe", "Vulnerable Lab"],
  },
  {
    phase: "Test",
    title: "Prove your skills",
    description:
      "Complete path assessments and knowledge checks to verify you can apply what you studied.",
    href: paths.lessons,
    examples: ["Path assessments", "Lesson quizzes", "Lab objectives"],
  },
  {
    phase: "Master",
    title: "Track your growth",
    description:
      "Earn XP, unlock achievements, and build a portfolio of completed paths and certifications.",
    href: paths.dashboard,
    examples: ["XP progression", "Achievements", "Path certs"],
  },
];

/** @deprecated Use learnPracticeSteps — kept for any legacy imports */
export const learningJourneySteps = learnPracticeSteps.map((step, i) => ({
  step: String(i + 1).padStart(2, "0"),
  title: `${step.phase}: ${step.title}`,
  description: step.description,
}));
