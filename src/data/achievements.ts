import type { Achievement } from "@/types/gamification";

/** Achievements earned through the isolated Vulnerable Lab. */
export const achievements: Achievement[] = [
  {
    id: "first-exploit",
    title: "First Exploit",
    description: "Complete your first vulnerable lab challenge.",
    xpBonus: 25,
  },
  {
    id: "web-hunter",
    title: "Web Hunter",
    description: "Complete 5 web security challenges.",
    xpBonus: 100,
  },
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    description: "Complete all beginner-level challenges.",
    xpBonus: 75,
  },
  {
    id: "security-researcher",
    title: "Security Researcher",
    description: "Complete an advanced-level challenge.",
    xpBonus: 150,
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}
