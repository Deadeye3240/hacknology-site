import type { Resource } from "@/types";

/**
 * Curated links to reputable, external cybersecurity resources.
 *
 * Descriptions are short and original — no external content is reproduced. To
 * add a resource, append an entry here; no UI changes are required.
 */
export const resources: Resource[] = [
  {
    id: "hacker101",
    name: "Hacker101",
    description:
      "Free educational videos and guided content covering web security fundamentals for newcomers.",
    category: "Learning Platforms",
    website: "https://www.hacker101.com",
    resourceLink: "https://www.hacker101.com/videos",
  },
  {
    id: "portswigger-academy",
    name: "PortSwigger Web Security Academy",
    description:
      "Free, structured web security training with hands-on labs maintained by the makers of Burp Suite.",
    category: "Learning Platforms",
    website: "https://portswigger.net/web-security",
  },
  {
    id: "tryhackme",
    name: "TryHackMe",
    description:
      "A learning platform offering guided, beginner-friendly rooms across a range of security topics.",
    category: "Learning Platforms",
    website: "https://tryhackme.com",
  },
  {
    id: "owasp",
    name: "OWASP",
    description:
      "A nonprofit foundation producing open documentation, tools, and guidance for improving software security.",
    category: "Documentation",
    website: "https://owasp.org",
    resourceLink: "https://owasp.org/www-project-top-ten/",
  },
  {
    id: "owasp-cheat-sheets",
    name: "OWASP Cheat Sheet Series",
    description:
      "Concise, practical guidance on secure implementation for a wide range of application security topics.",
    category: "Documentation",
    website: "https://cheatsheetseries.owasp.org",
  },
  {
    id: "nist-csf",
    name: "NIST Cybersecurity Framework",
    description:
      "A voluntary framework of standards and best practices to help organizations manage cybersecurity risk.",
    category: "Security Frameworks",
    website: "https://www.nist.gov/cyberframework",
  },
  {
    id: "mitre-attack",
    name: "MITRE ATT&CK",
    description:
      "A globally accessible knowledge base of adversary tactics and techniques used to strengthen defenses.",
    category: "Security Frameworks",
    website: "https://attack.mitre.org",
  },
  {
    id: "cis-controls",
    name: "CIS Controls",
    description:
      "A prioritized set of safeguards to mitigate the most common cyber attacks against systems and networks.",
    category: "Security Frameworks",
    website: "https://www.cisecurity.org/controls",
  },
  {
    id: "reddit-netsec",
    name: "Reddit — r/netsec",
    description:
      "A community for sharing and discussing technical network and information security content.",
    category: "Communities",
    website: "https://www.reddit.com/r/netsec/",
  },
  {
    id: "security-stackexchange",
    name: "Information Security Stack Exchange",
    description:
      "A question-and-answer community for information security professionals and enthusiasts.",
    category: "Communities",
    website: "https://security.stackexchange.com",
  },
  {
    id: "practical-malware-analysis",
    name: "Practical Malware Analysis",
    description:
      "A well-regarded introductory book on the concepts and techniques behind analyzing malicious software.",
    category: "Books",
    website: "https://nostarch.com/malware",
  },
  {
    id: "the-tangled-web",
    name: "The Tangled Web",
    description:
      "A book exploring the security model of modern web browsers and how to build safer web applications.",
    category: "Books",
    website: "https://nostarch.com/tangledweb",
  },
  {
    id: "picoctf",
    name: "picoCTF",
    description:
      "A beginner-friendly capture-the-flag platform with educational challenges created for students.",
    category: "CTF Platforms",
    website: "https://picoctf.org",
  },
  {
    id: "hacker101-ctf",
    name: "Hacker101 CTF",
    description:
      "A free capture-the-flag environment that pairs with Hacker101's educational material.",
    category: "CTF Platforms",
    website: "https://ctf.hacker101.com",
  },
  {
    id: "ctftime",
    name: "CTFtime",
    description:
      "A hub that tracks capture-the-flag competitions, teams, and event schedules around the world.",
    category: "CTF Platforms",
    website: "https://ctftime.org",
  },
];
