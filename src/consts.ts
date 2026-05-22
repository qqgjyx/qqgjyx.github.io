/**
 * Site-level metadata — single source of truth for the homepage.
 *
 * Adopters editing this file: SOCIAL_LINKS controls the icon column under your
 * photo. Drop entries you don't use; add any platform with an icon name from
 * https://icones.js.org/collection/lucide.
 */

export const SITE_TITLE = "Juntang Wang";
export const SITE_DESCRIPTION =
  "Personal site of Juntang Wang — AI for Science researcher.";
export const SITE_URL = "https://qqgjyx.com";

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "CV", url: "/files/resume.pdf", icon: "lucide:file-text" },
  { label: "中文简历", url: "/files/resume_zh.pdf", icon: "lucide:file-text" },
  {
    label: "Scholar",
    url: "https://scholar.google.com/citations?user=iUaLgWwAAAAJ",
    icon: "lucide:graduation-cap",
  },
  { label: "GitHub", url: "https://github.com/qqgjyx", icon: "lucide:github" },
  { label: "Email", url: "mailto:jw853@duke.edu", icon: "lucide:mail" },
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/q9gjyx",
    icon: "lucide:linkedin",
  },
] as const;

/**
 * Documentation-only references; the actual palette + accent live in
 * src/styles/global.css. Adopters who want a different Catppuccin accent
 * (Teal, Peach, Lavender, Maroon, etc.) edit --color-accent in global.css.
 */
export const BRAND = {
  flavor: "latte+mocha",
  accent: "mauve",
} as const;
