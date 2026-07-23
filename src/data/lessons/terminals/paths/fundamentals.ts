import {
  cmd,
  FUNDAMENTALS_SCENARIO,
  FORENSICS_SCENARIO,
  h,
  lab,
  LINUX_SCENARIO,
  prefix,
  SOC_SCENARIO,
  step,
  WEB_SCENARIO,
} from "../helpers";

export const fundamentalsTerminals = {
  "fundamentals-what-is-cybersecurity": lab(
    "Security analyst workflow lab",
    "Walk through the same steps a junior analyst takes when a triage alert arrives.",
    FUNDAMENTALS_SCENARIO,
    [
      step(
        "whoami",
        "Confirm which account you are using before investigating.",
        "You must know your own privileges before touching production systems — even reading logs may require specific roles.",
        [h("Command", "whoami")],
        [cmd("whoami")],
      ),
      step(
        "cat-alert",
        "Read sample-alert.txt — this is the narrative a SOC ticket starts from.",
        "Cybersecurity connects business risk to observable events like repeated failed logins.",
        [h("Command", "cat sample-alert.txt")],
        [cmd("cat sample-alert.txt")],
      ),
      step(
        "cd-logs",
        "Navigate to /var/log where authentication evidence is stored on Linux servers.",
        "The alert mentions SSH failures — auth logs are where you validate or dismiss the alert.",
        [h("Command", "cd /var/log")],
        [cmd("cd /var/log")],
      ),
      step(
        "grep-failed",
        "Search auth.log for Failed password events matching the alert pattern.",
        "This is detective work: does the log data support the alert, or is it a false positive?",
        [h("Syntax", "grep searches for text patterns in files."), h("Command", "grep Failed auth.log")],
        [prefix("grep Failed")],
        "You connected a business question ('are we under attack?') to log evidence — core analyst skill.",
      ),
    ],
  ),

  "fundamentals-cia-triad": lab(
    "CIA triad lab",
    "Relate confidentiality, integrity, and availability to file and log access.",
    FUNDAMENTALS_SCENARIO,
    [
      step(
        "cat-notes",
        "Read notes.txt in your home directory.",
        "Confidentiality means only authorized users should read sensitive content — if you can cat the file, your account has read access.",
        [h("Concept", "Reading a file tests confidentiality controls for your user."), h("Command", "cat notes.txt")],
        [cmd("cat notes.txt")],
      ),
      step(
        "cd-var-log",
        "Navigate to /var/log where authentication and system events are recorded.",
        "Integrity depends on detecting unauthorized changes — logs are primary evidence when files are tampered with.",
        [h("Approach", "Use cd /var/log to reach standard log location."), h("Command", "cd /var/log")],
        [cmd("cd /var/log")],
      ),
      step(
        "ping",
        "Ping 127.0.0.1 to verify the local network stack responds.",
        "Availability means services respond when needed — if loopback ping fails, the host itself has a fundamental problem.",
        [h("Concept", "127.0.0.1 is always your own machine — a quick availability sanity check."), h("Command", "ping 127.0.0.1")],
        [prefix("ping")],
        "You tied each CIA pillar to a concrete check: read access, log integrity monitoring, and local responsiveness.",
      ),
    ],
  ),

  "fundamentals-threats-threat-actors": lab(
    "Threat actors lab",
    "Review auth logs for patterns that suggest external threat activity.",
    { ...LINUX_SCENARIO, initialCwd: "/var/log" },
    [
      step("grep-failed", "Grep auth.log for Failed password attempts.",
        "External attackers often show up as repeated failed logins before a breach.",
        [h("Command", "grep Failed auth.log")], [prefix("grep Failed")]),
      step("grep-accepted", "Grep for Accepted logins — success after failures is suspicious.",
        [h("Command", "grep Accepted auth.log")], [prefix("grep Accepted")]),
    ],
  ),

  "fundamentals-vulnerabilities": lab(
    "Vulnerability awareness lab",
    "Find misconfiguration and identity data that attackers enumerate first.",
    FUNDAMENTALS_SCENARIO,
    [
      step(
        "cd-etc",
        "Navigate to /etc — configuration mistakes here become exploitable vulnerabilities.",
        [h("Command", "cd /etc")],
        [cmd("cd /etc")],
      ),
      step(
        "cat-passwd",
        "Review passwd for service accounts and login shells.",
        "Accounts with /bin/bash and weak passwords are common footholds; nologin shells limit exposure.",
        [h("Command", "cat passwd")],
        [cmd("cat passwd")],
      ),
      step(
        "ss",
        "List listening ports — each open port is a vulnerability if the service is unpatched or misconfigured.",
        [h("Command", "ss -tulpn")],
        [prefix("ss")],
        "Enumeration (users + ports) precedes exploitation — patch and harden what you find.",
      ),
    ],
  ),

  "fundamentals-risk": lab(
    "Risk assessment lab",
    "Combine exposure (open ports) with sensitive data (logs) to think about risk.",
    FUNDAMENTALS_SCENARIO,
    [
      step("ss", "List open ports — each is potential attack surface.",
        [h("Command", "ss -tulpn")], [prefix("ss")]),
      step("cd-var-log", "Navigate to logs that document security events.",
        [h("Command", "cd /var/log")], [cmd("cd /var/log")]),
      step("head-auth", "Preview auth.log — high-value asset if exposed.",
        [h("Command", "head auth.log")], [prefix("head")]),
    ],
  ),

  "fundamentals-security-controls": lab(
    "Controls lab",
    "See preventive (permissions) and detective (logs) controls in action.",
    FUNDAMENTALS_SCENARIO,
    [
      step("ls-l", "Long-list home directory — permissions are preventive controls.",
        [h("Command", "ls -la")], [cmd("ls -la"), cmd("ls -l")]),
      step("cd-var-log", "Navigate to /var/log before reading security logs.",
        [h("Command", "cd /var/log")], [cmd("cd /var/log")]),
      step("tail-auth", "Tail auth.log — logging is a detective control.",
        [h("Command", "tail auth.log")], [cmd("tail auth.log"), prefix("tail -n")]),
    ],
  ),

  "fundamentals-auth-vs-authz": lab(
    "AuthN vs AuthZ lab",
    "whoami = authentication; file read success = authorization in action.",
    FUNDAMENTALS_SCENARIO,
    [
      step("whoami", "Authentication: prove who you are.",
        [h("Command", "whoami")], [cmd("whoami")]),
      step("cat-notes", "Authorization: are you allowed to read this file?",
        [h("Command", "cat notes.txt")], [cmd("cat notes.txt")]),
      step("cat-auth-deny", "Try reading auth.log — authorization may require elevated role.",
        [h("Approach", "cd /var/log && cat auth.log"), h("Command", "cat auth.log")],
        [prefix("cat auth")]),
    ],
  ),

  "fundamentals-password-security": lab(
    "Password security lab",
    "Hunt failed password patterns in auth logs.",
    { ...LINUX_SCENARIO, initialCwd: "/var/log" },
    [
      step("grep-failed", "Grep Failed password lines — weak passwords fail here first.",
        [h("Command", "grep Failed auth.log")], [prefix("grep Failed")]),
      step("grep-invalid", "Grep invalid user — password spraying tries many usernames.",
        [h("Command", "grep invalid auth.log")], [prefix("grep invalid")]),
    ],
  ),

  "fundamentals-mfa": lab(
    "MFA lab",
    "Compare password-only failures vs successful pubkey login.",
    { ...LINUX_SCENARIO, initialCwd: "/var/log" },
    [
      step("grep-failed", "Find failed password attempts.",
        [h("Command", "grep Failed auth.log")], [prefix("grep Failed")]),
      step("grep-pubkey", "Find Accepted publickey — MFA/key-based success without password.",
        [h("Command", "grep publickey auth.log")], [prefix("grep publickey")],
        "Pubkey acceptance shows stronger factor than password alone."),
    ],
  ),

  "fundamentals-encryption-basics": lab(
    "Encryption concepts lab",
    "Use curl -I to see HTTPS-related headers (TLS encrypts HTTP traffic).",
    FUNDAMENTALS_SCENARIO,
    [
      step("curl-i", "Fetch headers from HTTPS URL — TLS protects data in transit.",
        [h("Command", "curl -I https://app.hacknology.lab")], [prefix("curl")]),
      step("echo-transit", 'Echo: encryption protects data in transit.',
        [h("Command", 'echo "encryption in transit"')], [prefix("echo")]),
    ],
  ),

  "fundamentals-hashing": lab(
    "Hashing concepts lab",
    "View file metadata with a hash value — hashes verify integrity without decrypting content.",
    { ...FORENSICS_SCENARIO },
    [
      step("cd-evidence", "Navigate to /evidence where preserved files are stored.",
        [h("Command", "cd /evidence")], [cmd("cd /evidence")]),
      step("cat-meta", "Read file-metadata.txt — MD5 fingerprint detects tampering.",
        [h("Command", "cat file-metadata.txt")], [cmd("cat file-metadata.txt")]),
    ],
  ),

  "fundamentals-social-engineering": lab(
    "Social engineering awareness lab",
    "Review a simulated alert — humans are often the initial access vector.",
    SOC_SCENARIO,
    [
      step("cat-alert", "Read alert.txt describing suspicious activity.",
        [h("Command", "cat alert.txt")], [cmd("cat alert.txt")]),
      step("grep-auth", "Correlate with auth.log brute-force entries.",
        [h("Command", "grep 203.0.113.44 /var/log/auth.log")], [prefix("grep 203")]),
    ],
  ),

  "fundamentals-phishing": lab(
    "Phishing indicators lab",
    "Inspect HTTP headers for suspicious cookie/session handling.",
    WEB_SCENARIO,
    [
      step("curl-i", "Fetch headers — note Set-Cookie flags (HttpOnly, Secure).",
        "Phishing sites often mishandle cookies; legitimate apps use security flags.",
        [h("Command", "curl -I http://app.hacknology.lab")], [prefix("curl -I")]),
      step("cat-requests", "Read requests.txt for a sample login request with session cookie.",
        [h("Command", "cat requests.txt")], [cmd("cat requests.txt")]),
    ],
  ),

  "fundamentals-malware": lab(
    "Malware awareness lab",
    "Check running processes and unexpected listeners.",
    FUNDAMENTALS_SCENARIO,
    [
      step("ps", "List processes — malware often runs as unexpected names.",
        [h("Command", "ps")], [prefix("ps")]),
      step("ss", "List listeners — C2 malware opens outbound or inbound ports.",
        [h("Command", "ss -tulpn")], [prefix("ss")]),
    ],
  ),

  "fundamentals-security-policies": lab(
    "Policy in practice lab",
    "Read training reminder file — policies translate to daily behavior.",
    FUNDAMENTALS_SCENARIO,
    [
      step("cat-notes", "Read notes.txt — acceptable use reminders.",
        [h("Command", "cat notes.txt")], [cmd("cat notes.txt")]),
      step("echo-policy", 'Echo: follow authorized scope in labs.',
        [h("Command", 'echo "authorized scope only"')], [prefix("echo")]),
    ],
  ),

  "fundamentals-defense-in-depth": lab(
    "Defense in depth lab",
    "Layer controls: network (ss), auth logs, and file permissions.",
    FUNDAMENTALS_SCENARIO,
    [
      step("ss", "Layer 1 — network exposure check.",
        [h("Command", "ss -tulpn")], [prefix("ss")]),
      step("grep-auth", "Layer 2 — authentication monitoring.",
        [h("Command", "grep sshd /var/log/auth.log")], [prefix("grep")]),
      step("ls-l", "Layer 3 — filesystem permissions.",
        [h("Command", "ls -la")], [cmd("ls -la")],
        "Multiple layers mean one failure does not equal total compromise."),
    ],
  ),
};
