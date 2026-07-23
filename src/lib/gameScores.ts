const STORAGE_KEY = "hacknology-game-scores";

export type GameScoreRecord = {
  best: number;
  bestTimeMs?: number;
  lastPlayed: string;
  attempts: number;
};

export type GameScoresMap = Record<string, GameScoreRecord>;

function readScores(): GameScoresMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as GameScoresMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeScores(scores: GameScoresMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export function getBestScore(gameId: string): number | null {
  const record = readScores()[gameId];
  return record?.best ?? null;
}

export function getGameScoreRecord(gameId: string): GameScoreRecord | null {
  return readScores()[gameId] ?? null;
}

export function getAllGameScores(): GameScoresMap {
  return readScores();
}

/** Higher scores are better for most games. Returns whether this run set a new best. */
export function recordGameScore(gameId: string, score: number): { isNewBest: boolean; best: number } {
  const scores = readScores();
  const prev = scores[gameId];
  const isNewBest = !prev || score > prev.best;

  scores[gameId] = {
    best: isNewBest ? score : prev.best,
    lastPlayed: new Date().toISOString(),
    attempts: (prev?.attempts ?? 0) + 1,
  };

  writeScores(scores);
  return { isNewBest, best: scores[gameId].best };
}

export function getBestTime(gameId: string): number | null {
  return readScores()[gameId]?.bestTimeMs ?? null;
}

/** Lower time is better. Stores finish time in milliseconds. */
export function recordGameTime(
  gameId: string,
  timeMs: number,
): { isNewBest: boolean; best: number } {
  const scores = readScores();
  const prev = scores[gameId];
  const prevBest = prev?.bestTimeMs;
  const isNewBest = prevBest == null || timeMs < prevBest;

  scores[gameId] = {
    best: prev?.best ?? 0,
    bestTimeMs: isNewBest ? timeMs : prevBest!,
    lastPlayed: new Date().toISOString(),
    attempts: (prev?.attempts ?? 0) + 1,
  };

  writeScores(scores);
  return { isNewBest, best: scores[gameId].bestTimeMs! };
}

export function formatGameTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centis = Math.floor((ms % 1000) / 10);
  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
  }
  return `${seconds}.${String(centis).padStart(2, "0")}s`;
}
