import type {
  Lesson,
  LessonExample,
  PathAssessment,
  PracticeLink,
  QuizQuestion,
} from "@/types/education";
import type { LessonTerminalLab } from "@/types/lessonTerminal";

export interface TopicInput {
  id: string;
  pathId: string;
  order: number;
  title: string;
  summary: string;
  estimatedMinutes?: number;
  objectives: string[];
  introduction: string;
  coreConcepts: string[];
  explanation: string;
  realWorld: string;
  scenario: string;
  practical?: LessonExample[];
  terms: { term: string; definition: string }[];
  mistakes: string[];
  defensive: string[];
  quiz: QuizQuestion[];
  practiceLink?: PracticeLink;
  terminal?: LessonTerminalLab;
  /** Optional lesson-specific summary; avoids generic boilerplate conclusions. */
  conclusion?: string;
}

/** Build a fully structured lesson from topic metadata. */
export function createLesson(t: TopicInput): Lesson {
  const practicalExamples = t.practical ?? [];
  return {
    id: t.id,
    pathId: t.pathId,
    order: t.order,
    title: t.title,
    summary: t.summary,
    estimatedMinutes: t.estimatedMinutes ?? 20,
    objectives: t.objectives,
    introduction: t.introduction,
    coreConcepts: t.coreConcepts,
    detailedExplanation: t.explanation,
    realWorldExample: t.realWorld,
    scenario: t.scenario,
    practicalExamples,
    terminology: t.terms,
    commonMistakes: t.mistakes,
    defensiveConsiderations: t.defensive,
    conclusion:
      t.conclusion ??
      `You can now explain ${t.title.toLowerCase()} in your own words and apply the hands-on steps from this lesson in authorized lab environments only.`,
    knowledgeCheck: t.quiz,
    practiceLink: t.practiceLink,
    terminal: t.terminal,
    sections: [
      { title: "Core concepts", content: t.coreConcepts.join(" ") },
      { title: "Deep dive", content: t.explanation },
      { title: "Real-world context", content: t.realWorld },
    ],
  };
}

export function mcQuiz(
  id: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): QuizQuestion {
  return { id, type: "multiple-choice", prompt, options, correctIndex, explanation };
}

export function tfQuiz(
  id: string,
  prompt: string,
  correct: boolean,
  explanation: string,
): QuizQuestion {
  return {
    id,
    type: "true-false",
    prompt,
    options: ["True", "False"],
    correctIndex: correct ? 0 : 1,
    explanation,
  };
}

export function createPathAssessment(
  pathId: string,
  title: string,
  questions: QuizQuestion[],
  xpReward = 200,
): PathAssessment {
  return {
    id: `${pathId}-final`,
    title,
    passingScore: Math.ceil(questions.length * 0.7),
    xpReward,
    questions,
  };
}
