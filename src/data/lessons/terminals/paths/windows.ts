import { cmd, h, lab, prefix, step, WINDOWS_SCENARIO } from "../helpers";

const WIN = {
  ...WINDOWS_SCENARIO,
  banner: "Windows security lab — simulated host. Paths use forward slashes for compatibility.",
};

export const windowsTerminals = {
  "windows-architecture": lab(
    "Windows architecture lab",
    "Map user profile layout to the architecture concepts you just read — where configs, documents, and system files live.",
    WIN,
    [
      step(
        "whoami",
        "Print the account running this session.",
        "Every investigation starts with context: which user (and therefore which privileges) you are operating under.",
        [h("Concept", "User mode processes run under your account unless elevated."), h("Command", "whoami")],
        [cmd("whoami")],
      ),
      step(
        "dir-profile",
        "List folders in your user profile (Desktop, Documents).",
        "Windows stores per-user data under C:\\Users\\<name> — a common place to find scripts, downloads, and persistence.",
        [h("Concept", "AppData subfolders often hide malware; Documents holds exports and logs."), h("Command", "dir")],
        [prefix("dir"), prefix("ls")],
      ),
      step(
        "type-notes",
        "Read Desktop/notes.txt — a triage checklist tying architecture to action.",
        "The Registry and services you read about in the lesson manifest as files, logs, and startup locations during real triage.",
        [h("Syntax", "type is the cmd equivalent of Linux cat."), h("Command", "type Desktop/notes.txt")],
        [prefix("type Desktop")],
        "You connected architecture (users, logs, services) to concrete paths on disk.",
      ),
    ],
  ),

  "windows-users-groups": lab(
    "Users and groups lab",
    "Confirm identity context before interpreting permissions or event logs.",
    WIN,
    [
      step(
        "whoami",
        "Display the current username.",
        "SIDs and group memberships attach to this account name — UAC may mean you are not fully elevated even as an admin.",
        [h("Command", "whoami")],
        [cmd("whoami")],
      ),
      step(
        "type-notes",
        "Read the triage checklist on the Desktop.",
        "Built-in groups like Administrators and Remote Desktop Users grant rights without custom code.",
        [h("Command", "type Desktop/notes.txt")],
        [prefix("type Desktop")],
      ),
      step(
        "dir",
        "List profile directories — each user on the system has an isolated profile tree.",
        "Shared local Administrator passwords across machines are a common privilege-escalation path (use LAPS in production).",
        [h("Command", "dir")],
        [prefix("dir")],
      ),
    ],
  ),

  "windows-ntfs-permissions": lab(
    "NTFS permissions lab",
    "Successful file reads imply your token has the needed ACL rights.",
    WIN,
    [
      step(
        "type-notes",
        "Read Desktop/notes.txt — if this succeeds, your token has Read permission on the file.",
        "NTFS uses DACL entries (Allow/Deny ACEs). Deny often overrides Allow — design ACLs carefully.",
        [h("Concept", "Share permissions and NTFS permissions combine on SMB — most restrictive wins."),
         h("Command", "type Desktop/notes.txt")],
        [prefix("type Desktop")],
      ),
      step(
        "dir-docs",
        "List Documents — sensitive exports often land here with weak ACLs in real incidents.",
        [h("Command", "dir Documents")],
        [prefix("dir Documents"), prefix("dir")],
      ),
      step(
        "type-events",
        "Read Documents/security-events.txt — log exports require appropriate ACLs too.",
        "Auditors hunt world-readable folders containing passwords, backups, or GPP XML files.",
        [h("Command", "type Documents/security-events.txt")],
        [prefix("type Documents/security")],
      ),
    ],
  ),

  "windows-processes-services": lab(
    "Processes and services lab",
    "Review checklist items that map to running code on the system.",
    WIN,
    [
      step(
        "type-notes",
        "Read the triage checklist — note step 3 about services and Registry Run keys.",
        "Malware persists via services (SCM) and Run keys; Task Manager and Get-Process show user-mode processes.",
        [h("Concept", "Kernel drivers (.sys) load into ring 0 — compromise there equals full system compromise."),
         h("Command", "type Desktop/notes.txt")],
        [prefix("type Desktop")],
      ),
      step(
        "whoami",
        "Confirm whether you are running as a standard user or elevated admin before terminating processes.",
        "Killing lsass.exe or random 'svchost.exe' without analysis can crash the system or destroy evidence.",
        [h("Command", "whoami")],
        [cmd("whoami")],
      ),
    ],
  ),

  "windows-event-viewer": lab(
    "Event Viewer lab",
    "Locate exported security events analysts review in Event Viewer.",
    WIN,
    [
      step(
        "dir-docs",
        "List Documents to find exported log files.",
        "Event Viewer reads live .evtx files; analysts export logs for tickets and legal hold.",
        [h("Command", "dir Documents")],
        [prefix("dir Documents")],
      ),
      step(
        "type-events",
        "Open the readable security event export.",
        "Focus on Log Name, Event ID, Account Name, and Source Network Address fields.",
        [h("Command", "type Documents/security-events.txt")],
        [prefix("type Documents/security")],
      ),
    ],
  ),

  "windows-event-logs": lab(
    "Event log analysis lab",
    "Identify failed and successful logons from simulated Security events.",
    WIN,
    [
      step(
        "type-events",
        "Read Documents/security-events.txt.",
        "Security log analysis is a core Windows defensive skill — the same events appear in SIEM after forwarding.",
        [h("Command", "type Documents/security-events.txt")],
        [prefix("type Documents/security")],
      ),
      step(
        "grep-4625",
        "Search the export for Event ID 4625 (failed logon).",
        "4625 entries reveal brute-force sources; pair with 4624 (success) to spot compromise.",
        [h("Concept", "Logon Type 10 indicates RDP — common in lateral movement."),
         h("Command", "grep 4625 Documents/security-events.txt")],
        [prefix("grep 4625")],
      ),
      step(
        "grep-4624",
        "Search for Event ID 4624 (successful logon).",
        "Success after many 4625 events is a classic escalation pattern worth immediate containment.",
        [h("Command", "grep 4624 Documents/security-events.txt")],
        [prefix("grep 4624")],
        "You correlated failure and success events — the same workflow SOC analysts use daily.",
      ),
    ],
  ),

  "windows-powershell-fundamentals": lab(
    "PowerShell fundamentals lab",
    "Use PowerShell-style commands to read files and confirm identity.",
    WIN,
    [
      step(
        "whoami",
        "whoami works identically in cmd and PowerShell.",
        [h("Command", "whoami")],
        [cmd("whoami")],
      ),
      step(
        "get-content",
        "Read Desktop/notes.txt with Get-Content (alias: type, cat).",
        "PowerShell cmdlets return objects; Get-Content is the first step before Select-String filtering.",
        [h("Syntax", "Get-Content path — or type path in cmd."), h("Command", "Get-Content Desktop/notes.txt")],
        [prefix("get-content"), prefix("type Desktop")],
      ),
      step(
        "grep-rdp",
        "Filter security-events.txt for RDP-related logon type (Type 10).",
        "Select-String on real systems; grep works in this lab for the same filtering idea.",
        [h("Command", "grep Logon Type: 10 Documents/security-events.txt")],
        [prefix("grep Logon")],
      ),
    ],
  ),

  "windows-defender": lab(
    "Defender and EDR lab",
    "Connect endpoint protection to observable log and checklist artifacts.",
    WIN,
    [
      step(
        "type-notes",
        "Read the triage checklist — Defender/EDR complements log review, not replaces it.",
        "On production systems: Get-MpThreatDetection lists recent detections.",
        [h("Command", "type Desktop/notes.txt")],
        [prefix("type Desktop")],
      ),
      step(
        "grep-failed",
        "Find failed logon 4625 events — brute force may precede malware execution Defender catches.",
        [h("Command", "grep 4625 Documents/security-events.txt")],
        [prefix("grep 4625")],
      ),
    ],
  ),

  "windows-firewall": lab(
    "Windows Firewall lab",
    "Review network-related artifacts: hosts file and failed remote logons.",
    WIN,
    [
      step(
        "type-hosts",
        "Read the hosts file — static mappings can bypass DNS or point to C2 if tampered.",
        "Get-NetFirewallRule lists rules on real systems; hosts file shows local overrides.",
        [h("Command", "type Windows/System32/drivers/etc/hosts")],
        [prefix("type Windows/System32")],
      ),
      step(
        "grep-source-ip",
        "Find the source IP in security-events.txt for failed RDP attempts.",
        "Firewall blocks should target confirmed malicious sources — validate before blocking.",
        [h("Command", "grep 203.0.113.44 Documents/security-events.txt")],
        [prefix("grep 203")],
      ),
    ],
  ),

  "windows-active-directory": lab(
    "Active Directory concepts lab",
    "Relate centralized identity to logon events and profile paths.",
    WIN,
    [
      step(
        "whoami",
        "On domain-joined hosts, whoami shows DOMAIN\\user — here you see the local lab account.",
        "AD stores users/groups centrally; Kerberos tickets prove authentication without sending passwords repeatedly.",
        [h("Command", "whoami")],
        [cmd("whoami")],
      ),
      step(
        "grep-logon",
        "Review successful logon events — domain logons appear in Security logs with domain account names.",
        [h("Command", "grep 4624 Documents/security-events.txt")],
        [prefix("grep 4624")],
      ),
      step(
        "dir",
        "List profile folders — AD users may have roaming profiles and GPO-applied settings under Users.",
        [h("Command", "dir")],
        [prefix("dir")],
        "Central identity (AD) + local artifacts (profiles, logs) = standard enterprise triage scope.",
      ),
    ],
  ),
};
