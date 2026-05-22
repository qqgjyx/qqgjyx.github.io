export interface ExternalLink {
  label: string;
  url: string;
}

/**
 * Bracket-slash link row rendered in the bio block, Barron-style:
 *   [Email] / [Scholar] / [GitHub] / [CV]
 *
 * Order is preserved as-listed. Add/remove entries to update the row.
 * Email is intentionally omitted by default; populate when ready to expose.
 */
export const links: ExternalLink[] = [
  { label: "GitHub", url: "https://github.com/qqgjyx" },
];
