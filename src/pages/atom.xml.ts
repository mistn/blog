import { getCollection, type CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";
import { getWeeklyPath } from "@/utils/getWeeklyPath";
import getSortedPosts from "@/utils/getSortedPosts";
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

function formatDate(date: Date): string {
  return date.toISOString();
}

async function renderBody(post: CollectionEntry<"blog"> | CollectionEntry<"weekly">): Promise<string> {
  if (!post.body) return "";

  if (post.filePath?.endsWith(".mdx")) return "";

  try {
    return await marked.parse(post.body);
  } catch {
    return "";
  }
}

export async function GET() {
  const blogPosts = await getCollection("blog");
  const weeklyPosts = await getCollection("weekly");

  const sortedBlog = getSortedPosts(blogPosts);
  const sortedWeekly = getSortedWeekly(weeklyPosts);

  const allPosts = [...sortedBlog, ...sortedWeekly].sort(
    (a, b) =>
      new Date(b.data.pubDatetime).getTime() -
      new Date(a.data.pubDatetime).getTime()
  );

  const siteUrl = SITE.website.replace(/\/$/, "");
  const now = new Date().toISOString();

  const entries = (
    await Promise.all(
      allPosts.map(async (post) => {
        const { data } = post;
        const isWeekly = "issueNumber" in data;
        const path = isWeekly ? getWeeklyPath(post.id, post.filePath) : getPath(post.id, post.filePath);
        const url = `${siteUrl}${path}`;
        const pubDate = new Date(data.pubDatetime);
        const modDate = data.modDatetime ? new Date(data.modDatetime) : pubDate;
        const body = await renderBody(post);
        const content = escapeXml(body || data.description);

        return `
  <entry>
    <title type="text">${escapeXml(data.title)}</title>
    <link href="${escapeXml(url)}"/>
    <id>${escapeXml(url)}</id>
    <published>${formatDate(pubDate)}</published>
    <updated>${formatDate(modDate)}</updated>
    <summary type="html">${escapeXml(data.description)}</summary>
    <content type="html">${content}</content>
  </entry>`;
      })
    )
  ).join("");

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
