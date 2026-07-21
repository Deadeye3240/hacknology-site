import { paths } from "@/routes/paths";
import { createLesson, mcQuiz, tfQuiz } from "../lessonFactory";

const PATH = "linux";

export const linuxLessons = [
  createLesson({
    id: "linux-filesystem",
    pathId: PATH,
    order: 1,
    title: "Linux Filesystem",
    summary:
      "The Filesystem Hierarchy Standard, inodes, mount points, and how Linux organizes everything as a file — the mental model defenders use daily.",
    objectives: [
      "Describe the purpose of the FHS and key top-level directories",
      "Explain inodes, blocks, and how paths resolve to disk data",
      "Identify where logs, configs, and user data typically live",
    ],
    introduction:
      "Linux treats nearly everything — disks, devices, processes, and network sockets — through a unified filesystem interface. Security analysts investigating breaches, administrators hardening servers, and penetration testers enumerating targets all need to navigate this hierarchy fluently. Knowing that /etc holds configuration, /var/log holds logs, and /tmp is world-writable helps you find evidence, misconfigurations, and persistence in minutes instead of hours.",
    coreConcepts: [
      "/ is the root of the entire directory tree; all other paths descend from here.",
      "FHS defines standard locations: /bin and /sbin for essential binaries, /etc for configuration, /home for user data, /var for variable data like logs.",
      "Inodes store metadata (permissions, timestamps, block pointers); filenames are directory entries pointing to inodes.",
      "Mount points attach separate filesystems (/boot, /home, network shares) into the tree.",
      "Special filesystems like proc and sysfs expose kernel and process information as virtual files.",
    ],
    explanation:
      "When you open /etc/passwd, the kernel walks the path: root inode → etc directory entry → passwd file inode → data blocks on disk. Hard links share an inode; symbolic links store a path string. Separate partitions limit damage — filling /var/log should not crash the root filesystem if /var is mounted separately. Attackers drop webshells in /tmp or /dev/shm; defenders grep /var/log/auth.log for SSH brute force. Container images slim down to only needed paths; understanding FHS tells you what can be removed safely.",
    realWorld:
      "Incident responders search /var/log, /home/*/.bash_history, and /tmp for attacker artifacts. Ransomware targets /home and mounted shares. Misconfigured world-writable cron scripts in /etc/cron.d enable privilege escalation. Disk forensics recovers deleted files by inode until blocks are overwritten.",
    scenario:
      "A compromised web server runs as www-data. You find a suspicious script in /tmp/.x.sh and modified configs under /etc/apache2/. Map each path to its FHS role and explain why the attacker chose those locations.",
    practical: [
      {
        kind: "code",
        title: "Inspect inode and mount info",
        content:
          "ls -li /etc/passwd    # inode number\nstat /etc/passwd      # blocks, timestamps\ndf -h                 # filesystem usage\nmount | column -t     # active mounts",
      },
    ],
    terms: [
      { term: "FHS", definition: "Filesystem Hierarchy Standard — convention for directory layout on Linux systems." },
      { term: "Inode", definition: "Data structure storing file metadata and pointers to data blocks; each file has one inode number per filesystem." },
      { term: "Mount point", definition: "Directory where a filesystem is attached into the unified tree." },
      { term: "procfs", definition: "Virtual filesystem at /proc exposing kernel and process information." },
    ],
    mistakes: [
      "Storing sensitive data in /tmp assuming it is private — it is often world-readable and cleared on reboot.",
      "Running out of inode capacity even when disk space appears free (many small files).",
      "Editing files in /proc or /sys expecting changes to persist across reboots.",
    ],
    defensive: [
      "Separate /, /var, and /home on different partitions or volumes to contain failures.",
      "Monitor disk and inode usage; alert before logs fill the filesystem.",
      "Restrict write access to critical directories like /etc and cron paths.",
    ],
    quiz: [
      mcQuiz(
        "linux-fs-q1",
        "Which directory typically contains system configuration files?",
        ["/home", "/etc", "/bin", "/dev"],
        1,
        "/etc is the standard location for host-specific configuration on Linux.",
      ),
      tfQuiz(
        "linux-fs-q2",
        "Inodes store the human-readable filename of a file.",
        false,
        "Filenames live in directory entries; inodes store metadata and block pointers.",
      ),
      mcQuiz(
        "linux-fs-q3",
        "The /var directory is primarily used for:",
        ["Static boot files", "Variable data like logs and caches", "User home directories", "Kernel modules only"],
        1,
        "/var holds data that changes during operation — logs, mail spools, caches.",
      ),
    ],
  }),

  createLesson({
    id: "linux-terminal-navigation",
    pathId: PATH,
    order: 2,
    title: "Terminal Navigation",
    summary:
      "pwd, cd, ls, tab completion, and path syntax — moving efficiently through the shell without a GUI.",
    objectives: [
      "Navigate the filesystem using absolute and relative paths",
      "Use ls options to reveal permissions, sizes, and hidden files",
      "Apply tab completion and history to work faster and more accurately",
    ],
    introduction:
      "The terminal is the primary interface on servers, cloud instances, and containers. GUIs are often disabled or absent in production. Fast, accurate navigation lets you triage incidents, audit permissions, and run tools without leaking typos into production commands. Every path you type is either absolute (starts with /) or relative to your current working directory.",
    coreConcepts: [
      "pwd prints the current working directory; cd changes it; cd .. goes up one level; cd ~ returns home.",
      "ls lists directory contents; -l long format, -a all including dotfiles, -h human-readable sizes.",
      "Absolute paths start from /; relative paths start from the current directory.",
      ". means current directory; .. means parent directory.",
      "Tab completion reduces errors; history (up arrow, Ctrl+R) recalls prior commands.",
    ],
    explanation:
      "After SSH into a host, pwd might show /home/analyst. cd /var/log moves absolutely regardless of current location. cd ../apache2 from /var/log/nginx reaches /var/apache2 if it exists. ls -la reveals hidden SSH keys (.ssh), shell profiles (.bashrc), and permission bits. The prompt often shows user@host:path$. Understanding ~user syntax (another user's home) and - (previous directory) speeds pivoting during investigations.",
    realWorld:
      "SOC analysts tail logs under /var/log during alerts. Pentesters enumerate /home and /opt after foothold. Admins use cd - to bounce between config and log directories. Scripting uses pushd/popd or explicit absolute paths for reliability.",
    scenario:
      "You land in / after login. List hidden files in root's home, then navigate to systemd journal logs without using a GUI. Which commands and paths do you use?",
    practical: [
      {
        kind: "code",
        title: "Navigation essentials",
        content:
          "pwd\nls -lah\ncd /var/log\nls -lt | head    # newest files first\ncd -\nls ~analyst/.ssh",
      },
    ],
    terms: [
      { term: "CWD", definition: "Current Working Directory — the directory relative paths resolve against." },
      { term: "Dotfile", definition: "Hidden file or directory whose name begins with a period." },
      { term: "Tab completion", definition: "Shell feature that completes commands and paths when you press Tab." },
    ],
    mistakes: [
      "Using cd /var/log when already there with a typo that lands in a wrong path.",
      "Forgetting -a on ls and missing .ssh or attacker hidden directories.",
      "Relying on relative paths in scripts that may run from unexpected directories.",
    ],
    defensive: [
      "Use absolute paths in automation and incident runbooks to avoid ambiguity.",
      "Alias ls -la for interactive sessions to habitually see permissions and hidden files.",
      "Document standard log and config paths per distribution in your playbooks.",
    ],
    quiz: [
      mcQuiz(
        "linux-nav-q1",
        "Which command prints your current working directory?",
        ["cd", "pwd", "ls", "whoami"],
        1,
        "pwd (print working directory) shows the full path of the current directory.",
      ),
      mcQuiz(
        "linux-nav-q2",
        "To list hidden files you should use:",
        ["ls -h", "ls -a", "ls -R", "ls -t"],
        1,
        "The -a flag includes entries starting with a dot.",
      ),
      tfQuiz(
        "linux-nav-q3",
        "An absolute path always begins with a forward slash /.",
        true,
        "Absolute paths start at the filesystem root; relative paths do not.",
      ),
    ],
  }),

  createLesson({
    id: "linux-files-directories",
    pathId: PATH,
    order: 3,
    title: "Files and Directories",
    summary:
      "Creating, copying, moving, viewing, and searching files — the file operations underpinning every Linux investigation.",
    objectives: [
      "Create and remove files and directories safely",
      "View file contents with cat, less, head, and tail",
      "Search file contents and names with grep and find",
    ],
    introduction:
      "Investigations are mostly reading and searching files: configs, logs, scripts, and malware droppers. Administrators manage deployments by copying binaries and rotating logs. Mastering basic file operations — and their destructive counterparts — prevents accidental data loss and speeds analysis.",
    coreConcepts: [
      "touch creates empty files or updates timestamps; mkdir creates directories; rm removes files; rmdir removes empty directories.",
      "cp copies; mv moves or renames; use -r for recursive directory operations.",
      "cat dumps full files; less pages interactively; head/tail show start/end (tail -f follows growing logs).",
      "grep searches text patterns; find locates files by name, type, size, or time.",
      "Redirection: > overwrite, >> append; pipes | send output to another command.",
    ],
    explanation:
      "To hunt IOCs: grep -r 'malware.domain' /var/www 2>/dev/null searches recursively while suppressing permission errors. find / -name '*.php' -mtime -1 finds PHP files modified in the last day. cp -a preserves permissions and timestamps during evidence collection. rm -rf is irreversible on many systems — triple-check paths. For large logs, tail -n 500 auth.log or journalctl -u ssh --since today focuses the window.",
    realWorld:
      "Forensics copies disk images with dd or specialized tools, then mounts read-only. DevOps uses rsync for sync (beyond cp). Attackers use find -writable to discover hijackable scripts. Blue teams grep for webshell signatures across web roots.",
    scenario:
      "Auth.log grew to 10 GB. You need the last 200 SSH failures without opening the whole file in an editor. Which commands help?",
    practical: [
      {
        kind: "code",
        title: "Search and tail",
        content:
          "grep 'Failed password' /var/log/auth.log | tail -n 200\nfind /etc -type f -name '*.conf' 2>/dev/null\nless +G /var/log/syslog   # jump to end",
      },
    ],
    terms: [
      { term: "Recursive", definition: "Operating on a directory and all nested contents (-r flag)." },
      { term: "Pipe", definition: "Shell operator | passing stdout of one command as stdin to the next." },
      { term: "Inode timestamp", definition: "atime, mtime, ctime — access, modification, metadata change times." },
    ],
    mistakes: [
      "Running rm -rf / or rm -rf * from wrong directory — catastrophic.",
      "grep without -i misses case variants; without -r misses nested dirs.",
      "Editing evidence files in place instead of working on copies.",
    ],
    defensive: [
      "Use trash-cli or backups before bulk deletes; restrict rm aliases on production jump hosts.",
      "Log rotation (logrotate) prevents unbounded growth in /var/log.",
      "Work on forensic copies; document chain of custody.",
    ],
    quiz: [
      mcQuiz(
        "linux-fd-q1",
        "Which command follows a log file as new lines are written?",
        ["head -f", "tail -f", "cat -f", "less -r"],
        1,
        "tail -f (follow) displays appended lines in real time.",
      ),
      mcQuiz(
        "linux-fd-q2",
        "To search recursively for a string in files under /var/log:",
        ["find only", "grep -r 'pattern' /var/log", "cd only", "mv"],
        1,
        "grep -r searches file contents recursively through directories.",
      ),
      tfQuiz(
        "linux-fd-q3",
        "mv can rename a file without changing its inode on the same filesystem.",
        true,
        "Renaming updates the directory entry; the inode often stays the same within one filesystem.",
      ),
    ],
  }),

  createLesson({
    id: "linux-permissions",
    pathId: PATH,
    order: 4,
    title: "Permissions",
    summary:
      "chmod, chown, umask, and special bits — who can read, write, and execute files on Linux.",
    objectives: [
      "Interpret ls -l permission strings and octal notation",
      "Apply chmod and chown to fix ownership and access issues",
      "Explain setuid, setgid, and sticky bit security implications",
    ],
    introduction:
      "Linux discretionary access control is built on owner, group, and other permission triples for read (r), write (w), and execute (x). Misconfigured permissions cause data leaks, privilege escalation, and compliance failures. Every chmod and chown decision is a security decision.",
    coreConcepts: [
      "r=4, w=2, x=1 in octal; chmod 640 file is rw- r-- ---.",
      "Directories need x to enter; r to list; w to create/delete entries (with x).",
      "chown changes owner and group; only root can give away files arbitrarily.",
      "umask subtracts default bits on new files (common 022 → files 644, dirs 755).",
      "setuid (s on user x) runs binary as owner; setgid on dir sets group inheritance; sticky bit on /tmp restricts deletion to owner.",
    ],
    explanation:
      "A script owned by root with chmod 4755 (setuid) runs as root when executed by anyone — classic escalation vector if the script is flawed. World-writable /etc/passwd would let anyone add an admin user. ls -l shows drwxr-xr-x: type d, owner rwx, group r-x, other r-x. ACLs (getfacl/setfacl) extend permissions beyond the triple. Principle of least privilege: web content 644, private keys 600, directories 755 or 750.",
    realWorld:
      "find / -perm -4000 2>/dev/null lists setuid binaries for pentest checks. Docker volumes with wrong UID mapping break apps. chmod 777 is a red flag in audits. CIS benchmarks specify minimum permission baselines.",
    scenario:
      "A PHP upload directory is drwxrwxrwx. Explain two attack scenarios this enables and the permissions you would set instead.",
    practical: [
      {
        kind: "code",
        title: "Permission inspection",
        content:
          "ls -l /etc/shadow\nstat -c '%a %U %G' /etc/passwd\nfind /usr/bin -perm -4000 -ls 2>/dev/null",
      },
    ],
    terms: [
      { term: "DAC", definition: "Discretionary Access Control — file owner decides permissions." },
      { term: "setuid", definition: "Permission bit causing program to run with file owner's privileges." },
      { term: "umask", definition: "Mask subtracted from default permissions when creating new files." },
    ],
    mistakes: [
      "chmod 777 to 'fix' permission errors instead of correct ownership.",
      "Leaving setuid shells or editors on the system.",
      "Forgetting that group membership affects effective access to group-readable files.",
    ],
    defensive: [
      "Regularly audit setuid/setgid binaries against known-good baselines.",
      "Use groups for shared access instead of world-readable secrets.",
      "Apply CIS or STIG hardening guides for permission standards.",
    ],
    quiz: [
      mcQuiz(
        "linux-perm-q1",
        "Octal permission 755 means:",
        ["rw-r--r--", "rwxr-xr-x", "rwx------", "rw-rw-rw-"],
        1,
        "7=rwx owner, 5=r-x group, 5=r-x other.",
      ),
      mcQuiz(
        "linux-perm-q2",
        "The setuid bit on an executable primarily affects:",
        ["File rename speed", "Effective user when the program runs", "Network ports", "DNS"],
        1,
        "Setuid causes the process to run with the file owner's privileges.",
      ),
      tfQuiz(
        "linux-perm-q3",
        "Private SSH keys should typically be mode 600.",
        true,
        "600 (rw-------) ensures only the owner can read and write the key.",
      ),
    ],
  }),

  createLesson({
    id: "linux-users-groups",
    pathId: PATH,
    order: 5,
    title: "Users and Groups",
    summary:
      "/etc/passwd, /etc/shadow, groups, sudo, and how Linux maps identities to process privileges.",
    objectives: [
      "Explain how passwd and shadow store user account data",
      "Manage users and groups with useradd, usermod, and groupmod",
      "Describe how sudo grants elevated privileges and why it is audited",
    ],
    introduction:
      "Every process runs as a user. Root (UID 0) bypasses most permission checks. Attackers who gain a shell want to become root or another privileged account. Defenders manage accounts, enforce sudo policies, and monitor /etc/passwd and /etc/shadow for unauthorized changes.",
    coreConcepts: [
      "/etc/passwd lists usernames, UID, GID, home, shell — historically held password hash, now usually x.",
      "/etc/shadow stores hashed passwords and aging; readable only by root.",
      "/etc/group defines group names and member lists; supplementary groups from /etc/group and usermod -aG.",
      "useradd, usermod, passwd, groupadd manage accounts; id and groups show current identity.",
      "sudo executes commands as another user per /etc/sudoers; all invocations should be logged.",
    ],
    explanation:
      "When you SSH as analyst, the sshd child runs as your UID. Files you create inherit your user and primary group unless setgid applies. sudo -u www-data command runs as www-data. NOPASSWD entries in sudoers are escalation targets. LDAP/SSSD integrate central directories; local files still matter on workstations. Locked accounts use ! or * in shadow. Service accounts often have /usr/sbin/nologin shells.",
    realWorld:
      "Brute force targets SSH users listed in auth.log. Credential stuffing hits sudo after password compromise. CIS requires separate admin accounts. Incident response disables compromised users and rotates keys immediately.",
    scenario:
      "A new contractor needs read access to /opt/app/logs owned by group appops. Outline user and group steps without giving them sudo.",
    terms: [
      { term: "UID", definition: "Numeric user identifier; 0 is root." },
      { term: "Primary group", definition: "Default group for new files; stored in passwd entry." },
      { term: "sudoers", definition: "Configuration file defining who may run which commands as which users." },
    ],
    mistakes: [
      "Sharing root password instead of individual sudo accounts.",
      "Adding users to sudo or docker group without understanding full privilege impact.",
      "Leaving default accounts with weak passwords enabled.",
    ],
    defensive: [
      "Individual accounts, no shared credentials; disable unused accounts.",
      "MFA for SSH; key-based auth; fail2ban or rate limits.",
      "Audit sudo logs and alert on unusual privilege use.",
    ],
    quiz: [
      mcQuiz(
        "linux-ug-q1",
        "Which file stores password hashes on modern Linux?",
        ["/etc/passwd", "/etc/shadow", "/etc/hosts", "/etc/motd"],
        1,
        "/etc/shadow holds hashed passwords and is restricted to root.",
      ),
      tfQuiz(
        "linux-ug-q2",
        "UID 0 always corresponds to the root account.",
        true,
        "Root is defined as UID 0 in Linux.",
      ),
      mcQuiz(
        "linux-ug-q3",
        "sudo is primarily used to:",
        ["Format disks", "Run commands with elevated privileges as another user", "Configure DNS", "Compile kernels only"],
        1,
        "sudo allows authorized users to execute commands as root or other users per policy.",
      ),
    ],
  }),

  createLesson({
    id: "linux-processes",
    pathId: PATH,
    order: 6,
    title: "Processes",
    summary:
      "ps, top, signals, and parent-child relationships — seeing what runs on a system and stopping malicious activity.",
    objectives: [
      "List and filter processes with ps and pgrep",
      "Monitor live resource usage with top or htop",
      "Send signals to terminate or reload processes safely",
    ],
    introduction:
      "Malware, miners, and reverse shells appear as processes. Legitimate services do too. Analysts correlate PIDs with network connections, files open, and user context. Knowing how to inspect and control processes is essential for live response without rebooting evidence away.",
    coreConcepts: [
      "Every running program is a process with a PID; PPID is parent; init/systemd is PID 1.",
      "ps aux or ps -ef lists processes; pgrep/pkill match by name.",
      "top/htop show CPU, memory, and sort interactively.",
      "kill sends signals: SIGTERM (15) graceful, SIGKILL (9) force, SIGHUP (1) reload configs.",
      "Background jobs: & to background; fg/bg; nohup survives terminal close.",
    ],
    explanation:
      "ps -u www-data shows web server workers. lsof -p PID lists open files and sockets. /proc/PID/ exposes cmdline, environ, fd — live forensics without special tools. Zombie processes (Z state) await parent wait(); defunct but clutter ps. Kill tree carefully: killing parent may orphan children. Containers share host kernel; ps on host sees container processes.",
    realWorld:
      "Cryptominers show high CPU in top. Incident responders kill malicious PIDs then hunt persistence. kill -9 as first resort can corrupt databases; try SIGTERM first. EDR agents hook process creation for telemetry.",
    scenario:
      "You find an unknown process python3 -c 'import socket...' running as www-data. Which commands reveal its parent, open ports, and command line?",
    practical: [
      {
        kind: "code",
        title: "Process inspection",
        content:
          "ps aux | grep -v grep | grep python\nps -ef --forest\nls -l /proc/1234/exe\ncat /proc/1234/cmdline | tr '\\0' ' '\nkill -15 1234",
      },
    ],
    terms: [
      { term: "PID", definition: "Process Identifier — unique number for a running process on the system." },
      { term: "Signal", definition: "Software interrupt delivered to a process (e.g. SIGTERM, SIGKILL)." },
      { term: "Zombie", definition: "Terminated child process entry waiting for parent to read exit status." },
    ],
    mistakes: [
      "kill -9 on databases or mail queues without understanding data loss risk.",
      "Trusting process names only — malware masquerades as [kworker] or systemd.",
      "Ignoring parent process when killing malware that respawns from cron.",
    ],
    defensive: [
      "Baseline normal process trees per role; alert on deviations.",
      "Use read-only /proc access policies where EDR provides richer telemetry.",
      "Document graceful shutdown procedures for critical services.",
    ],
    quiz: [
      mcQuiz(
        "linux-proc-q1",
        "Which signal forcefully terminates a process without cleanup?",
        ["SIGHUP (1)", "SIGTERM (15)", "SIGKILL (9)", "SIGCONT (18)"],
        2,
        "SIGKILL (9) cannot be caught and stops the process immediately.",
      ),
      mcQuiz(
        "linux-proc-q2",
        "Process ID 1 on a modern Linux system is typically:",
        ["sshd", "systemd or init", "bash", "cron"],
        1,
        "PID 1 is the first userspace process — systemd on most distributions.",
      ),
      tfQuiz(
        "linux-proc-q3",
        "/proc/PID/cmdline shows the command used to start the process.",
        true,
        "cmdline in procfs contains the executable path and arguments.",
      ),
    ],
  }),

  createLesson({
    id: "linux-services",
    pathId: PATH,
    order: 7,
    title: "Services",
    summary:
      "systemd units, enable/start/stop, journalctl, and managing daemons that listen on the network.",
    objectives: [
      "Inspect service status with systemctl",
      "Enable and disable services at boot",
      "Read service logs with journalctl",
    ],
    introduction:
      "Long-running daemons — sshd, nginx, databases — are managed as services. systemd is the dominant init on modern distributions. Misconfigured services expose ports; failed units break availability. Security hardening disables unnecessary services and reviews unit files for unsafe directives.",
    coreConcepts: [
      "systemctl status sshd shows active state and recent log lines.",
      "systemctl start|stop|restart|reload controls the unit now.",
      "systemctl enable|disable controls whether the unit starts at boot.",
      "Unit files live in /etc/systemd/system and /usr/lib/systemd/system.",
      "journalctl -u nginx.service views logs for a specific unit.",
    ],
    explanation:
      "After package install, nginx may be enabled but not started — or the reverse. systemctl list-units --type=service shows running services. Attackers enable reverse-shell systemd units for persistence. Review ExecStart= lines for unexpected binaries. socket units activate services on demand (e.g. ssh.socket). Failed units leave clues in journalctl -p err.",
    realWorld:
      "CIS benchmarks list services to disable (cups, avahi). Cloud images preconfigure sshd and cloud-init. Ransomware stops backup services before encryption. Blue teams verify only required listeners with ss -tlnp.",
    scenario:
      "Port 8080 is open unexpectedly. Trace which systemd service owns it and how to disable it persistently.",
    practical: [
      {
        kind: "code",
        title: "systemd essentials",
        content:
          "systemctl status sshd\nsystemctl list-unit-files --type=service | grep enabled\njournalctl -u ssh.service --since '1 hour ago'\nss -tlnp | grep 8080",
      },
    ],
    terms: [
      { term: "Unit", definition: "systemd object representing a service, socket, mount, or target." },
      { term: "Daemon", definition: "Background process providing a service, often started at boot." },
      { term: "journald", definition: "systemd component collecting structured logs viewable via journalctl." },
    ],
    mistakes: [
      "Disabling sshd on the only admin access path without console recovery.",
      "Editing unit files without systemctl daemon-reload.",
      "Ignoring failed services that indicate compromise or misconfiguration.",
    ],
    defensive: [
      "Disable and mask unused services; document required baseline.",
      "Review custom unit files in /etc/systemd/system for persistence.",
      "Centralize journal forwarding to SIEM for retention.",
    ],
    quiz: [
      mcQuiz(
        "linux-svc-q1",
        "Which command shows whether sshd is running and recent log output?",
        ["ifconfig sshd", "systemctl status sshd", "chmod sshd", "useradd sshd"],
        1,
        "systemctl status displays unit state and snippet of journal logs.",
      ),
      mcQuiz(
        "linux-svc-q2",
        "To view logs for the nginx service:",
        ["cat /etc/nginx", "journalctl -u nginx", "ls -la nginx", "top nginx"],
        1,
        "journalctl -u filters journal entries for that systemd unit.",
      ),
      tfQuiz(
        "linux-svc-q3",
        "systemctl enable makes a service start automatically at boot.",
        true,
        "enable creates symlinks so the unit starts in the appropriate target.",
      ),
    ],
  }),

  createLesson({
    id: "linux-package-management",
    pathId: PATH,
    order: 8,
    title: "Package Management",
    summary:
      "apt, dnf, rpm, and repositories — installing, updating, and verifying software supply chain on Linux.",
    objectives: [
      "Install and remove packages with distribution-appropriate tools",
      "Update systems and understand security patching workflows",
      "Verify package integrity and recognize untrusted repository risks",
    ],
    introduction:
      "Package managers are how Linux systems receive applications and security fixes. They resolve dependencies, maintain manifests, and integrate with signing keys. Attackers who compromise repositories or trick admins into adding malicious repos achieve widespread impact. Patch discipline is baseline cyber hygiene.",
    coreConcepts: [
      "Debian/Ubuntu: apt update refreshes indexes; apt install/remove; apt upgrade applies updates.",
      "RHEL/Fedora: dnf install, dnf update; rpm -qa lists installed RPMs.",
      "Repositories defined in /etc/apt/sources.list or /etc/yum.repos.d/; GPG keys verify signatures.",
      "snap and flatpak bundle applications with different isolation models.",
      "Unattended-upgrades automates security patches on Debian systems.",
    ],
    explanation:
      "apt install curl fetches signed packages from configured mirrors. Holding packages (apt-mark hold) can block critical fixes — track exceptions. rpm -V verifies file hashes against package database. Third-party repos for dev tools need trust evaluation. Supply-chain attacks target build systems and mirrors; verify checksums when downloading binaries manually.",
    realWorld:
      "Equifax breach involved unpatched Apache Struts — patch management failure. Organizations use Ansible or cloud images for consistent baselines. Vulnerability scanners map installed package versions to CVEs. Air-gapped sites mirror repos internally.",
    scenario:
      "A developer asks you to add a random curl | bash install script repo. Explain risks and the safer package workflow.",
    terms: [
      { term: "Repository", definition: "Curated package source with metadata and signing keys." },
      { term: "Dependency", definition: "Additional packages required for a package to function." },
      { term: "CVE", definition: "Common Vulnerabilities and Exposures identifier for known security flaws." },
    ],
    mistakes: [
      "curl | bash from untrusted URLs without verification.",
      "Never rebooting after kernel updates, leaving old kernel running but thinking patch applied.",
      "Adding duplicate or unsigned repositories.",
    ],
    defensive: [
      "Automate security updates; test in staging first.",
      "Pin and audit third-party repos; use vendor-supported sources.",
      "Inventory installed packages regularly against CVE feeds.",
    ],
    quiz: [
      mcQuiz(
        "linux-pkg-q1",
        "On Ubuntu, which command installs the nginx package?",
        ["dnf install nginx", "apt install nginx", "yum remove nginx", "rpm -i nginx"],
        1,
        "Debian-family systems use apt for package installation.",
      ),
      tfQuiz(
        "linux-pkg-q2",
        "Package signatures help verify software came from a trusted source and was not tampered with.",
        true,
        "GPG-signed packages detect mirror or transport tampering.",
      ),
      mcQuiz(
        "linux-pkg-q3",
        "Applying security patches promptly primarily protects:",
        ["DNS speed", "Integrity and availability against known exploits", "Screen resolution", "USB power"],
        1,
        "Patches close vulnerabilities attackers actively exploit.",
      ),
    ],
  }),

  createLesson({
    id: "linux-bash-basics",
    pathId: PATH,
    order: 9,
    title: "Bash Basics",
    summary:
      "Variables, quoting, conditionals, loops, and scripts — automating tasks without introducing shell injection.",
    objectives: [
      "Write simple bash scripts with variables and conditionals",
      "Understand quoting rules for strings with spaces and special characters",
      "Recognize command injection risks when passing input to shells",
    ],
    introduction:
      "Bash is the default shell on most Linux systems and the glue for admin automation. Scripts deploy apps, rotate logs, and orchestrate incident response. Poor quoting and unvalidated input turn helpful scripts into remote code execution vectors — especially in web apps that call shell commands.",
    coreConcepts: [
      "Variables: NAME=value; use $NAME or ${NAME}; export for child processes.",
      "Single quotes preserve literal text; double quotes allow $ expansion; backticks or $() for command substitution.",
      "if [ condition ]; then ... fi; test file with -f, -d, -r.",
      "for i in list; do ... done; while read line; do ... done.",
      "Shebang #!/bin/bash; chmod +x script.sh; always quote variables: \"$var\".",
    ],
    explanation:
      "A backup script: for f in /var/log/*.log; do gzip \"$f\"; done. Injection: app runs bash -c \"ping $host\" with host=8.8.8.8; rm -rf /. Defenses: avoid shell entirely (exec with array args), validate allowlists, use printf %q. set -euo pipefail catches many script bugs. Functions and local variables organize larger scripts.",
    realWorld:
      "CGI scripts historically suffered shell injection. CI/CD pipelines run bash — secrets in env vars leak via set -x debug. Ansible uses SSH and modules to reduce raw shell. Attackers download bash one-liners from paste sites.",
    scenario:
      "A monitoring script runs check.sh $USER_INPUT where input is attacker-controlled. Show a malicious input and the fix.",
    practical: [
      {
        kind: "code",
        title: "Safe patterns",
        content:
          "#!/bin/bash\nset -euo pipefail\nLOG_DIR=\"/var/log/myapp\"\nif [[ -d \"$LOG_DIR\" ]]; then\n  find \"$LOG_DIR\" -name '*.log' -mtime +7 -delete\nfi",
      },
    ],
    terms: [
      { term: "Shebang", definition: "First line #!/bin/bash telling the kernel which interpreter to use." },
      { term: "Command substitution", definition: "$(command) runs command and substitutes its stdout into the script." },
      { term: "Shell injection", definition: "Attacker input interpreted as shell syntax, leading to arbitrary command execution." },
    ],
    mistakes: [
      "Unquoted $variables splitting on spaces and globbing.",
      "Using eval on user input.",
      "Running scripts as root when a dedicated service account suffices.",
    ],
    defensive: [
      "Quote all variable expansions; validate input against allowlists.",
      "Prefer Python or Go for complex logic with untrusted input.",
      "Run scripts with least privilege and audit cron entries.",
    ],
    quiz: [
      mcQuiz(
        "linux-bash-q1",
        "Which quoting preserves $variables for expansion?",
        ["Single quotes", "Double quotes", "Backticks only", "No quotes always safest"],
        1,
        "Double quotes allow variable expansion; single quotes are fully literal.",
      ),
      tfQuiz(
        "linux-bash-q2",
        "Passing unvalidated user input into bash -c is a common command injection pattern.",
        true,
        "The shell interprets metacharacters in input as commands.",
      ),
      mcQuiz(
        "linux-bash-q3",
        "set -e in a script causes:",
        ["Ignore errors", "Exit on command failure", "Run as root", "Disable networking"],
        1,
        "set -e exits the script when a command returns non-zero.",
      ),
    ],
  }),

  createLesson({
    id: "linux-environment-variables",
    pathId: PATH,
    order: 10,
    title: "Environment Variables",
    summary:
      "PATH, HOME, env inheritance, and secrets in the environment — configuration that shapes every process.",
    objectives: [
      "List and set environment variables for sessions and scripts",
      "Explain how PATH affects which binaries execute",
      "Identify security risks of secrets and LD_PRELOAD in the environment",
    ],
    introduction:
      "When you run a command, the shell passes environment variables to child processes. PATH determines which executable wins when you type a name. Loaders honor LD_PRELOAD. Web servers and cron jobs inherit surprising environments. Leaked API keys in env vars appear constantly in container and CI breaches.",
    coreConcepts: [
      "env and printenv list variables; export VAR=value sets for children.",
      "PATH is colon-separated search order for executables.",
      "HOME, USER, SHELL, PWD are standard; applications add their own.",
      ".bashrc, .profile, /etc/environment set login defaults.",
      "systemd Environment= in units; cron often minimal env — use full paths.",
    ],
    explanation:
      "Typing ls searches PATH directories left to right. Attackers prepend writable dirs to PATH so trojan ls runs first. LD_PRELOAD injects a shared library before others — powerful for debugging and malware. /proc/PID/environ shows variables (permission restricted). Containers pass secrets as env — visible in docker inspect and /proc. Use secret managers instead of long-lived env secrets where possible.",
    realWorld:
      "PATH hijacking in pentest labs escalates when admin runs scripts from . Cron jobs without full paths fail or run wrong binaries. GitHub Actions leaked keys in env to logs. systemd credential specs improve on plain EnvironmentFile.",
    scenario:
      "A user exports PATH=.:$PATH before running sudo make install. Explain the privilege escalation risk.",
    practical: [
      {
        kind: "code",
        title: "Inspect environment",
        content:
          "printenv | sort\n echo $PATH\ncat /proc/self/environ | tr '\\0' '\\n'\nsudo -l    # see preserved env rules",
      },
    ],
    terms: [
      { term: "export", definition: "Shell builtin marking a variable for inheritance by child processes." },
      { term: "LD_PRELOAD", definition: "Variable listing shared libraries loaded before others — powerful and dangerous." },
      { term: "Inherited environment", definition: "Variables passed from parent process to child at exec time." },
    ],
    mistakes: [
      "Storing production API keys in .bashrc on shared servers.",
      "Trusting PATH in setuid programs without sanitization.",
      "Assuming cron jobs inherit your interactive PATH.",
    ],
    defensive: [
      "Use absolute paths in cron and systemd units.",
      "Restrict LD_PRELOAD for setuid binaries via secure execution modes.",
      "Inject secrets via short-lived files or vault agents, not world-readable env files.",
    ],
    quiz: [
      mcQuiz(
        "linux-env-q1",
        "PATH determines:",
        ["DNS servers", "Which directories are searched for executables", "File permissions", "Kernel version"],
        1,
        "The shell searches PATH entries in order when resolving a command name.",
      ),
      mcQuiz(
        "linux-env-q2",
        "LD_PRELOAD is abused to:",
        ["Speed up SSD", "Inject malicious shared libraries into processes", "Change file ownership", "Edit sudoers"],
        1,
        "Attackers preload libraries to hook functions and hijack execution.",
      ),
      tfQuiz(
        "linux-env-q3",
        "Environment variables set with export are visible to child processes.",
        true,
        "Exported variables are passed across exec to child processes.",
      ),
    ],
  }),

  createLesson({
    id: "linux-ssh-concepts",
    pathId: PATH,
    order: 11,
    title: "SSH Concepts",
    summary:
      "Keys, known_hosts, sshd_config, tunnels, and securing remote administration on Linux servers.",
    objectives: [
      "Generate and use SSH key pairs for authentication",
      "Configure sshd hardening options in sshd_config",
      "Describe port forwarding use cases and risks",
    ],
    introduction:
      "SSH encrypts remote shell, file transfer (scp, sftp), and tunneling. It is the primary admin access path — and the primary brute-force target. Key-based auth, proper host verification, and hardened sshd_config reduce account takeover. Misused tunnels bypass network segmentation.",
    coreConcepts: [
      "ssh-keygen creates key pairs; public key in ~/.ssh/authorized_keys on server.",
      "ssh user@host connects; -i specifies identity file; -p port if nonstandard.",
      "known_hosts stores server host keys; warnings detect MITM if key changes.",
      "sshd_config: PermitRootLogin no, PasswordAuthentication no, AllowUsers.",
      "Local -L and remote -R forwarding tunnel TCP through SSH; ProxyJump for bastions.",
    ],
    explanation:
      "Ed25519 keys are modern default. Passphrases protect keys at rest. ssh-copy-id installs your pubkey. Fail2ban watches auth.log. Agent forwarding (-A) lets remote servers use your local agent — convenient but risky through untrusted hops. SFTP is SSH subsystem. Certificate-based SSH (small setups use keys) scales in enterprises.",
    realWorld:
      "Millions of bots scan port 22 for weak passwords. Nation-state actors steal private keys from developers. Bastion hosts consolidate access logging. Cloud providers inject keys at instance launch via metadata.",
    scenario:
      "auth.log shows thousands of Failed password for root. List three sshd_config changes and one monitoring control.",
    practical: [
      {
        kind: "code",
        title: "SSH key auth",
        content:
          "ssh-keygen -t ed25519 -C 'analyst@corp'\nssh-copy-id -i ~/.ssh/id_ed25519.pub user@server\nssh -o PasswordAuthentication=no user@server",
      },
    ],
    terms: [
      { term: "authorized_keys", definition: "File listing public keys permitted to log in as that user." },
      { term: "Host key", definition: "Server's cryptographic identity verified against known_hosts." },
      { term: "Bastion", definition: "Jump host that is the only SSH entry point into a private network." },
    ],
    mistakes: [
      "PermitRootLogin yes with password auth on the internet.",
      "Ignoring changed host key warnings (possible MITM).",
      "Leaving private keys unencrypted on shared laptops.",
    ],
    defensive: [
      "Key-only auth, disable root login, nonstandard port optional obscurity only.",
      "Use AllowUsers/AllowGroups; log to SIEM; MFA with PAM where possible.",
      "Rotate keys after personnel changes; audit authorized_keys.",
    ],
    quiz: [
      mcQuiz(
        "linux-ssh-q1",
        "Public key authentication places the public key in:",
        ["/etc/shadow", "~/.ssh/authorized_keys", "/etc/passwd", "/tmp"],
        1,
        "The server lists trusted public keys in the user's authorized_keys file.",
      ),
      tfQuiz(
        "linux-ssh-q2",
        "Disabling password authentication in sshd reduces brute-force success against weak passwords.",
        true,
        "Without passwords, attackers must possess the private key or exploit elsewhere.",
      ),
      mcQuiz(
        "linux-ssh-q3",
        "A changed server host key warning may indicate:",
        ["Successful login", "Possible man-in-the-middle or server rebuild", "Disk full", "Package update only"],
        1,
        "Unexpected host key changes warrant verification before connecting.",
      ),
    ],
  }),

  createLesson({
    id: "linux-logs-networking",
    pathId: PATH,
    order: 12,
    title: "Logs and Networking Commands",
    summary:
      "auth.log, journalctl, ss, ip, ping, traceroute, and curl — the analyst toolkit for connectivity and evidence.",
    objectives: [
      "Locate and analyze common Linux log files for security events",
      "Inspect network interfaces, routes, and listening ports",
      "Use ping, traceroute, curl, and ss for connectivity troubleshooting",
    ],
    introduction:
      "Logs tell the story after an alert: who logged in, what failed, what changed. Network commands verify whether a host can reach updates, C2, or internal APIs — and what is listening locally. Together they bridge Linux administration and security operations.",
    coreConcepts: [
      "auth.log / secure: SSH and PAM events; syslog aggregates facility.priority.",
      "journalctl unified logs; -f follow, -p err priority, --since time filters.",
      "ip addr and ip route replace legacy ifconfig/route; ss -tulpn shows listeners.",
      "ping tests ICMP reachability; traceroute shows path; curl tests HTTP/TLS endpoints.",
      "tcpdump and tshark capture packets for deeper analysis (authorized only).",
    ],
    explanation:
      "grep 'Accepted publickey' auth.log finds key logins; grep 'Failed password' finds brute force. ss -tlnp shows LISTEN sockets and processes — compare to expected baseline. curl -I https://api.example checks TLS and headers from the host's perspective. Log forwarding (rsyslog, fluent-bit) ships to SIEM. Clock sync (chrony) matters for correlation.",
    realWorld:
      "SOC playbooks start with journalctl and auth.log on affected servers. Egress curl to known-bad domains confirms C2 from the host view. Firewall teams use ss output to approve change tickets. Compliance requires centralized log retention.",
    scenario:
      "Users report the app cannot reach an API. From SSH, outline commands to verify DNS, routing, local firewall, and remote HTTPS — in order.",
    practical: [
      {
        kind: "code",
        title: "Logs and network checks",
        content:
          "journalctl -p err --since today\ngrep 'Failed password' /var/log/auth.log | tail\nip addr show\nss -tlnp\ncurl -vI https://api.example.com 2>&1 | head -20",
      },
    ],
    terms: [
      { term: "SIEM", definition: "Security Information and Event Management — centralized log analysis platform." },
      { term: "Listener", definition: "Socket bound to a port waiting for inbound connections." },
      { term: "Egress", definition: "Outbound traffic leaving a host or network boundary." },
    ],
    mistakes: [
      "Investigating without checking clock skew across systems.",
      "Using ifconfig on minimal containers where ip is available.",
      "Running tcpdump without filters on busy links, missing the needle.",
    ],
    defensive: [
      "Forward auth and sudo logs to immutable storage.",
      "Baseline listening ports per role; alert on new listeners.",
      "Restrict egress; log denied outbound attempts at firewall.",
    ],
    quiz: [
      mcQuiz(
        "linux-log-q1",
        "Which command shows listening TCP ports and associated processes?",
        ["ls -la", "ss -tlnp", "chmod", "useradd"],
        1,
        "ss -tlnp lists listening TCP sockets with process info.",
      ),
      mcQuiz(
        "linux-log-q2",
        "SSH authentication failures on Debian/Ubuntu commonly appear in:",
        ["/var/log/auth.log", "/etc/hosts", "/boot/grub", "/dev/null"],
        0,
        "auth.log records authentication and authorization events.",
      ),
      tfQuiz(
        "linux-log-q3",
        "curl can test HTTP/HTTPS connectivity and response headers from the command line.",
        true,
        "curl is a versatile tool for probing web services and APIs.",
      ),
    ],
    practiceLink: {
      label: "Terminal Challenge",
      to: `${paths.games}/terminal-challenge`,
      type: "games",
    },
  }),
];
