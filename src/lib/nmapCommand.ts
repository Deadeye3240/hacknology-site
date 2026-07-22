/** Parse and validate simulated Nmap commands for ScanMe training missions. */

export interface ParsedNmapCommand {
  raw: string;
  isNmap: boolean;
  target?: string;
  /** Normalized short flags without leading dash, e.g. sV, O, p */
  flags: Set<string>;
  portSpec?: string;
  timing?: string;
  outputFile?: string;
  skipPing: boolean;
  noDns: boolean;
  verbose: boolean;
  synScan: boolean;
  udpScan: boolean;
  defaultScripts: boolean;
  aggressive: boolean;
  serviceDetect: boolean;
  osDetect: boolean;
  fastScan: boolean;
}

export type CommandFeedbackKind =
  | "success"
  | "not-nmap"
  | "wrong-target"
  | "missing-requirement"
  | "extra-wrong"
  | "invalid"
  | "report-needed";

export interface CommandValidationResult {
  kind: CommandFeedbackKind;
  message: string;
  /** Show scan output even on partial success (close-but-wrong) */
  showOutput?: boolean;
}

const IP_RE = /^(?:\d{1,3}\.){3}\d{1,3}$/;

function tokenize(input: string): string[] {
  return input.trim().replace(/\s+/g, " ").split(" ");
}

function normalizeFlagToken(token: string): string {
  return token.replace(/^-+/, "").toLowerCase();
}

export function parseNmapCommand(input: string): ParsedNmapCommand {
  const tokens = tokenize(input);
  const result: ParsedNmapCommand = {
    raw: input.trim(),
    isNmap: tokens[0]?.toLowerCase() === "nmap",
    flags: new Set(),
    skipPing: false,
    noDns: false,
    verbose: false,
    synScan: false,
    udpScan: false,
    defaultScripts: false,
    aggressive: false,
    serviceDetect: false,
    osDetect: false,
    fastScan: false,
  };

  if (!result.isNmap) return result;

  let i = 1;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok.startsWith("-")) {
      const flag = normalizeFlagToken(tok);
      result.flags.add(flag);

      if (flag === "pn") result.skipPing = true;
      if (flag === "n") result.noDns = true;
      if (flag === "v") result.verbose = true;
      if (flag === "ss") result.synScan = true;
      if (flag === "su") result.udpScan = true;
      if (flag === "sc") result.defaultScripts = true;
      if (flag === "a") result.aggressive = true;
      if (flag === "sv") result.serviceDetect = true;
      if (flag === "o") result.osDetect = true;
      if (flag === "f") result.fastScan = true;
      if (flag === "p-") {
        result.portSpec = "-";
      } else if (flag === "p" && tokens[i + 1] && !tokens[i + 1].startsWith("-")) {
        i += 1;
        result.portSpec = tokens[i];
      } else if (flag.startsWith("p") && flag.length > 1) {
        result.portSpec = flag.slice(1);
      } else if (flag.startsWith("t") && /^t[0-5]$/.test(flag)) {
        result.timing = flag;
      } else if (flag === "on" && tokens[i + 1] && !tokens[i + 1].startsWith("-")) {
        i += 1;
        result.outputFile = tokens[i];
      } else if (flag.startsWith("o") && flag.length > 1 && flag !== "o") {
        result.outputFile = flag.slice(1) === "n" ? tokens[i + 1] : undefined;
      }
    } else if (IP_RE.test(tok) && !result.target) {
      result.target = tok;
    }
    i += 1;
  }

  return result;
}

export function parsePortReport(input: string): number[] | null {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/^ports?\s*[:=]?\s*/, "")
    .replace(/^report\s*[:=]?\s*/, "");
  const parts = cleaned.split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) return null;
  const ports: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isInteger(n) || n < 1 || n > 65535) return null;
    ports.push(n);
  }
  return ports.sort((a, b) => a - b);
}

export interface MissionCommandRules {
  type: "scan" | "report";
  target: string;
  /** If true, reject any non-default flags */
  basicScanOnly?: boolean;
  requireServiceDetect?: boolean;
  requireOsDetect?: boolean;
  requireFullPortScan?: boolean;
  requirePortSpec?: string | string[];
  requireFlags?: string[];
  requireSynScan?: boolean;
  requireUdpScan?: boolean;
  requireDefaultScripts?: boolean;
  requireAggressive?: boolean;
  requireSkipPing?: boolean;
  requireNoDns?: boolean;
  requireVerbose?: boolean;
  requireFastScan?: boolean;
  requireTiming?: string;
  requireOutputFile?: boolean;
  /** Combined flags — all must be present */
  requireCombined?: string[];
  reportPorts?: number[];
}

function hasPortSpec(parsed: ParsedNmapCommand, expected: string): boolean {
  if (!parsed.portSpec) return false;
  const norm = parsed.portSpec.replace(/\s/g, "").toLowerCase();
  const exp = expected.replace(/\s/g, "").toLowerCase();
  return norm === exp;
}

function isFullPortScan(parsed: ParsedNmapCommand): boolean {
  if (parsed.portSpec === "-") return true;
  if (!parsed.portSpec) return false;
  const norm = parsed.portSpec.replace(/\s/g, "");
  return norm === "1-65535" || norm === "1-65535/tcp";
}

export function validateMissionCommand(
  rules: MissionCommandRules,
  input: string,
): CommandValidationResult {
  if (rules.type === "report") {
    const ports = parsePortReport(input);
    if (!ports) {
      return {
        kind: "report-needed",
        message: 'List the open port numbers (e.g. "22,80" or "ports 22 80").',
      };
    }
    const expected = [...(rules.reportPorts ?? [])].sort((a, b) => a - b);
    if (ports.length !== expected.length || ports.some((p, i) => p !== expected[i])) {
      return {
        kind: "report-needed",
        message: "Not quite — review the scan output and list every open port you found.",
      };
    }
    return { kind: "success", message: "Correct — you identified the open ports." };
  }

  const parsed = parseNmapCommand(input);

  if (!parsed.isNmap) {
    return {
      kind: "not-nmap",
      message: "That is not an Nmap command. You need the network scanning tool called nmap.",
    };
  }

  if (!parsed.target) {
    return { kind: "wrong-target", message: "Specify the target IP address at the end of your command." };
  }

  if (parsed.target !== rules.target) {
    return {
      kind: "wrong-target",
      message: `Wrong target. This mission authorizes scanning ${rules.target} only.`,
    };
  }

  if (rules.basicScanOnly) {
    const extra =
      parsed.serviceDetect ||
      parsed.osDetect ||
      parsed.portSpec ||
      parsed.synScan ||
      parsed.udpScan ||
      parsed.defaultScripts ||
      parsed.aggressive ||
      parsed.skipPing ||
      parsed.noDns ||
      parsed.verbose ||
      parsed.fastScan ||
      parsed.timing ||
      parsed.outputFile;
    if (extra) {
      return {
        kind: "extra-wrong",
        message: "Good instinct — but this mission only needs a basic scan with no extra options.",
        showOutput: false,
      };
    }
    return { kind: "success", message: "Scan complete." };
  }

  if (rules.requireServiceDetect && !parsed.serviceDetect) {
    const hasBasic = parsed.target === rules.target && parsed.flags.size <= 0;
    return {
      kind: "missing-requirement",
      message: hasBasic
        ? "You successfully scanned the target, but this mission requires service/version detection."
        : "This mission requires the service/version detection option.",
      showOutput: hasBasic,
    };
  }

  if (rules.requireOsDetect && !parsed.osDetect) {
    return {
      kind: "missing-requirement",
      message: "This mission requires operating system detection.",
      showOutput: parsed.target === rules.target,
    };
  }

  if (rules.requireFullPortScan && !isFullPortScan(parsed)) {
    const hasBasic = parsed.target === rules.target && !parsed.portSpec;
    return {
      kind: "missing-requirement",
      message: hasBasic
        ? "Default scans miss non-standard ports. You need to scan all TCP ports."
        : "Use a full port range scan to find every open TCP port.",
      showOutput: hasBasic,
    };
  }

  if (rules.requirePortSpec) {
    const specs = Array.isArray(rules.requirePortSpec) ? rules.requirePortSpec : [rules.requirePortSpec];
    if (!specs.some((s) => hasPortSpec(parsed, s))) {
      return {
        kind: "missing-requirement",
        message: `This mission requires scanning specific port(s): ${specs.join(" or ")}.`,
        showOutput: parsed.target === rules.target,
      };
    }
  }

  if (rules.requireCombined) {
    const missing = rules.requireCombined.filter((f) => !parsed.flags.has(f.toLowerCase()));
    if (missing.length > 0) {
      return {
        kind: "missing-requirement",
        message: `Combine the required options: ${rules.requireCombined.map((f) => `-${f}`).join(" ")}.`,
        showOutput: parsed.target === rules.target,
      };
    }
  }

  if (rules.requireSynScan && !parsed.synScan) {
    return { kind: "missing-requirement", message: "This mission requires a SYN scan (-sS)." };
  }
  if (rules.requireUdpScan && !parsed.udpScan) {
    return { kind: "missing-requirement", message: "This mission requires a UDP scan (-sU)." };
  }
  if (rules.requireDefaultScripts && !parsed.defaultScripts) {
    return { kind: "missing-requirement", message: "This mission requires default NSE scripts (-sC)." };
  }
  if (rules.requireAggressive && !parsed.aggressive) {
    return { kind: "missing-requirement", message: "This mission requires aggressive scanning (-A)." };
  }
  if (rules.requireSkipPing && !parsed.skipPing) {
    return { kind: "missing-requirement", message: "This mission requires skipping host discovery (-Pn)." };
  }
  if (rules.requireNoDns && !parsed.noDns) {
    return { kind: "missing-requirement", message: "This mission requires disabling DNS resolution (-n)." };
  }
  if (rules.requireVerbose && !parsed.verbose) {
    return { kind: "missing-requirement", message: "This mission requires verbose output (-v)." };
  }
  if (rules.requireFastScan && !parsed.fastScan) {
    return { kind: "missing-requirement", message: "This mission requires a fast top-port scan (-F)." };
  }
  if (rules.requireTiming && parsed.timing !== rules.requireTiming.toLowerCase()) {
    return {
      kind: "missing-requirement",
      message: `This mission requires timing template -${rules.requireTiming.toUpperCase()}.`,
    };
  }
  if (rules.requireOutputFile && !parsed.outputFile) {
    return {
      kind: "missing-requirement",
      message: "Save results to a file using -oN filename.",
    };
  }

  if (rules.requireFlags) {
    for (const f of rules.requireFlags) {
      if (!parsed.flags.has(f.toLowerCase())) {
        return { kind: "missing-requirement", message: `Missing required flag: -${f}` };
      }
    }
  }

  return { kind: "success", message: "Scan complete." };
}
