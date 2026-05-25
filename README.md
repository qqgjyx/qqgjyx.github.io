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
(title, social links). Design rationale is in [`docs/RATIONALE.md`](docs/RATIONALE.md).

The branded OG card and PWA icons are generated from the JT monogram:

```bash
node scripts/gen-assets.mjs   # rewrites public/og-card.png + icon-{192,512}.png
```

## Deploy

Pushes to `main` build and publish to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). After a deploy,
sanity-check that `/sitemap-index.xml` and `/rss.xml` are served and that the
light/dark toggle still flips the palette.

## Stack

Astro 6 · Tailwind 4 · TypeScript · Catppuccin · Monaspace · Lucide

## License

MIT. See [`LICENSE`](LICENSE).
