/**
 * Attributes for a link: open external (http/https) links in a new tab with a
 * safe rel; internal/relative/mailto links get nothing. Spread onto an <a>:
 *   <a href={url} {...externalLinkAttrs(url)}>
 */
export function externalLinkAttrs(url: string) {
  return /^https?:/.test(url) ? { target: "_blank", rel: "noopener" } : {};
}
