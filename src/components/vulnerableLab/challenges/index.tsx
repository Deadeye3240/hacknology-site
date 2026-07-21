import type { VulnerableLabChallenge } from "@/types/gamification";
import { BrokenLoginChallenge } from "./BrokenLoginChallenge";
import { IdorChallenge } from "./IdorChallenge";
import { EchoChamberChallenge } from "./EchoChamberChallenge";
import { FakeDatabaseChallenge } from "./FakeDatabaseChallenge";
import { LostInFilesChallenge } from "./LostInFilesChallenge";
import { CookieMonsterChallenge } from "./CookieMonsterChallenge";
import { InfoLeakChallenge } from "./InfoLeakChallenge";
import { SecurityHeadersChallenge } from "./SecurityHeadersChallenge";

interface ChallengeSimulatorProps {
  challenge: VulnerableLabChallenge;
  onSolve: () => void;
}

export function ChallengeSimulator({ challenge, onSolve }: ChallengeSimulatorProps) {
  switch (challenge.id) {
    case "broken-login":
      return <BrokenLoginChallenge onSolve={onSolve} />;
    case "whos-that-user":
      return <IdorChallenge onSolve={onSolve} />;
    case "echo-chamber":
      return <EchoChamberChallenge onSolve={onSolve} />;
    case "fake-database":
      return <FakeDatabaseChallenge onSolve={onSolve} />;
    case "lost-in-files":
      return <LostInFilesChallenge onSolve={onSolve} />;
    case "cookie-monster":
      return <CookieMonsterChallenge onSolve={onSolve} />;
    case "info-leak":
      return <InfoLeakChallenge onSolve={onSolve} />;
    case "security-headers":
      return <SecurityHeadersChallenge onSolve={onSolve} />;
    default:
      return <p className="text-slate-400">Challenge simulator not found.</p>;
  }
}
