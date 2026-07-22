import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

export interface Tag {
  tag: string;
  tagName: string;
  count: number;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const all = posts
    .filter(postFilter)
    .flatMap(post => post.data.tags)
    .map(tag => ({ tag: slugifyStr(tag), tagName: tag }));

  const seen = new Map<string, Tag>();

  for (const { tag, tagName } of all) {
    if (seen.has(tag)) {
      seen.get(tag)!.count++;
    } else {
      seen.set(tag, { tag, tagName, count: 1 });
    }
  }

  return [...seen.values()].sort((a, b) => a.tag.localeCompare(b.tag));
};

export default getUniqueTags;
