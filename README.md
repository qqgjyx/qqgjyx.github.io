# qqgjyx-academic

An Astro template for academic personal sites. Catppuccin palette, Monaspace
typography, markdown-driven content (including publications), zero JS by
default, Lighthouse 100.

The demo at [qqgjyx.com](https://qqgjyx.com) is this template, populated.

## Features

- **Catppuccin Latte + Mocha** palette, spec-strict mappings — Blue links, Sky
  hover, Surface 0 cards, Overlay 0 dividers, Mauve brand accent. Auto via
  `prefers-color-scheme`; CSS-only sun/moon toggle to override.
- **Monaspace Neon** full-mono typography, loaded via Astro Fonts API as a
  variable woff2. Texture healing + `ss01`/`ss02` stylistic sets enabled.
  Legibility mitigations: 1.65 line-height, 68ch body width, 380 weight axis.
- **Markdown everywhere.** Publications, news, education, work, misc — all
  edited as one markdown file per entry. Adopters fork, swap in their content,
  done.
- **BibTeX → markdown converter** at `scripts/import-bib.mjs`. Drop your real
  `.bib` in, run one command, get a typed publication collection.
- **Astro Content Layer API** with Zod schemas (type-safe content + frontmatter
  validation at build time).
- **RSS + sitemap** generated automatically.
- **astro-icon + Lucide** for monochrome icon list under the photo.
- **No top nav, no theme-toggle UI clutter** — Barron-coded restraint.
- **No JavaScript** in the default build (the only inline script is a tiny
  CSP-friendly image-fallback delegator).
- **GitHub "Use this template"** button — no npm install dance.

## Quickstart

```bash
git clone https://github.com/qqgjyx/qqgjyx.github.io.git my-site
cd my-site
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321). Edit content in
`src/content/` and `src/consts.ts`. See [`docs/CUSTOMIZING.md`](docs/CUSTOMIZING.md).

## Stack

Astro 6 · Tailwind 4 · TypeScript · Catppuccin · Monaspace · Lucide

## Docs

- [`docs/CUSTOMIZING.md`](docs/CUSTOMIZING.md) — adopter guide: change name, bio,
  social links, add a pub, change accent
- [`docs/DEPLOYING.md`](docs/DEPLOYING.md) — Cloudflare Pages, GitHub Pages, Vercel,
  Netlify
- [`docs/RATIONALE.md`](docs/RATIONALE.md) — design rationale for the
  Catppuccin + Monaspace direction

## License

MIT. See [`LICENSE`](LICENSE).
