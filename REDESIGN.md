# Redesign Plan: qqgjyx.com → Astro

> **Status:** v7 — initial /grill-me → 4 ultrathink passes → 3-agent code-review → repo-naming lock. All same day, 2026-05-21.
> **New site repo:** `qqgjyx/qqgjyx.github.io` (magic-name convention; identity triple with handle + domain).
> **Future template repo (Phase C, if extracted):** `qqgjyx/academic-pages-astro`.
> **Currently serving qqgjyx.com:** `qqgjyx/juntang1129.github.io` (Jekyll fork; stays live during transition; stops being pushed-to after cutover but stays under current name).
> **Slot to free:** `qqgjyx/qqgjyx.github.io` (existing Hugo research-group starter) → rename to `qqgjyx/qqgjyx.github.io.archive` at Pre-flight.
> **Target domain:** `qqgjyx.com`. **GH Pages:** disabled on new repo; CF Pages serves production.

---

## TL;DR

Rebuild qqgjyx.com fresh in **Astro + Tailwind 4 + Inter + Cloudflare Pages**, replacing Jekyll/AcademicPages. Aesthetic: Barron-coded (sans, single-page scroll, ~1024px column, light + dark toggle). Content model: **BibTeX-first** (`citations.bib`) with optional per-paper override `.md` for `tldr`/`image`. Build-time everything; zero JS by default. Lighthouse target ≥95 perf, =100 on a11y/SEO/best-practices. 4 weekends to ship. Jekyll stays live; CNAME cuts over at end.

---

## 0. How to read this

- §1 — locked decisions
- §2 — feature additions
- §3 — architecture (file tree, schemas, components)
- §4 — hygiene
- §5 — content workflow
- §6 — execution sequence (4 weekends + Phase C)
- §7 — risk register
- §8 — templates evaluated
- §9 — references
- §10 — revision history
- §11 — still-open items
- §12 — bootstrapping a next session

---

## 1. Decisions locked

### 1.1 Framework
Astro (latest stable at scaffold, expected 5.x or 6.x). TypeScript strict.

### 1.2 Hosting
Cloudflare Pages. Auto-build on push to `master`. Per-PR preview deploys. CNAME `qqgjyx.com` → CF Pages.

### 1.3 Starter strategy
Blank Astro (`npm create astro@latest --template empty --typescript strict`). Reference astro-micro for layout, Scholar-Lite for BibTeX patterns. Do not fork either; copy ideas, not code. BibTeX parser: see Pre-flight §6.

### 1.4 Layout
- `/` — single-page scroll: bio → research interests → news → selected publications → projects → education → work → misc.
- `/publications/` — full bibliography, anchor-based.
- No multi-tab nav. Header: name + jump-to-anchors + CV + theme toggle + search.

### 1.5 Typography
Inter Variable via `@fontsource-variable/inter`. Fallback to system-ui. 16px base, 1.6 line-height. Hierarchy via Inter's weight axis; sizes set during Weekend 1 visual pass.

### 1.6 Theme
Light default + dark toggleable. Respects `prefers-color-scheme` on first visit; manual toggle persists to `localStorage` under key `theme`. Tailwind 4 `dark:` utilities; `dark` class on `<html>`. FOUC-prevention init script runs in `<head>` before paint.

### 1.7 Content width
`max-w-screen-lg` (1024px). Padding: 1.25rem mobile → 2rem desktop.

### 1.8 CSS strategy
Tailwind 4 via Astro's first-class Vite plugin. Design tokens in `@theme`. Complex components use `@layer components` plain CSS — hybrid by design.

### 1.9 Color palette

```css
@theme {
  --color-bg: #ffffff;
  --color-fg: #1a1a1a;
  --color-fg-muted: #595959;
  --color-link: #0055aa;
  --color-link-hover: #003875;
  --color-accent: #A51C30;   /* Harvard Crimson for awards */
  --color-rule: #e5e5e5;
  --color-card-bg: #fafafa;
}

html.dark {
  --color-bg: #0a0a0a;
  --color-fg: #e8e8e8;
  --color-fg-muted: #999999;
  --color-link: #7fb3ff;
  --color-link-hover: #a5cbff;
  --color-accent: #ff6080;
  --color-rule: #2a2a2a;
  --color-card-bg: #141414;
}
```

WCAG 2.2 AA contrast to verify with checker at scaffold (#0055aa on #fff is borderline for non-text 3:1).

### 1.10 Content model
**BibTeX-first.** Single source: `src/content/citations.bib`. Parser (selection at §6 Pre-flight) generates entries. Optional override `.md` in `src/content/publications/<cite-key>.md` provides `tldr`, `image`, custom `displayAuthors` HTML — only when needed. Body of override file unused.

**Important:** override file is optional. If a paper needs no override, it lives entirely in `citations.bib`. The schema (§3.2) makes only `id` (which equals the cite key) required.

### 1.11 Animation candidates
User-decided at content migration (Weekend 2). Default: static for all. No pre-selection.

### 1.12 tl;dr
1 sentence plain-English, ≤220 chars. Claude drafts starters from abstracts; user edits.

### 1.13 Research interests
Pill row above bio prose: AI for Science · Graph & Spectral Methods · Generative Models · Physics-aware Learning. Static labels; not clickable filters.

### 1.14 Code links
Populate `code` BibTeX field where public repo exists; omit otherwise. No "coming soon".

### 1.15 Projects
Featured (`mheatmap`, `sgtsnepi`): full PubCard treatment via content collection. Archived (3 URLs): flat `<ul>` in `src/data/archived.ts`. Single mechanism — no `archived: bool` flag on the projects collection.

### 1.16 URLs preserved
- `/` homepage, `/publications/` full list with `#anchor`, `/files/resume*.pdf`, `/404.html`, `/sitemap.xml`, `/rss.xml`, `/publications.bib`.
- No per-pub pages. Zero SEO migration impact: indexed URLs unchanged.

### 1.17 Inline data files
- `src/data/news.ts` — `{date: string, body: string, link?: string}[]`. ISO 8601 date, displayed as "May 2026".
- `src/data/education.ts`, `src/data/work.ts`, `src/data/research.ts`, `src/data/links.ts`, `src/data/archived.ts`.

### 1.18 Disabled in v1
Talks, Teaching, Blog — all stay disabled (consistent with current Jekyll). The 3 TA roles get dropped or moved to CV PDF.

### 1.19 CV
EN + CN PDFs (`/files/resume.pdf`, `/files/resume_zh.pdf`). No HTML CV in v1.

### 1.20 Footer
```
© 2026 Juntang Wang · last updated YYYY-MM-DD
[Source on GitHub] [Built with Astro]
```
"Last updated" is baked at build via `import.meta.env.BUILD_DATE`.

### 1.21 Analytics
**Off. Never.** No analytics in v1 or v1.5. If signal becomes useful, server-log analysis is acceptable; no client-side trackers.

### 1.22 Repo strategy

**Names (locked):**
- New site: `qqgjyx/qqgjyx.github.io` (Astro, this build).
- Currently-serving Jekyll: `qqgjyx/juntang1129.github.io` (your fork; stays as-is post-cutover).
- Old Hugo starter: `qqgjyx/qqgjyx.github.io.archive` (renamed at Pre-flight to free the magic-name slot).
- Future template (Phase C, if extracted): `qqgjyx/academic-pages-astro`.

**Phases:**
- **Pre-flight:** Rename existing `qqgjyx/qqgjyx.github.io` → `qqgjyx/qqgjyx.github.io.archive`. Create empty new `qqgjyx/qqgjyx.github.io`. Connect CF Pages.
- **Phase A (Weekends 1-3):** Build in new repo. Jekyll repo untouched, keeps serving qqgjyx.com.
- **Phase B (Weekend 4, cutover):** Disable GH Pages on Jekyll repo (or remove its CNAME). Set CF Pages custom domain → qqgjyx.com on new repo. DNS CNAME updates. Jekyll repo stays under current name, just stops being pushed-to.
- **Phase C (4 weeks post-launch):** `RETRO.md`. Template extraction only if (a) ≥3 papers request the template OR (b) you've added ≥2 features Scholar-Lite/astro-micro lack. Else drop template ambition.

### 1.23 License
- Code: **MIT**.
- Content (markdown text, images): **CC-BY-4.0**.
- `LICENSE` at repo root with both SPDX identifiers.

### 1.24 Visual identity
Keep current profile photo, favicon set, PWA manifest. No personal monogram.

### 1.25 i18n
**Defer to v1.5.** Not stubbed in v1. Astro i18n is a ~1-day add when CN content actually exists; pre-stubbing adds drift risk.

---

## 2. Feature additions

### 2.1 OG image
**Single static OG image** for v1 (one PNG covering the whole site). Dynamic per-page generation (astro-og-canvas) deferred to v1.5 if share-preview matters.

### 2.2 Pagefind search
Bound to `Cmd/Ctrl+K`. Modal autofocuses input. Lazy-loads index on first open. Indexes HTML routes; skip `/og/` and `/files/`.

### 2.3 BibTeX export
"📋 cite" button per PubCard copies that entry's BibTeX to clipboard; 2s "Copied!" feedback. `/publications.bib` endpoint emits aggregate.

### 2.4 Image optimization via `astro:assets`
`<Image>` for thumbnails — auto WebP, responsive srcset, lazy. `<Picture>` for hero where AVIF justifies bytes. Source images in `src/assets/` or `src/content/publications/_images/`.

### 2.5 RSS feed
`@astrojs/rss` for News section. Auto-discoverable via `<link rel="alternate">` in head.

### 2.6 CITATION.cff
Repo-root file → GitHub "Cite this repository" button. Author = Juntang Wang.

### 2.7 Performance & a11y budget
- Lighthouse ≥95 Performance, =100 A11y/Best-Practices/SEO. Cutover gate.
- Bundle: <50KB CSS, <20KB JS first paint. Pagefind lazy-loads.
- Semantic HTML (`<article>` per pub, `<time datetime>` for dates).
- Skip-to-main on keyboard focus.
- Respect `prefers-reduced-motion`: swap animated thumbnails to poster image when set.

### 2.8 Print stylesheet
Hide nav/footer/search/theme-toggle/video. Show pub list with full citations. Avoid page-breaks inside cards.

### 2.9 Math rendering
Use HTML `<sub>` / `<sup>` for the rare subscript (e.g. LK99 `Pb<sub>10-x</sub>Cu<sub>x</sub>(PO<sub>4</sub>)<sub>6</sub>O`). KaTeX integration deferred — one paper with subscripts doesn't justify the dep + CSS-scoping uncertainty.

### 2.10 CF Pages `_headers`
Standard security + cache config in `public/_headers`: CSP with `'unsafe-inline'` for the theme-init script (deliberate tradeoff vs. nonce-based), `nosniff`, `frame-deny`, `referrer-policy`, `permissions-policy`. `_astro/*` immutable cache (automatic but explicit).

### 2.11 Sitemap, robots.txt, manifest
`@astrojs/sitemap`. `robots.txt` allows all except `/og/`. PWA manifest carried over.

### 2.12 View Transitions
**Deferred.** A 2-page site doesn't justify `<ClientRouter />` runtime JS. Revisit if `/projects/` becomes a separate route or volume grows.

### 2.13 Scholar tags for indexing
`<meta name="citation_*">` Google Scholar tags on each publication anchor for indexing. Single component, build-time. **NEW in v6.**

---

## 3. Architecture

### 3.1 File tree (directory level)

```
juntang-site/
├── astro.config.mjs, package.json, tsconfig.json, biome.json
├── README.md, LICENSE, CITATION.cff, REDESIGN.md
├── public/                      # static assets, _headers, robots.txt, manifest, CNAME, files/*.pdf
└── src/
    ├── content.config.ts         # collection schemas (§3.2)
    ├── content/
    │   ├── citations.bib         # BibTeX source of truth
    │   ├── publications/         # per-paper override .md + _images/
    │   └── projects/             # per-project .md + _images/
    ├── data/                     # inline TS data: news, education, work, research, links, archived
    ├── components/               # PubCard, ProjectCard, Header, Footer, ThemeToggle, SearchTrigger, SearchModal, NewsList, EducationRow, WorkRow, PillRow, BibtexButton, ScholarMeta
    ├── layouts/                  # Base.astro, Page.astro
    ├── pages/                    # index, publications, 404, rss.xml.ts, publications.bib.ts
    ├── lib/                      # bibtex.ts (parser per §6 Pre-flight), pubs.ts, theme.ts
    ├── styles/global.css         # Tailwind import, @theme, @layer base/components
    └── assets/profile.webp
```

### 3.2 Content collection schemas

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: ({ image }) => z.object({
    // Identity (required)
    id: z.string(),              // equals BibTeX cite key
    anchor: z.string(),           // URL fragment

    // Bibliographic (optional; derived from BibTeX, override-able)
    title: z.string().optional(),
    authors: z.array(z.string()).optional(),
    displayAuthors: z.string().optional(),    // HTML
    venue: z.string().optional(),
    venueShort: z.string().optional(),
    track: z.string().optional(),
    date: z.coerce.date(),                    // REQUIRED; sort depends on it

    // Visual
    image: image().optional(),
    imageAlt: z.string().optional(),
    video: z.string().optional(),             // path to MP4
    videoPoster: z.string().optional(),

    // Copy
    tldr: z.string().max(220).optional(),

    // Links
    paperurl: z.string().url().optional(),
    arxivurl: z.string().url().optional(),
    posterurl: z.string().url().optional(),
    slidesurl: z.string().url().optional(),
    codeurl: z.string().url().optional(),

    // Display flags
    award: z.string().optional(),
    featured: z.boolean().default(false),
    highlighted: z.boolean().default(false),

    // Raw BibTeX for copy button (populated by parser)
    bibtex: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    id: z.string(),
    anchor: z.string(),
    title: z.string(),
    tagline: z.string(),
    image: image().optional(),
    imageAlt: z.string().optional(),
    badge: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })),
    featured: z.boolean().default(false),
  }),
});

export const collections = { publications, projects };
```

Changes from v5: `date` is required (was optional — sort would crash); no `year` field (derive `date.getFullYear()`); no duplicate `video`/`videourl`; no `archived` flag on projects (use `src/data/archived.ts`); `bibtex` field added so PubCard can hand it to the copy button.

### 3.3 BibTeX entry conventions

Cite key: `<lastname><year><shortname>`, lowercase, no separators. Examples: `wang2026stageguard`, `wang2026mixconfig`. **Override file name matches cite key** (e.g. `wang2026stageguard.md`, not `stageguard.md`).

Custom fields the parser must preserve: `pdf`, `code`, `poster`, `slides`, `video`, `project`, `awards`, `equal_contribution`, `display_anchor`, `featured`. Verify at Pre-flight (§6).

### 3.4 `<PubCard>` component contract

```typescript
interface PubCardProps {
  pub: CollectionEntry<'publications'>;
  variant?: 'full' | 'compact';
  showThumb?: boolean;
}
```

Renders: optional thumb (image or `<video autoplay muted loop playsinline poster>`) + title link + authors HTML + venue/year/award line + tl;dr + links row (paper / arXiv / poster / slides / code + cite-button). `year` derived as `pub.data.date.getFullYear()`. `bibtex` read from `pub.data.bibtex` for the copy button. Implementation lives in `src/components/PubCard.astro`.

### 3.5 `<Header>` design

Desktop (≥768px): name left, jump-anchors + CV + 🔍 + ☀/🌙 right. Mobile: name + 🔍 + ☀/🌙 + ☰ hamburger. Sticky on scroll with backdrop-blur.

### 3.6 Mobile breakpoints

| Width | PubCard layout | Header |
|---|---|---|
| <640px | Thumb on top, text below, full-width | Hamburger nav |
| 640–768px | Thumb left ~180px + text right | Hamburger nav |
| ≥768px | Thumb left 280px + text right | Full nav |

Tailwind defaults: `sm:` 640, `md:` 768, `lg:` 1024.

### 3.7 Per-page metadata

`Base.astro` props: `title`, `description`, `ogImage`, `ogType`, `noIndex`, `lang`, `className`. Each page overrides only what it needs.

### 3.8 Tooling

- **pnpm** package manager.
- **biome** formatter + linter, default rules.
- **GitHub Actions** CI: `pnpm install`, `pnpm typecheck`, `pnpm build` on PR. Block merge on fail.

Conventional Commits, Renovate, lefthook pre-commit hooks, bundle analyzer — **deferred to Phase C template extraction**. Personal-site stage doesn't need them.

---

## 4. Hygiene — what drops from Jekyll

- `_pages/teaching.html`, `_pages/talks.html`, `_pages/category-archive.html`, `_pages/tag-archive.html` — dead code.
- `site_theme: "default"` in `_config.yml` — inert.
- Frontmatter flags (`mathjax`, `plotly`, `mermaid`) — replaced by Astro islands.
- All of `_includes/`, `_layouts/`, `_sass/`, jQuery, FitVids.

What carries over: 6 pubs → `citations.bib` + optional override `.md`s; projects → `src/content/projects/` + `src/data/archived.ts`; news/edu/work → `src/data/*.ts`; profile photo → `src/assets/`; logos → `src/assets/`; PDFs → `public/files/`; favicon + manifest → `public/`.

---

## 5. Content workflow

### 5.1 Adding a new paper

1. Add BibTeX entry to `src/content/citations.bib` with custom fields (`pdf`, `code`, `awards`, `display_anchor`, `featured`, etc. — full list in §3.3).
2. **If overrides needed:** create `src/content/publications/<cite-key>.md` with frontmatter (`tldr`, `image`, custom `displayAuthors` HTML).
3. Place hero image (if any) in `_images/<cite-key>.{webp,mp4}`.
4. Commit, push. CF Pages auto-deploys.
5. Optionally update `src/data/news.ts`.

### 5.2 Image extraction recipe

Crop Figure 1 / teaser to 16:9 in Preview. `magick input.png -strip -resize 1280x720^ -gravity center -extent 1280x720 -quality 90 output.webp`. Place in `_images/<cite-key>.webp`. For rare animations: `ffmpeg -i input.mov -vf "scale=1280:720,fps=15" -c:v libx264 -crf 28 -pix_fmt yuv420p output.mp4` + poster frame as WebP.

### 5.3 Content freeze
Jekyll is source of truth for production until cutover. New papers during build period: add to both repos. After cutover: only `juntang-site`.

### 5.4 Pre-launch checklist
Maintained as a **GitHub issue** at cutover time, not in this doc. Standard items: Lighthouse thresholds passing, OG validity, RSS validity, HTTPS active, sitemap submitted, iOS Safari video autoplay verified, dark mode persists, Cmd+K search works, BibTeX copy works, hash anchors scroll correctly, 404 returns 404.

### 5.5 Testing strategy

Four layers:
1. **TypeScript + Zod** validate frontmatter at build — schema mismatch fails build.
2. **Biome** lint/format runs on `pnpm dev` and CI.
3. **GitHub Actions** runs build + Lighthouse CI on PR.
4. **Manual cross-browser** before cutover: iOS Safari (video autoplay, dark mode touch), Android Chrome, desktop Chrome/Firefox/Safari (incl. print preview).

No unit tests in v1. Components are presentational; Zod catches data issues; Lighthouse catches regressions.

---

## 6. Execution sequence

### Pre-flight (≤2h, **blocking gate**)

1. **Free the magic-name slot.** `gh repo rename qqgjyx/qqgjyx.github.io qqgjyx.github.io.archive` (or via GitHub UI). Disable GH Pages on the renamed repo if it was enabled. Reversible if needed.
2. **Create new empty repo.** `gh repo create qqgjyx/qqgjyx.github.io --public --description "Personal academic site — Astro rebuild"`. No README/license yet; Astro init will populate.
3. **BibTeX parser spike.** Pick a real BibTeX draft and verify custom-field preservation in priority order: `@citation-js/core` → `@retorquere/bibtex-parser` → hand-rolled regex copying Scholar-Lite's pattern. Lock the choice. ~30 min.
4. **CF Pages project** pointed at new empty repo. Get staging URL `qqgjyx-github-io.pages.dev` (auto-generated). **Disable** GH Pages on the new repo — CF only.

### Weekend 1 — Scaffolding

```bash
pnpm create astro@latest juntang-site --template empty --typescript strict
pnpm astro add tailwind
pnpm add @fontsource-variable/inter astro-pagefind @astrojs/rss @astrojs/sitemap
pnpm add -D @biomejs/biome
# + BibTeX parser per Pre-flight
```

Configure: `astro.config.mjs`, Tailwind `@theme`, `Base.astro` layout with Header/Footer/theme-init script. Stub `src/data/` files. Wire CF Pages deploy: push, verify staging URL serves placeholder.

**MVP cut line:** if Weekend 1 ends without staging deploy working, pause and debug before continuing.

### Weekend 2 — Content migration

- Generate `citations.bib` from existing `_publications/*.md` frontmatter (one-time script or manual).
- Build `<PubCard>`, `<ProjectCard>`, page-level components.
- Wire homepage and `/publications/`.
- Migrate news/edu/work data to TS files.
- User extracts 6 hero figures. Claude drafts 6 tl;dr starters; user edits.

**MVP cut line:** if pubs and homepage render correctly by end of weekend, ship-able. Polish can defer to W3 or v1.5.

### Weekend 3 — Polish (prioritized MVP)

Must-have (cut others if time runs out):
- Dark mode CSS + toggle.
- Pagefind integration + Cmd+K modal.
- A11y audit + Lighthouse iteration to ≥95/100/100/100.

Nice-to-have (defer to v1.5 if time-constrained):
- BibTeX clipboard button per card.
- RSS feed.
- Print stylesheet.
- Scholar `<meta name="citation_*">` tags.

Deferred entirely from v1 (per §2): View Transitions, dynamic OG, KaTeX, i18n stubs.

### Weekend 4 — Cutover

Friend review on staging (2–3 reviewers, your pick). Fix feedback. Then:
1. Disable GH Pages on `qqgjyx/juntang1129.github.io` (or remove its `CNAME` file via commit) — releases the `qqgjyx.com` claim.
2. CF Pages custom domain → `qqgjyx.com` on new repo. DNS at registrar: CNAME `qqgjyx.com` → CF Pages target. Lower TTL 24h prior; pick low-traffic window.
3. Wait propagation (~minutes to hours). Verify HTTPS, share preview, all link paths.
4. Submit updated sitemap to Google Search Console (new sitemap URL).
5. Update memory files. `qqgjyx/juntang1129.github.io` stays under current name, just stops being pushed-to.

### Phase C — 4-week retro + template decision
Live with site 4 weeks. Write `RETRO.md`. Extract `academic-pages-astro` only per §1.22 criteria.

### MVP hard cut date
**2026-08-15.** If not cut over by then, Jekyll stays live indefinitely; Astro rebuild resumes during a future free window. Don't push it into the MS term.

---

## 7. Risk register

| # | Risk | Sev | Mitigation |
|---|---|---|---|
| 1 | Time runs out before MS starts | **High** | Hard cut date 2026-08-15. MVP cut lines in §6. Jekyll fallback. |
| 2 | BibTeX parser custom fields fail | **High** | Pre-flight blocking gate (§6). 3-option fallback chain locked. |
| 3 | Image extraction blocked (no figure available) | Med | Text-only card fallback OR `<sub>`-styled title-only. |
| 4 | New paper during build period | Med | Add to both repos until cutover. |
| 5 | Schema `date` required but BibTeX entry lacks year | Low | Required field forces a fix at the entry, not at render time. |
| 6 | Lighthouse <95 perf at audit | Med | Image budget, font preload, defer non-critical JS. Iterate W3. |
| 7 | DNS cutover downtime | Low | Lower TTL 24h prior; pick low-traffic window. |
| 8 | iOS Safari video autoplay fails | Low | `playsinline` + `muted` + poster; tested in W4 cross-browser pass. |
| 9 | CSP `'unsafe-inline'` hurts Best Practices score | Low | Accept tradeoff (theme-init script); or move to nonce post-launch. |
| 10 | `qqgjyx.com` domain renewal lapses | Low | Confirm auto-renew at registrar pre-cutover. |

Lower-likelihood / lower-impact risks (CF Pages free-tier hit, abandonment of Astro libs, reader feedback negative) deliberately dropped from the register — they're not action-prompting.

---

## 8. Templates evaluated

| Template | Stars | Stack | Verdict |
|---|---|---|---|
| **Scholar-Lite** | 20 | Astro 6 + Tailwind 4 + Pagefind + BibTeX | Reference for BibTeX patterns. Demo is lab-focused — don't fork the layout. |
| **astro-micro** | 517 | Astro + Tailwind | Reference for layout proportions, dark mode toggle, typography. Don't fork. |

Also evaluated and rejected: Lumina (small/themed), astro-theme-scholars (UnoCSS, cards+gradients), Astro Scholar (team-focused), Astro Academia, academic-project-astro-template (Nerfies paper-page style), DoubleDuckLab (bilingual lab).

---

## 9. References

- Astro: [Content Collections](https://docs.astro.build/en/guides/content-collections/), [astro:assets](https://docs.astro.build/en/reference/modules/astro-assets/), [Cloudflare Pages](https://docs.astro.build/en/guides/deploy/cloudflare/), [fonts](https://docs.astro.build/en/guides/fonts/)
- [Scholar-Lite repo](https://github.com/fjd2004711/scholar-lite) (BibTeX patterns)
- [astro-micro](https://github.com/trevortylerlee/astro-micro) (layout reference)
- [Inter font](https://rsms.me/inter/)
- [Pagefind for Astro](https://github.com/shishkin/astro-pagefind)
- [@citation-js/core](https://citation.js.org) | [@retorquere/bibtex-parser](https://www.npmjs.com/package/@retorquere/bibtex-parser)
- [Tailwind 4 + Astro](https://tailkits.com/blog/astro-tailwind-setup/)
- [SEO migration 2026](https://www.helloroketto.com/articles/site-migration-seo)
- Visual: [jonbarron.info](https://jonbarron.info/), [people.csail.mit.edu/kaiming](https://people.csail.mit.edu/kaiming/), [daeunni.github.io](https://daeunni.github.io/), [people.eecs.berkeley.edu/~ericqu](https://people.eecs.berkeley.edu/~ericqu)

---

## 10. Revision history

- **v1** (initial /grill-me, 13 questions): blank Astro, single-page scroll, sans, light only, vanilla CSS, GH Pages, animated WebP, 160-char tl;dr.
- **v2** (ultrathink pass 1): GH→CF Pages, animated WebP→MP4, tl;dr 160→220, +8 features, 3 RECONFIRMs flagged.
- **v3** (ultrathink pass 2 — research): starter → Scholar-Lite fork (reverted in v4), dark mode kept, Tailwind 4, Inter font, BibTeX-first model, color palette, mobile specs.
- **v4** (ultrathink pass 3 — verification): starter reverted to blank Astro after Scholar-Lite demo verified as lab-focused. Architecture section added (file tree, schemas, components).
- **v5** (ultrathink pass 4): TL;DR added; KaTeX, CF headers, implementation micro-details, testing strategy, pre-launch checklist. Locked-stop pinned.
- **v6** (code-review pass — 3 agents): Fixed schema (`date` required, `year` derived, dup fields removed); resolved archived-projects double-definition (data file only, no schema flag); fixed `<PubCard>` props (`bibtex` from `pub.data`); BibTeX parser made blocking pre-flight gate; cite-key convention enforced uniformly; dropped KaTeX, View Transitions, dynamic OG, i18n-stub (gold-plating for site's scale); analytics firmed to "off, ever"; tooling trimmed to pnpm+biome+CI (deferred Renovate/lefthook/Conventional Commits to Phase C); §3.7 homepage code dump removed (lives in actual file); §5.6 checklist moved to GitHub issue; §10 compressed to one-line entries; §8 templates compressed; +§2.13 Scholar `<meta>` tags; +§6 MVP cut lines + hard cut date 2026-08-15; +§7 risk #10 domain renewal; doc length reduced from 1148 → ~600 lines.
- **v7** (repo-naming lock): Verified gh state — `qqgjyx/qqgjyx.github.io` existed (Hugo research-group starter), `qqgjyx/juntang1129.github.io` is the actual current Jekyll site (fork of upstream `juntang1129/juntang1129.github.io`). New repo locked as **`qqgjyx/qqgjyx.github.io`** (magic-name slot); old Hugo starter renamed to `.archive` at Pre-flight to free the slot. Old Jekyll fork stays under current name after cutover (no rename — user pref). GH Pages disabled on new repo (CF only, one source of truth). Future template = `qqgjyx/academic-pages-astro`. Pre-flight + Weekend 4 sequences updated with concrete `gh` commands.

---

## 11. Still-open items

Only one item is truly open:

- **Friend-review reviewers** (Weekend 4) — you pick 2–3 collaborators.

CN-content rollout (deferred entirely per §1.25), template extraction (decision per §1.22 / Phase C criteria), and BibTeX parser choice (locked via Pre-flight gate §6) are no longer "open" — they're scheduled.

---

## 12. Next-session bootstrapping

1. Read this `REDESIGN.md` first.
2. Read memory files at `~/.claude/projects/D--OneDrive---Harvard-University-Documents--Projects-juntang1129-github-io/memory/` (user profile, design philosophy, transitional state).
3. Begin §6 Pre-flight, then Weekend 1.
