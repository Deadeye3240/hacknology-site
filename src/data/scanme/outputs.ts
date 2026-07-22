/** Simulated Nmap output snippets for training targets. */

const HOST = "10.10.10.25";

function header(): string {
  return `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().slice(0, 10)}
Nmap scan report for training-target (${HOST})
Host is up (0.0089s latency).`;
}

export const scanOutputs = {
  basic: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 1.02 seconds`,

  serviceDetect: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6
80/tcp open  http    Apache httpd 2.4.58

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.41 seconds`,

  port80: `${header()}
PORT   STATE SERVICE
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.31 seconds`,

  portMulti: `${header()}
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned in 0.52 seconds`,

  portRange: `${header()}
Not shown: 997 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned in 4.18 seconds`,

  fullPorts: `${header()}
Not shown: 65531 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
9000/tcp open  http-alt

Nmap done: 1 IP address (1 host up) scanned in 42.7 seconds`,

  osDetect: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
Device type: general purpose
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5.15
OS details: Linux 5.15 - 5.19
Network Distance: 1 hop

OS detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.12 seconds`,

  combinedSvO: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1
80/tcp open  http    Apache httpd 2.4.58
Device type: general purpose
Running: Linux 5.X
OS details: Linux 5.15 - 5.19

Nmap done: 1 IP address (1 host up) scanned in 12.3 seconds`,

  combinedFullSv: `${header()}
Not shown: 65531 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1
80/tcp   open  http    Apache httpd 2.4.58
443/tcp  open  ssl/http Apache httpd 2.4.58
9000/tcp open  http    Werkzeug httpd 3.0.1

Nmap done: 1 IP address (1 host up) scanned in 58.2 seconds`,

  synScan: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.89 seconds`,

  udpScan: `${header()}
PORT    STATE         SERVICE
53/udp  open          domain
123/udp open          ntp

Nmap done: 1 IP address (1 host up) scanned in 3.44 seconds`,

  defaultScripts: `${header()}
PORT   STATE SERVICE
22/tcp open  ssh
| ssh-hostkey:
|   2048 aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99 (RSA)
80/tcp open  http
|_http-title: Hacknology Training Target

Nmap done: 1 IP address (1 host up) scanned in 2.11 seconds`,

  aggressive: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1
80/tcp open  http    Apache httpd 2.4.58
|_http-title: Hacknology Training Target
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
Device type: general purpose
Running: Linux 5.X

Nmap done: 1 IP address (1 host up) scanned in 14.8 seconds`,

  skipPing: `${header()}
Not shown: 998 filtered tcp ports (no-response)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 2.05 seconds`,

  noDns: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.98 seconds`,

  verbose: `${header()}
Initiating SYN Stealth Scan at ${new Date().toISOString()}
Scanning ${HOST} [1000 ports]
Discovered open port 22/tcp on ${HOST}
Discovered open port 80/tcp on ${HOST}
Completed SYN Stealth Scan at ${new Date().toISOString()} (1.02s elapsed)
Nmap scan report for ${HOST}
Host is up (0.0089s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 1.05 seconds`,

  fastScan: `${header()}
Not shown: 98 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.41 seconds`,

  timing: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 0.72 seconds`,

  outputFile: `${header()}
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 1.02 seconds
Nmap scan results saved to scan.txt`,
};

export const SCANME_TARGET_IP = HOST;
