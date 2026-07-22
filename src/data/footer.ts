import type { FooterColumn } from "@/types";
import { paths } from "@/routes/paths";
import { site } from "@/lib/site";

/** Grouped link columns rendered in the site footer. */
export const footerColumns: FooterColumn[] = [
  {
    heading: "Platform",
    links: [
      { label: "Lessons", to: paths.lessons },
      { label: "Labs", to: paths.labs },
      { label: "Tools", to: paths.tools },
      { label: "Resources", to: paths.resources },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Forum", to: paths.forum },
      { label: "ScanMe", to: paths.scanme },
      { label: "Discord", to: site.discordInviteUrl, external: true },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Legal overview", to: paths.legal },
      { label: "Terms of Service", to: paths.terms },
      { label: "Privacy Policy", to: paths.privacy },
      { label: "Acceptable Use", to: paths.acceptableUse },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: paths.about },
      { label: "Support", to: paths.support },
      { label: "GitHub", to: site.githubUrl, external: true },
    ],
  },
];
