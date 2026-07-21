import type { Lesson, PathAssessment } from "@/types/education";
import { createPathAssessment, mcQuiz, tfQuiz } from "./lessonFactory";
import { fundamentalsLessons } from "./paths/fundamentals";
import { networkingLessons } from "./paths/networking";
import { linuxLessons } from "./paths/linux";
import { windowsLessons } from "./paths/windows";
import { webSecurityLessons, webSecurityAssessment } from "./paths/web-security";
import { forensicsLessons, forensicsAssessment } from "./paths/forensics";
import { socLessons, socAssessment } from "./paths/soc";
import { osintLessons, osintAssessment } from "./paths/osint";
import { nmapLessons } from "./paths/nmap";

export const lessons: Lesson[] = [
  ...fundamentalsLessons,
  ...networkingLessons,
  ...linuxLessons,
  ...windowsLessons,
  ...webSecurityLessons,
  ...forensicsLessons,
  ...socLessons,
  ...osintLessons,
  ...nmapLessons,
].sort((a, b) => a.order - b.order || a.pathId.localeCompare(b.pathId));

export const fundamentalsAssessment = createPathAssessment(
  "fundamentals",
  "Cybersecurity Fundamentals — Final Assessment",
  [
    mcQuiz(
      "f-a1",
      "Which pillar of the CIA triad ensures data has not been altered without authorization?",
      ["Confidentiality", "Integrity", "Availability", "Authentication"],
      1,
      "Integrity protects against unauthorized modification.",
    ),
    tfQuiz(
      "f-a2",
      "Risk can be reduced to zero if enough security controls are deployed.",
      false,
      "Residual risk always remains; controls reduce likelihood or impact.",
    ),
    mcQuiz(
      "f-a3",
      "What is the primary purpose of MFA?",
      ["Faster login", "Proof of identity using multiple factors", "Encrypt passwords", "Replace firewalls"],
      1,
      "MFA requires two or more independent factors to verify identity.",
    ),
    mcQuiz(
      "f-a4",
      "Which attack targets human psychology rather than technical flaws?",
      ["Buffer overflow", "Social engineering", "ARP spoofing", "SQL injection"],
      1,
      "Social engineering manipulates people into breaking security procedures.",
    ),
    mcQuiz(
      "f-a5",
      "Defense in depth means:",
      ["One strong perimeter firewall", "Layered controls so failure of one does not mean total compromise", "Air-gapping all systems", "Disabling unused ports only"],
      1,
      "Multiple independent layers limit blast radius when one control fails.",
    ),
  ],
);

export const networkingAssessment = createPathAssessment(
  "networking",
  "Networking Fundamentals — Final Assessment",
  [
    mcQuiz(
      "n-a1",
      "Which layer of the OSI model does HTTP operate at?",
      ["Layer 3", "Layer 4", "Layer 7", "Layer 2"],
      2,
      "HTTP is an application-layer (Layer 7) protocol.",
    ),
    mcQuiz(
      "n-a2",
      "Port 443 typically indicates which service?",
      ["HTTP", "HTTPS", "FTP", "SSH"],
      1,
      "HTTPS commonly uses TCP port 443.",
    ),
    tfQuiz(
      "n-a3",
      "UDP provides guaranteed delivery and ordering.",
      false,
      "UDP is connectionless and does not guarantee delivery.",
    ),
    mcQuiz(
      "n-a4",
      "DNS primarily translates:",
      ["IP to MAC", "Domain names to IP addresses", "Ports to services", "Emails to users"],
      1,
      "DNS resolves human-readable names to IP addresses.",
    ),
    mcQuiz(
      "n-a5",
      "A stateful firewall primarily:",
      ["Encrypts traffic", "Tracks connection state for filtering decisions", "Scans malware", "Assigns IP addresses"],
      1,
      "Stateful firewalls track sessions to allow return traffic appropriately.",
    ),
  ],
);

export const linuxAssessment = createPathAssessment(
  "linux",
  "Linux for Cybersecurity — Final Assessment",
  [
    mcQuiz(
      "l-a1",
      "In ls -l output, what does 'x' permission allow on a file?",
      ["Write", "Execute", "Read", "Delete"],
      1,
      "Execute permission allows running a file as a program.",
    ),
    mcQuiz(
      "l-a2",
      "Which command shows listening ports on Linux?",
      ["ls", "ss -tulpn", "chmod", "grep"],
      1,
      "ss -tulpn lists TCP/UDP listening sockets with processes.",
    ),
    tfQuiz(
      "l-a3",
      "Root (UID 0) can bypass all file permission checks on Linux.",
      true,
      "The root user has full privileges unless restricted by MAC frameworks.",
    ),
    mcQuiz(
      "l-a4",
      "SSH keys are preferred over passwords because:",
      ["They are shorter", "They provide stronger cryptographic authentication", "They work without a network", "They disable logging"],
      1,
      "Key-based auth uses public-key cryptography and resists brute force better than passwords.",
    ),
  ],
);

export const windowsAssessment = createPathAssessment(
  "windows",
  "Windows Security — Final Assessment",
  [
    mcQuiz(
      "w-a1",
      "Which tool is the primary GUI for viewing Windows security logs?",
      ["Task Manager", "Event Viewer", "Registry Editor", "Disk Management"],
      1,
      "Event Viewer displays Windows Event Logs including security events.",
    ),
    mcQuiz(
      "w-a2",
      "NTFS permissions are:",
      ["Only for network shares", "Access control lists on files and folders", "Antivirus rules", "Firewall profiles"],
      1,
      "NTFS uses ACLs to control access to files and directories.",
    ),
    tfQuiz(
      "w-a3",
      "Active Directory is primarily an identity and access management service.",
      true,
      "AD provides centralized authentication, authorization, and directory services.",
    ),
    mcQuiz(
      "w-a4",
      "Windows Defender is:",
      ["A backup tool", "Built-in antimalware protection", "A VPN client", "A log aggregator"],
      1,
      "Windows Defender provides endpoint antimalware capabilities.",
    ),
  ],
);

export const nmapAssessment = createPathAssessment(
  "nmap",
  "Nmap & Reconnaissance — Final Assessment",
  [
    mcQuiz(
      "m-a1",
      "Before scanning any host you do not own, you must:",
      ["Use -T5 for speed", "Obtain explicit written authorization", "Scan only UDP", "Disable logging"],
      1,
      "Unauthorized scanning may be illegal; always get permission.",
    ),
    mcQuiz(
      "m-a2",
      "An Nmap 'open' port means:",
      ["Filtered by firewall", "A service is accepting connections", "Host is down", "Port is closed"],
      1,
      "Open indicates the port accepts TCP connections or UDP probes.",
    ),
    tfQuiz(
      "m-a3",
      "Service version detection (-sV) helps identify software and versions on open ports.",
      true,
      "-sV probes open ports to determine service and version information.",
    ),
    mcQuiz(
      "m-a4",
      "SYN scan (-sS) is often called a:",
      ["Connect scan", "Stealth/half-open scan", "UDP flood", "Ping sweep only"],
      1,
      "SYN scan sends SYN and analyzes responses without completing the handshake.",
    ),
  ],
);

export const pathAssessments: Record<string, PathAssessment> = {
  fundamentals: fundamentalsAssessment,
  networking: networkingAssessment,
  linux: linuxAssessment,
  windows: windowsAssessment,
  "web-security": webSecurityAssessment,
  forensics: forensicsAssessment,
  soc: socAssessment,
  osint: osintAssessment,
  nmap: nmapAssessment,
};

export function getLessonsByPath(pathId: string): Lesson[] {
  return lessons
    .filter((l) => l.pathId === pathId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((l) => l.id === lessonId);
}

export function lessonCountForPath(pathId: string): number {
  return getLessonsByPath(pathId).length;
}

export function estimatedMinutesForPath(pathId: string): number {
  return getLessonsByPath(pathId).reduce((sum, l) => sum + l.estimatedMinutes, 0);
}

export function getPathAssessment(pathId: string): PathAssessment | undefined {
  return pathAssessments[pathId];
}
