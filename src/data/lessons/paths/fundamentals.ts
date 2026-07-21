import type { Lesson } from "@/types/education";
import { createLesson, mcQuiz, tfQuiz } from "../lessonFactory";

const PATH = "fundamentals";

export const fundamentalsLessons: Lesson[] = [
  createLesson({
    id: "fundamentals-what-is-cybersecurity",
    pathId: PATH,
    order: 1,
    title: "What is Cybersecurity",
    summary:
      "The discipline of protecting systems, networks, and data from digital harm — and why every organization, regardless of size, is in scope.",
    estimatedMinutes: 20,
    objectives: [
      "Define cybersecurity and distinguish it from general IT support",
      "Identify the main categories of assets defenders protect",
      "Explain why cybersecurity is a business risk, not only a technical concern",
    ],
    introduction:
      "Cybersecurity is the practice of protecting computers, networks, data, and the people who use them from unauthorized access, disruption, theft, and damage. It spans technology, processes, and human behavior — not just firewalls and antivirus. Whether you are securing a personal laptop or a multinational cloud platform, the same principles apply: understand what you are protecting, who might attack it, and how to reduce harm when defenses fail.",
    coreConcepts: [
      "Cybersecurity protects the confidentiality, integrity, and availability of information and systems.",
      "Assets include data, software, hardware, identities, and reputation — not only servers.",
      "Threats come from criminals, insiders, hacktivists, nation-states, and accidental human error.",
      "Defense combines preventive controls, detective monitoring, and responsive recovery processes.",
    ],
    explanation:
      "At its core, cybersecurity asks three questions: what are we protecting, who wants it, and how do we stop them — or limit damage when we cannot? The field sits at the intersection of technology and risk management. A patched server that employees freely share credentials for is still insecure. A perfectly configured firewall cannot stop an employee from wiring money to a fraudster who spoofed the CEO's email.\n\nModern organizations store customer records, financial data, intellectual property, and operational secrets in digital form. A single breach can trigger regulatory fines, lawsuits, lost customers, and operational shutdown. That is why boards and executives increasingly treat cybersecurity as enterprise risk, not a niche IT problem.\n\nCybersecurity roles are diverse. Security analysts monitor alerts and investigate incidents. Engineers build secure software and infrastructure. GRC (governance, risk, and compliance) teams map controls to regulations. Penetration testers simulate attackers to find weaknesses before criminals do. All of these roles share a common vocabulary: assets, threats, vulnerabilities, controls, and risk.\n\nYou do not need to know every tool on day one. You need a mental model: identify valuable assets, understand realistic threats, apply layered controls, and prepare to detect and respond when something goes wrong. That model is what this fundamentals path builds.",
    realWorld:
      "The 2017 Equifax breach exposed data on roughly 147 million people because an unpatched Apache Struts vulnerability was left unaddressed for months despite a public fix. The technical failure was one missing patch; the organizational failure was weak vulnerability management and accountability. Cybersecurity incidents are rarely caused by a single magic hacker trick — they are usually a chain of neglected basics.",
    scenario:
      "You join a 40-person startup that stores customer payment details in a cloud database. The CEO asks, 'Do we need cybersecurity? We are too small to be a target.' How would you explain that size does not immunize them — automated attacks scan the entire internet, and stolen payment data has value regardless of company revenue?",
    practical: [
      {
        kind: "alert",
        title: "SOC triage alert",
        content:
          "ALERT: Multiple failed SSH logins from 203.0.113.44 against prod-web-01 (47 attempts / 10 min). Severity: Medium. Recommended action: Verify if IP is known partner; if not, block at firewall and review auth logs for successful logins.",
      },
    ],
    terms: [
      { term: "Asset", definition: "Anything of value to an organization — data, systems, people, or reputation — that security efforts aim to protect." },
      { term: "Threat", definition: "A potential cause of an unwanted incident, such as a criminal group, insider, or natural disaster affecting systems." },
      { term: "Vulnerability", definition: "A weakness in a system, process, or person that a threat could exploit." },
      { term: "Control", definition: "A safeguard or countermeasure designed to prevent, detect, or recover from security incidents." },
    ],
    mistakes: [
      "Assuming antivirus alone constitutes a security program.",
      "Believing small organizations are not targeted by automated attacks.",
      "Treating security as solely the IT department's job instead of a shared responsibility.",
    ],
    defensive: [
      "Inventory critical assets and data flows before buying security tools.",
      "Establish basic policies: acceptable use, password standards, and incident reporting.",
      "Patch operating systems and applications on a defined schedule.",
    ],
    quiz: [
      mcQuiz(
        "fund-cybersec-q1",
        "Which best describes cybersecurity?",
        ["Only installing antivirus software", "Protecting systems, networks, and data from digital harm", "Writing code faster", "Replacing all passwords monthly"],
        1,
        "Cybersecurity is a broad discipline covering technology, people, and processes — not a single product.",
      ),
      tfQuiz(
        "fund-cybersec-q2",
        "Automated attacks scan the entire internet, so small organizations can still be targeted.",
        true,
        "Attackers use bots to probe all reachable hosts; organization size does not prevent discovery.",
      ),
      mcQuiz(
        "fund-cybersec-q3",
        "A weakness that could be exploited is called a:",
        ["Asset", "Control", "Vulnerability", "Policy"],
        2,
        "Vulnerabilities are flaws in systems, configurations, or processes that threats can abuse.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-cia-triad",
    pathId: PATH,
    order: 2,
    title: "The CIA Triad",
    summary:
      "Confidentiality, integrity, and availability — the three foundational properties every security control ultimately serves.",
    estimatedMinutes: 20,
    objectives: [
      "Define confidentiality, integrity, and availability with concrete examples",
      "Identify which CIA property a given incident primarily violates",
      "Explain why security decisions often require balancing the three properties",
    ],
    introduction:
      "The CIA triad — Confidentiality, Integrity, and Availability — is the most widely used framework for describing what security protects. Every control you will ever deploy maps to at least one of these three properties. When analysts classify incidents or architects design systems, they ask: which part of CIA failed, and how do we restore it?",
    coreConcepts: [
      "Confidentiality ensures information is accessible only to authorized parties.",
      "Integrity ensures data and systems are accurate, complete, and unaltered by unauthorized parties.",
      "Availability ensures systems and data are accessible when needed by authorized users.",
      "Real incidents often violate more than one property simultaneously.",
    ],
    explanation:
      "Confidentiality is about secrecy. Encryption, access controls, data classification, and need-to-know policies all protect confidentiality. When attackers exfiltrate a customer database or an employee views records they should not access, confidentiality has been breached. Not every confidentiality failure involves hacking — misaddressed emails and publicly exposed S3 buckets are common causes.\n\nIntegrity is about trustworthiness. If an attacker changes bank account numbers in a payroll file, modifies a software update to include malware, or alters log entries to cover their tracks, integrity fails. Hash functions, digital signatures, version control, and change-management processes defend integrity. Integrity also covers system integrity: ensuring a server runs only intended software.\n\nAvailability ensures authorized users can reach services and data when needed. DDoS attacks, ransomware encryption, hardware failures, and misconfigured load balancers all threaten availability. Redundancy, backups, disaster recovery plans, and capacity planning defend availability. A system can be confidential and intact yet useless if it is offline.\n\nSecurity engineering involves trade-offs. Strong encryption protects confidentiality but can add latency affecting availability. Aggressive account lockout policies protect confidentiality but may deny legitimate users. Understanding CIA helps you articulate these trade-offs to stakeholders in plain language rather than arguing about tools.",
    realWorld:
      "The 2021 Colonial Pipeline ransomware attack primarily impacted availability — fuel distribution systems were shut down — but also raised integrity concerns about whether operational technology was altered. The 2016 Democratic National Committee email leak was a confidentiality failure. Financial fraud via altered wire-transfer instructions is an integrity failure. Classifying incidents by CIA property helps response teams prioritize: restore service, verify data accuracy, or contain data exposure.",
    scenario:
      "A hospital's electronic health record system is encrypted and backed up nightly. An attacker deploys ransomware that encrypts production databases, and clinicians cannot access patient records during surgery scheduling. Which CIA properties are affected? What is the immediate priority?",
    practical: [
      {
        kind: "log",
        title: "Integrity monitoring alert",
        content:
          "2026-03-15T14:22:01Z WARN  file-integrity-agent: Hash mismatch detected\n  Path: /etc/passwd\n  Expected SHA256: a3f2…8c1d\n  Current SHA256:  9b71…4e2f\n  Action: Alert SOC — unauthorized modification suspected",
      },
    ],
    terms: [
      { term: "Confidentiality", definition: "The property that information is not disclosed to unauthorized individuals, entities, or processes." },
      { term: "Integrity", definition: "The property that data and systems are accurate, complete, and protected from unauthorized modification." },
      { term: "Availability", definition: "The property that information and systems are accessible and usable on demand by authorized users." },
      { term: "DAD triad", definition: "The attacker mirror of CIA: Disclosure, Alteration, and Denial — what adversaries try to achieve." },
    ],
    mistakes: [
      "Focusing only on confidentiality while ignoring availability during incident response.",
      "Assuming encryption alone satisfies all three properties.",
      "Treating ransomware as only an availability problem when data exfiltration may also breach confidentiality.",
    ],
    defensive: [
      "Classify data by sensitivity to apply appropriate confidentiality controls.",
      "Use checksums, signing, and change detection for critical files and transactions.",
      "Design redundancy and tested recovery procedures for mission-critical systems.",
    ],
    quiz: [
      mcQuiz(
        "fund-cia-q1",
        "Ransomware that encrypts production files primarily threatens:",
        ["Confidentiality only", "Integrity only", "Availability (and often integrity)", "None of the above"],
        2,
        "Ransomware denies access to data (availability) and may alter or destroy files (integrity).",
      ),
      tfQuiz(
        "fund-cia-q2",
        "A leaked password database is primarily a confidentiality failure.",
        true,
        "Unauthorized disclosure of secrets is a classic confidentiality breach.",
      ),
      mcQuiz(
        "fund-cia-q3",
        "Digital signatures primarily support which CIA property?",
        ["Confidentiality", "Integrity", "Availability", "Redundancy"],
        1,
        "Signatures verify that content has not been tampered with since signing.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-threats-threat-actors",
    pathId: PATH,
    order: 3,
    title: "Threats and Threat Actors",
    summary:
      "Who attacks systems, why they do it, and how understanding adversary motivation improves your defenses.",
    estimatedMinutes: 22,
    objectives: [
      "Categorize common threat actor types and their typical motivations",
      "Distinguish between threats, threat actors, and attack vectors",
      "Explain why threat modeling starts with understanding the adversary",
    ],
    introduction:
      "A threat is any circumstance or event with the potential to cause harm. Threat actors are the people or groups behind those events — cybercriminals, insiders, hacktivists, nation-states, and even untrained employees who click the wrong link. Defenders who understand who might attack them, and why, make better decisions about which controls to prioritize.",
    coreConcepts: [
      "Threat actors differ in capability, resources, motivation, and persistence.",
      "Cybercriminals are typically financially motivated; nation-states pursue espionage or disruption.",
      "Insider threats include both malicious employees and careless users who cause accidental harm.",
      "Attack vectors describe how threats reach assets — email, web, USB, supply chain, and more.",
    ],
    explanation:
      "Cybercriminals range from solo scammers to organized ransomware gangs operating as businesses with help desks and affiliate programs. They target anything that converts to money: stolen credentials sold on dark web markets, ransomware payments, business email compromise wire fraud, and cryptojacking. They favor high-volume, low-effort attacks — phishing at scale, exploiting known vulnerabilities on internet-facing servers.\n\nNation-state actors (advanced persistent threats, or APTs) have significant resources and patience. They pursue strategic goals: intellectual property theft, political intelligence, critical infrastructure disruption, or pre-positioning for future conflicts. Their campaigns may remain hidden for months or years. Defending against APTs requires detection capabilities beyond what stops opportunistic criminals.\n\nInsider threats are among the hardest to detect because insiders already have legitimate access. A disgruntled administrator exporting customer data before resigning is malicious. An employee who emails a spreadsheet to a personal account for convenience is negligent. Both can cause breaches. Controls include least privilege, logging, data loss prevention, and separation of duties.\n\nHacktivists attack for ideological reasons — defacing websites, leaking data, or conducting DDoS attacks against organizations they oppose. Script kiddies use pre-built tools without deep expertise but can still cause damage. Finally, do not forget environmental threats: fires, floods, and power outages threaten availability even without a human adversary.",
    realWorld:
      "The Lazarus Group, linked to North Korea, has stolen hundreds of millions in cryptocurrency and conducted destructive attacks like the 2014 Sony Pictures hack. Meanwhile, groups like LockBit operate ransomware-as-a-service, recruiting affiliates who split profits. A small business is unlikely to face Lazarus but very likely to receive LockBit-style phishing emails. Threat intelligence helps organizations focus on realistic adversaries.",
    scenario:
      "Your company develops medical device firmware. The CISO asks you to list the three most likely threat actor types and their motivations. Criminals might ransom patient data; a nation-state might steal firmware source code; a negligent contractor might leave a test environment publicly accessible. How would you rank these by likelihood versus impact?",
    practical: [
      {
        kind: "log",
        title: "Threat intelligence feed entry",
        content:
          "IOC Type: IPv4 | Value: 198.51.100.77\nActor: FIN7 (cybercriminal)\nTTP: Spear-phishing with macro-enabled documents\nTarget sectors: Retail, hospitality\nConfidence: High | Last seen: 2026-03-10",
      },
    ],
    terms: [
      { term: "Threat actor", definition: "An individual or group that conducts attacks against systems or data." },
      { term: "APT", definition: "Advanced Persistent Threat — typically a skilled, well-resourced group (often nation-state) that maintains long-term access." },
      { term: "Attack vector", definition: "The path or means by which an attacker delivers a payload or gains access, e.g., email or a web exploit." },
      { term: "Motivation", definition: "The reason behind an attack — financial gain, espionage, ideology, revenge, or curiosity." },
    ],
    mistakes: [
      "Designing defenses only against sophisticated nation-states while ignoring common criminal phishing.",
      "Assuming all insiders are malicious rather than accounting for negligence.",
      "Conflating threats (what could happen) with vulnerabilities (weaknesses that enable it).",
    ],
    defensive: [
      "Maintain threat intelligence relevant to your industry and geography.",
      "Apply controls proportional to realistic adversaries — not every org needs APT-grade tooling.",
      "Monitor for insider indicators: bulk downloads, off-hours access, and privilege escalation.",
    ],
    quiz: [
      mcQuiz(
        "fund-threats-q1",
        "Which threat actor is most commonly motivated by direct financial gain?",
        ["Hacktivist", "Cybercriminal", "Competitive researcher", "Environmental hazard"],
        1,
        "Cybercriminals typically monetize attacks through fraud, theft, or ransomware.",
      ),
      tfQuiz(
        "fund-threats-q2",
        "Insider threats can include employees who cause harm accidentally, not only those acting maliciously.",
        true,
        "Negligent insiders with legitimate access are a major source of data breaches.",
      ),
      mcQuiz(
        "fund-threats-q3",
        "An email delivering a malicious attachment is an example of a(n):",
        ["Vulnerability", "Attack vector", "Security control", "Hash function"],
        1,
        "The vector is the delivery mechanism — email — not the weakness being exploited.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-vulnerabilities",
    pathId: PATH,
    order: 4,
    title: "Vulnerabilities",
    summary:
      "Weaknesses in software, configuration, and process that attackers exploit — and how organizations find and fix them.",
    estimatedMinutes: 22,
    objectives: [
      "Define vulnerability and distinguish it from threat and risk",
      "Identify common vulnerability sources: software flaws, misconfigurations, and human factors",
      "Describe the vulnerability management lifecycle from discovery to remediation",
    ],
    introduction:
      "A vulnerability is a weakness that a threat actor can exploit to compromise confidentiality, integrity, or availability. Vulnerabilities exist in code, hardware firmware, network configurations, physical security, and human behavior. No system is vulnerability-free; mature organizations discover them proactively, prioritize fixes, and accept residual risk when patching is not immediately possible.",
    coreConcepts: [
      "Vulnerabilities are documented in databases like CVE with severity scores such as CVSS.",
      "Unpatched software, default credentials, and open ports are common vulnerability sources.",
      "Zero-day vulnerabilities have no public patch; known vulnerabilities with available fixes are often still exploited.",
      "Vulnerability management is a continuous cycle: discover, prioritize, remediate, verify.",
    ],
    explanation:
      "Software vulnerabilities arise from programming errors — buffer overflows, SQL injection flaws, race conditions, and logic bugs. When vendors publish patches, they assign CVE (Common Vulnerabilities and Exposures) identifiers. The CVSS (Common Vulnerability Scoring System) rates severity from 0 to 10, helping teams prioritize. A CVSS 9.8 remote code execution flaw on an internet-facing server demands faster action than a low-severity local information disclosure on an isolated test machine.\n\nMisconfiguration is equally dangerous and often easier for attackers to find. Cloud storage buckets set to public read, admin panels without authentication, debug endpoints left enabled in production, and firewall rules allowing any-to-any traffic are vulnerabilities even when the underlying software is patched. Configuration management and regular audits address this class of weakness.\n\nHuman vulnerabilities matter too. Employees who reuse passwords, fail to report suspicious emails, or bypass security for convenience create exploitable conditions. Social engineering targets human judgment rather than software bugs, but the outcome is the same: unauthorized access or data loss.\n\nThe vulnerability management lifecycle begins with discovery — vulnerability scanners, penetration tests, bug bounty programs, and vendor advisories. Next, teams prioritize based on severity, exploitability, asset criticality, and compensating controls. Remediation may mean patching, reconfiguring, disabling a feature, or applying a WAF rule as a temporary measure. Finally, verification confirms the fix worked. Unpatched known vulnerabilities remain one of the top causes of breaches worldwide.",
    realWorld:
      "Log4Shell (CVE-2021-44228) was a critical vulnerability in the widely used Log4j logging library. Because Log4j was embedded in countless applications, organizations spent weeks identifying affected systems and applying mitigations. Companies that lacked asset inventory and vulnerability scanning struggled far longer than those with mature programs. The flaw was public; attackers automated exploitation within hours.",
    scenario:
      "A weekly vulnerability scan reports CVE-2024-1234 (CVSS 8.1) on your company's customer-facing web server. The vendor patch requires a brief maintenance window. Marketing has a product launch in 48 hours and asks to delay patching. How do you assess risk, and what compensating controls might you apply short-term?",
    practical: [
      {
        kind: "command",
        title: "Scan for open ports",
        content:
          "nmap -sV -p 1-1024,8080,8443 staging.example.com\n\nPORT    STATE SERVICE  VERSION\n22/tcp  open  ssh      OpenSSH 8.9\n80/tcp  open  http     nginx 1.18.0\n443/tcp open  ssl/http nginx 1.18.0\n3306/tcp open mysql    MySQL 8.0.32  ← database exposed to network",
      },
    ],
    terms: [
      { term: "CVE", definition: "Common Vulnerabilities and Exposures — a standardized identifier for publicly known security flaws." },
      { term: "CVSS", definition: "Common Vulnerability Scoring System — a numerical severity rating for vulnerabilities, typically 0.0 to 10.0." },
      { term: "Zero-day", definition: "A vulnerability unknown to the vendor or public, with no available patch." },
      { term: "Misconfiguration", definition: "An incorrect system or application setting that creates a security weakness without a software bug." },
    ],
    mistakes: [
      "Patching only by CVSS score without considering asset exposure and exploitability.",
      "Running vulnerability scans without a remediation workflow — findings that never get fixed.",
      "Assuming cloud providers automatically secure all customer configurations.",
    ],
    defensive: [
      "Maintain an accurate asset inventory so you know what to scan and patch.",
      "Establish SLAs for critical vulnerability remediation based on severity and exposure.",
      "Use automated scanning and test patches in staging before production deployment.",
    ],
    quiz: [
      mcQuiz(
        "fund-vuln-q1",
        "A publicly exposed database with default credentials is primarily a:",
        ["Threat", "Misconfiguration vulnerability", "Encryption algorithm", "Availability control"],
        1,
        "Default credentials on an exposed service are a configuration vulnerability.",
      ),
      tfQuiz(
        "fund-vuln-q2",
        "A zero-day vulnerability has no publicly available patch at the time of discovery.",
        true,
        "Zero-days are unknown or unpatched flaws that defenders must mitigate through other controls.",
      ),
      mcQuiz(
        "fund-vuln-q3",
        "CVE identifiers are used to:",
        ["Encrypt network traffic", "Standardize naming of known vulnerabilities", "Authenticate users", "Block DDoS attacks"],
        1,
        "CVE provides a common reference for tracking and discussing specific vulnerabilities.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-risk",
    pathId: PATH,
    order: 5,
    title: "Risk",
    summary:
      "How organizations measure and manage security risk using likelihood, impact, and the relationship between threats, vulnerabilities, and assets.",
    estimatedMinutes: 22,
    objectives: [
      "Define risk in cybersecurity terms using threat, vulnerability, and impact",
      "Distinguish between inherent risk, residual risk, and risk acceptance",
      "Explain why perfect security is impossible and prioritization is essential",
    ],
    introduction:
      "Risk is the potential for loss or damage when a threat exploits a vulnerability. Security teams cannot eliminate all risk — budgets, usability, and business speed impose limits. Instead, they identify risks, assess likelihood and impact, apply controls to reduce them, and consciously accept what remains. Understanding risk language helps you communicate with executives who think in terms of dollars and reputation, not CVE numbers.",
    coreConcepts: [
      "Risk is commonly expressed as a function of threat, vulnerability, likelihood, and impact.",
      "Controls reduce either the likelihood of an event or its impact when it occurs.",
      "Risk acceptance is a deliberate decision when mitigation cost exceeds potential loss.",
      "Quantitative and qualitative methods both help prioritize security investments.",
    ],
    explanation:
      "The classic risk formula is often stated as Risk = Threat × Vulnerability × Impact, though practitioners use various models. A threat without a vulnerability creates no exploitable risk. A vulnerability on an isolated lab machine with no sensitive data poses lower risk than the same flaw on a production database server. Impact measures how badly the organization would be hurt: financial loss, regulatory penalties, operational downtime, and reputational damage.\n\nInherent risk is the exposure before controls are applied. A public-facing web application storing credit cards has high inherent risk. Residual risk remains after controls like firewalls, encryption, monitoring, and secure coding practices are in place. The goal is to reduce residual risk to a level the organization can tolerate — its risk appetite.\n\nRisk treatment options include mitigation (apply controls), transfer (cyber insurance), avoidance (stop the risky activity), and acceptance (document and monitor). A startup may accept the risk of not having a 24/7 SOC initially but cannot accept storing passwords in plaintext. These decisions should be documented, not accidental.\n\nQualitative risk assessment uses labels like Low, Medium, High based on expert judgment. Quantitative methods assign dollar values — Annual Loss Expectancy (ALE) = Single Loss Expectancy × Annual Rate of Occurrence. Both approaches help prioritize: patching the internet-facing RCE flaw before the low-severity informational finding on an internal wiki is common sense, but formal risk registers make trade-offs visible to leadership.",
    realWorld:
      "After the Target breach in 2013, investigations revealed that network segmentation controls could have limited lateral movement from HVAC vendors to payment systems. The vulnerability existed, the threat was known (criminal card-data theft), but risk was underestimated. Organizations now use risk registers tied to business units, requiring sign-off when residual risk exceeds appetite. Cyber insurance has grown into a multi-billion-dollar industry that transfers some financial risk — but insurers increasingly demand baseline controls before issuing policies.",
    scenario:
      "Your risk committee must choose between two projects: deploying MFA for all employees ($80K) or upgrading endpoint detection on 500 laptops ($120K). Last year you had three successful phishing-related account takeovers but no malware outbreaks. How would you frame the risk comparison to help leadership decide?",
    practical: [
      {
        kind: "alert",
        title: "Risk register excerpt",
        content:
          "RISK-047 | Unpatched VPN appliance\nLikelihood: High | Impact: Critical | Inherent: Critical\nControls: IPS rule (temporary), patch scheduled 2026-03-20\nResidual: Medium | Owner: Infrastructure | Status: In progress",
      },
    ],
    terms: [
      { term: "Risk appetite", definition: "The level of risk an organization is willing to accept in pursuit of its objectives." },
      { term: "Residual risk", definition: "Risk remaining after security controls have been applied." },
      { term: "Likelihood", definition: "The probability that a threat event will occur and successfully exploit a vulnerability." },
      { term: "Impact", definition: "The magnitude of harm if a risk event occurs — financial, operational, legal, or reputational." },
    ],
    mistakes: [
      "Treating risk assessment as a one-time checkbox exercise instead of ongoing management.",
      "Ignoring business context — a 'high' technical severity may be 'low' organizational risk on an isolated system.",
      "Accepting risk informally without documentation or executive awareness.",
    ],
    defensive: [
      "Maintain a risk register linking assets, threats, controls, and owners.",
      "Reassess risk when architecture, data, or threat landscape changes.",
      "Align security spending with risks that threaten critical business objectives.",
    ],
    quiz: [
      mcQuiz(
        "fund-risk-q1",
        "Residual risk is:",
        ["Risk before any controls exist", "Risk remaining after controls are applied", "Risk that only affects servers", "Risk with zero impact"],
        1,
        "Residual risk is what remains after mitigation efforts.",
      ),
      tfQuiz(
        "fund-risk-q2",
        "A vulnerability on a system with no sensitive data and no network exposure may pose lower risk than the same flaw on a production database.",
        true,
        "Context — asset value and exposure — determines actual risk, not severity alone.",
      ),
      mcQuiz(
        "fund-risk-q3",
        "Purchasing cyber insurance is an example of:",
        ["Risk mitigation", "Risk transfer", "Risk avoidance", "Vulnerability scanning"],
        1,
        "Insurance transfers financial impact of a breach to the insurer.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-security-controls",
    pathId: PATH,
    order: 6,
    title: "Security Controls",
    summary:
      "The safeguards — technical, administrative, and physical — that prevent, detect, and recover from security incidents.",
    estimatedMinutes: 20,
    objectives: [
      "Classify controls as preventive, detective, corrective, or compensating",
      "Distinguish technical, administrative, and physical control types",
      "Map common security tools to their control categories",
    ],
    introduction:
      "Security controls are the policies, procedures, and technologies organizations deploy to manage risk. They do not eliminate threats — they reduce likelihood or limit impact. Controls are categorized by function (what they do) and type (how they are implemented). Frameworks like NIST and ISO 27001 organize hundreds of controls; understanding the categories helps you see how firewalls, training programs, and badge readers all fit the same model.",
    coreConcepts: [
      "Preventive controls stop incidents before they occur — firewalls, access controls, encryption.",
      "Detective controls identify incidents in progress or after the fact — SIEM, IDS, audit logs.",
      "Corrective controls restore systems and fix root causes — backups, patches, incident response.",
      "Administrative controls include policies, training, and background checks; physical controls include locks and cameras.",
    ],
    explanation:
      "Preventive controls are your first line. Network firewalls block unauthorized traffic. Strong authentication prevents unauthorized logins. Input validation stops injection attacks. Encryption prevents data interception. The principle of least privilege ensures users and services have only the access they need. Preventive controls are ideal but never perfect — attackers innovate, employees make mistakes, and zero-days appear.\n\nDetective controls assume prevention will fail. Security information and event management (SIEM) systems correlate logs from firewalls, servers, and applications to surface anomalies. Intrusion detection systems flag suspicious network patterns. File integrity monitoring alerts when critical files change. Detective controls shorten the time between breach and discovery — critical because attackers often dwell undetected for weeks.\n\nCorrective controls respond after detection. Incident response playbooks guide containment and eradication. Backups enable recovery from ransomware. Patch management fixes root vulnerabilities. Disaster recovery plans restore operations. Without corrective capabilities, detection only tells you that you have already lost.\n\nCompensating controls provide alternative protection when a primary control cannot be implemented — for example, network segmentation when a legacy system cannot be patched. Administrative controls (security awareness training, acceptable use policies, change management) and physical controls (data center badge access, cable locks, shredders) are equally essential. A perfect firewall cannot stop someone from walking out with an unencrypted laptop.",
    realWorld:
      "PCI DSS requires merchants handling card data to implement specific controls: firewalls, encryption, access restrictions, logging, and regular testing. Organizations map their controls to frameworks for compliance audits and customer assurance. A mature program measures control effectiveness — not just whether a SIEM is deployed, but whether alerts are triaged within defined SLAs and whether phishing simulation click rates decline after training.",
    scenario:
      "A startup has a firewall and antivirus but no centralized logging, no employee security training, and backups that have never been tested. Classify what they have and identify the biggest gaps across preventive, detective, and corrective categories.",
    practical: [
      {
        kind: "log",
        title: "Control audit finding",
        content:
          "Control ID: AC-2 (Account Management)\nType: Administrative | Function: Preventive\nFinding: 14 dormant accounts with active privileges (>90 days no login)\nRecommendation: Disable unused accounts; implement quarterly access reviews",
      },
    ],
    terms: [
      { term: "Preventive control", definition: "A safeguard designed to stop security incidents before they occur." },
      { term: "Detective control", definition: "A safeguard that identifies and reports security events or policy violations." },
      { term: "Compensating control", definition: "An alternative safeguard used when a primary required control cannot be implemented." },
      { term: "Least privilege", definition: "The principle of granting users and systems only the minimum access needed to perform their function." },
    ],
    mistakes: [
      "Deploying detective tools without staff to monitor and respond to alerts.",
      "Relying solely on technical controls while ignoring policy and training.",
      "Assuming compliance with a checklist means controls are actually effective.",
    ],
    defensive: [
      "Balance preventive, detective, and corrective controls — not just prevention.",
      "Test controls regularly: restore from backup, run tabletop exercises, simulate phishing.",
      "Document which controls protect which assets for audit and improvement cycles.",
    ],
    quiz: [
      mcQuiz(
        "fund-controls-q1",
        "A SIEM that correlates security logs is primarily a:",
        ["Preventive control", "Detective control", "Physical control", "Encryption algorithm"],
        1,
        "SIEM systems detect anomalies and incidents by analyzing event data.",
      ),
      tfQuiz(
        "fund-controls-q2",
        "Security awareness training is an administrative control.",
        true,
        "Training is a policy/process-based administrative safeguard.",
      ),
      mcQuiz(
        "fund-controls-q3",
        "Restoring systems from a verified backup after ransomware is a:",
        ["Detective control", "Corrective control", "Threat actor technique", "Vulnerability"],
        1,
        "Backup recovery corrects the impact of an incident and restores operations.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-auth-vs-authz",
    pathId: PATH,
    order: 7,
    title: "Authentication vs Authorization",
    summary:
      "Authentication proves who you are; authorization decides what you are allowed to do — and confusing them causes serious breaches.",
    estimatedMinutes: 20,
    objectives: [
      "Clearly distinguish authentication from authorization with examples",
      "Explain why hiding UI elements is not authorization",
      "Identify common failures in session management and access control",
    ],
    introduction:
      "Authentication and authorization are foundational concepts that beginners often conflate. Authentication verifies identity — answering 'Who are you?' Authorization enforces permissions after identity is established — answering 'What may you do?' A system that authenticates users correctly but fails to authorize each action is vulnerable to privilege escalation and horizontal access abuse.",
    coreConcepts: [
      "Authentication factors include something you know (password), have (token), and are (biometric).",
      "Authorization is enforced server-side on every sensitive request, not just at login.",
      "Sessions and tokens carry authenticated identity between requests.",
      "Broken access control — including IDOR — is one of the most common web application flaws.",
    ],
    explanation:
      "Authentication methods range from passwords and passkeys to smart cards and certificates. Multi-factor authentication combines categories to resist credential theft. When you log in to a banking app, the server validates your credentials (or biometric) and creates a session — typically a random token stored in an HTTP-only cookie. That session proves your identity on subsequent requests without re-entering your password each time.\n\nAuthorization happens after authentication. A standard user may view their own orders but not another customer's. An admin may manage users but should not access payroll without a specific role. Every API endpoint and server action must check: is this authenticated identity permitted to perform this operation on this resource? Client-side checks — hiding admin buttons in JavaScript — are for usability only. Attackers bypass the UI and call APIs directly.\n\nCommon failures include insecure direct object references (IDOR): changing /api/invoice/1001 to /api/invoice/1002 to read someone else's data. Privilege escalation occurs when a regular user accesses admin functions. Session fixation and weak session expiration let attackers reuse stolen tokens. Default credentials on admin panels authenticate anyone who knows the factory password.\n\nSecure design separates identity (authentication) from permission (authorization). Use established identity providers where appropriate. Store sessions securely. Enforce role-based or attribute-based access control on the server. Log authorization failures — they often indicate attack attempts.",
    realWorld:
      "In 2019, a flaw in Facebook's photo API allowed application users to access photos users had uploaded but not shared publicly. Users were authenticated, but authorization checks on the specific photo albums failed. Broken access control appears repeatedly in OWASP Top 10 lists because developers test happy paths — logged-in user accesses own data — but not adversarial paths.",
    scenario:
      "A web app returns order details at GET /api/orders/{id}. Logged-in user Alice (id=42) changes the URL from /api/orders/501 to /api/orders/502 and sees Bob's order. Which concept failed — authentication or authorization? What server-side fix is required?",
    practical: [
      {
        kind: "http",
        title: "Authorization failure",
        content:
          "GET /api/orders/502 HTTP/1.1\nHost: shop.example.com\nCookie: session=alice_session_token\n\n→ 200 OK\n{ \"orderId\": 502, \"userId\": 87, \"total\": 149.99 }\n← Server returned another user's order without checking ownership",
      },
    ],
    terms: [
      { term: "Authentication", definition: "The process of verifying the identity of a user, device, or service." },
      { term: "Authorization", definition: "The process of determining whether an authenticated identity may access a specific resource or action." },
      { term: "IDOR", definition: "Insecure Direct Object Reference — accessing objects by modifying identifiers without ownership checks." },
      { term: "Session", definition: "A server-side or token-based mechanism that maintains authenticated state across HTTP requests." },
    ],
    mistakes: [
      "Checking roles only in the frontend while APIs remain unprotected.",
      "Using predictable or sequential object IDs without per-request authorization.",
      "Assuming VPN login alone authorizes access to all internal applications.",
    ],
    defensive: [
      "Enforce authorization on every API call and server action, not only at login.",
      "Use indirect references or UUIDs where appropriate; always verify ownership server-side.",
      "Implement least privilege roles and audit privileged access regularly.",
    ],
    quiz: [
      mcQuiz(
        "fund-auth-q1",
        "Logging in with a username and password is primarily:",
        ["Authorization", "Authentication", "Encryption", "Hashing"],
        1,
        "Login verifies identity — that is authentication.",
      ),
      tfQuiz(
        "fund-auth-q2",
        "Hiding an admin button in the user interface is sufficient to prevent unauthorized admin actions.",
        false,
        "Authorization must be enforced server-side; UI hiding is not a security control.",
      ),
      mcQuiz(
        "fund-auth-q3",
        "Changing an order ID in a URL to view another user's data is an example of:",
        ["MFA bypass", "IDOR / broken access control", "Phishing", "DDoS"],
        1,
        "Accessing objects by manipulating identifiers without permission checks is IDOR.",
      ),
    ],
    practiceLink: {
      label: "Vulnerable Lab: Broken Login",
      to: "/vulnerable-lab/broken-login",
      type: "vulnerable-lab",
    },
  }),

  createLesson({
    id: "fundamentals-password-security",
    pathId: PATH,
    order: 8,
    title: "Password Security",
    summary:
      "How passwords are stored, attacked, and defended — and why length and uniqueness matter more than clever complexity rules.",
    estimatedMinutes: 20,
    objectives: [
      "Explain why passwords must never be stored in plaintext",
      "Describe password attacks: brute force, dictionary, and credential stuffing",
      "Recommend modern password policies aligned with NIST guidance",
    ],
    introduction:
      "Passwords remain the most common authentication factor despite decades of alternatives. They are also the most commonly stolen and reused credential. Understanding how passwords are hashed, how attackers crack them, and what policies actually help users choose strong secrets is essential for every security professional — whether you are writing login code or advising employees.",
    coreConcepts: [
      "Passwords should be stored as salted hashes using slow algorithms like bcrypt, scrypt, or Argon2.",
      "Credential stuffing reuses breached username/password pairs from other sites.",
      "Length and uniqueness matter more than forced special-character rotation schedules.",
      "Password managers and passkeys reduce human memorization burden.",
    ],
    explanation:
      "When you create an account, the server must never store your password in plaintext. Instead, it applies a one-way hash function — bcrypt, scrypt, or Argon2 are current best choices because they are deliberately slow, making brute-force guessing expensive. A unique salt (random data per password) ensures identical passwords produce different hashes, defeating rainbow table attacks. If a database leaks, attackers get hashes, not passwords — but weak passwords still fall quickly to offline cracking.\n\nAttackers obtain credentials through phishing, malware keyloggers, database breaches, and guessing. Brute force tries every combination; dictionary attacks try common passwords and leaked lists. Credential stuffing automates login attempts using billions of pairs from prior breaches — effective because many users reuse passwords across sites. Rate limiting, CAPTCHA, and account lockout slow online attacks; only strong hashing slows offline attacks after a breach.\n\nModern guidance from NIST (SP 800-63B) de-emphasizes forced periodic password changes and complex composition rules that produce predictable patterns like Summer2024!. Instead, encourage long passphrases, block known-compromised passwords, and mandate MFA for sensitive accounts. Password managers generate and store unique credentials per site, dramatically reducing reuse risk.\n\nDevelopers must implement secure password reset flows, protect against user enumeration in error messages, and use HTTPS everywhere. Administrators should monitor for breach lists and disable compromised accounts. Users should enable MFA and never reuse passwords — but security succeeds when systems make the right choice easy, not when policies blame users for human memory limits.",
    realWorld:
      "The 2012 LinkedIn breach exposed SHA-1 hashed passwords without adequate salting; millions were cracked within days. Attackers then used those credentials on other platforms — credential stuffing at scale. Have I Been Pwned (HIBP) now lets services check whether passwords appear in known breach corpora. Companies like Microsoft report that over 99% of password spray attacks are blocked by MFA.",
    scenario:
      "A developer proposes storing passwords as MD5 hashes 'for speed' and emailing users their passwords when they forget them. List every problem with this design and what you would recommend instead.",
    practical: [
      {
        kind: "command",
        title: "Password hash comparison",
        content:
          "# Weak — fast MD5, no salt (cracks in seconds)\nMD5(\"password123\") → 482c811da5d5b4bc6d497ffa98491e38\n\n# Strong — bcrypt with salt (designed to be slow)\nbcrypt(\"correct-horse-battery-staple\", $salt) → $2b$12$KIXx…8yWu",
      },
    ],
    terms: [
      { term: "Salt", definition: "Random data added to a password before hashing to ensure identical passwords produce different hash outputs." },
      { term: "Credential stuffing", definition: "Automated login attempts using username/password pairs stolen from other breaches." },
      { term: "bcrypt", definition: "A password hashing function designed to be computationally expensive, resisting brute-force attacks." },
      { term: "Passphrase", definition: "A long sequence of words used as a password, offering high entropy and memorability." },
    ],
    mistakes: [
      "Storing or transmitting passwords in plaintext — ever.",
      "Using fast hashes like MD5 or SHA-256 without a dedicated password hashing algorithm.",
      "Forcing frequent password changes that encourage minor predictable variations.",
    ],
    defensive: [
      "Hash passwords with bcrypt, scrypt, or Argon2 plus unique salts per user.",
      "Check new passwords against breach corpora; enforce MFA on sensitive accounts.",
      "Implement rate limiting and monitoring on login endpoints.",
    ],
    quiz: [
      mcQuiz(
        "fund-pw-q1",
        "Why are salts used when storing password hashes?",
        ["To encrypt passwords for recovery", "To ensure identical passwords produce different hashes", "To speed up login", "To replace MFA"],
        1,
        "Salts defeat rainbow tables and prevent hash comparison across users.",
      ),
      tfQuiz(
        "fund-pw-q2",
        "Credential stuffing uses passwords stolen from one site to attempt logins on other sites.",
        true,
        "Reuse across sites makes stuffing effective after any breach.",
      ),
      mcQuiz(
        "fund-pw-q3",
        "Which is currently recommended for password storage?",
        ["Plaintext in a database", "MD5 without salt", "bcrypt or Argon2 with per-user salt", "Base64 encoding"],
        2,
        "Slow, salted password hashing algorithms resist offline cracking.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-mfa",
    pathId: PATH,
    order: 9,
    title: "Multi-Factor Authentication (MFA)",
    summary:
      "Adding a second factor beyond passwords — how MFA works, which methods resist phishing, and why it blocks most account takeover attacks.",
    estimatedMinutes: 20,
    objectives: [
      "Define the three authentication factor categories and how MFA combines them",
      "Compare MFA methods: TOTP, push notifications, hardware keys, and SMS",
      "Explain why MFA is one of the highest-return security controls for organizations",
    ],
    introduction:
      "Multi-factor authentication requires users to present two or more independent proofs of identity before access is granted. Even if an attacker steals a password through phishing or a data breach, MFA blocks most account takeover attempts because the second factor is harder to obtain remotely. Microsoft and Google have published data showing MFA stops the vast majority of automated credential attacks.",
    coreConcepts: [
      "Factors: something you know (password), have (token/phone), are (biometric).",
      "TOTP apps generate time-based one-time codes; hardware keys use FIDO2/WebAuthn.",
      "SMS codes are better than nothing but vulnerable to SIM swapping and interception.",
      "Phishing-resistant MFA (passkeys, FIDO2 security keys) binds authentication to the legitimate site.",
    ],
    explanation:
      "Single-factor authentication — typically a password — fails when credentials are phished, guessed, or leaked. MFA adds a second hurdle. Time-based one-time passwords (TOTP) from apps like Google Authenticator or Authy generate six-digit codes that change every 30 seconds. The server and app share a secret; an attacker with only the password cannot generate valid codes without the device.\n\nPush-notification MFA sends an approval request to a registered mobile app. It is convenient but susceptible to MFA fatigue attacks — attackers spam push requests until the user approves one accidentally. Number matching (user must enter a code shown on the login screen) reduces this risk. SMS one-time codes are widely deployed but weaker: SIM swap attacks redirect text messages to attacker-controlled phones.\n\nHardware security keys (YubiKey, Titan) implement FIDO2/WebAuthn standards. The key cryptographically signs a challenge tied to the specific website domain, making phishing nearly impossible — a fake login page cannot complete the handshake. Passkeys extend this model using device biometrics and cloud sync. For high-value accounts (admins, executives, cloud consoles), phishing-resistant MFA is the gold standard.\n\nRolling out MFA requires planning: backup codes for lost devices, helpdesk procedures for lockouts, and gradual enforcement starting with privileged accounts. MFA is not perfect — session hijacking after authentication and advanced adversary-in-the-middle attacks exist — but it dramatically raises the bar for attackers.",
    realWorld:
      "The 2020 Twitter hack involved social engineering of employees with access to internal tools, bypassing some controls. Organizations that mandate hardware keys for admin consoles have seen near-elimination of remote account takeover. After Mandiant and others mandated FIDO2 keys for staff, phishing-based credential theft against those accounts effectively stopped. CISA recommends phishing-resistant MFA for all privileged and high-value users.",
    scenario:
      "Finance employees receive MFA push notifications at 2 AM while they are asleep. Security logs show failed password attempts from Eastern Europe immediately before each push. What attack is occurring, and what MFA configuration change would mitigate it?",
    practical: [
      {
        kind: "log",
        title: "MFA bypass attempt blocked",
        content:
          "2026-03-18T09:14:22Z AUTH user=jsmith@corp.example\n  Step 1: Password — SUCCESS (IP: 198.51.100.55, geo: non-corporate)\n  Step 2: TOTP — FAILED (3 invalid codes)\n  Result: Login denied | Alert: Possible credential compromise",
      },
    ],
    terms: [
      { term: "TOTP", definition: "Time-based One-Time Password — a short-lived code generated from a shared secret, typically via an authenticator app." },
      { term: "FIDO2", definition: "An authentication standard using public-key cryptography, commonly implemented in hardware security keys and passkeys." },
      { term: "SIM swap", definition: "An attack where criminals transfer a victim's phone number to a attacker-controlled SIM to intercept SMS codes." },
      { term: "MFA fatigue", definition: "Bombarding a user with MFA push requests hoping they approve one out of annoyance or confusion." },
    ],
    mistakes: [
      "Treating SMS MFA as equivalent to hardware keys for high-privilege accounts.",
      "Deploying MFA without backup recovery options, causing lockout incidents.",
      "Exempting too many accounts or services from MFA requirements.",
    ],
    defensive: [
      "Enforce phishing-resistant MFA (FIDO2/passkeys) for administrators and sensitive systems.",
      "Enable number matching on push-based MFA; monitor for MFA fatigue patterns.",
      "Require MFA for all remote access, cloud consoles, and email accounts.",
    ],
    quiz: [
      mcQuiz(
        "fund-mfa-q1",
        "Which MFA method is most resistant to phishing?",
        ["SMS one-time codes", "Email magic links", "FIDO2 hardware security keys", "Security questions"],
        2,
        "FIDO2 binds authentication to the legitimate site domain, defeating credential phishing.",
      ),
      tfQuiz(
        "fund-mfa-q2",
        "MFA combines at least two different categories of authentication factors.",
        true,
        "Using password plus TOTP combines 'something you know' with 'something you have'.",
      ),
      mcQuiz(
        "fund-mfa-q3",
        "MFA fatigue attacks exploit:",
        ["Slow hash algorithms", "Users approving push notifications under pressure", "Encrypted DNS", "Firewall misconfigurations"],
        1,
        "Attackers flood users with MFA prompts hoping one gets approved accidentally.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-encryption-basics",
    pathId: PATH,
    order: 10,
    title: "Encryption Basics",
    summary:
      "How encryption protects confidentiality in transit and at rest — symmetric vs asymmetric, TLS, and key management fundamentals.",
    estimatedMinutes: 22,
    objectives: [
      "Distinguish symmetric from asymmetric encryption and when each is used",
      "Explain how TLS protects data in transit on the web",
      "Describe encryption at rest for databases, disks, and backups",
    ],
    introduction:
      "Encryption transforms readable data (plaintext) into unreadable ciphertext using mathematical algorithms and keys. Only parties with the correct key can decrypt it. Encryption protects confidentiality — one leg of the CIA triad — when data travels across networks or sits on stolen laptops. It does not stop all attacks, but it ensures that intercepted or exfiltrated ciphertext remains useless without the key.",
    coreConcepts: [
      "Symmetric encryption uses one shared key for encrypt and decrypt — fast, used for bulk data (AES).",
      "Asymmetric encryption uses a public/private key pair — enables secure key exchange and digital signatures (RSA, ECC).",
      "TLS combines both: asymmetric handshake establishes a symmetric session key for HTTPS traffic.",
      "Key management — generation, storage, rotation, and destruction — determines real-world encryption strength.",
    ],
    explanation:
      "Symmetric encryption algorithms like AES-256 use a single secret key. The same key encrypts and decrypts. AES is fast and suitable for encrypting large files, database columns, and disk volumes. The challenge is key distribution: how do two parties share the secret key securely in the first place? In practice, symmetric keys are often exchanged using asymmetric methods or derived during a TLS handshake.\n\nAsymmetric (public-key) encryption uses a key pair: the public key encrypts (or verifies signatures), the private key decrypts (or signs). You can publish your public key openly; only the holder of the private key can read messages encrypted to it. RSA and elliptic curve cryptography (ECC) are common algorithms. Asymmetric operations are slower, so protocols use them to establish symmetric session keys, then switch to AES for bulk transfer.\n\nTLS (Transport Layer Security) is what puts the 'S' in HTTPS. When your browser connects to a website, it performs a handshake: verifies the server's certificate, agrees on cipher suites, and establishes a session key. All subsequent HTTP traffic is encrypted. Without TLS, passwords and cookies travel in plaintext readable by anyone on the same network — coffee shop Wi-Fi, ISP, or compromised routers.\n\nEncryption at rest protects stored data: full-disk encryption (BitLocker, FileVault), database transparent data encryption (TDE), and application-level field encryption for especially sensitive columns. Cloud providers offer managed encryption with customer-managed keys (CMK) for compliance. Weak key storage — hardcoded keys in source code, keys on the same server as the data — undermines all of it. Compromised keys mean compromised ciphertext.",
    realWorld:
      "The 2013 Edward Snowden revelations highlighted widespread interception of unencrypted internet traffic. Today over 95% of web traffic uses HTTPS. Regulations like GDPR and HIPAA encourage or require encryption of personal and health data. The 2016 Uber breach involved attackers accessing an AWS key that decrypted database backups. Encryption worked mathematically; key management failed operationally.",
    scenario:
      "A developer says, 'We do not need HTTPS on our internal admin panel — it is only reachable on the corporate VPN.' What risks remain, and how would you explain why TLS still matters inside trusted networks?",
    practical: [
      {
        kind: "command",
        title: "Inspect TLS certificate",
        content:
          "openssl s_client -connect www.example.com:443 -servername www.example.com 2>/dev/null | openssl x509 -noout -subject -issuer -dates\n\nsubject=CN = www.example.com\nissuer=C = US, O = Let's Encrypt, CN = R3\nnotBefore=Mar  1 00:00:00 2026 GMT\nnotAfter=May 30 23:59:59 2026 GMT",
      },
    ],
    terms: [
      { term: "Plaintext", definition: "Unencrypted, readable data." },
      { term: "AES", definition: "Advanced Encryption Standard — a widely used symmetric encryption algorithm." },
      { term: "TLS", definition: "Transport Layer Security — the protocol that encrypts HTTP and other application traffic (HTTPS)." },
      { term: "Public key infrastructure (PKI)", definition: "The system of certificates and authorities that bind public keys to identities for TLS and code signing." },
    ],
    mistakes: [
      "Hardcoding encryption keys in application source code or configuration repos.",
      "Using deprecated algorithms (DES, RC4, SSLv3) or insufficient key lengths.",
      "Assuming encryption at rest eliminates the need for access controls on the data.",
    ],
    defensive: [
      "Enforce TLS 1.2+ everywhere; use HSTS to prevent downgrade attacks.",
      "Encrypt sensitive data at rest with managed keys; rotate keys on a defined schedule.",
      "Store keys in dedicated vaults (HSM, KMS) separate from encrypted data.",
    ],
    quiz: [
      mcQuiz(
        "fund-enc-q1",
        "HTTPS relies primarily on which protocol to encrypt traffic?",
        ["FTP", "TLS", "DNS", "SMTP"],
        1,
        "TLS encrypts HTTP traffic, producing HTTPS.",
      ),
      tfQuiz(
        "fund-enc-q2",
        "Symmetric encryption uses the same key for both encryption and decryption.",
        true,
        "AES and similar algorithms use one shared secret key.",
      ),
      mcQuiz(
        "fund-enc-q3",
        "The biggest operational risk in many encryption deployments is:",
        ["Using AES instead of RSA for bulk data", "Poor key management and storage", "HTTPS being too slow", "Certificates expiring after 10 years"],
        1,
        "Stolen or leaked keys render encryption ineffective regardless of algorithm strength.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-hashing",
    pathId: PATH,
    order: 11,
    title: "Hashing",
    summary:
      "One-way fingerprint functions for integrity verification and password storage — and why hashing is not encryption.",
    estimatedMinutes: 20,
    objectives: [
      "Explain how hash functions work and their one-way property",
      "Distinguish hashing from encryption and encoding",
      "Describe legitimate uses: password storage, file integrity, and digital signatures",
    ],
    introduction:
      "A hash function takes input of any size and produces a fixed-length fingerprint called a digest or hash. The same input always produces the same output, but you cannot reverse a hash to recover the original data — that is the one-way property. Hashing is fundamental to password storage, file integrity checking, blockchain, and digital signatures. Confusing hashing with encryption is a common beginner mistake with serious consequences.",
    coreConcepts: [
      "Hash functions are deterministic and one-way — you cannot derive input from output.",
      "Avalanche effect: tiny input changes produce completely different hashes.",
      "Cryptographic hashes (SHA-256, SHA-3) resist collisions; broken hashes (MD5, SHA-1) must not be used for security.",
      "Password hashing uses slow algorithms (bcrypt) with salts; integrity checking uses fast hashes (SHA-256).",
    ],
    explanation:
      "Given a file or string, a hash algorithm like SHA-256 produces a 256-bit digest, often displayed as 64 hexadecimal characters. If you change even one bit of the input, the output changes unpredictably. This avalanche effect makes hashes ideal for verifying integrity: download a Linux ISO, hash it, and compare to the publisher's published SHA-256 value. A match confirms the file was not tampered with in transit.\n\nHashing is not encryption. Encryption is reversible with the key; hashing is intentionally irreversible. Base64 encoding is also reversible and provides no security — it is encoding, not hashing or encryption. When storing passwords, you hash (never encrypt) because the server should not be able to recover the plaintext password. Verification re-hashes the login attempt and compares digests.\n\nCollision resistance means it is computationally infeasible to find two different inputs that produce the same hash. MD5 and SHA-1 are broken for collision resistance and should not be used for security purposes. SHA-256 and SHA-3 remain standard for integrity. For passwords, use dedicated slow hashes — bcrypt, scrypt, Argon2 — because fast hashes like SHA-256 allow attackers to guess billions of passwords per second with GPUs.\n\nDigital signatures combine hashing with asymmetric cryptography: hash the document, then encrypt the digest with the signer's private key. Recipients hash the document themselves and verify with the public key. This proves integrity and authenticity. Git commit hashes, blockchain blocks, and certificate fingerprints all rely on the same mathematical foundations.",
    realWorld:
      "The SHAttered attack (2017) demonstrated practical SHA-1 collisions, accelerating deprecation across browsers and certificate authorities. Software supply chain security increasingly publishes SBOM hashes and signs releases so consumers can verify authenticity. Forensic investigators hash seized drives to prove evidence has not been altered between collection and court presentation.",
    scenario:
      "A colleague suggests 'encrypting' passwords with AES so the helpdesk can recover them when users forget. Explain why hashing with bcrypt is the correct approach and what process should replace password recovery.",
    practical: [
      {
        kind: "command",
        title: "Verify file integrity",
        content:
          "sha256sum ubuntu-24.04.iso\na1b2c3d4e5f6…7890  ubuntu-24.04.iso\n\n# Compare against publisher-published hash:\n# Expected: a1b2c3d4e5f6…7890  ✓ Match — file integrity confirmed",
      },
    ],
    terms: [
      { term: "Digest", definition: "The fixed-length output of a hash function." },
      { term: "Collision", definition: "When two different inputs produce the same hash output." },
      { term: "SHA-256", definition: "A cryptographic hash function producing 256-bit digests, widely used for integrity verification." },
      { term: "One-way function", definition: "A function easy to compute forward but computationally infeasible to reverse." },
    ],
    mistakes: [
      "Using MD5 or SHA-1 for security-sensitive integrity or signature purposes.",
      "Confusing Base64 encoding with hashing or encryption.",
      "Using fast general-purpose hashes (SHA-256) instead of password-specific algorithms for credentials.",
    ],
    defensive: [
      "Use SHA-256 or SHA-3 for file and message integrity verification.",
      "Use bcrypt, scrypt, or Argon2 with salts for password storage.",
      "Publish and verify checksums for software downloads and critical documents.",
    ],
    quiz: [
      mcQuiz(
        "fund-hash-q1",
        "Hash functions are primarily:",
        ["Reversible like encryption", "One-way — you cannot recover input from output", "Used only for passwords", "The same as Base64"],
        1,
        "Hashing produces a fingerprint; reversing it is computationally infeasible.",
      ),
      tfQuiz(
        "fund-hash-q2",
        "Changing one character in a file will produce a completely different SHA-256 hash.",
        true,
        "The avalanche effect ensures even tiny changes alter the entire digest.",
      ),
      mcQuiz(
        "fund-hash-q3",
        "For password storage, which approach is correct?",
        ["Store plaintext for helpdesk recovery", "Encrypt with AES using a master key", "Hash with bcrypt and a unique salt per user", "Base64-encode the password"],
        2,
        "Slow salted password hashes resist offline cracking; plaintext and encoding provide no protection.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-social-engineering",
    pathId: PATH,
    order: 12,
    title: "Social Engineering",
    summary:
      "Attacks that manipulate people rather than software — the psychology, techniques, and defenses against human-targeted deception.",
    estimatedMinutes: 22,
    objectives: [
      "Define social engineering and explain why humans are a common attack target",
      "Identify common techniques: pretexting, baiting, tailgating, and authority impersonation",
      "Recommend organizational and individual defenses against manipulation",
    ],
    introduction:
      "Social engineering exploits human psychology — trust, urgency, fear, curiosity, and helpfulness — to bypass technical controls. Attackers often find it easier to trick an employee into revealing credentials than to exploit a zero-day vulnerability. Kevin Mitnick, one of history's most famous hackers, famously said attackers exploit people because it is easier than exploiting systems. Every phishing email, vishing call, and tailgating incident is social engineering.",
    coreConcepts: [
      "Social engineering targets the human element — the weakest link in many security programs.",
      "Pretexting creates a fabricated scenario (IT support, vendor, executive) to extract information.",
      "Urgency and authority are psychological levers that pressure victims to act without verifying.",
      "Defense combines training, verification procedures, and a culture that permits saying no.",
    ],
    explanation:
      "Technical defenses — firewalls, encryption, MFA — are ineffective when an employee voluntarily hands over credentials or plugs in a found USB drive. Social engineers research targets on LinkedIn, company websites, and social media to craft convincing pretexts. A caller claiming to be from 'IT support' who knows your name, manager, and recent ticket number sounds legitimate. A 'CEO' email requesting an urgent wire transfer on a Friday afternoon exploits authority and time pressure.\n\nCommon techniques include phishing (deceptive emails), vishing (voice phishing phone calls), smishing (SMS phishing), baiting (malware-laden USB drives left in parking lots), tailgating (following someone through a secure door), and quid pro quo (offering a fake service in exchange for information). Dumpster diving — retrieving discarded documents — still yields useful pretext material in organizations without shred policies.\n\nRed team exercises and phishing simulations measure organizational resilience but must be conducted ethically with management approval. Metrics like click rates and report rates guide training investment. The goal is not shame but improvement: employees who report suspicious messages are as valuable as those who do not click.\n\nDefenses are procedural as much as technical. Verify unexpected requests through a separate channel — call the CEO on a known number, not the one in the email. Establish clear processes for wire transfers and password resets. Train staff to recognize urgency and authority as red flags. Physical security — badges, reception procedures, challenge unknown visitors — closes tailgating gaps. No single product stops social engineering; culture and habit do.",
    realWorld:
      "The 2020 Twitter hack began with phone-based social engineering of employees with access to internal account tools. Business email compromise (BEC) cost organizations over $2.9 billion in reported losses in 2023 (FBI IC3). The 2011 RSA SecurID breach started with a malicious Excel attachment sent to employees with a subject line referencing recruitment — classic targeted phishing with social engineering pretext.",
    scenario:
      "An employee receives a call from someone claiming to be Microsoft support, saying their computer is sending viruses and requesting remote desktop access. Walk through the social engineering techniques in play and the correct employee response.",
    practical: [
      {
        kind: "alert",
        title: "Physical security incident",
        content:
          "REPORT: Unknown individual followed badge-holding employee through secure door (Bldg B, 14:32). Individual wore contractor vest but had no visible badge. Tailgating suspected. Security notified — review camera footage and reinforce challenge procedures.",
      },
    ],
    terms: [
      { term: "Pretexting", definition: "Creating a fabricated scenario to manipulate someone into divulging information or taking action." },
      { term: "Vishing", definition: "Voice phishing — social engineering conducted over phone calls." },
      { term: "Tailgating", definition: "Following an authorized person through a secure entry without presenting your own credentials." },
      { term: "Baiting", definition: "Luring victims with something enticing — such as a labeled USB drive — to execute malicious actions." },
    ],
    mistakes: [
      "Blaming users who fall for attacks instead of improving training and processes.",
      "Creating policies so restrictive that employees bypass them to be helpful or productive.",
      "Skipping physical security awareness while focusing only on email threats.",
    ],
    defensive: [
      "Run regular phishing simulations and publish reporting procedures.",
      "Require out-of-band verification for financial transfers and credential resets.",
      "Train employees that urgency and secrecy requests are red flags — verify independently.",
    ],
    quiz: [
      mcQuiz(
        "fund-soceng-q1",
        "Social engineering primarily targets:",
        ["Firewall configurations", "Human psychology and behavior", "Encryption algorithms", "Network cables"],
        1,
        "Social engineers manipulate people to bypass technical controls.",
      ),
      tfQuiz(
        "fund-soceng-q2",
        "Tailgating is a physical social engineering technique.",
        true,
        "Following someone through a secure door without authorization is tailgating.",
      ),
      mcQuiz(
        "fund-soceng-q3",
        "An attacker impersonating IT support to gain remote access is using:",
        ["DDoS", "Pretexting", "Hash collision", "Port scanning"],
        1,
        "Fabricating a support scenario to manipulate the victim is pretexting.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-phishing",
    pathId: PATH,
    order: 13,
    title: "Phishing",
    summary:
      "Deceptive emails and websites designed to steal credentials or deliver malware — recognition, reporting, and organizational defenses.",
    estimatedMinutes: 22,
    objectives: [
      "Identify common indicators of phishing emails and fake websites",
      "Distinguish spear phishing, whaling, and bulk phishing campaigns",
      "Describe technical and human controls that reduce phishing success rates",
    ],
    introduction:
      "Phishing is the most common initial access vector in cyberattacks. Attackers send emails, texts, or messages that appear to come from trusted sources — banks, colleagues, vendors, or IT departments — to trick recipients into clicking malicious links, opening infected attachments, or entering credentials on fake login pages. Because phishing exploits trust and urgency, technical filters alone cannot stop every message; user awareness and reporting culture are essential layers.",
    coreConcepts: [
      "Phishing emails use spoofed sender addresses, urgent language, and deceptive links.",
      "Spear phishing targets specific individuals; whaling targets executives.",
      "Credential harvesting sites mimic legitimate login pages but send data to attackers.",
      "Defenses include email filtering, DMARC, MFA, and user reporting workflows.",
    ],
    explanation:
      "Bulk phishing casts a wide net: generic messages about 'account suspension' or 'package delivery' sent to millions of addresses. Most recipients ignore them, but a small percentage clicks — enough for profit. Spear phishing researches specific targets: the email references a real project, uses a colleague's name, or mimics a vendor the company actually uses. Whaling targets C-suite executives with wire-transfer fraud or legal threats. Business email compromise (BEC) often starts with a compromised or spoofed executive email requesting urgent payment.\n\nTechnical indicators help identify phishing. Check the sender's actual address, not just the display name — ceo@company.com might actually be from ceo-payroll@evil-domain.ru. Hover over links without clicking to reveal the true URL. Mismatched domains (microsft-login.com), URL shorteners, and HTTP instead of HTTPS are red flags. Attachments with double extensions (invoice.pdf.exe) or unexpected macros are dangerous. Legitimate organizations rarely demand immediate action under threat of account closure.\n\nEmail authentication protocols reduce spoofing. SPF specifies which servers may send mail for a domain. DKIM cryptographically signs messages. DMARC tells receivers what to do when SPF/DKIM fail. Together they prevent attackers from easily impersonating your domain — but they do not stop lookalike domains or compromised legitimate accounts.\n\nWhen users report phishing, security teams can block URLs, remove messages from other mailboxes, and hunt for compromised accounts. MFA limits damage from stolen credentials. Browser isolation and link rewriting add technical layers. The goal is defense in depth: filter most, train users to catch what filters miss, and contain impact when someone clicks.",
    realWorld:
      "The 2016 DNC hack began with spear-phishing emails that tricked staff into resetting passwords on a fake Google login page. COVID-19 brought a surge of phishing themed around stimulus checks, vaccine appointments, and remote-work IT alerts. APWG reported over 1.2 million phishing sites detected in Q1 2024. Google's Safe Browsing and Microsoft Defender block billions of malicious URLs, yet phishing remains the top reported crime type to the FBI IC3.",
    scenario:
      "An employee reports an email from 'HR' with subject 'Mandatory Benefits Update — Action Required Today.' The link goes to https://hr-benefits-corp-update.secure-form.io/login. The employee almost clicked but noticed the domain is not the company's. What should happen next, and what indicators confirmed suspicion?",
    practical: [
      {
        kind: "log",
        title: "Email header analysis",
        content:
          "From: \"IT Helpdesk\" <helpdesk@micros0ft-support.com>\nReply-To: attacker@evil-domain.ru\nAuthentication-Results: spf=fail dkim=fail dmarc=fail\nX-Phishing-Score: HIGH — display name spoof, lookalike domain, failed auth",
      },
    ],
    terms: [
      { term: "Spear phishing", definition: "Targeted phishing aimed at specific individuals using personalized information." },
      { term: "DMARC", definition: "Domain-based Message Authentication, Reporting, and Conformance — policy for handling email that fails SPF/DKIM checks." },
      { term: "Credential harvesting", definition: "Fake login pages designed to capture usernames and passwords entered by victims." },
      { term: "BEC", definition: "Business Email Compromise — fraud using compromised or spoofed business email accounts, often for wire transfers." },
    ],
    mistakes: [
      "Clicking links or opening attachments to 'see if it is real' instead of reporting.",
      "Assuming mobile email clients show enough detail to verify sender authenticity.",
      "Punishing employees who report phishing, reducing future reporting rates.",
    ],
    defensive: [
      "Deploy email filtering with URL rewriting and attachment sandboxing.",
      "Publish a simple phishing report button or forwarding address for security review.",
      "Enforce MFA so stolen credentials alone cannot access accounts.",
    ],
    quiz: [
      mcQuiz(
        "fund-phish-q1",
        "Spear phishing differs from bulk phishing because it:",
        ["Uses only SMS", "Targets specific individuals with personalized messages", "Never uses links", "Only affects executives"],
        1,
        "Spear phishing researches and targets specific victims for higher success rates.",
      ),
      tfQuiz(
        "fund-phish-q2",
        "DMARC, SPF, and DKIM help prevent email domain spoofing.",
        true,
        "These authentication protocols verify sender legitimacy and reduce spoofing.",
      ),
      mcQuiz(
        "fund-phish-q3",
        "The safest action when you suspect a phishing email is to:",
        ["Click the link in a sandbox browser", "Reply asking if it is legitimate", "Report it to security without clicking links or attachments", "Forward it to all colleagues as a warning"],
        2,
        "Report through official channels; do not interact with suspicious content.",
      ),
    ],
    practiceLink: {
      label: "Vulnerable Lab: Information Leak",
      to: "/vulnerable-lab/info-leak",
      type: "vulnerable-lab",
    },
  }),

  createLesson({
    id: "fundamentals-malware",
    pathId: PATH,
    order: 14,
    title: "Malware",
    summary:
      "Malicious software categories — viruses, worms, ransomware, trojans, and spyware — how they spread, and how defenders detect and contain them.",
    estimatedMinutes: 23,
    objectives: [
      "Define malware and categorize common types by behavior and propagation",
      "Explain common infection vectors: email attachments, drive-by downloads, and removable media",
      "Describe endpoint detection, containment, and recovery strategies",
    ],
    introduction:
      "Malware (malicious software) is any program or code designed to harm, exploit, or gain unauthorized access to systems. It includes viruses, worms, trojans, ransomware, spyware, rootkits, and cryptominers. Malware is a delivery mechanism for many attacks — ransomware gangs encrypt data for payment, banking trojans steal credentials, and remote access trojans (RATs) give attackers persistent control. Understanding malware families and behaviors helps defenders choose appropriate detection and response actions.",
    coreConcepts: [
      "Viruses attach to legitimate files; worms self-propagate across networks without user action.",
      "Trojans disguise as legitimate software; ransomware encrypts data and demands payment.",
      "Malware spreads via phishing attachments, exploited vulnerabilities, and infected removable media.",
      "EDR/antivirus uses signatures, heuristics, and behavioral analysis to detect malicious activity.",
    ],
    explanation:
      "A virus requires a host file and user action to spread — opening an infected document, for example. A worm exploits network vulnerabilities to copy itself automatically, as WannaCry did using EternalBlue. Trojans masquerade as useful programs — fake software updates, pirated games, or 'free PDF converters' — but install backdoors or steal data once executed. Users install trojans willingly because they believe the software is legitimate.\n\nRansomware encrypts files or locks systems, demanding cryptocurrency payment for decryption keys. Modern ransomware operations double-extort: they exfiltrate data before encryption and threaten to publish it if ransom is not paid. Spyware monitors user activity — keyloggers capture keystrokes, infostealers harvest browser cookies and credentials. Rootkits hide deep in the operating system to maintain persistence and evade detection.\n\nInfection vectors include malicious email attachments (macros in Office documents), drive-by downloads from compromised websites, supply chain attacks (trojanized software updates), and USB drops in social engineering baiting. Attackers increasingly use living-off-the-land techniques — abusing legitimate tools like PowerShell and WMI — to blend with normal admin activity.\n\nDefenses layer endpoint protection (antivirus, EDR), application allowlisting, macro blocking, network segmentation, and backups. EDR (Endpoint Detection and Response) monitors process behavior — unusual parent-child relationships, mass file encryption, or credential dumping — and can isolate hosts automatically. When malware is detected, incident response follows: contain (disconnect network), eradicate (remove malware and persistence), recover (restore from clean backups), and investigate patient zero.",
    realWorld:
      "WannaCry (2017) spread to over 200,000 systems in 150 countries using an NSA-leaked exploit, disrupting hospitals and manufacturing. NotPetya caused over $10 billion in damage disguised as ransomware but designed for destruction. The Colonial Pipeline attack (2021) used a compromised VPN password and legacy VPN access without MFA to deploy ransomware. Emotet, before takedown efforts, was the world's most prolific malware botnet, distributing other malware families.",
    scenario:
      "An employee reports their laptop files have a .locked extension and a ransom note appears on the desktop demanding Bitcoin. Network shares they accessed are also encrypted. Outline the first three incident response steps and what you must not do.",
    practical: [
      {
        kind: "log",
        title: "EDR behavioral alert",
        content:
          "ALERT: Suspicious process chain detected on WORKSTATION-447\n  Parent: outlook.exe → Child: powershell.exe -enc <Base64>\n  Behavior: Mass file rename (.docx → .docx.locked) in \\\\fileserver\\shared\n  Action: Host isolated from network | Severity: Critical | Playbook: RANSOMWARE-001",
      },
    ],
    terms: [
      { term: "Ransomware", definition: "Malware that encrypts victim data and demands payment for the decryption key." },
      { term: "Trojan", definition: "Malware disguised as legitimate software that users are tricked into installing." },
      { term: "EDR", definition: "Endpoint Detection and Response — tools that monitor endpoint behavior and respond to threats." },
      { term: "Persistence", definition: "Mechanisms malware uses to survive reboots and maintain access, such as registry run keys or scheduled tasks." },
    ],
    mistakes: [
      "Paying ransom without considering that attackers may not provide working keys or may re-target you.",
      "Relying solely on signature-based antivirus without behavioral detection or EDR.",
      "Connecting infected machines to the network before forensic imaging and eradication.",
    ],
    defensive: [
      "Deploy EDR with automatic isolation for high-confidence ransomware behaviors.",
      "Maintain offline, tested backups; block Office macros from internet-origin documents.",
      "Segment networks to limit lateral movement when an endpoint is compromised.",
    ],
    quiz: [
      mcQuiz(
        "fund-malware-q1",
        "Which malware type self-propagates across networks without user interaction?",
        ["Trojan", "Worm", "Adware", "Keylogger only"],
        1,
        "Worms exploit vulnerabilities to spread automatically across networks.",
      ),
      tfQuiz(
        "fund-malware-q2",
        "Ransomware primarily threatens data availability and may also threaten confidentiality through data exfiltration.",
        true,
        "Ransomware denies access to data and modern variants often steal copies before encryption.",
      ),
      mcQuiz(
        "fund-malware-q3",
        "EDR tools primarily improve on traditional antivirus by:",
        ["Only checking file signatures", "Monitoring behavioral patterns and enabling response actions", "Replacing the need for backups", "Encrypting all endpoint files"],
        1,
        "EDR detects suspicious behavior and can isolate hosts in real time.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-security-policies",
    pathId: PATH,
    order: 15,
    title: "Security Policies",
    summary:
      "Written rules that define acceptable behavior, assign responsibilities, and establish the governance foundation for a security program.",
    estimatedMinutes: 20,
    objectives: [
      "Explain the purpose of security policies, standards, procedures, and guidelines",
      "Identify common policy types: acceptable use, access control, incident response, and data classification",
      "Describe how policies support compliance and consistent security decisions",
    ],
    introduction:
      "Security policies are formal documents that define an organization's security expectations, roles, and responsibilities. Without policies, security is ad hoc — each manager makes different decisions, employees guess what is allowed, and auditors find no baseline to measure against. Policies do not replace technical controls, but they authorize and direct them. A firewall rule enforcing least privilege implements an access control policy; the policy explains why the rule exists.",
    coreConcepts: [
      "Policies state what must be done; standards specify how; procedures describe step-by-step execution.",
      "Acceptable use policies define proper use of organizational IT resources.",
      "Data classification policies categorize information sensitivity and required protections.",
      "Policies require management approval, regular review, and employee acknowledgment.",
    ],
    explanation:
      "Policy hierarchy typically flows from high-level policy (board-approved principles) to standards (mandatory technical requirements), procedures (detailed steps), and guidelines (recommended practices). An information security policy might state that all sensitive data must be encrypted in transit. A standard specifies TLS 1.2 minimum. A procedure documents how to request and install certificates. Guidelines suggest cipher suite preferences. This structure keeps policies durable while allowing technical details to evolve.\n\nCommon policies include Acceptable Use Policy (AUP) — what employees may and may not do with company systems; Access Control Policy — who gets access to what and how access is granted and revoked; Password Policy — though increasingly aligned with NIST guidance on length and MFA; Incident Response Policy — roles, escalation, and communication during breaches; Data Classification Policy — labels like Public, Internal, Confidential, Restricted with handling rules; Remote Work Policy — VPN, device requirements, and home network expectations; and Change Management Policy — how production changes are approved and tested.\n\nPolicies support compliance with regulations: GDPR requires documented security measures; HIPAA requires policies for protected health information; PCI DSS mandates specific policy topics for merchants. During audits, assessors request policies first, then evidence of implementation. A policy that nobody follows is worse than no policy — it demonstrates awareness of risk without commitment to mitigation.\n\nEffective policies are readable, enforceable, and relevant. Involve legal, HR, IT, and business stakeholders in drafting. Require annual acknowledgment from employees. Review and update when technology, threats, or regulations change. Sanctions for violation must be defined and applied consistently. Security culture grows when policies are seen as enabling safe work, not arbitrary bureaucracy.",
    realWorld:
      "After major breaches, regulators and lawsuits often ask: did the organization have reasonable policies, and did it follow them? Equifax faced criticism not only for the breach but for known gaps in patch management policy enforcement. ISO 27001 certification requires a comprehensive policy set as the foundation of an information security management system (ISMS). Many cyber insurance applications now ask whether specific policies exist and when they were last reviewed.",
    scenario:
      "A fast-growing company has no written security policies. The CTO wants to 'just buy a SIEM.' You are asked to propose the first three policies the company should adopt and why policy must precede or accompany tool purchases.",
    practical: [
      {
        kind: "alert",
        title: "Policy compliance gap",
        content:
          "AUDIT FINDING: Access Control Policy requires quarterly access reviews.\n  Last completed review: 14 months ago\n  23 contractors retain VPN access after project end dates\n  Risk: High | Remediation due: 30 days | Owner: IT Director",
      },
    ],
    terms: [
      { term: "AUP", definition: "Acceptable Use Policy — rules governing appropriate use of organizational technology resources." },
      { term: "Data classification", definition: "Categorizing information by sensitivity to apply appropriate handling and protection requirements." },
      { term: "Governance", definition: "The framework of rules, roles, and processes that direct and control security activities." },
      { term: "ISMS", definition: "Information Security Management System — a systematic approach to managing sensitive information, often aligned with ISO 27001." },
    ],
    mistakes: [
      "Copying generic policy templates without tailoring to the organization's actual risks and systems.",
      "Writing policies that are too vague to enforce or too technical to be understood by employees.",
      "Failing to obtain management sign-off, making policies unenforceable in practice.",
    ],
    defensive: [
      "Start with high-impact policies: acceptable use, access control, and incident response.",
      "Require annual employee acknowledgment and track completion.",
      "Review policies at least annually and after significant incidents or regulatory changes.",
    ],
    quiz: [
      mcQuiz(
        "fund-policy-q1",
        "A security policy primarily defines:",
        ["Exact firewall rule syntax", "Organizational security requirements and expectations", "Employee salaries", "Software source code standards only"],
        1,
        "Policies state what the organization requires; standards and procedures detail implementation.",
      ),
      tfQuiz(
        "fund-policy-q2",
        "An Acceptable Use Policy describes proper use of company IT resources by employees.",
        true,
        "AUPs set boundaries for email, internet, device, and data use.",
      ),
      mcQuiz(
        "fund-policy-q3",
        "Data classification policies help organizations:",
        ["Eliminate all encryption", "Apply appropriate protections based on information sensitivity", "Avoid compliance audits", "Remove the need for access controls"],
        1,
        "Classification drives handling rules — encryption, access, retention — matched to data sensitivity.",
      ),
    ],
  }),

  createLesson({
    id: "fundamentals-defense-in-depth",
    pathId: PATH,
    order: 16,
    title: "Defense in Depth",
    summary:
      "Layered security controls so that when one layer fails, others still protect — the architectural mindset that ties all fundamentals together.",
    estimatedMinutes: 25,
    objectives: [
      "Define defense in depth and explain why no single control is sufficient",
      "Map layered controls across network, endpoint, application, and human layers",
      "Apply defense in depth thinking to a simple system architecture",
    ],
    introduction:
      "Defense in depth (also called layered security) is the strategy of deploying multiple overlapping controls so that a failure in one layer does not lead to total compromise. A firewall blocks most attacks, but if it fails, network segmentation limits movement. If segmentation fails, EDR detects malware. If malware executes, backups enable recovery. No single product — not even MFA or encryption — stops every threat. Mature security programs assume breach and design layers accordingly.",
    coreConcepts: [
      "Multiple independent layers reduce the chance that one failure causes total compromise.",
      "Layers span physical, network, host, application, data, and human controls.",
      "Assume breach: design detection and recovery, not only prevention.",
      "Each layer should be effective on its own while complementing others.",
    ],
    explanation:
      "Consider a web application storing customer data. At the perimeter, a firewall allows only HTTPS traffic to the web tier. A WAF filters SQL injection and XSS attempts. The web server runs in a DMZ with no direct database access. The application validates input, enforces authentication and authorization, and logs security events. The database sits in a private subnet reachable only from application servers. Data is encrypted at rest; backups are stored offline. Employees use MFA and receive phishing training. SIEM correlates alerts across all layers. This is defense in depth — an attacker must defeat multiple independent controls.\n\nEach layer addresses different threat scenarios. Physical security (badges, cameras) stops unauthorized facility access. Network segmentation contains lateral movement after a phishing compromise. Host-based firewalls and EDR protect individual machines. Application security prevents injection and access control flaws. Data encryption limits impact of exfiltration. Administrative controls (policies, training) reduce human error. Removing any single layer increases risk disproportionately.\n\nDefense in depth contrasts with 'security by obscurity' — hiding systems or relying on secrecy alone — and with 'single point of failure' designs where one VPN gateway protects everything. It aligns with zero trust principles: never trust, always verify, at every layer. The Swiss cheese model from safety engineering illustrates the concept: each layer has holes (weaknesses), but stacking layers aligns holes so fewer threats pass through all of them.\n\nImplementing defense in depth requires architecture thinking, not tool accumulation. Buying ten products that all scan email does not add layers if they are redundant. Map threats to layers, identify gaps, and prioritize investments. Red team exercises and penetration tests reveal which layers actually fail. The fundamentals you have learned — CIA triad, controls, authentication, encryption, policies — are the building blocks of each layer.",
    realWorld:
      "The 2013 Target breach involved stolen HVAC vendor credentials, inadequate network segmentation between HVAC and payment networks, missed malware alerts, and exfiltration of 40 million card records. Multiple layers failed or were absent. Organizations that segment OT from IT, monitor third-party access, and enforce MFA on vendor connections apply lessons from this incident. NIST Cybersecurity Framework organizes controls across Identify, Protect, Detect, Respond, and Recover — a defense-in-depth lifecycle.",
    scenario:
      "Design a defense-in-depth strategy for a small company with a public website, internal file server, and 30 remote employees. List at least five layers across different categories (network, endpoint, human, data) and what threat each layer addresses.",
    practical: [
      {
        kind: "diagram",
        title: "Layered architecture",
        content:
          "Internet → [Firewall/WAF] → DMZ (Web Server)\n                    ↓\n            [Internal Firewall]\n                    ↓\n         Private Subnet (App + DB)\n                    ↓\n         [EDR on all endpoints] + [SIEM] + [Backups]\n\nEach arrow crossing a boundary is a trust boundary requiring validation.",
      },
    ],
    terms: [
      { term: "Defense in depth", definition: "A security strategy using multiple overlapping layers of controls to protect assets." },
      { term: "DMZ", definition: "Demilitarized zone — a network segment that sits between the public internet and internal networks, hosting public-facing services." },
      { term: "Assume breach", definition: "A security mindset that designs detection and containment assuming attackers will eventually gain some access." },
      { term: "Swiss cheese model", definition: "A metaphor where each security layer has holes, but layering aligns holes so fewer threats pass through all layers." },
    ],
    mistakes: [
      "Buying multiple tools that duplicate the same function instead of adding independent layers.",
      "Investing only in prevention without detection, response, and recovery layers.",
      "Treating defense in depth as an excuse to skip fixing known critical vulnerabilities.",
    ],
    defensive: [
      "Map architecture to layers; identify and close single points of failure.",
      "Combine network segmentation, endpoint protection, application security, and user training.",
      "Test layers with red team exercises and tabletop incident scenarios.",
    ],
    quiz: [
      mcQuiz(
        "fund-did-q1",
        "Defense in depth means:",
        ["Using one very strong firewall", "Deploying multiple overlapping security layers", "Hiding servers from the internet", "Avoiding all third-party software"],
        1,
        "Layered controls ensure one failure does not cause total compromise.",
      ),
      tfQuiz(
        "fund-did-q2",
        "Assume breach thinking includes designing detection and response capabilities, not only prevention.",
        true,
        "Modern programs plan for eventual compromise and limit blast radius.",
      ),
      mcQuiz(
        "fund-did-q3",
        "Placing a database in a private subnet unreachable from the internet is an example of:",
        ["Social engineering", "Network segmentation as a defense layer", "Phishing resistance", "Password hashing"],
        1,
        "Segmentation limits exposure and lateral movement between network zones.",
      ),
    ],
  }),
];

