/**
 * Minimal inline-markdown processor for short title strings in honors/service
 * data. Handles **bold**, *italic*, and [text](url) link syntax. Not a full
 * markdown parser — intentionally restricted so titles stay readable in the
 * data files.
 *
 * Security: input is HTML-escaped before regex substitution, so raw `<`, `>`,
 * `&`, `"`, `'` in titles render as text rather than HTML. The [text](url)
 * rule only accepts http(s), mailto, and same-origin paths; any other URL
 * scheme (notably `javascript:`) is rejected and the link reverts to the
 * original `[text](url)` source text.
 */
const SAFE_URL = /^(https?:|\/|#|mailto:)/i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function inlineMd(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) =>
      SAFE_URL.test(url)
        ? `<a href="${url}" target="_blank" rel="noopener">${text}</a>`
        : match,
    );
}
