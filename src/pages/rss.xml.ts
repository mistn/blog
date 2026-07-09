import { getCollection, type CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRssDate(date: Date): string {
  return date.toUTCString();
}

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  const siteUrl = SITE.website.replace(/\/$/, "");

  const items = sortedPosts
    .map((post) => {
      const { data } = post;
      const path = getPath(post.id, post.filePath);
      const url = `${siteUrl}${path}`;
      const pubDate = new Date(data.modDatetime ?? data.pubDatetime);

      return `
    <item>
      <title>${escapeXml(data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(data.description)}</description>
      <pubDate>${formatRssDate(pubDate)}</pubDate>
    </item>`;
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <description>${escapeXml(SITE.desc)}</description>
    <link>${escapeXml(siteUrl)}/</link>
    <atom:link href="${escapeXml(siteUrl)}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
