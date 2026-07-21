import type { VulnerableLabChallenge } from "@/types/gamification";

/**
 * Catalog of sandboxed vulnerable lab challenges.
 * All simulations use fake in-memory data — never production resources.
 */
export const vulnerableLabs: VulnerableLabChallenge[] = [
  {
    id: "broken-login",
    title: "The Broken Login",
    description:
      "A simulated login form builds SQL queries unsafely. Bypass authentication without valid credentials.",
    category: "Authentication",
    level: "Beginner",
    xpReward: 50,
    estimatedMinutes: 10,
    scenario:
      "You have discovered a fictional company's employee portal. The login form appears to query a database directly. Your goal is to access the admin dashboard without knowing the real password.",
    objectives: [
      "Identify how user input is concatenated into a query",
      "Craft a payload that bypasses authentication",
      "Understand why parameterized queries prevent this attack",
    ],
    instructions: [
      "Try logging in with normal credentials first (hint: guest/guest).",
      "Observe the simulated query shown after each attempt.",
      "Craft an injection payload using OR logic to bypass the password check.",
      "Access the admin panel to complete the challenge.",
    ],
    hints: [
      "SQL injection often exploits unescaped single quotes in string concatenation.",
      "Try closing the username string with a quote, then adding OR '1'='1.",
      "Payload example: admin' OR '1'='1' --",
    ],
    vulnerability: "SQL Injection in authentication",
    whyItMatters:
      "Authentication bypass lets attackers impersonate any user, including administrators, without valid credentials.",
    prevention:
      "Use parameterized queries or prepared statements. Never concatenate user input into SQL. Enforce MFA for sensitive accounts.",
    nextChallengeId: "whos-that-user",
  },
  {
    id: "whos-that-user",
    title: "Who's That User?",
    description:
      "Browse fake user profiles by ID. Find the hidden admin record you were not meant to see.",
    category: "Access Control",
    level: "Beginner",
    xpReward: 50,
    estimatedMinutes: 8,
    scenario:
      "A profile viewer lets employees look up colleagues by numeric ID. The app checks that you are logged in, but does it check that you are allowed to view each profile?",
    objectives: [
      "Enumerate user IDs to find hidden accounts",
      "Access a profile you should not be authorized to view",
      "Understand IDOR (Insecure Direct Object Reference)",
    ],
    instructions: [
      "Use the ID field to view profiles starting from ID 1.",
      "Increment the ID and observe what data is returned.",
      "Find the profile containing the secret flag.",
    ],
    hints: [
      "IDs are often sequential integers.",
      "Try IDs above the ones shown in the public directory.",
      "Admin or executive profiles may have higher ID numbers.",
    ],
    vulnerability: "Insecure Direct Object Reference (IDOR)",
    whyItMatters:
      "IDOR lets attackers access other users' private data by changing an identifier in the URL or request.",
    prevention:
      "Authorize every object access server-side. Use unpredictable IDs. Never rely on obscurity of sequential numbers.",
    nextChallengeId: "echo-chamber",
  },
  {
    id: "echo-chamber",
    title: "Echo Chamber",
    description:
      "A guestbook reflects your input without sanitization. Execute a payload in the isolated sandbox.",
    category: "XSS",
    level: "Beginner",
    xpReward: 75,
    estimatedMinutes: 12,
    scenario:
      "A simulated guestbook echoes messages back to the page. The developer forgot to escape HTML. Your goal is to run JavaScript inside the sandboxed preview to reveal the flag.",
    objectives: [
      "Recognize reflected user input in HTML",
      "Craft a safe educational XSS payload",
      "See how script execution can steal data or hijack sessions",
    ],
    instructions: [
      "Submit a normal message and see it reflected.",
      "Try injecting HTML tags to see if they render.",
      "Use an event handler (like onerror) to execute code in the sandbox.",
      "Reveal the hidden flag element to complete the challenge.",
    ],
    hints: [
      "Angle brackets may not be filtered in this simulation.",
      "Event handlers like onerror can run JavaScript without a <script> tag.",
      "Try: <img src=x onerror=\"...\"> with code to show the flag.",
    ],
    vulnerability: "Cross-Site Scripting (XSS)",
    whyItMatters:
      "XSS lets attackers run code in victims' browsers, stealing cookies, session tokens, or performing actions as the user.",
    prevention:
      "Encode output contextually (HTML, JS, URL). Use Content-Security-Policy. Prefer frameworks that auto-escape by default.",
    nextChallengeId: "fake-database",
  },
  {
    id: "fake-database",
    title: "The Fake Database",
    description:
      "Search a mock product catalog. Extract hidden rows using SQL injection against a simulated query.",
    category: "Injection",
    level: "Intermediate",
    xpReward: 100,
    estimatedMinutes: 15,
    scenario:
      "An inventory search box builds a SQL WHERE clause from your input. The database contains a secret products table entry. Dump it using injection.",
    objectives: [
      "Break out of the search string context",
      "Use UNION or OR logic to return extra rows",
      "Locate the flag in the leaked results",
    ],
    instructions: [
      "Search for a normal product name first.",
      "Study the simulated query output.",
      "Inject SQL to return all rows or union in the secrets table.",
    ],
    hints: [
      "Closing the string with a quote is the first step.",
      "OR 1=1 often returns every row in simple queries.",
      "Try: ' OR 1=1 --",
    ],
    vulnerability: "SQL Injection in search",
    whyItMatters:
      "Search injection can expose entire databases, including credentials, PII, and internal secrets.",
    prevention:
      "Parameterized queries, least-privilege DB accounts, input validation, and WAF rules for known patterns.",
    nextChallengeId: "lost-in-files",
  },
  {
    id: "lost-in-files",
    title: "Lost in the Files",
    description:
      "Navigate a virtual filesystem. Use path traversal to read files outside the public directory.",
    category: "Path Traversal",
    level: "Intermediate",
    xpReward: 100,
    estimatedMinutes: 12,
    scenario:
      "A file viewer serves documents from a public folder. The server does not normalize paths. Can you read files from parent directories?",
    objectives: [
      "Understand how ../ traverses directories",
      "Bypass the public folder restriction",
      "Read the secret admin notes file",
    ],
    instructions: [
      "Request a normal public file like readme.txt.",
      "Try adding ../ segments to escape the public directory.",
      "Find and read the file containing the flag.",
    ],
    hints: [
      "Unix paths use .. to refer to the parent directory.",
      "Try: ../secret/admin-notes.txt",
      "Some apps filter ../ but miss URL-encoded variants — this sim uses plain paths.",
    ],
    vulnerability: "Path Traversal / Directory Traversal",
    whyItMatters:
      "Path traversal can expose configuration files, source code, and credentials stored on the server.",
    prevention:
      "Canonicalize paths and verify they stay within an allowed base directory. Deny .. segments. Run with minimal file permissions.",
    nextChallengeId: "cookie-monster",
  },
  {
    id: "cookie-monster",
    title: "Cookie Monster",
    description:
      "A simulated session cookie stores your role. Escalate from user to admin without re-authenticating.",
    category: "Session",
    level: "Intermediate",
    xpReward: 75,
    estimatedMinutes: 10,
    scenario:
      "After login, the app trusts a role value stored in a client-side cookie. There is no server-side session validation of privileges.",
    objectives: [
      "Inspect the simulated cookie after login",
      "Modify the role value to escalate privileges",
      "Access the admin-only panel",
    ],
    instructions: [
      "Log in with the provided test account.",
      "Open the cookie editor and note the role value.",
      "Change role from user to admin and refresh the simulated session.",
    ],
    hints: [
      "Never trust client-side cookies for authorization decisions.",
      "The role cookie is editable in the panel below.",
      "Set role=admin and click Apply.",
    ],
    vulnerability: "Insecure session / client-side trust",
    whyItMatters:
      "If the server trusts cookies or JWT claims without verification, attackers can forge admin access.",
    prevention:
      "Store sessions server-side or sign tokens cryptographically. Always re-validate permissions on every request.",
    nextChallengeId: "info-leak",
  },
  {
    id: "info-leak",
    title: "Information Leak",
    description:
      "Explore a fictional app's source and metadata. Find credentials hidden in comments and config files.",
    category: "Information Disclosure",
    level: "Beginner",
    xpReward: 50,
    estimatedMinutes: 8,
    scenario:
      "Developers left sensitive comments in HTML and exposed a backup config file. Find the leaked API key.",
    objectives: [
      "Review HTML source for hidden comments",
      "Check exposed configuration endpoints",
      "Extract the leaked secret",
    ],
    instructions: [
      "Browse the simulated application tabs.",
      "View page source for HTML comments.",
      "Check the exposed .env backup file.",
      "Enter the discovered API key as the flag.",
    ],
    hints: [
      "Right-click → View Source is simulated via the Source tab.",
      "HTML comments start with <!--",
      "Developers sometimes commit .env.bak files by mistake.",
    ],
    vulnerability: "Information Disclosure",
    whyItMatters:
      "Leaked keys and comments give attackers direct access to APIs, databases, and internal systems.",
    prevention:
      "Remove debug comments before production. Scan repos for secrets. Use secret managers, not config files in web roots.",
    nextChallengeId: "security-headers",
  },
  {
    id: "security-headers",
    title: "Security Headers",
    description:
      "Audit a simulated HTTP response. Identify which critical security headers are missing.",
    category: "Configuration",
    level: "Advanced",
    xpReward: 125,
    estimatedMinutes: 15,
    scenario:
      "A security review found this application's HTTP response headers incomplete. Select all missing headers that would reduce common web attacks.",
    objectives: [
      "Know common security headers and their purpose",
      "Identify gaps in a realistic header set",
      "Understand defense-in-depth at the HTTP layer",
    ],
    instructions: [
      "Review the simulated response headers.",
      "Compare against the checklist of recommended headers.",
      "Select every header that is missing or misconfigured.",
      "Submit when you have identified all gaps.",
    ],
    hints: [
      "Content-Security-Policy restricts script and resource sources.",
      "X-Frame-Options prevents clickjacking.",
      "Strict-Transport-Security enforces HTTPS.",
      "X-Content-Type-Options stops MIME sniffing.",
    ],
    vulnerability: "Missing security headers",
    whyItMatters:
      "Headers provide browser-level protections against XSS, clickjacking, and downgrade attacks without changing application code.",
    prevention:
      "Configure CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy on all responses.",
    nextChallengeId: "broken-login",
  },
];

export function getVulnerableLabById(id: string): VulnerableLabChallenge | undefined {
  return vulnerableLabs.find((c) => c.id === id);
}

export function beginnerLabCount(): number {
  return vulnerableLabs.filter((c) => c.level === "Beginner").length;
}
