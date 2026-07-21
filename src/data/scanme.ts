import type { Difficulty } from "@/types";

export interface ScanMeFlag {
  id: string;
  value: string;
  hint: string;
  xpReward: number;
}

export interface ScanMeMission {
  id: string;
  title: string;
  description: string;
  level: Difficulty;
  targetHost: string;
  targetNote: string;
  objectives: string[];
  hints: string[];
  flags: ScanMeFlag[];
  xpReward: number;
  estimatedMinutes: number;
  /** Simulated nmap -sV output for in-browser practice */
  simulatedScanOutput: string;
}

export const SCANME_TARGET_HOST = "scanme.hacknology-lab.local";

export const scanMeMissions: ScanMeMission[] = [
  {
    id: "recon-rookie",
    title: "Recon Rookie",
    description: "Discover open ports on the training target using basic Nmap scanning.",
    level: "Beginner",
    targetHost: SCANME_TARGET_HOST,
    targetNote:
      "Deploy the isolated ScanMe target locally (see docs/SCANME-LAB.md) or use the built-in simulator below. Only scan systems you own or have written permission to test.",
    objectives: [
      "Run a basic port scan against the authorized target",
      "Identify which ports are open",
      "Submit the flag hidden on the SSH service",
    ],
    hints: [
      "Try: nmap scanme.hacknology-lab.local",
      "Port 22 often runs SSH on Linux targets.",
      "Look for a flag in the SSH banner or service notes.",
    ],
    flags: [
      {
        id: "ssh-flag",
        value: "HACKNOLOGY{SSH_DISCOVERED}",
        hint: "Found when you identify the SSH service on port 22",
        xpReward: 50,
      },
    ],
    xpReward: 75,
    estimatedMinutes: 20,
    simulatedScanOutput: `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for scanme.hacknology-lab.local (192.0.2.10)
Host is up (0.012s latency).
Not shown: 997 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned in 1.24 seconds`,
  },
  {
    id: "service-detective",
    title: "Service Detective",
    description: "Enumerate service versions and find flags in HTTP headers.",
    level: "Intermediate",
    targetHost: SCANME_TARGET_HOST,
    targetNote: "Use version detection: nmap -sV -p 80,443 scanme.hacknology-lab.local",
    objectives: [
      "Identify service versions on ports 80 and 443",
      "Inspect HTTP response headers for hidden flags",
      "Submit all discovered flags",
    ],
    hints: [
      "Version detection uses -sV",
      "curl -I http://target may reveal custom headers",
      "Check X-Training-Flag headers in simulated output",
    ],
    flags: [
      {
        id: "http-flag",
        value: "HACKNOLOGY{HTTP_VERSION_ENUM}",
        hint: "Revealed when enumerating nginx version on port 80",
        xpReward: 75,
      },
      {
        id: "header-flag",
        value: "HACKNOLOGY{CUSTOM_HEADER_LEAK}",
        hint: "Found in X-Training-Flag response header",
        xpReward: 75,
      },
    ],
    xpReward: 150,
    estimatedMinutes: 30,
    simulatedScanOutput: `PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 8.9p1
80/tcp  open  http    nginx 1.24.0
443/tcp open  ssl/http nginx 1.24.0

HTTP/1.1 200 OK
Server: nginx/1.24.0
X-Training-Flag: HACKNOLOGY{CUSTOM_HEADER_LEAK}
X-Powered-By: Hacknology-Training-Lab`,
  },
  {
    id: "port-hunter",
    title: "Port Hunter",
    description: "Find all open ports including non-standard services.",
    level: "Intermediate",
    targetHost: SCANME_TARGET_HOST,
    targetNote: "Full TCP scan: nmap -p- scanme.hacknology-lab.local (authorized target only)",
    objectives: [
      "Identify all open TCP ports",
      "Discover the non-standard admin service",
      "Capture the admin panel flag",
    ],
    hints: [
      "Full port scans take longer but find uncommon services",
      "Check ports above 1024",
      "Port 8080 often hosts alternate admin interfaces in labs",
    ],
    flags: [
      {
        id: "all-ports",
        value: "HACKNOLOGY{ALL_PORTS_MAPPED}",
        hint: "Submit after finding ports 22, 80, 443, and 8080",
        xpReward: 100,
      },
    ],
    xpReward: 175,
    estimatedMinutes: 35,
    simulatedScanOutput: `PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
8080/tcp open  http-proxy

8080/tcp open  http
|_http-title: Training Admin Panel
|_http-flag: HACKNOLOGY{ALL_PORTS_MAPPED}`,
  },
  {
    id: "network-recon-expert",
    title: "Network Recon Expert",
    description: "Multi-step reconnaissance combining scanning, service analysis, and investigation.",
    level: "Advanced",
    targetHost: SCANME_TARGET_HOST,
    targetNote: "Combine -sV, script scans, and manual investigation. Authorized lab only.",
    objectives: [
      "Map all services and versions",
      "Identify the hidden FTP anonymous flag",
      "Document findings like a real engagement",
    ],
    hints: [
      "UDP services may not appear in basic TCP scans",
      "Nmap scripts (-sC) can reveal additional information",
      "FTP anonymous login is common in training environments",
    ],
    flags: [
      {
        id: "ftp-flag",
        value: "HACKNOLOGY{FTP_ANON_ACCESS}",
        hint: "Anonymous FTP on port 2121 in the expert lab",
        xpReward: 125,
      },
      {
        id: "expert-flag",
        value: "HACKNOLOGY{RECON_MASTER}",
        hint: "Complete all expert objectives",
        xpReward: 150,
      },
    ],
    xpReward: 250,
    estimatedMinutes: 45,
    simulatedScanOutput: `PORT     STATE SERVICE VERSION
21/tcp   filtered ftp
2121/tcp open     ftp     vsFTPd 3.0.5
| ftp-anon: Anonymous FTP login allowed
|_flag.txt: HACKNOLOGY{FTP_ANON_ACCESS}
80/tcp   open     http
443/tcp  open     https
3306/tcp filtered mysql

Final flag after full enumeration: HACKNOLOGY{RECON_MASTER}`,
  },
];

export function getScanMeMission(id: string): ScanMeMission | undefined {
  return scanMeMissions.find((m) => m.id === id);
}

export function normalizeFlag(input: string): string {
  return input.trim().toUpperCase();
}
