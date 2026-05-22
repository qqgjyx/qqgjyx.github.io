import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";

const bio = defineCollection({
  loader: glob({ pattern: "bio.md", base: "./src/content" }),
  schema: z.object({
    photo: z.string().optional(),
    role: z.string().optional(),
    affiliation: z.string().optional(),
  }),
});

const pubs = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/pubs" }),
  schema: z.object({
    title: z.string(),
    type: z.string(),
    date: z.coerce.date(),
    authors: z
      .array(
        z.object({
          name: z.string(),
          self: z.boolean().optional(),
          equal: z.boolean().optional(),
        }),
      )
      .optional(),
    displayAuthors: z.string().optional(),
    venue: z.string().optional(),
    venueShort: z.string().optional(),
    track: z.string().optional(),
    award: z.string().optional(),
    featured: z.boolean().default(false),
    highlighted: z.boolean().default(false),
    equalContribution: z.array(z.string()).optional(),
    links: z
      .object({
        paper: z.string().optional(),
        arxiv: z.string().optional(),
        code: z.string().optional(),
        poster: z.string().optional(),
        slides: z.string().optional(),
        pdf: z.string().optional(),
      })
      .optional(),
    tldr: z.string().max(220).optional(),
    hero: z.string().optional(),
    bibtex: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/news" }),
  schema: z.object({
    date: z.coerce.date(),
    link: z.string().optional(),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/education" }),
  schema: z.object({
    school: z.string(),
    degree: z.string(),
    start: z.string(),
    end: z.string().optional(),
    location: z.string().optional(),
    logo: z.string().optional(),
    url: z.string().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/work" }),
  schema: z.object({
    org: z.string(),
    role: z.string(),
    start: z.string(),
    end: z.string().optional(),
    location: z.string().optional(),
    logo: z.string().optional(),
    url: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    role: z.string().optional(),
    hero: z.string().optional(),
    featured: z.boolean().default(false),
    links: z
      .array(
        z.object({
          href: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
  }),
});

const archived = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/archived" }),
  schema: z.object({
    title: z.string(),
    url: z.string(),
    tagline: z.string().optional(),
  }),
});

const misc = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/misc" }),
  schema: z.object({
    order: z.number().default(0),
  }),
});

export const collections = {
  bio,
  pubs,
  news,
  education,
  work,
  projects,
  archived,
  misc,
};
