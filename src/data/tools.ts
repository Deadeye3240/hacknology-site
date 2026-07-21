import type { Tool } from "@/types";

/**
 * Curated, educational reference of well-known security tools.
 *
 * This is an informational reference only — Hacknology does not execute any of
 * these tools. Descriptions are short and original. To add a tool, append an
 * entry here; no UI changes are required.
 */
export const tools: Tool[] = [
  {
    id: "wireshark",
    name: "Wireshark",
    description:
      "A widely used network protocol analyzer for capturing and inspecting traffic to understand how protocols behave.",
    category: "Network Analysis",
    platforms: ["Windows", "macOS", "Linux"],
    skillLevel: "Beginner",
    website: "https://www.wireshark.org",
    documentation: "https://www.wireshark.org/docs/",
  },
  {
    id: "nmap",
    name: "Nmap",
    description:
      "A network discovery and inventory utility used to map hosts and services on networks you are authorized to assess.",
    category: "Network Analysis",
    platforms: ["Windows", "macOS", "Linux"],
    skillLevel: "Intermediate",
    website: "https://nmap.org",
    documentation: "https://nmap.org/book/man.html",
  },
  {
    id: "owasp-zap",
    name: "OWASP ZAP",
    description:
      "An open-source web application security scanner maintained by OWASP, useful for learning about web testing concepts.",
    category: "Web Security",
    platforms: ["Windows", "macOS", "Linux"],
    skillLevel: "Intermediate",
    website: "https://www.zaproxy.org",
    documentation: "https://www.zaproxy.org/docs/",
  },
  {
    id: "burp-suite",
    name: "Burp Suite",
    description:
      "An integrated platform for web security testing, commonly used to inspect and understand HTTP traffic during authorized assessments.",
    category: "Web Security",
    platforms: ["Windows", "macOS", "Linux"],
    skillLevel: "Advanced",
    website: "https://portswigger.net/burp",
    documentation: "https://portswigger.net/burp/documentation",
  },
  {
    id: "kali-linux",
    name: "Kali Linux",
    description:
      "A Linux distribution that bundles many security and forensics tools, often used as a learning and testing environment.",
    category: "System Administration",
    platforms: ["Linux"],
    skillLevel: "Intermediate",
    website: "https://www.kali.org",
    documentation: "https://www.kali.org/docs/",
  },
  {
    id: "sysmon",
    name: "Sysmon",
    description:
      "A Windows system monitoring service that logs detailed events, giving defenders valuable visibility for detections.",
    category: "Monitoring",
    platforms: ["Windows"],
    skillLevel: "Intermediate",
    website: "https://learn.microsoft.com/sysinternals/downloads/sysmon",
    documentation:
      "https://learn.microsoft.com/sysinternals/downloads/sysmon",
  },
  {
    id: "cyberchef",
    name: "CyberChef",
    description:
      "A browser-based tool for encoding, decoding, and analyzing data — handy for understanding data transformations.",
    category: "Digital Forensics",
    platforms: ["Web"],
    skillLevel: "Beginner",
    website: "https://gchq.github.io/CyberChef/",
    documentation: "https://github.com/gchq/CyberChef/wiki",
  },
];
