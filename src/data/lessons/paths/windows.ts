import { createLesson, mcQuiz, tfQuiz } from "../lessonFactory";

const PATH = "windows";

export const windowsLessons = [
  createLesson({
    id: "windows-architecture",
    pathId: PATH,
    order: 1,
    title: "Windows Architecture",
    summary:
      "Kernel, user mode, services, Registry, and the object manager — how Windows organizes code, data, and security boundaries.",
    objectives: [
      "Distinguish kernel mode from user mode and why it matters for security",
      "Describe the role of services, drivers, and the Registry",
      "Identify common locations for configs, logs, and executables",
    ],
    introduction:
      "Windows is not 'Linux with a GUI.' It uses a hybrid kernel, ACL-based security from the ground up, and a central Registry instead of scattered /etc files. Attackers and defenders both need this map: where persistence lives, which processes run as SYSTEM, and how privileges flow from logon to child processes.",
    coreConcepts: [
      "Kernel mode (ring 0) runs the OS core and drivers; user mode (ring 3) runs applications — crossing the boundary is tightly controlled.",
      "Services are long-running processes managed by the Service Control Manager (services.msc / sc.exe).",
      "The Registry stores configuration in hives (HKLM, HKCU, HKU, etc.) as keys and values.",
      "Win32 API is the primary interface; .NET and PowerShell sit above it.",
      "Important paths: %SystemRoot%\\System32, Program Files, ProgramData, Users\\<name>\\AppData.",
    ],
    explanation:
      "When you log on, Winlogon creates a session and launches explorer.exe in your user context. Services like lsass.exe (credential handling) run as SYSTEM. Drivers (.sys) load into kernel — a compromised driver equals full system compromise. The Registry hive HKLM\\SOFTWARE holds machine-wide app settings; HKCU is per-user. WOW64 redirects 32-bit apps on 64-bit Windows. Understanding this stack helps you interpret Task Manager, Process Explorer, and EDR telemetry.",
    realWorld:
      "Ransomware enumerates volumes and shadow copies via kernel and backup APIs. Rootkits historically hooked kernel structures. IT deploys Group Policy from domain controllers into Registry and file system. Forensics images NTFS volumes and Registry hives for timeline analysis.",
    scenario:
      "Malware persists via a Registry Run key and a service. Name the two architectural components involved and which runs in kernel vs user mode.",
    practical: [
      {
        kind: "code",
        title: "Architecture inspection",
        content:
          "systeminfo\nsc query type= service state= all\nreg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\nwhere.exe powershell",
      },
    ],
    terms: [
      { term: "SCM", definition: "Service Control Manager — starts, stops, and configures Windows services." },
      { term: "Hive", definition: "Top-level Registry container (e.g. HKEY_LOCAL_MACHINE) backed by files on disk." },
      { term: "SYSTEM account", definition: "Built-in account with highest local privileges, used by many services." },
      { term: "LSASS", definition: "Local Security Authority Subsystem Service — handles authentication and stores credentials in memory." },
    ],
    mistakes: [
      "Treating Program Files x86 as the only install location — malware hides in AppData and Temp.",
      "Editing Registry without backup — can brick boot or logon.",
      "Assuming GUI tools show everything — attackers use living-off-the-land binaries.",
    ],
    defensive: [
      "Enable Credential Guard and virtualization-based security on supported hardware.",
      "Restrict driver loading with WDAC or similar policies where feasible.",
      "Baseline services and Run keys; monitor with EDR and GPO.",
    ],
    quiz: [
      mcQuiz(
        "win-arch-q1",
        "Kernel mode code runs with:",
        ["Standard user rights only", "Highest privilege and direct hardware access", "No access to memory", "Guest-only rights"],
        1,
        "Kernel mode is privileged; bugs here are critical.",
      ),
      mcQuiz(
        "win-arch-q2",
        "The Registry on Windows primarily stores:",
        ["Only passwords", "Configuration and system settings", "Video drivers only", "DNS cache exclusively"],
        1,
        "Registry hives hold OS and application configuration.",
      ),
      tfQuiz(
        "win-arch-q3",
        "Windows services are typically managed by the Service Control Manager.",
        true,
        "SCM starts services at boot and on demand per configuration.",
      ),
    ],
  }),

  createLesson({
    id: "windows-users-groups",
    pathId: PATH,
    order: 2,
    title: "Users and Groups",
    summary:
      "Local accounts, built-in groups, UAC, and how security identifiers (SIDs) represent identity on Windows.",
    objectives: [
      "Explain local users, groups, and built-in privileged accounts",
      "Describe User Account Control and split tokens",
      "Relate SIDs to permissions and logon sessions",
    ],
    introduction:
      "Every thread has a security context: user SID, group SIDs, and privilege set. Administrators are not always fully elevated — UAC splits the token until you approve elevation. Attackers hunt for local admin, service accounts with SeDebugPrivilege, and misconfigured group memberships.",
    coreConcepts: [
      "Local users and groups managed via lusrmgr.msc, net user, net localgroup.",
      "Built-in groups: Administrators, Users, Remote Desktop Users, Backup Operators — each grants specific rights.",
      "SID is the immutable identifier; renaming Administrator does not change SID.",
      "UAC prompts for consent or credentials when elevated rights are needed.",
      "Logon types: interactive, network, service, batch, remote interactive (RDP).",
    ],
    explanation:
      "Standard users get a medium-integrity token. Right-click 'Run as administrator' produces a high-integrity elevated token linked to the same session. LSASS creates access tokens at logon. Network logons (SMB) use different credentials than interactive desktop. Domain environments add Active Directory accounts on top of local SAM. Well-known SIDs like S-1-5-32-544 identify the Administrators group.",
    realWorld:
      "Pass-the-hash abuses NTLM material from LSASS. Help desk adds users to local Administrators 'temporarily' — persistence for years. Service accounts should be gMSAs or dedicated low-privilege accounts, not domain admin.",
    scenario:
      "A user in Remote Desktop Users but not Administrators RDPs in. Can they install software machine-wide? Explain using groups and UAC.",
    terms: [
      { term: "SID", definition: "Security Identifier — unique string identifying users and groups." },
      { term: "UAC", definition: "User Account Control — prompts and splits tokens to limit silent elevation." },
      { term: "Token", definition: "Object describing security context of a process or thread." },
    ],
    mistakes: [
      "Disabling UAC entirely for convenience.",
      "Using shared local Administrator password across fleet (LAPS exists to fix this).",
      "Granting Everyone or Users write access to program directories.",
    ],
    defensive: [
      "Least privilege; separate admin accounts; enforce LAPS on local admin.",
      "Audit privileged group membership changes.",
      "Require MFA for RDP and admin tools.",
    ],
    quiz: [
      mcQuiz(
        "win-ug-q1",
        "UAC primarily aims to:",
        ["Speed up boot", "Prevent silent privilege escalation", "Disable networking", "Encrypt disks"],
        1,
        "UAC forces explicit approval before many elevated operations.",
      ),
      tfQuiz(
        "win-ug-q2",
        "Renaming the Administrator account changes its SID.",
        false,
        "SID is assigned at creation; display name changes do not alter SID.",
      ),
      mcQuiz(
        "win-ug-q3",
        "Which built-in group typically has full local control?",
        ["Guests", "Users", "Administrators", "Performance Log Users"],
        2,
        "The Administrators group has broad local machine rights.",
      ),
    ],
  }),

  createLesson({
    id: "windows-ntfs-permissions",
    pathId: PATH,
    order: 3,
    title: "NTFS Permissions",
    summary:
      "ACLs, inheritance, share vs NTFS permissions, and effective access on files and folders.",
    objectives: [
      "Read ACL entries: allow, deny, principal, and rights",
      "Explain inheritance and how parent folder ACLs flow to children",
      "Combine share and NTFS permissions to determine effective access",
    ],
    introduction:
      "NTFS uses discretionary access control lists (DACLs) on every file and folder. Unlike simple Unix triples, Windows ACLs can have many ACEs (Access Control Entries) with granular rights. Share permissions add another layer on network access. Misconfigured ACLs leak backups, scripts with passwords, and GPO preferences.",
    coreConcepts: [
      "DACL lists who is allowed or denied specific rights (read, write, modify, full control).",
      "Deny ACEs often override allow — use sparingly; prefer removing allow.",
      "Inheritance propagates ACLs to child objects; broken inheritance creates exceptions.",
      "Share permissions (Everyone Read) AND NTFS permissions both apply — most restrictive wins.",
      "icacls and Get-Acl set/view ACLs from CLI; takeown and icacls /grant for recovery.",
    ],
    explanation:
      "Full Control includes change permissions — powerful on sensitive folders. CREATOR OWNER special principal affects new files by the creating user. Listing folder contents vs read data are distinct rights. SYSVOL on domain controllers must be readable for GPP but writable only by admins — mis-ACLs exposed cpassword in the past. EFS encrypts per-user; recovery agents needed.",
    realWorld:
      "Ransomware needs write access to user documents — not always admin. Pentesters hunt world-readable web.config with connection strings. IT breaks inheritance on HR folders. Auditors run access reviews with effective permissions tab.",
    scenario:
      "A share grants Everyone Change. NTFS grants Users Read on the same folder. What can a domain user do over the network?",
    practical: [
      {
        kind: "code",
        title: "ACL inspection",
        content:
          "icacls C:\\Shares\\Finance\nGet-Acl C:\\Shares\\Finance | Format-List\nicacls C:\\Shares\\Finance /inheritance:r /grant:r \"CORP\\Finance:(OI)(CI)M\"",
      },
    ],
    terms: [
      { term: "DACL", definition: "Discretionary ACL — list of ACEs defining allowed and denied access." },
      { term: "ACE", definition: "Access Control Entry — one allow or deny rule for a principal." },
      { term: "Inheritance", definition: "Automatic propagation of parent ACLs to child files and folders." },
    ],
    mistakes: [
      "Using Everyone Full Control on data shares.",
      "Deny ACEs that break expected admin access in complex ways.",
      "Forgetting share AND NTFS both apply on SMB paths.",
    ],
    defensive: [
      "Role-based folders with least privilege; audit ACL changes.",
      "Protect credential files, backups, and script directories.",
      "Use Access-Denied Assistance logging and centralized share reviews.",
    ],
    quiz: [
      mcQuiz(
        "win-ntfs-q1",
        "For SMB access, effective permission is generally:",
        ["Share only", "NTFS only", "Most restrictive of share and NTFS", "Always Full Control"],
        2,
        "Both layers apply; the combination yields the effective limit.",
      ),
      tfQuiz(
        "win-ntfs-q2",
        "Deny ACEs should be used carefully because they can override allows.",
        true,
        "Explicit deny often takes precedence and complicates troubleshooting.",
      ),
      mcQuiz(
        "win-ntfs-q3",
        "Which tool displays or modifies NTFS ACLs from the command line?",
        ["ping", "icacls", "ipconfig", "nslookup"],
        1,
        "icacls is the standard CLI for NTFS ACL management.",
      ),
    ],
  }),

  createLesson({
    id: "windows-processes-services",
    pathId: PATH,
    order: 4,
    title: "Processes and Services",
    summary:
      "Task Manager, Process Explorer, services.msc, sc.exe, and identifying malicious or misconfigured execution.",
    objectives: [
      "List processes and identify parent-child relationships",
      "Start, stop, and query Windows services safely",
      "Correlate services with accounts, binaries, and network connections",
    ],
    introduction:
      "Windows processes host everything from explorer.exe to svchost.exe bundles. Services run without an interactive desktop — often as SYSTEM or Network Service. Attackers create services for persistence; defenders baseline expected binaries and command lines.",
    coreConcepts: [
      "Task Manager and Process Explorer show CPU, memory, command line, and integrity level.",
      "services.msc GUI; sc query, sc start, sc stop for CLI.",
      "svchost.exe hosts multiple DLL services — inspect via tasklist /svc or Get-Service.",
      "WMI and scheduled tasks also launch processes — not only services.",
      "Process creation logs (4688) record parent, image, and command line when auditing enabled.",
    ],
    explanation:
      "Legitimate services have ImagePath pointing to signed binaries under System32. Malware registers ImagePath to Temp or Users folders. sc create BadSvc binPath= \"C:\\evil.exe\" starts at boot if set to auto. Process Explorer 'Verify Signatures' highlights unsigned images. Network tab in resmon links PIDs to connections. Protected Process Light (PPL) guards lsass and defenders.",
    realWorld:
      "Cobalt Strike spawns beacon from rundll32 or svchost injection. IT stops Print Spooler service during PrintNightmare mitigation. EDR kills malicious trees and quarantines binaries. IR isolates host while collecting memory.",
    scenario:
      "You see a service AutoSvc running C:\\Users\\Public\\update.exe as LocalSystem. List three investigative steps and one containment action.",
    practical: [
      {
        kind: "code",
        title: "Process and service queries",
        content:
          "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10\nGet-Service | Where-Object Status -eq 'Running'\nsc qc AutoSvc\ntasklist /svc /fi \"PID eq 1234\"",
      },
    ],
    terms: [
      { term: "ImagePath", definition: "Registry value specifying executable path for a Windows service." },
      { term: "svchost", definition: "Shared service host process running one or more service DLLs." },
      { term: "PPL", definition: "Protected Process Light — anti-tamper protection for critical processes like LSASS." },
    ],
    mistakes: [
      "Killing lsass.exe or critical system processes causing logoff or crash.",
      "Trusting process name alone — malware names itself svchost.exe in wrong paths.",
      "Leaving malicious services in 'Stopped' state without deleting registry entries.",
    ],
    defensive: [
      "Enable command-line process auditing (4688) with command line inclusion.",
      "Application allowlisting (WDAC/AppLocker) on servers where possible.",
      "Regular service baseline comparison across fleet.",
    ],
    quiz: [
      mcQuiz(
        "win-ps-q1",
        "Windows services are configured primarily under Registry paths like:",
        ["HKLM\\SYSTEM\\CurrentControlSet\\Services", "HKCU\\Software\\Games", "HKLM\\SAM\\Passwords", "HKU\\.Default\\Run"],
        0,
        "Service definitions live under CurrentControlSet\\Services.",
      ),
      mcQuiz(
        "win-ps-q2",
        "svchost.exe is used to:",
        ["Host multiple shared services in one or more processes", "Replace PowerShell", "Encrypt NTFS", "Manage DNS only"],
        0,
        "Many Windows services run as DLLs inside svchost.exe instances.",
      ),
      tfQuiz(
        "win-ps-q3",
        "A service running as LocalSystem has very high local privileges.",
        true,
        "LocalSystem is the most privileged local service account.",
      ),
    ],
  }),

  createLesson({
    id: "windows-event-viewer",
    pathId: PATH,
    order: 5,
    title: "Event Viewer",
    summary:
      "The mmc snap-in for Windows logs — navigating channels, filters, custom views, and investigative workflow.",
    objectives: [
      "Open and navigate Windows Event Viewer log channels",
      "Apply filters by event ID, time, and source",
      "Create custom views for recurring security investigations",
    ],
    introduction:
      "Event Viewer is the GUI front end to Windows logging infrastructure. Security analysts use it for quick triage before SIEM correlation. Knowing where Security, System, Application, and operational channels live saves time during RDP investigations on endpoints without EDR console access.",
    coreConcepts: [
      "Event Viewer (eventvwr.msc) organizes logs under Windows Logs and Applications and Services.",
      "Security log records logon, policy change, object access (when auditing on).",
      "System log records service failures, driver issues, patch events.",
      "Filter Current Log narrows by Event ID, level, user, computer.",
      "Custom Views save filter combinations for reuse across machines.",
    ],
    explanation:
      "Double-click an event for details XML tab shows structured data. Attach Task To This Event automates response (use carefully). Forwarded events appear when WEF configured. Log full? Increase size or forward to collector. Right-click Security → Properties to set max size and retention. Operational channels like Microsoft-Windows-Sysmon/Operational hold Sysmon data.",
    realWorld:
      "Tier-1 sorts failed logons (4625) in Event Viewer before escalating. Help desk checks Application log for app crashes vs malware. Custom view 'RDP Logons' filters 4624 Type 10. Forensics exports evtx for offline parsing.",
    scenario:
      "User reports unexpected reboot. Which two log channels and event types do you check first?",
    practical: [
      {
        kind: "code",
        title: "Launch and filter",
        content:
          "eventvwr.msc\n# PowerShell equivalent filter example:\nGet-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 50",
      },
    ],
    terms: [
      { term: "Channel", definition: "Named log container (e.g. Security, System) storing related events." },
      { term: "EVTX", definition: "Binary format file storing Windows event log records." },
      { term: "WEF", definition: "Windows Event Forwarding — sends events to central collector." },
    ],
    mistakes: [
      "Clearing Security logs during investigation — destroys evidence and alerts attackers.",
      "Ignoring Application and Sysmon channels when Security is empty.",
      "Not increasing log size on critical systems — oldest events roll off.",
    ],
    defensive: [
      "Forward Security and Sysmon logs to SIEM with tamper detection.",
      "Create standard custom views for SOC tier-1 playbooks.",
      "Protect log configuration via GPO; restrict who can clear logs.",
    ],
    quiz: [
      mcQuiz(
        "win-ev-q1",
        "Failed logon attempts are typically recorded in:",
        ["Security log", "Setup log", "Hardware Events only", "Internet Explorer log"],
        0,
        "Authentication success and failure events are in the Security channel.",
      ),
      tfQuiz(
        "win-ev-q2",
        "Custom Views in Event Viewer save filter criteria for repeated use.",
        true,
        "Custom Views persist filters like specific Event IDs or sources.",
      ),
      mcQuiz(
        "win-ev-q3",
        "Event Viewer files on disk commonly use extension:",
        [".txt", ".evtx", ".json", ".pcap"],
        1,
        "Windows event logs are stored in EVTX format.",
      ),
    ],
  }),

  createLesson({
    id: "windows-event-logs",
    pathId: PATH,
    order: 6,
    title: "Windows Event Logs",
    summary:
      "Key Event IDs, logon types, auditing policy, Sysmon, and building detection from Windows telemetry.",
    objectives: [
      "Interpret high-value Security Event IDs for investigations",
      "Configure auditing to generate needed evidence",
      "Describe how Sysmon augments built-in logs",
    ],
    introduction:
      "Event IDs are the vocabulary of Windows detection. 4624/4625 tell authentication stories; 4688 reveals process creation; 4672 marks special privileges assigned. Without auditing and retention, attacks leave no local trail. With Sysmon and proper forwarding, defenders gain nearly Linux-grade visibility.",
    coreConcepts: [
      "4624 successful logon; 4625 failure; Logon Type 2 interactive, 3 network, 10 RDP.",
      "4672 admin privileges assigned to new logon.",
      "4688 process creation — enable Include command line in policy.",
      "4720 user created; 4732 member added to security-enabled group.",
      "Sysmon Event ID 1 process create, 3 network, 11 file create — rich schema.",
    ],
    explanation:
      "Enable Advanced Audit Policy via GPO or auditpol.exe. Logon events include IpAddress and WorkstationName — watch for NTLM from unexpected IPs. 4648 explicit credentials used. PowerShell operational log 4104 script block when enabled. Chain 4625 bursts → 4624 success → 4688 suspicious parent → 4672 as attack story. SIEM normalizes vendor-specific fields.",
    realWorld:
      "Golden ticket and pass-the-hash show unusual 4624 Type 3 with same security ID. Ransomware triggers thousands of 4663 file access if object auditing on. MITRE mappings reference Windows Event IDs in detection rules.",
    scenario:
      "At 03:00, Event ID 4624 Type 10 from foreign IP, then 4688 powershell.exe -enc .... Which earlier events might have warned you?",
    terms: [
      { term: "Logon Type", definition: "Numeric field describing how authentication occurred (interactive, network, service, etc.)." },
      { term: "Advanced Audit Policy", definition: "Granular auditing categories replacing legacy basic audit settings." },
      { term: "Sysmon", definition: "Microsoft Sysinternals service logging detailed process, network, and file events." },
    ],
    mistakes: [
      "Auditing everything on busy DCs without sizing logs — performance and noise.",
      "4688 without command line — misses half the context.",
      "Ignoring Logon Type when investigating 'user logged in at night'.",
    ],
    defensive: [
      "Deploy Sysmon with tuned SwiftOnSecurity or similar baseline.",
      "Centralize logs; alert on 4720, 4732, 4698, 7045 new service.",
      "Tune brute-force thresholds on 4625.",
    ],
    quiz: [
      mcQuiz(
        "win-el-q1",
        "Event ID 4625 indicates:",
        ["Successful logon", "Failed logon", "Service start", "Firewall block"],
        1,
        "4625 is failed account logon in the Security log.",
      ),
      mcQuiz(
        "win-el-q2",
        "Logon Type 10 typically represents:",
        ["Batch job", "Remote Interactive (RDP)", "Service", "Cached unlock"],
        1,
        "Type 10 is RemoteInteractive — common for RDP sessions.",
      ),
      tfQuiz(
        "win-el-q3",
        "Sysmon can log process creation with command-line arguments.",
        true,
        "Sysmon Event ID 1 includes command line and hashes when configured.",
      ),
    ],
  }),

  createLesson({
    id: "windows-powershell-fundamentals",
    pathId: PATH,
    order: 7,
    title: "PowerShell Fundamentals",
    summary:
      "Cmdlets, pipeline, Get-Help, execution policy, and secure use of PowerShell for administration and hunting.",
    objectives: [
      "Run basic PowerShell cmdlets and use the pipeline",
      "Find documentation with Get-Help and Get-Command",
      "Understand execution policy and logging implications for security",
    ],
    introduction:
      "PowerShell is the default automation shell on Windows — and a favorite living-off-the-land tool for attackers (download cradles, credential dumping wrappers, lateral movement). Defenders use the same shell to hunt, configure, and respond. Fluency separates script-kiddie IOC matching from effective endpoint triage.",
    coreConcepts: [
      "Cmdlets are Verb-Noun (Get-Process, Set-Service); objects pass through pipeline, not just text.",
      "Get-Help Get-Process -Examples; Get-Command *Service* discovers cmdlets.",
      "Execution policy (Restricted, RemoteSigned, Bypass) is not a security boundary — it limits casual script running.",
      "Script block logging (4104) and transcription record admin and attacker activity.",
      "Use -Filter parameters and Get-WinEvent, Get-ChildItem, Invoke-WebRequest responsibly.",
    ],
    explanation:
      "Get-Process | Where-Object CPU -gt 100 sorts hot processes. Get-ChildItem -Recurse -Include *.exe scans folders. Attackers: powershell -enc <base64> or IEX (New-Object Net.WebClient).DownloadString. Constrained Language Mode and JEA limit cmdlet exposure on jump servers. PowerShell 7+ is cross-platform; Windows PowerShell 5.1 still dominant on servers.",
    realWorld:
      "SOC hunts Unusual PowerShell command lines in EDR. IT deploys DSC and remoting for fleet config. Attackers disable logging via registry — monitor ProtectedEventLogging settings. AMSI inspects script content in memory for many scenarios.",
    scenario:
      "You find powershell.exe parent winword.exe with -enc argument. Name two log sources and one containment step.",
    practical: [
      {
        kind: "code",
        title: "PowerShell basics",
        content:
          "Get-Help about_Pipelines -ShowWindow\nGet-Service | Where-Object Status -eq 'Running'\nGet-WinEvent -LogName Security -MaxEvents 5\nGet-ChildItem $env:USERPROFILE\\Downloads -Filter *.exe",
      },
    ],
    terms: [
      { term: "Cmdlet", definition: "PowerShell built-in command implementing a specific function." },
      { term: "Pipeline", definition: "Passing output objects from one cmdlet as input to the next via |." },
      { term: "AMSI", definition: "Antimalware Scan Interface — scans scripts at runtime for malicious content." },
    ],
    mistakes: [
      "Assuming Restricted execution policy stops determined attackers.",
      "Running untrusted scripts without reading content.",
      "Using Invoke-Expression on user input.",
    ],
    defensive: [
      "Enable script block logging and transcription via GPO.",
      "Deploy PowerShell 7 with logging; constrain admin workstations.",
      "Alert on encoded commands and download cradles.",
    ],
    quiz: [
      mcQuiz(
        "win-psh-q1",
        "PowerShell cmdlets follow which naming pattern?",
        ["Noun-Verb", "Verb-Noun", "Random names", "Unix only"],
        1,
        "Approved verbs precede nouns: Get-Process, Set-Item.",
      ),
      tfQuiz(
        "win-psh-q2",
        "Execution policy alone is insufficient to stop malicious PowerShell.",
        true,
        "Bypass flags and -enc one-liners circumvent policy; use logging and controls.",
      ),
      mcQuiz(
        "win-psh-q3",
        "Get-Help is used to:",
        ["Delete logs", "Display cmdlet documentation", "Format disks", "Change passwords only"],
        1,
        "Get-Help shows syntax, parameters, and examples for cmdlets.",
      ),
    ],
  }),

  createLesson({
    id: "windows-defender",
    pathId: PATH,
    order: 8,
    title: "Windows Defender",
    summary:
      "Microsoft Defender Antivirus, real-time protection, signatures, cloud delivery, and Defender for Endpoint concepts.",
    objectives: [
      "Describe components of Windows built-in antimalware",
      "Check protection status and run scans via GUI and PowerShell",
      "Explain cloud-delivered protection and attack surface reduction rules",
    ],
    introduction:
      "Windows Defender Antivirus (now part of Windows Security) provides baseline antimalware on every Windows 10/11 system. Enterprise adds Defender for Endpoint for EDR telemetry, automated investigation, and threat intelligence. Disabling or excluding everything defeats the purpose — tune exclusions surgically.",
    coreConcepts: [
      "Real-time protection scans files and behavior; cloud protection queries Microsoft intelligence.",
      "MpCmdRun.exe and Update-MpSignature refresh definitions; Get-MpComputerStatus shows state.",
      "Quarantine holds detected samples; restore only after analysis.",
      "Attack Surface Reduction (ASR) rules block Office macros, child processes, etc.",
      "Tamper Protection prevents unauthorized disabling of Defender settings.",
    ],
    explanation:
      "Defender integrates with AMSI for PowerShell and macros. Controlled folder access blocks unauthorized ransomware writes to protected directories. Network protection blocks known bad URLs via SmartScreen integration. MDE sensor sends process, file, and network events to cloud portal for hunting. Excessive exclusions on %ProgramData% or Temp are common attacker targets.",
    realWorld:
      "Ransomware groups enumerate Get-MpComputerStatus and set registry disables before payload. IT deploys ASR via Intune or GPO. False positives on dev tools require signed-path exclusions, not broad folder bypass.",
    scenario:
      "Malware sets DisableRealtimeMonitoring via registry. Which Defender feature resists this on current builds?",
    practical: [
      {
        kind: "code",
        title: "Defender status",
        content:
          "Get-MpComputerStatus | Select-Object AMServiceEnabled, AntispywareEnabled, RealTimeProtectionEnabled\nUpdate-MpSignature\nStart-MpScan -ScanType QuickScan",
      },
    ],
    terms: [
      { term: "ASR", definition: "Attack Surface Reduction — optional rules blocking risky behaviors." },
      { term: "EDR", definition: "Endpoint Detection and Response — continuous monitoring and response beyond signatures." },
      { term: "Tamper Protection", definition: "Defender feature blocking unauthorized changes to security settings." },
    ],
    mistakes: [
      "Disabling Defender because 'it slows builds' without compensating controls.",
      "Wildcard exclusions on entire drives.",
      "Ignoring MDE alerts because 'Defender is free so it must be noisy'.",
    ],
    defensive: [
      "Keep Tamper Protection on; manage via Intune/GPO not local disable.",
      "Enable ASR rules in audit then block mode.",
      "Integrate MDE with SIEM for high-fidelity alerts.",
    ],
    quiz: [
      mcQuiz(
        "win-wd-q1",
        "Get-MpComputerStatus reports:",
        ["DNS cache", "Antimalware protection state", "Wi-Fi passwords", "Printer drivers"],
        1,
        "This cmdlet summarizes Defender component status.",
      ),
      tfQuiz(
        "win-wd-q2",
        "Tamper Protection helps prevent malware from turning off real-time protection.",
        true,
        "Tamper Protection guards critical Defender settings from unauthorized change.",
      ),
      mcQuiz(
        "win-wd-q3",
        "Attack Surface Reduction rules aim to:",
        ["Increase macro execution", "Block risky behaviors like suspicious child processes", "Disable logging", "Open all firewall ports"],
        1,
        "ASR rules mitigate common attack techniques at the OS level.",
      ),
    ],
  }),

  createLesson({
    id: "windows-firewall",
    pathId: PATH,
    order: 9,
    title: "Windows Firewall",
    summary:
      "Profiles, inbound/outbound rules, wf.msc, netsh advfirewall, and network segmentation on Windows hosts.",
    objectives: [
      "Explain Domain, Private, and Public firewall profiles",
      "Create and audit inbound and outbound rules",
      "Use PowerShell and netsh to inspect firewall configuration",
    ],
    introduction:
      "Windows Defender Firewall with Advanced Security filters traffic per profile. Default inbound block on Public protects laptops on coffee-shop Wi‑Fi. Servers need explicit allow rules for RDP, HTTP, or app ports. Attackers add allow rules for backdoors; defenders baseline rule sets per role.",
    coreConcepts: [
      "Profiles: Domain (corporate network), Private (home/trusted), Public (untrusted) — each has separate rule set.",
      "Inbound rules control connections to the host; outbound control leaving traffic (often permissive by default).",
      "wf.msc advanced GUI; netsh advfirewall show allprofiles; New-NetFirewallRule in PowerShell.",
      "Rules match program, port, protocol, scope (IP), interface type.",
      "IPsec policies can encrypt or restrict traffic beyond simple allow/block.",
    ],
    explanation:
      "Allow RDP 3389 only from jump subnet, not 0.0.0.0/0. Block outbound SMB to internet to limit lateral spread tools. Group Policy deploys centralized rules. Windows filters both IPv4 and IPv6 — do not forget v6 exposure. Application rules tie to executable path — renaming binary bypasses unless hash-based WDAC used.",
    realWorld:
      "Ransomware spreads via SMB — egress block contains worms. Pentest finds SQL Server exposed because admin disabled firewall 'temporarily'. Zero Trust pushes host firewall plus cloud policy.",
    scenario:
      "A laptop on Public Wi‑Fi has file sharing allowed. Which profile and rule change fixes this?",
    practical: [
      {
        kind: "code",
        title: "Firewall inspection",
        content:
          "Get-NetFirewallProfile | Select-Object Name, Enabled\nGet-NetFirewallRule -Direction Inbound -Enabled True | Select-Object DisplayName, Action\nnetsh advfirewall show currentprofile",
      },
    ],
    terms: [
      { term: "Profile", definition: "Firewall context (Domain/Private/Public) selected by network location awareness." },
      { term: "Inbound rule", definition: "Policy for connections initiated toward the local host." },
      { term: "Scope", definition: "IP addresses or subnets to which a firewall rule applies." },
    ],
    mistakes: [
      "Turning firewall off globally for troubleshooting and leaving it off.",
      "Allowing Any-Any rules 'just to make it work'.",
      "Ignoring outbound rules on compromised hosts exfiltrating data.",
    ],
    defensive: [
      "GPO baseline: block inbound by default on Public; minimal allows per server role.",
      "Log blocked connections where SIEM can ingest.",
      "Review rule changes during incident response.",
    ],
    quiz: [
      mcQuiz(
        "win-fw-q1",
        "The Public firewall profile is intended for:",
        ["Trusted corporate LAN only", "Untrusted networks like public Wi‑Fi", "Domain controllers only", "Disabled systems"],
        1,
        "Public profile applies stricter defaults on untrusted networks.",
      ),
      mcQuiz(
        "win-fw-q2",
        "Which cmdlet creates a new firewall rule in PowerShell?",
        ["New-NetFirewallRule", "Add-DnsClient", "Format-Volume", "Stop-Computer"],
        0,
        "New-NetFirewallRule is the standard PowerShell interface.",
      ),
      tfQuiz(
        "win-fw-q3",
        "Inbound firewall rules control traffic initiated from remote hosts toward the local machine.",
        true,
        "Inbound rules govern connections targeting the host.",
      ),
    ],
  }),

  createLesson({
    id: "windows-active-directory",
    pathId: PATH,
    order: 10,
    title: "Active Directory Concepts",
    summary:
      "Domains, forests, OUs, GPO, Kerberos, and why AD is the crown jewel in enterprise Windows security.",
    objectives: [
      "Define domain, forest, OU, and trust relationships at a high level",
      "Explain Kerberos authentication vs NTLM",
      "Describe Group Policy and common AD attack paths defenders harden against",
    ],
    introduction:
      "Active Directory is Microsoft's directory service for enterprises — accounts, groups, computers, and policy in one replicated database. Domain Admins own the kingdom. Most large-scale Windows breaches target AD: Kerberoasting, pass-the-hash, Golden Ticket, DCShadow. You do not need to be a domain admin on day one, but you must understand what they protect.",
    coreConcepts: [
      "Forest contains one or more domains; domains share a schema and trust boundaries within forest.",
      "Organizational Units (OUs) organize objects; delegate admin per OU.",
      "Domain Controllers (DCs) authenticate and replicate AD via LDAP, Kerberos, DNS SRV records.",
      "Group Policy Objects (GPO) push settings to users and computers.",
      "Kerberos tickets prove identity; NTLM is legacy challenge-response — prefer Kerberos, protect DCs.",
    ],
    explanation:
      "User logs on → workstation requests TGT from DC → Kerberos grants service tickets for file shares and SQL. SPNs tie services to accounts — Kerberoast offline-cracks service account passwords if weak. NTLM hashes replay in pass-the-hash without cracking. Tiered Admin Model separates domain admin from workstation admin. LDAP queries enumerate users and groups (BloodHound maps paths).",
    realWorld:
      "SolarWinds and countless ransomware ops prioritize DA compromise. MFA on privileged accounts, Protected Users group, and LAPS reduce blast radius. Regular AD hygiene: stale accounts, excessive Domain Admin membership, unconstrained delegation.",
    scenario:
      "A helpdesk account can modify membership of Server Admins group. Explain why this is a path to Domain Admin and one mitigation.",
    terms: [
      { term: "DC", definition: "Domain Controller — hosts AD and authenticates security principals." },
      { term: "GPO", definition: "Group Policy Object — collection of settings applied to AD-linked OUs." },
      { term: "Kerberos TGT", definition: "Ticket Granting Ticket — proves identity to DC for requesting service tickets." },
      { term: "SPN", definition: "Service Principal Name — identifies a service instance for Kerberos authentication." },
    ],
    mistakes: [
      "Treating Domain Admin as daily driver account.",
      "Leaving unconstrained Kerberos delegation enabled on old servers.",
      "Ignoring AD replication and backup — DC recovery is disaster recovery.",
    ],
    defensive: [
      "Tiered administration; PAW for domain admin tasks; MFA everywhere on priv accounts.",
      "Audit privileged groups; deploy Defender for Identity anomalies.",
      "Use gMSA for services; strong passwords on SPN accounts.",
    ],
    quiz: [
      mcQuiz(
        "win-ad-q1",
        "Active Directory primarily provides:",
        ["GPU drivers", "Centralized identity, policy, and authentication", "Web hosting only", "Linux package management"],
        1,
        "AD is the enterprise directory and authentication backbone for Windows domains.",
      ),
      mcQuiz(
        "win-ad-q2",
        "Kerberos is preferred over NTLM because:",
        ["It is older", "It uses ticket-based mutual authentication with less credential exposure on the wire", "It disables firewalls", "It removes need for DNS"],
        1,
        "Kerberos limits repeated password-equivalent exposure compared to legacy NTLM patterns.",
      ),
      tfQuiz(
        "win-ad-q3",
        "Group Policy can enforce security settings across many computers in a domain.",
        true,
        "GPOs linked to sites, domains, or OUs apply settings to targeted objects.",
      ),
    ],
  }),
];
