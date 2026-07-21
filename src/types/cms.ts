/** CMS content block types — rendered safely as React text nodes. */
export type CmsBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language?: string; content: string };

export interface CmsPageContent {
  blocks: CmsBlock[];
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  seoTitle: string | null;
  seoDescription: string | null;
  content: string;
  status: "draft" | "published";
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CmsResource {
  id: string;
  name: string;
  description: string;
  category: string;
  visibility: "public" | "hidden";
  fileKey: string | null;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  website: string | null;
  resourceLink: string | null;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CmsMediaItem {
  id: string;
  fileKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  altText: string;
  url: string;
  createdAt: string;
}

export interface AdminDashboardStats {
  stats: {
    users: number;
    disabledUsers: number;
    discussions: number;
    replies: number;
    openReports: number;
  };
  cms: {
    pages: number;
    publishedPages: number;
    lessons: number;
    resources: number;
    media: number;
  };
}

export const ADMIN_SECTIONS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/pages", label: "Pages" },
  { to: "/admin/lessons", label: "Lessons" },
  { to: "/admin/paths", label: "Courses" },
  { to: "/admin/assessments", label: "Assessments" },
  { to: "/admin/labs", label: "Labs" },
  { to: "/admin/resources", label: "Resources" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/navigation", label: "Navigation" },
  { to: "/admin/homepage", label: "Homepage" },
  { to: "/admin/appearance", label: "Appearance" },
  { to: "/admin/settings", label: "Settings" },
  { to: "/admin/discord", label: "Discord" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/reports", label: "Reports" },
] as const;
