import type { TerminalSessionState, VfsDir } from "@/types/lessonTerminal";
import { readFile, resolveNode, resolvePath } from "./vfs";

interface CommandResult {
  output: string;
  error?: string;
  state: TerminalSessionState;
}

interface CmdCtx {
  root: VfsDir;
  state: TerminalSessionState;
  homeDir: string;
  args: string[];
  rawCmd: string;
  history: string[];
}

function readLines(root: VfsDir, path: string): string[] | null {
  const content = readFile(root, path);
  return content ? content.split("\n") : null;
}

function filePath(ctx: CmdCtx, target?: string): string | null {
  if (!target) return null;
  return resolvePath(ctx.state.cwd, target, ctx.homeDir);
}

function pathErr(kind: string, target: string): string {
  return `${kind}: ${target}: No such file or directory`;
}

/** Additional simulated commands — returns null if not handled. */
export function tryExtendedCommand(cmd: string, ctx: CmdCtx): CommandResult | null {
  switch (cmd) {
    case "wc": {
      const fileArg = ctx.args.find((a) => !a.startsWith("-"));
      if (!fileArg) return { output: "", error: "wc: missing file operand", state: ctx.state };
      const path = filePath(ctx, fileArg);
      if (!path) return { output: "", error: pathErr("wc", fileArg), state: ctx.state };
      const lines = readLines(ctx.root, path);
      if (!lines) return { output: "", error: pathErr("wc", fileArg), state: ctx.state };
      const words = lines.join("\n").split(/\s+/).filter(Boolean).length;
      return { output: `  ${lines.length}  ${words} ${lines.join("\n").length} ${fileArg}`, state: ctx.state };
    }

    case "sort":
    case "uniq": {
      const fileArg = ctx.args.find((a) => !a.startsWith("-"));
      if (!fileArg) return { output: "", error: `${cmd}: missing file operand`, state: ctx.state };
      const path = filePath(ctx, fileArg);
      const lines = path ? readLines(ctx.root, path) : null;
      if (!lines) return { output: "", error: pathErr(cmd, fileArg), state: ctx.state };
      let out = lines;
      if (cmd === "sort") out = [...lines].sort();
      if (cmd === "uniq") out = [...new Set(lines)];
      return { output: out.join("\n"), state: ctx.state };
    }

    case "cut": {
      const fileArg = ctx.args.filter((a) => !a.startsWith("-")).pop();
      if (!fileArg) return { output: "", error: "cut: missing file operand", state: ctx.state };
      const path = filePath(ctx, fileArg);
      const lines = path ? readLines(ctx.root, path) : null;
      if (!lines) return { output: "", error: pathErr("cut", fileArg), state: ctx.state };
      const delim = ctx.args.find((a) => a.startsWith("-d"))?.slice(2) ?? ":";
      const field = Number.parseInt(ctx.args.find((a) => a.startsWith("-f"))?.replace(/\D/g, "") ?? "1", 10);
      return {
        output: lines.map((l) => l.split(delim)[field - 1] ?? l).join("\n"),
        state: ctx.state,
      };
    }

    case "awk": {
      const fileArg = ctx.args.filter((a) => !a.startsWith("-")).pop();
      if (!fileArg) return { output: "", error: "awk: missing file operand", state: ctx.state };
      const path = filePath(ctx, fileArg);
      const lines = path ? readLines(ctx.root, path) : null;
      if (!lines) return { output: "", error: pathErr("awk", fileArg), state: ctx.state };
      return { output: lines.map((l) => l.split(/\s+/)[0]).join("\n"), state: ctx.state };
    }

    case "file": {
      const target = ctx.args[0];
      if (!target) return { output: "", error: "file: missing operand", state: ctx.state };
      const path = filePath(ctx, target);
      const node = path ? resolveNode(ctx.root, path) : null;
      if (!node) return { output: "", error: pathErr("file", target), state: ctx.state };
      if (node.type === "dir") return { output: `${target}: directory`, state: ctx.state };
      return { output: `${target}: ASCII text`, state: ctx.state };
    }

    case "stat": {
      const target = ctx.args[0];
      if (!target) return { output: "", error: "stat: missing operand", state: ctx.state };
      const path = filePath(ctx, target);
      const node = path ? resolveNode(ctx.root, path) : null;
      if (!node) return { output: "", error: pathErr("stat", target), state: ctx.state };
      const kind = node.type === "dir" ? "directory" : "regular file";
      return {
        output: `  File: ${path}\n  Size: 4096\tBlocks: 8\tIO Block: 4096\t${kind}`,
        state: ctx.state,
      };
    }

    case "which":
    case "type":
    case "whereis": {
      const name = ctx.args[0];
      if (!name) return { output: "", state: ctx.state };
      const builtins = new Set(["pwd", "cd", "echo", "cat", "ls", "grep", "whoami", "id"]);
      if (builtins.has(name)) {
        if (cmd === "whereis") return { output: `${name}: /usr/bin/${name} /usr/share/man/man1/${name}.1.gz`, state: ctx.state };
        return { output: cmd === "type" ? `${name} is a shell builtin` : `/usr/bin/${name}`, state: ctx.state };
      }
      return { output: "", state: ctx.state };
    }

    case "uptime":
      return {
        output: ` 12:00:01 up 2 days,  4:15,  1 user,  load average: 0.08, 0.04, 0.01`,
        state: ctx.state,
      };

    case "w":
    case "who":
      return {
        output: `kali   pts/0        2026-01-10 12:00 (127.0.0.1)`,
        state: ctx.state,
      };

    case "free":
      return {
        output: "               total        used        free      shared  buff/cache   available\nMem:         8123456     2345678     4123456       123456     1654322     5432109\nSwap:        4194300           0     4194300",
        state: ctx.state,
      };

    case "df":
      return {
        output:
          "Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1       50331648 8123456  39678912  17% /\ntmpfs            4061728       0   4061728   0% /dev/shm",
        state: ctx.state,
      };

    case "du": {
      const target = ctx.args.find((a) => !a.startsWith("-")) ?? ".";
      const path = filePath(ctx, target) ?? ctx.state.cwd;
      return { output: `4096\t${path}`, state: ctx.state };
    }

    case "lsblk":
      return {
        output:
          "NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nsda      8:0    0   48G  0 disk \n├─sda1   8:1    0   47G  0 part /\n└─sda2   8:2    0  976M  0 part [SWAP]",
        state: ctx.state,
      };

    case "traceroute":
    case "tracert": {
      const host = ctx.args.find((a) => !a.startsWith("-")) ?? "127.0.0.1";
      return {
        output:
          `traceroute to ${host} (${host}), 30 hops max, 60 byte packets\n 1  gateway (192.168.56.1)  0.412 ms  0.389 ms  0.401 ms\n 2  ${host} (${host})  1.102 ms  1.089 ms  1.095 ms`,
        state: ctx.state,
      };
    }

    case "arp":
      return {
        output: "Address                  HWtype  HWaddress           Flags Mask            Iface\n192.168.56.1             ether   52:54:00:12:34:56   C                     eth0",
        state: ctx.state,
      };

    case "route":
      return {
        output:
          "Kernel IP routing table\nDestination     Gateway         Genmask         Flags Metric Ref    Use Iface\ndefault         192.168.56.1    0.0.0.0         UG    100    0        0 eth0\n192.168.56.0    0.0.0.0         255.255.255.0   U     100    0        0 eth0",
        state: ctx.state,
      };

    case "journalctl":
      return {
        output:
          "Jan 10 12:00:00 Kali systemd[1]: Started Session 42 of user kali.\nJan 10 12:00:01 Kali sshd[1301]: Accepted publickey for kali from 10.0.0.5 port 52234",
        state: ctx.state,
      };

    case "dmesg":
      return {
        output: "[    0.000000] Linux version 6.6.9-kali1-amd64 (debian-kernel@lists.debian.org)\n[    0.012345] Command line: BOOT_IMAGE=/boot/vmlinuz quiet",
        state: ctx.state,
      };

    case "systemctl": {
      const sub = ctx.args[0];
      const unit = ctx.args[1] ?? "ssh.service";
      if (sub === "status") {
        return {
          output: `● ${unit} - OpenBSD Secure Shell server\n     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; preset: enabled)\n     Active: active (running) since Sat 2026-01-10 12:00:00 UTC; 2 days ago`,
          state: ctx.state,
        };
      }
      return { output: `Unknown operation ${sub} for systemctl in this lab shell.`, state: ctx.state };
    }

    case "sudo":
      return {
        output: "",
        error: "kali is not in the sudoers file.  This incident will be reported.",
        state: ctx.state,
      };

    case "su":
      return { output: "", error: "su: Authentication failure", state: ctx.state };

    case "touch":
    case "mkdir":
      return { output: "", state: ctx.state };

    case "rm":
      return { output: "", state: ctx.state };

    case "cp":
    case "mv":
    case "ln":
      return { output: "", state: ctx.state };

    case "chmod":
    case "chown":
      return { output: "", error: `${cmd}: changing permissions of '${ctx.args[0] ?? "file"}': Operation not permitted`, state: ctx.state };

    case "python3":
    case "python":
      if (ctx.args.includes("--version") || ctx.args.length === 0) {
        return { output: "Python 3.11.7", state: ctx.state };
      }
      return { output: "", error: "python3: simulated lab shell — interactive interpreter not available", state: ctx.state };

    case "git":
      return { output: "", error: "fatal: not a git repository (or any of the parent directories): .git", state: ctx.state };

    case "man":
      return { output: "", error: `No manual entry for ${ctx.args[0] ?? "command"}`, state: ctx.state };

    case "less":
    case "more":
      return { output: "", error: `${cmd}: interactive pager not available in browser lab — use cat, head, or tail`, state: ctx.state };

    case "apt":
    case "apt-get":
      return {
        output: "",
        error: "E: This is a simulated training shell — package manager operations are not executed.",
        state: ctx.state,
      };

    case "history": {
      const list = ctx.history.map((c, i) => `  ${i + 1}  ${c}`).join("\n");
      return { output: list || "", state: ctx.state };
    }

    case "reboot":
    case "shutdown":
    case "poweroff":
      return { output: "", error: `${cmd}: simulated lab shell — system control commands are disabled`, state: ctx.state };

    case "base64": {
      const fileArg = ctx.args.find((a) => !a.startsWith("-"));
      if (!fileArg) return { output: "", error: "base64: missing file operand", state: ctx.state };
      const path = filePath(ctx, fileArg);
      const content = path ? readFile(ctx.root, path) : null;
      if (content === null) return { output: "", error: pathErr("base64", fileArg), state: ctx.state };
      return { output: btoa(content), state: ctx.state };
    }

    case "xxd": {
      const fileArg = ctx.args.find((a) => !a.startsWith("-"));
      if (!fileArg) return { output: "", error: "xxd: missing file operand", state: ctx.state };
      const path = filePath(ctx, fileArg);
      const content = path ? readFile(ctx.root, path) : null;
      if (content === null) return { output: "", error: pathErr("xxd", fileArg), state: ctx.state };
      return { output: `00000000: 4861636b 6e6f6c6f 67792074 7261696e  Hacknology train`, state: ctx.state };
    }

    case "iptables":
      return {
        output: "Chain INPUT (policy ACCEPT)\nChain FORWARD (policy ACCEPT)\nChain OUTPUT (policy ACCEPT)",
        state: ctx.state,
      };

    case "nc":
    case "netcat":
      return { output: "", error: "nc: simulated lab shell — use ss or nmap for connectivity exercises", state: ctx.state };

    default:
      return null;
  }
}
