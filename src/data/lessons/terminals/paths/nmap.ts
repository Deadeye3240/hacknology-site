import { cmd, h, lab, NETWORK_SCENARIO, prefix, step } from "../helpers";

const TARGET = "10.10.10.25";

export const nmapTerminals = {
  "nmap-network-reconnaissance": lab(
    "Reconnaissance workflow lab",
    "Confirm reachability before investing time in deeper scans.",
    { ...NETWORK_SCENARIO, banner: "Authorized recon lab — target 10.10.10.25 only." },
    [
      step("ping", "Ping the training target to confirm it is online.",
        "Scanning a dead host wastes time; ping (or ARP on LAN) confirms liveness first.",
        [h("Command", `ping ${TARGET}`), h("Alt", "ping training-target")], [prefix("ping")]),
      step("nmap-ping", "Run nmap -sn for a host discovery scan without port scan.",
        "Discovery scans map live hosts without probing every port — lower noise.",
        [h("Command", `nmap -sn ${TARGET}`)], [prefix("nmap -sn"), prefix("nmap")]),
      step("nmap-quick", "Run a basic port scan on the authorized target.",
        [h("Command", `nmap ${TARGET}`)], [prefix(`nmap ${TARGET}`), prefix("nmap 10")]),
    ],
  ),

  "nmap-what-is-nmap": lab(
    "Nmap introduction lab",
    "Run your first safe scan against the lab target.",
    { ...NETWORK_SCENARIO, banner: "Nmap training — simulated output, authorized target only." },
    [
      step("help", "Type help to see available lab commands including nmap.",
        "Knowing built-in tools prevents typos before running real scans.",
        [h("Command", "help")], [cmd("help")]),
      step("nmap-basic", `Scan ${TARGET} with default nmap settings.`,
        "Default scan checks common TCP ports — good first pass on unknown hosts.",
        [h("Command", `nmap ${TARGET}`)], [prefix("nmap")]),
      step("read-output", "Review output — identify open ports 22 and 80 in the scan report.",
        "Open ports map to services; 22=SSH, 80=HTTP are common findings.",
        [h("Command", `nmap ${TARGET}`)], [prefix("nmap")],
        "You interpreted scan results — core skill before advanced flags."),
    ],
  ),

  "nmap-basic-scanning": lab(
    "Basic scanning lab",
    "Progress from host discovery to port scan.",
    { ...NETWORK_SCENARIO, banner: "Progressive Nmap lab — one authorized target." },
    [
      step("nmap-sn", `Host discovery only: nmap -sn ${TARGET}.`,
        "-sn skips port scan — use when mapping a subnet for live hosts.",
        [h("Command", `nmap -sn ${TARGET}`)], [prefix("nmap -sn")]),
      step("nmap-default", `Default TCP scan: nmap ${TARGET}.`,
        [h("Command", `nmap ${TARGET}`)], [prefix(`nmap ${TARGET}`), prefix("nmap 10")]),
      step("nmap-top", `Scan top ports explicitly: nmap --top-ports 20 ${TARGET}.`,
        "Limiting ports reduces scan time and noise on large networks.",
        [h("Command", `nmap --top-ports 20 ${TARGET}`)], [prefix("nmap")]),
    ],
  ),

  "nmap-tcp-scanning": lab(
    "TCP scan types lab",
    "Practice TCP connect scanning on the lab host.",
    { ...NETWORK_SCENARIO, banner: "TCP scanning — simulated connect scan output." },
    [
      step("nmap-tcp", `Run TCP scan: nmap -sT ${TARGET} (connect scan).`,
        "-sT completes full TCP handshake — reliable but logged by many firewalls.",
        [h("Command", `nmap -sT ${TARGET}`), h("Alt", `nmap ${TARGET}`)], [prefix("nmap")]),
      step("ss-compare", "List local listening ports with ss — compare to scan findings.",
        "Understanding local listeners helps validate scan accuracy in labs.",
        [h("Command", "ss -tulpn")], [prefix("ss")]),
      step("nmap-repeat", `Re-run nmap ${TARGET} and note STATE column (open/filtered/closed).`,
        [h("Command", `nmap ${TARGET}`)], [prefix("nmap")]),
    ],
  ),

  "nmap-udp-scanning": lab(
    "UDP scanning lab",
    "Scan UDP services — slower but finds DNS, SNMP, and NTP.",
    { ...NETWORK_SCENARIO, banner: "UDP scan lab — simulated UDP port results." },
    [
      step("nmap-udp", `Run UDP scan: nmap -sU ${TARGET}.`,
        "UDP is connectionless — scans take longer and results are often open|filtered.",
        [h("Command", `nmap -sU ${TARGET}`)], [prefix("nmap -sU"), prefix("nmap -s")]),
      step("read-udp", "Review output for UDP ports 53 (DNS) and 123 (NTP).",
        [h("Command", `nmap -sU ${TARGET}`)], [prefix("nmap")]),
      step("nmap-tcp", "Run TCP scan too — most services still use TCP.",
        [h("Command", `nmap ${TARGET}`)], [prefix("nmap 10")]),
    ],
  ),

  "nmap-port-states": lab(
    "Port states lab",
    "Learn to read open, closed, and filtered states in Nmap output.",
    { ...NETWORK_SCENARIO, banner: "Port state interpretation lab." },
    [
      step("nmap", `Scan ${TARGET} and read the STATE column.`,
        "open = accepting connections; filtered = firewall dropped probe; closed = reachable but no service.",
        [h("Command", `nmap ${TARGET}`)], [prefix("nmap")]),
      step("nmap-verbose", `Add verbosity: nmap -v ${TARGET}.`,
        "Verbose output shows probe timing — helps debug slow scans.",
        [h("Command", `nmap -v ${TARGET}`)], [prefix("nmap")]),
      step("echo-states", 'Echo the three states: open, closed, filtered.',
        "Naming states correctly matters in reports and ticket notes.",
        [h("Command", 'echo "open closed filtered"')], [prefix("echo")]),
    ],
  ),

  "nmap-service-detection": lab(
    "Service detection lab",
    "Use -sV to map ports to service names and versions.",
    { ...NETWORK_SCENARIO, banner: "Service detection — -sV flag lab." },
    [
      step("nmap-basic", `Baseline scan: nmap ${TARGET}.`,
        [h("Command", `nmap ${TARGET}`)], [prefix("nmap 10")]),
      step("nmap-sv", `Service version scan: nmap -sV ${TARGET}.`,
        "-sV probes banners to identify software — critical for vulnerability matching.",
        [h("Command", `nmap -sV ${TARGET}`)], [prefix("nmap -sV"), prefix("nmap -s")]),
      step("read-version", "Identify OpenSSH and Apache versions in -sV output.",
        [h("Command", `nmap -sV ${TARGET}`)], [prefix("nmap")],
        "Version strings feed patch and CVE prioritization."),
    ],
  ),

  "nmap-version-detection": lab(
    "Version detection depth lab",
    "Combine port scan with version probes.",
    { ...NETWORK_SCENARIO, banner: "Version detection lab." },
    [
      step("nmap-sv", `Run nmap -sV ${TARGET}.`,
        "Accurate versions reduce false positives when matching CVE databases.",
        [h("Command", `nmap -sV ${TARGET}`)], [prefix("nmap -sV")]),
      step("nmap-scripts", `Optional script scan concept: nmap -sC ${TARGET}.`,
        "-sC runs default NSE scripts — only on authorized targets.",
        [h("Command", `nmap -sC ${TARGET}`), h("Alt", `nmap -sV ${TARGET}`)], [prefix("nmap")]),
    ],
  ),

  "nmap-os-detection": lab(
    "OS detection lab",
    "Use -O to infer remote operating system (authorized lab only).",
    { ...NETWORK_SCENARIO, banner: "OS detection — requires authorization." },
    [
      step("nmap-o", `Run OS detection: nmap -O ${TARGET}.`,
        "-O sends fingerprint probes — intrusive; never without written permission.",
        [h("Command", `nmap -O ${TARGET}`)], [prefix("nmap -O"), prefix("nmap -o")]),
      step("read-os", "Review OS details line in output (Linux kernel range).",
        [h("Command", `nmap -O ${TARGET}`)], [prefix("nmap")]),
      step("echo-auth", 'Echo reminder: authorized scanning only.',
        [h("Command", 'echo "authorized scan only"')], [prefix("echo")]),
    ],
  ),

  "nmap-safe-authorized-scanning": lab(
    "Safe scanning lab",
    "Practice minimal, authorized scan workflow end-to-end.",
    { ...NETWORK_SCENARIO, banner: "Safe scanning checklist lab." },
    [
      step("echo-scope", 'Echo your scope: authorized target 10.10.10.25 only.',
        "Scope creep causes legal and career-ending mistakes — state scope before scanning.",
        [h("Command", 'echo "scope: 10.10.10.25"')], [prefix("echo")]),
      step("nmap-sn", `Discovery: nmap -sn ${TARGET}.`,
        [h("Command", `nmap -sn ${TARGET}`)], [prefix("nmap -sn")]),
      step("nmap-sv", `Version scan on in-scope host: nmap -sV ${TARGET}.`,
        [h("Command", `nmap -sV ${TARGET}`)], [prefix("nmap -sV")],
        "Scope → discovery → targeted -sV — professional recon workflow."),
    ],
  ),
};
