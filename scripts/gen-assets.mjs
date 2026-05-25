// Generates the static branded assets from the JT monogram: the 1200x630
// social-share card (public/og-card.png) and the PWA icons (public/icon-192.png,
// public/icon-512.png). Run once when the monogram, name, or tagline changes:
//   node scripts/gen-assets.mjs
// Output PNGs are committed; CI never regenerates them.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = (f) => resolve(root, "public", f);

// JT glyph from public/favicon.svg (viewBox 0 0 100 100).
const JT =
  "M28.67 53.53 28.78 57.39Q28.83 59.71 29.89 60.88Q30.94 62.05 33.08 62.05Q35.45 62.05 36.52 60.77Q37.59 59.48 37.59 56.59V30.92H46.06V56.00Q46.06 60.71 44.66 63.57Q43.25 66.43 40.29 67.76Q37.33 69.08 32.56 69.08Q28.80 69.08 26.28 67.90Q23.76 66.71 22.47 64.33Q21.18 61.95 21.10 58.32L21.00 53.53ZM42.27 37.90H23.11V30.92H42.27Z M61.69 68.52V30.92H70.17V68.52ZM52.83 30.92H79.00V37.90H52.83Z";

// Catppuccin Mocha
const BASE = "#1e1e2e";
const MAUVE = "#cba6f7";
const TEXT = "#cdd6f4";
const SUBTEXT = "#a6adc8";
const OVERLAY = "#6c7086";
const FONT = '"Monaspace Neon", ui-monospace, "DejaVu Sans Mono", monospace';

// 1200x630 social card: Mauve monogram tile + name + tagline on Mocha.
const ogCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BASE}"/>
  <g transform="translate(120,200) scale(2.3)">
    <rect width="100" height="100" rx="12" ry="12" fill="${MAUVE}"/>
    <path fill="${BASE}" d="${JT}"/>
  </g>
  <text x="400" y="300" font-family='${FONT}' font-size="92" font-weight="600" fill="${TEXT}">Juntang Wang</text>
  <text x="400" y="372" font-family='${FONT}' font-size="44" fill="${SUBTEXT}">AI for Science</text>
  <text x="402" y="440" font-family='${FONT}' font-size="30" fill="${OVERLAY}">王俊棠 · www.qqgjyx.com</text>
</svg>`;

// Square PWA icon: centered Mauve JT on a full Mocha tile (safe for masking).
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BASE}"/>
  <g transform="translate(106,106) scale(3)">
    <path fill="${MAUVE}" d="${JT}"/>
  </g>
</svg>`;

await sharp(Buffer.from(ogCard)).png().toFile(out("og-card.png"));
await sharp(Buffer.from(icon)).resize(512, 512).png().toFile(out("icon-512.png"));
await sharp(Buffer.from(icon)).resize(192, 192).png().toFile(out("icon-192.png"));
console.log("Wrote og-card.png, icon-512.png, icon-192.png");
