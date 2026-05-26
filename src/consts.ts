/**
 * Site-level metadata — single source of truth for the homepage.
 * SOCIAL_LINKS renders as a single row of icon-only links under the photo
 * (Lucide icon names: https://icones.js.org/collection/lucide).
 */

export const SITE_TITLE = "Juntang Wang";
export const SITE_DESCRIPTION =
  "Personal site of Juntang Wang — AI for Science researcher.";
export const SITE_URL = "https://www.qqgjyx.com";

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "CV", url: "/files/resume.pdf", icon: "lucide:file-text" },
  { label: "中文简历", url: "/files/resume_zh.pdf", icon: "lucide:languages" },
  {
    label: "Scholar",
    url: "https://scholar.google.com/citations?user=iUaLgWwAAAAJ",
    icon: "lucide:graduation-cap",
  },
  { label: "GitHub", url: "https://github.com/qqgjyx", icon: "lucide:github" },
  {
    label: "Email",
    url: "mailto:juntangwang@g.harvard.edu",
    icon: "lucide:mail",
  },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/q9gjyx",
    icon: "lucide:linkedin",
  },
] as const;
