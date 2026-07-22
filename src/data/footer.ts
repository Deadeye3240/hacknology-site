import type { FooterColumn } from "@/types";
import { site } from "@/lib/site";

/** Grouped link columns rendered in the site footer. */
export const footerColumns: FooterColumn[] = [
  {
    heading: "Platform",
    links: [
      { label: "Lessons", to: "/lessons" },
      { label: "Labs", to: "/labs" },
      { label: "Tools", to: "/tools" },
      { label: "Resources", to: "/resources" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Forum", to: "/forum" },
      { label: "Discord", to: site.discordInviteUrl, external: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Legal overview", to: "/legal" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Acceptable Use", to: "/acceptable-use" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Support", to: "/support" },
      { label: "GitHub", to: site.githubUrl, external: true },
    ],
  },
];
