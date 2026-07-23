export type GameCategory =
  | "Trivia"
  | "Cryptography"
  | "Terminal"
  | "Arcade"
  | "Defense"
  | "Forensics"
  | "Logic";

export type GameDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface NerdGame {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  featured?: boolean;
  /** Flagship arcade experience — hero placement in hub and homepage */
  highlight?: boolean;
  scoreType?: "points" | "time";
}

export const nerdGames: NerdGame[] = [
  {
    id: "cyber-trivia",
    title: "Cyber Trivia",
    description: "Fast multiple-choice rounds on security fundamentals, threats, and best practices.",
    category: "Trivia",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    xpReward: 40,
    featured: true,
  },
  {
    id: "crypto-puzzle",
    title: "Crypto Decoder",
    description: "Decode ciphers and spot encoding patterns used in real-world security puzzles.",
    category: "Cryptography",
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    xpReward: 60,
    featured: true,
  },
  {
    id: "terminal-challenge",
    title: "Terminal Challenge",
    description: "Pick the right Linux command for each mission — the same muscle memory labs build.",
    category: "Terminal",
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    xpReward: 50,
    featured: true,
  },
  {
    id: "stick-rider",
    title: "Cyber Rider",
    description:
      "Stick-bike stunt run with ramps, gaps, aerial flips, and combo scoring. Chase a personal-best finish time.",
    category: "Arcade",
    difficulty: "Intermediate",
    estimatedMinutes: 5,
    xpReward: 75,
    highlight: true,
    featured: true,
    scoreType: "time",
  },
  {
    id: "password-strength",
    title: "Password Strength Challenge",
    description: "Rate passwords against real criteria — length, entropy, patterns, and common leaks.",
    category: "Defense",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    xpReward: 45,
    featured: true,
  },
  {
    id: "phishing-detector",
    title: "Phishing Detector",
    description: "Spot spoofed senders, urgency traps, and malicious links before they land in an inbox.",
    category: "Defense",
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    xpReward: 55,
    featured: true,
  },
  {
    id: "log-hunt",
    title: "Log Hunt",
    description: "Scan auth and web logs to find the suspicious entry that triggered the alert.",
    category: "Forensics",
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    xpReward: 60,
  },
  {
    id: "secure-or-vulnerable",
    title: "Secure or Vulnerable",
    description: "Decide whether configs, headers, and practices are hardened or exploitable.",
    category: "Logic",
    difficulty: "Advanced",
    estimatedMinutes: 10,
    xpReward: 70,
  },
];

export function getGameById(id: string): NerdGame | undefined {
  return nerdGames.find((g) => g.id === id);
}

export const gameCategories = [
  "All",
  ...Array.from(new Set(nerdGames.map((g) => g.category))),
] as const;
