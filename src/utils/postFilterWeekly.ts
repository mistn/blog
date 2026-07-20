import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

const postFilterWeekly = ({ data }: CollectionEntry<"weekly">) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMarginMs;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilterWeekly;
