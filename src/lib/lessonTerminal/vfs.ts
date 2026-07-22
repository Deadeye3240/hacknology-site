import type { VfsDir, VfsNode } from "@/types/lessonTerminal";

export function normalizePath(cwd: string, target: string): string | null {
  let base = cwd;
  if (target.startsWith("/")) base = "/";
  const parts = target.startsWith("/") ? target.split("/") : [...base.split("/"), ...target.split("/")];
  const stack: string[] = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return "/" + stack.join("/");
}

export function resolveNode(root: VfsDir, path: string): VfsNode | null {
  const normalized = normalizePath("/", path);
  if (!normalized || normalized === "/") return root;
  const segments = normalized.split("/").filter(Boolean);
  let node: VfsNode = root;
  for (const seg of segments) {
    if (node.type !== "dir") return null;
    const next: VfsNode | undefined = node.children[seg];
    if (!next) return null;
    node = next;
  }
  return node;
}

export function listDirectory(root: VfsDir, path: string, showHidden: boolean): string[] {
  const node = resolveNode(root, path);
  if (!node || node.type !== "dir") return [];
  return Object.keys(node.children)
    .filter((name) => showHidden || !name.startsWith("."))
    .sort();
}

export function readFile(root: VfsDir, path: string): string | null {
  const node = resolveNode(root, path);
  if (!node || node.type !== "file") return null;
  return node.content;
}

export const DEFAULT_LINUX_VFS: VfsDir = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        student: {
          type: "dir",
          children: {
            ".bashrc": { type: "file", content: "# Hacknology training shell\nexport PS1='\\u@\\h:\\w\\$ '" },
            "notes.txt": {
              type: "file",
              content: "Remember: only run commands you understand in authorized lab environments.",
            },
            "sample-alert.txt": {
              type: "file",
              content:
                "ALERT: Multiple failed SSH logins from 203.0.113.44 against prod-web-01 (47 attempts / 10 min).\nSeverity: Medium\nAction: Review auth logs for successful logins from same IP.",
            },
          },
        },
      },
    },
    etc: {
      type: "dir",
      children: {
        hostname: { type: "file", content: "hacknology-lab" },
        passwd: {
          type: "file",
          content:
            "root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student:/home/student:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin",
        },
      },
    },
    var: {
      type: "dir",
      children: {
        log: {
          type: "dir",
          children: {
            "auth.log": {
              type: "file",
              content:
                "Jan 10 12:00:01 sshd[1204]: Accepted publickey for student from 10.0.0.5 port 52234\nJan 10 12:04:11 sudo: student : TTY=pts/0 ; PWD=/home/student ; USER=root ; COMMAND=/bin/ls",
            },
            syslog: { type: "file", content: "Jan 10 12:00:00 hacknology-lab systemd[1]: Started Session 42." },
          },
        },
      },
    },
    tmp: { type: "dir", children: {} },
  },
};

export const DEFAULT_NETWORK_VFS: VfsDir = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        student: { type: "dir", children: {
          "research-notes.txt": {
            type: "file",
            content:
              "site:hacknology.xyz filetype:pdf\nsite:hacknology.xyz inurl:admin\nintitle:\"index of\" hacknology\nwhois hacknology.xyz\ndig hacknology.xyz MX",
          },
        } },
      },
    },
    etc: {
      type: "dir",
      children: {
        hosts: { type: "file", content: "127.0.0.1 localhost\n10.10.10.25 training-target" },
        resolv: { type: "file", content: "nameserver 1.1.1.1\nsearch hacknology.lab" },
        "resolv.conf": { type: "file", content: "nameserver 1.1.1.1\nsearch hacknology.lab" },
      },
    },
  },
};

export const WEB_VFS: VfsDir = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        student: {
          type: "dir",
          children: {
            "requests.txt": {
              type: "file",
              content: "GET /login HTTP/1.1\nHost: app.hacknology.lab\nCookie: session=abc123",
            },
          },
        },
      },
    },
    var: {
      type: "dir",
      children: {
        www: {
          type: "dir",
          children: {
            html: {
              type: "dir",
              children: {
                index: {
                  type: "file",
                  content: "<html><body><h1>Training App</h1></body></html>",
                },
                "robots.txt": { type: "file", content: "User-agent: *\nDisallow: /admin" },
              },
            },
          },
        },
        log: {
          type: "dir",
          children: {
            "access.log": {
              type: "file",
              content:
                '10.0.0.5 - - [10/Jan/2026:12:00:01 +0000] "GET /login HTTP/1.1" 200 512\n10.0.0.5 - - [10/Jan/2026:12:00:02 +0000] "POST /login HTTP/1.1" 401 128\n10.0.0.9 - - [10/Jan/2026:12:05:00 +0000] "POST /login?user=admin\' OR \'1\'=\'1 HTTP/1.1" 500 64',
            },
          },
        },
      },
    },
  },
};

export const SOC_VFS: VfsDir = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        analyst: {
          type: "dir",
          children: {
            "alert.txt": {
              type: "file",
              content: "ALERT: Brute force SSH from 203.0.113.44 — 47 failures in 10 minutes",
            },
            "incident-template.txt": {
              type: "file",
              content:
                "INCIDENT TICKET (draft)\nStatus: Investigating\nSummary:\nAffected assets:\nTimeline (UTC):\nIOCs observed:\nActions taken:\nNext steps:",
            },
          },
        },
      },
    },
    var: {
      type: "dir",
      children: {
        log: {
          type: "dir",
          children: {
            "auth.log": {
              type: "file",
              content:
                "Jan 10 12:00:01 sshd[1204]: Failed password for invalid user admin from 203.0.113.44 port 52234\nJan 10 12:00:02 sshd[1204]: Failed password for invalid user root from 203.0.113.44 port 52234\nJan 10 12:00:03 sshd[1204]: Failed password for student from 203.0.113.44 port 52234\nJan 10 12:04:11 sshd[1204]: Accepted publickey for student from 10.0.0.5 port 52234",
            },
            "syslog": {
              type: "file",
              content: "Jan 10 12:00:00 hacknology-lab systemd[1]: Started Session 42.",
            },
          },
        },
      },
    },
  },
};

export const FORENSICS_VFS: VfsDir = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        investigator: {
          type: "dir",
          children: {
            "case-notes.txt": {
              type: "file",
              content: "Case 2026-014: Suspect downloaded archive at 11:58 UTC. Preserve metadata.",
            },
          },
        },
      },
    },
    evidence: {
      type: "dir",
      children: {
        "disk-image.dd": { type: "file", content: "[binary evidence — do not modify in place]" },
        "browser-history.csv": {
          type: "file",
          content: "timestamp,url\n2026-01-10T11:58:00Z,https://example.com/download\n2026-01-10T11:59:00Z,https://malware-drop.example",
        },
        "file-metadata.txt": {
          type: "file",
          content: "report.pdf | MD5: d41d8cd98f00b204e9800998ecf8427e | Created: 2026-01-10 11:55",
        },
      },
    },
    var: {
      type: "dir",
      children: {
        log: {
          type: "dir",
          children: {
            "auth.log": {
              type: "file",
              content: "Jan 10 11:58:01 sudo: investigator : TTY=pts/0 ; COMMAND=/bin/cp evidence/report.pdf /tmp/",
            },
          },
        },
      },
    },
  },
};

export const WINDOWS_VFS: VfsDir = {
  type: "dir",
  children: {
    Users: {
      type: "dir",
      children: {
        student: {
          type: "dir",
          children: {
            Desktop: {
              type: "dir",
              children: {
                "notes.txt": {
                  type: "file",
                  content:
                    "Windows triage checklist:\n1) whoami — confirm user context\n2) Review Security event log (4624/4625)\n3) Check services and startup locations (Registry Run keys)",
                },
              },
            },
            Documents: {
              type: "dir",
              children: {
                "security-events.txt": {
                  type: "file",
                  content:
                    "Log Name: Security\nEvent ID: 4625 — An account failed to log on.\n  Account Name: admin\n  Source Network Address: 203.0.113.44\n  Logon Type: 10 (RemoteInteractive/RDP)\n---\nEvent ID: 4624 — An account was successfully logged on.\n  Account Name: student\n  Logon Type: 2 (Interactive)\n---\nEvent ID: 4672 — Special privileges assigned to new logon.\n  Account Name: student",
                },
                "event-export.evtx": {
                  type: "file",
                  content: "[Binary .evtx container — use security-events.txt for readable triage in this lab]",
                },
              },
            },
          },
        },
      },
    },
    Windows: {
      type: "dir",
      children: {
        System32: {
          type: "dir",
          children: {
            drivers: {
              type: "dir",
              children: {
                etc: {
                  type: "dir",
                  children: {
                    hosts: { type: "file", content: "127.0.0.1 localhost\n10.10.10.25 training-target" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
