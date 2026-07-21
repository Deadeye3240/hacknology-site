import type { FooterColumn } from "@/types";

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
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];
