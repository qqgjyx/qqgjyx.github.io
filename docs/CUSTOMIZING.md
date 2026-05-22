# Customizing

The 5-minute path to making this template yours.

## 1. Identity — `src/consts.ts`

Edit `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL`, `SOCIAL_LINKS`. The social
links render as a vertical icon column under your photo. Icons use
[Lucide](https://lucide.dev/icons) via Iconify — name pattern is
`lucide:<icon-name>`.

```ts
export const SOCIAL_LINKS = [
  { label: "GitHub", url: "https://github.com/you", icon: "lucide:github" },
  { label: "Scholar", url: "https://scholar.google.com/citations?user=...", icon: "lucide:graduation-cap" },
  { label: "Email", url: "mailto:you@example.com", icon: "lucide:mail" },
];
```

Drop entries you don't want; add any platform with a Lucide icon name.

## 2. Bio — `src/content/bio.md`

Frontmatter sets photo path, role, affiliation. Body is your bio prose.
First-person + a little emoji is fine; Catppuccin's "soothing pastel for the
high-spirited" invites warmth.

```markdown
---
photo: /images/profile.webp
role: Your role
affiliation: Your affiliation
---

Hi, I'm <Name>. I work on …
```

Drop your photo at `public/images/profile.webp`. Until then, the photo slot
renders a "JW"-style initials fallback automatically.

## 3. Publications — three options

### Option A: write markdown directly

Create `src/content/pubs/<slug>.md` per paper. Slug becomes the in-page anchor
(`#stageguard`, etc.). Frontmatter shape is in `src/content.config.ts`.

### Option B: import from your existing `.bib` file

```bash
node scripts/import-bib.mjs path/to/your/citations.bib
```

This generates one `.md` per BibTeX entry. After running, edit each file to
mark `self: true` on your name and `equal: true` on co-first-authors (the
importer doesn't auto-detect "self" — names vary too much across BibTeX files).

### Option C: keep your `.bib` separate

This template doesn't read `.bib` directly anymore (deleted in W3). Run the
importer once per acceptance.

## 4. News, Education, Work, Misc

Each is a markdown file per entry under `src/content/<collection>/`. Frontmatter
schemas are in `src/content.config.ts`. News dates are ISO (`2026-05-16`); the
RSS feed and the homepage formatter render them as `[May 2026]`.

Add a news item:

```bash
cat > src/content/news/2026-09-01-harvard-starts.md <<EOF
---
date: 2026-09-01
---
Starting the MS in Data Science at **Harvard**.
EOF
```

## 5. Change the brand accent

Edit `src/styles/global.css` — replace the two `--color-accent` values (Latte
+ Mocha) with any Catppuccin accent from
[the palette](https://catppuccin.com/palette/):

```css
@theme {
  --color-accent: #8839ef;  /* Latte Mauve → change to Teal #179299, Peach #fe640b, etc. */
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-accent: #cba6f7;  /* Mocha Mauve → change to Teal #94e2d5, etc. */
  }
}
```

`BRAND` in `src/consts.ts` is documentation-only; the CSS is source of truth.

## 6. Change the flavor

To swap Latte→Frappé (softer light) or Mocha→Macchiato (in-between dark): edit
the hex values in `src/styles/global.css`. The
[Catppuccin palette page](https://catppuccin.com/palette/) lists all flavors.

## 7. Institution logos (education / work)

Drop your logos at `src/assets/images/edu/<slug>.webp` or `work/<slug>.webp`,
then reference them in the markdown frontmatter:

```markdown
---
school: Harvard University
degree: M.S. in Data Science
start: 2026-09
end: 2028-05
logo: /images/edu/harvard.webp
---
```

Until you add a logo, the row renders a Surface 0 box with the institution's
initial letter — no broken-image icons.

## 8. Want search?

Pagefind is intentionally not shipped (overkill for ~30 entries on a single
page). If your site grows past that, add it with one command:

```bash
pnpm dlx astro add astro-pagefind
```

Then wire a Cmd+K modal into `Base.astro`. The
[Pagefind docs](https://pagefind.app/) walk you through the UI.

## 9. Manual final-touch checklist

- [ ] Replace the favicon (`public/favicon.svg`, `public/favicon.ico`)
- [ ] Add a profile photo (`public/images/profile.webp`)
- [ ] Add an `og.png` (1200×630) at `public/og.png` and reference it in `Base.astro`
- [ ] Edit the footer copyright in `src/pages/index.astro`
- [ ] Update `.github/workflows/ci.yml` if your CI runner needs anything
- [ ] Set up your deploy target — see [`DEPLOYING.md`](DEPLOYING.md)
