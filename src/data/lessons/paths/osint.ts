import {
  createLesson,
  createPathAssessment,
  mcQuiz,
  tfQuiz,
} from "../lessonFactory";

const PATH = "osint";

export const osintLessons = [
  createLesson({
    id: "osint-what-is-osint",
    pathId: PATH,
    order: 1,
    title: "What is OSINT",
    summary:
      "Open-source intelligence — collecting and analyzing publicly available information for security, investigations, and due diligence.",
    objectives: [
      "Define OSINT and distinguish it from classified or illicit collection",
      "Identify common OSINT sources and use cases",
      "Explain the OSINT cycle from requirements to reporting",
    ],
    introduction:
      "Open-Source Intelligence (OSINT) is intelligence derived from publicly available sources — websites, social media, government filings, DNS records, satellite imagery, and more. Security teams use OSINT for brand monitoring, executive protection, fraud investigation, threat actor profiling, and attack surface mapping. Journalists, law enforcement, and researchers use the same skills with different goals. OSINT is powerful because the data is often free and abundant; the challenge is finding signal in noise ethically and legally.",
    coreConcepts: [
      "OSINT uses only legal, publicly accessible sources — no unauthorized access.",
      "Sources include web pages, APIs, registries, social platforms, academic papers, and leaks published publicly.",
      "The intelligence cycle: requirements → collection → processing → analysis → dissemination.",
      "Security use cases: phishing domain discovery, exposed credentials, third-party risk, geopolitical monitoring.",
      "OSINT complements technical security — it does not replace authorized penetration testing.",
    ],
    explanation:
      "An analyst receives a requirement: 'Map our organization's internet-facing assets not in the CMDB.' Collection includes certificate transparency logs, DNS brute force, Shodan/Censys searches, and GitHub code search. Processing normalizes hostnames and deduplicates. Analysis ranks findings by exposure (admin panels, .env files). The report goes to IT for remediation. OSINT tools automate collection but human judgment validates relevance. Unlike HUMINT or classified SIGINT, OSINT is shareable across teams — but still subject to privacy law and platform terms of service.",
    realWorld:
      "Threat intel teams profile ransomware groups via forum posts and leak sites. HR uses OSINT for background checks within legal limits. Crisis teams monitor social media during incidents.",
    scenario:
      "Leadership asks whether customer data appeared on a paste site. Outline how OSINT fits into the response without accessing the dark web illegally.",
    terms: [
      { term: "OSINT", definition: "Open-Source Intelligence — intelligence from publicly available information." },
      { term: "Collection", definition: "Gathering raw data from identified sources per intelligence requirements." },
      { term: "Attack surface", definition: "All internet-exposed assets and entry points an organization presents." },
    ],
    mistakes: [
      "Confusing OSINT with hacking or credential stuffing.",
      "Collecting personal data without legal basis or purpose limitation.",
      "Reporting unverified social media rumors as fact.",
    ],
    defensive: [
      "Monitor brand and executive names for impersonation.",
      "Audit your own OSINT exposure periodically — 'self-OSINT.'",
      "Establish OSINT policies aligned with legal and privacy teams.",
    ],
    quiz: [
      mcQuiz(
        "osint-intro-q1",
        "OSINT primarily uses:",
        ["Classified government databases only", "Publicly available information", "Stolen passwords", "Unauthorized system access"],
        1,
        "OSINT relies on legal public sources.",
      ),
      tfQuiz(
        "osint-intro-q2",
        "Security teams use OSINT for attack surface mapping and threat monitoring.",
        true,
        "Common uses include exposed assets and impersonation detection.",
      ),
      mcQuiz(
        "osint-intro-q3",
        "The first step in an OSINT effort is typically:",
        ["Publishing results on social media", "Defining requirements and questions to answer", "Deleting sources", "Buying malware"],
        1,
        "Clear requirements focus collection and analysis.",
      ),
    ],
  }),

  createLesson({
    id: "osint-ethical-legal",
    pathId: PATH,
    order: 2,
    title: "Ethical/Legal Boundaries",
    summary:
      "Privacy laws, terms of service, harassment risks, and professional ethics for investigators working in the open.",
    objectives: [
      "Identify legal frameworks affecting OSINT (GDPR, CFAA, local privacy law)",
      "Distinguish public data from authorized access",
      "Apply ethical guidelines for proportionality and documentation",
    ],
    introduction:
      "Because OSINT feels easy — a few searches from your desk — investigators can overstep legal and ethical lines. Scraping against terms of service, doxxing individuals, stalking, or misrepresenting identity can create civil liability, criminal exposure, and harm innocent people. Professional OSINT requires knowing what you may collect, how you may use it, and when to stop.",
    coreConcepts: [
      "Publicly viewable does not always mean lawful to collect or store — GDPR and similar laws regulate personal data processing.",
      "CFAA (US) and computer misuse laws prohibit unauthorized access — logging into someone else's account is not OSINT.",
      "Platform Terms of Service may prohibit automated scraping or fake accounts.",
      "Proportionality: collect only what the investigation requires.",
      "Document sources, methods, and legal review for sensitive cases.",
    ],
    explanation:
      "A corporate investigator searches an employee's public LinkedIn — generally acceptable for role verification. Creating a fake profile to friend a suspect crosses ethical and possibly platform rules. Downloading a breached password database from a public forum to test corporate credentials may be legal in some jurisdictions for defensive purposes but requires legal counsel. EU investigators processing EU subjects' data need lawful basis under GDPR. Harassment, intimidation, and swatting are never acceptable. Law enforcement operates under warrants and statutes; private OSINT practitioners lack those powers. When in doubt, escalate to legal before collection.",
    realWorld:
      "Companies faced GDPR fines for excessive employee social media monitoring. Researchers received cease-and-desist letters for aggressive scraping. Ethical OSINT training is now standard in corporate intel programs.",
    scenario:
      "You find a public Facebook album geotagged at a competitor's office. Can you use it in a commercial intelligence report? What factors matter?",
    terms: [
      { term: "GDPR", definition: "EU General Data Protection Regulation governing personal data processing." },
      { term: "CFAA", definition: "US Computer Fraud and Abuse Act — prohibits unauthorized computer access." },
      { term: "Proportionality", definition: "Collecting only data necessary for the stated legitimate purpose." },
    ],
    mistakes: [
      "Using sock puppet accounts to infiltrate private groups without authority.",
      "Publishing personal addresses (doxxing) in reports.",
      "Assuming 'on the internet' equals 'free to use for any purpose.'",
    ],
    defensive: [
      "Maintain written OSINT policy approved by legal.",
      "Train analysts on jurisdiction-specific privacy requirements.",
      "Separate personal curiosity investigations from authorized work.",
    ],
    quiz: [
      mcQuiz(
        "osint-eth-q1",
        "Logging into someone else's account without permission is:",
        ["Standard OSINT", "Likely illegal unauthorized access", "Required for DNS", "Always encouraged"],
        1,
        "Unauthorized access violates computer misuse laws regardless of intent.",
      ),
      tfQuiz(
        "osint-eth-q2",
        "GDPR may apply when processing personal data of EU residents even if data is public.",
        true,
        "Public visibility does not exempt all GDPR obligations.",
      ),
      mcQuiz(
        "osint-eth-q3",
        "Proportionality in OSINT means:",
        ["Collect everything possible", "Collect only what is needed for the legitimate purpose", "Never document sources", "Ignore legal review"],
        1,
        "Minimize data collection to what the investigation requires.",
      ),
    ],
  }),

  createLesson({
    id: "osint-search-techniques",
    pathId: PATH,
    order: 3,
    title: "Search Techniques",
    summary:
      "Structured searching, source diversification, archiving, and building repeatable OSINT workflows.",
    objectives: [
      "Design effective search strategies beyond single keyword queries",
      "Use multiple engines and specialized databases",
      "Archive and cite sources for reproducibility",
    ],
    introduction:
      "Novice OSINT is typing a name into Google once. Professional OSINT uses layered search strategies: alternate spellings, historical caches, foreign-language sources, image search, and specialized registries. Effective investigators document queries, save snapshots, and cross-verify before drawing conclusions.",
    coreConcepts: [
      "Diversify engines: Google, Bing, DuckDuckGo, Yandex — indexes differ.",
      "Specialized databases: court records, business registries, academic indexes, breach notification sites (lawful use).",
      "Reverse image search traces photo origins and reuse.",
      "Archiving with timestamps (Wayback Machine, local PDF) preserves volatile pages.",
      "Iterative refinement: each finding suggests new entities and queries.",
    ],
    explanation:
      "Investigating a suspicious domain: start with WHOIS, DNS, and certificate transparency. Search company name + 'data breach,' site:pastebin.com (public pastes only), and LinkedIn employees. Reverse WHOIS finds other domains registered with same email. Image search on logo finds clone sites. Document each URL and capture date. Pivot when you find a director name — search corporate filings and news. Avoid confirmation bias — actively search for disconfirming evidence. Use notebooks (Hunchly, OBSIDIAN with citations) for case management.",
    realWorld:
      "Journalists broke stories using archived deleted tweets. Fraud investigators linked shell companies via shared registered agent addresses in state databases.",
    scenario:
      "A phishing site clones your login page. List five OSINT search steps to identify related infrastructure.",
    terms: [
      { term: "Reverse WHOIS", definition: "Finding domains registered with the same registrant details." },
      { term: "Certificate transparency", definition: "Public logs of TLS certificates revealing subdomains and hosts." },
      { term: "Source diversification", definition: "Using multiple independent sources to reduce single-point bias." },
    ],
    mistakes: [
      "Relying on a single search engine's first page.",
      "Failing to archive pages that may be deleted.",
      "Stopping after one confirming result without verification.",
    ],
    defensive: [
      "Monitor certificate transparency for unauthorized certs on your domains.",
      "Run periodic 'red team OSINT' against your own brand.",
      "Train staff to report suspicious lookalike domains found in searches.",
    ],
    quiz: [
      mcQuiz(
        "osint-search-q1",
        "Why use multiple search engines in OSINT?",
        ["They are identical", "Indexes and ranking differ, surfacing different results", "It is illegal to use one", "Engines block security work"],
        1,
        "Different engines index and rank content differently.",
      ),
      tfQuiz(
        "osint-search-q2",
        "Archiving web pages helps preserve evidence that may later be deleted.",
        true,
        "Volatile pages require timestamped captures for reproducibility.",
      ),
      mcQuiz(
        "osint-search-q3",
        "Reverse image search is useful for:",
        ["Encrypting disks", "Tracing where a photo appeared online", "Configuring routers", "Hashing passwords"],
        1,
        "Image search finds other sites using the same or similar images.",
      ),
    ],
  }),

  createLesson({
    id: "osint-search-operators",
    pathId: PATH,
    order: 4,
    title: "Search Operators",
    summary:
      "Google dorking, Bing operators, site/filetype filters, and precision queries that surface hidden pages.",
    objectives: [
      "Apply common search operators to narrow results",
      "Construct site- and filetype-specific queries safely",
      "Understand responsible use of advanced search",
    ],
    introduction:
      "Search operators are syntax that tells engines to filter results — limit to one site, file type, title phrase, or date range. Security professionals use them to find exposed documents, admin panels, and misconfigured cloud storage. The same techniques defend organizations when used in authorized assessments.",
    coreConcepts: [
      "site:example.com limits results to that domain.",
      "filetype:pdf finds PDF documents; ext: similar on some engines.",
      "intitle: and inurl: match title and URL components.",
      "Quotation marks enforce exact phrase matching.",
      "Minus (-) excludes terms; OR broadens; * is wildcard on some engines.",
    ],
    explanation:
      "Query site:company.com filetype:pdf 'confidential' may reveal inadvertently indexed reports. inurl:admin site:target.com finds admin paths — use only with authorization on your org. Combining operators: site:linkedin.com \"Jane Doe\" \"Acme Corp\". Google Cache and date filters find historical content. Shodan uses its own syntax: port, org, hostname. Document authorized scope before dorking — scanning a third party without permission is not OSINT defense. Responsible disclosure when you find critical exposures on others' systems.",
    realWorld:
      "Researchers found open S3 buckets via search engine indexing. Pen testers use dorks in scoped engagements listed in rules of engagement.",
    scenario:
      "You are authorized to assess yourcompany.com. Write a search query to find indexed spreadsheet files on that domain.",
    practical: [
      {
        kind: "command",
        title: "Example dork queries",
        content:
          'site:yourcompany.com filetype:xls OR filetype:xlsx\nsite:yourcompany.com inurl:admin\n"yourcompany.com" ext:env OR ext:config',
      },
    ],
    terms: [
      { term: "Google dork", definition: "Advanced search query using operators to find specific content types." },
      { term: "site:", definition: "Operator restricting results to a given domain or host." },
      { term: "filetype:", definition: "Operator filtering by file extension such as pdf or xls." },
    ],
    mistakes: [
      "Running aggressive dorks against third parties without authorization.",
      "Assuming no results means no exposure — try alternate operators.",
      "Sharing live exploit dorks publicly without responsible context.",
    ],
    defensive: [
      "Run authorized dork audits against your domains quarterly.",
      "Use robots.txt and access controls — but do not rely on obscurity alone.",
      "Remove sensitive files from public indexes and misconfigured buckets.",
    ],
    quiz: [
      mcQuiz(
        "osint-op-q1",
        "site:example.com restricts results to:",
        ["Only images", "Pages on the example.com domain", "Email inboxes", "DNS servers"],
        1,
        "site: limits search results to the specified domain.",
      ),
      tfQuiz(
        "osint-op-q2",
        "filetype:pdf helps locate PDF documents in search results.",
        true,
        "Filetype filters surface specific document formats.",
      ),
      mcQuiz(
        "osint-op-q3",
        "Using search dorks against systems you do not own or lack authorization to test is:",
        ["Always fine", "Potentially unethical or illegal depending on context", "Required for DNS", "A replacement for patching"],
        1,
        "Scope and authorization matter for defensive vs unauthorized probing.",
      ),
    ],
  }),

  createLesson({
    id: "osint-domain-dns",
    pathId: PATH,
    order: 5,
    title: "Domain/DNS Research",
    summary:
      "WHOIS, DNS record types, subdomain enumeration, passive DNS, and mapping adversary infrastructure.",
    objectives: [
      "Interpret WHOIS and DNS records (A, AAAA, MX, TXT, NS, CNAME)",
      "Enumerate subdomains and related domains",
      "Use passive DNS and certificate logs for historical context",
    ],
    introduction:
      "Domains are anchors on the internet — registration data, DNS records, and certificates reveal ownership, mail providers, subdomains, and infrastructure pivots. OSINT analysts trace phishing campaigns, brand abuse, and attacker C2 by following domain and DNS trails legally through public registries and resolvers.",
    coreConcepts: [
      "WHOIS/RDAP shows registrant, dates, nameservers — often redacted post-GDPR.",
      "A/AAAA records map hostnames to IPs; MX to mail servers; TXT for SPF, DKIM, verification.",
      "Subdomain enumeration: certificate transparency, DNS brute force, search engine hints.",
      "Passive DNS shows historical hostname-to-IP mappings from global resolvers.",
      "Typosquatting and homoglyph domains impersonate brands.",
    ],
    explanation:
      "Phishing email links to secure-yourcompany-login.com. WHOIS shows recent registration and privacy guard. DNS A record points to cheap hosting IP; passive DNS links same IP to other phishing domains. MX absent — not used for mail. Compare to legitimate yourcompany.com nameservers and SPF TXT. Certificate transparency (crt.sh) lists *.yourcompany.com legit subdomains vs attacker certs. Defenders register defensive typos, monitor CT logs, and sinkhole lookalikes. Document chain: domain → IP → ASN → hosting provider for abuse reports.",
    realWorld:
      "Brand protection teams use automated CT monitoring for fraudulent certs. Threat hunters cluster APT infrastructure via shared nameservers and WHOIS emails.",
    scenario:
      "Identify three DNS/WHOIS indicators that a domain is likely phishing versus legitimate corporate infrastructure.",
    practical: [
      {
        kind: "command",
        title: "DNS lookups",
        content:
          "dig yourcompany.com ANY +short\ndig MX yourcompany.com +short\nwhois suspicious-domain.example",
      },
    ],
    terms: [
      { term: "RDAP", definition: "Registration Data Access Protocol — modern WHOIS successor for domain data." },
      { term: "Passive DNS", definition: "Historical DNS resolution data collected by sensors over time." },
      { term: "Typosquatting", definition: "Registering domains similar to legitimate names to deceive users." },
    ],
    mistakes: [
      "Trusting WHOIS privacy bypass without corroboration.",
      "Ignoring subdomains — dev.api.old.yourcompany.com may be exposed.",
      "Active DNS brute force against third parties without authorization.",
    ],
    defensive: [
      "Monitor CT logs and register defensive domains.",
      "Publish DMARC, SPF, and DKIM to reduce spoofing success.",
      "Document authorized subdomain inventory for comparison.",
    ],
    quiz: [
      mcQuiz(
        "osint-dns-q1",
        "MX records indicate:",
        ["Mail servers for the domain", "IPv6 only", "CPU type", "Browser version"],
        0,
        "MX records specify mail exchange hosts.",
      ),
      tfQuiz(
        "osint-dns-q2",
        "Certificate transparency logs can reveal subdomains.",
        true,
        "Issued certificates list hostnames including subdomains.",
      ),
      mcQuiz(
        "osint-dns-q3",
        "Passive DNS is useful because it shows:",
        ["Only future DNS changes", "Historical hostname and IP relationships", "Employee salaries", "Keyboard layouts"],
        1,
        "Passive DNS reveals past resolutions for pivoting.",
      ),
    ],
  }),

  createLesson({
    id: "osint-public-records",
    pathId: PATH,
    order: 6,
    title: "Public Records",
    summary:
      "Corporate filings, court documents, property records, patents, and government databases for investigative pivots.",
    objectives: [
      "Navigate common public record sources by jurisdiction",
      "Extract entities, officers, and relationships from filings",
      "Combine records with other OSINT for verification",
    ],
    introduction:
      "Governments and courts publish vast data: business registrations, lawsuits, property deeds, sanctions lists, and regulatory actions. These records ground OSINT in authoritative facts — who owns a company, where they operate, whether they were sued for fraud. Analysts chain records across jurisdictions to map shell companies and supply chain risk.",
    coreConcepts: [
      "Corporate registries list officers, registered agents, and incorporation dates.",
      "Court PACER/state systems document civil and criminal cases (fees may apply).",
      "Property records tie individuals to addresses.",
      "Sanctions lists (OFAC, EU) flag restricted entities.",
      "Patent and trademark databases reveal R&D and brand claims.",
    ],
    explanation:
      "Vendor due diligence: search state SOS for company status, cross-reference officers on LinkedIn, check OFAC sanctions, search news for fraud allegations. Shell networks share registered agent and mailbox addresses across dozens of entities. Court records reveal bankruptcy and IP disputes. International investigations need country-specific portals — UK Companies House, EU business registers. Records can be outdated or nominally accurate with straw owners — combine with other OSINT. Redact sensitive personal data in reports per policy.",
    realWorld:
      "Investigative journalists mapped fraud rings via shared registered addresses. Enterprises screen third parties against sanctions before onboarding.",
    scenario:
      "A new vendor's CEO name matches an officer in a dissolved company with fraud judgments. What public records do you pull next?",
    terms: [
      { term: "Registered agent", definition: "Entity authorized to receive legal documents on behalf of a company." },
      { term: "OFAC", definition: "US Treasury office maintaining sanctions lists for restricted parties." },
      { term: "Shell company", definition: "Entity with minimal operations, often used to obscure ownership." },
    ],
    mistakes: [
      "Assuming same name equals same person without corroboration.",
      "Ignoring international registry equivalents.",
      "Using outdated filings without checking amendments.",
    ],
    defensive: [
      "Screen vendors against sanctions and adverse media.",
      "Monitor corporate identity theft filings in your company name.",
      "Maintain accurate public filings for your own entities.",
    ],
    quiz: [
      mcQuiz(
        "osint-pub-q1",
        "Corporate registry filings typically include:",
        ["Office coffee preferences", "Officers and registered agents", "Employee passwords", "Private encryption keys"],
        1,
        "Registries document legal entity structure and agents.",
      ),
      tfQuiz(
        "osint-pub-q2",
        "Sanctions lists help identify entities restricted from business dealings.",
        true,
        "OFAC and similar lists flag prohibited parties.",
      ),
      mcQuiz(
        "osint-pub-q3",
        "Shared registered agent addresses across many companies may suggest:",
        ["Strong security", "Shell company networks", "Faster DNS", "Better Wi-Fi"],
        1,
        "Common agents link otherwise unrelated shell entities.",
      ),
    ],
  }),

  createLesson({
    id: "osint-metadata",
    pathId: PATH,
    order: 7,
    title: "Metadata in OSINT",
    summary:
      "EXIF, document properties, PDF author fields, and social platform metadata for attribution and verification.",
    objectives: [
      "Extract and interpret metadata from images and documents in OSINT",
      "Assess reliability and spoofing of metadata fields",
      "Apply metadata ethically in investigations",
    ],
    introduction:
      "Files published online carry hidden metadata — camera model, GPS, author name, software version, edit history. OSINT analysts use metadata to verify authenticity, geolocate images, and attribute documents. Metadata also risks exposing investigators' own tools if they re-upload files carelessly.",
    coreConcepts: [
      "EXIF in photos: timestamp, GPS, device, software.",
      "Office/PDF: author, company, creation tool, revision history.",
      "Social platforms strip or alter some metadata on upload.",
      "Metadata can be edited or stripped — never sole proof.",
      "Analysts scrub metadata from their own exports to protect operations.",
    ],
    explanation:
      "A leaked memo PDF shows Author: contractor@competitor.com and CreationDate matching breach window. Cross-check with DKIM-authenticated email if available. Protest photo geolocation: EXIF GPS matches claimed location; reverse search confirms not stock image. Video metadata may include device serial. Tools: exiftool, online viewers, document XML unzip. When metadata conflicts with content, seek primary sources. Publishing OSINT reports — strip your own machine usernames from embedded properties.",
    realWorld:
      "Bellingcat-style investigations combine sun angle, shadows, and metadata for geolocation. Leak sites' PDFs exposed insider toolchains via author fields.",
    scenario:
      "An image posted as 'live from Site A' has EXIF GPS pointing to Site B and Photoshop in Software field. How do you report this?",
    practical: [
      {
        kind: "command",
        title: "Metadata extraction",
        content: "exiftool -a -G1 suspect-document.pdf | head -30",
      },
    ],
    terms: [
      { term: "EXIF", definition: "Embedded image metadata including time, device, and sometimes GPS." },
      { term: "Geolocation", definition: "Determining geographic location of media or events from evidence." },
      { term: "Provenance", definition: "Origin and history of a file or claim — metadata supports but does not alone prove it." },
    ],
    mistakes: [
      "Basing attribution solely on editable Author fields.",
      "Re-uploading evidence files without preserving original hashes and metadata.",
      "Ignoring platform metadata stripping when photos lack EXIF.",
    ],
    defensive: [
      "Strip sensitive metadata from public marketing materials.",
      "Train employees on metadata leakage in shared documents.",
      "Verify leaked files with hashes and multiple attributes.",
    ],
    quiz: [
      mcQuiz(
        "osint-meta-q1",
        "EXIF data in images may include:",
        ["GPS coordinates and camera model", "Employee SSN by default", "Firewall rules", "Database passwords"],
        0,
        "EXIF commonly stores capture time, device, and sometimes location.",
      ),
      tfQuiz(
        "osint-meta-q2",
        "Metadata should be corroborated because it can be edited or stripped.",
        true,
        "Author and date fields are not tamper-proof.",
      ),
      mcQuiz(
        "osint-meta-q3",
        "OSINT analysts should scrub metadata from their own exports to:",
        ["Improve image quality", "Avoid leaking their tools or identity", "Speed DNS", "Disable encryption"],
        1,
        "Embedded properties can reveal analyst workstation details.",
      ),
    ],
  }),

  createLesson({
    id: "osint-source-verification",
    pathId: PATH,
    order: 8,
    title: "Source Verification",
    summary:
      "Admiralty grading, cross-verification, bot detection, deepfakes awareness, and writing defensible OSINT conclusions.",
    objectives: [
      "Apply source reliability and information credibility frameworks",
      "Cross-verify claims across independent sources",
      "Present confidence levels and limitations in reporting",
    ],
    introduction:
      "OSINT fails when analysts confuse rumor with fact. Verification disciplines — NATO Admiralty codes, lateral reading, primary source confirmation — separate intelligence from misinformation. In an era of bots, AI-generated images, and coordinated disinformation, verification is the core skill that makes OSINT trustworthy.",
    coreConcepts: [
      "Source reliability (A-F) and information credibility (1-6) in Admiralty system.",
      "Lateral reading: check what other sites say about the source, don't only read the source.",
      "Primary vs secondary: official filing beats blog commentary.",
      "Corroboration: two independent sources strengthen confidence.",
      "Deepfakes and synthetic media require technical and contextual checks.",
    ],
    explanation:
      "A Twitter account claims a CEO resigned. Check: verified official investor relations site, SEC 8-K filing, reputable news wires, company LinkedIn. Grade source C (unverified account), information 3 (possibly true) until confirmed. Bot signals: recent creation, repetitive posts, odd hours. Image verification: reverse search, error level analysis, shadow consistency. Report language: 'We assess with moderate confidence… based on X and Y. Contradicting evidence: Z.' Avoid absolute statements without A1 confirmation. Update assessments as new data arrives.",
    realWorld:
      "Misinformation during crises spreads faster than verified OSINT. Newsrooms and intel teams use formal confidence language to avoid liability and errors.",
    scenario:
      "Three blogs report a data breach at your company but your SOC sees nothing. Outline verification steps before public response.",
    terms: [
      { term: "Admiralty code", definition: "NATO system grading source reliability and information credibility." },
      { term: "Lateral reading", definition: "Validating a source by researching it from outside sites." },
      { term: "Confidence assessment", definition: "Explicit statement of certainty level and supporting rationale." },
    ],
    mistakes: [
      "Single-source reporting presented as confirmed fact.",
      "Ignoring bot networks amplifying false claims.",
      "Confirmation bias — seeking only supporting evidence.",
    ],
    defensive: [
      "Establish verification SOPs for crisis communications.",
      "Monitor for false breach claims targeting your brand.",
      "Train spokespeople on confidence language.",
    ],
    quiz: [
      mcQuiz(
        "osint-ver-q1",
        "Lateral reading means:",
        ["Only reading the original site deeply", "Checking other sources about the source's reputation", "Deleting bookmarks", "Disabling JavaScript"],
        1,
        "Lateral reading validates sources via external context.",
      ),
      tfQuiz(
        "osint-ver-q2",
        "A single unverified social media post should usually not be reported as confirmed fact.",
        true,
        "Corroboration from independent sources is required for high confidence.",
      ),
      mcQuiz(
        "osint-ver-q3",
        "The Admiralty system grades:",
        ["Coffee quality", "Source reliability and information credibility", "Monitor refresh rates", "Cable lengths"],
        1,
        "Admiralty codes document trust in source and information separately.",
      ),
    ],
  }),
];

export const osintAssessment = createPathAssessment(
  PATH,
  "OSINT Fundamentals Path Assessment",
  [
    mcQuiz("osint-final-1", "OSINT uses:", ["Stolen credentials", "Publicly available sources", "Unauthorized hacking", "Classified-only data"], 1, "OSINT is legal public information collection."),
    tfQuiz("osint-final-2", "Unauthorized login to another person's account is acceptable OSINT.", false, "That is unauthorized access, not OSINT."),
    mcQuiz("osint-final-3", "site: operator limits results to:", ["A specific domain", "Only PDF files globally", "Encrypted traffic", "Memory dumps"], 0, "site: restricts to the given domain."),
    mcQuiz("osint-final-4", "Certificate transparency helps find:", ["Employee passwords", "Subdomains and issued certificates", "CPU temperature", "Printer ink levels"], 1, "CT logs list hostnames on certificates."),
    mcQuiz("osint-final-5", "Source verification aims to:", ["Skip documentation", "Separate fact from rumor with corroboration", "Delete all archives", "Avoid legal review"], 1, "Verification ensures defensible conclusions."),
  ],
);
