import { cmd, FORENSICS_SCENARIO, h, lab, NETWORK_SCENARIO, prefix, step } from "../helpers";

export const osintTerminals = {
  "osint-what-is-osint": lab(
    "OSINT introduction lab",
    "Practice passive domain research using only public DNS and WHOIS — no port scanning.",
    NETWORK_SCENARIO,
    [
      step(
        "whoami",
        "Document who is conducting the research (your analyst account).",
        "OSINT reports must cite who collected data and when — chain of custody starts at collection.",
        [h("Command", "whoami")],
        [cmd("whoami")],
      ),
      step(
        "dig",
        "Query DNS A record for hacknology.xyz.",
        "DNS is public by design; A records reveal where a hostname currently points.",
        [h("Concept", "Passive OSINT does not touch the target server directly."), h("Command", "dig hacknology.xyz")],
        [prefix("dig")],
      ),
      step(
        "whois",
        "Run WHOIS to see registrar and registration dates.",
        "WHOIS helps verify domain age — typosquat domains registered yesterday are suspicious.",
        [h("Command", "whois hacknology.xyz")],
        [prefix("whois")],
        "You built a minimal infrastructure profile using only public records.",
      ),
    ],
  ),

  "osint-ethical-legal": lab(
    "Ethical OSINT lab",
    "Practice scope discipline: approved domain, passive methods only.",
    NETWORK_SCENARIO,
    [
      step(
        "cat-notes",
        "Read research-notes.txt — every line is a search or lookup to document with authorization.",
        "Collecting OSINT without legal authority or against site terms of service can create liability.",
        [h("Command", "cat research-notes.txt")],
        [cmd("cat research-notes.txt")],
      ),
      step(
        "dig",
        "Perform passive DNS lookup on the approved training domain.",
        [h("Command", "dig hacknology.xyz")],
        [prefix("dig")],
      ),
    ],
  ),

  "osint-search-techniques": lab(
    "Search techniques lab",
    "Layer quick and detailed DNS lookups, then corroborate with WHOIS.",
    NETWORK_SCENARIO,
    [
      step(
        "host",
        "Use host for a concise DNS answer.",
        "Start with the fastest lookup that answers your question — add detail only when needed.",
        [h("Command", "host hacknology.xyz")],
        [prefix("host")],
      ),
      step(
        "dig",
        "Use dig when you need TTL and record type detail for your notes.",
        [h("Command", "dig hacknology.xyz")],
        [prefix("dig")],
      ),
      step(
        "whois",
        "Add WHOIS context before drawing conclusions from DNS alone.",
        [h("Command", "whois hacknology.xyz")],
        [prefix("whois")],
      ),
    ],
  ),

  "osint-search-operators": lab(
    "Search operators lab",
    "Filter your OSINT notes the way search-engine operators narrow results.",
    NETWORK_SCENARIO,
    [
      step(
        "cat-notes",
        "Read research-notes.txt containing example search operators.",
        "Operators like site:, filetype:, and intitle: reduce noise — document which operator produced each finding.",
        [h("Command", "cat research-notes.txt")],
        [cmd("cat research-notes.txt")],
      ),
      step(
        "grep-site",
        "Grep for site: operator lines in your notes.",
        "site: limits results to one domain — useful for finding exposed PDFs or admin pages.",
        [h("Syntax", "grep site research-notes.txt"), h("Command", "grep site research-notes.txt")],
        [prefix("grep site")],
      ),
      step(
        "dig",
        "Validate a domain from your notes with DNS before acting on search results.",
        "Search indexes can be stale; DNS confirms current infrastructure.",
        [h("Command", "dig hacknology.xyz")],
        [prefix("dig")],
      ),
    ],
  ),

  "osint-domain-dns": lab(
    "Domain and DNS OSINT lab",
    "Build a domain profile using dig, host, and WHOIS cross-checks.",
    NETWORK_SCENARIO,
    [
      step(
        "dig",
        "Query A record for the target domain.",
        [h("Command", "dig hacknology.xyz")],
        [prefix("dig")],
      ),
      step(
        "host",
        "Confirm the A record with host.",
        [h("Command", "host hacknology.xyz")],
        [prefix("host")],
      ),
      step(
        "whois",
        "Correlate DNS with WHOIS registration metadata.",
        "Registration date + nameserver changes + DNS A record = basic timeline.",
        [h("Command", "whois hacknology.xyz")],
        [prefix("whois")],
        "DNS + WHOIS builds a defensible domain ownership timeline for your report.",
      ),
    ],
  ),

  "osint-public-records": lab(
    "Public records lab",
    "Treat WHOIS and DNS as public records anyone can query — verify before trusting third-party reposts.",
    NETWORK_SCENARIO,
    [
      step(
        "whois",
        "Query primary WHOIS data from the registrar chain.",
        [h("Command", "whois hacknology.xyz")],
        [prefix("whois")],
      ),
      step(
        "dig",
        "Query authoritative DNS data separately from WHOIS aggregators.",
        [h("Command", "dig hacknology.xyz")],
        [prefix("dig")],
      ),
    ],
  ),

  "osint-metadata": lab(
    "Metadata OSINT lab",
    "Compare file metadata with domain registration data to spot inconsistencies.",
    { ...FORENSICS_SCENARIO, initialCwd: "/home/investigator" },
    [
      step(
        "cd-evidence",
        "Navigate to /evidence where preserved files include metadata records.",
        "When investigating leaked documents, record SHA256 hash, author field, and extraction tool in your notes.",
        [h("Command", "cd /evidence")],
        [cmd("cd /evidence")],
      ),
      step(
        "cat-meta",
        "Read file-metadata.txt — note hash and Created timestamp.",
        [h("Command", "cat file-metadata.txt")],
        [cmd("cat file-metadata.txt")],
      ),
      step(
        "whois",
        "Compare file Created date with domain WHOIS registration date for timeline analysis.",
        [h("Command", "whois hacknology.xyz")],
        [prefix("whois")],
        "Metadata + WHOIS cross-check catches forged or misattributed documents.",
      ),
    ],
  ),

  "osint-source-verification": lab(
    "Source verification lab",
    "Corroborate findings across independent sources before reporting.",
    NETWORK_SCENARIO,
    [
      step(
        "dig",
        "Primary source: live DNS A record.",
        [h("Command", "dig hacknology.xyz")],
        [prefix("dig")],
      ),
      step(
        "whois",
        "Secondary source: registrar WHOIS.",
        [h("Command", "whois hacknology.xyz")],
        [prefix("whois")],
      ),
      step(
        "host",
        "Tertiary confirmation with a second DNS tool.",
        "If sources disagree, investigate caching, CDN fronting, or outdated intel feeds.",
        [h("Command", "host hacknology.xyz")],
        [prefix("host")],
        "Three agreeing sources increase confidence; one outlier demands more research.",
      ),
    ],
  ),
};
