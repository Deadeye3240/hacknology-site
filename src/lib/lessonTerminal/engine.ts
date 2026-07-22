import type {
  LessonTerminalAcceptRule,
  LessonTerminalScenario,
  LessonTerminalStep,
  TerminalSessionState,
} from "@/types/lessonTerminal";
import {
  DEFAULT_LINUX_VFS,
  DEFAULT_NETWORK_VFS,
  FORENSICS_VFS,
  SOC_VFS,
  WEB_VFS,
  WINDOWS_VFS,
  listDirectory,
  normalizePath,
  readFile,
  resolveNode,
} from "./vfs";
import type { VfsDir, VfsNode } from "@/types/lessonTerminal";

export interface CommandResult {
  output: string;
  error?: string;
  state: TerminalSessionState;
}

export interface StepValidationResult {
  ok: boolean;
  message: string;
  advance: boolean;
}

function normalizeCmd(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function getFs(scenario: LessonTerminalScenario): VfsDir {
  return scenario.filesystem ?? DEFAULT_LINUX_VFS;
}

function promptFor(state: TerminalSessionState, scenario: LessonTerminalScenario): string {
  if (scenario.prompt) return scenario.prompt;
  const shortCwd = state.cwd === `/home/${state.username}` ? "~" : state.cwd;
  return `${state.username}@${state.hostname}:${shortCwd}$`;
}

export function createInitialState(scenario: LessonTerminalScenario): TerminalSessionState {
  const username = scenario.username ?? "student";
  const hostname = scenario.hostname ?? "hacknology-lab";
  return {
    username,
    hostname,
    cwd: scenario.initialCwd ?? `/home/${username}`,
  };
}

export function getPrompt(state: TerminalSessionState, scenario: LessonTerminalScenario): string {
  return promptFor(state, scenario);
}

function parseArgs(input: string): { cmd: string; args: string[] } {
  const parts = input.trim().split(/\s+/);
  return { cmd: (parts[0] ?? "").toLowerCase(), args: parts.slice(1) };
}

function readLines(root: VfsDir, path: string): string[] | null {
  const content = readFile(root, path);
  if (content === null) return null;
  return content.split("\n");
}

function resolveFilePath(cwd: string, target: string): string | null {
  if (!target) return null;
  return target.startsWith("/") ? target : normalizePath(cwd, target);
}

function grepOutput(root: VfsDir, cwd: string, args: string[]): string {
  const pattern = args.find((a) => !a.startsWith("-"));
  const fileArg = args.filter((a) => !a.startsWith("-")).slice(1)[0];
  if (!pattern) return "grep: missing pattern";
  const path = fileArg ? resolveFilePath(cwd, fileArg) : null;
  if (!path) return "grep: missing file operand";
  const lines = readLines(root, path);
  if (lines === null) return `grep: ${fileArg}: No such file or directory`;
  const re = new RegExp(pattern, "i");
  const matches = lines.filter((line) => re.test(line));
  return matches.length ? matches.join("\n") : "";
}

function headTail(root: VfsDir, cwd: string, args: string[], tail: boolean): string {
  const fileArg = args.find((a) => !a.startsWith("-"));
  if (!fileArg) return `${tail ? "tail" : "head"}: missing file operand`;
  const path = resolveFilePath(cwd, fileArg);
  if (!path) return `${tail ? "tail" : "head"}: ${fileArg}: No such file`;
  const lines = readLines(root, path);
  if (lines === null) return `${tail ? "tail" : "head"}: ${fileArg}: No such file or directory`;
  const countArg = args.find((a) => a.startsWith("-"))?.replace(/\D/g, "");
  const count = countArg ? Number.parseInt(countArg, 10) : 10;
  const slice = tail ? lines.slice(-count) : lines.slice(0, count);
  return slice.join("\n");
}

function findOutput(root: VfsDir, cwd: string, args: string[]): string {
  const startIdx = args.indexOf("-name");
  const namePattern = startIdx >= 0 ? args[startIdx + 1]?.replace(/"/g, "") : undefined;
  const startPath = args.find((a, i) => !a.startsWith("-") && i < startIdx) ?? cwd;
  const base = startPath.startsWith("/") ? startPath : normalizePath(cwd, startPath) ?? cwd;
  const results: string[] = [];
  function walk(path: string, node: VfsNode) {
    if (node.type === "file") {
      const name = path.split("/").pop() ?? "";
      if (!namePattern || name.includes(namePattern.replace(/\*/g, ""))) results.push(path);
      return;
    }
    for (const [child, childNode] of Object.entries(node.children)) {
      const next = path === "/" ? `/${child}` : `${path}/${child}`;
      walk(next, childNode);
    }
  }
  const node = resolveNode(root, base);
  if (!node || node.type !== "dir") return `find: '${startPath}': No such file or directory`;
  walk(base, node);
  return results.join("\n");
}

function curlOutput(args: string[]): string {
  const url = args.find((a) => !a.startsWith("-")) ?? "http://localhost";
  const headOnly = args.some((a) => a === "-I" || a === "--head");
  if (headOnly) {
    return (
      `HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8\nSet-Cookie: session=lab123; HttpOnly; Secure\nX-Frame-Options: DENY\nServer: Hacknology-Training/1.0\n\n# Response body omitted (HEAD request)`
    );
  }
  return (
    `<html><head><title>Training App</title></head><body><h1>Simulated response from ${url}</h1></body></html>`
  );
}

function nmapOutput(args: string[]): string {
  const target = args.find((a) => !a.startsWith("-")) ?? "10.10.10.25";
  const flags = args.filter((a) => a.startsWith("-")).join(" ");
  let portSection =
    "PORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\n443/tcp open https";
  if (flags.includes("-sU")) {
    portSection = "PORT   STATE SERVICE\n53/udp open  domain\n123/udp open  ntp";
  }
  if (flags.includes("-sV")) {
    portSection =
      "PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9\n80/tcp open  http    Apache httpd 2.4.52";
  }
  if (flags.includes("-O")) {
    portSection +=
      "\n\nOS details: Linux 5.15 - 6.1, OS CPE: cpe:/o:linux:linux_kernel:5\nOS detection performed.";
  }
  if (flags.includes("-sn") || flags.includes("-Pn")) {
    return (
      `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${target}\nHost is up (0.0091s latency).\n\nNmap done: 1 IP address (1 host up) scanned in 0.42 seconds`
    );
  }
  return (
    `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${target}\nHost is up (0.0091s latency).\n${portSection}\n\nNmap done: 1 IP address (1 host up) scanned in 1.05 seconds`
  );
}

function lsOutput(root: VfsDir, cwd: string, args: string[]): string {
  const showAll = args.includes("-a") || args.some((a) => a.includes("a"));
  const long = args.includes("-l") || args.some((a) => a.includes("l"));
  const target = args.find((a) => !a.startsWith("-")) ?? cwd;
  const path = target.startsWith("/") ? target : normalizePath(cwd, target) ?? cwd;
  const names = listDirectory(root, path, showAll);
  if (names.length === 0) {
    const node = resolveNode(root, path);
    if (!node) return `ls: cannot access '${target}': No such file or directory`;
    if (node.type === "file") return target;
  }
  if (long) {
    return names
      .map((n) => {
        const full = path === "/" ? `/${n}` : `${path}/${n}`;
        const node = resolveNode(root, full);
        const kind = node?.type === "dir" ? "d" : "-";
        return `${kind}rw-r--r-- 1 student student 4096 Jan 10 12:00 ${n}`;
      })
      .join("\n");
  }
  return names.join("  ");
}

function handleBuiltin(
  input: string,
  state: TerminalSessionState,
  scenario: LessonTerminalScenario,
): CommandResult {
  const root = getFs(scenario);
  const { cmd, args } = parseArgs(input);
  const key = normalizeCmd(input);

  if (scenario.responses?.[key]) {
    return { output: scenario.responses[key], state };
  }

  switch (cmd) {
    case "pwd":
      return { output: state.cwd, state };

    case "whoami":
      return { output: state.username, state };

    case "echo":
      return { output: args.join(" "), state };

    case "clear":
      return { output: "__CLEAR__", state };

    case "help":
      return {
        output:
          "Built-in lab commands: pwd, cd, ls, cat, echo, whoami, clear, help, grep, head, tail, find, env\n" +
          "Network tools (simulated): ping, ip, ifconfig, ss, netstat, dig, whois, host, nslookup, nmap, curl\n" +
          "Windows-style: type, dir, Get-Content",
        state,
      };

    case "cd": {
      const target = args[0] ?? `/home/${state.username}`;
      const next = normalizePath(state.cwd, target);
      if (!next) return { output: "", error: `cd: ${target}: Invalid path`, state };
      const node = resolveNode(root, next);
      if (!node || node.type !== "dir") {
        return { output: "", error: `cd: ${target}: No such file or directory`, state };
      }
      return { output: "", state: { ...state, cwd: next } };
    }

    case "ls":
      return { output: lsOutput(root, state.cwd, args), state };

    case "cat":
    case "type":
    case "get-content": {
      const target = args[0];
      if (!target) return { output: "", error: `${cmd}: missing file operand`, state };
      const path = target.startsWith("/") ? target : normalizePath(state.cwd, target);
      if (!path) return { output: "", error: `${cmd}: ${target}: No such file`, state };
      const content = readFile(root, path);
      if (content === null) {
        const node = resolveNode(root, path);
        if (node?.type === "dir") return { output: "", error: `${cmd}: ${target}: Is a directory`, state };
        return { output: "", error: `${cmd}: ${target}: No such file or directory`, state };
      }
      return { output: content, state };
    }

    case "grep":
      return { output: grepOutput(root, state.cwd, args), state };

    case "head":
      return { output: headTail(root, state.cwd, args, false), state };

    case "tail":
      return { output: headTail(root, state.cwd, args, true), state };

    case "find":
      return { output: findOutput(root, state.cwd, args), state };

    case "env":
      return {
        output: `USER=${state.username}\nHOME=/home/${state.username}\nSHELL=/bin/bash\nPWD=${state.cwd}`,
        state,
      };

    case "ps":
      return {
        output:
          "  PID TTY          TIME CMD\n 1204 pts/0    00:00:00 bash\n 1301 pts/0    00:00:00 sshd\n 1402 pts/0    00:00:00 nginx",
        state,
      };

    case "curl":
      return { output: curlOutput(args), state };

    case "host":
    case "nslookup": {
      const name = args.find((a) => !a.startsWith("-")) ?? "hacknology.xyz";
      return {
        output:
          cmd === "host"
            ? `${name} has address 104.21.0.1\n${name} mail is handled by 10 mail.${name}.`
            : `Server:\t\t1.1.1.1\nAddress:\t1.1.1.1#53\n\nName:\t${name}\nAddress: 104.21.0.1`,
        state,
      };
    }

    case "dir":
      return { output: lsOutput(root, state.cwd, args), state };

    case "ping": {
      const host = args.find((a) => !a.startsWith("-")) ?? "127.0.0.1";
      const isV6 = host === "::1" || host.includes(":");
      const resolved = host === "training-target" ? "10.10.10.25" : host;
      return {
        output:
          `PING ${host} (${resolved}) ${isV6 ? "128" : "56"}(84) bytes of data.\n` +
          `64 bytes from ${host === "training-target" ? "10.10.10.25" : host}: icmp_seq=1 ttl=64 time=0.412 ms\n` +
          `64 bytes from ${host === "training-target" ? "10.10.10.25" : host}: icmp_seq=2 ttl=64 time=0.389 ms\n` +
          `\n--- ${host} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`,
        state,
      };
    }

    case "ip":
      return {
        output:
          "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n" +
          "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 192.168.56.10/24 brd 192.168.56.255 scope global eth0",
        state,
      };

    case "ifconfig":
      return {
        output:
          "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.56.10  netmask 255.255.255.0\n" +
          "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0",
        state,
      };

    case "ss":
    case "netstat":
      return {
        output:
          "Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port\n" +
          "tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*\n" +
          "tcp   LISTEN 0      128          0.0.0.0:80        0.0.0.0:*\n" +
          "tcp   LISTEN 0      128             [::]:443           [::]:*",
        state,
      };

    case "dig": {
      const name = args.find((a) => !a.startsWith("-")) ?? "hacknology.xyz";
      return {
        output:
          `; <<>> DiG simulated <<>> ${name}\n;; ANSWER SECTION:\n${name}.\t300\tIN\tA\t104.21.0.1`,
        state,
      };
    }

    case "whois": {
      const domain = args[0] ?? "hacknology.xyz";
      return {
        output: `Domain Name: ${domain.toUpperCase()}\nRegistrar: Hacknology Training Registry\nCreation Date: 2024-01-01`,
        state,
      };
    }

    case "nmap":
      return { output: nmapOutput(args), state };

    default:
      return {
        output: "",
        error: `${cmd}: command not found (simulated lab shell)`,
        state,
      };
  }
}

export function executeCommand(
  input: string,
  state: TerminalSessionState,
  scenario: LessonTerminalScenario,
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { output: "", state };
  return handleBuiltin(trimmed, state, scenario);
}

function matchRule(
  rule: LessonTerminalAcceptRule,
  input: string,
  state: TerminalSessionState,
): boolean {
  const cmd = normalizeCmd(input);
  const lower = rule.ignoreCase ? cmd.toLowerCase() : cmd;

  switch (rule.type) {
    case "command":
      return lower === (rule.ignoreCase ? rule.value?.toLowerCase() : rule.value);
    case "commandPrefix": {
      const prefix = rule.prefix ?? rule.value ?? "";
      return lower.startsWith(rule.ignoreCase ? prefix.toLowerCase() : prefix);
    }
    case "commandPattern":
      return new RegExp(rule.pattern ?? "", rule.ignoreCase ? "i" : undefined).test(cmd);
    case "cwd":
      return state.cwd === rule.path;
    case "anyCommand":
      return (rule.values ?? []).some((v) => lower === (rule.ignoreCase ? v.toLowerCase() : v));
    default:
      return false;
  }
}

export function validateStep(
  input: string,
  step: LessonTerminalStep,
  state: TerminalSessionState,
): StepValidationResult {
  if (!input.trim()) {
    return { ok: false, message: "Enter a command and press Enter.", advance: false };
  }

  const matched = step.accept.some((rule) => matchRule(rule, input, state));
  if (matched) {
    return {
      ok: true,
      message: step.successMessage ?? "Correct — step complete.",
      advance: true,
    };
  }

  const wants = step.accept
    .map((r) => {
      if (r.type === "command") return r.value;
      if (r.type === "commandPrefix") return `${r.prefix ?? r.value}…`;
      if (r.type === "anyCommand") return (r.values ?? []).join(" or ");
      if (r.type === "cwd") return `cd to ${r.path}`;
      return "specific command";
    })
    .join(", ");

  return {
    ok: false,
    message: `Not quite — this step expects: ${wants}`,
    advance: false,
  };
}

export function defaultScenarioForPath(pathId: string): LessonTerminalScenario {
  if (pathId === "networking" || pathId === "nmap" || pathId === "osint") {
    return {
      username: "student",
      hostname: "hacknology-lab",
      initialCwd: "/home/student",
      filesystem: DEFAULT_NETWORK_VFS,
    };
  }
  if (pathId === "web-security") {
    return {
      username: "student",
      hostname: "web-lab",
      initialCwd: "/home/student",
      filesystem: WEB_VFS,
    };
  }
  if (pathId === "soc") {
    return {
      username: "analyst",
      hostname: "soc-console",
      initialCwd: "/home/analyst",
      filesystem: SOC_VFS,
    };
  }
  if (pathId === "forensics") {
    return {
      username: "investigator",
      hostname: "forensics-lab",
      initialCwd: "/home/investigator",
      filesystem: FORENSICS_VFS,
    };
  }
  if (pathId === "windows") {
    return {
      username: "student",
      hostname: "WIN-LAB",
      initialCwd: "/Users/student",
      prompt: "PS C:\\Users\\student>",
      filesystem: WINDOWS_VFS,
    };
  }
  return {
    username: "student",
    hostname: "hacknology-lab",
    initialCwd: "/home/student",
    filesystem: DEFAULT_LINUX_VFS,
  };
}
