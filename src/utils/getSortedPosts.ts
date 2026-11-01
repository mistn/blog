import type { CollectionEntry } from "astro:content";
import type { BlogEntry } from "@/content.config";
import postFilter from "./postFilter";

const sortPosts = <T extends BlogEntry>(posts: T[]) => {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        new Date(b.data.pubDatetime).getTime() -
        new Date(a.data.pubDatetime).getTime()
    );
};

function getSortedPosts(
  posts: CollectionEntry<"blog">[]
): CollectionEntry<"blog">[];
function getSortedPosts(
  posts: CollectionEntry<"blogEn">[]
): CollectionEntry<"blogEn">[];
function getSortedPosts(posts: BlogEntry[]): BlogEntry[];
function getSortedPosts(posts: BlogEntry[]) {
  return sortPosts(posts);
}

export default getSortedPosts;
