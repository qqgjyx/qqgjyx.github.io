/**
 * Minimal inline-markdown processor for short title strings in honors/service
 * data. Handles **bold**, *italic*, and [text](url) link syntax. Not a full
 * markdown parser — intentionally restricted so titles stay readable in the
 * data files.
 */
export function inlineMd(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );
}
