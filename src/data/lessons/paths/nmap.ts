import {
  createLesson,
  mcQuiz,
  tfQuiz,
} from "../lessonFactory";

const PATH = "nmap";
const scanme = { label: "ScanMe Lab", to: "/scanme", type: "scanme" as const };

export const nmapLessons = [
  createLesson({
    id: "nmap-network-reconnaissance",
    pathId: PATH,
    order: 1,
    title: "What is Network Reconnaissance",
    summary:
      "The disciplined discovery of hosts, services, and topology — a legitimate security activity only with explicit authorization.",
    estimatedMinutes: 22,
    objectives: [
      "Define network reconnaissance in offensive and defensive contexts",
      "Distinguish passive from active reconnaissance",
      "Explain legal and ethical requirements before any probing",
    ],
    introduction:
      "Network reconnaissance is the process of gathering information about targets — live hosts, open ports, service versions, operating systems, and network topology. Defenders perform recon on their own assets to find shadow IT and misconfigurations. Attackers perform recon before exploitation. The techniques overlap; the authorization does not. Scanning or probing systems you do not own or lack written permission to test violates computer crime laws in many countries. Ethical security work always starts with defined scope, rules of engagement, and emergency contacts.",
    coreConcepts: [
      "Passive recon uses publicly available data — DNS records, certificate transparency, BGP, Shodan indexes — without sending packets to the target.",
      "Active recon sends probes (ICMP, TCP SYN, UDP) to elicit responses from live systems.",
      "Recon feeds threat modeling: attack surface mapping, prioritization, and baseline documentation.",
      "Scope documents list approved IP ranges, hostnames, time windows, and prohibited techniques.",
      "Defenders conduct recon to validate exposure matches inventory and firewall intent.",
    ],
    explanation:
      "A typical authorized assessment begins with passive collection: WHOIS, DNS enumeration, historical URLs, employee LinkedIn posts revealing tech stack. Active phase — only after written approval — identifies listening services and versions. Recon output becomes a living asset map: which subnets host databases, which ports are internet-facing, which services run outdated software. Red teams chain recon to exploitation; blue teams use the same data to close gaps first. Unauthorized internet-wide scanning is not 'research' — it is probing strangers' networks. Use designated practice environments like ScanMe labs or your own VMs.",
    realWorld:
      "Bug bounty programs define in-scope domains. Penetration tests include ROE prohibiting production DoS. SOC teams run internal discovery scans quarterly with change management approval.",
    scenario:
      "A student runs Nmap against a university server without permission and triggers an alert. Explain why this differs from the professor's scheduled lab on approved targets.",
    terms: [
      { term: "Attack surface", definition: "All points where an unauthorized user could interact with or attack a system." },
      { term: "Rules of engagement (ROE)", definition: "Contractual document defining authorized targets, methods, and limits for a security test." },
      { term: "Passive recon", definition: "Information gathering without directly interacting with target systems." },
    ],
    mistakes: [
      "Scanning 'to see what happens' on networks you do not control.",
      "Assuming public internet hosts are implicitly consenting to probes.",
      "Skipping documentation of scope before active testing.",
    ],
    defensive: [
      "Run authorized internal recon on a schedule; compare to CMDB.",
      "Monitor for scan patterns against your perimeter — may indicate attacker recon.",
      "Provide sanctioned lab targets for skill development.",
    ],
    quiz: [
      mcQuiz(
        "nmap-recon-q1",
        "Active network reconnaissance involves:",
        ["Reading only public WHOIS records", "Sending probes to target systems to gather responses", "Analyzing offline backup tapes", "Writing firewall rules without testing"],
        1,
        "Active recon directly interacts with targets via packets or connections.",
      ),
      mcQuiz(
        "nmap-recon-q2",
        "Before active scanning, you must have:",
        ["A faster internet connection", "Explicit written authorization for the target scope", "Root access on your laptop only", "A paid Nmap license"],
        1,
        "Authorization and defined scope are legal and ethical prerequisites.",
      ),
      tfQuiz(
        "nmap-recon-q3",
        "Passive reconnaissance never sends traffic directly to the target organization.",
        true,
        "Passive methods rely on third-party or historical data without direct probing.",
      ),
    ],
  }),

  createLesson({
    id: "nmap-what-is-nmap",
    pathId: PATH,
    order: 2,
    title: "What is Nmap",
    summary:
      "The industry-standard network scanner — capabilities, architecture, and responsible use for authorized assessments.",
    estimatedMinutes: 21,
    objectives: [
      "Describe Nmap's primary functions and output formats",
      "Identify when Nmap is appropriate in a security workflow",
      "State authorization requirements before running Nmap against any target",
    ],
    introduction:
      "Nmap (Network Mapper) is an open-source tool for network discovery and security auditing. Gordon Lyon (Fyodor) released it in 1997; it remains the de facto standard for port scanning and service enumeration. Nmap sends crafted packets, interprets responses, and reports host status, open ports, service names, versions, OS guesses, and script output. It is powerful dual-use software — indispensable for defenders auditing their estate and dangerous in unauthorized hands. Use Nmap only on systems you own or have explicit written permission to test.",
    coreConcepts: [
      "Host discovery (-sn): determine which IPs are online before port scanning.",
      "Port scanning (-sS, -sT, -sU): identify listening TCP/UDP ports.",
      "Service/version detection (-sV): probe banners and behavior to identify software.",
      "OS detection (-O): fingerprint stack characteristics (requires authorization and root on Linux).",
      "NSE scripts (-sC, --script): automate vulnerability checks and extended enumeration.",
    ],
    explanation:
      "Nmap runs on Linux, macOS, and Windows. Basic syntax: nmap [scan type] [options] target. Targets can be single IPs, CIDR ranges, or hostlists — stay within approved scope only. Output formats (-oN, -oX, -oG) feed reporting pipelines. Zenmap provides a GUI; ndiff compares scan results over time for drift detection. Nmap timing templates (-T0 through -T5) balance speed vs stealth — aggressive scans on fragile networks can cause outages; coordinate with owners. In authorized assessments, document commands run for reproducibility and client deliverables.",
    realWorld:
      "Compliance audits use Nmap to verify firewall rules match policy. Incident responders scan isolated VLANs to find rogue devices. CTF platforms provide legal targets; production internet scanning without scope is prosecuted.",
    scenario:
      "Your employer asks you to inventory open ports on a new cloud VPC. What approvals do you need, and which Nmap phase runs first?",
    practical: [
      {
        kind: "command",
        title: "Basic authorized host discovery",
        content:
          "# Only on targets you own or have permission to test:\nnmap -sn 10.0.0.0/24",
      },
    ],
    terms: [
      { term: "NSE", definition: "Nmap Scripting Engine — Lua scripts extending scan functionality." },
      { term: "Zenmap", definition: "Official graphical front end for Nmap." },
      { term: "Dual-use tool", definition: "Software with legitimate security and malicious applications." },
    ],
    mistakes: [
      "Running default intense scans (-A) on production without maintenance windows.",
      "Scanning entire /8 ranges from a home connection without authorization.",
      "Ignoring Nmap's legal disclaimer and organizational policy.",
    ],
    defensive: [
      "Schedule authorized Nmap runs; store results for baseline comparison.",
      "Alert on scan traffic patterns at the perimeter.",
      "Practice on ScanMe lab or local VMs before client engagements.",
    ],
    quiz: [
      mcQuiz(
        "nmap-intro-q1",
        "Nmap is primarily used for:",
        ["Word processing", "Network discovery and security auditing", "Disk encryption", "Email filtering"],
        1,
        "Nmap discovers hosts, ports, services, and related network information.",
      ),
      mcQuiz(
        "nmap-intro-q2",
        "You may run Nmap against a target when:",
        ["The target responds to ping", "You have written authorization or own the system", "It is a weekend", "The port is 80"],
        1,
        "Authorization or ownership is mandatory before active scanning.",
      ),
      tfQuiz(
        "nmap-intro-q3",
        "Nmap includes a scripting engine (NSE) for extended checks.",
        true,
        "NSE scripts automate tasks from banner grabbing to vulnerability detection.",
      ),
    ],
    practiceLink: scanme,
  }),

  createLesson({
    id: "nmap-basic-scanning",
    pathId: PATH,
    order: 3,
    title: "Basic Scanning Concepts",
    summary:
      "Targets, scan types, timing, and output — foundational Nmap workflow for authorized reconnaissance.",
    estimatedMinutes: 23,
    objectives: [
      "Construct valid Nmap target specifications within scope",
      "Choose appropriate scan phases: discovery then port scan",
      "Interpret normal, XML, and grepable output for reporting",
    ],
    introduction:
      "Before advanced techniques, master the basic workflow: define authorized targets, discover live hosts, scan ports, optionally detect services, save results. Nmap's flexibility creates foot-guns — scanning too fast, too wide, or without permission causes incidents. This lesson builds disciplined habits: least-invasive methods first, explicit target lists, logged commands, and coordination with network owners.",
    coreConcepts: [
      "Target specifiers: single IP, hostname, CIDR, range (1-254), -iL input file.",
      "-sn (ping scan): ARP on local LAN, ICMP echo, TCP ACK to 443, etc. — skips port scan.",
      "Default scan: 1000 common TCP ports if no flags specified (platform-dependent).",
      "-p- scans all 65535 ports; -p 22,80,443 scans specific ports.",
      "-oA basename saves normal, XML, and grepable formats simultaneously.",
    ],
    explanation:
      "Workflow example on authorized lab: nmap -sn 192.168.56.0/24 lists live hosts. Follow with nmap -sS -p- --open 192.168.56.10 for full TCP SYN scan of one host. --open shows only open ports, reducing noise. -v increases verbosity; --reason explains why a port state was assigned. Exclude out-of-scope hosts with --exclude or --excludefile. Timing -T3 is default; -T4 faster on reliable networks. Always verify target list twice — typos have scanned wrong companies in real incidents. Store XML for tools like Metasploit or custom parsers.",
    realWorld:
      "Consultants deliver XML and executive summaries. Internal teams diff monthly -sn results to find unauthorized devices.",
    scenario:
      "Scope allows 10.10.10.0/24 except 10.10.10.1 (gateway). Write the Nmap flags to respect exclusions before port scanning.",
    practical: [
      {
        kind: "command",
        title: "Scoped scan with output",
        content:
          "# Authorized targets only\nnmap -sn --exclude 10.10.10.1 10.10.10.0/24 -oA discovery_phase",
      },
    ],
    terms: [
      { term: "CIDR", definition: "IP range notation for specifying multiple hosts in one target argument." },
      { term: "Ping scan", definition: "Nmap host discovery without port scanning (-sn)." },
      { term: "Grepable output (-oG)", definition: "Line-oriented format easy to parse with Unix tools." },
    ],
    mistakes: [
      "Omitting -sn on huge ranges and port-scanning every address including offline IPs.",
      "Not saving output — unable to prove what was tested.",
      "Using -T5 on legacy industrial networks causing device crashes.",
    ],
    defensive: [
      "Maintain approved target lists in version control.",
      "Use -sn first to reduce unnecessary port scan traffic.",
      "Practice command syntax in ScanMe lab before production assessments.",
    ],
    quiz: [
      mcQuiz(
        "nmap-basic-q1",
        "Which option performs host discovery without port scanning?",
        ["-sV", "-sn", "-O", "-A"],
        1,
        "-sn skips port scan and only determines which hosts are up.",
      ),
      mcQuiz(
        "nmap-basic-q2",
        "To scan only ports 22 and 443, use:",
        ["-p 22,443", "-sn 22", "-O 22", "--top-ports 2"],
        0,
        "-p specifies port list or ranges.",
      ),
      tfQuiz(
        "nmap-basic-q3",
        "You should verify target scope before every Nmap invocation.",
        true,
        "Scope mistakes cause unauthorized scanning and legal exposure.",
      ),
    ],
    practiceLink: scanme,
  }),

  createLesson({
    id: "nmap-tcp-scanning",
    pathId: PATH,
    order: 4,
    title: "TCP Scanning",
    summary:
      "SYN, connect, and ACK scan types — how Nmap interprets TCP responses on authorized targets only.",
    estimatedMinutes: 24,
    objectives: [
      "Compare -sS (SYN), -sT (connect), and -sA (ACK) scan behavior",
      "Explain why SYN scan requires elevated privileges on Unix",
      "Interpret filtered vs closed vs open port states for TCP",
    ],
    introduction:
      "TCP port scanning reveals which services accept connections. Nmap supports multiple techniques differing in speed, stealth, and privilege requirements. SYN scan (-sS) is the default for privileged users — sends SYN, analyzes SYN-ACK or RST without completing the handshake. Connect scan (-sT) uses the OS connect() syscall — no raw packets but completes handshake and logs on target. Only use these against authorized systems; unauthorized TCP scanning is indistinguishable from attack recon in IDS logs.",
    coreConcepts: [
      "-sS (SYN stealth): SYN → SYN-ACK = open; RST = closed; no response may mean filtered.",
      "-sT (connect): full TCP handshake; does not require root on Unix but slower and more logged.",
      "-sA (ACK): maps firewall rules — RST means unfiltered, silence often filtered.",
      "-sN/-sF/-sX: null, FIN, Xmas scans exploit RFC nuances on some stacks.",
      "--scan-delay and -T templates tune probe rate.",
    ],
    explanation:
      "SYN scan sends SYN packet. Open port replies SYN-ACK; Nmap sends RST to avoid completing connection. Closed port replies RST. Filtered (firewall drop) yields no response or ICMP unreachable. IDS may flag SYN scans — inform blue team during authorized tests. Connect scan is useful when unprivileged or when SYN scan blocked by local firewall. Window scan (-sW) is niche. Document scan type in reports — clients ask why logs show half-open connections. On Windows, Nmap often uses connect scan by default without Npcap.",
    realWorld:
      "Red team ROE may require -sT to simulate realistic attacker without raw packets. Cloud environments may rate-limit SYN floods from single IPs.",
    scenario:
      "You lack root on a Linux jump box. Which TCP scan type works without sudo, and what logging difference should you warn the client about?",
    practical: [
      {
        kind: "command",
        title: "TCP SYN scan (authorized)",
        content:
          "sudo nmap -sS -p 1-1024 scanme.nmap.org\n# Replace target with your authorized scope only",
      },
    ],
    terms: [
      { term: "Half-open scan", definition: "SYN scan that does not complete the TCP three-way handshake." },
      { term: "Filtered", definition: "Nmap cannot determine open/closed — packet dropped or blocked by firewall." },
      { term: "Npcap", definition: "Windows packet capture driver enabling raw scans in Nmap." },
    ],
    mistakes: [
      "Running SYN floods via aggressive -T5 against fragile services.",
      "Assuming 'stealth' SYN scans are invisible — modern IDS detects them.",
      "TCP scanning systems outside written scope.",
    ],
    defensive: [
      "Log SYN anomalies; correlate with authorized scan windows.",
      "Harden exposed services; minimize open TCP ports.",
      "Practice TCP scan interpretation in ScanMe lab.",
    ],
    quiz: [
      mcQuiz(
        "nmap-tcp-q1",
        "Default privileged Nmap TCP scan type is:",
        ["-sU", "-sS (SYN)", "-sA only", "-sn"],
        1,
        "SYN scan (-sS) is default when running as root with raw socket access.",
      ),
      mcQuiz(
        "nmap-tcp-q2",
        "A TCP port returning SYN-ACK to a SYN probe is:",
        ["Closed", "Open", "Always filtered", "UDP only"],
        1,
        "SYN-ACK indicates the port accepts connections.",
      ),
      tfQuiz(
        "nmap-tcp-q3",
        "Connect scan (-sT) completes the full TCP handshake and may appear in application logs.",
        true,
        "Connect scan uses OS API and establishes full connections.",
      ),
    ],
    practiceLink: scanme,
  }),

  createLesson({
    id: "nmap-udp-scanning",
    pathId: PATH,
    order: 5,
    title: "UDP Scanning",
    summary:
      "Slow but essential — discovering UDP services attackers and defenders both overlook on authorized targets.",
    estimatedMinutes: 25,
    objectives: [
      "Explain why UDP scanning is slower and less reliable than TCP",
      "Interpret open, open|filtered, and closed UDP port states",
      "Plan UDP scan scope and timing for authorized assessments",
    ],
    introduction:
      "UDP is connectionless — no SYN-ACK handshake to confirm open ports. Nmap sends protocol-specific payloads or empty datagrams; ICMP port unreachable often means closed, silence may mean open or filtered. UDP scanning is slow — retries and long timeouts — but critical for DNS, SNMP, NTP, TFTP, and VPN services often missed in TCP-only sweeps. Run UDP scans only on authorized targets during agreed windows; high-volume UDP can trigger abuse complaints.",
    coreConcepts: [
      "-sU enables UDP scan; often combined with -sS for full picture.",
      "Closed UDP ports may return ICMP port unreachable (type 3, code 3).",
      "Open UDP ports may not respond — state open|filtered is common ambiguity.",
      "--top-ports 100 -sU reduces time vs full 65535 UDP scan.",
      "Version detection (-sV) helps confirm open UDP services.",
    ],
    explanation:
      "Command: nmap -sU --top-ports 50 -sV authorized-host. Each UDP port may wait seconds for response. Firewalls dropping ICMP make closed ports look filtered. DNS on 53/udp responds to crafted queries; SNMP on 161/udp may reveal community strings if misconfigured — report findings responsibly in authorized reports only. Parallelize with --min-parallelism carefully; respect ROE rate limits. Some cloud providers block outbound UDP scanning entirely. Defenders monitor internal UDP scans as lateral movement indicator.",
    realWorld:
      "NTP amplification and SNMP reflection abuses stem from open UDP services. Internal audits find legacy TFTP and DHCP-related exposures via UDP scans.",
    scenario:
      "TCP scan shows only 443 open. UDP top-100 reveals 53/udp open. Why was DNS missed in TCP-only testing, and what follow-up check applies?",
    practical: [
      {
        kind: "command",
        title: "UDP top ports scan",
        content:
          "# Authorized target only — expect slow runtime\nnmap -sU --top-ports 100 -sV -T3 target.example.com",
      },
    ],
    terms: [
      { term: "open|filtered", definition: "Nmap state when UDP probe gets no definitive response — ambiguous." },
      { term: "ICMP port unreachable", definition: "Often indicates UDP port is closed on the target." },
      { term: "Protocol probe", definition: "Nmap payload crafted for specific UDP service expected response." },
    ],
    mistakes: [
      "Skipping UDP entirely in assessments — incomplete attack surface picture.",
      "Running full 65535 UDP against wide ranges without time approval.",
      "Misreading open|filtered as confirmed open without -sV validation.",
    ],
    defensive: [
      "Disable unnecessary UDP services; firewall egress and ingress.",
      "Monitor anomalous UDP scan traffic.",
      "Validate DNS and SNMP exposure with authorized internal UDP scans.",
    ],
    quiz: [
      mcQuiz(
        "nmap-udp-q1",
        "UDP scans are generally slower than TCP scans because:",
        ["UDP is illegal", "No handshake confirmation — relies on timeouts and ICMP", "UDP uses larger packets only", "Nmap disables UDP by default forever"],
        1,
        "Connectionless UDP requires inference from responses or lack thereof.",
      ),
      mcQuiz(
        "nmap-udp-q2",
        "Which Nmap flag enables UDP scanning?",
        ["-sS", "-sU", "-sn", "-O"],
        1,
        "-sU selects UDP scan mode.",
      ),
      tfQuiz(
        "nmap-udp-q3",
        "An authorized security assessment should include UDP scanning when scope and time allow.",
        true,
        "Many sensitive services are UDP-only or UDP-primary.",
      ),
    ],
    practiceLink: scanme,
  }),

  createLesson({
    id: "nmap-port-states",
    pathId: PATH,
    order: 6,
    title: "Port States",
    summary:
      "Open, closed, filtered, and combined states — reading Nmap output accurately for authorized scan reports.",
    estimatedMinutes: 20,
    objectives: [
      "Define each Nmap port state precisely",
      "Explain how firewalls affect state classification",
      "Avoid over-interpreting ambiguous states in deliverables",
    ],
    introduction:
      "Nmap assigns every probed port a state — not merely 'open or shut.' Misreading states leads to false positives in reports (claiming open|filtered as confirmed backdoors) or false negatives (ignoring filtered as 'secure'). Accurate interpretation is a professional skill tested in certifications and expected by clients reviewing authorized penetration test deliverables.",
    coreConcepts: [
      "open: application accepts connections (TCP SYN-ACK or UDP service response).",
      "closed: accessible but no application listening (TCP RST, ICMP unreachable for UDP).",
      "filtered: firewall or ACL prevents probe from determining state — drop or ICMP admin prohibited.",
      "unfiltered (ACK scan): port accessible but open/closed unknown without further probes.",
      "open|filtered and closed|filtered: ambiguity from absent responses.",
    ],
    explanation:
      "PORT STATE SERVICE — 22/tcp open ssh means confirmed SSH listener. 23/tcp closed telnet means host reachable, nothing on 23. 993/tcp filtered imap means packet filter blocked probe — service may or may not exist behind firewall. --reason adds 'syn-ack' or 'no-response' justification. Compare scans from different vantage points: external scan shows filtered; internal scan shows open — documents firewall effectiveness. In reports, distinguish confirmed open from ambiguous states; recommend internal validation for filtered corporate ports.",
    realWorld:
      "Compliance scanners flag 'open' critical services. Filtered database ports from internet are good; same ports open internally without auth are findings.",
    scenario:
      "External scan: 3306/tcp filtered. Internal scan: 3306/tcp open mysql. Write one sentence for the executive summary and one technical recommendation.",
    terms: [
      { term: "Filtered", definition: "Probe blocked — Nmap cannot determine if port is open or closed." },
      { term: "--reason", definition: "Nmap option showing why each port received its state." },
      { term: "unfiltered", definition: "Port reachable but open/closed status undetermined (ACK scan context)." },
    ],
    mistakes: [
      "Reporting open|filtered as verified vulnerable service.",
      "Assuming filtered means secure — internal exposure may still exist.",
      "Ignoring closed ports — RST responses confirm host is up.",
    ],
    defensive: [
      "Aim for closed or filtered from untrusted zones for sensitive ports.",
      "Use dual vantage scans in authorized tests to validate segmentation.",
      "Practice state reading with ScanMe lab output.",
    ],
    quiz: [
      mcQuiz(
        "nmap-state-q1",
        "Nmap state 'filtered' means:",
        ["Port is confirmed open", "Probe was blocked; open/closed unknown", "Host is offline", "UDP only"],
        1,
        "Filtered indicates firewall or filtering device prevented determination.",
      ),
      mcQuiz(
        "nmap-state-q2",
        "TCP RST in response to SYN typically means:",
        ["Open", "Closed", "Filtered", "Encrypted"],
        1,
        "RST indicates the port is reachable but no service is listening.",
      ),
      tfQuiz(
        "nmap-state-q3",
        "open|filtered is an ambiguous state common in UDP scanning.",
        true,
        "Lack of UDP response makes definitive open vs filtered classification difficult.",
      ),
    ],
    practiceLink: scanme,
  }),

  createLesson({
    id: "nmap-service-detection",
    pathId: PATH,
    order: 7,
    title: "Service Detection",
    summary:
      "From open port to service name — Nmap -sV probes, banners, and responsible reporting on authorized scans.",
    estimatedMinutes: 23,
    objectives: [
      "Enable and interpret Nmap version/service detection (-sV)",
      "Understand probe matching and confidence levels",
      "Correlate Nmap service names with hardening priorities",
    ],
    introduction:
      "Knowing port /tcp is open matters less than knowing it runs OpenSSH 8.2 vs Apache httpd 2.4. Service detection sends additional probes after ports are identified, matches responses against nmap-service-probes database, and reports SERVICE VERSION (and CPE when available). This drives patch prioritization in authorized vulnerability management. Aggressive version scanning increases traffic and detection — coordinate with system owners.",
    coreConcepts: [
      "-sV enables service/version detection; --version-intensity 0-9 controls probe depth.",
      "Banner grabbing: many services self-identify in welcome messages (SSH, SMTP, HTTP Server header).",
      "Nmap reports confidence: service name only vs version detected.",
      "-sC runs default scripts with version detection — more invasive.",
      "False positives possible on non-standard ports running unexpected services.",
    ],
    explanation:
      "Example output: 80/tcp open http Apache httpd 2.4.52. Nmap tried HTTP OPTIONS and GET against the port. --version-light reduces intensity for fragile devices. Custom services on high ports may show unknown unless probes added. Pair -sV with manual verification: curl -I, openssl s_client for TLS services. In authorized reports, tie versions to CVE databases and vendor advisories — not to exploit without permission. Service detection on critical ICS may cause faults — ROE often excludes OT networks or mandates low intensity.",
    realWorld:
      "Attackers fingerprint services for exploit selection. Defenders use same data for patch Tuesday prioritization. Shodan pre-indexes banners; authorized Nmap validates your specific config.",
    scenario:
      "Nmap reports 8080/tcp open http-proxy unknown. What manual steps confirm the actual application on an authorized internal host?",
    practical: [
      {
        kind: "command",
        title: "Service detection scan",
        content:
          "nmap -sS -sV -p 22,80,443 authorized-host.example.com",
      },
    ],
    terms: [
      { term: "Banner", definition: "Initial text a service sends identifying software or version." },
      { term: "CPE", definition: "Common Platform Enumeration — standardized name for software product/version." },
      { term: "version-intensity", definition: "Controls how many probes Nmap sends for service detection." },
    ],
    mistakes: [
      "Skipping -sV and reporting 'unknown service on 443'.",
      "Max intensity against medical or industrial devices without approval.",
      "Trusting version strings spoofed by honeypots without corroboration.",
    ],
    defensive: [
      "Remove or customize banners where policy allows.",
      "Patch services identified in authorized scans promptly.",
      "Practice -sV interpretation in ScanMe lab.",
    ],
    quiz: [
      mcQuiz(
        "nmap-svc-q1",
        "Nmap service/version detection is enabled with:",
        ["-sn", "-sV", "-O only", "-n"],
        1,
        "-sV activates the service probe engine.",
      ),
      mcQuiz(
        "nmap-svc-q2",
        "Banner grabbing relies on:",
        ["DHCP leases", "Service welcome messages or protocol responses", "ARP tables", "CPU serial numbers"],
        1,
        "Many protocols identify themselves in initial handshake or headers.",
      ),
      tfQuiz(
        "nmap-svc-q3",
        "Higher --version-intensity sends more probes and may increase load on targets.",
        true,
        "Intensity trades thoroughness against traffic and disruption risk.",
      ),
    ],
    practiceLink: scanme,
  }),

  createLesson({
    id: "nmap-version-detection",
    pathId: PATH,
    order: 8,
    title: "Version Detection",
    summary:
      "Deep fingerprinting of software versions — accuracy limits, intensity tuning, and ethical disclosure on authorized assessments.",
    estimatedMinutes: 22,
    objectives: [
      "Tune version detection intensity for different target types",
      "Interpret partial and incorrect version matches",
      "Link detected versions to vulnerability research workflow",
    ],
    introduction:
      "Version detection is the subset of service detection focused on identifying exact or approximate software versions. Accurate versions enable CVE mapping; inaccurate versions cause wasted remediation or missed patches. Nmap's nmap-service-probes file contains thousands of patterns — updated with each release. On authorized engagements, document detection method and confidence; manually verify critical findings before claiming exploitability.",
    coreConcepts: [
      "Partial match: 'Apache httpd' without patch level — still useful but incomplete.",
      "SSL/TLS services: Nmap probes certificate and ALPN; may need openssl for cipher detail.",
      "Rare services on non-standard ports require --version-ports or custom probes.",
      "--version-all tries every probe — slow, use only on single hosts with approval.",
      "ndiff and repeated -sV track drift after patching.",
    ],
    explanation:
      "After patch deployment, rerun nmap -sV on authorized hosts to confirm version string changed. If Nmap still reports old version, service may not have restarted or virtual host routing differs. Multiple services behind reverse proxy on 443 may confuse detection — scan backend directly if in scope. Version info combined with OS detection narrows exploit paths. Responsible workflow: detect version → check CVE → verify with vendor scanner or manual test → report with remediation — never attack out-of-scope systems to 'prove' CVE.",
    realWorld:
      "WannaCry targeted specific SMB versions identified via scanning. Asset management teams integrate Nmap XML into CMDB via APIs.",
    scenario:
      "Nmap shows OpenSSL 1.0.2 on 443/tcp. CVE database lists critical issues for 1.0.2. What verification steps belong in an authorized report before rating critical?",
    terms: [
      { term: "nmap-service-probes", definition: "Database of probe strings and match rules for service detection." },
      { term: "False positive", definition: "Incorrect version identification due to mimicry or probe mismatch." },
      { term: "CVE", definition: "Common Vulnerabilities and Exposures — public catalog of known issues." },
    ],
    mistakes: [
      "Reporting CVE exploitability without confirming running binary version.",
      "Using --version-all on entire class B network.",
      "Disclosing version findings publicly before vendor patch window (unauthorized disclosure).",
    ],
    defensive: [
      "Maintain patch cadence validated by post-patch scans.",
      "Limit version disclosure in public banners.",
      "Use authorized rescans to verify remediation.",
    ],
    quiz: [
      mcQuiz(
        "nmap-ver-q1",
        "If Nmap reports a version without patch level, you should:",
        ["Assume fully patched", "Manually verify version on authorized hosts", "Skip the finding", "Disable TLS"],
        1,
        "Partial matches require corroboration before risk rating.",
      ),
      mcQuiz(
        "nmap-ver-q2",
        "--version-all is appropriate when:",
        ["Scanning the entire internet", "Deep probing a single authorized host with approval", "Never — it is disabled", "Only for UDP"],
        1,
        "Full probe set is invasive — single-host authorized use only.",
      ),
      tfQuiz(
        "nmap-ver-q3",
        "Version detection results should feed vulnerability management on systems you are authorized to assess.",
        true,
        "Versions map to patches; authorization bounds where you may scan.",
      ),
    ],
    practiceLink: scanme,
  }),

  createLesson({
    id: "nmap-os-detection",
    pathId: PATH,
    order: 9,
    title: "OS Detection Concepts",
    summary:
      "TCP/IP stack fingerprinting — how Nmap guesses operating systems and the limits of OS detection on authorized scans.",
    estimatedMinutes: 24,
    objectives: [
      "Describe how Nmap OS detection (-O) uses probe responses",
      "Recognize accuracy percentages and conditional results",
      "Understand privilege and scope requirements for OS scans",
    ],
    introduction:
      "Operating system detection sends a series of TCP, UDP, and ICMP probes and compares responses against a fingerprint database of thousands of OS signatures. Results show likely OS, device type, and accuracy percentage. OS data helps authorized assessors tailor exploit checks and helps defenders spot rogue devices (printer running Linux?). -O requires root on Unix and at least one open and one closed port for reliable results. Use only on in-scope systems.",
    coreConcepts: [
      "-O enables OS detection; --osscan-limit skips hosts without suitable ports.",
      "Fingerprint includes TTL, window size, TCP options order, ICMP responses.",
      "Results like 'Linux 5.4 (95%)' are guesses — not infallible.",
      "Virtualization and custom kernels may mislead fingerprinting.",
      "--osscan-guess shows possible matches when confidence is low.",
    ],
    explanation:
      "Nmap sends unusual packet combinations; closed port RST behavior differs between Windows and Linux stacks. Embedded devices may match 'printer' or 'network device.' Cloud VMs often reveal Linux kernel version hosting containerized apps — OS may matter less than image patch level. Firewalls blocking ICMP or odd TCP flags reduce accuracy. In reports, present OS detection as supporting evidence alongside service versions and EDR data. Unauthorized OS fingerprinting still generates IDS alerts — another reason for written approval.",
    realWorld:
      "Asset inventory uses OS detection to find unsupported Windows 7 remnants. Red teams note OS for lateral movement technique selection within ROE.",
    scenario:
      "OS scan shows 'Device type: general purpose | Running: Linux 3.X'. Internal policy mandates supported kernels only. What complementary data confirms the finding?",
    practical: [
      {
        kind: "command",
        title: "OS detection (authorized, privileged)",
        content:
          "sudo nmap -O --osscan-limit -sS authorized-host",
      },
    ],
    terms: [
      { term: "Fingerprint", definition: "Collection of stack behaviors uniquely associated with an OS build." },
      { term: "osscan-limit", definition: "Limits OS detection to promising hosts to save time." },
      { term: "TTL", definition: "Time To Live — hop limit; often differs by OS default." },
    ],
    mistakes: [
      "Treating 50% OS guess as fact in compliance reports.",
      "Running -O on networks without closed port for comparison.",
      "OS scanning out-of-scope infrastructure.",
    ],
    defensive: [
      "Normalize OS images; retire unsupported platforms identified via scans.",
      "Monitor for OS fingerprint probe patterns.",
      "Practice OS output reading in ScanMe lab.",
    ],
    quiz: [
      mcQuiz(
        "nmap-os-q1",
        "Nmap OS detection (-O) typically requires:",
        ["DNS only", "Root/admin privileges and suitable open/closed ports", "UDP scan only", "No network access"],
        1,
        "Raw packets and port state variety improve fingerprint accuracy.",
      ),
      mcQuiz(
        "nmap-os-q2",
        "OS detection accuracy is reported as:",
        ["Always 100%", "A percentage guess based on fingerprint match", "MAC address only", "TLS cipher only"],
        1,
        "Nmap shows confidence level; results are probabilistic.",
      ),
      tfQuiz(
        "nmap-os-q3",
        "Virtualization and firewalls can reduce OS detection accuracy.",
        true,
        "Abstraction layers alter or hide traditional stack behaviors.",
      ),
    ],
    practiceLink: scanme,
  }),

  createLesson({
    id: "nmap-safe-authorized-scanning",
    pathId: PATH,
    order: 10,
    title: "Safe Authorized Scanning",
    summary:
      "Professional scanning methodology — scope, timing, communication, documentation, and legal boundaries.",
    estimatedMinutes: 25,
    objectives: [
      "Draft a minimal rules-of-engagement checklist for Nmap assessments",
      "Apply techniques to minimize disruption on production systems",
      "Know when to stop, escalate, or seek additional approval",
    ],
    introduction:
      "Technical skill without professional discipline causes outages, legal trouble, and burned bridges. Safe authorized scanning means: written scope, stakeholder notification, conservative timing, logged commands, incremental invasiveness, and clear stop conditions. This capstone integrates every prior lesson — you are trusted with tools that can impair hospitals, factories, and cloud bills if misused. The only ethical target is one you own or have explicit permission to test, such as designated practice labs.",
    coreConcepts: [
      "Scope: IP/hostnames, excluded assets, allowed techniques, time windows, contact numbers.",
      "Start with -sn discovery, then targeted port scans, then -sV, then scripts — escalate invasiveness gradually.",
      "Use -T2 or -T3 on unknown infrastructure; avoid -T5 unless stress testing is authorized.",
      "Notify SOC/blue team with source IPs to prevent incident response activation.",
      "Retain logs, XML output, and command history for accountability.",
    ],
    explanation:
      "Pre-engagement: sign SOW/ROE, verify target ownership, confirm emergency stop contact. Day of test: email NOC with IP ranges and scan types. Run ndiff against last baseline. If scan causes service degradation — STOP, notify contact, document. NSE scripts like vuln and exploit categories can be destructive — explicit approval required. Cloud: respect provider AUP; some prohibit certain scans from shared tenancy. Personal learning: use ScanMe, HackTheBox in-scope machines, or local VirtualBox networks — never random Shodan results. Laws vary (CFAA in US, Computer Misuse Act in UK) — unauthorized access is criminal regardless of intent.",
    realWorld:
      "Consultancies carry insurance and legal review of ROE. Internal teams use change tickets. Universities expel students for unauthorized scanning despite 'learning' claims.",
    scenario:
      "Mid-scan, a customer database CPU hits 100% correlated with your -sV --version-all run. List immediate actions in order.",
    practical: [
      {
        kind: "alert",
        title: "Authorized scanning checklist",
        content:
          "☐ Written scope signed\n☐ Emergency contact confirmed\n☐ SOC notified with source IP\n☐ Discovery (-sn) before full port scan\n☐ Output saved (-oA)\n☐ Stop if unexpected impact occurs",
      },
    ],
    terms: [
      { term: "SOW", definition: "Statement of Work — contractual scope for professional services." },
      { term: "Change management", definition: "Process approving production-impacting activities in enterprises." },
      { term: "CFAA", definition: "US Computer Fraud and Abuse Act — criminalizes unauthorized computer access." },
    ],
    mistakes: [
      "Assuming 'public' IP means 'permission to scan.'",
      "Running aggressive NSE vuln scripts on production without approval.",
      "Continuing scans after customer reports outage.",
    ],
    defensive: [
      "Provide internal lab and ScanMe for training.",
      "Establish vulnerability disclosure and authorized scan registration.",
      "Instrument monitoring to distinguish authorized from malicious scans.",
    ],
    quiz: [
      mcQuiz(
        "nmap-safe-q1",
        "First step before active Nmap scanning of an organization should be:",
        ["Use -T5 for speed", "Obtain written authorization and defined scope", "Post results on Twitter", "Scan all ports first"],
        1,
        "Legal and ethical scanning requires documented permission and boundaries.",
      ),
      mcQuiz(
        "nmap-safe-q2",
        "If an authorized scan causes unexpected service disruption, you should:",
        ["Hide and continue", "Stop, notify the emergency contact, and document", "Switch to a new IP", "Delete logs"],
        1,
        "Professional duty is to minimize harm and communicate immediately.",
      ),
      tfQuiz(
        "nmap-safe-q3",
        "Designated practice environments like ScanMe are appropriate for learning Nmap without targeting unauthorized systems.",
        true,
        "Sanctioned labs exist precisely to build skills legally and safely.",
      ),
    ],
    practiceLink: scanme,
  }),
];
