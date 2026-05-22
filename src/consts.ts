/**
 * Site-level metadata — single source of truth for the homepage.
 *
 * Adopters editing this file: SOCIAL_LINKS renders as a wrapping row of
 * bracketed text links under your photo. Drop entries you don't use; add
 * any platform you want — labels are free-form.
 */

export const SITE_TITLE = "Juntang Wang";
export const SITE_DESCRIPTION =
  "Personal site of Juntang Wang — AI for Science researcher.";
export const SITE_URL = "https://qqgjyx.com";

export interface SocialLink {
  label: string;
  url: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "CV", url: "/files/resume.pdf" },
  { label: "中文简历", url: "/files/resume_zh.pdf" },
  { label: "Scholar", url: "https://scholar.google.com/citations?user=iUaLgWwAAAAJ" },
  { label: "GitHub", url: "https://github.com/qqgjyx" },
  { label: "Email", url: "mailto:jw853@duke.edu" },
  { label: "LinkedIn", url: "https://linkedin.com/in/q9gjyx" },
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
