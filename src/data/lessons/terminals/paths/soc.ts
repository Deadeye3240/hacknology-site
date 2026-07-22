import { cmd, h, lab, prefix, SOC_SCENARIO, step } from "../helpers";

export const socTerminals = {
  "soc-what-is-soc": lab(
    "SOC introduction lab",
    "Read an alert and orient to the SOC workflow.",
    SOC_SCENARIO,
    [
      step("cat-alert", "Open alert.txt — SOC analysts start with the alert narrative.",
        [h("Command", "cat alert.txt")], [cmd("cat alert.txt")]),
      step("whoami", "Confirm analyst account context.",
        [h("Command", "whoami")], [cmd("whoami")]),
      step("cd-logs", "Navigate to /var/log for evidence.",
        [h("Command", "cd /var/log")], [cmd("cd /var/log")]),
    ],
  ),

  "soc-siem-concepts": lab(
    "SIEM correlation lab",
    "Correlate alert IP with auth log entries.",
    SOC_SCENARIO,
    [
      step("cat-alert", "Read alert for source IP 203.0.113.44.",
        [h("Command", "cat alert.txt")], [cmd("cat alert.txt")]),
      step("grep-ip", "Grep auth.log for the alert IP — SIEM rules automate this correlation.",
        [h("Command", "grep 203.0.113.44 /var/log/auth.log")], [prefix("grep 203")]),
    ],
  ),

  "soc-log-analysis": lab(
    "Log analysis lab",
    SOC_SCENARIO,
    [
      step("cd-var-log", "Move to log directory.",
        [h("Command", "cd /var/log")], [cmd("cd /var/log")]),
      step("head-auth", "Preview auth.log structure with head.",
        [h("Command", "head auth.log")], [prefix("head")]),
      step("grep-failed", "Filter failed password events.",
        [h("Command", "grep Failed auth.log")], [prefix("grep Failed")]),
      step("tail-auth", "Tail for most recent events during active triage.",
        [h("Command", "tail auth.log")], [prefix("tail")]),
    ],
  ),

  "soc-alert-triage": lab(
    "Alert triage lab",
    SOC_SCENARIO,
    [
      step("cat-alert", "Read alert severity and recommended action.",
        [h("Command", "cat alert.txt")], [cmd("cat alert.txt")]),
      step("grep-failed", "Validate brute-force pattern in auth.log.",
        [h("Command", "grep Failed /var/log/auth.log")], [prefix("grep Failed")]),
      step("grep-accepted", "Check if any login succeeded from suspicious IP.",
        [h("Command", "grep Accepted /var/log/auth.log")], [prefix("grep Accepted")],
        "Alert + failed logins + no success = lower urgency; success = escalate."),
    ],
  ),

  "soc-ioc": lab(
    "Indicators of compromise lab",
    SOC_SCENARIO,
    [
      step("grep-ip", "Search logs for IOC IP 203.0.113.44.",
        "IOCs are atomic observables — IP, hash, domain — you hunt across data sources.",
        [h("Command", "grep 203.0.113.44 /var/log/auth.log")], [prefix("grep 203")]),
      step("grep-sshd", "Narrow to sshd process entries.",
        [h("Command", "grep sshd /var/log/auth.log")], [prefix("grep sshd")]),
    ],
  ),

  "soc-incident-detection": lab(
    "Incident detection lab",
    SOC_SCENARIO,
    [
      step("ss", "Baseline open ports — new listeners may indicate compromise.",
        [h("Command", "ss -tulpn")], [prefix("ss")]),
      step("grep-failed", "Detect brute-force pattern in auth logs.",
        [h("Command", "grep Failed /var/log/auth.log")], [prefix("grep Failed")]),
      step("grep-accepted", "Detect successful login after failures.",
        [h("Command", "grep Accepted /var/log/auth.log")], [prefix("grep Accepted")]),
    ],
  ),

  "soc-ir-lifecycle": lab(
    "IR lifecycle lab",
    "Detection → analysis → containment workflow in logs.",
    SOC_SCENARIO,
    [
      step("cat-alert", "Detection: alert fires.",
        [h("Command", "cat alert.txt")], [cmd("cat alert.txt")]),
      step("grep-analysis", "Analysis: grep auth.log for attacker IP.",
        [h("Command", "grep 203.0.113.44 /var/log/auth.log")], [prefix("grep 203")]),
      step("echo-contain", 'Echo containment action: block IP at firewall.',
        [h("Command", 'echo "block 203.0.113.44 at firewall"')], [prefix("echo")]),
    ],
  ),

  "soc-incident-documentation": lab(
    "Incident documentation lab",
    "Build a ticket narrative from alert → log evidence → documented IOCs.",
    SOC_SCENARIO,
    [
      step(
        "cat-alert",
        "Read alert.txt — paste key fields into your ticket summary (alert name, IP, count).",
        "Documentation starts with the triggering event, not your conclusion.",
        [h("Command", "cat alert.txt")],
        [cmd("cat alert.txt")],
      ),
      step(
        "grep-evidence",
        "Grep auth.log for the alert IP — this log line becomes a cited observation in UTC.",
        "Write what you observed: '47 Failed password lines from 203.0.113.44' — not 'probably hacked'.",
        [h("Command", "grep 203.0.113.44 /var/log/auth.log")],
        [prefix("grep 203")],
      ),
      step(
        "cat-template",
        "Open incident-template.txt and identify sections you must fill before escalating.",
        "Scope, timeline, IOCs, actions, and next steps are minimum viable handoff fields.",
        [h("Command", "cat incident-template.txt")],
        [cmd("cat incident-template.txt")],
        "Structured notes let Tier 2 continue without re-reading every raw log line.",
      ),
    ],
  ),

  "soc-threat-intelligence": lab(
    "Threat intelligence lab",
    "Enrich documented IOCs with external context — always cite source and confidence.",
    SOC_SCENARIO,
    [
      step(
        "grep-ip",
        "Confirm the IOC IP appears in internal auth logs before enriching externally.",
        [h("Command", "grep 203.0.113.44 /var/log/auth.log")],
        [prefix("grep 203")],
      ),
      step(
        "whois",
        "Run passive WHOIS enrichment on the indicator.",
        "Record intel source (WHOIS), retrieval time (UTC), and confidence in your ticket.",
        [h("Command", "whois 203.0.113.44")],
        [prefix("whois")],
      ),
    ],
  ),
};
