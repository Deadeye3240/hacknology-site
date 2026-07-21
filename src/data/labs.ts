import type { Lab } from "@/types";

/**
 * Educational lab catalog.
 *
 * All labs are simulated, instructional exercises intended for authorized,
 * controlled environments only. To add a new lab, append an entry here — no UI
 * changes are required. The `id` is used as the `/labs/:labId` route slug.
 */
export const labs: Lab[] = [
  {
    id: "network-fundamentals",
    title: "Network Fundamentals",
    description:
      "Understand how devices communicate: IP addressing, ports, and the TCP/IP model that underpins everything on a network.",
    category: "Networking",
    level: "Beginner",
    estimatedMinutes: 45,
    skills: ["TCP/IP model", "IP addressing", "Ports & protocols"],
    objectives: [
      "Describe the layers of the TCP/IP model and what each is responsible for.",
      "Explain the difference between IP addresses, ports, and protocols.",
      "Identify common well-known ports and the services that use them.",
    ],
    prerequisites: ["Basic computer literacy"],
    instructions: [
      {
        title: "Map the TCP/IP model",
        description:
          "Review the four layers of the TCP/IP model and write down one real-world example for each layer. Focus on how data is encapsulated as it moves down the stack.",
      },
      {
        title: "Inspect your own interfaces",
        description:
          "On a machine you own, list your network interfaces and note your private IP address and subnet mask. Reflect on why these are private addresses.",
        command: "ipconfig    # Windows    /    ip addr    # Linux",
        output: "eth0: inet 192.168.1.24/24  broadcast 192.168.1.255",
      },
      {
        title: "Match ports to services",
        description:
          "Create a small table mapping ports 22, 53, 80, and 443 to their services and note whether each is typically encrypted.",
      },
    ],
  },
  {
    id: "http-request-analysis",
    title: "HTTP Request Analysis",
    description:
      "Break down the anatomy of HTTP requests and responses — methods, headers, and status codes — to understand how the web really works.",
    category: "Web Security",
    level: "Beginner",
    estimatedMinutes: 40,
    skills: ["HTTP methods", "Request/response headers", "Status codes"],
    objectives: [
      "Identify the components of an HTTP request and response.",
      "Explain the purpose of common headers and status codes.",
      "Recognize how methods like GET and POST differ in intent.",
    ],
    prerequisites: ["Network Fundamentals (recommended)"],
    instructions: [
      {
        title: "Read a raw request",
        description:
          "Study the request below. Identify the method, path, and the headers the client is sending, and describe what each header communicates to the server.",
        command:
          "GET /account HTTP/1.1\nHost: example.com\nAccept: text/html\nUser-Agent: hacknology-lab",
      },
      {
        title: "Interpret the response",
        description:
          "Review the simulated response and explain what the status code and content-type tell the browser to do next.",
        output: "HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8",
      },
      {
        title: "Compare methods",
        description:
          "Summarize when GET, POST, PUT, and DELETE are appropriate, and why GET should never cause a state change.",
      },
    ],
  },
  {
    id: "linux-permissions",
    title: "Linux Permissions",
    description:
      "Learn the Linux permission model — users, groups, and read/write/execute bits — and how least-privilege keeps systems safe.",
    category: "Linux",
    level: "Intermediate",
    estimatedMinutes: 55,
    skills: ["File permissions", "Users & groups", "Least privilege"],
    objectives: [
      "Read and interpret symbolic and octal permission notation.",
      "Explain how ownership and groups affect access.",
      "Apply least-privilege thinking to file and directory permissions.",
    ],
    prerequisites: ["Comfort with a Linux shell"],
    instructions: [
      {
        title: "Decode a permission string",
        description:
          "Given the listing below, describe who can read, write, and execute the file, and convert the permissions to octal notation.",
        command: "ls -l secrets.txt",
        output: "-rw-r----- 1 alice analysts 2048 Jul 20 09:14 secrets.txt",
      },
      {
        title: "Reason about ownership",
        description:
          "Explain what happens when a user who is not the owner and not in the group tries to read the file above.",
      },
      {
        title: "Apply least privilege",
        description:
          "Propose the most restrictive permissions that still allow the intended workflow, and justify your choice.",
      },
    ],
  },
  {
    id: "log-analysis",
    title: "Log Analysis",
    description:
      "Work through realistic log data to spot suspicious activity and practice a defender's structured investigative workflow.",
    category: "Defensive Security",
    level: "Intermediate",
    estimatedMinutes: 60,
    skills: ["Log triage", "Pattern recognition", "Timeline building"],
    objectives: [
      "Establish a baseline of normal activity from sample logs.",
      "Identify anomalies that warrant further investigation.",
      "Construct a simple timeline of a suspected event.",
    ],
    prerequisites: ["Network Fundamentals (recommended)"],
    instructions: [
      {
        title: "Establish a baseline",
        description:
          "Review the sample authentication log and describe what normal, expected activity looks like before hunting for anomalies.",
        command: "cat /var/log/auth.log | tail -n 20",
      },
      {
        title: "Spot the anomaly",
        description:
          "Identify the entries below that stand out and explain why repeated failures from one source over a short window are noteworthy.",
        output:
          "Failed password for invalid user admin from 203.0.113.9 (x14)\nAccepted password for svc-backup from 10.0.0.5",
      },
      {
        title: "Build a timeline",
        description:
          "Order the relevant events and summarize what a defender would document and escalate.",
      },
    ],
  },
  {
    id: "web-security-fundamentals",
    title: "Web Security Fundamentals",
    description:
      "Explore how common web vulnerabilities arise from untrusted input and learn the defensive patterns that prevent them.",
    category: "Web Security",
    level: "Beginner",
    estimatedMinutes: 50,
    skills: ["Input validation", "Output encoding", "Secure defaults"],
    objectives: [
      "Explain why untrusted input is the root of many web vulnerabilities.",
      "Describe validation and output-encoding as defensive controls.",
      "Recognize the value of secure defaults and defense in depth.",
    ],
    prerequisites: ["HTTP Request Analysis (recommended)"],
    instructions: [
      {
        title: "Trace untrusted input",
        description:
          "Follow a piece of user-supplied data from request to response and mark every point where it should be validated or encoded.",
      },
      {
        title: "Contrast unsafe vs. safe handling",
        description:
          "Compare the two approaches below and explain, conceptually, why parameterized/encoded handling is safer. This is illustrative only.",
        command:
          '// Unsafe (concatenation)  vs.  // Safe (parameterized)\nquery("... WHERE id = " + input)   query("... WHERE id = ?", [input])',
      },
      {
        title: "Design a defense",
        description:
          "Write a short checklist a developer could follow to handle input safely across a web application.",
      },
    ],
  },
  {
    id: "security-monitoring",
    title: "Security Monitoring",
    description:
      "Understand how monitoring, detections, and alerting come together to give defenders visibility into their environment.",
    category: "Defensive Security",
    level: "Intermediate",
    estimatedMinutes: 65,
    skills: ["Detection logic", "Alert tuning", "Visibility"],
    objectives: [
      "Explain the role of monitoring in a defensive strategy.",
      "Describe what makes a good detection versus a noisy one.",
      "Reason about the trade-offs of alert sensitivity.",
    ],
    prerequisites: ["Log Analysis (recommended)"],
    instructions: [
      {
        title: "Define what to watch",
        description:
          "List the data sources you would collect to detect suspicious authentication activity and explain why each adds value.",
      },
      {
        title: "Write a detection idea",
        description:
          "Draft a plain-language detection rule for repeated failed logins followed by a success, and note the fields it would rely on.",
        command:
          'IF failed_logins(source) > 10 within 5m AND later success(source)\nTHEN raise "possible brute-force success"',
      },
      {
        title: "Tune for signal",
        description:
          "Identify one reason your rule might produce false positives and propose a way to reduce noise without missing real events.",
      },
    ],
  },
];

/** Subset of labs surfaced on the homepage. */
export const featuredLabs: Lab[] = labs.slice(0, 4);

/** Look up a single lab by its route slug. */
export function getLabById(labId: string): Lab | undefined {
  return labs.find((lab) => lab.id === labId);
}
