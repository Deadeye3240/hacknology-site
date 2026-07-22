import type { Lesson } from "@/types/education";
import type { LessonTerminalHint, LessonTerminalLab, LessonTerminalStep } from "@/types/lessonTerminal";
import { defaultScenarioForPath } from "@/lib/lessonTerminal/engine";
import { lessonTerminalRegistry } from "@/data/lessons/terminals/registry";

function hint(label: string, text: string): LessonTerminalHint {
  return { label, text };
}

function step(
  id: string,
  objective: string,
  accept: LessonTerminalStep["accept"],
  hints: LessonTerminalHint[],
  successMessage?: string,
): LessonTerminalStep {
  return { id, objective, accept, hints, successMessage };
}

function extractCommands(lesson: Lesson): string[] {
  const cmds: string[] = [];
  for (const ex of lesson.practicalExamples) {
    if (ex.kind !== "command" && ex.kind !== "code") continue;
    for (const line of ex.content.split("\n")) {
      const trimmed = line.replace(/#.*$/, "").trim();
      if (!trimmed || trimmed.startsWith("//")) continue;
      if (/^(Jan|Starting|PORT|64 bytes|---)/i.test(trimmed)) continue;
      cmds.push(trimmed);
    }
  }
  return [...new Set(cmds)].slice(0, 5);
}

function genericHints(cmd: string): LessonTerminalHint[] {
  const base = cmd.split(/\s+/)[0];
  return [
    hint("Concept", "Type the command you would run in a real terminal for this lesson objective."),
    hint("Tool", `The command you need starts with: ${base}`),
    hint("Command", `Try: ${cmd}`),
  ];
}

function stepsFromCommands(commands: string[], lesson: Lesson): LessonTerminalStep[] {
  if (commands.length === 0) return [];
  return commands.map((cmd, i) =>
    step(
      `${lesson.id}-cmd-${i + 1}`,
      `Run: ${cmd}`,
      [{ type: "command", value: cmd, ignoreCase: true }],
      genericHints(cmd),
      "Correct command.",
    ),
  );
}

const PATH_FALLBACKS: Record<string, string[][]> = {
  linux: [["pwd"], ["ls"], ["cd /var/log"], ["cat auth.log"]],
  networking: [["ping -c 2 127.0.0.1"], ["ip addr"], ["ss -tulpn"]],
  nmap: [["nmap 10.10.10.25"], ["nmap -sV 10.10.10.25"]],
  osint: [["whois hacknology.xyz"], ["dig hacknology.xyz"]],
  fundamentals: [["whoami"], ["echo Hacknology"]],
  windows: [["whoami"], ["echo lab-ready"]],
  "web-security": [["curl -I http://localhost"], ["echo enumerate"]],
  forensics: [["ls /var/log"], ["cat auth.log"]],
  soc: [["ss -tulpn"], ["tail auth.log"]],
};

function fallbackSteps(lesson: Lesson): LessonTerminalStep[] {
  const cmds = PATH_FALLBACKS[lesson.pathId]?.flat() ?? [["help"], ["pwd"]];
  return cmds.slice(0, 4).map((cmd, i) =>
    step(
      `${lesson.id}-fallback-${i + 1}`,
      `Practice: ${cmd}`,
      [{ type: "commandPrefix", prefix: cmd.split(/\s+/)[0], ignoreCase: true }],
      genericHints(cmd),
    ),
  );
}

/** Build a terminal lab for any lesson — custom registry entry or auto-generated steps. */
export function resolveLessonTerminal(lesson: Lesson): LessonTerminalLab {
  if (lesson.terminal) return lesson.terminal;

  const registered = lessonTerminalRegistry[lesson.id];
  if (registered) return registered;

  const fromPractical = stepsFromCommands(extractCommands(lesson), lesson);
  const steps = fromPractical.length > 0 ? fromPractical : fallbackSteps(lesson);

  return {
    title: "Hands-on terminal",
    introduction: `Apply concepts from "${lesson.title}" in a sandboxed terminal. Nothing you type runs on a real server.`,
    scenario: defaultScenarioForPath(lesson.pathId),
    steps,
  };
}

/** Every lesson resolves to a terminal lab configuration. */
export function lessonHasTerminal(_lesson: Lesson): boolean {
  return true;
}
