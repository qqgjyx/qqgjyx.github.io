# Deploying

The static build (`pnpm build`) emits to `dist/`. Any static host works.

## Cloudflare Pages (recommended)

1. Connect the GitHub repo at [pages.cloudflare.com](https://pages.cloudflare.com).
2. Build command: `pnpm install --frozen-lockfile && pnpm build`
3. Build output directory: `dist`
4. Node version: 22 (set via `.nvmrc` automatically).
5. Custom domain: add yours in the CF Pages settings; CF handles SSL.

Why CF Pages: unlimited bandwidth on the free tier, preview deploys per PR,
faster CDN than GitHub Pages.

## GitHub Pages

1. Settings → Pages → Source: GitHub Actions.
2. Create `.github/workflows/deploy.yml` with the official Astro GH Pages
   action (see [docs.astro.build/en/guides/deploy/github](https://docs.astro.build/en/guides/deploy/github/)).
3. Custom domain via CNAME file in `public/` if desired.

Caveat: if your repo is `username.github.io`, the URL is `https://username.github.io`.
Set `site` in `astro.config.mjs` accordingly so canonical URLs + sitemap are
correct.

## Vercel

1. `pnpm dlx vercel` (interactive) or connect via the Vercel dashboard.
2. Vercel auto-detects Astro. No config needed.
3. Update `site` in `astro.config.mjs` to your Vercel URL.

## Netlify

1. Connect repo at [app.netlify.com](https://app.netlify.com).
2. Build command: `pnpm build`.
3. Publish directory: `dist`.

## After deploy

- Verify `/sitemap-index.xml` and `/rss.xml` are served (curl them).
- Submit sitemap to Google Search Console + Bing.
- Test light/dark by toggling OS appearance.
- Verify the sun/moon footer toggle still flips the palette.
