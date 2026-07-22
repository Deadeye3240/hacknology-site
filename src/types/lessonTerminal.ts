/** Configuration for sandboxed interactive lesson terminals. */

export interface LessonTerminalHint {
  label: string;
  text: string;
}

export interface LessonTerminalAcceptRule {
  type: "command" | "commandPrefix" | "commandPattern" | "cwd" | "anyCommand";
  value?: string;
  values?: string[];
  pattern?: string;
  prefix?: string;
  path?: string;
  ignoreCase?: boolean;
}

export interface LessonTerminalStep {
  id: string;
  objective: string;
  /** Why this step matters — shown to the learner before they type. */
  why?: string;
  hints: LessonTerminalHint[];
  accept: LessonTerminalAcceptRule[];
  successMessage?: string;
}

export interface VfsFile {
  type: "file";
  content: string;
}

export interface VfsDir {
  type: "dir";
  children: Record<string, VfsNode>;
}

export type VfsNode = VfsFile | VfsDir;

export interface LessonTerminalScenario {
  username?: string;
  hostname?: string;
  prompt?: string;
  initialCwd?: string;
  filesystem?: VfsDir;
  banner?: string;
  /** Extra static or dynamic command output overrides */
  responses?: Record<string, string>;
}

export interface LessonTerminalLab {
  title?: string;
  introduction?: string;
  scenario: LessonTerminalScenario;
  steps: LessonTerminalStep[];
}

export interface TerminalSessionState {
  cwd: string;
  username: string;
  hostname: string;
}

export type TerminalLineType = "system" | "input" | "output" | "error" | "success";

export interface TerminalLine {
  type: TerminalLineType;
  text: string;
}
