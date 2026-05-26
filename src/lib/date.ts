/**
 * Format a `YYYY-MM` string as `Mon YYYY` (e.g. "2024-09" -> "Sep 2024").
 * Returns "" for undefined and echoes the input unchanged if it isn't a valid
 * month. Shared by EducationEntry and WorkEntry.
 */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function fmtMonth(ym: string | undefined): string {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const idx = parseInt(m ?? "", 10) - 1;
  if (!Number.isFinite(idx) || idx < 0 || idx > 11) return ym;
  return `${MONTHS[idx]} ${y}`;
}

/**
 * Format a `YYYY-MM` string as a compact academic term (e.g. "2024-08" ->
 * "Fall 2024"). Season from start month: Jan–May = Spring, Jun–Jul = Summer,
 * Aug–Dec = Fall. Used by TeachingEntry.
 */
export function fmtTerm(ym: string | undefined): string {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const month = parseInt(m ?? "", 10);
  if (!Number.isFinite(month) || month < 1 || month > 12) return ym;
  const season = month <= 5 ? "Spring" : month <= 7 ? "Summer" : "Fall";
  return `${season} ${y}`;
}
