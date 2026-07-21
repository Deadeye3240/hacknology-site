import {
  createLesson,
  createPathAssessment,
  mcQuiz,
  tfQuiz,
} from "../lessonFactory";

const PATH = "forensics";

export const forensicsLessons = [
  createLesson({
    id: "forensics-digital-evidence",
    pathId: PATH,
    order: 1,
    title: "Digital Evidence",
    summary:
      "What counts as digital evidence, how it differs from physical evidence, and why admissibility depends on integrity and provenance.",
    objectives: [
      "Define digital evidence and common sources",
      "Explain volatility and collection priority",
      "Relate evidence quality to investigative outcomes",
    ],
    introduction:
      "Digital evidence is any information stored or transmitted in binary form that may prove or disprove a fact in an investigation. Unlike a fingerprint on glass, digital artifacts are easily copied, modified, or destroyed. Investigators must understand what constitutes evidence, where it lives, and how courts evaluate whether it was collected and handled properly.",
    coreConcepts: [
      "Digital evidence includes files, logs, registry hives, network captures, cloud objects, and mobile backups.",
      "Volatility orders collection: RAM and live connections disappear on power-off; disk persists longer.",
      "Integrity requires demonstrating the evidence was not altered after seizure.",
      "Provenance documents who collected what, when, from which system, using which tools.",
      "Evidence must be relevant, authentic, and collected lawfully to be useful in legal proceedings.",
    ],
    explanation:
      "When a laptop is seized, potential evidence spans multiple layers: browser history in SQLite databases, email in PST files, encrypted containers, cloud-synced folders, and USB connection artifacts in the registry. Each artifact answers different questions — who logged in, what was downloaded, which external device was attached. Investigators prioritize volatile data first (memory, active connections), then powered-on disk imaging, then powered-off acquisitions. Every action — mounting a drive read-write, opening a file with the wrong tool, or booting from the suspect's disk — can change timestamps or content and undermine the case. Documentation begins at first contact: case number, investigator name, device serial, date/time, and hash values of acquired images.",
    realWorld:
      "Cases have been dismissed when prosecutors could not prove a forensic image was unchanged since acquisition. Conversely, well-documented hash-verified images with chain of custody have supported convictions in fraud, insider threat, and harassment investigations.",
    scenario:
      "A manager reports a stolen customer spreadsheet. IT provides a USB drive 'found near the printer.' Before plugging it into your analysis workstation, what must you document and why?",
    practical: [
      {
        kind: "command",
        title: "Verify image integrity",
        content:
          "sha256sum evidence.img\n# Compare output to hash recorded at acquisition time",
      },
    ],
    terms: [
      { term: "Digital evidence", definition: "Data stored or transmitted electronically that may prove facts in an investigation or legal proceeding." },
      { term: "Volatility", definition: "How quickly data may be lost — RAM is highly volatile; archived tape is not." },
      { term: "Provenance", definition: "Documented origin and handling history of a piece of evidence." },
      { term: "Authenticity", definition: "Confidence that evidence is what it purports to be and is unaltered." },
    ],
    mistakes: [
      "Analyzing original media instead of working from verified forensic copies.",
      "Failing to photograph or document device state before power-off.",
      "Assuming deleted means unrecoverable without attempting recovery on a copy.",
    ],
    defensive: [
      "Enable centralized logging and retention before incidents occur.",
      "Use write blockers and forensic boot environments for acquisitions.",
      "Maintain case management systems that tie every artifact to chain of custody.",
    ],
    quiz: [
      mcQuiz(
        "for-ev-q1",
        "Which is typically collected first due to volatility?",
        ["Archived tape backups", "Live RAM", "Optical media in storage", "Printed reports"],
        1,
        "RAM contents are lost on power loss and must be captured while the system runs.",
      ),
      tfQuiz(
        "for-ev-q2",
        "Working directly on original suspect media without imaging is forensically sound.",
        false,
        "Original media should be preserved; analysis uses verified copies.",
      ),
      mcQuiz(
        "for-ev-q3",
        "Hash values primarily help demonstrate:",
        ["Network speed", "Evidence integrity", "User password strength", "Disk manufacturer"],
        1,
        "Matching hashes before and after transfer prove the data did not change.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-evidence-handling",
    pathId: PATH,
    order: 2,
    title: "Evidence Handling",
    summary:
      "Chain of custody, write blockers, documentation standards, and legal constraints that govern every forensic touch.",
    objectives: [
      "Describe chain of custody and why gaps matter",
      "Apply write-blocking and imaging best practices",
      "Identify when legal authority is required before collection",
    ],
    introduction:
      "Evidence handling is the discipline that keeps digital findings defensible. A perfect forensic analysis fails in court if nobody can prove the USB drive analyzed is the same one seized from the suspect's desk. Chain of custody, proper tools, and clear notes transform technical findings into trustworthy proof.",
    coreConcepts: [
      "Chain of custody is a chronological record of every person who possessed evidence and what they did with it.",
      "Write blockers prevent accidental modification during disk access.",
      "Forensic imaging creates bit-for-bit copies, not simple file drag-and-drop.",
      "Collection requires legal authority appropriate to jurisdiction — warrant, consent, or policy.",
      "Packaging, labeling, and secure storage prevent loss, contamination, and tampering.",
    ],
    explanation:
      "When evidence arrives, log it: unique item ID, description, serial numbers, seal condition, receiving investigator, date/time. Imaging uses hardware or software write blockers so the OS cannot alter metadata. Tools like FTK Imager, dd, or vendor suites produce E01/RAW images with embedded hashes. Each transfer to another analyst gets a new chain entry. Analysis happens on the copy; the original stays sealed. If encryption is present, document whether keys were obtained lawfully. Remote collection from cloud tenants needs credentials, legal process, and API export logs. Mishandling — opening a phone without Faraday isolation, or syncing a cloud account that deletes local copies — can be challenged as spoliation.",
    realWorld:
      "Defense attorneys routinely challenge whether police imaged the correct drive or whether an analyst mounted evidence read-write. Enterprise HR investigations face similar scrutiny in wrongful termination suits if personal devices were searched without policy basis.",
    scenario:
      "You receive a laptop in a sealed bag. The seal is intact. List the first five steps from receipt to verified forensic image.",
    terms: [
      { term: "Chain of custody", definition: "Documented trail of evidence possession, transfer, and access from collection to disposition." },
      { term: "Write blocker", definition: "Device or software preventing write commands to protected media during acquisition." },
      { term: "Forensic image", definition: "Bit-level copy of storage media including slack space and unallocated clusters." },
      { term: "Spoliation", definition: "Destruction or alteration of evidence, whether intentional or negligent." },
    ],
    mistakes: [
      "Skipping hash verification after imaging.",
      "Using the suspect's user account to browse files on a live system.",
      "Incomplete chain entries when evidence moves between shifts.",
    ],
    defensive: [
      "Standardize intake forms and evidence lockers.",
      "Train all handlers on write-blocking before live analysis.",
      "Coordinate with legal counsel on scope of search and employee monitoring policies.",
    ],
    quiz: [
      mcQuiz(
        "for-eh-q1",
        "Chain of custody documents:",
        ["Only the final report", "Who handled evidence and when", "Suspect's alibi", "Antivirus signatures"],
        1,
        "Custody records prove continuous control and authorized access.",
      ),
      tfQuiz(
        "for-eh-q2",
        "A write blocker helps prevent accidental modification of source media during imaging.",
        true,
        "Blocking writes preserves original timestamps and content for court.",
      ),
      mcQuiz(
        "for-eh-q3",
        "Forensic imaging should produce:",
        ["A folder of copied documents only", "A bit-for-bit copy including unallocated space", "Screenshots of the desktop", "A list of filenames"],
        1,
        "Full images capture deleted and hidden data not visible in normal file copies.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-file-systems",
    pathId: PATH,
    order: 3,
    title: "File Systems",
    summary:
      "NTFS, ext4, APFS, and FAT — how operating systems organize data and what forensic artifacts they leave behind.",
    objectives: [
      "Compare major file system structures relevant to forensics",
      "Locate MFT, inodes, and journal concepts",
      "Explain how deletion works at the file system level",
    ],
    introduction:
      "File systems are the maps disks use to store and retrieve files. Forensic examiners read these maps — and their journals — to recover deleted content, reconstruct timelines, and spot anti-forensics. Understanding NTFS on Windows, ext4 on Linux, and APFS on modern Macs is essential for knowing where evidence hides.",
    coreConcepts: [
      "NTFS uses the Master File Table (MFT) with records for files, directories, and metadata.",
      "ext4 uses inodes and directory entries; the journal logs metadata transactions.",
      "APFS uses copy-on-write snapshots and encrypted volumes common on Apple devices.",
      "FAT/exFAT lack journaling — simpler but common on USB media.",
      "Deleting a file typically removes directory pointers, not immediate data overwrite.",
    ],
    explanation:
      "When Windows deletes a file, the MFT record may be marked unused and clusters marked free, but content often remains until overwritten. Tools parse $MFT, $LogFile, and $UsnJrnl for rename/delete activity. Linux ext4 journal replay helps after unclean shutdown. APFS snapshots can preserve older versions invisible to casual browsing. Forensic suites mount images read-only and parse structures automatically, but examiners must interpret results: a '$Recycle.Bin' path differs from secure wipe tools that overwrite clusters. Partition schemes (GPT vs MBR), BitLocker, and FileVault add encryption layers requiring keys or recovery credentials.",
    realWorld:
      "USB exfiltration cases often hinge on parsing MFT entries and link files showing which executables ran from removable media. Ransomware investigations examine journal corruption and shadow copies.",
    scenario:
      "A suspect 'deleted' budget.xlsx. The MFT record shows flag 0x00 (unused) but clusters are not overwritten. Can recovery succeed?",
    practical: [
      {
        kind: "command",
        title: "List partitions on an image",
        content: "mmls evidence.raw\n# Shows partition offsets for targeted filesystem analysis",
      },
    ],
    terms: [
      { term: "MFT", definition: "Master File Table — NTFS index of files with metadata and cluster locations." },
      { term: "Inode", definition: "Unix/Linux structure storing file metadata and data block pointers." },
      { term: "Journal", definition: "Log of file system metadata changes aiding recovery and timeline building." },
      { term: "Unallocated space", definition: "Disk areas not currently assigned to files — may contain deleted data." },
    ],
    mistakes: [
      "Assuming 'empty recycle bin' means data is gone.",
      "Ignoring alternate data streams on NTFS.",
      "Mounting encrypted volumes without capturing keys from memory when possible.",
    ],
    defensive: [
      "Use full-disk encryption with secure key management.",
      "Implement secure deletion policies for highly sensitive data.",
      "Monitor USB and cloud sync via endpoint tooling.",
    ],
    quiz: [
      mcQuiz(
        "for-fs-q1",
        "On NTFS, primary file metadata is stored in:",
        ["The BIOS", "The Master File Table", "DNS cache", "Browser cookies"],
        1,
        "MFT records describe files, sizes, timestamps, and cluster runs.",
      ),
      tfQuiz(
        "for-fs-q2",
        "Deleting a file usually removes directory references before overwriting file content.",
        true,
        "Data often remains in unallocated space until reused.",
      ),
      mcQuiz(
        "for-fs-q3",
        "APFS on modern Macs is notable for:",
        ["Lack of any metadata", "Copy-on-write and snapshots", "Being identical to FAT32", "Storing files only in RAM"],
        1,
        "APFS features snapshots and encryption integrated into the design.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-metadata",
    pathId: PATH,
    order: 4,
    title: "Metadata",
    summary:
      "EXIF, document properties, email headers, and file system metadata — hidden context that reveals origin and manipulation.",
    objectives: [
      "Identify common metadata types across files and media",
      "Interpret EXIF and Office document properties",
      "Recognize limitations and spoofing of metadata",
    ],
    introduction:
      "Metadata is data about data — camera model in a photo, author name in a Word doc, GPS coordinates in a JPEG, or creation time in the file system. Investigators use metadata to authenticate files, place devices at locations, and detect tampering. It can also mislead if misunderstood or forged.",
    coreConcepts: [
      "EXIF in images stores camera settings, timestamps, and sometimes GPS.",
      "Office PDFs retain author, revision, and embedded object history.",
      "Email headers trace routing hops, originating IPs, and SPF/DKIM results.",
      "File system MAC times (Modified, Accessed, Created) differ by OS and action.",
      "Metadata can be stripped, edited, or fabricated — corroborate with other sources.",
    ],
    explanation:
      "A photo's EXIF might show a Samsung phone captured the image at 14:32 UTC with GPS 40.7°N. A .docx is a ZIP of XML — parsing docProps/core.xml reveals creator and lastModifiedBy. Email Received headers build a path from sender MTA to recipient. MAC times on Windows behave differently than POSIX atime on Linux; copying files can reset some timestamps while preserving others. Tools like exiftool, pdfinfo, and forensic suites extract metadata in bulk. Defense may argue screenshots lack EXIF or that timestamps were changed with touch utilities — investigators seek independent corroboration (CCTV, login logs, hash-linked originals).",
    realWorld:
      "Leak investigations matched internal PDF metadata authors to suspects. Harassment cases used image GPS to disprove alibis. Counterfeit document cases compared font embedding metadata across versions.",
    scenario:
      "A leaked memo shows Author: J.Smith and CreateDate six months before the employee was hired. What investigative steps follow?",
    practical: [
      {
        kind: "command",
        title: "Extract image EXIF",
        content: "exiftool suspect-photo.jpg | grep -E 'Date|GPS|Model|Software'",
      },
    ],
    terms: [
      { term: "EXIF", definition: "Exchangeable image file format metadata embedded in JPEG and other image types." },
      { term: "MAC times", definition: "Modified, Accessed, Created timestamps associated with file system entries." },
      { term: "Document properties", definition: "Embedded fields in Office/PDF files describing author, title, and revision." },
    ],
    mistakes: [
      "Treating metadata as infallible proof without corroboration.",
      "Confusing file system times with EXIF capture times.",
      "Overlooking metadata in alternate streams or embedded objects.",
    ],
    defensive: [
      "Strip sensitive EXIF before publishing external images.",
      "Use DLP to flag documents with identifying metadata leaving the org.",
      "Train staff that 'remove visible name' does not remove all metadata.",
    ],
    quiz: [
      mcQuiz(
        "for-meta-q1",
        "EXIF data is commonly found in:",
        ["Plain text .txt files", "JPEG photographs", "Empty folders", "ARP tables"],
        1,
        "Cameras and phones embed EXIF in many image formats.",
      ),
      tfQuiz(
        "for-meta-q2",
        "Metadata timestamps always match the actual time an event occurred.",
        false,
        "Clocks can be wrong, fields stripped, or values manually edited.",
      ),
      mcQuiz(
        "for-meta-q3",
        "Email headers are useful forensically because they:",
        ["Encrypt the message body", "Show routing and origin information", "Replace the need for disk imaging", "Delete spam automatically"],
        1,
        "Headers document path and technical origin of messages.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-file-timestamps",
    pathId: PATH,
    order: 5,
    title: "File Timestamps",
    summary:
      "MACB times, $STANDARD_INFORMATION vs $FILE_NAME, timestomping, and building reliable timelines from temporal artifacts.",
    objectives: [
      "Differentiate timestamp types on Windows and Unix systems",
      "Explain timestomping and detection approaches",
      "Correlate file times with logs and registry entries",
    ],
    introduction:
      "When was a file created? Modified? Last opened? The answer depends on the operating system, file system, and whether an attacker tried to cover tracks. Forensic timeline analysis leans heavily on timestamps — but only if you know which clock means what and which sources resist tampering.",
    coreConcepts: [
      "Windows NTFS stores multiple timestamp sets in MFT attributes.",
      "$STANDARD_INFORMATION (SI) vs $FILE_NAME (FN) timestamps can diverge after timestomping.",
      "MACB: Modified, Accessed, Changed (metadata), Born (created) — tools like mactime use this model.",
      "Linux ext4 tracks crtime (creation) with limitations; atime may be disabled for performance.",
      "Timestomping sets false times; compare SI/FN, USN journal, and shellbags for inconsistencies.",
    ],
    explanation:
      "Copying a file may preserve original times or set new ones depending on method (Explorer vs robocopy /COPY:DAT). Opening a document updates accessed time unless disabled. Attackers use SetFileTime APIs or timestomp tools to backdate malware. Examiners compare $SI and $FN times — mismatches suggest manipulation. The USN Journal logs renames and modifications with its own timestamps. Event logs, prefetch, shimcache, and browser history provide independent temporal anchors. Super timelines merge file system, registry, and log events into one sortable view for incident reconstruction.",
    realWorld:
      "Insider cases used mismatching SI/FN times to show an attacker altered malware dates. Ransomware timelines correlate encryption start with VPN logons minutes earlier.",
    scenario:
      "Malware.exe shows Created 2019 in Explorer but USN journal first references it yesterday. What likely occurred?",
    terms: [
      { term: "Timestomping", definition: "Intentionally altering file timestamps to evade timeline analysis." },
      { term: "$FILE_NAME", definition: "NTFS MFT attribute holding directory entry name and secondary timestamps." },
      { term: "Super timeline", definition: "Merged chronological view of artifacts from multiple sources." },
    ],
    mistakes: [
      "Building timelines from a single timestamp type only.",
      "Ignoring timezone normalization across sources.",
      "Trusting accessed time when atime is disabled or on SSDs with policy.",
    ],
    defensive: [
      "Centralize authoritative time via NTP and log UTC consistently.",
      "Collect USN journal and event logs early before rotation.",
      "Use EDR telemetry that records file creation independent of MFT.",
    ],
    quiz: [
      mcQuiz(
        "for-ts-q1",
        "Timestomping is primarily used to:",
        ["Speed up the CPU", "Disguise when files were actually created or modified", "Encrypt the MFT", "Improve battery life"],
        1,
        "False dates help malware blend with legitimate old files.",
      ),
      tfQuiz(
        "for-ts-q2",
        "Comparing $STANDARD_INFORMATION and $FILE_NAME timestamps can reveal timestomping.",
        true,
        "Manipulated files often show mismatches between SI and FN attribute times.",
      ),
      mcQuiz(
        "for-ts-q3",
        "Strong timelines combine file times with:",
        ["Only one screenshot", "Logs, registry, and journal artifacts", "Desktop wallpaper color", "Monitor size"],
        1,
        "Multiple independent sources corroborate or challenge file timestamps.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-logs-evidence",
    pathId: PATH,
    order: 6,
    title: "Logs as Evidence",
    summary:
      "Windows Event Log, syslog, web server logs, and cloud audit trails as durable witnesses to user and system activity.",
    objectives: [
      "Identify high-value log sources for forensic investigations",
      "Parse common event IDs and fields",
      "Address log integrity, retention, and time sync issues",
    ],
    introduction:
      "Logs record what happened when file timestamps cannot tell the full story. Authentication events, process creation, firewall denies, and API calls leave structured traces. Forensic investigators export, normalize, and correlate logs — often across months — to reconstruct intrusions, policy violations, and data theft.",
    coreConcepts: [
      "Windows Security log: 4624 logon, 4625 failure, 4688 process creation, 4720 user created.",
      "Linux auth.log / secure and journald capture SSH and sudo activity.",
      "Web and proxy logs show URLs, IPs, user agents, and response codes.",
      "Cloud trails (CloudTrail, Azure Activity, GCP Audit) record control-plane API calls.",
      "Centralized SIEM retention beats parsing single endpoints after the fact.",
    ],
    explanation:
      "Collect logs early — attackers clear local logs or reduce retention. Export EVTX files forensically; note if they were tampered (Event 1102 log cleared). Correlate 4624 Type 10 (RDP) with VPN and firewall logs. PowerShell Script Block Logging (4104) captures offensive scripts. Web server access logs reveal exfiltration via large POSTs or unusual paths. Normalize timestamps to UTC. Chain logs with file system timelines: a 4688 showing powershell.exe followed seconds later by new files in Temp strengthens causality. Hash exported log bundles and document export method for chain of custody.",
    realWorld:
      "BEC investigations trace mailbox rules via O365 audit logs. Ransomware cases pivot on 4688 and Sysmon process lineage to find initial access payload execution.",
    scenario:
      "Security log shows Event 4625 x50 from one workstation, then 4624 Type 3 from the same host to a file server. Interpret the sequence.",
    practical: [
      {
        kind: "log",
        title: "Windows logon failure",
        content:
          "Event ID: 4625\nAccount Name: admin\nFailure Reason: Unknown user name or bad password\nSource Network Address: 10.0.5.22",
      },
    ],
    terms: [
      { term: "EVTX", definition: "Windows XML Event Log binary format storing channel records." },
      { term: "Audit trail", definition: "Chronological record of actions — who did what, when, on which resource." },
      { term: "Log forwarding", definition: "Shipping logs to central collectors before local deletion or rotation." },
    ],
    mistakes: [
      "Investigating only one host's logs in a domain incident.",
      "Ignoring time skew between systems.",
      "Assuming absence of logs means no activity occurred.",
    ],
    defensive: [
      "Forward security logs to immutable or WORM storage.",
      "Enable advanced audit policies and PowerShell logging.",
      "Alert on log clearing and retention policy changes.",
    ],
    quiz: [
      mcQuiz(
        "for-log-q1",
        "Windows Event ID 4624 typically indicates:",
        ["Log cleared", "Successful logon", "Disk failure", "Printer error"],
        1,
        "4624 records successful authentication events.",
      ),
      tfQuiz(
        "for-log-q2",
        "Attackers may delete or clear logs to hide activity.",
        true,
        "Log clearing (e.g. Event 1102) is a common anti-forensics step.",
      ),
      mcQuiz(
        "for-log-q3",
        "Cloud audit logs are valuable because they record:",
        ["Only physical badge swipes", "API and administrative actions in the tenant", "Employee salaries", "Hardware serial numbers only"],
        1,
        "Control-plane logs show who changed configs, created users, or accessed storage.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-browser-artifacts",
    pathId: PATH,
    order: 7,
    title: "Browser Artifacts",
    summary:
      "History, cookies, downloads, cache, and local storage — reconstructing web activity from Chromium, Firefox, and Safari profiles.",
    objectives: [
      "Locate browser profile databases on major platforms",
      "Interpret history, downloads, and session storage",
      "Understand private browsing limitations and recovery",
    ],
    introduction:
      "Browsers are daily journals of user intent: searches, logins, downloads, and autofill. Forensic examiners parse SQLite databases and JSON caches to prove who visited a site, downloaded a file, or configured a webmail rule. Browser artifacts often survive 'deletion' longer than users expect.",
    coreConcepts: [
      "Chromium stores History, Cookies, Login Data, and Web Data in SQLite under User Data.",
      "Firefox uses places.sqlite, cookies.sqlite, and formhistory.sqlite.",
      "Downloads table links URLs to local paths and start/finish times.",
      "Cache and localStorage may hold page fragments and tokens.",
      "Private/Incognito reduces persistence but is not absolute — memory and swap may retain traces.",
    ],
    explanation:
      "Chrome History URLs table maps visit times, titles, and transition types (typed, link, redirect). Downloads show target_path and danger type. Session restore files reopen tabs after crash. Extensions have their own storage. Synced accounts may leave cloud copies outside the device. Parsing requires understanding schema versions — tools like Hindsight, Autopsy, and browser export utilities automate extraction. Correlate browser downloads with MFT creation times and AV quarantine logs. Enterprise proxies and DNS logs provide network-side corroboration when local history was cleared.",
    realWorld:
      "IP theft cases used download history to show access to code repositories. CSAM investigations coordinate browser artifacts with cloud account legal process.",
    scenario:
      "History was cleared yesterday but Downloads.sqlite still lists budget.zip saved to Desktop last week. What does this imply?",
    terms: [
      { term: "Places database", definition: "Firefox SQLite store for browsing history and bookmarks." },
      { term: "Session storage", definition: "Per-tab browser storage persisting for the session — may contain app state." },
      { term: "Transition type", definition: "How the user navigated to a URL — typed, clicked link, or redirect." },
    ],
    mistakes: [
      "Assuming cleared history removes all browser evidence.",
      "Parsing live databases on a running system without locking copies.",
      "Ignoring synced or mobile browser counterparts.",
    ],
    defensive: [
      "Enforce managed browsers with logging to enterprise consoles.",
      "Block dangerous downloads at proxy with inspection.",
      "Educate users that clearing history is not equivalent to secure deletion.",
    ],
    quiz: [
      mcQuiz(
        "for-br-q1",
        "Chromium-based browsers store history primarily in:",
        ["A plain .txt file", "SQLite databases in the user profile", "The BIOS", "CMOS RAM"],
        1,
        "History, cookies, and logins use SQLite under User Data.",
      ),
      tfQuiz(
        "for-br-q2",
        "Clearing browsing history always removes all traces of past activity.",
        false,
        "Downloads DB, cache, sync, and network logs may still contain evidence.",
      ),
      mcQuiz(
        "for-br-q3",
        "The downloads table is useful because it links:",
        ["GPU model to monitor", "Remote URL to local file path and time", "Wi-Fi password to SSID", "CPU temperature to fan speed"],
        1,
        "It records what was downloaded, from where, and where it was saved.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-memory-concepts",
    pathId: PATH,
    order: 8,
    title: "Memory Concepts",
    summary:
      "RAM forensics fundamentals — processes, network connections, encryption keys, and malware that never touches disk.",
    objectives: [
      "Explain why memory capture is time-critical",
      "Identify artifacts available in a memory image",
      "Describe basic volatility analysis workflow",
    ],
    introduction:
      "Disk imaging shows what was stored; memory shows what was running. Passwords, encryption keys, command-line arguments, injected code, and C2 connections often exist only in RAM. Memory forensics is advanced but every investigator should understand when and why to capture it.",
    coreConcepts: [
      "Memory acquisition tools: WinPMEM, DumpIt, LiME for Linux — capture before shutdown.",
      "Volatility and similar frameworks parse processes, DLLs, sockets, and registry hives in RAM.",
      "Fileless malware resides in memory with minimal disk footprint.",
      "Credentials and BitLocker keys may be recoverable from lsass.exe while logged in.",
      "Hibernation files and pagefile.sys contain memory snapshots on disk.",
    ],
    explanation:
      "On a live system, an analyst runs a trusted acquisition tool to write a raw memory dump. Offline, Volatility plugins list pslist, netscan, malfind (injected code), and cmdline. Attackers use process hollowing and reflective DLL injection visible in memory but not in prefetch. Network connections show beaconing to C2 before firewall logs rotate. Trade-offs: live response risks alerting attackers; hasty collection without documentation breaks chain of custody. Pagefile and hiberfil.sys extend memory forensics after power-off if disks were imaged.",
    realWorld:
      "Ransomware groups using pure PowerShell loaders were traced via memory strings and parent-child process trees when disk artifacts were wiped.",
    scenario:
      "A user reports odd browser behavior. Disk scan is clean but netscan shows a process connecting to a rare IP on port 443 every 60 seconds. Why capture RAM?",
    terms: [
      { term: "Memory image", definition: "Snapshot of physical RAM contents at acquisition time." },
      { term: "Fileless malware", definition: "Malicious code operating primarily in memory without traditional on-disk binaries." },
      { term: "LSASS", definition: "Windows Local Security Authority process — may hold credentials in memory." },
    ],
    mistakes: [
      "Shutting down before memory capture when disk encryption keys may be in RAM.",
      "Running untrusted tools on live systems without isolation planning.",
      "Ignoring pagefile and hibernation as secondary memory sources.",
    ],
    defensive: [
      "Deploy EDR with memory scanning and script control.",
      "Train IR teams on approved memory capture playbooks.",
      "Require reboot policies that balance encryption with forensic readiness.",
    ],
    quiz: [
      mcQuiz(
        "for-mem-q1",
        "Memory forensics is especially important for:",
        ["Fileless malware and live connections", "Reading paper printouts", "DNS zone files", "CMOS settings"],
        0,
        "Many threats exist only in RAM during execution.",
      ),
      tfQuiz(
        "for-mem-q2",
        "Powering off a system may destroy encryption keys that exist only in RAM.",
        true,
        "Live credentials and keys are volatile and lost on shutdown.",
      ),
      mcQuiz(
        "for-mem-q3",
        "Volatility-style tools primarily:",
        ["Format hard drives", "Parse memory dumps for processes and artifacts", "Send phishing email", "Configure Wi-Fi"],
        1,
        "Frameworks analyze memory images for processes, network, and injections.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-disk-imaging",
    pathId: PATH,
    order: 9,
    title: "Disk Imaging",
    summary:
      "Hardware write blockers, E01/RAW formats, verification hashes, and remote/cloud acquisition strategies.",
    objectives: [
      "Compare forensic image formats and when to use each",
      "Execute a documented imaging workflow with verification",
      "Describe challenges imaging SSDs, RAID, and virtual machines",
    ],
    introduction:
      "Disk imaging is the cornerstone of dead-box forensics — creating a verifiable duplicate of storage for analysis while preserving the original. Done correctly, it unlocks deleted files, registry hives, and years of user activity. Done poorly, it invites legal challenge and data loss.",
    coreConcepts: [
      "Hardware write blockers for SATA/USB; software blockers for some scenarios.",
      "RAW (dd) is a sector-by-sector clone; E01/AFF4 add compression, metadata, and embedded hashes.",
      "Verify with SHA-256 immediately after acquisition and before analysis.",
      "SSD TRIM and wear leveling may zero deleted blocks quickly — image promptly.",
      "VM snapshots and cloud volumes need hypervisor or API-level export.",
    ],
    explanation:
      "Connect suspect drive via write blocker to forensic workstation. Note model, serial, capacity, and visible partitions. Select tool (FTK Imager, Guymager, dd, vendor appliances). Image to external evidence drive — never back to suspect media. Record start/end time, tool version, case ID. Compute hash of image and compare on verification pass. Document any bad sectors. For live VMs, snapshot quiesced disks or export VMDK through hypervisor. Cloud: use vendor forensic export APIs with legal hold on the tenant. RAID requires reassembly or controller imaging. Mobile devices use logical, filesystem, or full physical dumps per tool and lock state.",
    realWorld:
      "Enterprise acquisitions image laptops overnight with documented seals. Cloud forensics increasingly replaces shipping hardware when legal process allows tenant export.",
    scenario:
      "A 1TB SSD laptop must be imaged. TRIM is enabled. Why should imaging happen before the suspect powers it on again?",
    practical: [
      {
        kind: "command",
        title: "Create raw image with hash",
        content:
          "dc3dd if=/dev/sdb of=/evidence/case-442.img hash=sha256 log=/evidence/case-442.log",
      },
    ],
    terms: [
      { term: "E01", definition: "Expert Witness Format — compressed forensic image with metadata and integrity checks." },
      { term: "TRIM", definition: "SSD command that erases blocks when files are deleted, complicating recovery." },
      { term: "Verification hash", definition: "Cryptographic digest confirming image matches source at acquisition." },
    ],
    mistakes: [
      "Imaging to a filesystem that alters metadata on the evidence drive.",
      "Skipping hash verification to save time.",
      "Booting suspect media to 'see what's there' before imaging.",
    ],
    defensive: [
      "Maintain forensic imaging SOPs and calibrated equipment.",
      "Use legal hold and cloud snapshot policies for SaaS data.",
      "Disable unnecessary TRIM exposure by imaging seized systems quickly.",
    ],
    quiz: [
      mcQuiz(
        "for-img-q1",
        "A forensic image should be verified using:",
        ["Guesswork", "Cryptographic hashes", "File extension only", "Monitor brightness"],
        1,
        "Hashes prove the copy matches the source data.",
      ),
      tfQuiz(
        "for-img-q2",
        "SSD TRIM can make deleted data recovery harder than on traditional spinning disks.",
        true,
        "TRIM informs the SSD it may erase deleted blocks promptly.",
      ),
      mcQuiz(
        "for-img-q3",
        "Write blockers are used during imaging to:",
        ["Speed up the CPU", "Prevent modifications to source media", "Encrypt the suspect drive", "Install antivirus"],
        1,
        "Blockers ensure the acquisition process does not alter evidence.",
      ),
    ],
  }),

  createLesson({
    id: "forensics-timeline-hashing",
    pathId: PATH,
    order: 10,
    title: "Timeline Analysis and Hashing",
    summary:
      "Super timelines, mactime, hash sets (NSRL, threat intel), and presenting chronological narratives to investigators and counsel.",
    objectives: [
      "Build a multi-source forensic timeline",
      "Use hashing for integrity and known-file filtering",
      "Communicate timeline findings clearly to stakeholders",
    ],
    introduction:
      "Timeline analysis turns thousands of artifacts into a story: login, malware drop, lateral movement, exfiltration. Hashing underpins integrity verification and lets teams filter known-good files to focus on anomalies. Together they are how forensic work becomes actionable intelligence.",
    coreConcepts: [
      "mactime (Sleuth Kit) generates timelines from file system MAC times.",
      "Super timelines merge logs, registry, browser, and MFT into one CSV/plaso output.",
      "MD5/SHA-256 hashes verify integrity; NSRL hashes identify known benign software.",
      "Threat intel feeds provide hashes of malware families for matching.",
      "Visualization tools (Timesketch, Excel pivot) help pattern recognition.",
    ],
    explanation:
      "After imaging, run bulk hash of all files. Compare against NSRL to hide standard OS files. Flag unknown executables in Temp folders near incident window. Export Plaso or log2timeline from disparate sources with UTC normalization. Annotate key events: initial compromise, persistence, collection, exfil. Present layers: technical timeline for IR, executive summary for leadership, exhibits for legal. Re-hash working copies after analysis to prove they still match acquisition hashes. Document tool versions and filters applied — defense may question cherry-picked events.",
    realWorld:
      "APT investigations produce million-row timelines filtered to 48-hour windows around C2 first seen. NSRL filtering reduced review from 400k to 2k files in a fraud case.",
    scenario:
      "Timeline shows winword.exe spawning powershell.exe at 03:14, followed by a 2GB zip in Temp at 03:16 and a VPN upload at 03:22. Summarize the narrative.",
    practical: [
      {
        kind: "command",
        title: "Generate file timeline",
        content:
          "fls -r -m / evidence.img > body.txt\nmactime -b body.txt -d > timeline.csv",
      },
    ],
    terms: [
      { term: "NSRL", definition: "National Software Reference Library — database of known file hashes for legitimate software." },
      { term: "Plaso", definition: "Log2timeline engine creating super timelines from multiple artifact types." },
      { term: "Integrity hash", definition: "Digest proving a file or image has not changed since a reference point." },
    ],
    mistakes: [
      "Presenting timelines without timezone documentation.",
      "Treating NSRL matches as proof a file is safe in all contexts.",
      "Omitting methodology when exporting timeline for court.",
    ],
    defensive: [
      "Baseline critical servers with known-good hashes.",
      "Integrate timeline exports into SIEM for live correlation.",
      "Retain timeline work product with case notes for audits.",
    ],
    quiz: [
      mcQuiz(
        "for-tl-q1",
        "Super timelines combine artifacts from:",
        ["Only one log file", "Multiple sources like MFT, logs, and registry", "Only browser bookmarks", "Printer queues alone"],
        1,
        "Merging sources reveals correlated activity across the system.",
      ),
      tfQuiz(
        "for-tl-q2",
        "Hashing an evidence image before and after analysis helps prove it was not altered.",
        true,
        "Matching hashes demonstrate integrity throughout the case.",
      ),
      mcQuiz(
        "for-tl-q3",
        "The NSRL is commonly used to:",
        ["Filter out known legitimate software files", "Encrypt evidence", "Send spam", "Replace chain of custody"],
        0,
        "Known-good hash sets reduce noise during malware hunts.",
      ),
    ],
  }),
];

export const forensicsAssessment = createPathAssessment(
  PATH,
  "Digital Forensics Path Assessment",
  [
    mcQuiz("for-final-1", "Chain of custody proves:", ["GPU speed", "Who handled evidence and when", "Weather conditions", "Font choice"], 1, "Custody records establish continuous control."),
    mcQuiz("for-final-2", "Volatile data like RAM should be collected:", ["After months of storage", "As early as possible", "Only from backups", "Never"], 1, "Volatility means delay risks permanent loss."),
    tfQuiz("for-final-3", "Forensic imaging should capture unallocated space.", true, "Deleted data often resides in unallocated clusters."),
    mcQuiz("for-final-4", "Timestomping detection may compare:", ["SI and FN NTFS timestamps", "Monitor and keyboard", "DNS and DHCP only", "Paper and ink"], 0, "Mismatched attribute times suggest manipulation."),
    mcQuiz("for-final-5", "SHA-256 on an image primarily verifies:", ["User passwords", "Integrity of the data", "Screen resolution", "Network latency"], 1, "Hashes detect any change to the image bits."),
  ],
);
