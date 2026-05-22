import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "astro/zod";
import { loadPublications, type ParsedEntry } from "./bibtex";

const PubSchema = z.object({
  id: z.string(),
  anchor: z.string(),
  type: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  displayAuthors: z.string().optional(),
  venue: z.string().optional(),
  venueShort: z.string().optional(),
  track: z.string().optional(),
  date: z.date(),
  year: z.number(),
  tldr: z.string().max(220).optional(),
  paperurl: z.string().optional(),
  arxivurl: z.string().optional(),
  posterurl: z.string().optional(),
  slidesurl: z.string().optional(),
  codeurl: z.string().optional(),
  pdfurl: z.string().optional(),
  award: z.string().optional(),
  equalContribution: z.string().optional(),
  featured: z.boolean(),
  highlighted: z.boolean(),
  bibtex: z.string(),
});

export type Pub = z.infer<typeof PubSchema>;

function asBool(v: string | undefined): boolean {
  return v?.toLowerCase() === "true";
}

function renderInlineTeX(s: string | undefined): string | undefined {
  if (!s) return s;
  return s.replace(/\{\\dag\}/g, "†").replace(/\{\\ddag\}/g, "‡");
}

function mapEntry(entry: ParsedEntry): Pub {
  const f = entry.fields;
  return PubSchema.parse({
    id: entry.id,
    anchor: f.display_anchor ?? entry.id,
    type: entry.type,
    title: f.title,
    authors: entry.authors,
    displayAuthors: renderInlineTeX(f.display_authors),
    venue: f.booktitle ?? f.journal ?? f.note,
    venueShort: f.venue_short,
    track: f.track,
    date: entry.date,
    year: entry.date.getUTCFullYear(),
    tldr: f.tldr,
    paperurl: f.paperurl,
    arxivurl: f.arxivurl,
    posterurl: f.posterurl ?? f.poster,
    slidesurl: f.slidesurl ?? f.slides,
    codeurl: f.codeurl ?? f.code,
    pdfurl: f.pdf,
    award: f.awards ?? f.award,
    equalContribution: f.equal_contribution,
    featured: asBool(f.featured),
    highlighted: asBool(f.highlighted),
    bibtex: entry.bibtex,
  });
}

let cache: Pub[] | null = null;

export function getAllPubs(): Pub[] {
  if (cache) return cache;
  const bibPath = resolve(process.cwd(), "src/content/citations.bib");
  const src = readFileSync(bibPath, "utf8");
  const parsed = loadPublications(src).map(mapEntry);
  parsed.sort((a, b) => b.date.getTime() - a.date.getTime());
  cache = parsed;
  return parsed;
}

export function getFeaturedPubs(): Pub[] {
  return getAllPubs().filter((p) => p.featured);
}
