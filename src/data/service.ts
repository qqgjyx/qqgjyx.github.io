/**
 * Service & Leadership. Each entry's title supports the same inline markdown
 * subset as honors: **bold**, *italic*, [text](url). Org + link live inside
 * title rather than as separate fields, which keeps the comma spacing clean
 * (no JSX whitespace gap between title and org expressions).
 */
export interface ServiceEntry {
  title: string;
}

export const service: readonly ServiceEntry[] = [
  {
    title: "Reviewer, [NeurIPS 2026](https://neurips.cc/Conferences/2026)",
  },
  {
    title:
      "Resident Assistant, Orientation Peer, Kendo Club Training Leader, [Duke](https://duke.edu) & [DKU](https://www.dukekunshan.edu.cn)",
  },
] as const;
