/**
 * Honors & Awards. Each entry renders as a one-line bullet inside the
 * Miscellanea section. Order = listed order; put most-selective first.
 */
export interface Honor {
  title: string;
  year: string;
  note?: string;
  link?: string;
}

export const honors: readonly Honor[] = [
  {
    title:
      "Graduation with Distinction (Top 5%) *cum laude*, [Duke](https://duke.edu) & [DKU](https://www.dukekunshan.edu.cn)",
    year: "2026",
  },
  {
    title:
      "Dean's List with Distinction × 3 (Top 10%), [Duke](https://duke.edu) & [DKU](https://www.dukekunshan.edu.cn)",
    year: "2024",
  },
  {
    title:
      "Kaggle Bronze Medal (Top 8%), [Stanford RNA 3D Folding](https://www.kaggle.com/competitions/stanford-rna-3d-folding)",
    year: "2025",
  },
] as const;
