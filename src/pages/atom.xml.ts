import { getCollection } from "astro:content";
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

function formatDate(date: Date): string {
  return date.toISOString();
}

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  const siteUrl = SITE.website.replace(/\/$/, "");
  const now = new Date().toISOString();

  const entries = sortedPosts
    .map((post) => {
      const { data } = post;
      const path = getPath(post.id, post.filePath);
      const url = `${siteUrl}${path}`;
      const pubDate = new Date(data.pubDatetime);
      const modDate = data.modDatetime ? new Date(data.modDatetime) : pubDate;

      return `
  <entry>
    <title type="text">${escapeXml(data.title)}</title>
    <link href="${escapeXml(url)}"/>
    <id>${escapeXml(url)}</id>
    <published>${formatDate(pubDate)}</published>
    <updated>${formatDate(modDate)}</updated>
    <summary type="html">${escapeXml(data.description)}</summary>
  </entry>`;
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE.title)}</title>
  <subtitle>${escapeXml(SITE.desc)}</subtitle>
  <link href="${escapeXml(siteUrl)}/atom.xml" rel="self"/>
  <link href="${escapeXml(siteUrl)}/"/>
  <updated>${now}</updated>
  <id>${escapeXml(siteUrl)}/</id>
  <author>
    <name>${escapeXml(SITE.author)}</name>
  </author>${entries}
</feed>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
