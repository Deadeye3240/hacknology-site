import {
  createLesson,
  mcQuiz,
  tfQuiz,
} from "../lessonFactory";

const PATH = "networking";

export const networkingLessons = [
  createLesson({
    id: "networking-osi-model",
    pathId: PATH,
    order: 1,
    title: "OSI Model",
    summary:
      "Seven layers that describe how data moves from application to wire — and where security controls attach at each stage.",
    estimatedMinutes: 22,
    objectives: [
      "Name all seven OSI layers in order",
      "Match common protocols to their OSI layers",
      "Explain why layered models help troubleshoot and secure networks",
    ],
    introduction:
      "The Open Systems Interconnection (OSI) model is a conceptual framework for understanding network communication. No single product implements OSI literally, but the model gives security practitioners a shared vocabulary: when an incident involves DNS, you are at Layer 7; when packets never arrive, you descend to Layer 3 or below. Attackers and defenders both reason in layers — encryption protects confidentiality at Layer 6, firewalls filter at Layers 3–4, and phishing abuses Layer 7 trust.",
    coreConcepts: [
      "Layer 7 (Application): HTTP, DNS, SMTP — what users and applications interact with directly.",
      "Layer 6 (Presentation): encoding, encryption, compression — TLS often discussed here or at Layer 5.",
      "Layer 5 (Session): manages dialogues between applications — less visible in modern stacks.",
      "Layer 4 (Transport): TCP and UDP — ports, reliability, and flow control.",
      "Layer 3 (Network): IP addressing and routing — packets cross subnets.",
      "Layer 2 (Data Link): MAC addresses, switches, VLANs, Ethernet frames.",
      "Layer 1 (Physical): cables, radio, fiber — bits on the medium.",
    ],
    explanation:
      "Data descends the stack on the sender: an HTTP request is wrapped in TCP segments, IP packets, Ethernet frames, then transmitted as bits. Each layer adds a header with information the peer layer needs. On the receiver, the process reverses — each layer strips its header and passes payload upward. Security tools map to layers: IDS may inspect Layer 7 payloads, stateful firewalls track Layer 4 connections, routers forward Layer 3 packets, and 802.1X authenticates at Layer 2. When troubleshooting, isolate the layer: if ping (ICMP, Layer 3) works but HTTPS fails, the problem is likely above Layer 3.",
    realWorld:
      "SOC analysts classify alerts by layer. A SYN flood is a Layer 4 availability attack. ARP spoofing is Layer 2. Malicious DNS responses abuse Layer 7 trust in name resolution. Penetration testers document findings by layer so network and application teams know who owns remediation.",
    scenario:
      "Users report that internal websites load but external HTTPS sites time out. Ping to 8.8.8.8 succeeds. DNS resolves correctly. At which OSI layers would you investigate next, and why?",
    practical: [
      {
        kind: "diagram",
        title: "OSI stack (simplified)",
        content:
          "Application → Presentation → Session → Transport (TCP/UDP) → Network (IP) → Data Link (Ethernet) → Physical",
      },
    ],
    terms: [
      { term: "Encapsulation", definition: "Each layer wraps upper-layer data with its own header (and sometimes trailer) before passing downward." },
      { term: "PDU", definition: "Protocol Data Unit — the name for a layer's packet (e.g. frame at Layer 2, segment at Layer 4)." },
      { term: "Peer layer", definition: "Corresponding layer on the remote host that reads the header added by the sender's layer." },
    ],
    mistakes: [
      "Memorizing layers without connecting them to real protocols and tools.",
      "Assuming TLS is only Layer 6 — in practice it sits between application and transport.",
      "Debugging only at Layer 7 when connectivity failures are often Layer 3 routing issues.",
    ],
    defensive: [
      "Apply defense in depth across layers — no single layer is sufficient.",
      "Map security controls to OSI layers in architecture documentation.",
      "Use layered troubleshooting to narrow incident scope quickly.",
    ],
    quiz: [
      mcQuiz(
        "net-osi-q1",
        "Which OSI layer is responsible for IP addressing and routing?",
        ["Layer 2", "Layer 3", "Layer 5", "Layer 7"],
        1,
        "Layer 3 (Network) handles logical addressing and path selection between networks.",
      ),
      mcQuiz(
        "net-osi-q2",
        "HTTP operates primarily at which OSI layer?",
        ["Layer 1", "Layer 4", "Layer 7", "Layer 2"],
        2,
        "HTTP is an application-layer protocol used directly by browsers and APIs.",
      ),
      tfQuiz(
        "net-osi-q3",
        "The OSI model helps security teams describe where a control or attack applies in the network stack.",
        true,
        "Layered vocabulary is standard in incident response, architecture, and certification exams.",
      ),
    ],
  }),

  createLesson({
    id: "networking-tcp-ip-model",
    pathId: PATH,
    order: 2,
    title: "TCP/IP Model",
    summary:
      "The four-layer Internet model used in production — how it maps to OSI and what security practitioners actually debug.",
    estimatedMinutes: 21,
    objectives: [
      "Describe the four TCP/IP layers and their roles",
      "Map OSI layers to the TCP/IP model",
      "Identify which layer handles IP, TCP, and HTTP respectively",
    ],
    introduction:
      "While textbooks teach OSI, the internet runs on TCP/IP. The TCP/IP model compresses OSI into four practical layers: Link, Internet, Transport, and Application. Linux network stacks, Wireshark dissectors, and cloud VPC diagrams all reflect this model. Understanding TCP/IP is essential for reading packet captures, configuring firewalls, and explaining why a connection succeeds at the IP layer but fails at the application layer.",
    coreConcepts: [
      "Link layer (Network Access): Ethernet, Wi‑Fi, ARP — local delivery on a segment.",
      "Internet layer: IP (IPv4/IPv6), ICMP — global addressing and routing.",
      "Transport layer: TCP and UDP — end-to-end delivery between processes via ports.",
      "Application layer: HTTP, DNS, SSH, TLS — user-facing and infrastructure protocols.",
      "TCP/IP merges OSI Layers 5–7 into Application for simplicity.",
    ],
    explanation:
      "When you browse a site, the application layer forms an HTTP request. TCP segments it with source/destination ports (e.g. 52341 → 443). IP adds source/destination addresses and routes packets hop by hop. The link layer frames packets for the local network using MAC addresses. Responses unwind the stack in reverse. NAT and firewalls often operate at Internet and Transport layers. Load balancers may terminate TCP and forward new connections upstream. Security monitoring taps multiple layers: NetFlow at Internet, session logs at Transport, and WAF rules at Application.",
    realWorld:
      "Cloud security groups are stateful Transport/Internet filters. Kubernetes NetworkPolicies reference IP and port. EDR tools hook application APIs while NDR appliances inspect packets — all TCP/IP concepts.",
    scenario:
      "A host can SSH to an internal server by IP but not by hostname. Which TCP/IP layer is most likely misconfigured, and what protocol would you verify?",
    terms: [
      { term: "Internet layer", definition: "TCP/IP layer containing IP — provides best-effort datagram delivery across networks." },
      { term: "Stack", definition: "The set of protocols implemented on a host from link through application." },
      { term: "Dual stack", definition: "Host running both IPv4 and IPv6 simultaneously." },
    ],
    mistakes: [
      "Treating OSI and TCP/IP as competing standards rather than complementary views.",
      "Forgetting that ICMP lives at the Internet layer — ping failures are not application-layer issues.",
      "Ignoring link-layer problems (bad cable, wrong VLAN) when IP configuration looks correct.",
    ],
    defensive: [
      "Document which TCP/IP layers each security control inspects or modifies.",
      "Capture packets at the correct layer when reproducing incidents.",
      "Segment networks at Internet layer (subnets) and enforce policy at Transport layer (ports).",
    ],
    quiz: [
      mcQuiz(
        "net-tcpip-q1",
        "In the TCP/IP model, which layer includes IP addressing?",
        ["Link", "Internet", "Transport", "Application"],
        1,
        "The Internet layer handles IP, ICMP, and routing between networks.",
      ),
      mcQuiz(
        "net-tcpip-q2",
        "TCP and UDP belong to which TCP/IP layer?",
        ["Link", "Internet", "Transport", "Application"],
        2,
        "Transport layer protocols multiplex application traffic via port numbers.",
      ),
      tfQuiz(
        "net-tcpip-q3",
        "The TCP/IP application layer roughly combines OSI layers 5, 6, and 7.",
        true,
        "TCP/IP collapses session, presentation, and application into one layer.",
      ),
    ],
  }),

  createLesson({
    id: "networking-ip-addresses",
    pathId: PATH,
    order: 3,
    title: "IP Addresses",
    summary:
      "Logical identifiers for hosts on IP networks — public vs private, static vs dynamic, and why addressing mistakes break security policy.",
    estimatedMinutes: 20,
    objectives: [
      "Explain the purpose of an IP address on a network",
      "Distinguish public from private address space",
      "Understand static, dynamic, and reserved addressing roles",
    ],
    introduction:
      "An IP address identifies a host's location in an IP network — not unlike a street address for packets. Routers use destination IP addresses to forward traffic; firewalls use source and destination IPs in rules. Misunderstanding addressing leads to misrouted traffic, overly broad ACLs, and blind spots in logging. Security teams must know which ranges are internal, which are internet-routable, and which addresses appear in authentication or geo-blocking policies.",
    coreConcepts: [
      "IPv4 addresses are 32-bit dotted decimal (e.g. 192.168.1.10); IPv6 are 128-bit hexadecimal.",
      "Public addresses are globally routable on the internet; private ranges (RFC 1918) are used internally.",
      "Loopback (127.0.0.1 / ::1) refers to the local host; link-local addresses operate without a router.",
      "Static IPs are manually assigned; dynamic addresses come from DHCP or SLAAC (IPv6).",
      "Anycast presents the same IP from multiple locations — common for DNS and CDN edges.",
    ],
    explanation:
      "Every IP packet carries source and destination addresses. On a LAN, hosts may use private addresses while a gateway NATs outbound traffic to a public IP. Security policies often whitelist internal CIDR blocks and deny RFC 1918 sourced traffic arriving from the internet (spoofing indicator). Asset inventories tie vulnerabilities to IPs — inaccurate CMDB data delays incident response. IPv6 introduces new considerations: larger address space reduces scanning noise but also complicates address management; temporary privacy addresses affect correlation in logs.",
    realWorld:
      "Ransomware lateral movement is tracked via internal IP logs. Geo-IP blocking uses public address attribution. Cloud elastic IPs rotate with infrastructure — tagging resources by ID rather than IP alone prevents stale firewall rules.",
    scenario:
      "Firewall logs show inbound TCP connections sourced from 10.0.0.50 on the internet-facing interface. Why is this suspicious, and what control should have dropped it?",
    terms: [
      { term: "CIDR", definition: "Classless Inter-Domain Routing notation — IP prefix and mask length, e.g. 10.0.0.0/8." },
      { term: "RFC 1918", definition: "Defines private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16." },
      { term: "Default gateway", definition: "Router IP a host uses to reach destinations outside its local subnet." },
    ],
    mistakes: [
      "Hard-coding IP addresses in applications instead of DNS names.",
      "Assuming private IPs cannot appear in threat intelligence — compromised internal hosts do.",
      "Overlapping private ranges when merging networks via VPN or acquisition.",
    ],
    defensive: [
      "Ingress filter RFC 1918 and bogon ranges at the network edge.",
      "Maintain accurate IPAM or cloud tagging for asset attribution.",
      "Log and alert on impossible or reserved source addresses.",
    ],
    quiz: [
      mcQuiz(
        "net-ip-q1",
        "Which range is private IPv4 space per RFC 1918?",
        ["8.8.8.0/24", "192.168.0.0/16", "203.0.113.0/24", "1.1.1.0/24"],
        1,
        "192.168.0.0/16 is reserved for private use and not routed on the public internet.",
      ),
      mcQuiz(
        "net-ip-q2",
        "The primary purpose of an IP address is to:",
        ["Encrypt data", "Identify a host for routing at the network layer", "Replace MAC addresses permanently", "Assign TCP ports"],
        1,
        "IP provides logical host identification for internetwork routing.",
      ),
      tfQuiz(
        "net-ip-q3",
        "Traffic sourced from RFC 1918 addresses should never arrive directly from the public internet on an external interface.",
        true,
        "Such traffic indicates spoofing or misconfiguration and should be blocked.",
      ),
    ],
  }),

  createLesson({
    id: "networking-ipv4-ipv6",
    pathId: PATH,
    order: 4,
    title: "IPv4 and IPv6",
    summary:
      "Two versions of the Internet Protocol — address exhaustion, dual-stack deployment, and security implications of the transition.",
    estimatedMinutes: 24,
    objectives: [
      "Compare IPv4 and IPv6 address formats and header differences",
      "Explain why IPv6 adoption continues alongside IPv4",
      "Identify security gaps when IPv6 is enabled but not monitored",
    ],
    introduction:
      "IPv4 has powered the internet for decades with 32-bit addresses — roughly 4.3 billion usable addresses, exhausted for new allocations. IPv6 uses 128-bit addresses, vastly expanding capacity and simplifying some routing concepts. Most enterprises run dual-stack or IPv6-only internally with IPv4 carried over translation. Security teams must treat IPv6 as first-class: unmonitored IPv6 tunnels and neighbor discovery can become shadow paths attackers exploit while defenders watch IPv4-only dashboards.",
    coreConcepts: [
      "IPv4: dotted decimal, NAT common at the edge, widespread tooling and familiarity.",
      "IPv6: colon-hex notation, often end-to-end without NAT, built-in IPSec support (often unused).",
      "Dual-stack hosts speak both protocols; misconfigured AAAA records can cause connection delays.",
      "ICMPv6 is essential for IPv6 (unlike ICMP often restricted for IPv4) — includes neighbor discovery.",
      "Temporary IPv6 addresses enhance privacy; static SLAAC or DHCPv6 affect asset tracking.",
    ],
    explanation:
      "IPv4 headers include fields for fragmentation, checksum, and options; IPv6 fixed 40-byte headers use extension headers for options. IPv4 scarcity drove NAT, which hides internal topology but complicates logging and peer-to-peer apps. IPv6 restores global addressing — every device can have a public address, so host firewalls matter more. Security implications: IPv6 may be enabled by default on modern OSes while perimeter firewalls still block v6; attackers scan v6 space or abuse tunneling (6to4, Teredo). Defenders enable IPv6 firewall rules, monitor ICMPv6 appropriately, and ensure EDR and SIEM parse v6 addresses in logs.",
    realWorld:
      "Major providers dual-stack by default. Incidents have occurred where IPv6 bypassed IPv4-only DLP or IDS. Penetration tests with authorization include v6 discovery — often revealing exposed services invisible in v4-only scans.",
    scenario:
      "Your SIEM receives IPv4 logs only. A laptop registers an IPv6 address and receives malware callbacks over v6. Why did detection fail, and what should you enable?",
    terms: [
      { term: "AAAA record", definition: "DNS record mapping a hostname to an IPv6 address." },
      { term: "SLAAC", definition: "Stateless Address Autoconfiguration — hosts derive IPv6 addresses from router advertisements." },
      { term: "NAT64/DNS64", definition: "Mechanisms allowing IPv6-only clients to reach IPv4 services." },
    ],
    mistakes: [
      "Disabling IPv6 without policy instead of securing it — some OS features break.",
      "Assuming IPv6 is 'more secure by default' because address space is huge — local discovery still matters.",
      "Ignoring IPv6 in firewall rules while allowing all outbound v6.",
    ],
    defensive: [
      "Mirror IPv4 security controls for IPv6: firewall, IDS, logging, segmentation.",
      "Inventory AAAA records and v6 listening services.",
      "Train analysts to read compressed IPv6 notation (::) in logs.",
    ],
    quiz: [
      mcQuiz(
        "net-v46-q1",
        "IPv6 addresses are how many bits long?",
        ["32", "64", "128", "256"],
        2,
        "IPv6 uses 128-bit addresses, written as eight groups of hexadecimal.",
      ),
      mcQuiz(
        "net-v46-q2",
        "A primary driver for IPv6 adoption is:",
        ["Elimination of all firewalls", "Larger address space", "Removal of DNS", "Faster Wi‑Fi"],
        1,
        "IPv4 address exhaustion drove deployment of IPv6.",
      ),
      tfQuiz(
        "net-v46-q3",
        "Security monitoring should include IPv6 if the network supports it.",
        true,
        "Unmonitored IPv6 can become an unguarded path for traffic and attacks.",
      ),
    ],
  }),

  createLesson({
    id: "networking-subnets",
    pathId: PATH,
    order: 5,
    title: "Subnets",
    summary:
      "Divide networks into smaller broadcast domains — subnet masks, CIDR, and how segmentation limits blast radius.",
    estimatedMinutes: 23,
    objectives: [
      "Calculate basic subnet boundaries from CIDR notation",
      "Explain how subnets relate to VLANs and security zones",
      "Determine whether two hosts are on the same subnet",
    ],
    introduction:
      "Subnetting splits a larger network into smaller pieces, each with its own address range and broadcast domain. Routers connect subnets; switches typically forward within one subnet at Layer 2. From a security perspective, subnets are the building blocks of segmentation: place servers in a DMZ subnet, databases in a private subnet, and workstations in another — then enforce least-privilege rules between them. Understanding masks and CIDR is required reading for firewall tickets, cloud VPC design, and incident scoping.",
    coreConcepts: [
      "Subnet mask (or prefix length) separates network portion from host portion of an IP address.",
      "/24 (255.255.255.0) yields 254 usable host addresses in IPv4.",
      "Hosts on the same subnet communicate directly via ARP; cross-subnet traffic goes through a gateway.",
      "VLANs often map 1:1 to IP subnets for logical separation on shared switches.",
      "Supernetting aggregates routes (e.g. summarizing many /24s into one /16 advertisement).",
    ],
    explanation:
      "Given 192.168.10.0/24, network address is 192.168.10.0, broadcast is 192.168.10.255, usable hosts 192.168.10.1–254. A /26 borrows two host bits for subnets, creating four subnets of 62 hosts each. Cloud VPCs use CIDR blocks (10.0.0.0/16) subdivided into per-AZ subnets. Security groups and NACLs attach to subnets. Micro-segmentation may use /32 host routes or overlay networks. During incidents, knowing subnet boundaries tells you whether lateral movement required routing (controlled choke point) or was local (switch-level compromise).",
    realWorld:
      "PCI DSS scope reduction isolates cardholder data environment (CDE) subnets. Zero-trust designs use many small subnets or identity-based policy instead of flat /16 networks.",
    scenario:
      "Host A is 10.1.2.50/24 and Host B is 10.1.3.50/24. Can they communicate at Layer 2 without a router? What firewall rule location applies?",
    practical: [
      {
        kind: "code",
        title: "CIDR quick reference",
        content:
          "/24 = 256 addresses (254 hosts)\n/25 = 128 addresses (126 hosts)\n/26 = 64 addresses (62 hosts)\n/30 = 4 addresses (2 hosts, common for point-to-point links)",
      },
    ],
    terms: [
      { term: "Broadcast domain", definition: "Set of devices that receive Layer 2 broadcast frames — one per subnet typically." },
      { term: "Prefix length", definition: "Number of leading bits fixed for the network portion, e.g. /24." },
      { term: "DMZ subnet", definition: "Semi-trusted zone exposing public services while protecting internal networks." },
    ],
    mistakes: [
      "Using subnets too large — flat networks ease lateral movement.",
      "Forgetting broadcast and network addresses when sizing subnets.",
      "Mismatching VLAN and subnet design, causing leakage across intended boundaries.",
    ],
    defensive: [
      "Segment by sensitivity: users, servers, management, IoT.",
      "Place inter-subnet firewalls at aggregation points and log denied flows.",
      "Document CIDR allocations to prevent overlap during mergers and cloud peering.",
    ],
    quiz: [
      mcQuiz(
        "net-sub-q1",
        "How many usable host addresses does a /24 IPv4 subnet typically provide?",
        ["62", "126", "254", "512"],
        2,
        "A /24 has 256 addresses minus network and broadcast = 254 hosts.",
      ),
      mcQuiz(
        "net-sub-q2",
        "Hosts on different subnets must communicate through:",
        ["A hub", "A router (default gateway)", "ARP only", "DNS alone"],
        1,
        "Inter-subnet traffic is routed at Layer 3.",
      ),
      tfQuiz(
        "net-sub-q3",
        "Subnetting supports security segmentation by limiting broadcast domains and applying policy at router boundaries.",
        true,
        "Smaller subnets constrain lateral movement and clarify trust zones.",
      ),
    ],
  }),

  createLesson({
    id: "networking-tcp-vs-udp",
    pathId: PATH,
    order: 6,
    title: "TCP vs UDP",
    summary:
      "Reliable streams versus fast datagrams — choosing transport protocols and spotting abuse in traffic analysis.",
    estimatedMinutes: 21,
    objectives: [
      "Contrast TCP and UDP connection models",
      "Name common services using each protocol",
      "Explain security relevance of TCP state and UDP statelessness",
    ],
    introduction:
      "Transport layer protocols deliver data between applications on different hosts using port numbers. TCP provides reliable, ordered, connection-oriented delivery; UDP provides best-effort datagrams without setup. Firewalls, IDS, and load balancers treat them differently — stateful TCP tracking vs UDP 'allow and pray.' Attackers choose UDP for amplification DDoS and TCP for session hijacking or SYN floods. Knowing which protocol a service uses tells you what 'normal' looks like in NetFlow and packet captures.",
    coreConcepts: [
      "TCP: three-way handshake (SYN, SYN-ACK, ACK), sequence numbers, acknowledgments, retransmissions.",
      "UDP: no handshake, no guaranteed delivery, lower overhead.",
      "TCP ports identify services like HTTPS (443); UDP used for DNS (53), DHCP (67/68), SNMP, streaming.",
      "Stateful firewalls track TCP sessions; UDP rules are often broader and riskier.",
      "QUIC (HTTP/3) runs over UDP but adds reliability at the application layer.",
    ],
    explanation:
      "TCP establishes a session before data transfer. Flags (SYN, ACK, FIN, RST) control connection lifecycle. Half-open connections from SYN floods exhaust server resources. UDP sends single packets — DNS queries fit this model. Amplification attacks reflect small UDP queries into large responses to a victim IP. Defenders rate-limit UDP, validate DNS responses, and use SYN cookies or cloud scrubbing for TCP floods. For authorized testing on your own lab, comparing open TCP ports vs UDP services reveals different attack surfaces — UDP is easy to overlook in hardening.",
    realWorld:
      "Video conferencing and gaming favor UDP for latency. VPNs may use UDP encapsulation. Nmap scan types differ for TCP vs UDP — covered in the Nmap path with authorization requirements.",
    scenario:
      "NetFlow shows millions of small UDP packets to port 53 from one internal host toward the internet. What attack type might this indicate, and what is your first containment step?",
    terms: [
      { term: "Three-way handshake", definition: "TCP connection setup: SYN → SYN-ACK → ACK." },
      { term: "Datagram", definition: "Self-contained UDP message with no guaranteed ordering or delivery." },
      { term: "SYN flood", definition: "DoS attack sending many TCP SYN packets without completing handshakes." },
    ],
    mistakes: [
      "Blocking all UDP indiscriminately — breaks DNS and legitimate apps.",
      "Assuming UDP services are low risk because they are 'connectionless.'",
      "Ignoring TCP RST responses that reveal filtered vs closed ports during recon on unauthorized targets.",
    ],
    defensive: [
      "Apply stateful inspection for TCP; tightly scope UDP allow rules.",
      "Monitor anomalous UDP volume and DNS query patterns.",
      "Harden services on both TCP and UDP — many daemons listen on both.",
    ],
    quiz: [
      mcQuiz(
        "net-tudp-q1",
        "Which protocol uses a three-way handshake?",
        ["UDP", "TCP", "ICMP", "ARP"],
        1,
        "TCP is connection-oriented and establishes sessions before data transfer.",
      ),
      mcQuiz(
        "net-tudp-q2",
        "DNS queries typically use:",
        ["TCP only", "UDP (with TCP for large responses)", "Neither TCP nor UDP", "ARP"],
        1,
        "DNS primarily uses UDP port 53; TCP is used for zone transfers and large replies.",
      ),
      tfQuiz(
        "net-tudp-q3",
        "UDP offers no guarantee of delivery or ordering.",
        true,
        "Applications must handle loss and reordering if they require reliability.",
      ),
    ],
  }),

  createLesson({
    id: "networking-ports",
    pathId: PATH,
    order: 7,
    title: "Ports",
    summary:
      "Multiplexing services on one IP address — well-known ports, ephemeral ranges, and why port exposure maps attack surface.",
    estimatedMinutes: 22,
    objectives: [
      "Explain how IP address + port identifies a service endpoint",
      "Recognize common well-known port assignments",
      "Interpret listening ports from a defender and authorized assessor perspective",
    ],
    introduction:
      "An IP address finds the host; a port number finds the process or service on that host. Port 443 usually means HTTPS; port 22 means SSH. Ephemeral ports on the client side identify individual outbound connections. Attackers enumerate open ports to find services to exploit — but only on systems they own or have written permission to test. Defenders inventory listening ports, close unused services, and alert on unexpected listeners. Port knowledge bridges networking and application security.",
    coreConcepts: [
      "Ports 0–1023 are well-known (privileged on Unix); 1024–49151 registered; 49152+ dynamic/ephemeral.",
      "TCP and UDP port spaces are independent — port 53/tcp and 53/udp are different sockets.",
      "LISTENING on 0.0.0.0 exposes a service on all interfaces; 127.0.0.1 is local only.",
      "Port scanning discovers which ports accept connections — legal only with authorization.",
      "Service binding failures occur when two processes compete for the same port.",
    ],
    explanation:
      "A socket is (protocol, local IP, local port, remote IP, remote port). Web servers bind 443/tcp; clients use random high ports for outbound connections. Firewalls filter by port and protocol. NAT maps external ports to internal services. From a hardening view, run ss -tulpn or netstat to list listeners; remove packages you do not need. Unexpected port 4444/tcp listening may indicate a backdoor. Authorized vulnerability scans compare results against approved scope — scanning random internet hosts without permission is illegal in many jurisdictions.",
    realWorld:
      "Ransomware opens SMB on 445/tcp for lateral movement. Cryptominers expose high ports for C2. Cloud misconfigurations publish admin panels on unexpected ports.",
    scenario:
      "Baseline shows a Linux server listening on 0.0.0.0:6379. What service is likely exposed, and what immediate hardening steps apply?",
    practical: [
      {
        kind: "command",
        title: "List listening ports (Linux)",
        content: "ss -tulpn\n# or: sudo lsof -i -P -n | grep LISTEN",
      },
    ],
    terms: [
      { term: "Well-known port", definition: "Port number assigned by IANA for standard services, e.g. 80 HTTP, 443 HTTPS." },
      { term: "Ephemeral port", definition: "Temporary client-side port used for the duration of a connection." },
      { term: "Socket", definition: "Endpoint for network communication identified by IP, port, and protocol." },
    ],
    mistakes: [
      "Exposing management interfaces (Redis, MongoDB) to the internet without authentication.",
      "Confusing TCP and UDP when writing firewall rules.",
      "Running port scans outside authorized scope.",
    ],
    defensive: [
      "Inventory and minimize listening services; bind sensitive daemons to localhost or management VLANs.",
      "Alert on new listeners compared to baseline.",
      "Document approved scan scope and windows for assessment teams.",
    ],
    quiz: [
      mcQuiz(
        "net-port-q1",
        "HTTPS commonly uses TCP port:",
        ["22", "53", "443", "3306"],
        2,
        "443/tcp is the standard port for HTTPS.",
      ),
      mcQuiz(
        "net-port-q2",
        "A process listening on 0.0.0.0:22 accepts connections on:",
        ["Localhost only", "All available network interfaces", "UDP only", "Port 22 outbound only"],
        1,
        "0.0.0.0 means all IPv4 interfaces unless restricted by firewall.",
      ),
      tfQuiz(
        "net-port-q3",
        "Port scanning without authorization on systems you do not own is unethical and often illegal.",
        true,
        "Only scan targets explicitly in scope with written permission.",
      ),
    ],
  }),

  createLesson({
    id: "networking-dns",
    pathId: PATH,
    order: 8,
    title: "DNS",
    summary:
      "The internet's naming system — resolution chain, record types, and DNS abuse from phishing to tunneling.",
    estimatedMinutes: 24,
    objectives: [
      "Describe how a recursive DNS query resolves a hostname",
      "Identify common record types (A, AAAA, CNAME, MX, TXT)",
      "Recognize DNS-based threats and monitoring opportunities",
    ],
    introduction:
      "Domain Name System translates human-readable names into IP addresses and other records. Almost every application depends on DNS — if resolution fails or lies, traffic goes to the wrong place. Attackers register lookalike domains, hijack zones, poison caches, and exfiltrate data via DNS tunneling. Defenders monitor DNS logs, enforce DNSSEC where feasible, and use protective DNS services to block malicious domains.",
    coreConcepts: [
      "Stub resolver on the host → recursive resolver (ISP, 8.8.8.8, corporate DNS) → root → TLD → authoritative server.",
      "A/AAAA records map names to IPv4/IPv6; CNAME aliases; MX mail routing; TXT SPF/DKIM/verification.",
      "TTL controls cache duration — low TTL aids fast migration but also fast-flux abuse.",
      "DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt queries between client and resolver.",
      "Split-horizon DNS returns different answers inside corporate networks vs the internet.",
    ],
    explanation:
      "Query for www.example.com: recursive resolver checks cache, then iterates from root (.), com TLD, to example.com authoritative NS. Response cached per TTL. Corporate DNS filters malware C2 domains. DNS tunneling encodes data in subdomain queries to attacker-controlled zones — visible as abnormal query volume and long labels. Typosquatting domains phish credentials. Defenders log query/response pairs, block newly registered domains (NRD) policies, and validate DNSSEC signatures where deployed.",
    realWorld:
      "SolarWinds and many APTs used DNS for C2. Brand protection teams monitor registrations similar to company names. Cloud migrations require careful TTL planning to avoid outages.",
    scenario:
      "SIEM shows thousands of TXT queries to random subdomains of evil-cdn.net from one workstation. What technique might this indicate, and what host-level data should you collect?",
    terms: [
      { term: "Authoritative nameserver", definition: "Server holding the official records for a zone." },
      { term: "Recursive resolver", definition: "Server that queries on behalf of clients and caches results." },
      { term: "DNSSEC", definition: "Cryptographic signatures validating DNS response authenticity." },
    ],
    mistakes: [
      "Ignoring DNS in threat hunting — most malware needs name resolution.",
      "Allowing unrestricted outbound DNS to any resolver, bypassing corporate filtering.",
      "Misconfiguring SPF/DKIM/DMARC leading to deliverability and spoofing issues.",
    ],
    defensive: [
      "Centralize DNS logging; alert on NXDOMAIN spikes and long subdomain labels.",
      "Use protective DNS and block known malicious domains.",
      "Monitor zone changes and registrar account security.",
    ],
    quiz: [
      mcQuiz(
        "net-dns-q1",
        "Which DNS record maps a hostname to an IPv4 address?",
        ["MX", "A", "CNAME", "NS"],
        1,
        "A records hold IPv4 addresses for a name.",
      ),
      mcQuiz(
        "net-dns-q2",
        "A recursive DNS resolver:",
        ["Only serves one company's zone", "Queries other servers on behalf of clients", "Replaces TLS", "Assigns DHCP addresses"],
        1,
        "Recursives perform lookups and cache answers for clients.",
      ),
      tfQuiz(
        "net-dns-q3",
        "DNS tunneling can exfiltrate data by encoding it in DNS queries.",
        true,
        "Abnormal DNS query patterns may indicate tunneling or C2.",
      ),
    ],
  }),

  createLesson({
    id: "networking-dhcp",
    pathId: PATH,
    order: 9,
    title: "DHCP",
    summary:
      "Dynamic Host Configuration Protocol — automatic addressing, options, and rogue DHCP as a network attack vector.",
    estimatedMinutes: 20,
    objectives: [
      "Explain the DHCP DORA process",
      "Identify critical DHCP options (gateway, DNS, lease time)",
      "Recognize rogue DHCP and DHCP starvation attacks",
    ],
    introduction:
      "DHCP automates IP address assignment, default gateway, DNS servers, and other options — reducing manual errors on large networks. Clients broadcast DISCOVER; servers OFFER; clients REQUEST; servers ACK (DORA). Because DHCP is largely unauthenticated in traditional deployments, attackers on the LAN can run rogue servers to redirect traffic via malicious gateway or DNS settings — a classic man-in-the-middle setup on compromised or guest networks.",
    coreConcepts: [
      "DHCP uses UDP ports 67 (server) and 68 (client).",
      "Lease time determines how long an address assignment remains valid.",
      "Options include subnet mask, router (option 3), DNS (option 6), domain name, NTP, PXE boot.",
      "DHCP snooping on switches trusts only designated server ports.",
      "IPv6 uses DHCPv6 or SLAAC instead of or alongside IPv4 DHCP.",
    ],
    explanation:
      "On join, a client without an address sends DHCPDISCOVER to 255.255.255.255. Authorized server responds with DHCPOFFER containing IP, mask, lease, gateway, DNS. Client DHCPREQUEST accepts; server DHCPACK confirms. Rogue DHCP on a flat VLAN hands victims attacker-controlled DNS — enabling phishing or SSL stripping if combined with other attacks. Starvation exhausts the pool with DISCOVER floods. Defenses: DHCP snooping, 802.1X port auth, separate guest VLANs, monitoring for multiple DHCP OFFER sources.",
    realWorld:
      "Hotel and conference Wi‑Fi are frequent rogue DHCP targets. Enterprises use IPAM integration so DHCP reservations map to asset records for forensics.",
    scenario:
      "Users on Floor 3 suddenly resolve DNS to 198.51.100.99 and report certificate warnings. DHCP logs show OFFER from an unknown MAC. What happened and what is the first network control to verify?",
    terms: [
      { term: "DORA", definition: "Discover, Offer, Request, Acknowledge — DHCP lease process." },
      { term: "Lease", definition: "Time-bound permission to use an assigned IP address." },
      { term: "DHCP snooping", definition: "Switch feature blocking DHCP OFFERs from untrusted ports." },
    ],
    mistakes: [
      "Mixing unauthorized DHCP servers on production VLANs.",
      "Infinite lease times causing IP exhaustion without reclamation.",
      "Ignoring DHCP logs for asset discovery and incident timelines.",
    ],
    defensive: [
      "Enable DHCP snooping and designate trusted server ports.",
      "Monitor for multiple DHCP servers on the same broadcast domain.",
      "Reserve addresses for critical servers; use static IPs for infrastructure.",
    ],
    quiz: [
      mcQuiz(
        "net-dhcp-q1",
        "DHCP primarily assigns:",
        ["MAC addresses to switches", "IP configuration to clients", "TLS certificates", "Firewall rules"],
        1,
        "DHCP delivers address, mask, gateway, DNS, and other options.",
      ),
      mcQuiz(
        "net-dhcp-q2",
        "A rogue DHCP server attack can redirect victims by offering a malicious:",
        ["HTTP status code", "DNS server option", "ARP table", "CPU core"],
        1,
        "Malicious DNS or gateway options steer victim traffic through the attacker.",
      ),
      tfQuiz(
        "net-dhcp-q3",
        "DHCP snooping helps prevent unauthorized DHCP servers on a switched network.",
        true,
        "Only trusted ports may relay DHCP server messages.",
      ),
    ],
  }),

  createLesson({
    id: "networking-arp",
    pathId: PATH,
    order: 10,
    title: "ARP",
    summary:
      "Address Resolution Protocol maps IP to MAC on local segments — and enables classic LAN attacks when untrusted devices share a broadcast domain.",
    estimatedMinutes: 21,
    objectives: [
      "Explain ARP's role in local Ethernet delivery",
      "Describe ARP spoofing/poisoning attack mechanics",
      "List mitigations including static ARP, segmentation, and DAI",
    ],
    introduction:
      "IP packets destined to local subnet hosts need a destination MAC address. ARP asks 'who has 192.168.1.1?' and the owner replies with its MAC. ARP caches entries temporarily. There is no authentication in classic ARP — any host can answer, enabling ARP spoofing where an attacker claims another IP's MAC to intercept traffic on the LAN. Understanding ARP is essential for Wi‑Fi security, penetration testing with authorization, and designing segmented networks.",
    coreConcepts: [
      "ARP operates at Layer 2 within a broadcast domain (subnet/VLAN).",
      "ARP table/cache maps IP → MAC on each host; entries age out.",
      "Gratuitous ARP announces ownership — used for failover and sometimes monitoring.",
      "ARP spoofing: attacker sends false ARP replies to redirect traffic.",
      "Dynamic ARP Inspection (DAI) on switches validates ARP against DHCP snooping database.",
    ],
    explanation:
      "Host A wants to send to 192.168.1.10 on the same /24. It ARPs for 192.168.1.10's MAC, caches the reply, encapsulates IP in Ethernet frame. Attacker C floods spoofed replies: '192.168.1.1 is at C's MAC.' Victims send traffic meant for the gateway to C — enabling MITM on plaintext protocols or SSL stripping setups. Defenses: VLAN segmentation, 802.1X, DAI, private VLANs, encryption (HTTPS everywhere), host-based static ARP for critical systems (brittle). Remote attacks do not cross routers with ARP — reason segmentation limits spoofing scope.",
    realWorld:
      "Public Wi‑Fi and compromised IoT devices on corporate LANs have enabled ARP-based interception. Red team exercises on authorized internal networks demonstrate impact to justify 802.1X deployment.",
    scenario:
      "Wireshark on a laptop shows dozens of unsolicited ARP replies claiming the gateway IP maps to a new MAC. What attack is underway, and what switch feature mitigates it?",
    terms: [
      { term: "ARP cache", definition: "Local table storing recent IP-to-MAC mappings." },
      { term: "Gratuitous ARP", definition: "Unsolicited ARP announcement, often to update peers after IP/MAC change." },
      { term: "DAI", definition: "Dynamic ARP Inspection — validates ARP packets on switch ports." },
    ],
    mistakes: [
      "Placing untrusted guests on the same VLAN as servers without isolation.",
      "Assuming HTTPS alone prevents all MITM — mis-issued certs and HSTS gaps matter.",
      "Forgetting ARP is local — remote attackers need another foothold first.",
    ],
    defensive: [
      "Segment trust levels; use 802.1X on access ports.",
      "Enable DHCP snooping and DAI on capable switches.",
      "Monitor ARP tables for duplicate IP-MAC mappings.",
    ],
    quiz: [
      mcQuiz(
        "net-arp-q1",
        "ARP resolves:",
        ["IP addresses to MAC addresses on a local segment", "Hostnames to IP globally", "TCP ports to services", "DNS to TLS"],
        0,
        "ARP maps Layer 3 addresses to Layer 2 MACs on the same broadcast domain.",
      ),
      mcQuiz(
        "net-arp-q2",
        "ARP spoofing is primarily a threat within:",
        ["The same Layer 2 broadcast domain", "Across the entire internet", "Only IPv6 networks", "DNS root servers"],
        0,
        "ARP does not cross routers; attacks are local to the subnet/VLAN.",
      ),
      tfQuiz(
        "net-arp-q3",
        "Dynamic ARP Inspection helps validate ARP replies on managed switches.",
        true,
        "DAI drops invalid ARP packets when combined with DHCP snooping.",
      ),
    ],
  }),

  createLesson({
    id: "networking-http-https",
    pathId: PATH,
    order: 11,
    title: "HTTP/HTTPS",
    summary:
      "Web protocols on port 80 and 443 — request/response structure, cleartext risks, and why HTTPS is baseline hygiene.",
    estimatedMinutes: 23,
    objectives: [
      "Contrast HTTP and HTTPS at the network layer",
      "Identify sensitive data exposed by cleartext HTTP",
      "Explain how HTTPS relies on TLS beneath the application protocol",
    ],
    introduction:
      "Hypertext Transfer Protocol (HTTP) is the application-layer language of the web. HTTPS is HTTP over TLS — encrypted and integrity-protected. On corporate networks and the public internet, cleartext HTTP exposes credentials, session cookies, and API keys to anyone on the path. Security practitioners inspect HTTP headers for policy, redirects, and anomalies; they enforce HTTPS via HSTS and modern TLS configurations.",
    coreConcepts: [
      "HTTP methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS.",
      "Headers carry cookies, authorization, content types, caching, and security policies.",
      "HTTPS uses TLS on port 443/tcp (or QUIC/HTTP3 on UDP 443).",
      "Mixed content: HTTPS pages loading HTTP subresources weaken security.",
      "Proxies and load balancers may terminate TLS and re-encrypt to backends.",
    ],
    explanation:
      "Client sends request line and headers; server returns status (200, 404, 302), headers, body. Cookies authenticate sessions — stealing them over HTTP is trivial on shared networks. TLS handshake negotiates cipher suite and certificates before HTTP data flows encrypted. Corporate SSL inspection proxies re-sign traffic with enterprise CA — users must trust only legitimate inspection. Attackers on path inject content into HTTP or strip TLS if HSTS missing. Defenders redirect HTTP→HTTPS, enable HSTS preload, log TLS versions, and disable weak ciphers.",
    realWorld:
      "Firesheep demonstrated session hijacking on HTTP coffee-shop Wi‑Fi. Regulatory frameworks (PCI, HIPAA) mandate encryption in transit for sensitive data.",
    scenario:
      "A site serves login over HTTP on port 80. An attacker on the same Wi‑Fi captures POST bodies. Which control would have prevented credential disclosure, and what header enforces HTTPS on future visits?",
    practical: [
      {
        kind: "http",
        title: "HTTPS request (simplified)",
        content:
          "GET /login HTTP/1.1\nHost: app.example.com\nUser-Agent: Mozilla/5.0\nAccept: text/html\nCookie: session=abc123",
      },
    ],
    terms: [
      { term: "TLS termination", definition: "Decrypting HTTPS at a load balancer or proxy before forwarding to backends." },
      { term: "HSTS", definition: "HTTP Strict Transport Security — browser policy to use HTTPS only." },
      { term: "Mixed content", definition: "HTTPS page loading insecure HTTP resources." },
    ],
    mistakes: [
      "Submitting credentials over HTTP even on 'trusted' internal networks.",
      "Terminating TLS without securing backend hop (HTTP between LB and app).",
      "Ignoring certificate name mismatches and expiry in monitoring.",
    ],
    defensive: [
      "Enforce HTTPS everywhere; use HSTS with includeSubDomains where appropriate.",
      "Monitor certificate transparency and expiry.",
      "Set security headers (CSP, X-Content-Type-Options) on HTTPS responses.",
    ],
    quiz: [
      mcQuiz(
        "net-http-q1",
        "HTTPS primarily adds which protection over HTTP?",
        ["Faster DNS", "Encryption and integrity via TLS", "Shorter URLs", "ARP validation"],
        1,
        "TLS encrypts HTTP traffic and verifies server identity via certificates.",
      ),
      mcQuiz(
        "net-http-q2",
        "Default port for HTTPS is:",
        ["22", "80", "443", "53"],
        2,
        "443/tcp is standard for HTTPS (HTTP over TLS).",
      ),
      tfQuiz(
        "net-http-q3",
        "Session cookies sent over unencrypted HTTP can be captured by attackers on the same network path.",
        true,
        "Cleartext HTTP exposes headers and bodies to passive eavesdropping.",
      ),
    ],
  }),

  createLesson({
    id: "networking-tls",
    pathId: PATH,
    order: 12,
    title: "TLS",
    summary:
      "Transport Layer Security — handshakes, certificates, cipher suites, and common misconfigurations attackers exploit.",
    estimatedMinutes: 25,
    objectives: [
      "Describe the TLS handshake at a high level",
      "Explain the role of certificates and certificate authorities",
      "Identify deprecated protocols and weak cipher risks",
    ],
    introduction:
      "TLS (successor to SSL) secures most internet traffic. It authenticates servers with certificates, negotiates encryption keys, and protects data in transit from eavesdropping and tampering. Broken TLS — expired certs, self-signed without trust, TLS 1.0, export ciphers — still appears in assessments. Security engineers validate configurations with scanners, monitor expiry, and understand what corporate inspection changes for threat models.",
    coreConcepts: [
      "Handshake: ClientHello → ServerHello → certificate → key exchange → Finished — then encrypted application data.",
      "Certificates bind a public key to a hostname; CAs sign chains of trust.",
      "SNI (Server Name Indication) lets multiple HTTPS sites share one IP.",
      "TLS 1.2+ and 1.3 are current standards; SSLv3, TLS 1.0/1.1 are deprecated.",
      "Perfect Forward Secrecy (PFS) ephemeral keys limit impact of long-term key compromise.",
    ],
    explanation:
      "Browser connects to https://example.com:443. TLS handshake agrees on TLS 1.3, cipher suite, and verifies server cert against trusted store. If validation fails, users see warnings — training users to click through enables MITM. Attackers with rogue CAs or compromised roots can impersonate sites. Defenders automate cert renewal (ACME/Let's Encrypt), disable weak ciphers, enable OCSP stapling, and monitor for unauthorized certs via CT logs. mTLS adds client certificates for mutual authentication — common in service meshes and APIs.",
    realWorld:
      "Heartbleed (OpenSSL) leaked memory including keys. POODLE forced SSLv3 retirement. Enterprise proxies decrypt TLS for inspection — document privacy and legal implications.",
    scenario:
      "Assessment finds TLS 1.0 enabled and certificate expired on a payment portal. Rate severity and list remediation steps in priority order.",
    terms: [
      { term: "Cipher suite", definition: "Combination of key exchange, authentication, encryption, and MAC algorithms." },
      { term: "Certificate chain", definition: "Server cert signed by intermediate CAs up to a trusted root." },
      { term: "mTLS", definition: "Mutual TLS — client and server both present certificates." },
    ],
    mistakes: [
      "Disabling certificate validation in applications or scripts.",
      "Using wildcard certs without controlling all subdomains.",
      "Ignoring TLS on internal east-west traffic.",
    ],
    defensive: [
      "Enforce TLS 1.2 minimum (prefer 1.3); remove weak ciphers.",
      "Automate certificate lifecycle monitoring and renewal.",
      "Use HSTS and certificate transparency monitoring.",
    ],
    quiz: [
      mcQuiz(
        "net-tls-q1",
        "TLS certificates primarily provide:",
        ["IP routing", "Server authentication and key exchange foundation", "DHCP options", "ARP resolution"],
        1,
        "Certs prove server identity and enable encrypted key agreement.",
      ),
      mcQuiz(
        "net-tls-q2",
        "Which TLS version should be disabled in modern deployments?",
        ["TLS 1.3", "TLS 1.2", "TLS 1.0", "None — all are current"],
        2,
        "TLS 1.0 (and 1.1) are deprecated due to known weaknesses.",
      ),
      tfQuiz(
        "net-tls-q3",
        "Perfect Forward Secrecy limits damage if a long-term private key is later compromised.",
        true,
        "Ephemeral session keys are not derived solely from the long-term key.",
      ),
    ],
  }),

  createLesson({
    id: "networking-routers-switches",
    pathId: PATH,
    order: 13,
    title: "Routers and Switches",
    summary:
      "Layer 2 switching vs Layer 3 routing — how traffic moves inside and between networks, and where to enforce policy.",
    estimatedMinutes: 22,
    objectives: [
      "Differentiate switch and router functions",
      "Explain VLANs and inter-VLAN routing",
      "Identify security features on managed switches and routers",
    ],
    introduction:
      "Switches forward Ethernet frames within a LAN using MAC addresses. Routers forward IP packets between networks using routing tables. Together they form the fabric of enterprise and internet connectivity. Security depends on correct placement: ACLs on routers, port security on switches, and avoiding flat networks where one compromise reaches everyone. Understanding forwarding logic helps you interpret traceroute, spanning tree issues, and lateral movement paths.",
    coreConcepts: [
      "Switch: learns MAC addresses, forwards within broadcast domain, supports VLANs.",
      "Router: connects subnets, runs routing protocols (OSPF, BGP), applies ACLs.",
      "Layer 3 switch combines switching with routed VLAN interfaces (SVIs).",
      "Spanning Tree Protocol (STP) prevents switching loops.",
      "Trunk ports carry multiple VLANs tagged with 802.1Q.",
    ],
    explanation:
      "A frame arrives at switch port — destination MAC looked up in CAM table, forwarded to one port or flooded if unknown. Routers decrement TTL, check destination IP, forward per routing table — static routes, dynamic protocols, or default gateway. Inter-VLAN routing sends traffic through a router or L3 switch SVI where firewall policy can apply. Misconfigured trunk allows VLAN hopping in theory; disable unused ports, use dedicated management VLAN, restrict router management to secure interfaces.",
    realWorld:
      "BGP hijacks reroute internet traffic. Campus networks use 802.1X on switch ports. Data centers use Clos fabrics with ECMP routing.",
    scenario:
      "Workstations in VLAN 10 cannot reach servers in VLAN 20 after a switch upgrade. Routing table on the L3 switch lacks a route to 10.20.0.0/24. What layer device owns the fix?",
    terms: [
      { term: "CAM table", definition: "Switch MAC address table mapping MACs to ports." },
      { term: "SVI", definition: "Switched Virtual Interface — Layer 3 VLAN interface on a switch." },
      { term: "ACL", definition: "Access Control List — permit/deny rules on routers or switches." },
    ],
    mistakes: [
      "Single flat VLAN for all users and servers.",
      "Leaving switch management on default VLAN 1 without restriction.",
      "Disabling STP without alternative loop prevention.",
    ],
    defensive: [
      "Segment with VLANs; route between zones with explicit ACLs.",
      "Disable unused ports; enable port security and 802.1X.",
      "Secure management plane — SSH, strong auth, out-of-band where possible.",
    ],
    quiz: [
      mcQuiz(
        "net-rsw-q1",
        "Switches primarily forward traffic using:",
        ["IP addresses", "MAC addresses", "DNS names", "TCP ports only"],
        1,
        "Switches operate at Layer 2 using MAC addresses.",
      ),
      mcQuiz(
        "net-rsw-q2",
        "Routers connect different IP subnets by:",
        ["Broadcasting all frames", "Forwarding packets based on routing tables", "Assigning DHCP leases only", "Terminating TLS"],
        1,
        "Routers make Layer 3 forwarding decisions between networks.",
      ),
      tfQuiz(
        "net-rsw-q3",
        "VLANs logically separate broadcast domains on a shared switch infrastructure.",
        true,
        "VLANs segment Layer 2 traffic without separate physical switches.",
      ),
    ],
  }),

  createLesson({
    id: "networking-firewalls-nat",
    pathId: PATH,
    order: 14,
    title: "Firewalls and NAT",
    summary:
      "Packet filtering, stateful inspection, network address translation — controlling what crosses trust boundaries.",
    estimatedMinutes: 24,
    objectives: [
      "Compare stateless and stateful firewall behavior",
      "Explain source NAT (PAT/masquerade) and destination NAT (port forwarding)",
      "Design a default-deny policy with documented exceptions",
    ],
    introduction:
      "Firewalls enforce policy at network boundaries — permit required flows, deny everything else. NAT modifies addresses in flight, letting many internal hosts share one public IP. Together they shape how attackers reach internal services and how internal hosts appear on the internet. Misrules cause outages; overly permissive rules cause breaches. Security architects document every allow rule with owner, justification, and review date.",
    coreConcepts: [
      "Stateful firewalls track connection state — allow return traffic for established sessions.",
      "Rules match source/dest IP, port, protocol, zone, sometimes application (NGFW).",
      "SNAT/PAT rewrites internal source to public IP on egress.",
      "DNAT/port forwarding maps public IP:port to internal server.",
      "Default-deny inbound; explicit allows for required services only.",
    ],
    explanation:
      "Outbound user browses HTTPS: internal 10.0.1.50:52341 → 203.0.113.10:443 becomes public 198.51.100.5:52341 → 203.0.113.10:443 via PAT. Inbound web server published as 198.51.100.5:443 DNAT to 10.0.2.10:443. Firewall permits only that DNAT rule from internet zone. NGFWs inspect HTTP hostnames and TLS SNI. Logging denied flows reveals scan noise. NAT is not security — it obscures topology but does not replace filtering. IPv6 reduces NAT need but increases end-to-end exposure without host firewalls.",
    realWorld:
      "Misconfigured S3-style 'allow all' cloud security groups are software firewalls. Double NAT in home and carrier networks complicates remote support and gaming but is ubiquitous.",
    scenario:
      "Change ticket opens inbound 0.0.0.0/0 to 3389 on a Windows server. Risk rating? What alternative access method preserves security?",
    terms: [
      { term: "PAT", definition: "Port Address Translation — many internal hosts share one public IP using different source ports." },
      { term: "NGFW", definition: "Next-generation firewall — adds application/user awareness beyond IP/port." },
      { term: "Default deny", definition: "Block all traffic unless explicitly permitted by policy." },
    ],
    mistakes: [
      "Relying on NAT alone for protection.",
      "Accumulating 'temporary' allow rules that never expire.",
      "Logging only denies — misses data exfil on allowed ports.",
    ],
    defensive: [
      "Default deny with least privilege; review rules quarterly.",
      "Log allowed and denied flows to SIEM for baselines.",
      "Use jump hosts or VPN instead of exposing RDP/SSH to the internet.",
    ],
    quiz: [
      mcQuiz(
        "net-fw-q1",
        "Stateful firewalls primarily track:",
        ["DNS TTL", "Connection state to allow return traffic", "MAC addresses only", "TLS certificate expiry"],
        1,
        "State tables link outbound connections to permitted inbound responses.",
      ),
      mcQuiz(
        "net-fw-q2",
        "PAT allows many internal hosts to share:",
        ["One MAC address", "One public IPv4 address", "One TCP port globally", "No gateway"],
        1,
        "Source NAT maps multiple internal IPs to one public IP with different ports.",
      ),
      tfQuiz(
        "net-fw-q3",
        "NAT alone is insufficient as a security control.",
        true,
        "NAT obscures addresses but does not replace explicit firewall policy.",
      ),
    ],
  }),

  createLesson({
    id: "networking-vpns-monitoring",
    pathId: PATH,
    order: 15,
    title: "VPNs and Network Monitoring",
    summary:
      "Secure remote access tunnels and the visibility stack — NetFlow, packet capture, IDS, and baselines that detect anomalies.",
    estimatedMinutes: 25,
    objectives: [
      "Compare site-to-site and remote-access VPN types",
      "Describe NetFlow, SNMP, and packet capture use cases",
      "Explain how network monitoring supports detection and response",
    ],
    introduction:
      "Virtual Private Networks extend trusted networks across untrusted paths — remote employees, branch offices, cloud VPC peering. Monitoring provides the eyes to see exfiltration, C2, and lateral movement. Without baselines, even obvious scans blend into noise. This capstone ties addressing, ports, TLS, and firewalls into operational security: who can reach what, and how do you know when something abnormal happens?",
    coreConcepts: [
      "IPsec and SSL/TLS VPNs encrypt tunnels; WireGuard is modern lightweight option.",
      "Split tunnel vs full tunnel — security vs performance trade-off for remote users.",
      "NetFlow/sFlow/IPFIX records metadata (IPs, ports, bytes) for traffic analysis.",
      "SPAN/TAP mirrors packets to IDS/NDR sensors.",
      "SNMP polls device health; syslog aggregates router and firewall events.",
    ],
    explanation:
      "Remote-access VPN authenticates user, assigns virtual IP, routes corporate subnets through encrypted tunnel. Site-to-site VPN connects office to cloud VPC. Split tunnel sends only corporate CIDRs via VPN; other traffic exits locally — risk if policy not enforced on device. Monitoring pipeline: flow data to SIEM, alerts on geographic anomalies, volume spikes, new external destinations. PCAP for deep investigation — heavy storage, use targeted capture. NDR uses ML on flow/packet metadata. Correlate NetFlow with EDR and auth logs for full story.",
    realWorld:
      "VPN appliances are brute-force targets — enforce MFA. SolarWinds SUNBURST showed supply-chain risk in network monitoring tools themselves.",
    scenario:
      "NetFlow shows a database server sending 50 GB to an unknown IP at 3 AM. VPN logs show no admin sessions. Outline investigation steps and containment options.",
    practical: [
      {
        kind: "log",
        title: "Sample NetFlow record (conceptual)",
        content:
          "src=10.0.5.22 dst=203.0.113.99 sport=443 dport=52144 proto=TCP bytes=52428800 packets=38000 start=03:12:04",
      },
    ],
    terms: [
      { term: "Split tunneling", definition: "VPN mode where only selected traffic uses the tunnel; rest uses local internet." },
      { term: "NetFlow", definition: "Cisco flow export format — metadata about IP conversations." },
      { term: "NDR", definition: "Network Detection and Response — analytics on network traffic for threats." },
    ],
    mistakes: [
      "VPN without MFA — password spraying succeeds.",
      "Collecting flows but never establishing baselines or alerts.",
      "Monitoring tools on flat network without access control to admin interfaces.",
    ],
    defensive: [
      "Require MFA on all VPN; patch VPN concentrators promptly.",
      "Retain and analyze flow logs; integrate with SIEM use cases.",
      "Segment monitoring infrastructure; validate VPN split-tunnel policy.",
    ],
    quiz: [
      mcQuiz(
        "net-vpn-q1",
        "NetFlow data is best described as:",
        ["Full packet payloads of all traffic", "Metadata summaries of IP conversations", "DHCP lease database", "TLS private keys"],
        1,
        "Flow records capture IPs, ports, bytes, timestamps — not full content by default.",
      ),
      mcQuiz(
        "net-vpn-q2",
        "A primary security benefit of VPNs is:",
        ["Eliminating need for firewalls", "Encrypted authenticated access across untrusted networks", "Faster DNS", "Automatic patch management"],
        1,
        "VPNs protect confidentiality and integrity of traffic over untrusted paths.",
      ),
      tfQuiz(
        "net-vpn-q3",
        "Network monitoring helps detect data exfiltration and command-and-control traffic patterns.",
        true,
        "Flow and packet analysis reveal anomalies compared to baselines.",
      ),
    ],
  }),
];
