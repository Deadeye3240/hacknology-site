import { cmd, h, lab, prefix, step, WEB_SCENARIO } from "../helpers";

export const webSecurityTerminals = {
  "web-security-how-websites-work": lab(
    "Web stack lab",
    "Follow the same path a browser takes: HTTP request → server files on disk.",
    WEB_SCENARIO,
    [
      step(
        "curl",
        "Fetch the training app homepage with curl (simulated HTTP response).",
        "The client sends an HTTP request; curl lets you see the response without a browser hiding details.",
        [h("Concept", "This mirrors GET / from the lesson — client to server and back."), h("Syntax", "curl URL fetches the response body."), h("Try", "curl http://app.hacknology.lab")],
        [prefix("curl http")],
      ),
      step(
        "cd-www",
        "Navigate to /var/www/html — the default web root on many Linux servers.",
        "Static HTML often lives here; attackers hunt for backup files and misconfigurations in this tree.",
        [h("Concept", "Server-side files are separate from the HTTP response you just fetched."), h("Try", "cd /var/www/html")],
        [cmd("cd /var/www/html")],
      ),
      step(
        "ls-www",
        "List files in the web root — these map to URLs the server can serve.",
        "index and robots.txt are common; knowing what is on disk explains what curl returned.",
        [h("Try", "ls")],
        [prefix("ls")],
        "You traced client (curl) → server path (/var/www/html) — the trust boundary from the lesson.",
      ),
    ],
  ),

  "web-security-http": lab(
    "HTTP lab",
    "Inspect request/response with curl -I and access logs.",
    WEB_SCENARIO,
    [
      step("curl-i", "Send HEAD request to view HTTP status and headers.",
        "Status codes (200, 404, 500) tell you if the server handled the request.",
        [h("Command", "curl -I http://app.hacknology.lab")], [prefix("curl -I")]),
      step("cat-access", "Read access.log for recorded HTTP requests.",
        [h("Command", "cat /var/log/access.log")], [cmd("cat /var/log/access.log"), prefix("cat")]),
    ],
  ),

  "web-security-cookies-sessions": lab(
    "Cookies and sessions lab",
    "Find Set-Cookie headers and session values in logs.",
    WEB_SCENARIO,
    [
      step("curl-i", "Fetch headers — look for Set-Cookie with HttpOnly and Secure flags.",
        "Session cookies identify logged-in users — stealing them hijacks sessions.",
        [h("Command", "curl -I http://app.hacknology.lab")], [prefix("curl -I")]),
      step("cat-requests", "Read requests.txt showing Cookie header on login request.",
        [h("Command", "cat requests.txt")], [cmd("cat requests.txt")]),
    ],
  ),

  "web-security-authentication": lab(
    "Authentication lab",
    "Review failed vs successful login patterns in access log.",
    WEB_SCENARIO,
    [
      step("grep-401", "Grep access.log for 401 Unauthorized responses.",
        "Failed logins (401) may indicate brute force or credential stuffing.",
        [h("Command", "grep 401 /var/log/access.log")], [prefix("grep 401")]),
      step("grep-200", "Grep for 200 OK on /login POST — successful auth.",
        [h("Command", "grep login /var/log/access.log")], [prefix("grep login")]),
    ],
  ),

  "web-security-authorization": lab(
    "Authorization lab",
    "Check robots.txt for hidden paths — authorization must enforce access server-side.",
    WEB_SCENARIO,
    [
      step("cat-robots", "Read robots.txt — Disallow hints at paths, not security.",
        "robots.txt is not access control; attackers read it for hints.",
        [h("Command", "cat /var/www/html/robots.txt")], [prefix("cat")]),
      step("curl-admin", "Try curl -I http://app.hacknology.lab/admin — authorization must block unauthorized roles.",
        [h("Command", "curl -I http://app.hacknology.lab/admin")], [prefix("curl")]),
    ],
  ),

  "web-security-input-validation": lab(
    "Input validation lab",
    "Inspect access log for suspicious query strings (simulated).",
    WEB_SCENARIO,
    [
      step("cat-access", "Read access.log entries for login POST data.",
        "Unvalidated input in logs may show injection attempts — always validate on the server before processing.",
        [h("Concept", "Logs show what arrived; they do not replace input validation."), h("Try", "cat /var/log/access.log")],
        [prefix("cat /var/log/access")]),
      step(
        "grep-post",
        "Grep for POST requests in the access log.",
        "POST carries form data in the body — injection payloads often appear in logged request lines.",
        [h("Syntax", "grep filters lines matching a pattern."), h("Try", "grep POST /var/log/access.log")],
        [prefix("grep POST")],
      ),
    ],
  ),

  "web-security-sql-injection": lab(
    "SQL injection awareness lab",
    "Recognize dangerous input patterns in request logs.",
    WEB_SCENARIO,
    [
      step("cat-access", "Review access.log POST to /login — injection often targets login forms.",
        [h("Command", "cat /var/log/access.log")], [cmd("cat /var/log/access.log"), prefix("cat")]),
      step("grep-post", "Grep for POST requests in access log.",
        [h("Command", "grep POST /var/log/access.log")], [cmd("grep POST /var/log/access.log"), prefix("grep POST")]),
      step("grep-injection", "Grep for SQL injection patterns (OR '1'='1) in the log.",
        "Parameterized queries prevent user input from altering SQL structure.",
        [h("Command", "grep OR /var/log/access.log"), h("Alt", "grep \"' OR '\" /var/log/access.log")],
        [prefix("grep OR"), prefix("grep ' OR '")]),
    ],
  ),

  "web-security-xss": lab(
    "XSS awareness lab",
    "Inspect HTTP response Content-Type — XSS lives in HTML context.",
    WEB_SCENARIO,
    [
      step("curl-i", "Check Content-Type header — HTML pages reflect user input dangerously.",
        [h("Command", "curl -I http://app.hacknology.lab")], [prefix("curl -I")]),
      step("cat-index", "View index HTML served to browsers.",
        [h("Command", "cat /var/www/html/index")], [prefix("cat")]),
    ],
  ),

  "web-security-csrf": lab(
    "CSRF awareness lab",
    "Review cookie flags — SameSite mitigates cross-site request forgery.",
    WEB_SCENARIO,
    [
      step("curl-i", "Inspect Set-Cookie for HttpOnly; production apps add SameSite.",
        [h("Command", "curl -I http://app.hacknology.lab")], [prefix("curl -I")]),
      step("cat-requests", "See session cookie sent on state-changing POST.",
        [h("Command", "cat requests.txt")], [cmd("cat requests.txt")]),
    ],
  ),

  "web-security-idor": lab(
    "IDOR awareness lab",
    "Find predictable resource paths — authorization must check object ownership.",
    WEB_SCENARIO,
    [
      step("cat-robots", "robots.txt Disallow: /admin — IDOR often hits /api/user/123 style URLs.",
        [h("Command", "cat /var/www/html/robots.txt")], [prefix("cat robots")]),
      step("curl-i", "Request app root — compare to direct object URLs in real apps.",
        [h("Command", "curl -I http://app.hacknology.lab/profile?id=1")], [prefix("curl")]),
    ],
  ),

  "web-security-path-traversal": lab(
    "Path traversal lab",
    "Attempt safe read of web root vs sensitive paths (simulated).",
    WEB_SCENARIO,
    [
      step("cd-www", "Navigate to web root.",
        [h("Command", "cd /var/www/html")], [cmd("cd /var/www/html")]),
      step("ls", "List intended public files only.",
        [h("Command", "ls")], [prefix("ls")]),
      step("echo-traversal", 'Echo: block ../ in user-supplied file paths.',
        "Traversal exploits concatenate ../ to escape intended directories.",
        [h("Command", 'echo "sanitize file paths"')], [prefix("echo")]),
    ],
  ),

  "web-security-headers-owasp": lab(
    "Security headers lab",
    "Audit response headers against OWASP recommendations.",
    WEB_SCENARIO,
    [
      step("curl-i", "Fetch headers — note X-Frame-Options: DENY.",
        "Security headers enforce browser-side protections (clickjacking, MIME sniffing).",
        [h("Command", "curl -I http://app.hacknology.lab")], [prefix("curl -I")]),
      step("grep-frame", "Conceptually identify X-Frame-Options in curl output (re-run if needed).",
        [h("Command", "curl -I http://app.hacknology.lab")], [prefix("curl")]),
      step("echo-hsts", 'Echo: add HSTS, CSP, and X-Content-Type-Options in production.',
        [h("Command", 'echo "deploy security headers"')], [prefix("echo")],
        "Headers are cheap defense-in-depth — enable them on all responses."),
    ],
  ),
};
