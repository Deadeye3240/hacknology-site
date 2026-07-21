import type { ComponentType } from "react";
import type { IconProps } from "@/components/ui/icons";

/** A component that renders an inline SVG icon. */
export type IconComponent = ComponentType<IconProps>;

/** Top-level navigation entry used by the navbar and footer. */
export interface NavItem {
  label: string;
  to: string;
}

/** Grouped navigation section for the navbar dropdown menus. */
export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Homepage "what you can do here" feature. */
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: IconComponent;
}

/** Difficulty levels shared across learning paths, labs, and challenges. */
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/** A structured learning path made up of multiple lessons/modules. */
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: IconComponent;
  level: Difficulty;
  moduleCount: number;
  skills?: string[];
  estimatedHours?: number;
  estimatedMinutes?: number;
  order?: number;
  prerequisitePathId?: string;
  specialization?: string;
  practiceLinks?: { label: string; to: string; type: string }[];
}

/** @deprecated Use @/types/education Lesson — kept for gradual migration */
export interface LegacyLesson {
  id: string;
  pathId: string;
  title: string;
  summary: string;
  objectives: string[];
  sections: { title: string; content: string }[];
  estimatedMinutes: number;
}

/** Re-export education Lesson as the canonical type */
export type { Lesson } from "@/types/education";

/** Category groupings for hands-on labs. */
export type LabCategory =
  | "Beginner"
  | "Networking"
  | "Linux"
  | "Web Security"
  | "Defensive Security"
  | "CTF";

/**
 * A single, self-contained step in a lab's instructions. `command`/`output` are
 * illustrative and simulated only — labs never execute anything.
 */
export interface LabStep {
  title: string;
  description: string;
  /** Optional illustrative command a learner might run in their own lab. */
  command?: string;
  /** Optional simulated/expected output shown for educational context. */
  output?: string;
}

/** A hands-on, authorized lab environment. */
export interface Lab {
  id: string;
  title: string;
  description: string;
  category: LabCategory;
  level: Difficulty;
  estimatedMinutes: number;
  /** Skills a learner develops by completing the lab. */
  skills: string[];
  /** Concrete learning objectives shown on the detail page. */
  objectives: string[];
  /** Recommended prior knowledge or completed labs. */
  prerequisites: string[];
  /** Ordered, educational instructions and simulated exercises. */
  instructions: LabStep[];
}

/**
 * Learner-facing progress state for a lab. Derived from the progress store;
 * "Not Started" is the implicit default when no record exists.
 */
export type LabStatus = "Not Started" | "In Progress" | "Completed";

/** Categories used to group the tools reference library. */
export type ToolCategory =
  | "Network Analysis"
  | "Web Security"
  | "System Administration"
  | "Defensive Security"
  | "Digital Forensics"
  | "Monitoring"
  | "Privacy & Security";

/** An educational entry in the curated security tools reference. */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  /** Supported platforms, e.g. ["Windows", "macOS", "Linux"]. */
  platforms: string[];
  skillLevel: Difficulty;
  /** Official project/product website. */
  website: string;
  /** Optional official documentation link. */
  documentation?: string;
}

/** Categories used to group external learning resources. */
export type ResourceCategory =
  | "Learning Platforms"
  | "Documentation"
  | "Security Frameworks"
  | "Communities"
  | "Books"
  | "CTF Platforms";

/** A reputable, external cybersecurity resource. */
export interface Resource {
  id: string;
  name: string;
  description: string;
  category: ResourceCategory;
  /** Official website for the resource. */
  website: string;
  /** Optional deep link to the most relevant page/material. */
  resourceLink?: string;
}

/** A grouped column of links used by the footer. */
export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  to: string;
  external?: boolean;
}

/** A single planned capability highlighted on a placeholder page. */
export interface PageHighlight {
  title: string;
  description: string;
  icon: IconComponent;
}

/** Content model for a placeholder page (kept separate from UI). */
export interface PageContent {
  eyebrow: string;
  title: string;
  description: string;
  icon: IconComponent;
  /** Short "what's coming" callout shown above the highlights. */
  status: string;
  highlights: PageHighlight[];
}
