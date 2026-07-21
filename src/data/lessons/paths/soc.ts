import {
  createLesson,
  createPathAssessment,
  mcQuiz,
  tfQuiz,
} from "../lessonFactory";

const PATH = "soc";

export const socLessons = [
  createLesson({
    id: "soc-what-is-soc",
    pathId: PATH,
    order: 1,
    title: "What is a SOC",
    summary:
      "Security Operations Center mission, roles, tiers, and how SOC teams detect, analyze, and respond to threats 24/7.",
    objectives: [
      "Define SOC purpose and core functions",
      "Differentiate Tier 1, 2, and 3 analyst responsibilities",
      "Relate SOC workflows to broader organizational risk",
    ],
    introduction:
      "A Security Operations Center (SOC) is the team and facility — physical or virtual — that continuously monitors an organization's security posture. Using people, processes, and technology, SOC analysts detect suspicious activity, investigate alerts, coordinate response, and improve defenses based on lessons learned. Whether in-house or outsourced (MDR), the SOC is where security telemetry becomes action.",
    coreConcepts: [
      "SOC functions: monitor, detect, analyze, respond, report, and improve.",
      "Tier 1 triages alerts, enriches context, and escalates true positives.",
      "Tier 2 conducts deeper investigation, containment recommendations, and tuning.",
      "Tier 3 handles advanced threats, hunting, malware reverse engineering, and architecture fixes.",
      "SOC success metrics include MTTD, MTTR, false positive rate, and coverage gaps.",
    ],
    explanation:
      "SOC analysts sit in front of dashboards fed by SIEM, EDR, firewall, cloud, and identity logs. Playbooks guide responses: phishing email → quarantine mailbox → hunt for similar messages. Shift handoffs document open incidents. The SOC interfaces with IT (patching, account disable), legal (breach notification), and leadership (status briefings). Modern SOCs blend automation (SOAR) with human judgment. Not every alert is an incident; prioritization by asset criticality and threat context prevents burnout. Purple team exercises and threat intel feeds keep detection rules current.",
    realWorld:
      "Enterprises run follow-the-sun SOCs across regions. SMBs use managed detection and response providers. Regulated industries mandate 24/7 monitoring for critical infrastructure.",
    scenario:
      "At 02:00, EDR flags ransomware behavior on a finance workstation. Map which SOC tier owns initial triage vs containment coordination.",
    terms: [
      { term: "SOC", definition: "Security Operations Center — team monitoring and responding to security events." },
      { term: "MTTD", definition: "Mean Time to Detect — average delay from compromise to detection." },
      { term: "MTTR", definition: "Mean Time to Respond — average delay from detection to containment or resolution." },
      { term: "MDR", definition: "Managed Detection and Response — outsourced SOC service with tooling and analysts." },
    ],
    mistakes: [
      "Measuring SOC success only by alert volume closed.",
      "Skipping documentation during handoffs between shifts.",
      "Treating SOC as purely reactive with no threat hunting or tuning time.",
    ],
    defensive: [
      "Define escalation paths and on-call rotations before incidents.",
      "Balance automated blocking with analyst review for high-impact actions.",
      "Invest in analyst training and realistic tabletop exercises.",
    ],
    quiz: [
      mcQuiz(
        "soc-intro-q1",
        "A primary SOC function is to:",
        ["Write marketing copy", "Monitor and respond to security events", "Design office furniture", "Process payroll"],
        1,
        "SOCs detect, investigate, and coordinate response to threats.",
      ),
      tfQuiz(
        "soc-intro-q2",
        "Tier 1 analysts typically perform initial alert triage.",
        true,
        "Tier 1 filters noise and escalates validated concerns.",
      ),
      mcQuiz(
        "soc-intro-q3",
        "MTTR measures:",
        ["Time to respond after detection", "Time to ship hardware", "Employee vacation days", "DNS propagation"],
        0,
        "MTTR tracks how quickly teams contain or resolve incidents.",
      ),
    ],
  }),

  createLesson({
    id: "soc-siem-concepts",
    pathId: PATH,
    order: 2,
    title: "SIEM Concepts",
    summary:
      "Security Information and Event Management — aggregation, correlation, detection rules, and the analyst workflow.",
    objectives: [
      "Explain SIEM core components and data pipeline",
      "Describe correlation rules and use cases",
      "Identify common SIEM limitations and tuning needs",
    ],
    introduction:
      "SIEM platforms collect logs and events from across the enterprise, normalize them, correlate patterns, and alert analysts to potential threats. Splunk, Microsoft Sentinel, Elastic, QRadar, and others share this mission: turn noise into signal at scale. Understanding SIEM architecture is foundational for every SOC role.",
    coreConcepts: [
      "Collection: agents, syslog, API pulls from cloud, EDR, firewalls, identity providers.",
      "Parsing and normalization map disparate formats to common fields (user, src_ip, action).",
      "Correlation rules fire when conditions match — e.g. multiple failed logins then success.",
      "Dashboards and searches support hunting and executive reporting.",
      "Retention, licensing, and storage costs drive architecture decisions.",
    ],
    explanation:
      "Raw logs land in collectors or cloud ingestion endpoints. Parsers extract timestamps (UTC), usernames, IPs, and event codes. Detection engineers author rules: '10 failed logins from one IP in 5 minutes' or 'impossible travel — login from US and APAC within 10 min.' Alerts create tickets in SOAR or ITSM. Analysts pivot from alert to surrounding events using common fields. Tuning reduces false positives — whitelisting patch servers, adjusting thresholds. MITRE ATT&CK tags map detections to adversary techniques. Data quality matters: missing DNS logs or disabled audit policies create blind spots SIEM cannot fix alone.",
    realWorld:
      "SOCs tune SIEM daily — a misconfigured rule flooding 10k alerts drowns real incidents. Cloud SIEMs integrate natively with Azure AD and AWS CloudTrail.",
    scenario:
      "A rule alerts on 'PowerShell encoded command' 200 times per day from SCCM servers. Is this a detection failure? What tuning applies?",
    practical: [
      {
        kind: "alert",
        title: "Sample correlation alert",
        content:
          "Rule: Brute Force Success\nUser: jsmith\nFailed logins: 47 in 10m from 203.0.113.44\nFollowed by: Successful login Type 10 (RDP)\nSeverity: High",
      },
    ],
    terms: [
      { term: "SIEM", definition: "Security Information and Event Management — platform aggregating and analyzing security logs." },
      { term: "Correlation", definition: "Linking multiple events to identify patterns exceeding single-log significance." },
      { term: "Use case", definition: "Documented detection scenario with data sources, logic, and response steps." },
      { term: "Normalization", definition: "Mapping varied log formats to consistent field names and types." },
    ],
    mistakes: [
      "Deploying SIEM without onboarding critical log sources.",
      "Leaving default rules enabled without environment-specific tuning.",
      "Ignoring parser failures that silently drop events.",
    ],
    defensive: [
      "Maintain a detection engineering backlog mapped to ATT&CK.",
      "Monitor ingestion health and parser error rates.",
      "Review top noisy rules monthly and document exceptions.",
    ],
    quiz: [
      mcQuiz(
        "soc-siem-q1",
        "SIEM platforms primarily:",
        ["Replace all firewalls", "Aggregate and analyze security logs", "Format USB drives", "Manage printers"],
        1,
        "SIEM centralizes telemetry for detection and investigation.",
      ),
      tfQuiz(
        "soc-siem-q2",
        "Correlation rules can combine multiple events to detect attack patterns.",
        true,
        "Single events may be benign; sequences reveal attacks.",
      ),
      mcQuiz(
        "soc-siem-q3",
        "Normalization helps analysts by:",
        ["Deleting all logs", "Using consistent field names across sources", "Disabling encryption", "Blocking the internet"],
        1,
        "Common schemas enable pivots across diverse data sources.",
      ),
    ],
  }),

  createLesson({
    id: "soc-log-analysis",
    pathId: PATH,
    order: 3,
    title: "Log Analysis",
    summary:
      "Structured investigation techniques — filtering, pivoting, time bounding, and reading auth, endpoint, and network logs.",
    objectives: [
      "Apply systematic log analysis methodology",
      "Interpret high-value Windows and network log fields",
      "Construct searches that answer investigative questions",
    ],
    introduction:
      "Alerts are starting points; log analysis is how analysts prove or disprove them. Skilled analysts ask precise questions — who logged in, from where, what process ran next — and craft searches that surface answers in seconds. This lesson builds the investigative mindset behind every SOC shift.",
    coreConcepts: [
      "Start with scope: user, host, IP, timeframe, and hypothesis.",
      "Time-bound searches in UTC; account for clock skew.",
      "Pivot on stable identifiers: username, device ID, session ID, process GUID.",
      "Windows: 4624/4625 auth, 4688 process, 5140 share access.",
      "Network: firewall deny/allow, proxy URL, DNS query, VPN session.",
    ],
    explanation:
      "Given 'suspicious login for alice,' search auth logs ±30 minutes: source IP geolocation, failure precedents, concurrent sessions. Pivot to endpoint logs on alice's laptop: process creation after login, PowerShell parents, outbound connections. Check proxy for data exfil patterns. Document each query and result. Use statistical baselines — alice never logs in from that country. Log gaps (retention expired, agent offline) are findings too. Export relevant events with hashes for case records. Teach junior analysts to write searches as reproducible statements, not one-off clicks.",
    realWorld:
      "BEC cases pivot from single O365 login anomaly to mailbox rules and forwarders via audit logs. Ransomware hunts trace 4688 chains from Office macros to encryption binaries.",
    scenario:
      "Alert: 'New service installed on DC01.' Which log sources and fields do you query first?",
    practical: [
      {
        kind: "log",
        title: "Process creation",
        content:
          "Event 4688\nNew Process: powershell.exe\nParent: winword.exe\nCommand Line: powershell -enc SQBFAFgAIAAoAE4AZQB3AC0AIAAuAC4ALgApAA==",
      },
    ],
    terms: [
      { term: "Pivot", definition: "Following a lead from one log field to related events in other sources." },
      { term: "Time bounding", definition: "Restricting searches to a relevant window around an incident." },
      { term: "Process lineage", definition: "Parent-child chain of process executions showing attack flow." },
    ],
    mistakes: [
      "Searching entire year of data without indexes or time limits.",
      "Stopping investigation at first benign explanation without corroboration.",
      "Forgetting to check VPN and cloud logs for off-network activity.",
    ],
    defensive: [
      "Standardize field names at ingestion for reliable pivots.",
      "Create saved searches for common investigation patterns.",
      "Retain logs per policy and legal requirements.",
    ],
    quiz: [
      mcQuiz(
        "soc-log-q1",
        "A good first step in log analysis is to:",
        ["Delete all indexes", "Define scope: user, host, time, hypothesis", "Reboot the SIEM", "Ignore timestamps"],
        1,
        "Clear scope focuses searches and reduces noise.",
      ),
      tfQuiz(
        "soc-log-q2",
        "Windows Event 4688 can help establish process lineage.",
        true,
        "4688 records new processes and parent relationships.",
      ),
      mcQuiz(
        "soc-log-q3",
        "Pivoting in an investigation means:",
        ["Turning off monitors", "Following identifiers across related log events", "Formatting disks", "Changing passwords randomly"],
        1,
        "Analysts chain user, IP, and host across data sources.",
      ),
    ],
  }),

  createLesson({
    id: "soc-alert-triage",
    pathId: PATH,
    order: 4,
    title: "Alert Triage",
    summary:
      "Prioritization, false positives, enrichment, escalation criteria, and documenting triage decisions.",
    objectives: [
      "Apply a consistent triage workflow to incoming alerts",
      "Distinguish true positives, false positives, and benign true positives",
      "Know when and how to escalate to Tier 2 or incident response",
    ],
    introduction:
      "SOCs drown in alerts without disciplined triage. Triage is rapid structured assessment: Is this real? How severe? What context is missing? Should I act now or escalate? Good triage protects the organization without burning analysts on noise.",
    coreConcepts: [
      "Severity combines asset criticality, data sensitivity, and threat likelihood.",
      "Enrichment adds context: asset owner, user role, threat intel, recent changes.",
      "False positive: rule misfire; benign true positive: expected admin activity.",
      "Escalate when impact is high, scope unclear, or containment needed.",
      "Document disposition: true positive, false positive, duplicate, informational.",
    ],
    explanation:
      "Open alert → read rule description and raw events → identify affected entities → check change tickets (was this scheduled patching?) → query threat intel for IPs/hashes → assess blast radius. Low-severity duplicate scans from known vuln scanners may close as false positive with tuning ticket. Credential theft on domain admin warrants immediate escalation. SLAs define response times by priority. SOAR playbooks auto-enrich and present analysts a summary card. Quality metrics track reopen rate and escalation accuracy. Triage is not investigation depth — know when to hand off.",
    realWorld:
      "Alert fatigue caused missed SolarWinds-style dwell time at organizations that lacked prioritization. Tuning and risk-based scoring reduced Tier 1 queue 60% at mature SOCs.",
    scenario:
      "SIEM alerts 'Tor exit node login' for a developer account at 11 PM. Developer is on-call for production. Steps to triage?",
    terms: [
      { term: "Triage", definition: "Initial sorting of alerts by urgency and validity." },
      { term: "Enrichment", definition: "Adding context from CMDB, intel, and history to an alert." },
      { term: "Benign true positive", definition: "Detection fired correctly but activity was authorized." },
    ],
    mistakes: [
      "Closing alerts without notes — breaks shift handoff.",
      "Escalating everything, overwhelming Tier 2.",
      "Ignoring asset context when scoring severity.",
    ],
    defensive: [
      "Integrate CMDB and identity context into alert cards.",
      "Review top false positive rules weekly.",
      "Define clear escalation matrix by alert category.",
    ],
    quiz: [
      mcQuiz(
        "soc-tri-q1",
        "A false positive is:",
        ["A real attack", "An alert that does not indicate malicious activity", "A type of malware", "A backup failure"],
        1,
        "False positives are detection misfires or misconfigured rules.",
      ),
      tfQuiz(
        "soc-tri-q2",
        "Enrichment can include asset owner and threat intelligence context.",
        true,
        "Context helps analysts judge severity quickly.",
      ),
      mcQuiz(
        "soc-tri-q3",
        "Triage should be escalated when:",
        ["The alert is green", "Impact is high or scope is unclear", "It is lunch time", "Logs are UTF-8"],
        1,
        "High-impact or uncertain cases need deeper investigation.",
      ),
    ],
  }),

  createLesson({
    id: "soc-ioc",
    pathId: PATH,
    order: 5,
    title: "Indicators of Compromise",
    summary:
      "IPs, domains, hashes, and TTPs — collecting, validating, and operationalizing IOCs across the environment.",
    objectives: [
      "Define IOC types and their limitations",
      "Validate IOCs before widespread blocking",
      "Hunt and block using threat intelligence feeds",
    ],
    introduction:
      "Indicators of Compromise (IOCs) are forensic artifacts suggesting malicious activity — a C2 IP, malware hash, or email subject line from a campaign. SOC teams ingest IOCs from feeds, peers, and internal cases, then hunt across logs and configure blocks. IOCs are perishable; context and validation matter.",
    coreConcepts: [
      "IOC types: IP, domain, URL, file hash (MD5/SHA-256), email address, registry key, mutex.",
      "TTPs (tactics, techniques, procedures) outlast specific IOCs — ATT&CK framework.",
      "STIX/TAXII standardize intel sharing between organizations and tools.",
      "False positives from shared IOCs can block legitimate services — validate first.",
      "IOC age: stale IPs get reassigned; expire feeds regularly.",
    ],
    explanation:
      "Intel feed publishes SHA-256 of Emotet dropper. SOC imports to SIEM and EDR — historical search finds three hosts downloaded it last week. Containment initiated. For IPs, check passive DNS and whether CDN/shared hosting causes collateral damage before firewall block. Document source and confidence (OSINT vs commercial vs government). Internal IOCs from your incidents are highest fidelity. Combine IOC hits with behavioral detections — hash match alone on a renamed file still works; IP block alone may miss domain fronting.",
    realWorld:
      "ISACs share sector-specific IOCs during ransomware waves. Over-blocking Tor exit nodes without policy breaks developer workflows.",
    scenario:
      "Threat feed lists 203.0.113.55 as Cobalt Strike C2. One internal server contacted it once. Outline validation and response steps.",
    practical: [
      {
        kind: "alert",
        title: "IOC match",
        content:
          "EDR Alert: Known malicious hash\nSHA-256: a1b2c3…\nFile: C:\\Users\\jsmith\\Downloads\\invoice.exe\nIntel source: Commercial feed, confidence high",
      },
    ],
    terms: [
      { term: "IOC", definition: "Indicator of Compromise — artifact suggesting intrusion or malware." },
      { term: "TTP", definition: "Tactics, Techniques, and Procedures — how adversaries operate." },
      { term: "STIX/TAXII", definition: "Standards for structuring and transporting threat intelligence." },
    ],
    mistakes: [
      "Blocking IOCs globally without testing impact.",
      "Relying only on IOCs without behavioral detection.",
      "Never expiring old intel causing false blocks.",
    ],
    defensive: [
      "Automate IOC ingestion with confidence scoring and TTL.",
      "Hunt proactively with intel, not only react to matches.",
      "Map detections to MITRE ATT&CK for coverage gaps.",
    ],
    quiz: [
      mcQuiz(
        "soc-ioc-q1",
        "Which is an example of an IOC?",
        ["Office chair model", "Malware file SHA-256 hash", "Employee badge color", "Monitor refresh rate"],
        1,
        "Hashes of malicious files are classic IOCs.",
      ),
      tfQuiz(
        "soc-ioc-q2",
        "IOCs can become stale as attackers change infrastructure.",
        true,
        "IPs and domains rotate; TTPs persist longer.",
      ),
      mcQuiz(
        "soc-ioc-q3",
        "Before blocking a shared IOC IP organization-wide, you should:",
        ["Block immediately without review", "Validate impact and confidence", "Delete all logs", "Disable MFA"],
        1,
        "Validation prevents blocking legitimate services on shared IPs.",
      ),
    ],
  }),

  createLesson({
    id: "soc-incident-detection",
    pathId: PATH,
    order: 6,
    title: "Incident Detection",
    summary:
      "Detection engineering, behavioral analytics, threat hunting, and closing visibility gaps before attackers do.",
    objectives: [
      "Contrast signature, anomaly, and behavioral detection",
      "Describe threat hunting vs alert-driven work",
      "Identify common detection blind spots",
    ],
    introduction:
      "Detection is the SOC's radar. Signatures catch known bad; behavioral rules catch living-off-the-land techniques; hunts find what rules miss. Mature programs measure detection coverage against ATT&CK and continuously close gaps exposed by red team and real incidents.",
    coreConcepts: [
      "Signature detection matches known patterns — hashes, IDS rules, YARA.",
      "Anomaly detection baselines normal and flags deviations — UEBA.",
      "Behavioral detections focus on chains: macro → PowerShell → network.",
      "Threat hunting is hypothesis-driven search without waiting for alerts.",
      "Blind spots: encrypted traffic without inspection, personal devices, shadow IT.",
    ],
    explanation:
      "Detection engineers translate intel into SIEM rules and EDR policies. Example: 'LSASS memory access from non-system process' catches credential dumping. Hunts start with hypotheses: 'Are any service accounts doing interactive logins?' Run queries across 90 days. Purple team validates rules fire on simulated attacks. Machine learning assists UEBA but needs analyst feedback loops. Detection is not one-time — new log sources and attacker tradecraft require updates. Document detection data requirements so architects enable the right logging.",
    realWorld:
      "Organizations missed Log4j initially due to lack of JVM process visibility. Post-incident, detections targeted JNDI lookup patterns and vulnerable library versions.",
    scenario:
      "Red team used certutil.exe to download a payload. No signature matched. What detection approach might still catch this?",
    terms: [
      { term: "UEBA", definition: "User and Entity Behavior Analytics — baselines behavior to find anomalies." },
      { term: "Threat hunting", definition: "Proactive search for threats not yet surfaced by automated alerts." },
      { term: "Detection engineering", definition: "Designing, testing, and maintaining detection logic and data pipelines." },
    ],
    mistakes: [
      "Equating antivirus green status with absence of compromise.",
      "Deploying detections without purple-team validation.",
      "Hunting without hypotheses — random searching wastes time.",
    ],
    defensive: [
      "Map detections to MITRE ATT&CK and track coverage.",
      "Schedule regular hunt sprints with documented outcomes.",
      "Ensure EDR on all managed endpoints and critical servers.",
    ],
    quiz: [
      mcQuiz(
        "soc-det-q1",
        "Threat hunting is best described as:",
        ["Waiting for antivirus popups", "Proactive hypothesis-driven searching", "Deleting logs", "Disabling firewalls"],
        1,
        "Hunters seek hidden threats before alerts fire.",
      ),
      tfQuiz(
        "soc-det-q2",
        "Behavioral detections can catch living-off-the-land techniques using legitimate tools.",
        true,
        "Attack chains with built-in OS tools may evade signatures.",
      ),
      mcQuiz(
        "soc-det-q3",
        "A common detection blind spot is:",
        ["Too much documentation", "Unmonitored personal devices or shadow IT", "Excessive hashing", "Using UTC timestamps"],
        1,
        "Unmanaged assets lack telemetry SOCs rely on.",
      ),
    ],
  }),

  createLesson({
    id: "soc-ir-lifecycle",
    pathId: PATH,
    order: 7,
    title: "Incident Response Lifecycle",
    summary:
      "NIST phases — preparation, detection, analysis, containment, eradication, recovery, and post-incident lessons.",
    objectives: [
      "Name IR lifecycle phases and SOC role in each",
      "Apply containment strategies balancing business impact",
      "Conduct effective post-incident reviews",
    ],
    introduction:
      "When triage confirms an incident, structured response replaces ad hoc panic. The NIST incident response lifecycle guides SOC and IR teams from preparation through recovery and improvement. SOC analysts often own early detection and analysis; IR leads may coordinate containment with IT and executives.",
    coreConcepts: [
      "Preparation: playbooks, contacts, tooling, legal/regulatory awareness.",
      "Detection & Analysis: scope, timeline, affected assets, root cause hypothesis.",
      "Containment: short-term (isolate host) vs long-term (segment network, disable accounts).",
      "Eradication: remove malware, close access paths, patch vulnerabilities.",
      "Recovery: restore services, verify integrity, monitor for re-compromise.",
      "Post-incident: lessons learned, detection gaps, executive report.",
    ],
    explanation:
      "SOC escalates confirmed ransomware on HR-PC: short-term isolate VLAN, preserve memory if policy allows, notify IR lead. Analysis identifies phishing attachment origin. Containment blocks sender domain, resets creds for clicked users. Eradication redeploys host from gold image. Recovery validates backups before restore. Post-incident: add rule for similar attachment hash, phishing training, tabletop review. Communication plans keep legal informed for breach notification timelines. Document every action with timestamps for regulators and insurers.",
    realWorld:
      "Companies with practiced IR lifecycles contain breaches faster and face lower breach costs. SOCs without escalation authority delay containment waiting for approvals.",
    scenario:
      "Active data exfiltration from a database server is confirmed. List containment options and trade-offs for each.",
    terms: [
      { term: "Containment", definition: "Actions limiting incident spread — isolation, account disable, blocking IOCs." },
      { term: "Eradication", definition: "Removing attacker presence — malware, backdoors, unauthorized access." },
      { term: "Lessons learned", definition: "Post-incident review identifying improvements to people, process, and technology." },
    ],
    mistakes: [
      "Rebuilding systems before preserving forensic evidence.",
      "Skipping executive and legal notification on data breaches.",
      "No post-incident tracking — same gap exploited twice.",
    ],
    defensive: [
      "Maintain tested playbooks for top scenarios (ransomware, BEC, insider).",
      "Pre-authorize emergency containment actions for on-call SOC.",
      "Schedule post-incident reviews within two weeks of closure.",
    ],
    quiz: [
      mcQuiz(
        "soc-ir-q1",
        "Short-term containment might include:",
        ["Publishing press release first", "Isolating an affected host from the network", "Deleting all backups", "Ignoring the alert"],
        1,
        "Isolation limits spread while investigation continues.",
      ),
      tfQuiz(
        "soc-ir-q2",
        "Post-incident lessons learned should feed back into detection and preparation.",
        true,
        "Each incident should improve playbooks and controls.",
      ),
      mcQuiz(
        "soc-ir-q3",
        "Eradication focuses on:",
        ["Removing attacker access and malware", "Ordering office supplies", "Designing logos", "Increasing alert noise"],
        0,
        "Eradication eliminates the foothold and malicious artifacts.",
      ),
    ],
  }),

  createLesson({
    id: "soc-threat-intelligence",
    pathId: PATH,
    order: 8,
    title: "Threat Intelligence",
    summary:
      "Strategic, operational, and tactical intel — sources, fusion, and applying intelligence to SOC decisions.",
    objectives: [
      "Differentiate strategic, operational, and tactical threat intel",
      "Evaluate intel source reliability and relevance",
      "Apply intel to detection, hunting, and risk prioritization",
    ],
    introduction:
      "Threat intelligence is evidence-based knowledge about adversaries — who they target, how they operate, and what infrastructure they use. SOC teams consume intel to prioritize defenses, tune detections, and contextualize alerts. Not all intel is equal; analysts must assess timeliness, relevance, and source before acting.",
    coreConcepts: [
      "Strategic intel informs executives — industry targeting trends, geopolitical risk.",
      "Operational intel describes campaigns — actor TTPs, sector focus.",
      "Tactical intel is IOCs and signatures for immediate operational use.",
      "Sources: OSINT, commercial feeds, ISACs, government advisories, internal case data.",
      "Intelligence cycle: direction, collection, processing, analysis, dissemination, feedback.",
    ],
    explanation:
      "CISA advisory warns of ransomware targeting healthcare VPN appliances. Strategic: brief leadership on patch urgency. Operational: hunt for known actor TTPs in VPN logs. Tactical: import IOCs and YARA rules. Fusion analysts correlate external intel with internal telemetry — 'feed IP matches our firewall deny from Tuesday.' Avoid intel hoarding; disseminate actionable summaries to Tier 1. Measure intel utility: did imported IOCs generate true positives? Align intel consumption with PIRs (Priority Intelligence Requirements). Legal constraints apply to some government intel sharing.",
    realWorld:
      "Financial ISACs share fraud campaign IOCs hours before wide publication. SOCs ignoring sector intel miss sector-specific lures.",
    scenario:
      "Commercial feed reports a new phishing kit impersonating your brand. How does intel flow from strategic briefing to SOC detection?",
    terms: [
      { term: "Tactical intel", definition: "Immediate-use data like IOCs and malware signatures." },
      { term: "ISAC", definition: "Information Sharing and Analysis Center — sector threat sharing organization." },
      { term: "PIR", definition: "Priority Intelligence Requirement — questions intel collection should answer." },
    ],
    mistakes: [
      "Buying feeds without integration into SIEM/EDR workflows.",
      "Treating all intel as equally trustworthy.",
      "Strategic reports that never translate to detection or policy action.",
    ],
    defensive: [
      "Define PIRs aligned to business risk.",
      "Automate tactical intel ingestion with analyst review gates.",
      "Participate in sector ISACs and share anonymized internal IOCs.",
    ],
    quiz: [
      mcQuiz(
        "soc-ti-q1",
        "Tactical threat intelligence includes:",
        ["Executive risk summaries", "IOCs and malware hashes", "Office seating charts", "Annual revenue reports"],
        1,
        "Tactical intel is immediately operational — hashes, IPs, domains.",
      ),
      tfQuiz(
        "soc-ti-q2",
        "Threat intelligence should be evaluated for relevance to your organization.",
        true,
        "Sector and geography determine whether intel applies.",
      ),
      mcQuiz(
        "soc-ti-q3",
        "An ISAC primarily helps organizations:",
        ["Share sector-specific threat information", "Print business cards", "Manage payroll", "Design websites"],
        0,
        "ISACs facilitate peer and sector threat sharing.",
      ),
    ],
  }),
];

export const socAssessment = createPathAssessment(
  PATH,
  "SOC Analyst Path Assessment",
  [
    mcQuiz("soc-final-1", "Tier 1 analysts primarily:", ["Reverse kernel exploits only", "Triage and enrich alerts", "Approve mergers", "Write hardware drivers"], 1, "Tier 1 handles initial alert sorting."),
    mcQuiz("soc-final-2", "SIEM correlation helps by:", ["Deleting endpoints", "Linking events into attack patterns", "Disabling logs", "Formatting USB drives"], 1, "Correlation finds meaningful sequences."),
    tfQuiz("soc-final-3", "IOCs should be validated before organization-wide blocking.", true, "Shared IPs can cause collateral damage."),
    mcQuiz("soc-final-4", "MTTD measures:", ["Time to detect incidents", "Time to ship laptops", "Employee tenure", "DNS TTL"], 0, "MTTD is mean time from compromise to detection."),
    mcQuiz("soc-final-5", "Incident containment aims to:", ["Increase attacker access", "Limit spread of the incident", "Delete all evidence", "Disable all logging permanently"], 1, "Containment stops further damage during IR."),
  ],
);
