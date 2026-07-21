import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const WEEKLY_PATH = "src/data/weekly";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      // 兼容普通字符串和 Keystatic 的 slug 对象 { name, slug }
      title: z.union([
        z.string(),
        z.object({ name: z.string(), slug: z.string() }),
      ]).transform(v => (typeof v === "string" ? v : v.name)),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      wordCount: z.number().optional(),
      readingTime: z.number().optional(),
    }),
});

const weekly = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${WEEKLY_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      // 兼容普通字符串和 Keystatic 的 slug 对象 { name, slug }
      title: z.union([
        z.string(),
        z.object({ name: z.string(), slug: z.string() }),
      ]).transform(v => (typeof v === "string" ? v : v.name)),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      description: z.string(),
      issueNumber: z.number().optional(),
    }),
});

export const collections = { blog, weekly };
