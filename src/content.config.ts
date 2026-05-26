import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";

const bio = defineCollection({
  loader: glob({ pattern: "bio.md", base: "./src/content" }),
  schema: z.object({
    // Stable public URL (e.g. /images/profile.webp) — served untouched, also
    // preserves the old site's image link. Not processed via astro:assets.
    photo: z.string().optional(),
    role: z.string().optional(),
  }),
});

const pubs = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/pubs" }),
  schema: z.object({
    title: z.string(),
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
    venue: z.string().optional(),
    venueShort: z.string().optional(),
    track: z.string().optional(),
    award: z.string().optional(),
    venueHighlight: z.boolean().default(false),
    links: z
      .object({
        paper: z.string().optional(),
        arxiv: z.string().optional(),
        code: z.string().optional(),
        poster: z.string().optional(),
        pdf: z.string().optional(),
      })
      .optional(),
    // Hero filename in src/assets/images/ — raster (.webp) via <Image>, or an
    // inline-themed .svg (currentColor follows the theme). Resolved by PubEntry.
    hero: z.string().optional(),
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
  schema: ({ image }) =>
    z.object({
      school: z.string(),
      degree: z.string(),
      start: z.string(),
      end: z.string().optional(),
      location: z.string().optional(),
      logo: image().optional(),
      url: z.string().optional(),
    }),
});

const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/work" }),
  schema: ({ image }) =>
    z.object({
      org: z.string(),
      role: z.string(),
      start: z.string(),
      end: z.string().optional(),
      location: z.string().optional(),
      logo: image().optional(),
      url: z.string().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    role: z.string().optional(),
    stars: z.string().optional(),
    github: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const teaching = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/teaching" }),
  schema: z.object({
    course: z.string(),
    role: z.string(),
    instructor: z.string().optional(),
    instructorUrl: z.string().optional(),
    start: z.string(),
    end: z.string().optional(),
  }),
});

const honors = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/honors" }),
  schema: z.object({
    order: z.number(),
  }),
});

const service = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/service" }),
  schema: z.object({
    order: z.number(),
  }),
});

export const collections = {
  bio,
  pubs,
  news,
  education,
  work,
  teaching,
  projects,
  honors,
  service,
};
