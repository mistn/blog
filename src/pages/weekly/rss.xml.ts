import { getCollection, type CollectionEntry } from "astro:content";
import { getWeeklyPath } from "@/utils/getWeeklyPath";
import getSortedWeekly from "@/utils/getSortedWeekly";
import { SITE } from "@/config";
import { marked } from "marked";

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

async function renderBody(post: CollectionEntry<"weekly">): Promise<string> {
  if (!post.body) return "";
  if (post.filePath?.endsWith(".mdx")) return "";
  try {
    return await marked.parse(post.body);
  } catch {
    return "";
  }
}

export async function GET() {
  const posts = await getCollection("weekly");
  const sortedPosts = getSortedWeekly(posts);
  const siteUrl = SITE.website.replace(/\/$/, "");

  const items = (
    await Promise.all(
      sortedPosts.map(async (post) => {
        const { data } = post;
        const path = getWeeklyPath(post.id, post.filePath);
        const url = `${siteUrl}${path}`;
        const pubDate = new Date(data.modDatetime ?? data.pubDatetime);
        const body = await renderBody(post);
        const content = body || data.description;

        return `
    <item>
      <title>${escapeXml(data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(data.description)}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <pubDate>${formatRssDate(pubDate)}</pubDate>
    </item>`;
      })
    )
  ).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE.title)} — 周记（独立订阅）</title>
    <description>miuo 的周刊独立 RSS 订阅源，与主站博客文章分开</description>
    <link>${escapeXml(siteUrl)}/weekly</link>
    <atom:link href="${escapeXml(siteUrl)}/weekly/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
