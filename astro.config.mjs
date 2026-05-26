// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://www.qqgjyx.com",
  integrations: [sitemap(), icon()],
  markdown: {
    // External links in markdown bodies (bio, news, projects) open in a new
    // tab with safe rel, matching the .astro components' link policy.
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener"] },
      ],
    ],
  },
  fonts: [
    {
      name: "Monaspace Neon",
      cssVariable: "--font-mono",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            weight: "200 800",
            style: "normal",
            src: ["./src/assets/fonts/MonaspaceNeonVar.woff2"],
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
