import type { Difficulty } from "@/types";

/** Practice destination linked from a lesson. */
export type PracticeType = "scanme" | "vulnerable-lab" | "games" | "labs";

export interface PracticeLink {
  label: string;
  to: string;
  type: PracticeType;
}

export interface LessonExample {
  kind: "command" | "code" | "http" | "log" | "alert" | "diagram";
  title?: string;
  content: string;
}

export type QuizQuestionType =
  | "multiple-choice"
  | "true-false"
  | "scenario"
  | "identify-vulnerability"
  | "identify-command"
  | "interpret-output";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  pathId: string;
  order: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  objectives: string[];
  introduction: string;
  coreConcepts: string[];
  detailedExplanation: string;
  realWorldExample: string;
  scenario: string;
  practicalExamples: LessonExample[];
  terminology: { term: string; definition: string }[];
  commonMistakes: string[];
  defensiveConsiderations: string[];
  conclusion: string;
  knowledgeCheck: QuizQuestion[];
  practiceLink?: PracticeLink;
  /** Legacy sections for backward compatibility in exports */
  sections?: { title: string; content: string }[];
}

export interface PathAssessment {
  id: string;
  title: string;
  passingScore: number;
  xpReward: number;
  questions: QuizQuestion[];
}

export interface LearningPathMeta {
  id: string;
  title: string;
  description: string;
  level: Difficulty;
  skills: string[];
  estimatedHours: number;
  order: number;
  prerequisitePathId?: string;
  practiceLinks: PracticeLink[];
  specialization?: string;
}

export interface LessonProgressRecord {
  completedAt: string;
  quizScore: number;
  quizTotal: number;
  quizPassed: boolean;
}

export interface PathCompletionRecord {
  completedAt: string;
  assessmentScore: number;
}
