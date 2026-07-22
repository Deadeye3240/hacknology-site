import type { ScanMeMission } from "./types";
import { scanOutputs, SCANME_TARGET_IP } from "./outputs";

const T = SCANME_TARGET_IP;

export const scanMeMissions: ScanMeMission[] = [
  // ── Level 1: Fundamentals ──────────────────────────────────────────
  {
    id: "first-scan",
    levelId: "fundamentals",
    order: 1,
    code: "01",
    title: "First Contact",
    objective: "Scan the target and identify which ports are open.",
    targetIp: T,
    xpReward: 50,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "You need a network scanning tool designed to discover hosts and services." },
      { label: "Tool", text: "The tool you are looking for is called Nmap." },
      { label: "Syntax", text: "The basic syntax is: nmap [target]" },
      { label: "Command", text: `Try: nmap ${T}` },
    ],
    commandRules: { type: "scan", target: T, basicScanOnly: true },
    simulatedOutput: scanOutputs.basic,
    learnSummary:
      "Nmap (Network Mapper) sends probes to a target and reports which ports are open, closed, or filtered. A basic scan with no options checks the most common 1,000 TCP ports.",
    achievementId: "nmap-initiate",
    estimatedMinutes: 5,
  },
  {
    id: "read-the-output",
    levelId: "fundamentals",
    order: 2,
    code: "02",
    title: "Read the Output",
    objective: "Review the scan results and report which port numbers are open.",
    targetIp: T,
    xpReward: 40,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "Open ports appear in the PORT column with STATE set to open." },
      { label: "Tool", text: "Run a basic scan first if you need fresh output: nmap [target]" },
      { label: "Syntax", text: 'List the port numbers separated by commas (e.g. "22,80").' },
      { label: "Answer", text: "The open ports are 22 and 80 — enter: 22,80" },
    ],
    commandRules: { type: "report", target: T, reportPorts: [22, 80] },
    simulatedOutput: scanOutputs.basic,
    learnSummary:
      "Port numbers identify services: 22 is commonly SSH, 80 is HTTP. TCP means the connection-oriented protocol most web and SSH services use.",
    achievementId: "port-hunter",
    estimatedMinutes: 5,
  },

  // ── Level 2: Service Detection ─────────────────────────────────────
  {
    id: "service-detective",
    levelId: "service-detection",
    order: 3,
    code: "03",
    title: "Service Detective",
    objective: "Identify the software and version running on the open ports.",
    targetIp: T,
    xpReward: 75,
    hintPenalty: 8,
    hints: [
      { label: "Concept", text: "Knowing a port is open is not enough — you often need the software name and version." },
      { label: "Tool", text: "Nmap can probe services to guess what software is running." },
      { label: "Syntax", text: "Add the service/version detection flag: nmap -sV [target]" },
      { label: "Command", text: `Try: nmap -sV ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireServiceDetect: true },
    simulatedOutput: scanOutputs.serviceDetect,
    partialOutput: scanOutputs.basic,
    learnSummary:
      "The -sV option enables service/version detection. Nmap sends additional probes to determine what application is listening on each open port.",
    achievementId: "service-detective",
    estimatedMinutes: 10,
  },

  // ── Level 3: Port Scanning ─────────────────────────────────────────
  {
    id: "single-port",
    levelId: "port-scanning",
    order: 4,
    code: "04",
    title: "Single Port",
    objective: "Scan only port 80 on the target.",
    targetIp: T,
    xpReward: 50,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "Sometimes you only care about one service — scanning fewer ports is faster." },
      { label: "Tool", text: "Nmap lets you specify exact ports with -p." },
      { label: "Syntax", text: "nmap -p [port] [target]" },
      { label: "Command", text: `Try: nmap -p 80 ${T}` },
    ],
    commandRules: { type: "scan", target: T, requirePortSpec: "80" },
    simulatedOutput: scanOutputs.port80,
    learnSummary:
      "The -p option limits the scan to specific ports. This saves time when you already know which service you are investigating.",
    estimatedMinutes: 5,
  },
  {
    id: "multi-port",
    levelId: "port-scanning",
    order: 5,
    code: "05",
    title: "Port List",
    objective: "Scan ports 22, 80, and 443 in a single command.",
    targetIp: T,
    xpReward: 55,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "You can scan several specific ports at once instead of one at a time." },
      { label: "Syntax", text: "Separate port numbers with commas: nmap -p 22,80,443 [target]" },
      { label: "Command", text: `Try: nmap -p 22,80,443 ${T}` },
    ],
    commandRules: { type: "scan", target: T, requirePortSpec: "22,80,443" },
    simulatedOutput: scanOutputs.portMulti,
    learnSummary:
      "Comma-separated port lists let you check multiple services efficiently. Port 443 typically carries HTTPS traffic.",
    estimatedMinutes: 5,
  },
  {
    id: "port-range",
    levelId: "port-scanning",
    order: 6,
    code: "06",
    title: "Port Range",
    objective: "Scan TCP ports 1 through 1000 on the target.",
    targetIp: T,
    xpReward: 60,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "A range covers every port between two numbers — useful for broader reconnaissance." },
      { label: "Syntax", text: "Use a hyphen for ranges: nmap -p 1-1000 [target]" },
      { label: "Command", text: `Try: nmap -p 1-1000 ${T}` },
    ],
    commandRules: { type: "scan", target: T, requirePortSpec: "1-1000" },
    simulatedOutput: scanOutputs.portRange,
    learnSummary:
      "Port ranges expand coverage beyond the default top 1,000 ports while still being faster than scanning all 65,535 ports.",
    estimatedMinutes: 8,
  },

  // ── Level 4: All Ports ─────────────────────────────────────────────
  {
    id: "find-every-door",
    levelId: "all-ports",
    order: 7,
    code: "07",
    title: "Find Every Door",
    objective: "Perform a complete scan of the target's TCP ports and find the hidden service.",
    targetIp: T,
    xpReward: 90,
    hintPenalty: 10,
    hints: [
      { label: "Concept", text: "Default scans only check common ports. Unusual services often hide on high port numbers." },
      { label: "Tool", text: "A full TCP port scan covers ports 1–65535." },
      { label: "Syntax", text: "Use -p- as shorthand for all ports: nmap -p- [target]" },
      { label: "Command", text: `Try: nmap -p- ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireFullPortScan: true },
    simulatedOutput: scanOutputs.fullPorts,
    partialOutput: scanOutputs.basic,
    learnSummary:
      "The -p- option scans all 65,535 TCP ports. It is slower but essential when a service does not appear in default scans — here, port 9000 was hidden.",
    achievementId: "full-sweep",
    estimatedMinutes: 12,
  },

  // ── Level 5: OS Detection ──────────────────────────────────────────
  {
    id: "os-investigator",
    levelId: "os-detection",
    order: 8,
    code: "08",
    title: "OS Investigator",
    objective: "Determine the operating system running on the target.",
    targetIp: T,
    xpReward: 75,
    hintPenalty: 8,
    hints: [
      { label: "Concept", text: "Fingerprinting the OS helps you choose exploits and understand the environment." },
      { label: "Tool", text: "Nmap compares TCP/IP stack behavior against a database of OS signatures." },
      { label: "Syntax", text: "Enable OS detection with -O (capital O): nmap -O [target]" },
      { label: "Command", text: `Try: nmap -O ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireOsDetect: true },
    simulatedOutput: scanOutputs.osDetect,
    partialOutput: scanOutputs.basic,
    learnSummary:
      "The -O flag attempts OS detection by analyzing how the target responds to probes. Results are best guesses and may require root privileges on real systems.",
    estimatedMinutes: 10,
  },

  // ── Level 6: Combining ───────────────────────────────────────────────
  {
    id: "stack-sv-o",
    levelId: "combining",
    order: 9,
    code: "09",
    title: "Double Stack",
    objective: "Run service detection and OS detection in one scan.",
    targetIp: T,
    xpReward: 80,
    hintPenalty: 8,
    hints: [
      { label: "Concept", text: "Nmap options can be combined in a single command to save time." },
      { label: "Syntax", text: "Chain flags together: nmap -sV -O [target]" },
      { label: "Command", text: `Try: nmap -sV -O ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireCombined: ["sV", "O"] },
    simulatedOutput: scanOutputs.combinedSvO,
    learnSummary:
      "Multiple flags work together. -sV -O gives you service versions and an OS guess in one pass — a common recon workflow.",
    estimatedMinutes: 10,
  },
  {
    id: "stack-full-sv",
    levelId: "combining",
    order: 10,
    code: "10",
    title: "Full Recon Pass",
    objective: "Scan all TCP ports with service/version detection enabled.",
    targetIp: T,
    xpReward: 100,
    hintPenalty: 10,
    hints: [
      { label: "Concept", text: "Combine full port coverage with version detection for thorough enumeration." },
      { label: "Syntax", text: "nmap -p- -sV [target]" },
      { label: "Command", text: `Try: nmap -p- -sV ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireCombined: ["p-", "sV"] },
    simulatedOutput: scanOutputs.combinedFullSv,
    learnSummary:
      "Power users combine -p- with -sV for complete service enumeration. Expect longer scan times on real networks.",
    achievementId: "nmap-apprentice",
    estimatedMinutes: 15,
  },

  // ── Level 7: Advanced ──────────────────────────────────────────────
  {
    id: "syn-stealth",
    levelId: "advanced",
    order: 11,
    code: "11",
    title: "SYN Stealth",
    objective: "Run a SYN (stealth) scan against the target.",
    targetIp: T,
    xpReward: 60,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "SYN scans send SYN packets without completing the TCP handshake — often quieter on logs." },
      { label: "Syntax", text: "nmap -sS [target] (requires elevated privileges on real systems)" },
      { label: "Command", text: `Try: nmap -sS ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireSynScan: true },
    simulatedOutput: scanOutputs.synScan,
    learnSummary:
      "-sS is the default scan type for privileged users. It is faster and less noisy than a full connect scan (-sT).",
    estimatedMinutes: 8,
  },
  {
    id: "udp-probes",
    levelId: "advanced",
    order: 12,
    code: "12",
    title: "UDP Probes",
    objective: "Scan UDP ports 53 and 123 on the target.",
    targetIp: T,
    xpReward: 65,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "UDP services (DNS, NTP) do not appear in default TCP scans." },
      { label: "Syntax", text: "nmap -sU -p 53,123 [target]" },
      { label: "Command", text: `Try: nmap -sU -p 53,123 ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireUdpScan: true, requirePortSpec: "53,123" },
    simulatedOutput: scanOutputs.udpScan,
    learnSummary:
      "-sU enables UDP scanning. UDP is connectionless, so scans are slower and results can be ambiguous (open vs open|filtered).",
    estimatedMinutes: 10,
  },
  {
    id: "default-scripts",
    levelId: "advanced",
    order: 13,
    code: "13",
    title: "Script Scan",
    objective: "Run Nmap's default safe scripts against the target.",
    targetIp: T,
    xpReward: 60,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "NSE scripts automate extra checks like banner grabbing and SSL enumeration." },
      { label: "Syntax", text: "nmap -sC [target] (shorthand for --script=default)" },
      { label: "Command", text: `Try: nmap -sC ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireDefaultScripts: true },
    simulatedOutput: scanOutputs.defaultScripts,
    learnSummary:
      "-sC runs the default script category. Scripts extend Nmap beyond port scanning into vulnerability checks and service enumeration.",
    estimatedMinutes: 8,
  },
  {
    id: "aggressive-mode",
    levelId: "advanced",
    order: 14,
    code: "14",
    title: "Aggressive Mode",
    objective: "Run an aggressive scan that enables OS detection, version detection, script scanning, and traceroute.",
    targetIp: T,
    xpReward: 70,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "-A is a shortcut that enables several intensive options at once." },
      { label: "Syntax", text: "nmap -A [target]" },
      { label: "Command", text: `Try: nmap -A ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireAggressive: true },
    simulatedOutput: scanOutputs.aggressive,
    learnSummary:
      "-A enables -O, -sV, -sC, and --traceroute. It is thorough but noisy — use only on authorized targets.",
    estimatedMinutes: 10,
  },
  {
    id: "skip-ping",
    levelId: "advanced",
    order: 15,
    code: "15",
    title: "Skip Discovery",
    objective: "Scan the target without running host discovery pings first.",
    targetIp: T,
    xpReward: 55,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "Some hosts block ping — you can still scan their ports." },
      { label: "Syntax", text: "nmap -Pn [target]" },
      { label: "Command", text: `Try: nmap -Pn ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireSkipPing: true },
    simulatedOutput: scanOutputs.skipPing,
    learnSummary:
      "-Pn skips the host discovery phase and treats the host as online. Essential when ICMP is filtered but ports may still respond.",
    estimatedMinutes: 6,
  },
  {
    id: "no-dns",
    levelId: "advanced",
    order: 16,
    code: "16",
    title: "No DNS",
    objective: "Scan the target without reverse-DNS resolution.",
    targetIp: T,
    xpReward: 50,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "Reverse DNS lookups can slow scans and leak information to DNS servers." },
      { label: "Syntax", text: "nmap -n [target]" },
      { label: "Command", text: `Try: nmap -n ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireNoDns: true },
    simulatedOutput: scanOutputs.noDns,
    learnSummary:
      "-n disables DNS resolution for speed and stealth. Output shows IP addresses instead of hostnames.",
    estimatedMinutes: 5,
  },
  {
    id: "verbose-output",
    levelId: "advanced",
    order: 17,
    code: "17",
    title: "Verbose Output",
    objective: "Run a verbose scan that shows additional progress detail.",
    targetIp: T,
    xpReward: 50,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "Verbose mode helps you understand what Nmap is doing during long scans." },
      { label: "Syntax", text: "nmap -v [target] (use -vv or -vvv for more detail)" },
      { label: "Command", text: `Try: nmap -v ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireVerbose: true },
    simulatedOutput: scanOutputs.verbose,
    learnSummary:
      "-v increases output verbosity. Helpful for learning and debugging; combine with longer scans to monitor progress.",
    estimatedMinutes: 5,
  },
  {
    id: "fast-top-ports",
    levelId: "advanced",
    order: 18,
    code: "18",
    title: "Fast Top Ports",
    objective: "Run a fast scan of the 100 most common ports.",
    targetIp: T,
    xpReward: 50,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "When time matters, scan fewer ports that still cover most common services." },
      { label: "Syntax", text: "nmap -F [target]" },
      { label: "Command", text: `Try: nmap -F ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireFastScan: true },
    simulatedOutput: scanOutputs.fastScan,
    learnSummary:
      "-F scans the 100 most common ports instead of 1,000. Faster but may miss uncommon services.",
    estimatedMinutes: 5,
  },
  {
    id: "timing-template",
    levelId: "advanced",
    order: 19,
    code: "19",
    title: "Timing Template",
    objective: "Scan the target using timing template T4 (aggressive).",
    targetIp: T,
    xpReward: 55,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "Timing templates (-T0 through -T5) control scan speed and stealth trade-offs." },
      { label: "Syntax", text: "nmap -T4 [target]" },
      { label: "Command", text: `Try: nmap -T4 ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireTiming: "t4" },
    simulatedOutput: scanOutputs.timing,
    learnSummary:
      "-T4 is an aggressive timing template suitable for fast networks. Lower values (-T1, -T2) are stealthier; -T5 is fastest but may overwhelm targets.",
    estimatedMinutes: 5,
  },
  {
    id: "save-results",
    levelId: "advanced",
    order: 20,
    code: "20",
    title: "Save Results",
    objective: "Scan the target and save normal-format output to a file.",
    targetIp: T,
    xpReward: 55,
    hintPenalty: 5,
    hints: [
      { label: "Concept", text: "Documenting scan results is essential for reports and compliance." },
      { label: "Syntax", text: "nmap -oN scan.txt [target] saves normal output to scan.txt" },
      { label: "Command", text: `Try: nmap -oN scan.txt ${T}` },
    ],
    commandRules: { type: "scan", target: T, requireOutputFile: true },
    simulatedOutput: scanOutputs.outputFile,
    learnSummary:
      "-oN writes human-readable output to a file. Other formats include -oX (XML) and -oG (grepable). Always store scan data securely.",
    estimatedMinutes: 6,
  },
];

export function getScanMeMission(id: string): ScanMeMission | undefined {
  return scanMeMissions.find((m) => m.id === id);
}

export function getNextMission(currentId: string): ScanMeMission | undefined {
  const idx = scanMeMissions.findIndex((m) => m.id === currentId);
  if (idx < 0 || idx >= scanMeMissions.length - 1) return undefined;
  return scanMeMissions[idx + 1];
}

export function getMissionsForLevel(levelId: string): ScanMeMission[] {
  return scanMeMissions.filter((m) => m.levelId === levelId);
}
