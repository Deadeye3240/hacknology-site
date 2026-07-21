export interface NerdGame {
  id: string;
  title: string;
  description: string;
  category: "Trivia" | "Cryptography" | "Terminal" | "Arcade" | "Logic";
  estimatedMinutes: number;
}

export const nerdGames: NerdGame[] = [
  {
    id: "cyber-trivia",
    title: "Cybersecurity Trivia",
    description: "Test your knowledge of security fundamentals, protocols, and famous incidents.",
    category: "Trivia",
    estimatedMinutes: 5,
  },
  {
    id: "crypto-puzzle",
    title: "Crypto Decoder",
    description: "Decode Base64 and Caesar cipher messages like a digital detective.",
    category: "Cryptography",
    estimatedMinutes: 8,
  },
  {
    id: "terminal-challenge",
    title: "Terminal Challenge",
    description: "Match Linux commands to their purpose — sharpen your command-line instincts.",
    category: "Terminal",
    estimatedMinutes: 6,
  },
  {
    id: "stick-rider",
    title: "Stick Rider",
    description: "A physics bike challenge — balance, momentum, and a little chaos.",
    category: "Arcade",
    estimatedMinutes: 10,
  },
];

export function getGameById(id: string): NerdGame | undefined {
  return nerdGames.find((g) => g.id === id);
}
