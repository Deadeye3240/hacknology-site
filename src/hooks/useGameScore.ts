import { useCallback, useMemo, useState } from "react";
import {
  getBestScore,
  getGameScoreRecord,
  recordGameScore,
} from "@/lib/gameScores";

export function useGameScore(gameId: string) {
  const [bestScore, setBestScore] = useState<number | null>(() => getBestScore(gameId));
  const record = useMemo(() => getGameScoreRecord(gameId), [gameId, bestScore]);

  const saveScore = useCallback(
    (score: number) => {
      const result = recordGameScore(gameId, score);
      setBestScore(result.best);
      return result;
    },
    [gameId],
  );

  return { bestScore, attempts: record?.attempts ?? 0, saveScore };
}
