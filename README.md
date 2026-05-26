# qqgjyx.com

My personal academic site — [www.qqgjyx.com](https://www.qqgjyx.com). Astro,
Catppuccin palette, Monaspace full-mono typography, markdown-driven content
(publications, news, education, work), zero JS by default.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static output to dist/
pnpm check    # astro check (types + content)
```

Content lives in `src/content/` (one markdown file per entry) and `src/consts.ts`
(title, social links). The author→URL lookup for collaborator links lives in
`src/data/people.ts`.

The branded OG card (`public/og-card.png`) is a committed static asset, generated
once from the JT monogram in `public/favicon.svg`; regenerate by hand if the
monogram or tagline ever changes.

## Deploy

Pushes to `main` build and publish to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). After a deploy,
sanity-check that `/sitemap-index.xml` and `/rss.xml` are served and that the
light/dark toggle still flips the palette.

## Stack

Astro 6 · Tailwind 4 · TypeScript · Catppuccin · Monaspace Neon · Lucide (astro-icon)

## Design notes

Terse rationale for the major choices (draft — to be polished):

- **Purpose.** Content-first, durable, single-maintainer academic homepage.
  Radically minimal: every file/field/dep earns its place; prefer deletion.
- **Astro, zero-JS.** Static output; works without JavaScript (theme falls back
  to the OS preference). No client framework.
- **Deliberately omitted.** No page view-transitions (`<ClientRouter>`) or
  `prefetch` — single page, nothing to transition or prefetch. The theme toggle
  hard-cuts rather than animating, for restraint and to stay zero-JS.
- **Tailwind 4** via `@tailwindcss/vite` — utility-first styling, Preflight reset,
  only-used classes shipped.
- **Catppuccin Latte + Mocha.** Palette exposed as `@theme` tokens; auto via
  `prefers-color-scheme`, with a header toggle that sets `:root[data-theme]`
  (persisted to `localStorage`, applied pre-paint to avoid FOUC). Tokens map to
  the official spec roles; the few WCAG-AA deviations (emphasis → crimson, link
  hover → Mauve accent, Mauve selection) are documented at the top of `global.css`.
- **Monaspace Neon, full-mono.** Variable woff2 via the Astro Fonts API; texture
  healing (`calt`/`ss01`/`ss02`) + 1.6 line-height for legibility.
- **Content model.** Markdown-per-entry content collections (Zod-typed). Pub
  authors are structured (`authors[]` + `src/data/people.ts` for collaborator
  links); figure heroes are themeable SVGs (`currentColor` ink) auto-detected by
  filename, screenshots stay raster via `astro:assets`.
- **Assets.** `public/` holds stable-URL assets (favicons, OG card,
  `/files/*.pdf`, `/images/profile.*`); `src/assets/` holds images optimized by
  `astro:assets`.
- **Hosting.** GitHub Pages with custom domain `www.qqgjyx.com`. Per-paper
  project pages go in separate repos under the `qqgjyx` account (Pages on, no
  CNAME) so they serve at `qqgjyx.com/<repo>`.

## License

MIT. See [`LICENSE`](LICENSE).
