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

export const LINUX_SCENARIO: LessonTerminalScenario = {
  username: "student",
  hostname: "hacknology-lab",
  initialCwd: "/home/student",
  filesystem: DEFAULT_LINUX_VFS,
  banner: "Linux lab — simulated shell, authorized training only.",
};

export const NETWORK_SCENARIO: LessonTerminalScenario = {
  username: "student",
  hostname: "hacknology-lab",
  initialCwd: "/home/student",
  filesystem: DEFAULT_NETWORK_VFS,
  banner: "Network lab — responses are simulated for learning.",
};

export const WEB_SCENARIO: LessonTerminalScenario = {
  username: "student",
  hostname: "web-lab",
  initialCwd: "/home/student",
  filesystem: WEB_VFS,
  banner: "Web security lab — inspect headers, logs, and paths safely.",
};

export const SOC_SCENARIO: LessonTerminalScenario = {
  username: "analyst",
  hostname: "soc-console",
  initialCwd: "/home/analyst",
  filesystem: SOC_VFS,
  banner: "SOC triage lab — correlate alerts with log evidence.",
};

export const FORENSICS_SCENARIO: LessonTerminalScenario = {
  username: "investigator",
  hostname: "forensics-lab",
  initialCwd: "/home/investigator",
  filesystem: FORENSICS_VFS,
  banner: "Forensics lab — preserve chain of custody; read-only investigation.",
};

export const WINDOWS_SCENARIO: LessonTerminalScenario = {
  username: "student",
  hostname: "WIN-LAB",
  initialCwd: "/Users/student",
  prompt: "PS C:\\Users\\student>",
  filesystem: WINDOWS_VFS,
  banner: "Windows lab — PowerShell-style commands, simulated environment.",
};

export const FUNDAMENTALS_SCENARIO: LessonTerminalScenario = {
  ...LINUX_SCENARIO,
  banner: "Security fundamentals lab — connect concepts to analyst workflows.",
};
