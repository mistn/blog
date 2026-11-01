import { SITE } from "@/config";

type FilterablePost = {
  data: {
    draft?: boolean;
    pubDatetime: Date;
  };
};

const postFilter = ({ data }: FilterablePost) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMarginMs;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
