import type { ComponentType } from "react";
import {
  BookIcon,
  FlaskIcon,
  MessageIcon,
  RadarIcon,
  TerminalIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { paths } from "@/routes/paths";
import { platformStats } from "@/data/platformStats";

export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: ComponentType<{ className?: string }>;
  accent: "cyan" | "emerald" | "blue" | "violet" | "amber";
  scope?: string;
}

/** Major Hacknology experiences linked from the homepage. */
export const platformFeatures: PlatformFeature[] = [
  {
    id: "lessons",
    title: "Interactive Lessons",
    description:
      "Structured learning paths with scenarios, explanations, knowledge checks, and progress tracking across cybersecurity and technology topics.",
    href: paths.lessons,
    cta: "Browse lessons",
    icon: BookIcon,
    accent: "cyan",
    scope: `${platformStats.pathCount} paths · ${platformStats.lessonCount} lessons`,
  },
  {
    id: "terminal-labs",
    title: "Terminal Labs",
    description:
      "Practice commands inside every lesson with simulated shell environments — type real syntax, see realistic output, and build muscle memory safely.",
    href: paths.lessons,
    cta: "Start a lesson",
    icon: TerminalIcon,
    accent: "emerald",
    scope: "Built into every lesson",
  },
  {
    id: "scanme",
    title: "ScanMe",
    description:
      "A progressive Nmap training experience that walks from first scans through service detection, scripting, and reconnaissance workflows.",
    href: paths.scanme,
    cta: "Open ScanMe",
    icon: RadarIcon,
    accent: "blue",
    scope: `${platformStats.scanMeMissionCount} guided missions`,
  },
  {
    id: "community",
    title: "Community",
    description:
      "Ask questions, share knowledge, and discuss cybersecurity topics with other learners in the Hacknology forum.",
    href: paths.forum,
    cta: "Visit forum",
    icon: MessageIcon,
    accent: "violet",
    scope: "Discussions & knowledge sharing",
  },
  {
    id: "vulnerable-lab",
    title: "Vulnerable Labs",
    description:
      "Hands-on challenges in isolated sandboxes — broken logins, IDOR, XSS, and other defensive training scenarios with guided hints.",
    href: paths.vulnerableLab,
    cta: "Explore labs",
    icon: FlaskIcon,
    accent: "amber",
    scope: `${platformStats.vulnerableLabCount} sandbox challenges`,
  },
  {
    id: "discord",
    title: "Discord",
    description:
      "Connect with the Hacknology community for live help, announcements, and conversation alongside the platform.",
    href: "external:discord",
    cta: "Join Discord",
    icon: UsersIcon,
    accent: "cyan",
    scope: "Live community chat",
  },
];

export const learningJourneySteps = [
  {
    step: "01",
    title: "Discover Hacknology",
    description: "Explore lessons, labs, ScanMe, and the community from one platform.",
  },
  {
    step: "02",
    title: "Choose your path",
    description: "Pick a structured curriculum — fundamentals, networking, Linux, SOC, and more.",
  },
  {
    step: "03",
    title: "Learn by doing",
    description: "Read scenarios, then practice in embedded terminal labs inside every lesson.",
  },
  {
    step: "04",
    title: "Test your knowledge",
    description: "Pass knowledge checks, earn XP, and unlock the next lesson in your path.",
  },
  {
    step: "05",
    title: "Build real skills",
    description: "Extend training with ScanMe missions, vulnerable labs, and practical exercises.",
  },
  {
    step: "06",
    title: "Join the community",
    description: "Discuss what you learn, ask questions, and grow with other practitioners.",
  },
] as const;
