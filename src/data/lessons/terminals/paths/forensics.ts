import { cmd, h, lab, FORENSICS_SCENARIO, prefix, step } from "../helpers";

export const forensicsTerminals = {
  "forensics-digital-evidence": lab(
    "Digital evidence lab",
    "Navigate evidence storage without modifying original files.",
    FORENSICS_SCENARIO,
    [
      step("pwd", "Document starting location in chain-of-custody notes.",
        [h("Command", "pwd")], [cmd("pwd")]),
      step("cd-evidence", "Move to /evidence read-only share.",
        [h("Command", "cd /evidence")], [cmd("cd /evidence")]),
      step("ls", "List evidence files — inventory before analysis.",
        [h("Command", "ls")], [prefix("ls")]),
    ],
  ),

  "forensics-evidence-handling": lab(
    "Evidence handling lab",
    FORENSICS_SCENARIO,
    [
      step("cat-case", "Read case-notes.txt — document every access.",
        [h("Command", "cat case-notes.txt")], [cmd("cat case-notes.txt")]),
      step("cd-evidence", "Access evidence only from designated path.",
        [h("Command", "cd /evidence")], [cmd("cd /evidence")]),
      step("cat-image", "View disk-image.dd label — never write to original image.",
        [h("Command", "cat disk-image.dd")], [cmd("cat disk-image.dd")]),
    ],
  ),

  "forensics-file-systems": lab(
    "Filesystem forensics lab",
    FORENSICS_SCENARIO,
    [
      step("cd-evidence", "Enter evidence directory.",
        [h("Command", "cd /evidence")], [cmd("cd /evidence")]),
      step("ls-l", "List files with metadata — inode/MFT concepts apply on real images.",
        [h("Command", "ls -l")], [cmd("ls -l"), cmd("ls -la")]),
      step("find", "Find browser artifact by name.",
        [h("Command", "find /evidence -name browser")], [prefix("find")]),
    ],
  ),

  "forensics-metadata": lab(
    "Metadata lab",
    FORENSICS_SCENARIO,
    [
      step("cat-meta", "Read file-metadata.txt for hash and timestamps.",
        [h("Command", "cat /evidence/file-metadata.txt")], [cmd("cat /evidence/file-metadata.txt"), prefix("cat file-metadata")]),
      step("head-browser", "Preview browser history CSV header.",
        [h("Command", "head /evidence/browser-history.csv")], [prefix("head")]),
    ],
  ),

  "forensics-file-timestamps": lab(
    "Timestamps lab",
    FORENSICS_SCENARIO,
    [
      step("cat-meta", "Note Created timestamp in metadata file.",
        [h("Command", "cat /evidence/file-metadata.txt")], [prefix("cat file-metadata")]),
      step("cat-browser", "Browser CSV has UTC timestamps — normalize time zones in cases.",
        [h("Command", "cat /evidence/browser-history.csv")], [prefix("cat browser")]),
    ],
  ),

  "forensics-logs-evidence": lab(
    "Log evidence lab",
    FORENSICS_SCENARIO,
    [
      step("cd-var-log", "Navigate to /var/log for system events.",
        [h("Command", "cd /var/log")], [cmd("cd /var/log")]),
      step("cat-auth", "Auth logs show user actions near incident time.",
        [h("Command", "cat auth.log")], [cmd("cat auth.log")]),
      step("grep-sudo", "Grep sudo usage — privilege escalation indicator.",
        [h("Command", "grep sudo auth.log")], [prefix("grep sudo")]),
    ],
  ),

  "forensics-browser-artifacts": lab(
    "Browser artifacts lab",
    FORENSICS_SCENARIO,
    [
      step("cat-browser", "Read browser-history.csv for visited URLs.",
        [h("Command", "cat /evidence/browser-history.csv")], [cmd("cat /evidence/browser-history.csv"), prefix("cat browser")]),
      step("grep-malware", "Grep for suspicious domain in history.",
        [h("Command", "grep malware /evidence/browser-history.csv")], [prefix("grep malware")]),
    ],
  ),

  "forensics-memory-concepts": lab(
    "Memory forensics lab",
    FORENSICS_SCENARIO,
    [
      step("ps", "Running processes snapshot — memory forensics captures this live.",
        [h("Command", "ps")], [prefix("ps")]),
      step("ss", "Network connections from memory dump analysis tools.",
        [h("Command", "ss -tulpn")], [prefix("ss")]),
      step("echo", 'Echo: Volatility extracts processes from RAM images.',
        [h("Command", 'echo "memory forensics with Volatility"')], [prefix("echo")]),
    ],
  ),

  "forensics-disk-imaging": lab(
    "Disk imaging lab",
    FORENSICS_SCENARIO,
    [
      step("cd-evidence", "Access evidence share.",
        [h("Command", "cd /evidence")], [cmd("cd /evidence")]),
      step("cat-image", "Verify image file present — hash before and after acquisition.",
        [h("Command", "cat disk-image.dd")], [cmd("cat disk-image.dd")]),
      step("cat-meta", "Compare hash in metadata file to acquisition log.",
        [h("Command", "cat file-metadata.txt")], [cmd("cat file-metadata.txt")]),
    ],
  ),

  "forensics-timeline-hashing": lab(
    "Timeline and hashing lab",
    FORENSICS_SCENARIO,
    [
      step("cat-meta", "Extract MD5 hash from metadata.",
        [h("Command", "cat /evidence/file-metadata.txt")], [prefix("cat file-metadata")]),
      step("cat-browser", "Build timeline from browser CSV timestamps.",
        [h("Command", "cat /evidence/browser-history.csv")], [prefix("cat browser")]),
      step("grep-download", "Isolate download event on timeline.",
        [h("Command", "grep download /evidence/browser-history.csv")], [prefix("grep download")],
        "Hash verifies integrity; timestamps order events — core forensic workflow."),
    ],
  ),
};
