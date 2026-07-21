import type { PageContent } from "@/types";
import {
  BookIcon,
  DocsIcon,
  FlaskIcon,
  InfoIcon,
  LayersIcon,
  LockIcon,
  NetworkIcon,
  RadarIcon,
  ShieldIcon,
  TerminalIcon,
  WrenchIcon,
} from "@/components/ui/icons";

/**
 * Content for the placeholder pages. Copy and "what's coming" highlights live
 * here so pages stay presentational and content is easy to iterate on.
 */
export const pageContent: Record<
  "lessons" | "labs" | "tools" | "scan" | "resources" | "about",
  PageContent
> = {
  lessons: {
    eyebrow: "Learn",
    title: "Lessons & Learning Paths",
    description:
      "Structured, guided lessons that take you from cybersecurity fundamentals to advanced defensive topics — one clear module at a time.",
    icon: BookIcon,
    status: "Lesson content is in development.",
    highlights: [
      {
        title: "Guided learning paths",
        description:
          "Curated sequences covering fundamentals, networking, Linux, web security, and defense.",
        icon: LayersIcon,
      },
      {
        title: "Bite-sized modules",
        description:
          "Focused lessons with clear objectives so you always know what you're learning and why.",
        icon: BookIcon,
      },
      {
        title: "Progress tracking",
        description:
          "Track completed modules and pick up right where you left off (coming with accounts).",
        icon: ShieldIcon,
      },
    ],
  },
  labs: {
    eyebrow: "Practice",
    title: "Authorized Labs",
    description:
      "Hands-on, sandboxed lab environments where you can safely apply what you've learned in controlled, authorized settings.",
    icon: FlaskIcon,
    status: "Lab environments are being prepared.",
    highlights: [
      {
        title: "Controlled environments",
        description:
          "Every lab runs in an isolated, authorized sandbox designed for safe experimentation.",
        icon: LockIcon,
      },
      {
        title: "Networking & Linux",
        description:
          "Practice packet analysis, permissions, hardening, and core system administration skills.",
        icon: NetworkIcon,
      },
      {
        title: "Defensive focus",
        description:
          "Scenarios emphasize detection, analysis, and hardening — a blue-team mindset.",
        icon: ShieldIcon,
      },
    ],
  },
  tools: {
    eyebrow: "Toolkit",
    title: "Security Tools & Resources",
    description:
      "A curated reference of security tooling with clear, educational explanations of what each tool does and when to use it responsibly.",
    icon: WrenchIcon,
    status: "The tools directory is coming soon.",
    highlights: [
      {
        title: "Curated & explained",
        description:
          "Each entry includes purpose, category, and responsible-use guidance — not just a list.",
        icon: DocsIcon,
      },
      {
        title: "Organized by category",
        description:
          "Browse tooling grouped by discipline so you can find the right resource quickly.",
        icon: LayersIcon,
      },
      {
        title: "Educational context",
        description:
          "Learn the concepts behind each tool, reinforcing lessons and labs.",
        icon: BookIcon,
      },
    ],
  },
  scan: {
    eyebrow: "Assess",
    title: "Simulated Security Assessment",
    description:
      "An educational, simulated security assessment interface that walks through assessment concepts against controlled, sample targets only.",
    icon: RadarIcon,
    status: "The simulated assessment interface is in design.",
    highlights: [
      {
        title: "Simulated & safe",
        description:
          "A teaching interface using sample data — it never targets real or unauthorized systems.",
        icon: LockIcon,
      },
      {
        title: "Assessment concepts",
        description:
          "Understand how findings are structured, prioritized, and communicated.",
        icon: RadarIcon,
      },
      {
        title: "Defensive takeaways",
        description:
          "Every simulated finding pairs with guidance on how a defender would remediate it.",
        icon: ShieldIcon,
      },
    ],
  },
  resources: {
    eyebrow: "Reference",
    title: "Educational Resources",
    description:
      "Documentation, references, and study material to support your learning journey and deepen your understanding of security concepts.",
    icon: DocsIcon,
    status: "Resource library is being assembled.",
    highlights: [
      {
        title: "Documentation",
        description:
          "Clear reference material and guides that complement the lessons and labs.",
        icon: DocsIcon,
      },
      {
        title: "Study material",
        description:
          "Curated readings and references for students building foundational knowledge.",
        icon: BookIcon,
      },
      {
        title: "Command references",
        description:
          "Handy cheat-sheets for the tools and environments you'll use most.",
        icon: TerminalIcon,
      },
    ],
  },
  about: {
    eyebrow: "About",
    title: "About Hacknology",
    description:
      "Hacknology is a cybersecurity education platform focused on authorized learning, defensive security, and controlled training environments.",
    icon: InfoIcon,
    status: "Our mission and story.",
    highlights: [
      {
        title: "Education first",
        description:
          "We exist to help students understand security concepts clearly and responsibly.",
        icon: BookIcon,
      },
      {
        title: "Ethical & authorized",
        description:
          "Everything here is built around authorized, defensive, and controlled practice.",
        icon: ShieldIcon,
      },
      {
        title: "Defense-oriented",
        description:
          "We emphasize the skills that protect systems, data, and people.",
        icon: LockIcon,
      },
    ],
  },
};
