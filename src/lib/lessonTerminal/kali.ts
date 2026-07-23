/** Default Kali Linux identity for lesson terminal labs. */
export const KALI_USER = "kali";
export const KALI_HOST = "Kali";
export const KALI_HOME = "/home/kali";

export function kaliMotdLines(): string[] {
  const now = new Date().toUTCString();
  return [
    "Linux Kali 6.6.9-kali1-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1kali1 (2024-07-15) x86_64",
    "",
    "The programs included with the Kali GNU/Linux system are free software;",
    "the exact distribution terms for each program are described in the",
    "individual files in /usr/share/doc/*/copyright.",
    "",
    `Last login: ${now} from 127.0.0.1 on pts/0`,
  ];
}

/** Debian/Kali-style message for tools not modeled in the simulator. */
export function commandNotFoundMessage(rawCmd: string): string {
  const name = rawCmd.split(/[/\\]/).pop() ?? rawCmd;
  const aptPackages: Record<string, string> = {
    htop: "htop",
    nikto: "nikto",
    sqlmap: "sqlmap",
    metasploit: "metasploit-framework",
    msfconsole: "metasploit-framework",
    wireshark: "wireshark",
    tshark: "tshark",
    john: "john",
    hashcat: "hashcat",
    hydra: "hydra",
    medusa: "medusa",
    gobuster: "gobuster",
    ffuf: "ffuf",
    dirb: "dirb",
    dirbuster: "dirbuster",
    enum4linux: "enum4linux",
    smbclient: "smbclient",
    rpcclient: "samba-common-bin",
    responder: "responder",
    bloodhound: "bloodhound",
    neo4j: "neo4j",
    burpsuite: "burpsuite",
    zaproxy: "zaproxy",
    masscan: "masscan",
    rustscan: "rustscan",
    theharvester: "theharvester",
    "recon-ng": "recon-ng",
    maltego: "maltego",
    steghide: "steghide",
    exiftool: "libimage-exiftool-perl",
    binwalk: "binwalk",
    foremost: "foremost",
    scalpel: "scalpel",
    volatility: "volatility3",
    autopsy: "autopsy",
    tcpdump: "tcpdump",
    netcat: "netcat-traditional",
    nc: "netcat-traditional",
    telnet: "telnet",
    ftp: "ftp",
    sshpass: "sshpass",
    crackmapexec: "crackmapexec",
    impacket: "impacket-scripts",
  };

  const pkg = aptPackages[name.toLowerCase()];
  if (pkg) {
    return `${name}: command not found\n\nThe program '${name}' is currently not installed. You can install it by typing:\n\nsudo apt install ${pkg}\n\nAlternatively, use 'apt search ${name}' to find related packages.`;
  }

  return `bash: ${name}: command not found`;
}
