import type { VfsDir, VfsNode } from "@/types/lessonTerminal";
import { KALI_ETC_FILES, KALI_HOME_VFS, KALI_VAR_LOG } from "./kaliHome";

/** Resolve the simulated home directory for a session user. */
export function getHomeDir(username: string, initialCwd?: string): string {
  if (initialCwd?.startsWith("/Users/") || initialCwd?.startsWith("C:\\Users\\")) {
    return initialCwd.replace(/\\/g, "/");
  }
  return `/home/${username}`;
}

/** Expand ~ and normalize Windows-style separators before path resolution. */
export function expandUserPath(target: string, homeDir: string): string {
  const normalized = target.replace(/\\/g, "/").trim();
  if (!normalized || normalized === "~") return homeDir;
  if (normalized.startsWith("~/")) {
    const rest = normalized.slice(2);
    return rest ? `${homeDir}/${rest}`.replace(/\/+/g, "/") : homeDir;
  }
  if (normalized.startsWith("~")) {
    return normalized.slice(1).startsWith("/")
      ? normalized.slice(1)
      : `${homeDir}/${normalized.slice(1)}`.replace(/\/+/g, "/");
  }
  return normalized;
}

export function normalizePath(cwd: string, target: string): string | null {
  let base = cwd.replace(/\\/g, "/");
  if (target.startsWith("/")) base = "/";
  const parts = target.startsWith("/")
    ? target.split("/")
    : [...base.split("/"), ...target.split("/")];
  const stack: string[] = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return stack.length === 0 ? "/" : `/${stack.join("/")}`;
}

/** Resolve a user-supplied path against cwd and home (supports ~, absolute, and relative paths). */
export function resolvePath(cwd: string, target: string, homeDir: string): string | null {
  const expanded = expandUserPath(target, homeDir);
  if (expanded.startsWith("/")) return normalizePath("/", expanded);
  return normalizePath(cwd, expanded);
}

export function resolveNode(root: VfsDir, path: string): VfsNode | null {
  const normalized = normalizePath("/", path.replace(/\\/g, "/"));
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

const LINUX_ROOT_DIRS: VfsDir["children"] = {
  bin: { type: "dir", children: {} },
  boot: { type: "dir", children: {} },
  dev: { type: "dir", children: {} },
  etc: { type: "dir", children: {} },
  home: { type: "dir", children: {} },
  lib: { type: "dir", children: {} },
  media: { type: "dir", children: {} },
  mnt: { type: "dir", children: {} },
  opt: { type: "dir", children: {} },
  proc: { type: "dir", children: {} },
  root: { type: "dir", children: {} },
  run: { type: "dir", children: {} },
  srv: { type: "dir", children: {} },
  sys: { type: "dir", children: {} },
  tmp: {
    type: "dir",
    children: {
      ".X11-unix": { type: "dir", children: {} },
      "scan-output.txt": { type: "file", content: "nmap scan results placeholder" },
    },
  },
  usr: {
    type: "dir",
    children: {
      bin: { type: "dir", children: {} },
      local: { type: "dir", children: {} },
      share: {
        type: "dir",
        children: {
          wordlists: {
            type: "dir",
            children: {
              "rockyou.txt": { type: "file", content: "[truncated wordlist — use ~/Downloads/wordlists/common.txt in labs]" },
            },
          },
        },
      },
    },
  },
  var: { type: "dir", children: {} },
};

function mergeDirs(a: VfsDir, b: VfsDir): VfsDir {
  if (a.type !== "dir" || b.type !== "dir") return b;
  const children = { ...a.children };
  for (const [key, node] of Object.entries(b.children)) {
    if (children[key]?.type === "dir" && node.type === "dir") {
      children[key] = mergeDirs(children[key], node);
    } else {
      children[key] = node;
    }
  }
  return { type: "dir", children };
}

function mergeRoot(extra: VfsDir["children"]): VfsDir["children"] {
  const merged: VfsDir["children"] = { ...LINUX_ROOT_DIRS };
  for (const [key, node] of Object.entries(extra)) {
    if (merged[key]?.type === "dir" && node.type === "dir") {
      merged[key] = mergeDirs(merged[key], node);
    } else {
      merged[key] = node;
    }
  }
  return merged;
}

function kaliHome(extra: VfsDir["children"] = {}): VfsDir {
  return mergeDirs(KALI_HOME_VFS, { type: "dir", children: extra });
}

function linuxVfs(homeExtras: VfsDir["children"] = {}, varLogExtras: VfsDir["children"] = {}): VfsDir {
  return {
    type: "dir",
    children: mergeRoot({
      home: {
        type: "dir",
        children: {
          kali: kaliHome(homeExtras),
        },
      },
      etc: { type: "dir", children: KALI_ETC_FILES },
      var: {
        type: "dir",
        children: {
          log: { type: "dir", children: { ...KALI_VAR_LOG, ...varLogExtras } },
          www: {
            type: "dir",
            children: {
              html: {
                type: "dir",
                children: {
                  index: { type: "file", content: "<html><body><h1>Kali training target</h1></body></html>" },
                },
              },
            },
          },
        },
      },
      opt: {
        type: "dir",
        children: {
          tools: { type: "dir", children: { readme: { type: "file", content: "Optional lab tools directory" } } },
        },
      },
    }),
  };
}

export const DEFAULT_LINUX_VFS = linuxVfs();

export const DEFAULT_NETWORK_VFS = linuxVfs({
  "research-notes.txt": {
    type: "file",
    content:
      "site:hacknology.xyz filetype:pdf\nsite:hacknology.xyz inurl:admin\nintitle:\"index of\" hacknology\nwhois hacknology.xyz\ndig hacknology.xyz MX",
  },
});

export const WEB_VFS = linuxVfs(
  {
    "requests.txt": {
      type: "file",
      content: "GET /login HTTP/1.1\nHost: app.hacknology.lab\nCookie: session=abc123",
    },
  },
  {
    www: {
      type: "dir",
      children: {
        html: {
          type: "dir",
          children: {
            index: { type: "file", content: "<html><body><h1>Training App</h1></body></html>" },
            "robots.txt": { type: "file", content: "User-agent: *\nDisallow: /admin" },
          },
        },
      },
    },
    "access.log": {
      type: "file",
      content:
        '10.0.0.5 - - [10/Jan/2026:12:00:01 +0000] "GET /login HTTP/1.1" 200 512\n10.0.0.5 - - [10/Jan/2026:12:00:02 +0000] "POST /login HTTP/1.1" 401 128\n10.0.0.9 - - [10/Jan/2026:12:05:00 +0000] "POST /login?user=admin\' OR \'1\'=\'1 HTTP/1.1" 500 64',
    },
  },
);

export const SOC_VFS = linuxVfs({
  "alert.txt": {
    type: "file",
    content: "ALERT: Brute force SSH from 203.0.113.44 — 47 failures in 10 minutes",
  },
  "incident-template.txt": {
    type: "file",
    content:
      "INCIDENT TICKET (draft)\nStatus: Investigating\nSummary:\nAffected assets:\nTimeline (UTC):\nIOCs observed:\nActions taken:\nNext steps:",
  },
});

export const FORENSICS_VFS: VfsDir = mergeDirs(linuxVfs({
  "case-notes.txt": {
    type: "file",
    content: "Case 2026-014: Suspect downloaded archive at 11:58 UTC. Preserve metadata.",
  },
}), {
  type: "dir",
  children: {
    evidence: {
      type: "dir",
      children: {
        "disk-image.dd": { type: "file", content: "[binary evidence — do not modify in place]" },
        "browser-history.csv": {
          type: "file",
          content:
            "timestamp,url\n2026-01-10T11:58:00Z,https://example.com/download\n2026-01-10T11:59:00Z,https://malware-drop.example",
        },
        "file-metadata.txt": {
          type: "file",
          content: "report.pdf | MD5: d41d8cd98f00b204e9800998ecf8427e | Created: 2026-01-10 11:55",
        },
      },
    },
  },
});

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
