// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://qqgjyx.com",
  integrations: [sitemap(), icon()],
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
