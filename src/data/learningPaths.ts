import type { LearningPath } from "@/types";
import {
  BookIcon,
  LayersIcon,
  NetworkIcon,
  ShieldIcon,
  TerminalIcon,
} from "@/components/ui/icons";

/** Learning paths previewed on the homepage and (later) the lessons page. */
export const learningPaths: LearningPath[] = [
  {
    id: "fundamentals",
    title: "Cybersecurity Fundamentals",
    description:
      "Core security principles, terminology, threat models, and the CIA triad — the foundation every practitioner needs.",
    icon: BookIcon,
    level: "Beginner",
    moduleCount: 8,
  },
  {
    id: "networking",
    title: "Networking",
    description:
      "How networks really work: TCP/IP, DNS, routing, and the protocols attackers and defenders care about most.",
    icon: NetworkIcon,
    level: "Beginner",
    moduleCount: 10,
  },
  {
    id: "linux",
    title: "Linux",
    description:
      "Command line fluency, permissions, services, and system hardening on the operating system that runs the internet.",
    icon: TerminalIcon,
    level: "Intermediate",
    moduleCount: 9,
  },
  {
    id: "web-security",
    title: "Web Security",
    description:
      "Understand common web vulnerabilities, how they occur, and how to build and defend resilient web applications.",
    icon: LayersIcon,
    level: "Intermediate",
    moduleCount: 12,
  },
  {
    id: "defensive-security",
    title: "Defensive Security",
    description:
      "Detection, monitoring, incident response, and hardening — building the blue-team skills that keep systems safe.",
    icon: ShieldIcon,
    level: "Advanced",
    moduleCount: 11,
  },
];
