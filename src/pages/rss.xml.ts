import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context: APIContext) {
  const news = (await getCollection("news")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? "https://www.qqgjyx.com",
    items: news.map((item) => {
      const body = item.body?.trim() ?? "";
      const plain = body
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_`]/g, "");
      const title =
        plain.length > 80 ? `${plain.slice(0, 77).trim()}...` : plain;
      // Absolute URL per item, unique by anchor or entry id. Absolute links
      // bypass @astrojs/rss's trailing-slash mangling (which produced
      // "/#anchor/"), and the id fallback keeps anchorless items' guids unique.
      const slug = (item.data.link ?? `#${item.id}`).replace(/^#/, "");
      const link = new URL(
        `#${slug}`,
        context.site ?? "https://www.qqgjyx.com",
      ).toString();
      return {
        title,
        pubDate: item.data.date,
        description: body,
        link,
      };
    }),
  });
}
