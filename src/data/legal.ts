import type { LegalDocument } from "@/types/legal";
import { site } from "@/lib/site";

const contactLine = `Questions about these policies or the platform may be sent through the support page at ${site.url}/support.`;

export const legalDocuments: Record<
  "terms" | "privacy" | "acceptableUse",
  LegalDocument
> = {
  terms: {
    slug: "terms",
    title: "Terms of Service",
    description: `Rules and conditions for using ${site.nameFormatted} at ${site.domain}.`,
    lastUpdated: "2026-07-21",
    sections: [
      {
        id: "agreement",
        title: "1. Agreement to these terms",
        paragraphs: [
          `By accessing or using ${site.nameFormatted} ("the Platform", "we", "us") at ${site.url}, you agree to these Terms of Service, our Privacy Policy, and our Acceptable Use Policy. If you do not agree, do not use the Platform.`,
          "We may update these terms from time to time. Material changes will be reflected by updating the date at the top of this page. Continued use after changes constitutes acceptance of the revised terms.",
        ],
      },
      {
        id: "eligibility",
        title: "2. Eligibility and accounts",
        paragraphs: [
          "You must be at least 13 years old to create an account. If you are under 18, you should use the Platform only with permission from a parent or guardian.",
          "You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us promptly if you suspect unauthorized access.",
          "You agree to provide accurate registration information and to keep your account details current. We may suspend or terminate accounts that violate these terms or that we reasonably believe pose a security or legal risk.",
        ],
      },
      {
        id: "platform",
        title: "3. What the Platform provides",
        paragraphs: [
          `${site.nameFormatted} is an educational cybersecurity platform. We provide lessons, learning paths, labs, games, forums, and related content intended for authorized, defensive, and educational use.`,
          "Some features are simulations or sandboxed environments. They are designed for learning — not for use against systems, networks, or data you do not own or lack explicit written permission to test.",
          "We do not guarantee uninterrupted availability, error-free content, or that any course, lab, or tool will meet your specific goals. Content may change, be added, or be removed without notice.",
        ],
      },
      {
        id: "authorized-use",
        title: "4. Authorized use only",
        paragraphs: [
          "You may use skills learned on the Platform only in lawful, authorized contexts — for example, systems you own, employer-approved assessments, CTF events with clear rules, or environments explicitly designated for practice on this Platform.",
          "You must not use the Platform, its labs, its tooling guidance, or community spaces to plan or carry out unauthorized access, denial-of-service attacks, malware distribution, harassment, fraud, or any activity that violates applicable law or third-party rights.",
          "See our Acceptable Use Policy for detailed rules on labs, ScanMe, Vulnerable Lab, forum conduct, and community standards.",
        ],
      },
      {
        id: "user-content",
        title: "5. User content and forum",
        paragraphs: [
          "You retain ownership of content you post (forum posts, profile information, etc.), but you grant us a non-exclusive, worldwide, royalty-free license to host, display, and distribute that content solely to operate and improve the Platform.",
          "You represent that you have the right to post your content and that it does not infringe others' rights or violate law.",
          "We may remove content, restrict features, or suspend accounts that violate our policies, receive valid legal requests, or pose safety or security concerns. We are not obligated to monitor all user content but may do so.",
        ],
      },
      {
        id: "ip",
        title: "6. Our intellectual property",
        paragraphs: [
          `The Platform, including its design, branding, lesson structure, original text, graphics, and software (excluding your user content), is owned by ${site.nameFormatted} or its licensors and is protected by intellectual property laws.`,
          "You may not copy, scrape, resell, or redistribute Platform content for commercial purposes without our prior written permission, except where fair use or open licenses explicitly allow.",
        ],
      },
      {
        id: "third-party",
        title: "7. Third-party services and links",
        paragraphs: [
          "The Platform may link to external sites, tools, or communities (including Discord). We do not control third-party services and are not responsible for their content, privacy practices, or availability.",
          "Your use of third-party services is governed by their own terms and policies.",
        ],
      },
      {
        id: "disclaimer",
        title: "8. Disclaimers",
        paragraphs: [
          'THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
          "Educational content is for general learning purposes and does not constitute professional legal, compliance, or security advice. You are responsible for obtaining appropriate authorization before testing any real system.",
        ],
      },
      {
        id: "liability",
        title: "9. Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, goodwill, or other intangible losses arising from your use of the Platform.",
          "Our total liability for any claim relating to the Platform shall not exceed the greater of (a) the amount you paid us in the twelve months before the claim, or (b) fifty U.S. dollars (USD $50), if you use the Platform at no charge.",
        ],
      },
      {
        id: "termination",
        title: "10. Termination",
        paragraphs: [
          "You may stop using the Platform at any time. We may suspend or terminate access if you breach these terms or if required for security, legal, or operational reasons.",
          "Sections that by their nature should survive termination (including disclaimers, limitation of liability, and governing law) will survive.",
        ],
      },
      {
        id: "law",
        title: "11. Governing law",
        paragraphs: [
          "These terms are governed by the laws applicable in the jurisdiction where the Platform operator is established, without regard to conflict-of-law rules. Disputes will be resolved in the courts of that jurisdiction unless otherwise required by mandatory local law.",
          contactLine,
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description: `How ${site.nameFormatted} collects, uses, and protects your information.`,
    lastUpdated: "2026-07-21",
    sections: [
      {
        id: "overview",
        title: "1. Overview",
        paragraphs: [
          `This Privacy Policy explains how ${site.nameFormatted} ("we", "us") handles information when you use ${site.url} and related services.`,
          "We aim to collect only what we need to operate the Platform, improve learning features, and keep accounts secure.",
        ],
      },
      {
        id: "collect",
        title: "2. Information we collect",
        paragraphs: ["We may collect the following categories of information:"],
        list: [
          "Account data: username, email address, password (stored as a secure hash), optional display name, profile bio, and avatar image you upload.",
          "Usage data: pages visited, lesson progress, lab completions, game scores, and similar learning activity stored to support your account experience.",
          "Forum content: discussions, replies, and reports you submit.",
          "Technical data: IP address, browser type, device information, and timestamps in server logs for security, abuse prevention, and troubleshooting.",
          "Cookies and session data: authentication session identifiers and CSRF tokens required to keep you signed in securely.",
        ],
      },
      {
        id: "use",
        title: "3. How we use information",
        paragraphs: ["We use collected information to:"],
        list: [
          "Create and manage your account and authenticate requests.",
          "Provide lessons, labs, progress tracking, forum features, and admin tools.",
          "Respond to abuse reports, enforce policies, and protect the Platform.",
          "Send optional service-related notifications (for example, forum or webhook alerts you configure as an administrator).",
          "Improve content, fix bugs, and understand aggregate usage patterns.",
        ],
      },
      {
        id: "storage",
        title: "4. Where data is stored",
        paragraphs: [
          "The Platform is hosted on Cloudflare Pages and related Cloudflare services. Account and forum data are stored in Cloudflare D1 (database). Uploaded avatars and media may be stored in Cloudflare R2.",
          "Data may be processed in regions where our infrastructure providers operate. We rely on those providers' security and compliance programs.",
        ],
      },
      {
        id: "sharing",
        title: "5. When we share information",
        paragraphs: [
          "We do not sell your personal information. We may share limited data:",
        ],
        list: [
          "With infrastructure providers (e.g., Cloudflare) who process data on our behalf to run the Platform.",
          "When required by law, valid legal process, or to protect rights, safety, and security.",
          "In connection with a merger, acquisition, or asset sale, with notice where appropriate.",
          "Public forum posts and profile fields you choose to make visible to other users.",
        ],
      },
      {
        id: "discord",
        title: "6. Discord and external communities",
        paragraphs: [
          "If you join our Discord server or other external communities, your interactions there are governed by Discord's (or the relevant provider's) privacy policy, not this one.",
          "Administrators may configure webhooks to send Platform events (such as new forum posts) to Discord. Those messages contain information configured in the notification (for example, discussion title and author username).",
        ],
      },
      {
        id: "retention",
        title: "7. Data retention",
        paragraphs: [
          "We retain account and forum data while your account is active. You may request account deletion by contacting us through supported community channels; we will delete or anonymize personal data unless we must retain it for legal, security, or backup reasons.",
          "Server logs and security records may be kept for a limited period consistent with operational needs.",
        ],
      },
      {
        id: "security",
        title: "8. Security",
        paragraphs: [
          "We use industry-standard measures including hashed passwords, HTTPS, session-based authentication, CSRF protection on state-changing requests, and access controls for administrative functions.",
          "No method of transmission or storage is 100% secure. You use the Platform at your own risk and should use a strong, unique password.",
        ],
      },
      {
        id: "rights",
        title: "9. Your choices and rights",
        paragraphs: [
          "You can update profile information and avatar from your account settings. You can choose what you post in public forum areas.",
          "Depending on your location, you may have rights to access, correct, delete, or export personal data, or to object to certain processing. Contact us to make a request and we will respond within a reasonable time.",
        ],
      },
      {
        id: "children",
        title: "10. Children",
        paragraphs: [
          "The Platform is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us data, contact us so we can take appropriate action.",
        ],
      },
      {
        id: "changes",
        title: "11. Changes to this policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time. The \"Last updated\" date at the top reflects the latest revision.",
          contactLine,
        ],
      },
    ],
  },
  acceptableUse: {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    description: `Authorized, ethical, and safe use of ${site.nameFormatted} labs, tools, and community features.`,
    lastUpdated: "2026-07-21",
    sections: [
      {
        id: "purpose",
        title: "1. Purpose",
        paragraphs: [
          `${site.nameFormatted} exists to teach defensive and responsible cybersecurity skills. This Acceptable Use Policy ("AUP") applies to all users and supplements our Terms of Service.`,
          "Violations may result in content removal, feature restrictions, account suspension, or referral to appropriate authorities where required by law.",
        ],
      },
      {
        id: "authorized",
        title: "2. Authorized testing only",
        paragraphs: [
          "Skills and techniques discussed on the Platform must only be applied to systems, networks, applications, or data that you own or have explicit written authorization to assess.",
          "Unauthorized scanning, exploitation, credential stuffing, denial-of-service activity, malware deployment, or data exfiltration against third parties is prohibited — even if you learned the technique here.",
        ],
      },
      {
        id: "labs",
        title: "3. Labs, ScanMe, and Vulnerable Lab",
        paragraphs: ["Our practice environments are isolated and intentional:"],
        list: [
          "Vulnerable Lab challenges run in your browser as educational simulations. Do not attempt to use them against production systems.",
          "ScanMe missions target designated lab infrastructure documented on the Platform. Do not scan or probe hosts outside the stated scope.",
          "Do not share lab flags, solutions, or bypass methods in ways that spoil learning for others unless the activity explicitly allows collaboration.",
          "Do not attempt to break out of sandboxes, attack Platform infrastructure, or interfere with other users' sessions.",
        ],
      },
      {
        id: "forum",
        title: "4. Forum and community conduct",
        paragraphs: ["When participating in forums or external communities linked from the Platform:"],
        list: [
          "Be respectful. No harassment, hate speech, threats, doxxing, or targeted abuse.",
          "No spam, scams, phishing, or promotion of illegal services.",
          "Do not post malware, exploit code intended for unauthorized use, stolen credentials, or personal data belonging to others.",
          "Do not impersonate staff, other users, or organizations.",
          "Report content that violates this policy using available reporting tools.",
        ],
      },
      {
        id: "accounts",
        title: "5. Account integrity",
        paragraphs: [
          "One person should not maintain multiple accounts to evade bans, manipulate votes, or abuse features.",
          "Do not share accounts. Do not attempt to access another user's account without permission.",
          "Do not probe or attack Platform authentication, APIs, or admin interfaces.",
        ],
      },
      {
        id: "content",
        title: "6. Educational content use",
        paragraphs: [
          "You may reference and apply lessons for personal learning and authorized professional work.",
          "Do not republish substantial Platform content as your own commercial product without permission.",
          "When demonstrating skills publicly (write-ups, streams, portfolios), ensure targets are authorized and you do not expose sensitive data.",
        ],
      },
      {
        id: "reporting",
        title: "7. Reporting violations",
        paragraphs: [
          "If you observe abuse, security issues, or policy violations, report them through forum moderation tools or contact administrators via supported channels.",
          "We may cooperate with law enforcement when required and when necessary to protect users and the Platform.",
          contactLine,
        ],
      },
    ],
  },
};

export const legalHubLinks = [
  { label: "Terms of Service", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Acceptable Use Policy", to: "/acceptable-use" },
] as const;
