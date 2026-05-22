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
    site: context.site ?? "https://qqgjyx.com",
    items: news.map((item) => {
      const body = item.body?.trim() ?? "";
      const plain = body
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_`]/g, "");
      const title =
        plain.length > 80 ? `${plain.slice(0, 77).trim()}...` : plain;
      const anchor = item.data.link ?? "";
      return {
        title,
        pubDate: item.data.date,
        description: body,
        link: anchor || "/",
      };
    }),
  });
}
