/**
 * Hand-rolled BibTeX scanner. Locked at pre-flight spike — see _spike/FINDINGS.md.
 * Brace-balanced; no LaTeX post-processing; values are byte-identical to source
 * modulo BibTeX `{}` stripping. URL %-encoding and HTML payloads (e.g. `<strong>`)
 * survive untouched, which is the whole point.
 */

export type RawFields = Record<string, string>;

export interface RawEntry {
  type: string;
  key: string;
  fields: RawFields;
  bibtex: string;
}

export interface ParsedEntry {
  id: string;
  type: string;
  fields: RawFields;
  date: Date;
  authors: string[];
  bibtex: string;
}

const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function stripComments(src: string): string {
  return src
    .split("\n")
    .map((line) => line.replace(/^\s*%.*$/, ""))
    .join("\n");
}

export function parseBibTeX(src: string): RawEntry[] {
  const cleaned = stripComments(src);
  const entries: RawEntry[] = [];
  const headerRe = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;

  let match = headerRe.exec(cleaned);
  while (match !== null) {
    const type = match[1];
    const key = match[2];
    const entryStart = match.index;
    const bodyStart = headerRe.lastIndex;

    let depth = 1;
    let i = bodyStart;
    while (i < cleaned.length && depth > 0) {
      const c = cleaned[i];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      i++;
    }
    const bodyEnd = i - 1;
    const body = cleaned.slice(bodyStart, bodyEnd);
    const fields = parseFields(body);
    const bibtex = cleaned.slice(entryStart, i);

    entries.push({ type: type.toLowerCase(), key, fields, bibtex });
    headerRe.lastIndex = i;
    match = headerRe.exec(cleaned);
  }

  return entries;
}

function parseFields(body: string): RawFields {
  const fields: RawFields = {};
  let j = 0;
  while (j < body.length) {
    while (j < body.length && /[\s,]/.test(body[j])) j++;
    if (j >= body.length) break;

    const nameMatch = /^([A-Za-z_][\w-]*)\s*=\s*/.exec(body.slice(j));
    if (!nameMatch) break;
    const name = nameMatch[1].toLowerCase();
    j += nameMatch[0].length;

    let value = "";
    if (body[j] === "{") {
      let d = 1;
      j++;
      const start = j;
      while (j < body.length && d > 0) {
        if (body[j] === "{") d++;
        else if (body[j] === "}") d--;
        if (d > 0) j++;
      }
      value = body.slice(start, j);
      j++;
    } else if (body[j] === '"') {
      j++;
      const start = j;
      while (j < body.length && body[j] !== '"') j++;
      value = body.slice(start, j);
      j++;
    } else {
      const start = j;
      while (j < body.length && body[j] !== ",") j++;
      value = body.slice(start, j).trim();
    }
    fields[name] = value;
  }
  return fields;
}

function coerceDate(fields: RawFields): Date {
  if (fields.date) {
    const d = new Date(fields.date);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (fields.year) {
    const year = Number.parseInt(fields.year, 10);
    let month = 1;
    const raw = fields.month?.toLowerCase();
    if (raw) {
      const numeric = Number.parseInt(raw, 10);
      if (!Number.isNaN(numeric)) {
        month = numeric;
      } else if (MONTHS[raw.slice(0, 3)]) {
        month = MONTHS[raw.slice(0, 3)];
      }
    }
    return new Date(Date.UTC(year, month - 1, 1));
  }
  throw new Error(
    `bibtex entry missing required date/year: ${JSON.stringify(fields)}`,
  );
}

function splitAuthors(authorField: string | undefined): string[] {
  if (!authorField) return [];
  return authorField
    .split(/\s+and\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function toParsedEntry(entry: RawEntry): ParsedEntry {
  return {
    id: entry.key,
    type: entry.type,
    fields: entry.fields,
    date: coerceDate(entry.fields),
    authors: splitAuthors(entry.fields.author),
    bibtex: entry.bibtex,
  };
}

export function loadPublications(src: string): ParsedEntry[] {
  return parseBibTeX(src).map(toParsedEntry);
}
