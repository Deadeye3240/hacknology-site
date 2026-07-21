/** Canonical route paths, referenced by the router and navigation data. */
export const paths = {
  home: "/",
  lessons: "/lessons",
  labs: "/labs",
  tools: "/tools",
  scan: "/scan",
  resources: "/resources",
  about: "/about",

  // Authentication & account
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",

  // Community forum
  forum: "/forum",
  forumNew: "/forum/new",

  // Administration
  admin: "/admin",
} as const;

export type PathKey = keyof typeof paths;
