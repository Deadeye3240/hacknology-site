import type { LearningPathMeta } from "@/types/education";
import { paths } from "@/routes/paths";

/** Curriculum metadata — icons live in learningPaths.ts */
export const learningPathMeta: LearningPathMeta[] = [
  {
    id: "fundamentals",
    title: "Cybersecurity Fundamentals",
    description:
      "Core principles, threats, risk, controls, authentication, cryptography basics, and human factors — the foundation every practitioner needs.",
    level: "Beginner",
    skills: ["CIA triad", "Threat modeling", "Risk assessment", "Password security", "Social engineering"],
    estimatedHours: 12,
    order: 1,
    practiceLinks: [
      { label: "Vulnerable Lab", to: paths.vulnerableLab, type: "vulnerable-lab" },
    ],
  },
  {
    id: "networking",
    title: "Networking Fundamentals",
    description:
      "OSI and TCP/IP, IP addressing, DNS, routing, firewalls, VPNs, and network monitoring for security practitioners.",
    level: "Beginner",
    skills: ["TCP/IP", "DNS", "Subnetting", "Firewalls", "TLS"],
    estimatedHours: 14,
    order: 2,
    prerequisitePathId: "fundamentals",
    practiceLinks: [{ label: "ScanMe Lab", to: paths.scanme, type: "scanme" }],
  },
  {
    id: "linux",
    title: "Linux for Cybersecurity",
    description:
      "Filesystem, permissions, processes, services, bash, SSH, logs, and security hardening on Linux.",
    level: "Beginner",
    skills: ["CLI navigation", "Permissions", "systemd", "Log analysis", "SSH"],
    estimatedHours: 12,
    order: 3,
    prerequisitePathId: "networking",
    practiceLinks: [
      { label: "Terminal Challenge", to: `${paths.games}/terminal-challenge`, type: "games" },
    ],
  },
  {
    id: "windows",
    title: "Windows Security Fundamentals",
    description:
      "Windows architecture, NTFS, Event Viewer, PowerShell, Defender, firewall, and Active Directory concepts.",
    level: "Intermediate",
    skills: ["Event logs", "NTFS ACLs", "PowerShell", "AD basics", "Windows Defender"],
    estimatedHours: 10,
    order: 4,
    prerequisitePathId: "linux",
    practiceLinks: [],
  },
  {
    id: "web-security",
    title: "Web Security",
    description:
      "HTTP, sessions, injection, XSS, CSRF, IDOR, security headers, OWASP Top 10, and secure coding.",
    level: "Intermediate",
    skills: ["OWASP Top 10", "Session security", "Input validation", "Security headers"],
    estimatedHours: 16,
    order: 5,
    prerequisitePathId: "networking",
    specialization: "Web Security",
    practiceLinks: [
      { label: "Vulnerable Lab", to: paths.vulnerableLab, type: "vulnerable-lab" },
    ],
  },
  {
    id: "forensics",
    title: "Digital Forensics",
    description:
      "Evidence handling, filesystems, metadata, timelines, hashing, chain of custody, and investigative methodology.",
    level: "Intermediate",
    skills: ["Chain of custody", "Disk imaging", "Timeline analysis", "Hash verification"],
    estimatedHours: 12,
    order: 6,
    prerequisitePathId: "linux",
    specialization: "Digital Forensics",
    practiceLinks: [],
  },
  {
    id: "soc",
    title: "Security Operations (SOC)",
    description:
      "SIEM, log analysis, alert triage, IOCs, incident response lifecycle, threat intelligence, and documentation.",
    level: "Intermediate",
    skills: ["SIEM", "Alert triage", "IR lifecycle", "Threat intelligence"],
    estimatedHours: 14,
    order: 7,
    prerequisitePathId: "networking",
    specialization: "SOC Analyst",
    practiceLinks: [],
  },
  {
    id: "osint",
    title: "OSINT Fundamentals",
    description:
      "Open-source intelligence techniques, legal boundaries, domain research, verification, and ethical investigation.",
    level: "Intermediate",
    skills: ["Search operators", "DNS research", "Source verification", "Ethical OSINT"],
    estimatedHours: 8,
    order: 8,
    prerequisitePathId: "fundamentals",
    specialization: "OSINT",
    practiceLinks: [],
  },
  {
    id: "nmap",
    title: "Nmap & Network Reconnaissance",
    description:
      "Authorized scanning, port states, service detection, Nmap output interpretation, and safe recon methodology.",
    level: "Intermediate",
    skills: ["Nmap", "Port scanning", "Service enumeration", "Authorized recon"],
    estimatedHours: 10,
    order: 9,
    prerequisitePathId: "networking",
    specialization: "Network Recon",
    practiceLinks: [{ label: "ScanMe Lab", to: paths.scanme, type: "scanme" }],
  },
];

export const roadmapSpecializations = [
  "SOC Analyst",
  "Digital Forensics",
  "OSINT",
  "Web Security",
  "Threat Intelligence",
  "Incident Response",
] as const;

/** Maps roadmap specialization labels to learning path IDs. */
export const roadmapSpecPathMap: Record<(typeof roadmapSpecializations)[number], string> = {
  "SOC Analyst": "soc",
  "Digital Forensics": "forensics",
  OSINT: "osint",
  "Web Security": "web-security",
  "Threat Intelligence": "soc",
  "Incident Response": "soc",
};

export function getPathMeta(id: string): LearningPathMeta | undefined {
  return learningPathMeta.find((p) => p.id === id);
}
