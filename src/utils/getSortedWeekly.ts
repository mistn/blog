import type { CollectionEntry } from "astro:content";
import postFilterWeekly from "./postFilterWeekly";

const getSortedWeekly = (posts: CollectionEntry<"weekly">[]) => {
  return posts
    .filter(postFilterWeekly)
    .sort(
      (a, b) =>
        new Date(b.data.pubDatetime).getTime() -
        new Date(a.data.pubDatetime).getTime()
    );
};

export default getSortedWeekly;
