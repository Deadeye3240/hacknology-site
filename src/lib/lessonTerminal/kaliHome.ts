import type { VfsDir } from "@/types/lessonTerminal";

/** Shared /home/kali tree used across Linux lab filesystems. */
export const KALI_HOME_VFS: VfsDir = {
  type: "dir",
  children: {
    ".bashrc": {
      type: "file",
      content:
        "# ~/.bashrc: executed by bash(1) for non-login shells.\nexport PS1='\\[\\e[1;32m\\]\\u@\\[\\e[1;34m\\]\\h\\[\\e[0m\\]:\\[\\e[1;34m\\]\\w\\[\\e[0m\\]\\$ '\nexport PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    },
    ".profile": {
      type: "file",
      content: "export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    },
    ".zshrc": {
      type: "file",
      content: "# Kali default zsh config\nexport PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    },
    ".bash_history": {
      type: "file",
      content: "pwd\nls -la\ncd /var/log\ncat auth.log\nwhoami",
    },
    "notes.txt": {
      type: "file",
      content: "Remember: only run commands you understand in authorized lab environments.",
    },
    "sample-alert.txt": {
      type: "file",
      content:
        "ALERT: Multiple failed SSH logins from 203.0.113.44 against prod-web-01 (47 attempts / 10 min).\nSeverity: Medium\nAction: Review auth logs for successful logins from same IP.",
    },
    Desktop: { type: "dir", children: {} },
    Documents: {
      type: "dir",
      children: {
        "lab-notes.md": {
          type: "file",
          content: "# Lab notes\n- Always `pwd` before `cat` on relative paths\n- Auth evidence lives in /var/log/auth.log",
        },
      },
    },
    Downloads: {
      type: "dir",
      children: {
        "wordlists": {
          type: "dir",
          children: {
            "common.txt": {
              type: "file",
              content: "admin\nroot\ntest\nuser\npassword\n123456",
            },
          },
        },
      },
    },
    scripts: {
      type: "dir",
      children: {
        "lab-readme.md": {
          type: "file",
          content: "# Lab scripts\nUse pwd and ls before running anything destructive.",
        },
        "check-logs.sh": {
          type: "file",
          content: "#!/bin/bash\ntail -n 20 /var/log/auth.log",
        },
      },
    },
    tools: {
      type: "dir",
      children: {
        "recon-notes.txt": {
          type: "file",
          content: "nmap -sV target\nss -tulpn\ngrep Failed /var/log/auth.log",
        },
      },
    },
  },
};

export const KALI_ETC_FILES: VfsDir["children"] = {
  hostname: { type: "file", content: "Kali" },
  issue: { type: "file", content: "Kali GNU/Linux Rolling \\n \\l\n" },
  motd: {
    type: "file",
    content:
      "Kali GNU/Linux Rolling — https://www.kali.org/\n\nAuthorized training environment only.",
  },
  passwd: {
    type: "file",
    content:
      "root:x:0:0:root:/root:/bin/bash\nkali:x:1000:1000:Kali,,,:/home/kali:/bin/zsh\nstudent:x:1001:1001:Student,,,:/home/student:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\npostgres:x:109:112:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash",
  },
  group: {
    type: "file",
    content: "root:x:0:\nkali:x:1000:\nstudent:x:1001:\nwww-data:x:33:\nadm:x:4:kali",
  },
  "resolv.conf": { type: "file", content: "nameserver 1.1.1.1\nsearch kali.lab" },
  hosts: { type: "file", content: "127.0.0.1 localhost Kali\n127.0.1.1 Kali\n10.10.10.25 training-target" },
  "os-release": {
    type: "file",
    content:
      'PRETTY_NAME="Kali GNU/Linux Rolling"\nNAME="Kali GNU/Linux"\nID=kali\nVERSION_ID="2024.4"\nHOME_URL="https://www.kali.org/"',
  },
};

export const KALI_VAR_LOG: VfsDir["children"] = {
  "auth.log": {
    type: "file",
    content:
      "Jan 10 12:00:01 sshd[1204]: Accepted publickey for kali from 10.0.0.5 port 52234 ssh2: ED25519\nJan 10 12:04:11 sudo: kali : TTY=pts/0 ; PWD=/home/kali ; USER=root ; COMMAND=/bin/ls\nJan 10 12:10:02 sshd[1204]: Failed password for invalid user admin from 203.0.113.44 port 52234 ssh2\nJan 10 12:10:03 sshd[1204]: Failed password for invalid user root from 203.0.113.44 port 52234 ssh2\nJan 10 12:10:04 sshd[1204]: Failed password for kali from 203.0.113.44 port 52234 ssh2",
  },
  syslog: {
    type: "file",
    content:
      "Jan 10 12:00:00 Kali systemd[1]: Started Session 42 of user kali.\nJan 10 12:00:01 Kali systemd[1]: Started OpenBSD Secure Shell server.",
  },
  "kern.log": {
    type: "file",
    content: "Jan 10 11:59:00 Kali kernel: [    0.000000] Linux version 6.6.9-kali1-amd64",
  },
  "dpkg.log": {
    type: "file",
    content: "2026-01-10 11:30:00 status installed nmap:amd64 7.94+dfsg1-1kali1",
  },
  nginx: {
    type: "dir",
    children: {
      "access.log": {
        type: "file",
        content:
          '127.0.0.1 - - [10/Jan/2026:12:00:01 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/8.5.0"',
      },
      "error.log": { type: "file", content: "2026/01/10 12:00:00 [notice] 1402#1402: start worker processes" },
    },
  },
  apt: {
    type: "dir",
    children: {
      "history.log": {
        type: "file",
        content: "Start-Date: 2026-01-10  11:00:00\nInstall: nmap:amd64 (7.94+dfsg1-1kali1)\nEnd-Date: 2026-01-10  11:00:15",
      },
    },
  },
};
