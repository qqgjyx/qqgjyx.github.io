export interface NewsItem {
  date: string;
  body: string;
  link?: string;
}

export const news: NewsItem[] = [
  {
    date: "2026-05",
    body: "StageGuard accepted at KDD 2026 (AI for Science Track, inaugural).",
  },
  { date: "2026-05", body: "MixConfig accepted at ICML 2026." },
  { date: "2025-11", body: "InfantConfig accepted at BICS 2025 (Oral)." },
];
