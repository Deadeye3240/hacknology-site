import type { LearningPath } from "@/types";
import {
  BookIcon,
  LayersIcon,
  NetworkIcon,
  RadarIcon,
  ShieldIcon,
  TerminalIcon,
  TargetIcon,
  UsersIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { learningPathMeta } from "@/data/lessons/learningPathMeta";
import { lessonCountForPath, estimatedMinutesForPath } from "@/data/lessons";

const icons: Record<string, typeof BookIcon> = {
  fundamentals: BookIcon,
  networking: NetworkIcon,
  linux: TerminalIcon,
  windows: ShieldIcon,
  "web-security": LayersIcon,
  forensics: SearchIcon,
  soc: TargetIcon,
  osint: UsersIcon,
  nmap: RadarIcon,
};

/** Structured learning paths for the Learn hub and homepage. */
export const learningPaths: LearningPath[] = learningPathMeta.map((meta) => ({
  id: meta.id,
  title: meta.title,
  description: meta.description,
  icon: icons[meta.id] ?? BookIcon,
  level: meta.level,
  moduleCount: lessonCountForPath(meta.id),
  skills: meta.skills,
  estimatedHours: meta.estimatedHours,
  estimatedMinutes: estimatedMinutesForPath(meta.id),
  order: meta.order,
  prerequisitePathId: meta.prerequisitePathId,
  specialization: meta.specialization,
  practiceLinks: meta.practiceLinks,
}));
