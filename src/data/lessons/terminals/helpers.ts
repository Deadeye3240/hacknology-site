import type {
  LessonTerminalAcceptRule,
  LessonTerminalHint,
  LessonTerminalLab,
  LessonTerminalScenario,
  LessonTerminalStep,
} from "@/types/lessonTerminal";
import {
  DEFAULT_LINUX_VFS,
  DEFAULT_NETWORK_VFS,
  FORENSICS_VFS,
  SOC_VFS,
  WEB_VFS,
  WINDOWS_VFS,
} from "@/lib/lessonTerminal/vfs";
import { KALI_HOME, KALI_HOST, KALI_USER } from "@/lib/lessonTerminal/kali";

export const h = (label: string, text: string): LessonTerminalHint => ({ label, text });

export const cmd = (value: string, ignoreCase = false): LessonTerminalAcceptRule => ({
  type: "command",
  value,
  ignoreCase,
});

export const prefix = (value: string, ignoreCase = true): LessonTerminalAcceptRule => ({
  type: "commandPrefix",
  prefix: value,
  ignoreCase,
});

export const pattern = (value: string, ignoreCase = true): LessonTerminalAcceptRule => ({
  type: "commandPattern",
  pattern: value,
  ignoreCase,
});

export const anyCmd = (...values: string[]): LessonTerminalAcceptRule => ({
  type: "anyCommand",
  values,
  ignoreCase: true,
});

export const cwdRule = (path: string): LessonTerminalAcceptRule => ({
  type: "cwd",
  path,
});

export function step(
  id: string,
  objective: string,
  whyOrHints: string | LessonTerminalHint[],
  hintsOrAccept?: LessonTerminalHint[] | LessonTerminalAcceptRule[],
  acceptOrSuccess?: LessonTerminalAcceptRule[] | string,
  successMessage?: string,
): LessonTerminalStep {
  if (typeof whyOrHints === "string") {
    return {
      id,
      objective,
      why: whyOrHints,
      hints: hintsOrAccept as LessonTerminalHint[],
      accept: acceptOrSuccess as LessonTerminalAcceptRule[],
      successMessage,
    };
  }
  return {
    id,
    objective,
    hints: whyOrHints,
    accept: hintsOrAccept as LessonTerminalAcceptRule[],
    successMessage: acceptOrSuccess as string | undefined,
  };
}

export function lab(
  title: string,
  introOrScenario: string | LessonTerminalScenario,
  scenarioOrSteps: LessonTerminalScenario | LessonTerminalStep[],
  maybeSteps?: LessonTerminalStep[],
): LessonTerminalLab {
  if (maybeSteps) {
    return {
      title,
      introduction: introOrScenario as string,
      scenario: scenarioOrSteps as LessonTerminalScenario,
      steps: maybeSteps,
    };
  }
  return {
    title,
    introduction: `Apply "${title}" concepts in the sandboxed terminal below.`,
    scenario: introOrScenario as LessonTerminalScenario,
    steps: scenarioOrSteps as LessonTerminalStep[],
  };
}

export const KALI_SCENARIO: LessonTerminalScenario = {
  username: KALI_USER,
  hostname: KALI_HOST,
  initialCwd: KALI_HOME,
  filesystem: DEFAULT_LINUX_VFS,
  theme: "kali",
};

export const LINUX_SCENARIO: LessonTerminalScenario = {
  ...KALI_SCENARIO,
};

export const NETWORK_SCENARIO: LessonTerminalScenario = {
  ...KALI_SCENARIO,
  filesystem: DEFAULT_NETWORK_VFS,
};

export const WEB_SCENARIO: LessonTerminalScenario = {
  ...KALI_SCENARIO,
  filesystem: WEB_VFS,
};

export const SOC_SCENARIO: LessonTerminalScenario = {
  ...KALI_SCENARIO,
  filesystem: SOC_VFS,
};

export const FORENSICS_SCENARIO: LessonTerminalScenario = {
  ...KALI_SCENARIO,
  filesystem: FORENSICS_VFS,
};

export const WINDOWS_SCENARIO: LessonTerminalScenario = {
  username: "student",
  hostname: "WIN-LAB",
  initialCwd: "/Users/student",
  prompt: "PS C:\\Users\\student>",
  filesystem: WINDOWS_VFS,
  theme: "windows",
};

export const FUNDAMENTALS_SCENARIO: LessonTerminalScenario = {
  ...KALI_SCENARIO,
};
