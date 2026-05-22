#!/usr/bin/env node
/**
 * BibTeX → markdown collection importer.
 *
 * Reads a `.bib` file and writes one markdown file per entry into
 * src/content/pubs/<display_anchor>.md (falls back to cite-key if
 * display_anchor missing).
 *
 * Usage:
 *   node scripts/import-bib.mjs path/to/citations.bib
 *
 * Each output file matches the schema in src/content.config.ts.
 * After import, edit each file to mark which author is `self: true`
 * (and `equal: true` for co-first-authors, matching equal_contribution).
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { argv, cwd, exit } from "node:process";

const MONTHS = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function stripComments(src) {
  return src
    .split("\n")
    .map((line) => line.replace(/^\s*%.*$/, ""))
    .join("\n");
}

function parseFields(body) {
  const fields = {};
  let j = 0;
  while (j < body.length) {
    while (j < body.length && /[\s,]/.test(body[j])) j++;
    if (j >= body.length) break;
    const m = /^([A-Za-z_][\w-]*)\s*=\s*/.exec(body.slice(j));
    if (!m) break;
    const name = m[1].toLowerCase();
    j += m[0].length;
    let value = "";
    if (body[j] === "{") {
      let depth = 1;
      j++;
      const start = j;
      while (j < body.length && depth > 0) {
        if (body[j] === "{") depth++;
        else if (body[j] === "}") depth--;
        if (depth > 0) j++;
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

function parseBibTeX(src) {
  const cleaned = stripComments(src);
  const entries = [];
  const headerRe = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;
  let m = headerRe.exec(cleaned);
  while (m !== null) {
    const type = m[1].toLowerCase();
    const key = m[2];
    const entryStart = m.index;
    const bodyStart = headerRe.lastIndex;
    let depth = 1;
    let i = bodyStart;
    while (i < cleaned.length && depth > 0) {
      if (cleaned[i] === "{") depth++;
      else if (cleaned[i] === "}") depth--;
      i++;
    }
    const fields = parseFields(cleaned.slice(bodyStart, i - 1));
    const bibtex = cleaned.slice(entryStart, i);
    entries.push({ type, key, fields, bibtex });
    headerRe.lastIndex = i;
    m = headerRe.exec(cleaned);
  }
  return entries;
}

function coerceDate(fields) {
  if (fields.date) return fields.date;
  const year = Number.parseInt(fields.year ?? "", 10);
  let month = 1;
  if (fields.month) {
    const raw = fields.month.toLowerCase();
    const numeric = Number.parseInt(raw, 10);
    if (!Number.isNaN(numeric)) month = numeric;
    else if (MONTHS[raw.slice(0, 3)]) month = MONTHS[raw.slice(0, 3)];
  }
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

function splitAuthors(field) {
  if (!field) return [];
  return field
    .split(/\s+and\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name) => {
      // "Lastname, Firstname" → "Firstname Lastname"
      const parts = name.split(",").map((p) => p.trim());
      return parts.length === 2 ? `${parts[1]} ${parts[0]}` : name;
    });
}

function escapeYaml(s) {
  if (s == null) return "";
  // Quote if special chars present
  if (/[:#&*!|>'"%@`{}[\]]/.test(s) || /^\s|\s$/.test(s)) {
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return s;
}

function indent(text, prefix) {
  return text.split("\n").map((line) => prefix + line).join("\n");
}

function toMarkdown(entry) {
  const f = entry.fields;
  const slug = f.display_anchor ?? entry.key;
  const authors = splitAuthors(f.author);
  const equal = (f.equal_contribution ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const displayAuthors = (f.display_authors ?? "")
    .replace(/\{\\dag\}/g, "†")
    .replace(/\{\\ddag\}/g, "‡");
  const venue = f.booktitle ?? f.journal ?? f.note;
  const links = {};
  if (f.paperurl) links.paper = f.paperurl;
  if (f.arxivurl) links.arxiv = f.arxivurl;
  if (f.code ?? f.codeurl) links.code = f.code ?? f.codeurl;
  if (f.poster ?? f.posterurl) links.poster = f.poster ?? f.posterurl;
  if (f.slides ?? f.slidesurl) links.slides = f.slides ?? f.slidesurl;
  if (f.pdf ?? f.pdfurl) links.pdf = f.pdf ?? f.pdfurl;

  const lines = [];
  lines.push("---");
  lines.push(`title: ${escapeYaml(f.title ?? "")}`);
  lines.push(`type: ${entry.type}`);
  lines.push(`date: ${coerceDate(f)}`);
  if (authors.length > 0) {
    lines.push("authors:");
    for (const name of authors) {
      lines.push(`  - { name: ${escapeYaml(name)} }`);
    }
  }
  if (displayAuthors) lines.push(`displayAuthors: ${escapeYaml(displayAuthors)}`);
  if (venue) lines.push(`venue: ${escapeYaml(venue)}`);
  if (f.venue_short) lines.push(`venueShort: ${escapeYaml(f.venue_short)}`);
  if (f.track) lines.push(`track: ${escapeYaml(f.track)}`);
  if (f.award ?? f.awards) lines.push(`award: ${escapeYaml(f.award ?? f.awards)}`);
  if (equal.length > 0) lines.push(`equalContribution: [${equal.join(", ")}]`);
  if ((f.featured ?? "").toLowerCase() === "true") lines.push(`featured: true`);
  if ((f.highlighted ?? "").toLowerCase() === "true") lines.push(`highlighted: true`);
  if (Object.keys(links).length > 0) {
    lines.push("links:");
    for (const [k, v] of Object.entries(links)) {
      lines.push(`  ${k}: ${escapeYaml(v)}`);
    }
  }
  if (f.tldr) lines.push(`tldr: ${escapeYaml(f.tldr)}`);
  if (f.hero) lines.push(`hero: ${escapeYaml(f.hero)}`);
  lines.push("bibtex: |");
  lines.push(indent(entry.bibtex, "  "));
  lines.push("---");
  lines.push("");
  return { slug, content: lines.join("\n") };
}

function main() {
  const arg = argv[2];
  if (!arg) {
    console.error("Usage: node scripts/import-bib.mjs path/to/citations.bib");
    exit(1);
  }
  const bibPath = resolve(cwd(), arg);
  const src = readFileSync(bibPath, "utf8");
  const entries = parseBibTeX(src);
  const outDir = resolve(cwd(), "src/content/pubs");
  mkdirSync(outDir, { recursive: true });
  for (const entry of entries) {
    const { slug, content } = toMarkdown(entry);
    const out = resolve(outDir, `${slug}.md`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, content);
    console.log(`wrote ${out}`);
  }
  console.log(`\n${entries.length} entries imported.`);
  console.log(
    "Next: edit each file to mark self: true on your name + equal: true on co-first-authors.",
  );
}

main();
