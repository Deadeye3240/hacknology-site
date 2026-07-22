import type { ScanMeLevel } from "./types";

export const scanMeLevels: ScanMeLevel[] = [
  {
    id: "fundamentals",
    order: 1,
    title: "Nmap Fundamentals",
    description: "What Nmap is, basic scanning, and reading port states.",
  },
  {
    id: "service-detection",
    order: 2,
    title: "Service Detection",
    description: "Identify software and versions behind open ports.",
  },
  {
    id: "port-scanning",
    order: 3,
    title: "Port Scanning",
    description: "Target single ports, lists, and ranges.",
  },
  {
    id: "all-ports",
    order: 4,
    title: "All Ports",
    description: "Discover services hidden outside the default scan.",
  },
  {
    id: "os-detection",
    order: 5,
    title: "OS Detection",
    description: "Fingerprint the remote operating system.",
  },
  {
    id: "combining",
    order: 6,
    title: "Combining Parameters",
    description: "Stack options you have already learned.",
  },
  {
    id: "advanced",
    order: 7,
    title: "Advanced Parameters",
    description: "Specialized scan types, timing, and output.",
  },
];

export function getScanMeLevel(id: string): ScanMeLevel | undefined {
  return scanMeLevels.find((l) => l.id === id);
}
